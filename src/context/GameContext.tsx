'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Player, 
  GameLobby, 
  GameState, 
  GameEvent, 
  ScanResult, 
  Weapon, 
  PowerUp, 
  WeaponType, 
  PowerUpType 
} from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

interface GameContextType {
  socket: Socket | null;
  currentPlayer: Player | null;
  currentLobby: GameLobby | null;
  isConnected: boolean;
  joinLobby: (lobbyId: string, playerName: string) => void;
  createLobby: (lobbyName: string, playerName: string) => void;
  leaveLobby: () => void;
  handleScan: (scanResult: ScanResult) => void;
  shootPlayer: (targetPlayerId: string) => void;
  purchaseWeapon: (weaponId: string) => void;
  purchasePowerUp: (powerUpId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameState {
  socket: Socket | null;
  currentPlayer: Player | null;
  currentLobby: GameLobby | null;
  isConnected: boolean;
}

type GameAction = 
  | { type: 'SET_SOCKET'; payload: Socket }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_PLAYER'; payload: Player }
  | { type: 'SET_LOBBY'; payload: GameLobby }
  | { type: 'UPDATE_PLAYER'; payload: Partial<Player> }
  | { type: 'UPDATE_LOBBY'; payload: Partial<GameLobby> }
  | { type: 'CLEAR_LOBBY' }
  | { type: 'CLEAR_PLAYER' };

const initialState: GameState = {
  socket: null,
  currentPlayer: null,
  currentLobby: null,
  isConnected: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SOCKET':
      return { ...state, socket: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_PLAYER':
      return { ...state, currentPlayer: action.payload };
    case 'SET_LOBBY':
      return { ...state, currentLobby: action.payload };
    case 'UPDATE_PLAYER':
      return { 
        ...state, 
        currentPlayer: state.currentPlayer ? { ...state.currentPlayer, ...action.payload } : null 
      };
    case 'UPDATE_LOBBY':
      return { 
        ...state, 
        currentLobby: state.currentLobby ? { ...state.currentLobby, ...action.payload } : null 
      };
    case 'CLEAR_LOBBY':
      return { ...state, currentLobby: null };
    case 'CLEAR_PLAYER':
      return { ...state, currentPlayer: null };
    default:
      return state;
  }
}

// Default weapons and power-ups
const DEFAULT_WEAPONS: Weapon[] = [
  {
    id: 'pistol',
    name: 'Pistol',
    damage: 25,
    cost: 0,
    ammo: 12,
    maxAmmo: 12,
    fireRate: 2,
    range: 10,
    type: WeaponType.PISTOL
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
    type: WeaponType.RIFLE
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
    type: WeaponType.SHOTGUN
  }
];

const DEFAULT_POWERUPS: PowerUp[] = [
  {
    id: 'health_boost',
    name: 'Health Pack',
    type: PowerUpType.HEALTH_BOOST,
    duration: 0,
    effect: { healthRestore: 50 },
    cost: 50
  },
  {
    id: 'speed_boost',
    name: 'Speed Boost',
    type: PowerUpType.SPEED_BOOST,
    duration: 30,
    effect: { speedMultiplier: 1.5 },
    cost: 75
  },
  {
    id: 'extra_life',
    name: 'Extra Life',
    type: PowerUpType.EXTRA_LIFE,
    duration: 0,
    effect: { lives: 1 },
    cost: 200
  }
];

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
    
    socket.on('connect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: true });
    });

    socket.on('disconnect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: false });
    });

    socket.on('lobby_joined', (lobby: GameLobby) => {
      dispatch({ type: 'SET_LOBBY', payload: lobby });
    });

    socket.on('lobby_updated', (lobby: GameLobby) => {
      dispatch({ type: 'UPDATE_LOBBY', payload: lobby });
    });

    socket.on('player_updated', (player: Player) => {
      dispatch({ type: 'UPDATE_PLAYER', payload: player });
    });

    socket.on('game_event', (event: GameEvent) => {
      handleGameEvent(event);
    });

    dispatch({ type: 'SET_SOCKET', payload: socket });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleGameEvent = (event: GameEvent) => {
    // Handle game events like shots, hits, etc.
    switch (event.type) {
      case 'PLAYER_HIT':
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
        break;
      case 'PLAYER_SHOT':
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        break;
    }
  };

  const joinLobby = (lobbyId: string, playerName: string) => {
    if (!state.socket) return;

    const player: Player = {
      id: uuidv4(),
      name: playerName,
      health: 100,
      maxHealth: 100,
      points: 100,
      isAlive: true,
      weapons: [DEFAULT_WEAPONS[0]], // Start with pistol
      powerUps: []
    };

    dispatch({ type: 'SET_PLAYER', payload: player });
    state.socket.emit('join_lobby', { lobbyId, player });
  };

  const createLobby = (lobbyName: string, playerName: string) => {
    if (!state.socket) return;

    const player: Player = {
      id: uuidv4(),
      name: playerName,
      health: 100,
      maxHealth: 100,
      points: 100,
      isAlive: true,
      weapons: [DEFAULT_WEAPONS[0]],
      powerUps: []
    };

    dispatch({ type: 'SET_PLAYER', payload: player });
    state.socket.emit('create_lobby', { lobbyName, player });
  };

  const leaveLobby = () => {
    if (!state.socket) return;
    
    state.socket.emit('leave_lobby');
    dispatch({ type: 'CLEAR_LOBBY' });
    dispatch({ type: 'CLEAR_PLAYER' });
  };

  const handleScan = (scanResult: ScanResult) => {
    if (!state.socket || !state.currentPlayer) return;

    state.socket.emit('scan_tag', {
      playerId: state.currentPlayer.id,
      scanResult
    });
  };

  const shootPlayer = (targetPlayerId: string) => {
    if (!state.socket || !state.currentPlayer) return;

    state.socket.emit('shoot_player', {
      shooterId: state.currentPlayer.id,
      targetId: targetPlayerId
    });
  };

  const purchaseWeapon = (weaponId: string) => {
    if (!state.socket || !state.currentPlayer) return;

    const weapon = DEFAULT_WEAPONS.find(w => w.id === weaponId);
    if (!weapon || state.currentPlayer.points < weapon.cost) return;

    state.socket.emit('purchase_weapon', {
      playerId: state.currentPlayer.id,
      weaponId
    });
  };

  const purchasePowerUp = (powerUpId: string) => {
    if (!state.socket || !state.currentPlayer) return;

    const powerUp = DEFAULT_POWERUPS.find(p => p.id === powerUpId);
    if (!powerUp || state.currentPlayer.points < powerUp.cost) return;

    state.socket.emit('purchase_powerup', {
      playerId: state.currentPlayer.id,
      powerUpId
    });
  };

  const value: GameContextType = {
    socket: state.socket,
    currentPlayer: state.currentPlayer,
    currentLobby: state.currentLobby,
    isConnected: state.isConnected,
    joinLobby,
    createLobby,
    leaveLobby,
    handleScan,
    shootPlayer,
    purchaseWeapon,
    purchasePowerUp,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
