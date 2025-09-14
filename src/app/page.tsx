'use client';

import { useLocation } from '@/hooks/useLocation';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useSettings } from '@/contexts/SettingsContext';
import PrayerTimesDial from '@/components/PrayerTimesDial';
import PrayerTimesList from '@/components/PrayerTimesList';

export default function Home() {
  const { location, loading: locationLoading, error: locationError, requestLocation } = useLocation();
  const { settings } = useSettings();
  const { prayerTimes, loading: prayerLoading, error: prayerError, refetch } = usePrayerTimes(location, settings);

  const getLocationDisplay = () => {
    if (!location) return 'Unknown location';
    if (location.city && location.country) {
      return `${location.city}, ${location.country}`;
    }
    return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
  };

  return (
    <div className="min-h-screen bg-apple-gray-50 dark:bg-black">
      <main className="container mx-auto px-6 py-12">
        {/* Minimal Header */}
        <div className="text-center mb-12">
          <h1 className="font-sf text-2xl font-medium text-apple-gray-900 dark:text-white mb-2">
            Prayer Times
          </h1>
        </div>

        {/* Error States */}
        {locationError && (
          <div className="mb-8 max-w-md mx-auto">
            <div className="glass-effect dark:glass-effect-dark border border-red-200/50 dark:border-red-800/50 rounded-2xl p-4 shadow-apple">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 text-sm">!</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-sf font-medium text-red-800 dark:text-red-300">Location Error</h3>
                  <p className="font-sf text-red-700 dark:text-red-400 text-sm mt-1">{locationError}</p>
                  <button
                    onClick={requestLocation}
                    className="font-sf text-red-800 dark:text-red-300 text-sm mt-2 hover:opacity-70 transition-opacity"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {prayerError && (
          <div className="mb-8 max-w-md mx-auto">
            <div className="glass-effect dark:glass-effect-dark border border-yellow-200/50 dark:border-yellow-800/50 rounded-2xl p-4 shadow-apple">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 dark:text-yellow-400 text-sm">!</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-sf font-medium text-yellow-800 dark:text-yellow-300">Prayer Times Error</h3>
                  <p className="font-sf text-yellow-700 dark:text-yellow-400 text-sm mt-1">{prayerError}</p>
                  <button
                    onClick={refetch}
                    className="font-sf text-yellow-800 dark:text-yellow-300 text-sm mt-2 hover:opacity-70 transition-opacity"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {(locationLoading || prayerLoading) && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 text-apple-gray-600 dark:text-apple-gray-400">
              <div className="w-5 h-5 border-2 border-apple-blue border-t-transparent rounded-full animate-spin"></div>
              <span className="font-sf text-sm font-medium">
                {locationLoading ? 'Getting your location...' : 'Loading prayer times...'}
              </span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <PrayerTimesDial prayerTimes={prayerTimes} />
          </div>
          
          <div className="max-w-md mx-auto">
            <PrayerTimesList 
              prayerTimes={prayerTimes} 
              location={getLocationDisplay()}
            />
          </div>
        </div>


      </main>
    </div>
  );
}