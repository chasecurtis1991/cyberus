import { NextApiRequest, NextApiResponse } from 'next';

const SPOTIFY_ENDPOINTS = {
  NOW_PLAYING: 'https://api.spotify.com/v1/me/player/currently-playing',
  TOKEN: 'https://accounts.spotify.com/api/token'
} as const;

const getAccessToken = async () => {
  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(SPOTIFY_ENDPOINTS.TOKEN, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN || '',
    }).toString(),
  });

  return response.json();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
  
  try {
    const { access_token } = await getAccessToken();

    const response = await fetch(SPOTIFY_ENDPOINTS.NOW_PLAYING, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.status === 204 || response.status > 400) {
      return res.status(200).json({ isPlaying: false });
    }

    const song = await response.json();
    
    if (!song?.item) {
      return res.status(200).json({ isPlaying: false });
    }

    return res.status(200).json({
      isPlaying: song.is_playing,
      title: song.item.name,
      artist: song.item.artists.map((artist: { name: string }) => artist.name).join(', '),
      albumImageUrl: song.item.album.images[0].url,
      songUrl: song.item.external_urls.spotify,
      duration_ms: song.item.duration_ms,
      progress_ms: song.progress_ms,
    });
  } catch (error) {
    console.error('Spotify API Error:', error);
    return res.status(200).json({ isPlaying: false });
  }
}