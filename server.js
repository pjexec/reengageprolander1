import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Active Campaign API Configuration (use environment variables in production)
const ACTIVE_CAMPAIGN_URL = process.env.ACTIVE_CAMPAIGN_URL || 'https://reengage22324.activehosted.com';
const ACTIVE_CAMPAIGN_API_KEY = process.env.ACTIVE_CAMPAIGN_API_KEY || '';
const ACTIVE_CAMPAIGN_LIST_ID = process.env.ACTIVE_CAMPAIGN_LIST_ID || '4';

app.use(express.json());

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
        // Step 1: Create or update the contact
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
            // If contact exists, try to sync (update)
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

            // Add to list
            await addContactToList(syncData.contact.id);

            return res.json({ success: true, contactId: syncData.contact.id });
        }

        const contactData = await contactResponse.json();

        // Step 2: Add the contact to the list
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
                status: 1, // 1 = subscribed
            },
        }),
    });

    if (!listResponse.ok) {
        const errorData = await listResponse.json();
        // Ignore "already on list" errors
        if (!errorData.message?.includes('already')) {
            console.error('Error adding contact to list:', errorData);
        }
    }
}

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
