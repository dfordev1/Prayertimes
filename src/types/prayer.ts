export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  timezone?: string;
  date?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface PrayerSettings {
  calculationMethod: number;
  timeFormat: '12h' | '24h';
  notificationsEnabled: boolean;
  reminderMinutes: number;
  adjustments: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
}

export interface CalculationMethod {
  id: number;
  name: string;
  description: string;
}

export const CALCULATION_METHODS: CalculationMethod[] = [
  { id: 1, name: 'University of Islamic Sciences, Karachi', description: 'Used in Pakistan, Bangladesh, India, Afghanistan, and parts of Europe' },
  { id: 2, name: 'Islamic Society of North America (ISNA)', description: 'Used in North America (US and Canada)' },
  { id: 3, name: 'Muslim World League (MWL)', description: 'Used in Europe, Far East, and parts of US' },
  { id: 4, name: 'Umm al-Qura, Makkah', description: 'Used in Saudi Arabia' },
  { id: 5, name: 'Egyptian General Authority of Survey', description: 'Used in Egypt and some African countries' },
  { id: 7, name: 'Institute of Geophysics, University of Tehran', description: 'Used in Iran and some Shia communities' },
  { id: 8, name: 'Gulf Region', description: 'Used in Gulf countries' },
  { id: 9, name: 'Kuwait', description: 'Used in Kuwait' },
  { id: 10, name: 'Qatar', description: 'Used in Qatar' },
  { id: 11, name: 'Majlis Ugama Islam Singapura', description: 'Used in Singapore' },
  { id: 12, name: 'Union Organization islamic de France', description: 'Used in France' },
  { id: 13, name: 'Diyanet İşleri Başkanlığı', description: 'Used in Turkey' },
  { id: 14, name: 'Spiritual Administration of Muslims of Russia', description: 'Used in Russia' }
];