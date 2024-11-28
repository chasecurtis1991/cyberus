import { NextApiRequest, NextApiResponse } from 'next';

const SPOTIFY_ENDPOINTS = {
  QUEUE: 'https://api.spotify.com/v1/me/player/queue',
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

    const response = await fetch(SPOTIFY_ENDPOINTS.QUEUE, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.status === 204 || response.status > 400) {
      return res.status(200).json({ queue: [] });
    }

    const data = await response.json();
    
    interface SpotifyArtist {
      name: string;
    }

    interface SpotifyImage {
      url: string;
      height?: number;
      width?: number;
    }

    interface SpotifyTrack {
      name: string;
      artists: SpotifyArtist[];
      album: {
        images: SpotifyImage[];
      };
      duration_ms: number;
      external_urls: {
        spotify: string;
      };
    }

    // Transform the queue data to match our needs
    const queue = data.queue.slice(0, 1).map((track: SpotifyTrack) => ({
      title: track.name,
      artist: track.artists.map((artist: SpotifyArtist) => artist.name).join(', '),
      albumImageUrl: track.album.images[2]?.url, // Using smallest image
      duration_ms: track.duration_ms,
      songUrl: track.external_urls.spotify
    }));

    return res.status(200).json({ queue });
  } catch (error) {
    console.error('Error fetching Spotify queue:', error);
    return res.status(500).json({ error: 'Error fetching queue data' });
  }
}
