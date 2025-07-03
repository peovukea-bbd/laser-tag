'use client';

import { useState } from 'react';
import { ScanResult, QRTagType } from '@/types/game';

interface ManualQRInputProps {
  onScan: (result: ScanResult) => void;
  className?: string;
}

export default function ManualQRInput({ onScan, className = '' }: ManualQRInputProps) {
  const [qrInput, setQrInput] = useState('');
  const [lastScan, setLastScan] = useState<string>('');

  const handleManualScan = () => {
    if (!qrInput.trim()) return;

    try {
      // Try to parse as JSON first
      const qrData = JSON.parse(qrInput);
      
      const scanResult: ScanResult = {
        tagId: qrData.id || qrInput,
        tagType: qrData.type || QRTagType.PLAYER,
        data: qrData,
        timestamp: new Date()
      };

      onScan(scanResult);
      setLastScan(qrInput);
      setQrInput('');
      
      // Provide haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
      
    } catch (e) {
      // If not JSON, treat as simple tag
      const scanResult: ScanResult = {
        tagId: qrInput,
        tagType: QRTagType.PLAYER,
        data: { id: qrInput },
        timestamp: new Date()
      };
      onScan(scanResult);
      setLastScan(qrInput);
      setQrInput('');
    }
  };

  const quickScanButtons = [
    {
      label: 'Test Player',
      data: '{"id":"test-player","type":"player","data":{"playerId":"test-player","name":"Test Player"}}'
    },
    {
      label: 'Rifle Weapon',
      data: '{"id":"test-rifle","type":"weapon","data":{"weaponId":"rifle","name":"Assault Rifle"}}'
    },
    {
      label: 'Health Pack',
      data: '{"id":"test-health","type":"powerup","data":{"powerUpId":"health_boost","name":"Health Pack"}}'
    },
    {
      label: 'Extra Life',
      data: '{"id":"test-life","type":"life","data":{"name":"Extra Life"}}'
    }
  ];

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <h3 className="text-white font-bold mb-4">📝 Manual QR Input</h3>
      <p className="text-gray-300 text-sm mb-4">
        Since camera access requires HTTPS, you can manually input QR code data for testing:
      </p>
      
      {/* Manual input */}
      <div className="mb-4">
        <textarea
          value={qrInput}
          onChange={(e) => setQrInput(e.target.value)}
          placeholder='Paste QR code data here, e.g.: {"id":"test","type":"player","data":{"playerId":"test"}}'
          className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          rows={3}
        />
        <button
          onClick={handleManualScan}
          disabled={!qrInput.trim()}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded font-bold"
        >
          🔍 Scan This Data
        </button>
      </div>

      {/* Quick test buttons */}
      <div className="mb-4">
        <h4 className="text-white font-bold mb-2">Quick Test Scans:</h4>
        <div className="grid grid-cols-2 gap-2">
          {quickScanButtons.map((button, index) => (
            <button
              key={index}
              onClick={() => {
                setQrInput(button.data);
                setTimeout(() => handleManualScan(), 100);
              }}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-bold"
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {/* Last scan info */}
      {lastScan && (
        <div className="bg-gray-700 p-3 rounded">
          <h4 className="text-white font-bold mb-1">Last Scan:</h4>
          <p className="text-gray-300 text-sm break-all">{lastScan}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-900/50 rounded">
        <h4 className="text-blue-300 font-bold mb-1">💡 For Real QR Codes:</h4>
        <p className="text-blue-200 text-sm">
          Copy the JSON data from the qr-codes/ folder and paste it above, or use the quick test buttons.
        </p>
      </div>
    </div>
  );
}
