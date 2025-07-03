# QR Codes for Laser Tag Game

This directory contains sample QR codes for testing the laser tag game. Print these out and place them around your play area.

## Player Tags
Each player should wear these tags on their front and back:
- `player-1.json` - Player 1 tag
- `player-2.json` - Player 2 tag
- `player-3.json` - Player 3 tag
- `player-4.json` - Player 4 tag

## Weapon Tags
Place these around the play area for players to find:
- `weapon-rifle.json` - Assault Rifle
- `weapon-shotgun.json` - Shotgun
- `weapon-sniper.json` - Sniper Rifle

## Power-up Tags
Scatter these around for players to collect:
- `powerup-health.json` - Health Pack
- `powerup-speed.json` - Speed Boost
- `powerup-shield.json` - Shield

## Life Tags
Special tags that give extra lives:
- `life-1.json` - Extra Life 1
- `life-2.json` - Extra Life 2

## How to Use
1. Generate QR codes from the JSON data in each file
2. Print them out on paper or display on screens
3. Place them around your play area
4. Players scan them with their phones during the game

## QR Code Generation
You can use any QR code generator (like qr-code-generator.com) and paste the JSON content from each file.

## JSON Format
Each QR code contains JSON data in this format:
```json
{
  "id": "unique-id",
  "type": "player|weapon|powerup|life",
  "data": {
    // Type-specific data
  }
}
```
