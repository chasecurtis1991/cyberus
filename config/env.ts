function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  spotify: {
    clientId: requireEnvVar('SPOTIFY_CLIENT_ID'),
    clientSecret: requireEnvVar('SPOTIFY_CLIENT_SECRET'),
    refreshToken: requireEnvVar('SPOTIFY_REFRESH_TOKEN'),
    redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/spotify/callback',
  },
} as const; 