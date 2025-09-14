'use client';

import { useState, useEffect } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface UseLocationResult {
  location: Location | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
  setManualLocation: (lat: number, lng: number) => void;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocationName = async (lat: number, lng: number): Promise<{ city?: string; country?: string }> => {
    try {
      // Use a simple reverse geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        return {
          city: data.city || data.locality,
          country: data.countryName,
        };
      }
    } catch (err) {
      console.warn('Failed to get location name:', err);
    }
    
    return {};
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const locationInfo = await getLocationName(latitude, longitude);
          
          setLocation({
            latitude,
            longitude,
            ...locationInfo,
          });
        } catch (err) {
          // Even if geocoding fails, we can still use coordinates
          setLocation({ latitude, longitude });
        }
        
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  const setManualLocation = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const locationInfo = await getLocationName(lat, lng);
      setLocation({
        latitude: lat,
        longitude: lng,
        ...locationInfo,
      });
    } catch (err) {
      setLocation({ latitude: lat, longitude: lng });
    }
    
    setLoading(false);
  };

  return {
    location,
    loading,
    error,
    requestLocation,
    setManualLocation,
  };
}