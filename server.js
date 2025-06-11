require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const scope = 'user-top-read';
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}`;
  res.send(`<h1>Rhythmr</h1><a href="${authUrl}">Login with Spotify</a>`);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id,
        client_secret,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const access_token = response.data.access_token;
    res.send(`<h1>Login successful!</h1><p>Your access token is: ${access_token}</p>`);
  } catch (error) {
    console.error(error);
    res.send('Error getting access token');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});