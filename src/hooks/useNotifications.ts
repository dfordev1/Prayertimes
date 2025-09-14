'use client';

import { useEffect, useRef, useCallback } from 'react';
import { PrayerTimes, PrayerSettings } from '@/types/prayer';
import { timeToMinutes, getCurrentMinutes } from '@/utils/timeUtils';

export function useNotifications(prayerTimes: PrayerTimes | null, settings: PrayerSettings) {
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  const showNotification = useCallback((prayerName: string, isReminder: boolean = false) => {
    if (!settings.notificationsEnabled || Notification.permission !== 'granted') return;

    const title = isReminder 
      ? `${prayerName} Prayer Reminder`
      : `${prayerName} Prayer Time`;
    
    const body = isReminder
      ? `${prayerName} prayer is in ${settings.reminderMinutes} minutes`
      : `It's time for ${prayerName} prayer`;

    new Notification(title, {
      body,
      icon: '/prayer-icon.png',
      tag: `prayer-${prayerName.toLowerCase()}`,
      requireInteraction: false,
    });
  }, [settings.notificationsEnabled, settings.reminderMinutes]);

  const scheduleNotifications = useCallback(() => {
    if (!prayerTimes || !settings.notificationsEnabled) return;

    // Clear existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const currentMinutes = getCurrentMinutes();
    const prayers = [
      { name: 'Fajr', time: prayerTimes.fajr },
      { name: 'Dhuhr', time: prayerTimes.dhuhr },
      { name: 'Asr', time: prayerTimes.asr },
      { name: 'Maghrib', time: prayerTimes.maghrib },
      { name: 'Isha', time: prayerTimes.isha },
    ];

    prayers.forEach(prayer => {
      const prayerMinutes = timeToMinutes(prayer.time);
      const reminderMinutes = prayerMinutes - settings.reminderMinutes;
      
      // Schedule reminder notification
      if (reminderMinutes > currentMinutes) {
        const reminderDelay = (reminderMinutes - currentMinutes) * 60 * 1000;
        const reminderTimeout = setTimeout(() => {
          showNotification(prayer.name, true);
        }, reminderDelay);
        timeoutsRef.current.push(reminderTimeout);
      }
      
      // Schedule prayer time notification
      if (prayerMinutes > currentMinutes) {
        const prayerDelay = (prayerMinutes - currentMinutes) * 60 * 1000;
        const prayerTimeout = setTimeout(() => {
          showNotification(prayer.name, false);
        }, prayerDelay);
        timeoutsRef.current.push(prayerTimeout);
      }
    });
  }, [prayerTimes, settings.notificationsEnabled, settings.reminderMinutes, showNotification]);

  useEffect(() => {
    if (settings.notificationsEnabled) {
      requestNotificationPermission().then(() => {
        scheduleNotifications();
      });
    }

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [settings.notificationsEnabled, settings.reminderMinutes, scheduleNotifications]);

  return {
    requestNotificationPermission,
    scheduleNotifications,
  };
}