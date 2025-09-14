'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PrayerSettings } from '@/types/prayer';

interface SettingsContextType {
  settings: PrayerSettings;
  updateSettings: (newSettings: Partial<PrayerSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: PrayerSettings = {
  calculationMethod: 2, // ISNA
  timeFormat: '12h',
  notificationsEnabled: false,
  reminderMinutes: 10,
  adjustments: {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PrayerSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('prayer-app-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('prayer-app-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<PrayerSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('prayer-app-settings');
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}