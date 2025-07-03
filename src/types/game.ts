export interface Player {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  points: number;
  position?: { x: number; y: number };
  isAlive: boolean;
  weapons: Weapon[];
  powerUps: PowerUp[];
  team?: string;
}

export interface Weapon {
  id: string;
  name: string;
  damage: number;
  cost: number;
  ammo?: number;
  maxAmmo?: number;
  fireRate: number; // shots per second
  range: number;
  type: WeaponType;
}

export enum WeaponType {
  PISTOL = 'pistol',
  RIFLE = 'rifle',
  SHOTGUN = 'shotgun',
  SNIPER = 'sniper',
  LASER = 'laser'
}

export interface PowerUp {
  id: string;
  name: string;
  type: PowerUpType;
  duration?: number; // in seconds
  effect: any;
  cost: number;
}

export enum PowerUpType {
  HEALTH_BOOST = 'health_boost',
  SPEED_BOOST = 'speed_boost',
  DAMAGE_BOOST = 'damage_boost',
  SHIELD = 'shield',
  INVISIBILITY = 'invisibility',
  EXTRA_LIFE = 'extra_life'
}

export interface GameLobby {
  id: string;
  name: string;
  players: Player[];
  spectators: string[];
  maxPlayers: number;
  maxSpectators: number;
  gameState: GameState;
  gameMode: GameMode;
  startTime?: Date;
  endTime?: Date;
  settings: GameSettings;
}

export enum GameState {
  WAITING = 'waiting',
  STARTING = 'starting',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended'
}

export enum GameMode {
  FREE_FOR_ALL = 'free_for_all',
  TEAM_DEATHMATCH = 'team_deathmatch',
  TREASURE_HUNT = 'treasure_hunt'
}

export interface GameSettings {
  gameDuration: number; // in minutes
  respawnTime: number; // in seconds
  startingHealth: number;
  startingPoints: number;
  weaponSpawnRate: number;
  powerUpSpawnRate: number;
  boundaries?: Boundary[];
}

export interface Boundary {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameEvent {
  id: string;
  type: GameEventType;
  playerId: string;
  targetId?: string;
  timestamp: Date;
  data: any;
}

export enum GameEventType {
  PLAYER_SHOT = 'player_shot',
  PLAYER_HIT = 'player_hit',
  PLAYER_ELIMINATED = 'player_eliminated',
  PLAYER_RESPAWNED = 'player_respawned',
  WEAPON_COLLECTED = 'weapon_collected',
  POWERUP_COLLECTED = 'powerup_collected',
  WEAPON_PURCHASED = 'weapon_purchased',
  POWERUP_PURCHASED = 'powerup_purchased'
}

export interface QRTag {
  id: string;
  type: QRTagType;
  data: any;
  position?: { x: number; y: number };
  isActive: boolean;
}

export enum QRTagType {
  PLAYER = 'player',
  WEAPON = 'weapon',
  POWERUP = 'powerup',
  LIFE = 'life',
  BOUNDARY = 'boundary'
}

export interface ScanResult {
  tagId: string;
  tagType: QRTagType;
  data: any;
  timestamp: Date;
}
