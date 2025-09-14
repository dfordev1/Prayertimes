'use client';

import { useEffect, useState } from 'react';
import { Location } from '@/types/prayer';
import { calculateQiblaDirection } from '@/utils/timeUtils';

interface QiblaCompassProps {
  location: Location | null;
}

export default function QiblaCompass({ location }: QiblaCompassProps) {
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [deviceOrientation, setDeviceOrientation] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  useEffect(() => {
    if (location) {
      const direction = calculateQiblaDirection(location.latitude, location.longitude);
      setQiblaDirection(direction);
    }
  }, [location]);

  useEffect(() => {
    const requestPermission = async () => {
      if ('DeviceOrientationEvent' in window && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          setPermissionGranted(permission === 'granted');
        } catch (error) {
          console.error('Permission request failed:', error);
        }
      } else {
        setPermissionGranted(true);
      }
    };

    requestPermission();
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setDeviceOrientation(event.alpha);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [permissionGranted]);

  if (!location) {
    return (
      <div className="glass-effect dark:glass-effect-dark rounded-2xl shadow-apple p-6 border border-white/20 dark:border-white/10">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full glass-effect dark:glass-effect-dark mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🧭</span>
          </div>
          <p className="font-sf text-apple-gray-600 dark:text-apple-gray-400 text-sm">
            Location needed for Qibla direction
          </p>
        </div>
      </div>
    );
  }

  const relativeQiblaDirection = qiblaDirection - deviceOrientation;

  return (
    <div className="glass-effect dark:glass-effect-dark rounded-2xl shadow-apple p-6 border border-white/20 dark:border-white/10">
      <div className="text-center mb-4">
        <h3 className="font-sf font-semibold text-apple-gray-900 dark:text-white mb-1">
          Qibla Direction
        </h3>
        <p className="font-sf text-apple-gray-600 dark:text-apple-gray-400 text-sm">
          {qiblaDirection.toFixed(1)}° from North
        </p>
      </div>

      <div className="relative w-32 h-32 mx-auto mb-4">
        {/* Compass background */}
        <div className="absolute inset-0 rounded-full border-2 border-white/30 dark:border-white/20 bg-gradient-to-br from-white/20 to-transparent">
          {/* Cardinal directions */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-sf font-medium text-apple-gray-700 dark:text-apple-gray-300">
            N
          </div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-sf font-medium text-apple-gray-700 dark:text-apple-gray-300">
            S
          </div>
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs font-sf font-medium text-apple-gray-700 dark:text-apple-gray-300">
            E
          </div>
          <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs font-sf font-medium text-apple-gray-700 dark:text-apple-gray-300">
            W
          </div>
        </div>

        {/* Qibla arrow */}
        <div 
          className="absolute inset-4 transition-transform duration-300 ease-out"
          style={{ transform: `rotate(${relativeQiblaDirection}deg)` }}
        >
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-green-500 rounded-full origin-bottom"></div>
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-lg">🕋</div>
          </div>
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-apple-blue rounded-full"></div>
      </div>

      {!permissionGranted && (
        <div className="text-center">
          <p className="font-sf text-apple-gray-600 dark:text-apple-gray-400 text-xs mb-2">
            Enable device orientation for accurate direction
          </p>
          <button
            onClick={() => window.location.reload()}
            className="font-sf text-apple-blue text-xs hover:opacity-70"
          >
            Refresh to enable
          </button>
        </div>
      )}
    </div>
  );
}