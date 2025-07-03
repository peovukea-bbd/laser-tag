'use client';

import { useState } from 'react';
import { GameProvider, useGame } from '@/context/GameContext';
import LobbyManager from '@/components/LobbyManager';
import PlayerInterface from '@/components/PlayerInterface';
import SpectatorView from '@/components/SpectatorView';

function GameApp() {
  const { currentLobby, currentPlayer } = useGame();
  const [viewMode, setViewMode] = useState<'player' | 'spectator'>('player');

  // If not in a lobby, show lobby manager
  if (!currentLobby) {
    return <LobbyManager />;
  }

  // If in a lobby, show game interface
  return (
    <div className="min-h-screen bg-gray-900">
      {/* View mode toggle */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-gray-800 rounded-lg p-2 flex space-x-2">
          <button
            onClick={() => setViewMode('player')}
            className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
              viewMode === 'player'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Player
          </button>
          <button
            onClick={() => setViewMode('spectator')}
            className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
              viewMode === 'spectator'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Spectator
          </button>
        </div>
      </div>

      {/* Render appropriate view */}
      {viewMode === 'player' ? <PlayerInterface /> : <SpectatorView />}
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}
