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
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const initScanner = async () => {
      try {
        console.log('Initializing QR Scanner...');

        // Check if camera is available
        const hasCamera = await QrScanner.hasCamera();
        console.log('Camera available:', hasCamera);
        setHasCamera(hasCamera);

        if (!hasCamera) {
          console.error('No camera found on this device');
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
      console.log('Starting camera...');
      scannerRef.current.start().then(() => {
        console.log('Camera started successfully');
        setIsScanning(true);
        setError(null);
      }).catch((err) => {
        console.error('Failed to start scanner:', err);
        setError(`Failed to start camera: ${err.message}`);
        setIsScanning(false);
      });
    } else {
      console.log('Stopping camera...');
      scannerRef.current.stop();
      setIsScanning(false);
    }
  }, [isActive, hasCamera]);

  const checkCameraSupport = () => {
    // Check if we're in a secure context (HTTPS or localhost)
    const isSecureContext = window.isSecureContext ||
                           location.protocol === 'https:' ||
                           location.hostname === 'localhost' ||
                           location.hostname === '127.0.0.1';

    // Check if mediaDevices API is available
    const hasMediaDevices = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

    return { isSecureContext, hasMediaDevices };
  };

  const requestCameraPermission = async () => {
    try {
      console.log('Requesting camera permission...');
      setPermissionRequested(true);

      const { isSecureContext, hasMediaDevices } = checkCameraSupport();

      if (!isSecureContext) {
        throw new Error('Camera access requires HTTPS or localhost. Current protocol: ' + location.protocol);
      }

      if (!hasMediaDevices) {
        throw new Error('Camera API not supported on this browser/device');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment' // Try to use back camera
        }
      });

      console.log('Camera permission granted');

      // Stop the stream immediately, we just wanted permission
      stream.getTracks().forEach(track => track.stop());

      // Reinitialize scanner
      if (videoRef.current) {
        const initScanner = async () => {
          try {
            const hasCamera = await QrScanner.hasCamera();
            setHasCamera(hasCamera);
            setError(null);
          } catch (err) {
            console.error('Failed to reinitialize scanner:', err);
            setError('Failed to access camera');
          }
        };
        initScanner();
      }
    } catch (err) {
      console.error('Camera permission denied:', err);
      const { isSecureContext, hasMediaDevices } = checkCameraSupport();

      let errorMessage = 'Camera access failed: ';
      if (!isSecureContext) {
        errorMessage += 'HTTPS required for camera access on mobile devices';
      } else if (!hasMediaDevices) {
        errorMessage += 'Camera API not supported on this browser';
      } else {
        errorMessage += err.message || 'Permission denied';
      }

      setError(errorMessage);
    }
  };

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

  if (!hasCamera && !permissionRequested) {
    return (
      <div className={`flex items-center justify-center bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded ${className}`}>
        <div className="text-center">
          <p className="font-bold">Camera Access Needed</p>
          <p className="text-sm mb-3">Grant camera permission to scan QR codes</p>
          <button
            onClick={requestCameraPermission}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold"
          >
            📷 Enable Camera
          </button>
        </div>
      </div>
    );
  }

  if (!hasCamera) {
    return (
      <div className={`flex items-center justify-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded ${className}`}>
        <div className="text-center">
          <p className="font-bold">No Camera Available</p>
          <p className="text-sm">This device doesn't have a camera or permission was denied</p>
          <button
            onClick={requestCameraPermission}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold mt-2"
          >
            🔄 Try Again
          </button>
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
