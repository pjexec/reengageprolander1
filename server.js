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

// In-memory storage
const visitors = new Map();
const chatSessions = new Map();
const blockedIPs = new Set();

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
        });

        // Visitor typing indicator
        socket.on('visitor-typing', () => {
            io.to('admins').emit('visitor-typing', { visitorId });
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
