'use client';

import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { QRTag, QRTagType, ScanResult } from '@/types/game';

interface QRScannerProps {
  onScan: (result: ScanResult) => void;
  isActive: boolean;
  className?: string;
}

export default function QRScanner({ onScan, isActive, className = '' }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const initScanner = async () => {
      try {
        // Check if camera is available
        const hasCamera = await QrScanner.hasCamera();
        setHasCamera(hasCamera);

        if (!hasCamera) {
          setError('No camera found on this device');
          return;
        }

        // Create scanner instance
        const scanner = new QrScanner(
          videoRef.current!,
          (result) => {
            try {
              // Parse the QR code data
              const qrData = JSON.parse(result.data);
              
              const scanResult: ScanResult = {
                tagId: qrData.id || result.data,
                tagType: qrData.type || QRTagType.PLAYER,
                data: qrData,
                timestamp: new Date()
              };

              onScan(scanResult);
              
              // Provide haptic feedback
              if (navigator.vibrate) {
                navigator.vibrate(100);
              }
              
              // Play scan sound
              playBeepSound();
              
            } catch (e) {
              // If not JSON, treat as simple tag
              const scanResult: ScanResult = {
                tagId: result.data,
                tagType: QRTagType.PLAYER,
                data: { id: result.data },
                timestamp: new Date()
              };
              onScan(scanResult);
            }
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment', // Use back camera on mobile
            maxScansPerSecond: 5,
          }
        );

        scannerRef.current = scanner;
        setError(null);
      } catch (err) {
        console.error('Failed to initialize QR scanner:', err);
        setError('Failed to initialize camera');
      }
    };

    initScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [onScan]);

  useEffect(() => {
    if (!scannerRef.current) return;

    if (isActive && hasCamera) {
      scannerRef.current.start().then(() => {
        setIsScanning(true);
        setError(null);
      }).catch((err) => {
        console.error('Failed to start scanner:', err);
        setError('Failed to start camera');
        setIsScanning(false);
      });
    } else {
      scannerRef.current.stop();
      setIsScanning(false);
    }
  }, [isActive, hasCamera]);

  const playBeepSound = () => {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.warn('Could not play beep sound:', e);
    }
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded ${className}`}>
        <div className="text-center">
          <p className="font-bold">Camera Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!hasCamera) {
    return (
      <div className={`flex items-center justify-center bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded ${className}`}>
        <div className="text-center">
          <p className="font-bold">No Camera</p>
          <p className="text-sm">This device doesn't have a camera</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
        playsInline
        muted
      />
      
      {isScanning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="border-2 border-green-500 bg-green-500/20 rounded-lg p-4">
            <div className="w-48 h-48 border-2 border-green-500 border-dashed rounded-lg flex items-center justify-center">
              <span className="text-green-500 font-bold text-sm">Scan QR Code</span>
            </div>
          </div>
        </div>
      )}
      
      {!isActive && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <span className="text-white font-bold">Scanner Inactive</span>
        </div>
      )}
    </div>
  );
}
