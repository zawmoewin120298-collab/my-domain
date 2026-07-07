import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ၁။ GitHub Login စတင်ရန် လမ်းကြောင်း 
app.get('/auth/github', (req, res) => {
    const clientID = process.env.GITHUB_ID; // Railway variable နာမည်အတိုင်း ပြောင်းထားပါတယ်
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/github`; // GitHub မှာ ပေးထားတဲ့အတိုင်း
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&scope=user:email`;
    
    res.redirect(githubAuthUrl);
});

// ၂။ GitHub ရဲ့ Callback လမ်းကြောင်း (ဆရာကြီးရဲ့ GitHub Settings နှင့် ကွက်တိ ညှိထားပါတယ်)
app.get('/api/auth/callback/github', async (req, res) => {
    const { code } = req.query;
    const clientID = process.env.GITHUB_ID;
    const clientSecret = process.env.GITHUB_SECRET;

    if (!code) {
        return res.status(400).send('Authentication code missing from GitHub.');
    }

    try {
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: clientID,
            client_secret: clientSecret,
            code: code
        }, {
            headers: { accept: 'application/json' }
        });

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            return res.status(400).send('Failed to obtain access token.');
        }

        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `token ${accessToken}` }
        });

        const userData = userResponse.data;

        // အောင်မြင်လျှင် Frontend Dashboard ထံ User Data နှင့်အတူ ပြန်ပို့မည်
        res.redirect(`/?status=success&username=${userData.login}&avatar=${userData.avatar_url}`);

    } catch (error) {
        console.error('OAuth Error:', error.response ? error.response.data : error.message);
        res.status(500).send('GitHub Authentication Failed.');
    }
});

// ၃။ Static Files Serve လုပ်ခြင်း
app.use(express.static(path.join(__dirname, 'dist')));

// ၄။ Client-side routing အတွက် Fallback လုပ်ခြင်း
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});
