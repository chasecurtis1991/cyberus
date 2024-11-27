import { NextApiRequest, NextApiResponse } from 'next';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = 'http://localhost:3000/api/spotify/callback';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const scope = 'user-read-currently-playing user-read-playback-state';
  
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: client_id!,
      scope: scope,
      redirect_uri: redirect_uri
    })
  );
} 