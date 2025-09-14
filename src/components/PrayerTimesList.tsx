'use client';

import { useEffect, useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { formatTime } from '@/utils/timeUtils';

interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface PrayerTimesListProps {
  prayerTimes: PrayerTimes | null;
  location: string;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export default function PrayerTimesList({ prayerTimes, location }: PrayerTimesListProps) {
  const { settings } = useSettings();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [timeToNext, setTimeToNext] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!prayerTimes) return;

    const currentMinutes = getCurrentMinutes();
    const prayers = [
      { name: 'Fajr', time: prayerTimes.fajr, minutes: timeToMinutes(prayerTimes.fajr) },
      { name: 'Dhuhr', time: prayerTimes.dhuhr, minutes: timeToMinutes(prayerTimes.dhuhr) },
      { name: 'Asr', time: prayerTimes.asr, minutes: timeToMinutes(prayerTimes.asr) },
      { name: 'Maghrib', time: prayerTimes.maghrib, minutes: timeToMinutes(prayerTimes.maghrib) },
      { name: 'Isha', time: prayerTimes.isha, minutes: timeToMinutes(prayerTimes.isha) },
    ];

    let next = prayers.find(prayer => prayer.minutes > currentMinutes);
    
    if (!next) {
      // Next prayer is Fajr tomorrow
      next = { ...prayers[0], minutes: prayers[0].minutes + 24 * 60 };
    }

    setNextPrayer(next.name);
    
    const minutesToNext = next.minutes - currentMinutes;
    const hoursToNext = Math.floor(minutesToNext / 60);
    const remainingMinutes = minutesToNext % 60;
    
    if (hoursToNext > 0) {
      setTimeToNext(`${hoursToNext}h ${remainingMinutes}m`);
    } else {
      setTimeToNext(`${remainingMinutes}m`);
    }
  }, [prayerTimes, currentTime]);

  if (!prayerTimes) {
    return (
      <div className="glass-effect dark:glass-effect-dark rounded-2xl shadow-apple p-6 border border-white/20 dark:border-white/10">
        <div className="animate-pulse">
          <div className="h-4 bg-white/30 dark:bg-white/20 rounded mb-3"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 bg-white/20 dark:bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr, icon: '🌅', description: 'Dawn prayer' },
    { name: 'Dhuhr', time: prayerTimes.dhuhr, icon: '☀️', description: 'Midday prayer' },
    { name: 'Asr', time: prayerTimes.asr, icon: '🌤️', description: 'Afternoon prayer' },
    { name: 'Maghrib', time: prayerTimes.maghrib, icon: '🌅', description: 'Sunset prayer' },
    { name: 'Isha', time: prayerTimes.isha, icon: '🌙', description: 'Night prayer' },
  ];

  return (
    <div className="glass-effect dark:glass-effect-dark rounded-2xl shadow-apple p-6 border border-white/20 dark:border-white/10">
      {nextPrayer && (
        <div className="mb-4 text-center">
          <p className="text-apple-gray-700 dark:text-apple-gray-300 text-sm font-sf font-medium">
            Next: {nextPrayer} in {timeToNext}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {prayers.map((prayer) => (
          <div
            key={prayer.name}
            className={`flex items-center justify-between py-3 px-2 rounded-lg transition-all duration-200 ${
              prayer.name === nextPrayer
                ? 'bg-white/30 dark:bg-white/10'
                : 'hover:bg-white/20 dark:hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div>
                <h3 className="font-sf font-medium text-apple-gray-900 dark:text-white text-sm">
                  {prayer.name}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <div className="font-sf text-sm font-medium text-apple-gray-900 dark:text-white">
                {formatTime(prayer.time, settings.timeFormat === '24h')}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-apple-gray-600 dark:text-apple-gray-400 text-xs font-sf">
          {location}
        </p>
      </div>
    </div>
  );
}