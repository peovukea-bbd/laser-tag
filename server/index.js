const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Game state
const lobbies = new Map();
const players = new Map();

// Default weapons and power-ups
const DEFAULT_WEAPONS = [
  {
    id: 'pistol',
    name: 'Pistol',
    damage: 25,
    cost: 0,
    ammo: 12,
    maxAmmo: 12,
    fireRate: 2,
    range: 10,
    type: 'pistol'
  },
  {
    id: 'rifle',
    name: 'Assault Rifle',
    damage: 35,
    cost: 100,
    ammo: 30,
    maxAmmo: 30,
    fireRate: 5,
    range: 20,
    type: 'rifle'
  },
  {
    id: 'shotgun',
    name: 'Shotgun',
    damage: 60,
    cost: 150,
    ammo: 8,
    maxAmmo: 8,
    fireRate: 1,
    range: 5,
    type: 'shotgun'
  }
];

const DEFAULT_POWERUPS = [
  {
    id: 'health_boost',
    name: 'Health Pack',
    type: 'health_boost',
    duration: 0,
    effect: { healthRestore: 50 },
    cost: 50
  },
  {
    id: 'speed_boost',
    name: 'Speed Boost',
    type: 'speed_boost',
    duration: 30,
    effect: { speedMultiplier: 1.5 },
    cost: 75
  },
  {
    id: 'extra_life',
    name: 'Extra Life',
    type: 'extra_life',
    duration: 0,
    effect: { lives: 1 },
    cost: 200
  }
];

function createLobby(name, creator) {
  const lobby = {
    id: uuidv4(),
    name,
    players: [creator],
    spectators: [],
    maxPlayers: 10,
    maxSpectators: 50,
    gameState: 'waiting',
    gameMode: 'free_for_all',
    startTime: null,
    endTime: null,
    settings: {
      gameDuration: 10, // minutes
      respawnTime: 5, // seconds
      startingHealth: 100,
      startingPoints: 100,
      weaponSpawnRate: 0.1,
      powerUpSpawnRate: 0.05
    }
  };
  
  lobbies.set(lobby.id, lobby);
  return lobby;
}

function emitGameEvent(lobbyId, event) {
  const lobby = lobbies.get(lobbyId);
  if (lobby) {
    io.to(lobbyId).emit('game_event', event);
    
    // Update leaderboard
    const sortedPlayers = lobby.players.sort((a, b) => b.points - a.points);
    io.to(lobbyId).emit('leaderboard_update', sortedPlayers);
  }
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_lobby', ({ lobbyName, player }) => {
    const lobby = createLobby(lobbyName, player);
    players.set(socket.id, { ...player, socketId: socket.id, lobbyId: lobby.id });
    
    socket.join(lobby.id);
    socket.emit('lobby_joined', lobby);
    
    console.log(`Player ${player.name} created lobby ${lobbyName}`);
  });

  socket.on('join_lobby', ({ lobbyId, player }) => {
    let lobby = lobbies.get(lobbyId);
    
    // If lobby doesn't exist, create a default one
    if (!lobby) {
      lobby = createLobby('Default Lobby', player);
      lobbyId = lobby.id;
    } else if (lobby.players.length >= lobby.maxPlayers) {
      socket.emit('error', { message: 'Lobby is full' });
      return;
    } else {
      lobby.players.push(player);
    }
    
    players.set(socket.id, { ...player, socketId: socket.id, lobbyId });
    
    socket.join(lobbyId);
    socket.emit('lobby_joined', lobby);
    socket.to(lobbyId).emit('lobby_updated', lobby);
    
    console.log(`Player ${player.name} joined lobby ${lobby.name}`);
  });

  socket.on('leave_lobby', () => {
    const player = players.get(socket.id);
    if (player && player.lobbyId) {
      const lobby = lobbies.get(player.lobbyId);
      if (lobby) {
        lobby.players = lobby.players.filter(p => p.id !== player.id);
        socket.leave(player.lobbyId);
        socket.to(player.lobbyId).emit('lobby_updated', lobby);
        
        // Remove lobby if empty
        if (lobby.players.length === 0) {
          lobbies.delete(player.lobbyId);
        }
      }
    }
    players.delete(socket.id);
  });

  socket.on('scan_tag', ({ playerId, scanResult }) => {
    const player = players.get(socket.id);
    if (!player || !player.lobbyId) return;
    
    const lobby = lobbies.get(player.lobbyId);
    if (!lobby) return;

    // Handle different tag types
    switch (scanResult.tagType) {
      case 'weapon':
        const weapon = DEFAULT_WEAPONS.find(w => w.id === scanResult.data.weaponId);
        if (weapon) {
          const playerInLobby = lobby.players.find(p => p.id === playerId);
          if (playerInLobby) {
            playerInLobby.weapons.push({ ...weapon });
            
            const event = {
              id: uuidv4(),
              type: 'WEAPON_COLLECTED',
              playerId,
              timestamp: new Date(),
              data: { weaponName: weapon.name }
            };
            emitGameEvent(player.lobbyId, event);
          }
        }
        break;
        
      case 'powerup':
        const powerUp = DEFAULT_POWERUPS.find(p => p.id === scanResult.data.powerUpId);
        if (powerUp) {
          const playerInLobby = lobby.players.find(p => p.id === playerId);
          if (playerInLobby) {
            if (powerUp.type === 'health_boost') {
              playerInLobby.health = Math.min(playerInLobby.maxHealth, playerInLobby.health + powerUp.effect.healthRestore);
            } else {
              playerInLobby.powerUps.push({ ...powerUp });
            }
            
            const event = {
              id: uuidv4(),
              type: 'POWERUP_COLLECTED',
              playerId,
              timestamp: new Date(),
              data: { powerUpName: powerUp.name }
            };
            emitGameEvent(player.lobbyId, event);
          }
        }
        break;
        
      case 'life':
        const playerInLobby = lobby.players.find(p => p.id === playerId);
        if (playerInLobby) {
          playerInLobby.points += 50; // Bonus points for finding life tag
          
          const event = {
            id: uuidv4(),
            type: 'POWERUP_COLLECTED',
            playerId,
            timestamp: new Date(),
            data: { powerUpName: 'Extra Life' }
          };
          emitGameEvent(player.lobbyId, event);
        }
        break;
    }
    
    io.to(player.lobbyId).emit('lobby_updated', lobby);
  });

  socket.on('shoot_player', ({ shooterId, targetId }) => {
    const player = players.get(socket.id);
    if (!player || !player.lobbyId) return;
    
    const lobby = lobbies.get(player.lobbyId);
    if (!lobby) return;
    
    const shooter = lobby.players.find(p => p.id === shooterId);
    const target = lobby.players.find(p => p.id === targetId);
    
    if (shooter && target && shooter.isAlive && target.isAlive) {
      const weapon = shooter.weapons[0]; // Use first weapon
      if (weapon) {
        // Apply damage
        target.health -= weapon.damage;
        shooter.points += 10; // Points for hitting
        
        // Shot event
        const shotEvent = {
          id: uuidv4(),
          type: 'PLAYER_SHOT',
          playerId: shooterId,
          targetId,
          timestamp: new Date(),
          data: { weapon: weapon.name, damage: weapon.damage }
        };
        emitGameEvent(player.lobbyId, shotEvent);
        
        // Hit event
        const hitEvent = {
          id: uuidv4(),
          type: 'PLAYER_HIT',
          playerId: shooterId,
          targetId,
          timestamp: new Date(),
          data: { damage: weapon.damage }
        };
        emitGameEvent(player.lobbyId, hitEvent);
        
        // Check if target is eliminated
        if (target.health <= 0) {
          target.isAlive = false;
          target.health = 0;
          shooter.points += 50; // Bonus for elimination
          
          const eliminationEvent = {
            id: uuidv4(),
            type: 'PLAYER_ELIMINATED',
            playerId: shooterId,
            targetId,
            timestamp: new Date(),
            data: {}
          };
          emitGameEvent(player.lobbyId, eliminationEvent);
          
          // Respawn after delay
          setTimeout(() => {
            target.isAlive = true;
            target.health = target.maxHealth;
            
            const respawnEvent = {
              id: uuidv4(),
              type: 'PLAYER_RESPAWNED',
              playerId: targetId,
              timestamp: new Date(),
              data: {}
            };
            emitGameEvent(player.lobbyId, respawnEvent);
            io.to(player.lobbyId).emit('lobby_updated', lobby);
          }, lobby.settings.respawnTime * 1000);
        }
        
        io.to(player.lobbyId).emit('lobby_updated', lobby);
      }
    }
  });

  socket.on('purchase_weapon', ({ playerId, weaponId }) => {
    const player = players.get(socket.id);
    if (!player || !player.lobbyId) return;
    
    const lobby = lobbies.get(player.lobbyId);
    if (!lobby) return;
    
    const playerInLobby = lobby.players.find(p => p.id === playerId);
    const weapon = DEFAULT_WEAPONS.find(w => w.id === weaponId);
    
    if (playerInLobby && weapon && playerInLobby.points >= weapon.cost) {
      playerInLobby.points -= weapon.cost;
      playerInLobby.weapons = [{ ...weapon }]; // Replace current weapon
      
      const event = {
        id: uuidv4(),
        type: 'WEAPON_PURCHASED',
        playerId,
        timestamp: new Date(),
        data: { weaponName: weapon.name, cost: weapon.cost }
      };
      emitGameEvent(player.lobbyId, event);
      
      io.to(player.lobbyId).emit('lobby_updated', lobby);
    }
  });

  socket.on('purchase_powerup', ({ playerId, powerUpId }) => {
    const player = players.get(socket.id);
    if (!player || !player.lobbyId) return;
    
    const lobby = lobbies.get(player.lobbyId);
    if (!lobby) return;
    
    const playerInLobby = lobby.players.find(p => p.id === playerId);
    const powerUp = DEFAULT_POWERUPS.find(p => p.id === powerUpId);
    
    if (playerInLobby && powerUp && playerInLobby.points >= powerUp.cost) {
      playerInLobby.points -= powerUp.cost;
      
      if (powerUp.type === 'health_boost') {
        playerInLobby.health = Math.min(playerInLobby.maxHealth, playerInLobby.health + powerUp.effect.healthRestore);
      } else {
        playerInLobby.powerUps.push({ ...powerUp });
      }
      
      const event = {
        id: uuidv4(),
        type: 'POWERUP_PURCHASED',
        playerId,
        timestamp: new Date(),
        data: { powerUpName: powerUp.name, cost: powerUp.cost }
      };
      emitGameEvent(player.lobbyId, event);
      
      io.to(player.lobbyId).emit('lobby_updated', lobby);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    const player = players.get(socket.id);
    if (player && player.lobbyId) {
      const lobby = lobbies.get(player.lobbyId);
      if (lobby) {
        lobby.players = lobby.players.filter(p => p.id !== player.id);
        socket.to(player.lobbyId).emit('lobby_updated', lobby);
        
        // Remove lobby if empty
        if (lobby.players.length === 0) {
          lobbies.delete(player.lobbyId);
        }
      }
    }
    players.delete(socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
