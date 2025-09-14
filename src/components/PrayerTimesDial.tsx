'use client';

import { useEffect, useState } from 'react';

interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface PrayerTimesDialProps {
  prayerTimes: PrayerTimes | null;
}

function timeToAngle(time: string, timezone?: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  return (totalMinutes / (24 * 60)) * 360;
}

function getCurrentTimeAngle(): number {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return (totalSeconds / (24 * 3600)) * 360;
}

function createArcPath(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  return [
    "M", centerX, centerY,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export default function PrayerTimesDial({ prayerTimes }: PrayerTimesDialProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!prayerTimes) {
    return (
      <div className="relative w-80 h-80">
        <div className="absolute inset-0 w-full h-full rounded-full glass-effect dark:glass-effect-dark shadow-apple border border-white/30 dark:border-white/10 flex items-center justify-center backdrop-blur-apple">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue mx-auto mb-3"></div>
            <div className="text-apple-gray-700 dark:text-apple-gray-300 font-sf font-medium">Loading prayer times...</div>
          </div>
        </div>
      </div>
    );
  }

  const prayerAngles = {
    fajr: timeToAngle(prayerTimes.fajr),
    sunrise: timeToAngle(prayerTimes.sunrise),
    dhuhr: timeToAngle(prayerTimes.dhuhr),
    asr: timeToAngle(prayerTimes.asr),
    maghrib: timeToAngle(prayerTimes.maghrib),
    isha: timeToAngle(prayerTimes.isha),
  };

  const currentAngle = getCurrentTimeAngle();

  // Define prayer periods with colors and labels (proper prayer windows only)
  const prayerPeriods = [
    {
      name: 'Fajr',
      start: prayerAngles.fajr,
      end: prayerAngles.sunrise,
      color: '#3b82f6', // blue
      textColor: 'white'
    },
    {
      name: 'Dhuhr',
      start: prayerAngles.dhuhr,
      end: prayerAngles.asr,
      color: '#ef4444', // red
      textColor: 'white'
    },
    {
      name: 'Asr',
      start: prayerAngles.asr,
      end: prayerAngles.maghrib,
      color: '#f97316', // orange
      textColor: 'white'
    },
    {
      name: 'Maghrib',
      start: prayerAngles.maghrib,
      end: prayerAngles.isha,
      color: '#7c3aed', // violet
      textColor: 'white'
    },
    {
      name: 'Isha',
      start: prayerAngles.isha,
      end: prayerAngles.fajr + 360, // Next day's Fajr
      color: '#1e293b', // slate-800
      textColor: 'white'
    }
  ];

  // Prayer time markers (individual prayer times as points)
  const prayerMarkers = [
    { name: 'Fajr', angle: prayerAngles.fajr, color: '#3b82f6' },
    { name: 'Sunrise', angle: prayerAngles.sunrise, color: '#fbbf24' },
    { name: 'Dhuhr', angle: prayerAngles.dhuhr, color: '#ef4444' },
    { name: 'Asr', angle: prayerAngles.asr, color: '#f97316' },
    { name: 'Maghrib', angle: prayerAngles.maghrib, color: '#7c3aed' },
    { name: 'Isha', angle: prayerAngles.isha, color: '#1e293b' }
  ];

  const centerX = 160;
  const centerY = 160;
  const radius = 140;

  return (
    <div className="relative w-80 h-80">
      {/* Apple Glassmorphism Background */}
      <div className="absolute inset-0 w-full h-full rounded-full glass-effect dark:glass-effect-dark shadow-apple border border-white/30 dark:border-white/10 backdrop-blur-apple">
        {/* Subtle inner gradient overlay for depth */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 via-apple-blue/5 to-transparent dark:from-white/5 dark:via-apple-blue/10 dark:to-transparent"></div>
        {/* Inner border for glass effect */}
        <div className="absolute inset-1 rounded-full border border-white/20 dark:border-white/10"></div>
      </div>
      
      {/* SVG for pie segments */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
        {/* Minimal outer rim */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
          className="dark:stroke-white/10"
        />
        {/* Prayer period arcs (only actual prayer windows) */}
        {prayerPeriods.map((period, index) => {
          let endAngle = period.end;
          // Handle wrap-around for periods crossing midnight
          if (endAngle > 360) {
            endAngle = endAngle - 360;
          }
          
          // Calculate proper arc path handling wrap-around
          let arcPath;
          if (period.start > endAngle && period.name === 'Isha') {
            // Isha period crosses midnight - draw two arcs
            const midnightArc = createArcPath(centerX, centerY, radius, period.start, 360);
            const morningArc = createArcPath(centerX, centerY, radius, 0, endAngle);
            arcPath = midnightArc; // Just use the main arc for now
          } else {
            arcPath = createArcPath(centerX, centerY, radius, period.start, period.end > 360 ? period.end : endAngle);
          }
          
          const midAngle = period.end > 360 ? (period.start + period.end) / 2 : (period.start + endAngle) / 2;
          const labelRadius = radius * 0.7;
          const labelPos = polarToCartesian(centerX, centerY, labelRadius, midAngle);
          
          return (
            <g key={period.name}>
              <path
                d={arcPath}
                fill={period.color}
                stroke="none"
                opacity="0.6"
                className="drop-shadow-apple"
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.9)"
                fontSize="9"
                fontWeight="500"
                className="font-sf"
              >
                {period.name}
              </text>
            </g>
          );
        })}
        

        
        {/* Minimal hour markers - only major hours */}
        {[0, 6, 12, 18].map((hour) => {
          const angle = hour * 15;
          const innerRadius = radius - 10;
          const outerRadius = radius - 2;
          const start = polarToCartesian(centerX, centerY, innerRadius, angle);
          const end = polarToCartesian(centerX, centerY, outerRadius, angle);
          
          return (
            <line
              key={hour}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              className="dark:stroke-white/15"
            />
          );
        })}
        
        {/* Minimal hour labels */}
        {[6, 12, 18, 0].map((hour) => {
          const angle = hour === 0 ? 0 : hour * 15;
          const labelRadius = radius + 12;
          const pos = polarToCartesian(centerX, centerY, labelRadius, angle);
          
          return (
            <text
              key={hour}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.4)"
              fontSize="10"
              fontWeight="400"
              className="dark:fill-white/40 font-sf"
            >
              {hour.toString().padStart(2, '0')}
            </text>
          );
        })}
        
        {/* Minimal current time indicator */}
        <line
          x1={centerX}
          y1={centerY}
          x2={polarToCartesian(centerX, centerY, radius - 20, currentAngle).x}
          y2={polarToCartesian(centerX, centerY, radius - 20, currentAngle).y}
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="dark:stroke-white/90"
        />
        
        {/* Minimal center dot */}
        <circle
          cx={centerX}
          cy={centerY}
          r="2"
          fill="rgba(255,255,255,0.8)"
          className="dark:fill-white/80"
        />
      </svg>

      {/* Glassmorphic current time display */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 glass-effect dark:glass-effect-dark px-5 py-2.5 rounded-full shadow-apple border border-white/40 dark:border-white/20 backdrop-blur-apple">
        <span className="text-sm font-sf font-semibold text-apple-gray-900 dark:text-white tracking-wide">
          {currentTime.toLocaleTimeString('en-US', { hour12: false })}
        </span>
      </div>
    </div>
  );
}