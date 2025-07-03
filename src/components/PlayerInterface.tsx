'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import QRScanner from './QRScanner';
import ManualQRInput from './ManualQRInput';
import { ScanResult, QRTagType } from '@/types/game';

export default function PlayerInterface() {
  const { currentPlayer, currentLobby, handleScan, shootPlayer, purchaseWeapon, purchasePowerUp } = useGame();
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [showShop, setShowShop] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  if (!currentPlayer || !currentLobby) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Not in a game</h2>
          <p>Please join a lobby to start playing</p>
        </div>
      </div>
    );
  }

  const handleQRScan = (scanResult: ScanResult) => {
    setLastScan(scanResult);
    handleScan(scanResult);

    // Handle different tag types
    switch (scanResult.tagType) {
      case QRTagType.PLAYER:
        // Shoot the player
        if (scanResult.data.playerId && scanResult.data.playerId !== currentPlayer.id) {
          shootPlayer(scanResult.data.playerId);
        }
        break;
      case QRTagType.WEAPON:
        // Collect weapon (handled by server)
        break;
      case QRTagType.POWERUP:
        // Collect power-up (handled by server)
        break;
      case QRTagType.LIFE:
        // Collect extra life (handled by server)
        break;
    }
  };

  const healthPercentage = (currentPlayer.health / currentPlayer.maxHealth) * 100;
  const healthColor = healthPercentage > 60 ? 'bg-green-500' : healthPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header with player stats */}
      <div className="bg-gray-800 p-4 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold">{currentPlayer.name}</h1>
          <div className="text-right">
            <div className="text-yellow-400 font-bold">💰 {currentPlayer.points}</div>
            <div className="text-sm text-gray-400">Points</div>
          </div>
        </div>
        
        {/* Health bar */}
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Health</span>
            <span>{currentPlayer.health}/{currentPlayer.maxHealth}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${healthColor}`}
              style={{ width: `${healthPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Current weapon */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-400">Weapon: </span>
            <span className="font-bold">{currentPlayer.weapons[0]?.name || 'None'}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowShop(!showShop)}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
            >
              Shop
            </button>
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
            >
              Manual
            </button>
          </div>
        </div>
      </div>

      {/* Manual QR Input overlay */}
      {showManualInput && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Manual QR Input</h2>
              <button
                onClick={() => setShowManualInput(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <ManualQRInput onScan={handleQRScan} />
          </div>
        </div>
      )}

      {/* Shop overlay */}
      {showShop && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Shop</h2>
              <button
                onClick={() => setShowShop(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">Weapons</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                    <div>
                      <div className="font-bold">Assault Rifle</div>
                      <div className="text-sm text-gray-400">Damage: 35, Range: 20</div>
                    </div>
                    <button
                      onClick={() => purchaseWeapon('rifle')}
                      disabled={currentPlayer.points < 100}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-3 py-1 rounded text-sm"
                    >
                      100 pts
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                    <div>
                      <div className="font-bold">Shotgun</div>
                      <div className="text-sm text-gray-400">Damage: 60, Range: 5</div>
                    </div>
                    <button
                      onClick={() => purchaseWeapon('shotgun')}
                      disabled={currentPlayer.points < 150}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-3 py-1 rounded text-sm"
                    >
                      150 pts
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Power-ups</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                    <div>
                      <div className="font-bold">Health Pack</div>
                      <div className="text-sm text-gray-400">Restore 50 HP</div>
                    </div>
                    <button
                      onClick={() => purchasePowerUp('health_boost')}
                      disabled={currentPlayer.points < 50}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-3 py-1 rounded text-sm"
                    >
                      50 pts
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                    <div>
                      <div className="font-bold">Extra Life</div>
                      <div className="text-sm text-gray-400">Respawn instantly</div>
                    </div>
                    <button
                      onClick={() => purchasePowerUp('extra_life')}
                      disabled={currentPlayer.points < 200}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-3 py-1 rounded text-sm"
                    >
                      200 pts
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main scanner area */}
      <div className="flex-1 p-4">
        <div className="relative h-full">
          <QRScanner
            onScan={handleQRScan}
            isActive={isScannerActive && currentPlayer.isAlive}
            className="w-full h-full min-h-96"
          />
          
          {/* Scanner controls */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsScannerActive(!isScannerActive)}
                className={`px-6 py-3 rounded-full font-bold ${
                  isScannerActive 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isScannerActive ? '🔴 Stop Scanning' : '▶️ Start Scanning'}
              </button>
            </div>
          </div>

          {/* Last scan info */}
          {lastScan && (
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-black/70 text-white p-3 rounded-lg">
                <div className="text-sm">
                  <strong>Last Scan:</strong> {lastScan.tagType}
                </div>
                <div className="text-xs text-gray-300">
                  {new Date(lastScan.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}

          {/* Death overlay */}
          {!currentPlayer.isAlive && (
            <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">💀 ELIMINATED</h2>
                <p className="text-xl">Waiting for respawn...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game info footer */}
      <div className="bg-gray-800 p-4">
        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="text-gray-400">Lobby: </span>
            <span>{currentLobby.name}</span>
          </div>
          <div>
            <span className="text-gray-400">Players: </span>
            <span>{currentLobby.players.length}/{currentLobby.maxPlayers}</span>
          </div>
          <div>
            <span className="text-gray-400">State: </span>
            <span className={`font-bold ${
              currentLobby.gameState === 'active' ? 'text-green-400' : 
              currentLobby.gameState === 'waiting' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {currentLobby.gameState.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
