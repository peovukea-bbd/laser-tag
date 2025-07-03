# 🚀 Deployment Guide

## Quick Deployment (1-Hour Setup)

### Step 1: Deploy Backend Server

#### Option A: Railway (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy the `server/` directory
4. Note the deployed URL (e.g., `https://your-app.railway.app`)

#### Option B: Render
1. Go to [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `cd server && npm install`
5. Set start command: `cd server && npm start`
6. Deploy and note the URL

#### Option C: Heroku
1. Install Heroku CLI
2. Create a new Heroku app
3. Deploy the server directory
4. Note the app URL

### Step 2: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set environment variable:
   - `NEXT_PUBLIC_SOCKET_URL` = Your backend server URL from Step 1
4. Deploy

### Step 3: Test the Deployment

1. Open your Vercel URL on a mobile device
2. Join a lobby
3. Test QR code scanning with the sample codes in `qr-codes/`

## Local Testing

### Prerequisites
- Node.js 18+ installed
- Mobile device or browser with camera access

### Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd laser-tag-game

# Install dependencies
npm install

# Start the backend server
npm run server

# In a new terminal, start the frontend
npm run dev
```

### Testing on Mobile
1. Find your computer's IP address
2. Open `http://YOUR_IP:3000` on your mobile device
3. Grant camera permissions
4. Test QR code scanning

## QR Code Setup

### Generate QR Codes
1. Use any QR code generator (e.g., qr-code-generator.com)
2. Copy the JSON content from files in `qr-codes/` directory
3. Generate and print the QR codes

### Placement Strategy
- **Player Tags**: Print 2 copies per player (front and back of shirt)
- **Weapon Tags**: Place 3-5 around the play area
- **Power-up Tags**: Scatter 5-10 around the area
- **Life Tags**: Place 2-3 in hard-to-reach locations

## Production Checklist

- [ ] Backend server deployed and accessible
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] QR codes generated and printed
- [ ] Camera permissions working on mobile
- [ ] WebSocket connection established
- [ ] Game mechanics tested

## Troubleshooting

### Camera Not Working
- Ensure HTTPS is used in production
- Check camera permissions in browser
- Test on actual mobile devices

### Connection Issues
- Verify backend server is running
- Check CORS settings
- Ensure WebSocket connections are allowed

### Performance Issues
- Use production builds
- Enable compression
- Monitor server resources

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
```

### Backend (server/.env)
```
PORT=3001
NODE_ENV=production
```

## Scaling Considerations

For larger events:
- Use Redis for session storage
- Implement load balancing
- Add database for persistent game data
- Monitor server performance

## Security Notes

- QR codes contain game data only (no sensitive information)
- WebSocket connections are stateless
- No user authentication required for MVP
- Consider rate limiting for production use
