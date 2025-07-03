'use client';

import { useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Player, GameEvent } from '@/types/game';

export default function SpectatorView() {
  const { currentLobby, socket } = useGame();
  const [recentEvents, setRecentEvents] = useState<GameEvent[]>([]);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleGameEvent = (event: GameEvent) => {
      setRecentEvents(prev => [event, ...prev.slice(0, 9)]); // Keep last 10 events
    };

    const handleLeaderboardUpdate = (players: Player[]) => {
      setLeaderboard(players.sort((a, b) => b.points - a.points));
    };

    socket.on('game_event', handleGameEvent);
    socket.on('leaderboard_update', handleLeaderboardUpdate);

    return () => {
      socket.off('game_event', handleGameEvent);
      socket.off('leaderboard_update', handleLeaderboardUpdate);
    };
  }, [socket]);

  useEffect(() => {
    if (currentLobby) {
      setLeaderboard(currentLobby.players.sort((a, b) => b.points - a.points));
    }
  }, [currentLobby]);

  if (!currentLobby) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Active Game</h2>
          <p className="text-gray-400">No game lobby to spectate</p>
        </div>
      </div>
    );
  }

  const formatEventMessage = (event: GameEvent) => {
    const player = currentLobby.players.find(p => p.id === event.playerId);
    const target = event.targetId ? currentLobby.players.find(p => p.id === event.targetId) : null;
    
    switch (event.type) {
      case 'PLAYER_SHOT':
        return `${player?.name || 'Unknown'} fired their weapon`;
      case 'PLAYER_HIT':
        return `${target?.name || 'Unknown'} was hit by ${player?.name || 'Unknown'}`;
      case 'PLAYER_ELIMINATED':
        return `💀 ${target?.name || 'Unknown'} was eliminated by ${player?.name || 'Unknown'}`;
      case 'PLAYER_RESPAWNED':
        return `🔄 ${player?.name || 'Unknown'} respawned`;
      case 'WEAPON_COLLECTED':
        return `🔫 ${player?.name || 'Unknown'} collected a ${event.data.weaponName}`;
      case 'POWERUP_COLLECTED':
        return `⚡ ${player?.name || 'Unknown'} collected a ${event.data.powerUpName}`;
      case 'WEAPON_PURCHASED':
        return `💰 ${player?.name || 'Unknown'} purchased a ${event.data.weaponName}`;
      case 'POWERUP_PURCHASED':
        return `💰 ${player?.name || 'Unknown'} purchased a ${event.data.powerUpName}`;
      default:
        return `${player?.name || 'Unknown'} performed an action`;
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'PLAYER_SHOT': return '🔫';
      case 'PLAYER_HIT': return '💥';
      case 'PLAYER_ELIMINATED': return '💀';
      case 'PLAYER_RESPAWNED': return '🔄';
      case 'WEAPON_COLLECTED': return '🎯';
      case 'POWERUP_COLLECTED': return '⚡';
      case 'WEAPON_PURCHASED': return '💰';
      case 'POWERUP_PURCHASED': return '💎';
      default: return '📝';
    }
  };

  const alivePlayers = currentLobby.players.filter(p => p.isAlive);
  const deadPlayers = currentLobby.players.filter(p => !p.isAlive);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">🎯 Spectator View</h1>
          <div className="text-right">
            <div className="text-2xl font-bold">{currentLobby.name}</div>
            <div className="text-sm text-gray-400">
              {currentLobby.players.length} players • {currentLobby.gameState.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Game stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-3 rounded">
            <div className="text-2xl font-bold text-green-400">{alivePlayers.length}</div>
            <div className="text-sm text-gray-400">Alive</div>
          </div>
          <div className="bg-gray-700 p-3 rounded">
            <div className="text-2xl font-bold text-red-400">{deadPlayers.length}</div>
            <div className="text-sm text-gray-400">Eliminated</div>
          </div>
          <div className="bg-gray-700 p-3 rounded">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.max(...currentLobby.players.map(p => p.points), 0)}
            </div>
            <div className="text-sm text-gray-400">Top Score</div>
          </div>
          <div className="bg-gray-700 p-3 rounded">
            <div className="text-2xl font-bold text-blue-400">{recentEvents.length}</div>
            <div className="text-sm text-gray-400">Recent Events</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">🏆 Leaderboard</h2>
          <div className="space-y-3">
            {leaderboard.map((player, index) => (
              <div 
                key={player.id} 
                className={`flex items-center justify-between p-3 rounded ${
                  index === 0 ? 'bg-yellow-600/20 border border-yellow-600' :
                  index === 1 ? 'bg-gray-600/20 border border-gray-600' :
                  index === 2 ? 'bg-orange-600/20 border border-orange-600' :
                  'bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-600' :
                    index === 1 ? 'bg-gray-600' :
                    index === 2 ? 'bg-orange-600' :
                    'bg-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold">{player.name}</div>
                    <div className="text-sm text-gray-400">
                      {player.isAlive ? (
                        <span className="text-green-400">Alive</span>
                      ) : (
                        <span className="text-red-400">Eliminated</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-yellow-400">{player.points} pts</div>
                  <div className="text-sm text-gray-400">
                    {player.health}/{player.maxHealth} HP
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Events Feed */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">📡 Live Events</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recentEvents.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                No recent events
              </div>
            ) : (
              recentEvents.map((event, index) => (
                <div 
                  key={`${event.id}-${index}`}
                  className="flex items-start space-x-3 p-3 bg-gray-700 rounded"
                >
                  <div className="text-xl">{getEventIcon(event.type)}</div>
                  <div className="flex-1">
                    <div className="text-sm">{formatEventMessage(event)}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Player grid */}
      <div className="mt-6 bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">👥 All Players</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentLobby.players.map((player) => (
            <div 
              key={player.id}
              className={`p-4 rounded-lg border-2 ${
                player.isAlive 
                  ? 'bg-green-900/20 border-green-600' 
                  : 'bg-red-900/20 border-red-600'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{player.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  player.isAlive ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  {player.isAlive ? 'ALIVE' : 'DEAD'}
                </span>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Health:</span>
                  <span>{player.health}/{player.maxHealth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Points:</span>
                  <span className="text-yellow-400">{player.points}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Weapon:</span>
                  <span>{player.weapons[0]?.name || 'None'}</span>
                </div>
              </div>
              
              {/* Health bar */}
              <div className="mt-2">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      player.health > 60 ? 'bg-green-500' :
                      player.health > 30 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
