# 🎯 Laser Tag Treasure Hunt

A Computer Vision-based Laser Tag game using QR codes, built with Next.js and Socket.IO.

## 🎮 Game Features

- **Computer Vision**: Use your phone camera to scan QR codes
- **Real-time Multiplayer**: Multiple players can join lobbies and play together
- **Weapon System**: Collect and purchase different weapons (Pistol, Rifle, Shotgun)
- **Power-ups**: Find health packs, speed boosts, and extra lives
- **Points System**: Earn points by eliminating opponents and collecting items
- **Spectator Mode**: Watch games in real-time with live stats and events
- **Mobile-First**: Optimized for iOS and Android devices

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm run server
```

### 3. Start the Client (in a new terminal)
```bash
npm run dev
```

### 4. Open the Game
Visit [http://localhost:3000](http://localhost:3000) on your mobile device

## 📱 How to Play

1. **Join a Lobby**: Enter your name and join a game lobby
2. **Scan QR Codes**: Use your camera to scan different types of tags:
   - **Player Tags**: Scan other players to shoot them
   - **Weapon Tags**: Collect better weapons
   - **Power-up Tags**: Get health boosts and special abilities
   - **Life Tags**: Earn extra lives and bonus points
3. **Earn Points**: Get points for hits, eliminations, and collecting items
4. **Buy Upgrades**: Use points to purchase better weapons and power-ups
5. **Survive**: Avoid getting eliminated and be the last player standing!

## 🏷️ QR Code Setup

1. Navigate to the `qr-codes/` directory
2. Generate QR codes from the JSON files using any QR code generator
3. Print them out or display on screens
4. Place them around your play area:
   - Player tags on players' shirts (front and back)
   - Weapon and power-up tags scattered around the area
   - Life tags in hard-to-reach places

## 🛠️ Technical Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO
- **Computer Vision**: QR Scanner library
- **Real-time Communication**: WebSockets
- **Deployment**: Vercel (frontend), any Node.js hosting (backend)

## 🌐 Deployment

### Deploy Frontend to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Deploy Backend
1. Deploy the `server/` directory to any Node.js hosting service
2. Update the `NEXT_PUBLIC_SOCKET_URL` environment variable in your frontend

## 📋 Environment Variables

Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

For production, update this to your deployed server URL.

## 🎯 Game Modes

- **Free for All**: Every player for themselves
- **Team Deathmatch**: Team-based combat (coming soon)
- **Treasure Hunt**: Find hidden items around the map

## 📊 Spectator Features

- Real-time leaderboard
- Live event feed
- Player health and status
- Game statistics

## 🔧 Development

### Project Structure
```
laser-tag-game/
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   ├── context/       # Game state management
│   └── types/         # TypeScript definitions
├── server/            # Socket.IO server
├── qr-codes/          # Sample QR code data
└── public/            # Static assets
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run server` - Start Socket.IO server in development
- `npm run lint` - Run ESLint

## 🎮 Controls

- **Tap to Scan**: Point camera at QR codes to interact
- **Shop Button**: Purchase weapons and power-ups
- **View Toggle**: Switch between Player and Spectator views

## 🔊 Audio & Haptics

- Vibration feedback when scanning, shooting, and getting hit
- Audio beeps for successful scans
- Visual feedback for all game events

## 🐛 Troubleshooting

### Camera Issues
- Ensure camera permissions are granted
- Use HTTPS in production for camera access
- Test on actual mobile devices (camera may not work in desktop browsers)

### Connection Issues
- Check that the server is running on port 3001
- Verify the Socket.IO server URL is correct
- Ensure both client and server are on the same network for local testing

## 📄 License

This project is open source and available under the MIT License.
