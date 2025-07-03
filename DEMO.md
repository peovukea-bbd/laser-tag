# 🎯 Demo Instructions - Laser Tag Treasure Hunt

## 🚀 Quick Demo Setup (5 minutes)

### 1. Start the Application
```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the frontend
npm run dev
```

### 2. Access the Game
- **Desktop**: Open http://localhost:3000
- **Mobile**: Open http://YOUR_IP:3000 (replace YOUR_IP with your computer's IP address)

### 3. Create QR Codes for Demo
Use any QR code generator and create codes with this data:

#### Player Tags (for shooting)
```json
{"id":"demo-player-1","type":"player","data":{"playerId":"demo-player-1","name":"Demo Player"}}
```

#### Weapon Tag (for collecting)
```json
{"id":"demo-rifle","type":"weapon","data":{"weaponId":"rifle","name":"Assault Rifle"}}
```

#### Health Power-up
```json
{"id":"demo-health","type":"powerup","data":{"powerUpId":"health_boost","name":"Health Pack"}}
```

## 🎮 Demo Flow

### Step 1: Join Game
1. Enter your name (e.g., "Demo Player")
2. Click "Quick Join Game"
3. You'll see the player interface with camera view

### Step 2: Show Camera Scanning
1. Point camera at any QR code
2. Show the scanning interface with green overlay
3. Demonstrate successful scan with beep sound and vibration

### Step 3: Show Game Features
1. **Player Stats**: Health bar, points, current weapon
2. **Shop System**: Click shop button, show weapon/powerup purchases
3. **Spectator View**: Toggle to spectator mode to show leaderboard and events

### Step 4: Simulate Gameplay
1. Scan a weapon QR code → Show weapon collection
2. Scan a powerup QR code → Show health restoration
3. Use shop to purchase items with points
4. Show real-time updates in spectator view

## 🎯 Key Features to Highlight

### ✅ Computer Vision
- Real-time QR code scanning using phone camera
- Different tag types (player, weapon, powerup, life)
- Visual and haptic feedback on successful scans

### ✅ Real-time Multiplayer
- Multiple players can join the same lobby
- Live updates across all connected devices
- Real-time leaderboard and event feed

### ✅ Game Mechanics
- Health and points system
- Weapon collection and purchasing
- Power-up effects (health restoration, speed boost, etc.)
- Player elimination and respawn

### ✅ Mobile-First Design
- Responsive interface optimized for phones
- Touch-friendly controls
- Camera integration
- Vibration and audio feedback

### ✅ Spectator Mode
- Live game statistics
- Real-time event feed
- Player status monitoring
- Leaderboard updates

## 📱 Mobile Demo Tips

### Camera Access
- Grant camera permissions when prompted
- Use HTTPS for production (camera requires secure context)
- Test on actual mobile devices for best experience

### Network Setup
- Ensure all devices are on the same WiFi network
- Use your computer's IP address for mobile access
- Check firewall settings if connection fails

## 🎪 Live Demo Script

### Opening (30 seconds)
"This is a Computer Vision Laser Tag game where players use their phones to scan QR codes for combat and treasure hunting."

### Core Gameplay (2 minutes)
1. Show lobby joining and player interface
2. Demonstrate QR code scanning with different tag types
3. Show real-time updates and multiplayer features
4. Display spectator view with live statistics

### Technical Highlights (1 minute)
1. Built with Next.js and Socket.IO for real-time communication
2. Uses QR Scanner library for computer vision
3. Mobile-responsive design with haptic feedback
4. Deployed on Vercel with scalable architecture

### Closing (30 seconds)
"The game is ready for deployment and can handle multiple concurrent lobbies for large-scale events."

## 🔧 Troubleshooting

### Camera Issues
- Refresh the page and grant permissions again
- Try a different browser (Chrome/Safari work best)
- Ensure adequate lighting for QR code scanning

### Connection Issues
- Check that both servers are running
- Verify IP address is correct for mobile access
- Restart the Socket.IO server if needed

### QR Code Issues
- Ensure QR codes are clear and well-lit
- Try different QR code generators if scanning fails
- Check JSON format is correct

## 📊 Demo Metrics

### Performance
- ✅ Sub-second QR code recognition
- ✅ Real-time multiplayer updates
- ✅ Mobile-optimized interface
- ✅ Cross-platform compatibility

### Features Implemented
- ✅ Computer vision QR scanning
- ✅ Real-time multiplayer lobbies
- ✅ Player health and points system
- ✅ Weapon and powerup mechanics
- ✅ Spectator view with live stats
- ✅ Mobile-responsive design
- ✅ Audio and haptic feedback

### Ready for Production
- ✅ Vercel deployment configuration
- ✅ Environment variable setup
- ✅ Scalable server architecture
- ✅ Complete documentation
- ✅ QR code templates provided
