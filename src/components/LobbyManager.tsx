'use client';

import { useState } from 'react';
import { useGame } from '@/context/GameContext';

export default function LobbyManager() {
  const { joinLobby, createLobby, isConnected } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [lobbyName, setLobbyName] = useState('');
  const [lobbyId, setLobbyId] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleJoinLobby = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && lobbyId.trim()) {
      joinLobby(lobbyId.trim(), playerName.trim());
    }
  };

  const handleCreateLobby = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && lobbyName.trim()) {
      createLobby(lobbyName.trim(), playerName.trim());
    }
  };

  const handleQuickJoin = () => {
    if (playerName.trim()) {
      // Try to join a default lobby
      joinLobby('default', playerName.trim());
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Connecting...</h2>
          <p className="text-gray-400">Establishing connection to game server</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">🎯 Laser Tag</h1>
          <p className="text-gray-400">Computer Vision Treasure Hunt</p>
        </div>

        {/* Player name input */}
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your player name"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={20}
          />
        </div>

        {/* Quick join button */}
        <button
          onClick={handleQuickJoin}
          disabled={!playerName.trim()}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 px-4 rounded-lg font-bold text-lg transition-colors"
        >
          🚀 Quick Join Game
        </button>

        <div className="text-center text-gray-400">
          <span>or</span>
        </div>

        {/* Join specific lobby */}
        <form onSubmit={handleJoinLobby} className="space-y-4">
          <div>
            <label htmlFor="lobbyId" className="block text-sm font-medium mb-2">
              Lobby ID
            </label>
            <input
              type="text"
              id="lobbyId"
              value={lobbyId}
              onChange={(e) => setLobbyId(e.target.value)}
              placeholder="Enter lobby ID"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={!playerName.trim() || !lobbyId.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 px-4 rounded-lg font-bold transition-colors"
          >
            Join Specific Lobby
          </button>
        </form>

        <div className="text-center text-gray-400">
          <span>or</span>
        </div>

        {/* Create new lobby */}
        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 py-3 px-4 rounded-lg font-bold transition-colors"
          >
            Create New Lobby
          </button>
        ) : (
          <form onSubmit={handleCreateLobby} className="space-y-4">
            <div>
              <label htmlFor="lobbyName" className="block text-sm font-medium mb-2">
                Lobby Name
              </label>
              <input
                type="text"
                id="lobbyName"
                value={lobbyName}
                onChange={(e) => setLobbyName(e.target.value)}
                placeholder="Enter lobby name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={30}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 px-4 rounded-lg font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!playerName.trim() || !lobbyName.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 px-4 rounded-lg font-bold transition-colors"
              >
                Create
              </button>
            </div>
          </form>
        )}

        {/* Instructions */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="font-bold mb-2">How to Play:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Use your phone camera to scan QR codes</li>
            <li>• Scan player tags to shoot them</li>
            <li>• Find weapon and power-up tags around the area</li>
            <li>• Earn points by eliminating opponents</li>
            <li>• Use points to buy better weapons and power-ups</li>
          </ul>
        </div>

        {/* Connection status */}
        <div className="text-center text-sm">
          <span className="inline-flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Connected to server
          </span>
        </div>
      </div>
    </div>
  );
}
