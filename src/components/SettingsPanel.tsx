'use client';

import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { CALCULATION_METHODS } from '@/types/prayer';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationInput: (lat: number, lng: number) => void;
}

export default function SettingsPanel({ isOpen, onClose, onLocationInput }: SettingsPanelProps) {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [manualLocation, setManualLocation] = useState({ lat: '', lng: '' });
  const [activeTab, setActiveTab] = useState<'general' | 'location' | 'adjustments'>('general');

  if (!isOpen) return null;

  const handleLocationSubmit = () => {
    const lat = parseFloat(manualLocation.lat);
    const lng = parseFloat(manualLocation.lng);
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Please enter valid coordinates (Latitude: -90 to 90, Longitude: -180 to 180)');
      return;
    }
    
    onLocationInput(lat, lng);
    setManualLocation({ lat: '', lng: '' });
  };

  const handleAdjustmentChange = (prayer: keyof typeof settings.adjustments, value: number) => {
    updateSettings({
      adjustments: {
        ...settings.adjustments,
        [prayer]: value
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-effect dark:glass-effect-dark rounded-2xl shadow-apple border border-white/30 dark:border-white/20 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-white/10">
          <h2 className="font-sf text-xl font-semibold text-apple-gray-900 dark:text-white">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
          >
            <span className="text-apple-gray-600 dark:text-apple-gray-400 text-xl">×</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/20 dark:border-white/10">
          {[{ id: 'general', label: 'General' }, { id: 'location', label: 'Location' }, { id: 'adjustments', label: 'Adjustments' }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 font-sf font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-apple-blue border-b-2 border-apple-blue'
                  : 'text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Calculation Method */}
              <div>
                <label className="block font-sf font-medium text-apple-gray-900 dark:text-white mb-2">
                  Calculation Method
                </label>
                <select
                  value={settings.calculationMethod}
                  onChange={(e) => updateSettings({ calculationMethod: parseInt(e.target.value) })}
                  className="w-full p-3 glass-effect dark:glass-effect-dark border border-white/30 dark:border-white/20 rounded-lg font-sf text-apple-gray-900 dark:text-white bg-transparent"
                >
                  {CALCULATION_METHODS.map(method => (
                    <option key={method.id} value={method.id} className="bg-white dark:bg-apple-gray-800">
                      {method.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-apple-gray-600 dark:text-apple-gray-400 mt-1">
                  {CALCULATION_METHODS.find(m => m.id === settings.calculationMethod)?.description}
                </p>
              </div>

              {/* Time Format */}
              <div>
                <label className="block font-sf font-medium text-apple-gray-900 dark:text-white mb-2">
                  Time Format
                </label>
                <div className="flex space-x-4">
                  {[{ value: '12h', label: '12 Hour' }, { value: '24h', label: '24 Hour' }].map(format => (
                    <button
                      key={format.value}
                      onClick={() => updateSettings({ timeFormat: format.value as any })}
                      className={`flex-1 p-3 rounded-lg font-sf font-medium transition-colors ${
                        settings.timeFormat === format.value
                          ? 'bg-apple-blue text-white'
                          : 'glass-effect dark:glass-effect-dark border border-white/30 dark:border-white/20 text-apple-gray-900 dark:text-white'
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-sf font-medium text-apple-gray-900 dark:text-white">
                    Prayer Notifications
                  </label>
                  <button
                    onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      settings.notificationsEnabled ? 'bg-apple-blue' : 'bg-apple-gray-300 dark:bg-apple-gray-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                
                {settings.notificationsEnabled && (
                  <div>
                    <label className="block font-sf text-sm text-apple-gray-700 dark:text-apple-gray-300 mb-1">
                      Reminder (minutes before)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={settings.reminderMinutes}
                      onChange={(e) => updateSettings({ reminderMinutes: parseInt(e.target.value) || 10 })}
                      className="w-full p-2 glass-effect dark:glass-effect-dark border border-white/30 dark:border-white/20 rounded-lg font-sf text-apple-gray-900 dark:text-white bg-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-4">
              <div>
                <label className="block font-sf font-medium text-apple-gray-900 dark:text-white mb-2">
                  Manual Location Input
                </label>
                <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 mb-4">
                  Enter coordinates if automatic location detection isn&apos;t working.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-sf text-sm text-apple-gray-700 dark:text-apple-gray-300 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="40.7128"
                      value={manualLocation.lat}
                      onChange={(e) => setManualLocation(prev => ({ ...prev, lat: e.target.value }))}
                      className="w-full p-2 glass-effect dark:glass-effect-dark border border-white/30 dark:border-white/20 rounded-lg font-sf text-apple-gray-900 dark:text-white bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-sf text-sm text-apple-gray-700 dark:text-apple-gray-300 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="-74.0060"
                      value={manualLocation.lng}
                      onChange={(e) => setManualLocation(prev => ({ ...prev, lng: e.target.value }))}
                      className="w-full p-2 glass-effect dark:glass-effect-dark border border-white/30 dark:border-white/20 rounded-lg font-sf text-apple-gray-900 dark:text-white bg-transparent"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleLocationSubmit}
                  disabled={!manualLocation.lat || !manualLocation.lng}
                  className="w-full p-3 bg-apple-blue hover:bg-blue-600 disabled:bg-apple-gray-300 disabled:dark:bg-apple-gray-600 text-white font-sf font-medium rounded-lg transition-colors"
                >
                  Set Location
                </button>
              </div>
            </div>
          )}

          {activeTab === 'adjustments' && (
            <div className="space-y-4">
              <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 mb-4">
                Adjust prayer times by adding or subtracting minutes. Use negative values to subtract time.
              </p>
              
              {Object.entries(settings.adjustments).map(([prayer, value]) => (
                <div key={prayer} className="flex items-center justify-between">
                  <label className="font-sf font-medium text-apple-gray-900 dark:text-white capitalize">
                    {prayer}
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAdjustmentChange(prayer as any, value - 1)}
                      className="w-8 h-8 rounded-full glass-effect dark:glass-effect-dark border border-white/30 dark:border-white/20 flex items-center justify-center text-apple-gray-700 dark:text-apple-gray-300 hover:bg-white/20 dark:hover:bg-white/10"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-sf text-apple-gray-900 dark:text-white">
                      {value > 0 ? '+' : ''}{value}m
                    </span>
                    <button
                      onClick={() => handleAdjustmentChange(prayer as any, value + 1)}
                      className="w-8 h-8 rounded-full glass-effect dark:glass-effect-dark border border-white/30 dark:border-white/20 flex items-center justify-center text-apple-gray-700 dark:text-apple-gray-300 hover:bg-white/20 dark:hover:bg-white/10"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/20 dark:border-white/10">
          <button
            onClick={resetSettings}
            className="px-4 py-2 font-sf font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-apple-blue hover:bg-blue-600 text-white font-sf font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}