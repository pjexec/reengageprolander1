// v2.2 — AI Chat Assistant
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenAI } from '@google/genai';

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

// Gemini AI Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
let genai = null;
if (GEMINI_API_KEY) {
    genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    console.log('Gemini AI initialized for chat assistant');
} else {
    console.log('GEMINI_API_KEY not set — AI chat assistant disabled');
}

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
const aiExchangeCounts = new Map(); // visitorId -> number of AI exchanges
const aiHandoffDone = new Map(); // visitorId -> true if already handed off to human

// ===== AI KNOWLEDGE BASE =====
const REENGAGE_KNOWLEDGE = `
ReEngage Pro is a safety-first email re-engagement platform. It reconnects dormant email subscribers back to active engagement — without risking sender reputation.

## The Problem
Subscribers who stop opening emails don't just sit there. Mailbox providers (Gmail, Yahoo, Microsoft, Apple) watch engagement rates. A list with too many non-openers gets quietly demoted — so even your best buyers start seeing fewer campaigns. Meanwhile, ESPs charge per contact per month regardless of engagement. Phantom opens from Apple Mail Privacy Protection and security scanners make it impossible to tell real opens from fake ones on your dashboard.

## How ReEngage Pro Works
1. CLASSIFY: Connect your ESP. ReEngage Pro reads engagement signals (opens, clicks, purchases, site visits) and classifies every subscriber into engagement tiers — from highly active to deeply dormant. It filters out phantom opens so you see real engagement.
2. RE-ENGAGE: The platform generates personalized re-engagement sequences for each dormant tier. Sends are paced slowly and deliberately through your existing ESP. Each batch rides underneath your regular broadcast sends, using a technique called broadcast dilution — your high-engagement broadcast absorbs the small dormant batch so complaint percentages stay negligible.
3. PROTECT: Real-time safety monitoring watches bounce rates, complaint rates, and domain health across all major mailbox providers. If any metric approaches a risk threshold, sending pauses automatically before damage happens. You get an immutable audit log of every action.

## Safety & Reputation Protection
- 98+ sender reputation score maintained
- Auto-pause on threshold breach — stops before damage happens
- Real-time monitoring across Gmail, Yahoo, Microsoft, and Apple
- Immutable audit log of every action
- Manual override always available — start, stop, or adjust thresholds anytime
- Safety logic is conservative by design — it pauses before you'd think to check

## Pricing
All plans include the full platform from day one. Classification, pacing, safety monitoring, broadcast dilution, and the activity log all come standard. Flat monthly pricing. No long-term contracts. Cancel anytime. 7-day free trial, no credit card required.

- **Pro — $147/month**: Up to 50,000 subscribers, 2 ESP connections, customized sequences, real-time safety monitoring, full activity audit trail
- **Concierge — $347/month** (Most Popular): Unlimited subscribers, 4 ESP connections, everything in Pro, dedicated onboarding specialist, custom safety thresholds, priority support
- **Agency — Custom pricing**: Unlimited subscribers, unlimited ESP connections, everything in Concierge, multi-client dashboard, white-label reports, dedicated account manager. Contact us to book a call.

## Supported ESPs
Currently: Klaviyo, ActiveCampaign, and Kit. Coming soon: Mailchimp and HubSpot.

## FAQ
Q: Will re-engagement campaigns hurt my sender reputation?
A: That's the entire reason this platform exists. The safety system monitors bounce rates, complaint rates, and domain health in real time. If any metric approaches a risk threshold, sending pauses automatically. You can also set your own thresholds and pause or stop campaigns manually at any time.

Q: Doesn't Gmail still see those spam complaints?
A: Yes. The complaints still exist and Gmail's internal reputation model is still aware of them. But the metric that triggers downgrades is the complaint percentage, not the count. Gmail's Postmaster Tools threshold is 0.3%. When your re-engagement sends ride underneath a high-volume broadcast, the same complaints land inside a large denominator and read well under the line. We don't make complaints disappear. We make the percentage stop mattering.

Q: Does my broadcast frequency matter?
A: The system adapts to your cadence whether that's weekly, biweekly, or monthly. You don't configure anything. It works around your existing send pattern automatically.

Q: How quickly will I see results?
A: Re-engagement isn't instant. The system sends slowly and carefully on purpose. Most campaigns run over 2-4 weeks depending on list size. You'll see real-time progress in the dashboard as subscribers respond.

Q: How does ReEngage Pro integrate with my email platform?
A: You connect your ESP account through our encrypted integration. Your data stays in your ESP. We read engagement data and trigger sends through your existing platform.

Q: Can I customize the re-engagement sequences?
A: Yes. The platform generates personalized email content based on subscriber history and behavior patterns, but you review and approve everything before it sends. You can also write your own copy and use the platform purely for its throttle engine and safety monitoring. Every setting is adjustable. The defaults are conservative on purpose — tuned so that if you connect and don't touch a single setting, your account is protected.

Q: Is ReEngage Pro an AI platform?
A: No. AI is one of several tools used to build it, not the centerpiece. ReEngage Pro is a safety-first mechanical platform built to be dependable. AI is used where it fits. The reputation protection happens in the mechanics.

Q: What happens to subscribers who don't re-engage?
A: They stay in your ESP. ReEngage Pro classifies them but never deletes subscriber data. You decide what to do with subscribers who don't respond to re-engagement. We give you the information to make that call.

## About the Founder
Chuck Mullaney — 25 years in digital marketing, 15 solving email deliverability. Former Email Admin for 26,000 businesses. Author of "Phantom Engaged" (phantomengaged.com). 5 patents pending on the safety logic.

## Key Differentiators vs Alternatives
- Manual sunset policies just delete revenue (20-30% of dormant subscribers will re-engage if approached correctly)
- Generic win-back sequences blast full list and damage reputation
- Doing nothing means paying ESP monthly fees while deliverability erodes
- ReEngage Pro is the only approach that recovers subscribers safely with real-time reputation protection
`;

// AI System Prompt
const AI_SYSTEM_PROMPT = `You are the ReEngage Pro sales assistant on the company website. You help visitors understand the product and answer their questions.

Rules:
1. Be helpful, confident, and direct. Match a professional but approachable tone.
2. Keep responses concise — 2-3 sentences max unless the question requires more detail.
3. Only answer questions using the knowledge provided below. Do not make up features, pricing, or capabilities that aren't listed.
4. If someone asks something you don't have information about, say: "That's a great question — I'd want to make sure you get the right answer. Would you like to leave your email so our team can follow up?"
5. If someone asks to talk to a human or asks for a demo/call, say: "Absolutely! You can book a call directly at cal.com/chuck-mullaney-s0dslw/reengage-pro-schedule-demo, or leave your email and we'll reach out."
6. Do not use markdown formatting, bullet points, or numbered lists. Write in plain conversational sentences.
7. If asked, you can acknowledge you're an AI assistant, but don't volunteer it unprompted.
8. Never discuss competitors by name. Focus on what ReEngage Pro does.
9. Encourage visitors to start the free trial when appropriate — it's 7 days, no credit card required.

Product Knowledge:
${REENGAGE_KNOWLEDGE}`;

// Check if any admin is currently connected
function isAdminOnline() {
    const adminRoom = io.sockets.adapter.rooms.get('admins');
    return adminRoom && adminRoom.size > 0;
}

// Get AI response for a visitor message
async function getAIResponse(visitorId, messageText, chatHistory) {
    if (!genai) return null;

    try {
        // Build conversation history for context
        const conversationMessages = [];
        const recentHistory = chatHistory.slice(-10); // Last 10 messages for context
        for (const msg of recentHistory) {
            if (msg.from === 'visitor') {
                conversationMessages.push({ role: 'user', parts: [{ text: msg.text }] });
            } else if (msg.from === 'admin' || msg.from === 'ai') {
                conversationMessages.push({ role: 'model', parts: [{ text: msg.text }] });
            }
        }
        // Add current message
        conversationMessages.push({ role: 'user', parts: [{ text: messageText }] });

        const response = await genai.models.generateContent({
            model: 'gemini-2.0-flash',
            config: {
                systemInstruction: AI_SYSTEM_PROMPT,
                temperature: 0.7,
                maxOutputTokens: 300,
            },
            contents: conversationMessages,
        });

        const text = response.text?.trim();
        if (!text) return null;

        return text;
    } catch (err) {
        console.error('Gemini AI error:', err.message);
        return null;
    }
}

// Check if visitor message indicates they want a human
function wantsHuman(text) {
    const lower = text.toLowerCase();
    const patterns = [
        'talk to a human', 'talk to someone', 'real person', 'human please',
        'speak to someone', 'speak with someone', 'agent please', 'live agent',
        'can i talk to', 'connect me with', 'transfer me', 'support team',
        'talk to a person', 'talk to support', 'real human'
    ];
    return patterns.some(p => lower.includes(p));
}

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
// Send admin reply email to the visitor
async function sendReplyEmailToVisitor(visitorEmail, replyText, visitorId) {
    if (!RESEND_API_KEY) {
        console.log('Resend API key not configured — skipping reply email to visitor');
        return;
    }

    const htmlBody = `
        <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1C3166; color: white; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
                <h2 style="margin: 0;">New Reply from ReEngage Pro</h2>
            </div>
            <div style="background: white; padding: 24px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 16px; color: #334155; font-size: 14px;">Our team has responded to your message:</p>
                <div style="background: #f0f4ff; padding: 16px; border-radius: 8px; border-left: 3px solid #1C3166;">
                    <p style="margin: 0; color: #334155; font-size: 15px;">${replyText}</p>
                </div>
                <p style="margin: 16px 0 0; color: #64748b; font-size: 13px;">You can continue the conversation by visiting our website and opening the chat widget.</p>
            </div>
            <div style="background: #f8fafc; padding: 16px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; text-align: center;">
                <a href="https://reengage.pro" style="color: #1C3166; font-weight: 600; text-decoration: none;">Visit ReEngage Pro</a>
                <p style="margin: 8px 0 0; font-size: 12px; color: #94a3b8;">ReEngage Pro &bull; reengage.pro</p>
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
                subject: 'Reply from ReEngage Pro',
                html: htmlBody
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Reply email to visitor error:', err);
        } else {
            console.log(`Reply email sent to visitor ${visitorEmail}`);
        }
    } catch (err) {
        console.error('Failed to send reply email to visitor:', err);
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

            // Email the reply to the visitor if we have their email
            const visitor = visitors.get(visitorId);
            if (visitor && visitor.email) {
                sendReplyEmailToVisitor(visitor.email, message, visitorId);
            }
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
        socket.on('visitor-message', async (message) => {
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

            // Auto-detect email addresses in regular messages
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const visitor2 = visitors.get(visitorId);
            if (emailRegex.test(message.trim()) && visitor2 && !visitor2.email) {
                visitor2.email = message.trim();
                visitors.set(visitorId, visitor2);
                console.log(`Auto-detected email from visitor message: ${visitor2.email}`);

                // Update any open tickets with the email
                for (const ticket of tickets.values()) {
                    if (ticket.visitorId === visitorId && ticket.status === 'open') {
                        ticket.visitorInfo.email = visitor2.email;
                        io.to('admins').emit('ticket-updated', ticket);
                    }
                }

                // Notify admins
                io.to('admins').emit('visitor-activity', { visitorId, email: visitor2.email });

                // Send confirmation email to visitor
                sendVisitorConfirmationEmail(visitor2.email, visitorId);
            }

            // Route to AI or create ticket based on admin availability
            const adminOnline = isAdminOnline();

            if (!adminOnline && genai && !aiHandoffDone.get(visitorId)) {
                // No admin online + AI available → route to AI assistant
                const exchangeCount = (aiExchangeCounts.get(visitorId) || 0) + 1;
                aiExchangeCounts.set(visitorId, exchangeCount);

                // Check if visitor wants a human
                if (wantsHuman(message)) {
                    aiHandoffDone.set(visitorId, true);
                    const handoffMsg = {
                        id: uuidv4(),
                        from: 'admin',
                        text: 'Absolutely! You can book a call directly at cal.com/chuck-mullaney-s0dslw/reengage-pro-schedule-demo, or leave your email below and we\'ll reach out to you personally.',
                        timestamp: Date.now(),
                        ai: true,
                        handoff: true
                    };
                    chatSessions.get(visitorId).push(handoffMsg);
                    socket.emit('chat-message', handoffMsg);
                    io.to('admins').emit('message-sent', { visitorId, message: handoffMsg });
                    createTicket(visitorId, 'ai-handoff');
                    return;
                }

                // After 3 AI exchanges, suggest human follow-up
                if (exchangeCount > 3) {
                    aiHandoffDone.set(visitorId, true);
                    // Still get AI response for this message
                    const chatHistory = chatSessions.get(visitorId) || [];
                    const aiText = await getAIResponse(visitorId, message, chatHistory);

                    if (aiText) {
                        // Show typing indicator
                        socket.emit('admin-typing');
                        await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

                        const aiMsg = {
                            id: uuidv4(),
                            from: 'admin',
                            text: aiText,
                            timestamp: Date.now(),
                            ai: true
                        };
                        chatSessions.get(visitorId).push(aiMsg);
                        socket.emit('chat-message', aiMsg);
                        io.to('admins').emit('message-sent', { visitorId, message: aiMsg });
                    }

                    // Follow up with handoff suggestion
                    await new Promise(r => setTimeout(r, 1200));
                    const handoffMsg = {
                        id: uuidv4(),
                        from: 'admin',
                        text: 'I want to make sure you get all the detail you need. Would you like to leave your email so our team can follow up with you directly? Or you can book a call at cal.com/chuck-mullaney-s0dslw/reengage-pro-schedule-demo.',
                        timestamp: Date.now(),
                        ai: true,
                        handoff: true
                    };
                    chatSessions.get(visitorId).push(handoffMsg);
                    socket.emit('chat-message', handoffMsg);
                    io.to('admins').emit('message-sent', { visitorId, message: handoffMsg });
                    createTicket(visitorId, 'ai-handoff');
                    return;
                }

                // Normal AI response
                const chatHistory = chatSessions.get(visitorId) || [];

                // Show typing indicator with natural delay
                socket.emit('admin-typing');
                const aiText = await getAIResponse(visitorId, message, chatHistory);
                await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

                if (aiText) {
                    const aiMsg = {
                        id: uuidv4(),
                        from: 'admin',
                        text: aiText,
                        timestamp: Date.now(),
                        ai: true
                    };
                    chatSessions.get(visitorId).push(aiMsg);
                    socket.emit('chat-message', aiMsg);
                    io.to('admins').emit('message-sent', { visitorId, message: aiMsg });
                } else {
                    // AI failed — fall back to away message
                    const fallbackMsg = {
                        id: uuidv4(),
                        from: 'admin',
                        text: 'Thanks for your message! Our team will get back to you shortly. Leave your email below and we\'ll follow up.',
                        timestamp: Date.now(),
                        auto: true
                    };
                    chatSessions.get(visitorId).push(fallbackMsg);
                    socket.emit('chat-message', fallbackMsg);
                    io.to('admins').emit('message-sent', { visitorId, message: fallbackMsg });
                    createTicket(visitorId, 'ai-failure');
                }
            } else if (!adminOnline && !genai) {
                // No admin online + no AI → original off-hours behavior
                if (!isBusinessHours()) {
                    const ticket = createTicket(visitorId, 'off-hours');
                    if (ticket) {
                        const autoReply = {
                            id: uuidv4(),
                            from: 'admin',
                            text: 'We\'re away right now. Leave your email and we\'ll follow up!',
                            timestamp: Date.now(),
                            auto: true
                        };
                        chatSessions.get(visitorId).push(autoReply);
                        socket.emit('chat-message', autoReply);
                        io.to('admins').emit('message-sent', { visitorId, message: autoReply });
                    }
                }
            }
            // If admin IS online, do nothing extra — admin handles it live
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
