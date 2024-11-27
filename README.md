# Cyberus Spotify Now Playing Overlay

A sleek, glassmorphic Spotify "Now Playing" overlay for OBS and streaming, featuring a TRON Legacy-inspired electric blue aesthetic with smooth animations.

![Spotify Now Playing Overlay](preview.png)

## Features

- 🎵 Real-time Spotify playback display
- 🌟 Glassmorphic UI with TRON-inspired design
- ⚡ Smooth, animated progress bar with electric blue pulse
- 🖼️ Album artwork with hover effects
- 🔗 Direct links to songs on Spotify
- 🎮 OBS-ready transparent background

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Language**: TypeScript
- **API**: Spotify Web API

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Spotify account
- [Spotify Developer Application](https://developer.spotify.com/dashboard) credentials

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cyberus.git
   cd cyberus
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   SPOTIFY_REFRESH_TOKEN=your_refresh_token
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### OBS Setup

1. Add a new "Browser" source in OBS
2. Set the URL to your deployed application
3. Set the width and height according to your needs
4. Enable "Shutdown source when not visible"
5. Check "Refresh browser when scene becomes active"

## Usage

The overlay will automatically update when:
- A new song starts playing
- The playback progress changes
- Playback is paused or resumed

Click either the album art or song title to open the current track in Spotify.

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspired by TRON Legacy
- Built with Next.js and Framer Motion
- Powered by Spotify Web API
