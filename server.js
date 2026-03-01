import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'reengage2026';

// Active Campaign API Configuration
const ACTIVE_CAMPAIGN_URL = process.env.ACTIVE_CAMPAIGN_URL || 'https://reengage22324.activehosted.com';
const ACTIVE_CAMPAIGN_API_KEY = process.env.ACTIVE_CAMPAIGN_API_KEY || '';
const ACTIVE_CAMPAIGN_LIST_ID = process.env.ACTIVE_CAMPAIGN_LIST_ID || '4';

// Resend Email Configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const SUPPORT_EMAIL = 'support@reengage.pro';

// Business Hours Configuration (Eastern Time)
const BUSINESS_HOURS = {
    days: [1, 2, 3, 4, 5, 6], // Mon=1 through Sat=6
    startHour: 9,  // 9 AM ET
    endHour: 19,   // 7 PM ET
    timezone: 'America/New_York'
};
const UNANSWERED_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes

// In-memory storage
const visitors = new Map();
const chatSessions = new Map();
const blockedIPs = new Set();
const tickets = new Map();

app.use(express.json());

// Geolocation lookup via ip-api.com (free, no API key needed)
async function getGeolocation(ip) {
    try {
        // Skip localhost / private IPs
        if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
            return { city: 'Local', country: 'Development', countryCode: 'DEV' };
        }
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,city,country,countryCode`);
        const data = await response.json();
        if (data.status === 'success') {
            return { city: data.city, country: data.country, countryCode: data.countryCode };
        }
    } catch (err) {
        console.error('Geolocation error:', err);
    }
    return { city: 'Unknown', country: 'Unknown', countryCode: '??' };
}

// Parse user agent for device info
function parseUserAgent(ua) {
    if (!ua) return { browser: 'Unknown', os: 'Unknown', device: 'Unknown' };

    let browser = 'Unknown';
    let os = 'Unknown';
    let device = 'Desktop';

    // Browser detection
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

    // OS detection
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    // Device detection
    if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) device = 'Mobile';
    else if (ua.includes('Tablet') || ua.includes('iPad')) device = 'Tablet';

    return { browser, os, device };
}

// Get real IP from headers
function getClientIP(socket) {
    const forwarded = socket.handshake.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return socket.handshake.address;
}

// ===== TICKET SYSTEM =====

// Check if current time is within business hours
function isBusinessHours() {
    const now = new Date();
    const etTime = new Date(now.toLocaleString('en-US', { timeZone: BUSINESS_HOURS.timezone }));
    const day = etTime.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const hour = etTime.getHours();
    return BUSINESS_HOURS.days.includes(day) && hour >= BUSINESS_HOURS.startHour && hour < BUSINESS_HOURS.endHour;
}

// Create a support ticket
function createTicket(visitorId, reason) {
    const visitor = visitors.get(visitorId);
    if (!visitor) return null;

    // Don't create duplicate open tickets for the same visitor
    for (const ticket of tickets.values()) {
        if (ticket.visitorId === visitorId && ticket.status === 'open') {
            return null;
        }
    }

    const ticketId = uuidv4().substring(0, 8).toUpperCase();
    const messages = chatSessions.get(visitorId) || [];

    const ticket = {
        id: ticketId,
        visitorId,
        status: 'open',
        reason, // 'unanswered' or 'off-hours'
        createdAt: Date.now(),
        visitorInfo: {
            city: visitor.city,
            country: visitor.country,
            currentPage: visitor.currentPage,
            pageTitle: visitor.pageTitle,
            referrer: visitor.referrer,
            utmSource: visitor.utmSource,
            browser: visitor.browser,
            os: visitor.os,
            device: visitor.device,
            returning: visitor.returning,
            visitCount: visitor.visitCount,
            email: visitor.email || null
        },
        messages: [...messages]
    };

    tickets.set(ticketId, ticket);
    console.log(`Ticket ${ticketId} created: ${reason} for visitor ${visitorId}`);

    // Notify admins in real-time
    io.to('admins').emit('ticket-created', ticket);

    // Send email notification
    sendTicketEmail(ticket);

    return ticket;
}

// Send ticket notification email via Resend
async function sendTicketEmail(ticket) {
    if (!RESEND_API_KEY) {
        console.log('Resend API key not configured — skipping email notification');
        return;
    }

    const reasonLabel = ticket.reason === 'off-hours' ? '🌙 Off-Hours Message' : '🕐 Unanswered (3 min)';
    const info = ticket.visitorInfo;

    const subject = `[ReEngage] ${reasonLabel} — Ticket #${ticket.id}`;
    const htmlBody = `
        <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1C3166; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="margin: 0;">Support Ticket #${ticket.id}</h2>
                <p style="margin: 4px 0 0; opacity: 0.8;">${reasonLabel}</p>
            </div>
            <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0;">
                <h3 style="margin: 0 0 12px; color: #334155;">Visitor Info</h3>
                <table style="width: 100%; font-size: 14px; color: #475569;">
                    <tr><td style="padding: 4px 0;"><strong>Location:</strong></td><td>${info.city || 'Unknown'}, ${info.country || 'Unknown'}</td></tr>
                    <tr><td style="padding: 4px 0;"><strong>Page:</strong></td><td>${info.pageTitle || info.currentPage || '/'}</td></tr>
                    <tr><td style="padding: 4px 0;"><strong>Referrer:</strong></td><td>${info.referrer || 'Direct'}</td></tr>
                    <tr><td style="padding: 4px 0;"><strong>Device:</strong></td><td>${info.browser || '?'} / ${info.os || '?'} / ${info.device || '?'}</td></tr>
                    ${info.returning ? '<tr><td style="padding: 4px 0;"><strong>Returning:</strong></td><td>Yes (Visit #' + info.visitCount + ')</td></tr>' : ''}
                </table>
            </div>
            <div style="background: white; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
                <h3 style="margin: 0 0 12px; color: #334155;">Messages</h3>
                ${ticket.messages.map(m => {
        const time = new Date(m.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York' });
        const bgColor = m.from === 'visitor' ? '#f1f5f9' : '#1C3166';
        const textColor = m.from === 'visitor' ? '#334155' : 'white';
        const label = m.from === 'visitor' ? 'Visitor' : 'Admin';
        return `<div style="margin-bottom: 8px;"><span style="font-size: 11px; color: #94a3b8;">${label} • ${time}</span><div style="background: ${bgColor}; color: ${textColor}; padding: 10px 14px; border-radius: 10px; margin-top: 4px; font-size: 14px;">${m.text}</div></div>`;
    }).join('')}
            </div>
            <p style="text-align: center; margin-top: 16px; font-size: 12px; color: #94a3b8;">
                <a href="https://reengage.pro/admin?key=${ADMIN_PASSWORD}" style="color: #1C3166;">Open Admin Dashboard</a>
            </p>
        </div>
    `;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'ReEngage Pro <tickets@reengage.pro>',
                to: [SUPPORT_EMAIL],
                subject,
                html: htmlBody
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Resend email error:', err);
        } else {
            console.log(`Ticket email sent for #${ticket.id}`);
        }
    } catch (err) {
        console.error('Failed to send ticket email:', err);
    }
}

// Send confirmation email to the visitor
async function sendVisitorConfirmationEmail(visitorEmail, visitorId) {
    if (!RESEND_API_KEY) {
        console.log('Resend API key not configured — skipping visitor confirmation email');
        return;
    }

    const visitor = visitors.get(visitorId);
    const messages = chatSessions.get(visitorId) || [];
    const visitorMessages = messages.filter(m => m.from === 'visitor');

    const htmlBody = `
        <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1C3166; color: white; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
                <h2 style="margin: 0;">We received your message!</h2>
                <p style="margin: 8px 0 0; opacity: 0.8;">Our team will get back to you shortly.</p>
            </div>
            <div style="background: white; padding: 24px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 16px; color: #334155; font-size: 14px;">Hi there! Thanks for reaching out to ReEngage Pro. We've received your message and a member of our team will follow up with you soon.</p>
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 3px solid #1C3166;">
                    <p style="margin: 0 0 4px; font-size: 12px; color: #94a3b8;">Your message:</p>
                    ${visitorMessages.map(m => `<p style="margin: 4px 0; color: #334155; font-size: 14px;">${m.text}</p>`).join('')}
                </div>
            </div>
            <div style="background: #f8fafc; padding: 16px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #94a3b8;">ReEngage Pro &bull; <a href="https://reengage.pro" style="color: #1C3166;">reengage.pro</a></p>
            </div>
        </div>
    `;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'ReEngage Pro <support@reengage.pro>',
                to: [visitorEmail],
                subject: 'We received your message — ReEngage Pro',
                html: htmlBody
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Visitor confirmation email error:', err);
        } else {
            console.log(`Confirmation email sent to visitor ${visitorEmail}`);
        }
    } catch (err) {
        console.error('Failed to send visitor confirmation email:', err);
    }
}

// Scanner: check for unanswered messages every 60 seconds
setInterval(() => {
    const now = Date.now();
    for (const [visitorId, visitor] of visitors.entries()) {
        const messages = chatSessions.get(visitorId);
        if (!messages || messages.length === 0) continue;

        const lastMsg = messages[messages.length - 1];
        if (lastMsg.from !== 'visitor') continue;

        // Check if unanswered for more than timeout
        if (now - lastMsg.timestamp >= UNANSWERED_TIMEOUT_MS) {
            createTicket(visitorId, 'unanswered');
        }
    }
}, 60 * 1000);

// Socket.IO connection handling
io.on('connection', async (socket) => {
    const isAdmin = socket.handshake.query.admin === 'true';
    const adminKey = socket.handshake.query.key;
    const clientIP = getClientIP(socket);

    if (isAdmin) {
        // Admin connection
        if (adminKey !== ADMIN_PASSWORD) {
            socket.emit('error', 'Invalid admin password');
            socket.disconnect();
            return;
        }

        socket.join('admins');
        console.log('Admin connected');

        // Send current visitors list to admin
        const visitorList = Array.from(visitors.values()).map(v => ({
            ...v,
            messages: chatSessions.get(v.visitorId) || []
        }));
        socket.emit('visitors-list', visitorList);

        // Send current tickets list to admin
        socket.emit('tickets-list', Array.from(tickets.values()));

        // Admin sends message to visitor
        socket.on('admin-message', ({ visitorId, message }) => {
            const messageData = {
                id: uuidv4(),
                from: 'admin',
                text: message,
                timestamp: Date.now()
            };

            // Store message
            if (!chatSessions.has(visitorId)) {
                chatSessions.set(visitorId, []);
            }
            chatSessions.get(visitorId).push(messageData);

            // Send to specific visitor
            io.to(visitorId).emit('chat-message', messageData);

            // Confirm to all admins
            io.to('admins').emit('message-sent', { visitorId, message: messageData });
        });

        // Admin typing indicator
        socket.on('admin-typing', ({ visitorId }) => {
            io.to(visitorId).emit('admin-typing');
        });

        // Block IP
        socket.on('block-ip', ({ ip }) => {
            blockedIPs.add(ip);
            // Remove visitor with this IP
            for (const [visitorId, visitor] of visitors.entries()) {
                if (visitor.ip === ip) {
                    visitors.delete(visitorId);
                    chatSessions.delete(visitorId);
                }
            }
            io.to('admins').emit('visitors-list', Array.from(visitors.values()));
            socket.emit('ip-blocked', { ip });
        });

        // Ticket management
        socket.on('update-ticket-status', ({ ticketId, status }) => {
            const ticket = tickets.get(ticketId);
            if (ticket) {
                ticket.status = status;
                ticket.updatedAt = Date.now();
                tickets.set(ticketId, ticket);
                io.to('admins').emit('ticket-updated', ticket);
            }
        });

        socket.on('resolve-ticket', ({ ticketId }) => {
            const ticket = tickets.get(ticketId);
            if (ticket) {
                ticket.status = 'resolved';
                ticket.resolvedAt = Date.now();
                tickets.set(ticketId, ticket);
                io.to('admins').emit('ticket-updated', ticket);
            }
        });

        socket.on('disconnect', () => {
            console.log('Admin disconnected');
        });

    } else {
        // Visitor connection

        // Check if IP is blocked
        if (blockedIPs.has(clientIP)) {
            socket.disconnect();
            return;
        }

        const visitorId = socket.handshake.query.visitorId || uuidv4();
        const userAgent = socket.handshake.headers['user-agent'];
        const deviceInfo = parseUserAgent(userAgent);
        const geo = await getGeolocation(clientIP);

        socket.join(visitorId);

        // Extract UTM params & screen info sent by client
        const utmSource = socket.handshake.query.utm_source || null;
        const utmCampaign = socket.handshake.query.utm_campaign || null;
        const screenWidth = socket.handshake.query.screenWidth || null;
        const screenHeight = socket.handshake.query.screenHeight || null;
        const currentPage = socket.handshake.query.page || '/';
        const pageTitle = socket.handshake.query.pageTitle || '';
        const referrer = socket.handshake.query.referrer || '';

        // Check if this is a returning visitor
        const existingVisitor = visitors.get(visitorId);
        const isReturning = !!existingVisitor;

        const visitorData = {
            visitorId,
            ip: clientIP,
            connectedAt: Date.now(),
            firstSeenAt: existingVisitor ? existingVisitor.firstSeenAt : Date.now(),
            visitCount: existingVisitor ? (existingVisitor.visitCount || 1) + 1 : 1,
            returning: isReturning,
            lastActivity: Date.now(),
            online: true,
            ...deviceInfo,
            ...geo,
            screenResolution: screenWidth && screenHeight ? `${screenWidth}x${screenHeight}` : 'Unknown',
            utmSource,
            utmCampaign,
            referrer,
            scrollDepth: 0,
            currentPage,
            pageTitle,
            pageViews: existingVisitor ? (existingVisitor.pageViews || 1) + 1 : 1,
            pagesVisited: existingVisitor
                ? [...(existingVisitor.pagesVisited || []), { path: currentPage, title: pageTitle, timestamp: Date.now() }]
                : [{ path: currentPage, title: pageTitle, timestamp: Date.now() }],
            actions: existingVisitor ? existingVisitor.actions || [] : []
        };

        visitors.set(visitorId, visitorData);

        // Initialize chat session if not exists
        if (!chatSessions.has(visitorId)) {
            chatSessions.set(visitorId, []);
        }

        // Notify admins of new visitor
        io.to('admins').emit('visitor-connected', {
            ...visitorData,
            messages: chatSessions.get(visitorId)
        });

        // Send visitor their ID and any existing messages
        socket.emit('visitor-id', visitorId);
        socket.emit('chat-history', chatSessions.get(visitorId));

        // Visitor sends message
        socket.on('visitor-message', (message) => {
            const messageData = {
                id: uuidv4(),
                from: 'visitor',
                text: message,
                timestamp: Date.now()
            };

            chatSessions.get(visitorId).push(messageData);

            // Update last activity
            const visitor = visitors.get(visitorId);
            if (visitor) {
                visitor.lastActivity = Date.now();
                visitors.set(visitorId, visitor);
            }

            // Send to admins
            io.to('admins').emit('visitor-message', { visitorId, message: messageData });

            // Echo back to visitor
            socket.emit('chat-message', messageData);

            // Off-hours: auto-create ticket and send auto-reply
            if (!isBusinessHours()) {
                const ticket = createTicket(visitorId, 'off-hours');
                if (ticket) {
                    // Send auto-reply to visitor
                    const autoReply = {
                        id: uuidv4(),
                        from: 'admin',
                        text: 'Thanks for reaching out! We\'re currently outside business hours (Mon\u2013Sat, 9am\u20137pm ET). A support ticket has been created \u2014 leave your email below and we\'ll follow up with you directly!',
                        timestamp: Date.now(),
                        auto: true
                    };
                    chatSessions.get(visitorId).push(autoReply);
                    socket.emit('chat-message', autoReply);
                    io.to('admins').emit('message-sent', { visitorId, message: autoReply });
                }
            }
        });

        // Visitor typing indicator
        socket.on('visitor-typing', () => {
            io.to('admins').emit('visitor-typing', { visitorId });
        });

        // Visitor provides their email
        socket.on('visitor-email', (email) => {
            const visitor = visitors.get(visitorId);
            if (visitor) {
                visitor.email = email;
                visitors.set(visitorId, visitor);
                console.log(`Visitor ${visitorId} provided email: ${email}`);

                // Update any open tickets for this visitor with the email
                for (const ticket of tickets.values()) {
                    if (ticket.visitorId === visitorId && ticket.status === 'open') {
                        ticket.visitorInfo.email = email;
                        io.to('admins').emit('ticket-updated', ticket);
                    }
                }

                // Notify admins of the email update
                io.to('admins').emit('visitor-activity', {
                    visitorId,
                    email
                });

                // Send confirmation email to the visitor
                sendVisitorConfirmationEmail(email, visitorId);
            }
        });

        // Visitor activity updates
        socket.on('activity-update', (data) => {
            const visitor = visitors.get(visitorId);
            if (visitor) {
                visitor.lastActivity = Date.now();
                if (data.scrollDepth !== undefined) visitor.scrollDepth = data.scrollDepth;
                if (data.action) visitor.actions.push({ action: data.action, timestamp: Date.now() });
                visitors.set(visitorId, visitor);

                io.to('admins').emit('visitor-activity', { visitorId, ...data, lastActivity: visitor.lastActivity });
            }
        });

        // Page navigation tracking
        socket.on('page-change', (data) => {
            const visitor = visitors.get(visitorId);
            if (visitor) {
                visitor.currentPage = data.page || visitor.currentPage;
                visitor.pageTitle = data.pageTitle || '';
                visitor.pageViews = (visitor.pageViews || 1) + 1;
                if (!visitor.pagesVisited) visitor.pagesVisited = [];
                visitor.pagesVisited.push({ path: data.page, title: data.pageTitle, timestamp: Date.now() });
                visitor.lastActivity = Date.now();
                visitors.set(visitorId, visitor);

                io.to('admins').emit('visitor-activity', {
                    visitorId,
                    currentPage: visitor.currentPage,
                    pageTitle: visitor.pageTitle,
                    pageViews: visitor.pageViews,
                    pagesVisited: visitor.pagesVisited,
                    lastActivity: visitor.lastActivity
                });
            }
        });

        socket.on('disconnect', () => {
            const visitor = visitors.get(visitorId);
            if (visitor) {
                visitor.online = false;
                visitor.disconnectedAt = Date.now();
                visitors.set(visitorId, visitor);
                io.to('admins').emit('visitor-disconnected', { visitorId });
            }
        });
    }
});

// API endpoint to add contacts to Active Campaign
app.post('/api/subscribe', async (req, res) => {
    const { firstName, email } = req.body;

    if (!firstName || !email) {
        return res.status(400).json({ error: 'First name and email are required' });
    }

    if (!ACTIVE_CAMPAIGN_API_KEY) {
        console.error('ACTIVE_CAMPAIGN_API_KEY environment variable is not set');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const contactResponse = await fetch(`${ACTIVE_CAMPAIGN_URL}/api/3/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': ACTIVE_CAMPAIGN_API_KEY,
            },
            body: JSON.stringify({
                contact: {
                    email: email,
                    firstName: firstName,
                },
            }),
        });

        if (!contactResponse.ok) {
            const syncResponse = await fetch(`${ACTIVE_CAMPAIGN_URL}/api/3/contact/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Token': ACTIVE_CAMPAIGN_API_KEY,
                },
                body: JSON.stringify({
                    contact: {
                        email: email,
                        firstName: firstName,
                    },
                }),
            });

            if (!syncResponse.ok) {
                const errorData = await syncResponse.json();
                console.error('Active Campaign sync error:', errorData);
                return res.status(500).json({ error: 'Failed to add contact' });
            }

            const syncData = await syncResponse.json();
            await addContactToList(syncData.contact.id);
            return res.json({ success: true, contactId: syncData.contact.id });
        }

        const contactData = await contactResponse.json();
        await addContactToList(contactData.contact.id);
        res.json({ success: true, contactId: contactData.contact.id });
    } catch (error) {
        console.error('Error adding contact to Active Campaign:', error);
        res.status(500).json({ error: 'Failed to add contact' });
    }
});

async function addContactToList(contactId) {
    const listResponse = await fetch(`${ACTIVE_CAMPAIGN_URL}/api/3/contactLists`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Api-Token': ACTIVE_CAMPAIGN_API_KEY,
        },
        body: JSON.stringify({
            contactList: {
                list: ACTIVE_CAMPAIGN_LIST_ID,
                contact: contactId,
                status: 1,
            },
        }),
    });

    if (!listResponse.ok) {
        const errorData = await listResponse.json();
        if (!errorData.message?.includes('already')) {
            console.error('Error adding contact to list:', errorData);
        }
    }
}

// Admin page route
app.get('/admin', (req, res) => {
    if (req.query.key !== ADMIN_PASSWORD) {
        return res.status(401).send('Unauthorized. Please provide the correct key parameter.');
    }
    res.sendFile(path.join(__dirname, 'dist', 'admin.html'));
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Admin dashboard: http://localhost:${PORT}/admin?key=${ADMIN_PASSWORD}`);
});
