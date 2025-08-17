'use client';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, addMinutes } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface Props {
  onSelect: (dateIso: string) => void;
}

// Historical periods for context (3300 BCE - 2100 CE)
const historicalPeriods = [
  { start: -3300, end: -500, name: "Ancient Civilizations", description: "Egypt, Babylon, Greece, Rome" },
  { start: -500, end: 500, name: "Classical Period", description: "Golden ages, major empires" },
  { start: 500, end: 1500, name: "Medieval", description: "Knights, castles, exploration" },
  { start: 1500, end: 1700, name: "Renaissance", description: "Art, science, discovery" },
  { start: 1700, end: 1900, name: "Industrial", description: "Revolution, innovation" },
  { start: 1900, end: 2024, name: "Modern", description: "Technology, pop culture" },
  { start: 2024, end: 2100, name: "Future", description: "Planning, legacy" },
];

export default function TimePicker({ onSelect }: Props) {
  const [date, setDate] = useState<Date>();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Get historical context for selected year
  const getHistoricalContext = (year: number) => {
    const period = historicalPeriods.find(p => year >= p.start && year <= p.end);
    return period || { name: "Future", description: "Years to come" };
  };

  const currentPeriod = getHistoricalContext(selectedYear);

  return (
    <div className="glass-card p-6 bg-slate-900/60">
      <div className="flex flex-col gap-6">
        {/* Historical Context Display */}
        <div className="text-center mb-4">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-500/20 border border-purple-500/30">
            <span className="text-sm font-medium text-purple-300">
              {currentPeriod.name} • {currentPeriod.description}
            </span>
          </div>
        </div>

        <DayPicker
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            if (selectedDate) {
              setSelectedYear(selectedDate.getFullYear());
            }
          }}
          captionLayout="dropdown"
          fromYear={-3300} // 3300 BCE - beginning of recorded history
          toYear={2100}
          className="mx-auto"
          styles={{
            caption: { color: '#E2E8F0' },
            head_cell: { color: '#94A3B8' },
            day: { color: '#E2E8F0' },
            day_selected: { backgroundColor: '#667eea' },
            day_today: { backgroundColor: '#764ba2' },
            dropdown_month: { 
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              color: '#E2E8F0',
              border: '1px solid rgba(102, 126, 234, 0.3)'
            },
            dropdown_year: { 
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              color: '#E2E8F0',
              border: '1px solid rgba(102, 126, 234, 0.3)'
            }
          }}
        />

        {/* Quick Selection Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all text-sm"
            onClick={() => {
              setDate(new Date());
            }}
          >
            Today
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-500 text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all text-sm"
            onClick={() => {
              const birthDate = new Date();
              birthDate.setFullYear(birthDate.getFullYear() - 25);
              setDate(birthDate);
            }}
          >
            Birth Year
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-blue-500 text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all text-sm"
            onClick={() => {
              const ancientDate = new Date();
              ancientDate.setFullYear(-3000); // Ancient Egypt
              setDate(ancientDate);
            }}
          >
            Ancient Times
          </button>
        </div>

        {/* Year Range Indicator */}
        <div className="text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-800/50 border border-slate-600/50">
            <span className="text-xs text-slate-400">
              Spanning 12,000 years of human civilization
            </span>
          </div>
        </div>

        {date && (
          <TimeOfDaySelector
            baseDate={date}
            onDone={(d) => onSelect(d.toISOString())}
          />
        )}
      </div>
    </div>
  );
}

function TimeOfDaySelector({
  baseDate,
  onDone
}: {
  baseDate: Date;
  onDone: (d: Date) => void;
}) {
  const [time, setTime] = useState<string>('12:00');

  const confirm = () => {
    const [h, m] = time.split(':').map(Number);
    const dt = new Date(baseDate);
    dt.setHours(h || 12, m || 0, 0, 0);
    onDone(dt);
  };

  // Get historical context for the selected date
  const getHistoricalContext = (date: Date) => {
    const year = date.getFullYear();
    const period = historicalPeriods.find(p => year >= p.start && year <= p.end);
    return period || { name: "Future", description: "Years to come" };
  };

  const selectedPeriod = getHistoricalContext(baseDate);
  const isAncient = baseDate.getFullYear() < 0;
  const isFuture = baseDate.getFullYear() > new Date().getFullYear();

  return (
    <div className="space-y-4">
      {/* Historical Context for Selected Date */}
      <div className="text-center p-3 rounded-lg bg-gradient-to-r from-purple-600/10 to-cyan-500/10 border border-purple-500/20">
        <div className="text-sm font-medium text-purple-300 mb-1">
          {selectedPeriod.name}
        </div>
        <div className="text-xs text-slate-400">
          {selectedPeriod.description}
        </div>
        {isAncient && (
          <div className="text-xs text-amber-400 mt-1">
            {Math.abs(baseDate.getFullYear())} BCE
          </div>
        )}
        {isFuture && (
          <div className="text-xs text-green-400 mt-1">
            Future Era
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 justify-center">
        <input
          type="time"
          step={60}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="bg-slate-800 rounded px-4 py-2 text-lg tracking-wide text-white border border-slate-700 focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={confirm}
          className="px-6 py-2 rounded bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl focus:ring-2 focus:ring-purple-500 transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
} 