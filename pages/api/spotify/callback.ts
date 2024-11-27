import { NextApiRequest, NextApiResponse } from 'next';

const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const REDIRECT_URI = 'http://localhost:3000/api/spotify/callback';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const code = req.query.code;
  
  if (!code || typeof code !== 'string') {
    return res.status(400).send('No code provided. Please start at /api/spotify/auth');
  }

  try {
    const basic = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(400).send(`Error: ${data.error} - ${data.error_description}`);
    }

    if (!data.refresh_token) {
      return res.status(400).send('No refresh token received from Spotify');
    }

    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Spotify Authorization Success</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 600px;
              margin: 2rem auto;
              padding: 0 1rem;
              line-height: 1.5;
            }
            code {
              background: #f0f0f0;
              padding: 0.2rem 0.4rem;
              border-radius: 0.25rem;
              font-size: 0.9em;
            }
          </style>
        </head>
        <body>
          <h1>Authorization Successful</h1>
          <p>Your refresh token:</p>
          <code>${data.refresh_token}</code>
          <p>Add this token to your <code>.env</code> file as:</p>
          <code>SPOTIFY_REFRESH_TOKEN=${data.refresh_token}</code>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Spotify Authorization Error:', error);
    res.status(500).send('An error occurred during authorization');
  }
}