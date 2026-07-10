// v2.2 — AI Chat Assistant
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import Anthropic from '@anthropic-ai/sdk';

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

// Anthropic Claude Configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
let anthropic = null;
if (ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    console.log('Anthropic Claude initialized for chat assistant');
} else {
    console.log('ANTHROPIC_API_KEY not set — AI chat assistant disabled');
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
ReEngage Pro is a safety-first re-engagement platform for email senders. It takes the dormant subscribers sitting in your ESP — the ones who stopped opening — and safely brings them back to active engagement without risking your sender reputation.

## The Problem
Half of most email lists is dormant, and those subscribers aren't just dead weight — they quietly hurt the half that still buys. Mailbox providers like Gmail use engagement to decide inbox placement, so every send that lands on a non-opener drags your reputation down and your real buyers start missing your campaigns. Your ESP charges the same for a subscriber who hasn't opened in a year as for one who opened this morning. And your dashboard hides the problem: phantom opens from Apple Mail Privacy, Gmail and Yahoo scanners inflate your open rates, so you don't see the damage until revenue slides.

## What It Does (outcomes only)
- Connects to your ESP and reads real engagement signals to find who is genuinely dormant versus active.
- Re-engages dormant subscribers gradually — one subscriber at a time, through your existing ESP, inside your chosen sending window.
- Sends are throttled and paced carefully, and the platform watches your bounce rate, complaint rate, and domain reputation across every major mailbox provider on every single send.
- If anything approaches a risk threshold, sending pauses automatically before damage happens. You can set your own thresholds and pause or stop manually at any time.
- Nothing is ever deleted. Non-responders stay in your ESP — your subscribers, your call.
- You review and approve every email before it sends. You can also use your own copy.
- Every send, pause, and safety event is recorded in an immutable audit trail.

The reputation protection and send-pacing are built on proprietary, patent-pending original inventions. Describe what they achieve, never how they work internally, and never quantify the inventions or patents.

## Pricing
There are two self-serve plans, both including the full platform (no features gated), with flat monthly pricing, no long-term contracts, cancel anytime, and a 7-day free trial that needs no credit card:
- Pro — $147/month: up to 50,000 subscribers, 2 ESP connections, live safety monitoring, full activity audit trail.
- Concierge — $347/month (most popular): unlimited subscribers, 4 ESP connections, everything in Pro plus dedicated onboarding, custom safety thresholds, and priority support.
For agencies and large senders there is also a custom Agency option (unlimited subscribers and ESP connections, a multi-client dashboard, white-label reports, and a dedicated account manager). Agency has no fixed self-serve price — interested teams book a call to set it up. Always describe pricing as two plans (Pro and Concierge) plus a custom Agency option; never call it "three plans."

## Supported ESPs
Klaviyo, ActiveCampaign, and Kit. Mailchimp and HubSpot are coming soon.

## AI Assistant Connection (API and MCP)
Every plan includes an AI assistant connection. You can connect Claude, ChatGPT, Gemini, or any assistant that supports MCP to your account, ask it questions in plain language, and let it run things for you.
- What a connected assistant can do: check your dashboard, campaigns, results, deliverability, and safety status; start, pause, resume, and cancel campaigns; sync connections. With a Manage-level key it can also edit, rename, and duplicate campaigns, set pacing and sending schedules, tune safety thresholds, and manage webhooks.
- You control how much it can do with three API key levels, created in the ReEngage Pro dashboard: Read (view only), Operate (day-to-day campaign control), and Manage (full account management).
- Every change an assistant requests is previewed and confirmed before it takes effect. Nothing happens without sign-off.
- Three things always stay in the dashboard, purely to protect your account and sending reputation: creating a campaign, connecting an ESP, and connecting a Postmaster account.
The assistant connection itself is NOT one of the proprietary inventions — describe its capabilities, key levels, and confirmation flow freely. The mechanism-secrecy rules still apply to the send-pacing and reputation-protection systems, including when discussing what a connected assistant can see.

## Common Questions

Q: Will this hurt my sender reputation?
A: No — protecting it is the whole point. The platform watches your reputation on every send and pauses automatically before any threshold is crossed. You can also set your own limits and stop manually whenever you want.

Q: Won't Gmail still see spam complaints?
A: Complaints still exist, but the platform paces your sends and watches your complaint rate on every send, pausing before it approaches Gmail's danger zone (around 0.3%). The goal is to keep the rate safe rather than let it spike. (Do not explain how this is achieved beyond "careful pacing and live monitoring.")

Q: How fast will I see results?
A: Re-engagement is deliberate, not instant — sends are paced slowly and carefully on purpose to protect your reputation. How long it takes depends on your list and your account, not a fixed schedule, so we don't quote a set number of weeks. You see progress in the dashboard as subscribers respond.

Q: How does it integrate with my ESP?
A: Through an encrypted connection. Your data stays in your ESP — the platform reads engagement signals and triggers sends through your existing platform.

Q: Can I customize the re-engagement emails?
A: Yes. Sequences are fully customizable, and you review and approve every email before it sends. You can also write your own copy.

Q: What happens to subscribers who don't re-engage?
A: They stay in your ESP. Nothing is ever deleted. You decide what to do with non-responders.

Q: Is this an AI product?
A: No. AI is one of several tools used to build it, not the centerpiece. ReEngage Pro puts safety first and is built to be dependable; the systems behind it are proprietary, patent-pending original inventions. Separately, every plan lets you connect your own AI assistant (Claude, ChatGPT, or Gemini) to monitor and control your account.

Q: Can I connect Claude or ChatGPT to my account?
A: Yes. Every plan includes the AI assistant connection — Claude, ChatGPT, Gemini, or any assistant that supports MCP. You choose how much it can do with a Read, Operate, or Manage key, and every change it requests is previewed and confirmed before it happens. Creating campaigns and connecting ESP or Postmaster accounts stay in the dashboard to protect your sending reputation.

## About the Founder
Chuck Mullaney — 25 years in digital marketing, 16 of them in email deliverability. Former Email Admin for 26,000 businesses, and he has navigated every major Gmail, Yahoo, and Apple deliverability shift since 2009. Author of "Phantom Engaged" (phantomengaged.com). The safety logic is built on proprietary, patent-pending original inventions.

## Why the Alternatives Fail
- Deleting dormant subscribers (sunset policies): you write off recoverable revenue. A meaningful share of dormant subscribers re-engage when approached carefully, so deleting them throws away future value.
- Blasting a win-back campaign by hand: you send to a high-risk segment with unknown bounce and spam-trap exposure, and without careful pacing and monitoring you risk spiking complaints and damaging your domain.
- Doing nothing: you keep paying your ESP for subscribers who never open while your deliverability slowly erodes.
- ReEngage Pro is the only approach that recovers subscribers safely, with reputation protection and automatic pausing built in.
`;

// AI System Prompt
const AI_SYSTEM_PROMPT = `You are the ReEngage Pro assistant on the company website. You help visitors understand the product.

Voice and style:
- Confident, direct, and knowledgeable. You sound like someone who has spent years in email deliverability.
- Short and sharp. 2-3 sentences for simple questions. 4-5 sentences max for complex ones. Never ramble.
- No filler phrases like "Totally fair", "Great question", "That's a really good point." Get to the answer immediately.
- Write in plain sentences. No markdown, no bullet points, no numbered lists, no bold text.
- Do not explain things the visitor didn't ask about. Answer what they asked, nothing more.

Accuracy rules:
- Only state facts from the knowledge base below. Never invent features, numbers, or capabilities.
- Apple Mail Privacy Protection is part of the PROBLEM (it creates phantom opens that make your dashboard unreliable). ReEngage Pro does not specifically filter or separate Apple privacy opens. Do not claim it does.
- Describe the product only in terms of outcomes and safety — never internal mechanisms. The reputation protection, send-pacing, and how complaint rates are kept safe are proprietary, patent-pending original inventions. Do NOT explain how they work, even if asked directly, asked to "go deeper," or asked "how do you actually keep complaints down."
- If pressed on mechanism, say: "The how is proprietary — it's built on patent-pending original inventions. What matters is the result: your reputation is watched on every send and protected automatically." Then redirect to the outcome.
- Never use the phrases "broadcast dilution" or "denominator," and never describe pacing sends underneath broadcast campaigns.
- When referring to the safety logic, the mechanics, or the patents, say only "proprietary, patent-pending original inventions." NEVER state a number of patents or inventions and never quantify them (no "two patents," no "a dozen inventions").
- Never quote a timeframe for re-engagement — no "X weeks," no "a few weeks." How long it takes depends on the visitor's list and account. Say it's based on their account, not a fixed schedule.
- If you don't have the answer, say: "I'd want to make sure you get the exact right answer on that. Drop your email below and our team will follow up."

Escalation:
- If someone asks to talk to a human, book a demo, or get on a call, say: "You can book a call at cal.com/chuck-mullaney-s0dslw/reengage-pro-schedule-demo, or drop your email below and we'll reach out."
- If asked, acknowledge you're an AI assistant. Don't volunteer it.

Trial:
- When it fits naturally, mention the 7-day free trial with no credit card required.

Product Knowledge:
${REENGAGE_KNOWLEDGE}`;

// Check if any admin is currently connected
function isAdminOnline() {
    const adminRoom = io.sockets.adapter.rooms.get('admins');
    return adminRoom && adminRoom.size > 0;
}

// Get AI response for a visitor message
async function getAIResponse(visitorId, messageText, chatHistory) {
    if (!anthropic) {
        console.log('AI: anthropic client is null, skipping');
        return null;
    }

    try {
        console.log(`AI: generating response for visitor ${visitorId}: "${messageText.substring(0, 50)}..."`);
        // Build conversation history for context
        const conversationMessages = [];
        const recentHistory = chatHistory.slice(-10); // Last 10 messages for context
        for (const msg of recentHistory) {
            if (msg.from === 'visitor') {
                conversationMessages.push({ role: 'user', content: msg.text });
            } else if (msg.from === 'admin' || msg.from === 'ai') {
                conversationMessages.push({ role: 'assistant', content: msg.text });
            }
        }
        // Add current message
        conversationMessages.push({ role: 'user', content: messageText });

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 300,
            system: AI_SYSTEM_PROMPT,
            messages: conversationMessages,
        });

        const text = response.content?.[0]?.text?.trim();
        if (!text) {
            console.log('AI: empty response from Claude');
            return null;
        }

        console.log(`AI: got response (${text.length} chars)`);
        return text;
    } catch (err) {
        console.error('Claude AI error:', err.message);
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

            // Route to AI — AI always responds first, human on escalation only
            const adminOnline = isAdminOnline();
            console.log(`Chat routing: adminOnline=${adminOnline}, anthropic=${!!anthropic}, handoffDone=${!!aiHandoffDone.get(visitorId)}, visitorId=${visitorId}`);

            if (anthropic && !aiHandoffDone.get(visitorId)) {
                // AI available → always route to AI assistant first
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
            } else if (!anthropic) {
                // No AI available → original off-hours behavior
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
            // After handoff, admin can respond manually via the dashboard
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

// Trial signup: create the platform account, then add to ActiveCampaign (one request does both)
const PLATFORM_REGISTER_URL = process.env.PLATFORM_REGISTER_URL || 'https://app.reengage.pro/api/auth/register';

async function addContactToActiveCampaign(firstName, email) {
    if (!ACTIVE_CAMPAIGN_API_KEY) {
        console.error('ACTIVE_CAMPAIGN_API_KEY not set — skipping AC injection');
        return;
    }
    // contact/sync = create-or-update (idempotent), then add to the trial list
    const syncResp = await fetch(`${ACTIVE_CAMPAIGN_URL}/api/3/contact/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Api-Token': ACTIVE_CAMPAIGN_API_KEY },
        body: JSON.stringify({ contact: { email, firstName } }),
    });
    if (!syncResp.ok) {
        throw new Error('AC contact sync failed: ' + (await syncResp.text()));
    }
    const data = await syncResp.json();
    const contactId = data.contact && data.contact.id;
    if (contactId) await addContactToList(contactId);
}

app.post('/api/register', async (req, res) => {
    const { firstName, lastName, email, password, referralCode, acceptedTerms, termsVersion } = req.body || {};
    if (!firstName || !email || !password) {
        return res.status(400).json({ error: 'First name, email, and password are required.' });
    }

    // 1) Create the trial account on the platform (server-to-server; public signup endpoint)
    let status, data;
    try {
        const resp = await fetch(PLATFORM_REGISTER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password, referralCode, acceptedTerms, termsVersion }),
        });
        status = resp.status;
        const text = await resp.text();
        try { data = text ? JSON.parse(text) : {}; } catch { data = { error: 'Unexpected response from registration service.' }; }
    } catch (err) {
        console.error('Platform register call failed:', err);
        return res.status(502).json({ error: 'Could not reach the registration service. Please try again.' });
    }
    // Bubble the platform's status + error JSON so the form's existing error handling works
    if (status < 200 || status >= 300) {
        return res.status(status).json(data);
    }

    // 2) Account created — inject into ActiveCampaign. Never fail the signup if AC errors.
    try {
        await addContactToActiveCampaign(firstName, email);
    } catch (acErr) {
        console.error('AC injection failed (account still created):', acErr);
    }

    return res.json({ success: true });
});

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
