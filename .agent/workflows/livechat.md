---
description: Add live chat support widget and admin dashboard with real-time analytics to an existing landing page
---

# Add Admin Dashboard & Live Chat System

This workflow adds a complete live chat support system with an admin dashboard to an existing landing page. It automatically matches the existing color scheme.

## Prerequisites

- An existing landing page (HTML file) in the project
- Node.js project with `package.json`

## What This Adds

### 1. Live Chat Widget (visitor-facing)
- Floating chat button (bottom-right corner)
- Real-time messaging with admin
- Typing indicators
- Unread message badges
- Mobile-responsive design

### 2. Admin Dashboard
- Real-time visitor list with online/offline status
- Visitor analytics panel showing:
  - 📍 Geolocation (city, country via ip-api.com)
  - 🎯 UTM source/campaign tracking
  - ⏱️ Time on site
  - 📊 Scroll depth
  - 📱 Device/browser detection
  - 💻 Operating system
  - 🖥️ Screen resolution
- Live chat with visitors
- Overview stat cards (Currently Online / Total Visitors)
- Block My IP button (hide yourself from analytics)
- Notification sounds for new messages
- Mobile-responsive with hamburger menu

### 3. Server Features
- Express.js + Socket.IO for real-time communication
- Password-protected admin access
- In-memory visitor/chat session storage
- IP geolocation via ip-api.com (free, no API key)

## Implementation Steps

### Step 1: Install Dependencies
```bash
npm install express socket.io uuid
```

### Step 2: Analyze Existing Color Scheme
Look at the existing landing page CSS and extract:
- Primary color (main brand color)
- Accent color (secondary/highlight)
- Background colors (dark/light)
- Text colors

### Step 3: Create Server File (`server.js`)
Create an Express server with:
- Static file serving for `public/` directory
- Socket.IO for real-time communication
- Admin password protection (via query param `?key=PASSWORD`)
- Visitor tracking with enhanced analytics
- Geolocation lookup function
- User agent parsing function
- Blocked IPs set for admin hiding

### Step 4: Create Chat Widget (`public/js/chat-widget.js`)
A self-contained JavaScript file that:
- Injects its own CSS styles
- Creates the chat UI dynamically
- Connects to Socket.IO
- Tracks visitor actions (scroll, clicks, page visibility)
- Captures UTM parameters from URL
- Sends device/screen info to server

### Step 5: Create Admin Dashboard (`public/admin.html`)
A full-page admin interface with:
- Sidebar with visitor list and stats
- Main content area with analytics panel
- Chat panel for messaging
- Overview cards when no visitor selected
- Block My IP functionality
- Mobile-responsive layout

### Step 6: Update Landing Page
Add to the landing page HTML (before `</body>`):
```html
<script src="/socket.io/socket.io.js"></script>
<script src="/js/chat-widget.js"></script>
```

### Step 7: Update package.json
Add start script:
```json
"scripts": {
  "start": "node server.js"
}
```

## Color Scheme Integration

Extract colors from the existing landing page and apply to:
- Chat widget button gradient
- Chat window header
- Message bubbles
- Admin dashboard CSS variables:
  - `--primary`
  - `--accent`
  - `--bg-dark`
  - `--bg-darker`
  - `--bg-card`

## Admin Access

The admin key is set via the `ADMIN_PASSWORD` environment variable. There is no default
value and no fallback. If the variable is unset, admin access is disabled entirely.

Access at: `https://your-domain.com/admin?key=YOUR_PASSWORD`

Never commit the value to this repository. It is public.

## UTM Tracking

Tag your links to track traffic sources:
```
https://yoursite.com?utm_source=cold_email&utm_campaign=january
https://yoursite.com?utm_source=linkedin
https://yoursite.com?utm_source=friend_name
```

## Deployment

Works with any Node.js hosting:
- Railway: `railway up`
- Render, Vercel, Heroku, etc.

Set `PORT` environment variable if needed (defaults to 3000).
