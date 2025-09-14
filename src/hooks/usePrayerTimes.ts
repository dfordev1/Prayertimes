'use client';

import { useState, useEffect } from 'react';
import { PrayerTimes, Location, PrayerSettings } from '@/types/prayer';

interface UsePrayerTimesResult {
  prayerTimes: PrayerTimes | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function getCacheKey(location: Location, settings: PrayerSettings): string {
  const date = new Date().toDateString();
  return `prayer-times-${location.latitude}-${location.longitude}-${settings.calculationMethod}-${date}`;
}

function applyAdjustments(prayerTimes: PrayerTimes, adjustments: PrayerSettings['adjustments']): PrayerTimes {
  const adjustTime = (time: string, minutes: number): string => {
    if (minutes === 0) return time;
    
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const adjustedHours = Math.floor(totalMinutes / 60) % 24;
    const adjustedMins = totalMinutes % 60;
    
    return `${adjustedHours.toString().padStart(2, '0')}:${adjustedMins.toString().padStart(2, '0')}`;
  };

  return {
    ...prayerTimes,
    fajr: adjustTime(prayerTimes.fajr, adjustments.fajr),
    sunrise: adjustTime(prayerTimes.sunrise, adjustments.sunrise),
    dhuhr: adjustTime(prayerTimes.dhuhr, adjustments.dhuhr),
    asr: adjustTime(prayerTimes.asr, adjustments.asr),
    maghrib: adjustTime(prayerTimes.maghrib, adjustments.maghrib),
    isha: adjustTime(prayerTimes.isha, adjustments.isha),
  };
}

export function usePrayerTimes(location: Location | null, settings: PrayerSettings): UsePrayerTimesResult {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayerTimes = async () => {
    if (!location) return;

    const cacheKey = getCacheKey(location, settings);
    
    // Try to get from cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        const adjustedTimes = applyAdjustments(cachedData, settings.adjustments);
        setPrayerTimes(adjustedTimes);
        return;
      } catch (err) {
        console.warn('Failed to parse cached prayer times:', err);
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${location.latitude}&longitude=${location.longitude}&method=${settings.calculationMethod}&tune=0,0,0,0,0,0,0,0,0`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
      }

      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error('Invalid response from prayer times API');
      }

      const timings = data.data.timings;
      const meta = data.data.meta;
      const rawPrayerTimes = {
        fajr: timings.Fajr,
        sunrise: timings.Sunrise,
        dhuhr: timings.Dhuhr,
        asr: timings.Asr,
        maghrib: timings.Maghrib,
        isha: timings.Isha,
        timezone: meta.timezone,
        date: data.data.date.readable,
      };
      
      // Cache the raw times
      localStorage.setItem(cacheKey, JSON.stringify(rawPrayerTimes));
      
      // Apply adjustments and set
      const adjustedTimes = applyAdjustments(rawPrayerTimes, settings.adjustments);
      setPrayerTimes(adjustedTimes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setPrayerTimes(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayerTimes();
  }, [location, settings.calculationMethod, settings.adjustments]);

  return {
    prayerTimes,
    loading,
    error,
    refetch: fetchPrayerTimes,
  };
}