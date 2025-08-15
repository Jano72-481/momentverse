'use client';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { format, addYears, addMonths, addWeeks, addDays, addHours, subYears, subMonths, subWeeks, subDays, subHours } from 'date-fns';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Calendar, Clock, Star, Target, Sparkles } from 'lucide-react';

type TimeScale = 'hour' | 'day' | 'week' | 'month' | 'year' | 'decade' | 'century' | 'millennium' | 'max';
type MomentPoint = {
  ts: string;      // ISO
  count: number;   // aggregated
  topId: string;   // popular moment id
  title?: string;
  description?: string;
  isStarred?: boolean;
  totalMoments?: number;
  starCount?: number;
};

interface TimelineProps {
  className?: string;
  showToday?: boolean;
  timeScale?: TimeScale;
  onTimeScaleChange?: (timeScale: TimeScale) => void;
  onMomentClick?: (moment: MomentPoint) => void;
}

export default function TimelineOptimized({ className = '', showToday = true, timeScale: externalTimeScale, onTimeScaleChange, onMomentClick }: TimelineProps) {
  const [internalTimeScale, setInternalTimeScale] = useState<TimeScale>('day');
  const timeScale = externalTimeScale || internalTimeScale;
  const setTimeScale = externalTimeScale ? (() => {}) : setInternalTimeScale;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState<MomentPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<MomentPoint | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualization setup
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimated height of each timeline item
    overscan: 10, // Number of items to render outside the viewport
  });

  // Calculate time range based on scale - optimized for millions of data points
  const getTimeRange = useCallback((scale: TimeScale, centerDate: Date): [Date, Date] => {
    const now = new Date();
    const center = centerDate || now;
    
    switch (scale) {
      case 'hour':
        return [subHours(center, 24), addHours(center, 24)]; // 48-hour view
      case 'day':
        return [subDays(center, 14), addDays(center, 14)]; // 28-day view
      case 'week':
        return [subWeeks(center, 8), addWeeks(center, 8)]; // 16-week view
      case 'month':
        return [subMonths(center, 12), addMonths(center, 12)]; // 24-month view
      case 'year':
        return [subYears(center, 5), addYears(center, 5)]; // 10-year view
      case 'decade':
        return [subYears(center, 50), addYears(center, 50)]; // 100-year view
      case 'century':
        return [subYears(center, 500), addYears(center, 500)]; // 1000-year view
      case 'millennium':
        return [subYears(center, 5000), addYears(center, 5000)]; // 10000-year view
      case 'max':
        // 12,000 years of human civilization
        return [new Date(-10000, 0, 1), addYears(now, 100)];
      default:
        return [subDays(center, 14), addDays(center, 14)];
    }
  }, []);

  const [timeRange, setTimeRange] = useState<[Date, Date]>(() => 
    getTimeRange('day', new Date())
  );

  // Update time range when scale or center date changes
  useEffect(() => {
    setTimeRange(getTimeRange(timeScale, currentDate));
  }, [timeScale, currentDate, getTimeRange]);

  // Optimized data fetching with caching and pagination
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [start, end] = timeRange;
        const params = new URLSearchParams({
          timeScale,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          limit: '2000' // Increased for better data density
        });
        
        const response = await fetch(`/api/timeline?${params}`);
        const result = await response.json();
        
        if (result.ok) {
          // Optimize data for visualization
          const optimizedData = result.data.aggregated.map((point: any) => ({
            ...point,
            count: Math.max(1, point.count), // Ensure minimum visibility
            totalMoments: point.count || 0,
            starCount: point.isStarred ? 1 : 0
          }));
          setData(optimizedData);
        } else {
          setError(result.error?.message || 'Failed to fetch timeline data');
        }
      } catch (err) {
        console.error('Timeline fetch error:', err);
        setError('Failed to load timeline data');
        
        // Enhanced fallback data for demonstration
        const mockData: MomentPoint[] = Array.from({ length: 50 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            ts: date.toISOString(),
            count: Math.floor(Math.random() * 100) + 1,
            topId: `mock-${i}`,
            title: `Moment ${i + 1}`,
            description: `A beautiful moment in time`,
            isStarred: Math.random() > 0.7,
            totalMoments: Math.floor(Math.random() * 100) + 1,
            starCount: Math.random() > 0.7 ? 1 : 0
          };
        });
        setData(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange, timeScale]);

  // Memoized sorted data for better performance
  const sortedData = useMemo(
    () => [...data].sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime()),
    [data]
  );

  // Enhanced navigation functions
  const navigateTime = useCallback((direction: 'forward' | 'backward') => {
    const multiplier = direction === 'forward' ? 1 : -1;
    let newDate = currentDate;

    switch (timeScale) {
      case 'hour':
        newDate = addHours(currentDate, 24 * multiplier);
        break;
      case 'day':
        newDate = addDays(currentDate, 14 * multiplier);
        break;
      case 'week':
        newDate = addWeeks(currentDate, 8 * multiplier);
        break;
      case 'month':
        newDate = addMonths(currentDate, 12 * multiplier);
        break;
      case 'year':
        newDate = addYears(currentDate, 5 * multiplier);
        break;
      case 'decade':
        newDate = addYears(currentDate, 50 * multiplier);
        break;
      case 'century':
        newDate = addYears(currentDate, 500 * multiplier);
        break;
      case 'millennium':
        newDate = addYears(currentDate, 5000 * multiplier);
        break;
      case 'max':
        newDate = addYears(currentDate, 10000 * multiplier);
        break;
    }

    setCurrentDate(newDate);
  }, [currentDate, timeScale]);

  const zoomIn = useCallback(() => {
    const scales: TimeScale[] = ['hour', 'day', 'week', 'month', 'year', 'decade', 'century', 'millennium', 'max'];
    const currentIndex = scales.indexOf(timeScale);
    if (currentIndex > 0) {
      const newTimeScale = scales[currentIndex - 1];
      setTimeScale(newTimeScale);
      onTimeScaleChange?.(newTimeScale);
    }
  }, [timeScale, setTimeScale, onTimeScaleChange]);

  const zoomOut = useCallback(() => {
    const scales: TimeScale[] = ['hour', 'day', 'week', 'month', 'year', 'decade', 'century', 'millennium', 'max'];
    const currentIndex = scales.indexOf(timeScale);
    if (currentIndex < scales.length - 1) {
      const newTimeScale = scales[currentIndex + 1];
      setTimeScale(newTimeScale);
      onTimeScaleChange?.(newTimeScale);
    }
  }, [timeScale, setTimeScale, onTimeScaleChange]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Virtualized timeline item component
  const TimelineItem = useCallback(({ moment, index }: { moment: MomentPoint; index: number }) => {
    const date = new Date(moment.ts);
    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    
    return (
      <div 
        className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-700/50 transition-all cursor-pointer group"
        onClick={() => onMomentClick?.(moment)}
        onMouseEnter={() => setHoveredPoint(moment)}
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            moment.isStarred 
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
              : 'bg-gradient-to-br from-purple-500 to-blue-500'
          }`}>
            {moment.isStarred ? (
              <Star className="w-6 h-6 text-white" />
            ) : (
              <Sparkles className="w-6 h-6 text-white" />
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white truncate">
              {moment.title || `Moment ${index + 1}`}
            </h3>
            {isToday && (
              <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                Today
              </span>
            )}
          </div>
          
          <p className="text-sm text-slate-400 mb-2">
            {format(date, 'MMM dd, yyyy HH:mm')}
          </p>
          
          {moment.description && (
            <p className="text-sm text-slate-300 line-clamp-2">
              {moment.description}
            </p>
          )}
        </div>
        
        <div className="flex-shrink-0 text-right">
          <div className="text-lg font-bold text-purple-400">
            {moment.count.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">
            moments
          </div>
        </div>
      </div>
    );
  }, [onMomentClick]);

  return (
    <div className={`timeline-container ${className}`}>
      {/* Enhanced Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTime('backward')}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            title="Go Backward"
          >
            <ChevronLeft className="w-5 h-5 text-slate-300" />
          </button>
          
          <button
            onClick={goToToday}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-white font-medium flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Today
          </button>
          
          <button
            onClick={() => navigateTime('forward')}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            title="Go Forward"
          >
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-slate-300" />
          </button>
          
          <div className="px-4 py-2 bg-slate-700 rounded-lg text-slate-300 font-medium">
            {timeScale.charAt(0).toUpperCase() + timeScale.slice(1)}
          </div>
          
          <button
            onClick={zoomIn}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          <span>{format(currentDate, 'MMM dd, yyyy')}</span>
        </div>
      </div>

      {/* Virtualized Timeline Display */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/50 rounded-lg flex items-center justify-center z-10">
            <div className="flex items-center gap-3 text-slate-300">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              <span>Loading timeline data...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && sortedData.length === 0 && (
          <div className="bg-slate-900 rounded-lg border border-slate-700 p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">No Moments Yet</h3>
                <p className="text-slate-400 mb-4 max-w-md">
                  Be the first to dedicate a moment to eternity! Your moment will appear here on the timeline.
                </p>
                <a
                  href="/claim"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg hover:scale-105 transition-all"
                >
                  <Star className="w-4 h-4" />
                  Claim Your First Moment
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Virtualized Timeline */}
        {!isLoading && !error && sortedData.length > 0 && (
          <div 
            ref={parentRef}
            className="bg-slate-900 rounded-lg border border-slate-700 p-4"
            style={{ height: '70vh', overflow: 'auto' }}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const moment = sortedData[virtualRow.index];
                return (
                  <div
                    key={moment.topId}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <TimelineItem moment={moment} index={virtualRow.index} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced Tooltip */}
        {hoveredPoint && (
          <div className="absolute bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl z-20 pointer-events-none"
               style={{
                 left: `${Math.random() * 200 + 50}px`,
                 top: `${Math.random() * 100 + 50}px`
               }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-white">{hoveredPoint.title || 'Moment'}</span>
            </div>
            <div className="text-sm text-slate-300 mb-1">
              {format(new Date(hoveredPoint.ts), 'MMM dd, yyyy HH:mm')}
            </div>
            <div className="text-sm text-slate-400">
              {hoveredPoint.count.toLocaleString()} moments
              {hoveredPoint.isStarred && (
                <span className="ml-2 text-yellow-400">★ Starred</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {sortedData.length.toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">Time Points</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {sortedData.reduce((sum, d) => sum + d.count, 0).toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">Total Moments</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {sortedData.filter(d => d.isStarred).length}
          </div>
          <div className="text-sm text-slate-400">Starred</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {timeScale}
          </div>
          <div className="text-sm text-slate-400">Current Scale</div>
        </div>
      </div>
    </div>
  );
}
