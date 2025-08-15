'use client';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { format, parseISO, addYears, subYears, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, addHours, subHours } from 'date-fns';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Calendar, Star, MapPin, Clock, Target, Sparkles, Users, Heart } from 'lucide-react';

type TimeScale = 'hour' | 'day' | 'week' | 'month' | 'year' | 'decade' | 'century' | 'millennium' | 'max';

interface Moment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  isPublic: boolean;
  dedication?: string;
  star?: boolean;
  location?: string;
  tags?: string[];
  imageUrl?: string;
  count?: number;
  totalMoments?: number;
  starCount?: number;
  user?: {
    name: string;
    id: string;
  };
}

interface TimelineVirtuosoProps {
  moments: Moment[];
  onMomentClick?: (moment: Moment) => void;
  className?: string;
  showToday?: boolean;
}

export default function TimelineVirtuoso({ 
  moments, 
  onMomentClick, 
  className = '', 
  showToday = true 
}: TimelineVirtuosoProps) {
  const [timeScale, setTimeScale] = useState<TimeScale>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Optimized grouping for millions of data points
  const groupedMoments = useMemo(() => {
    const groups: { [key: string]: Moment[] } = {};
    
    moments.forEach(moment => {
      const date = parseISO(moment.startTime);
      
      // Validate date is reasonable
      if (isNaN(date.getTime()) || date.getFullYear() < 1900 || date.getFullYear() > 2100) {
        console.warn('Invalid date found:', moment.startTime);
        return; // Skip invalid dates
      }
      
      let key: string;
      
      switch (timeScale) {
        case 'hour':
          key = format(date, 'yyyy-MM-dd-HH');
          break;
        case 'day':
          key = format(date, 'yyyy-MM-dd');
          break;
        case 'week':
          key = format(date, 'yyyy-\'W\'ww');
          break;
        case 'month':
          key = format(date, 'yyyy-MM');
          break;
        case 'year':
          key = format(date, 'yyyy');
          break;
        case 'decade':
          key = `${Math.floor(date.getFullYear() / 10) * 10}s`;
          break;
        case 'century':
          key = `${Math.floor(date.getFullYear() / 100) * 100}s`;
          break;
        case 'millennium':
          key = `${Math.floor(date.getFullYear() / 1000) * 1000}s`;
          break;
        case 'max':
          key = `${Math.floor(date.getFullYear() / 1000) * 1000}s`;
          break;
        default:
          key = format(date, 'yyyy-MM');
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(moment);
    });
    
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, moments]) => ({ 
        key, 
        moments,
        totalMoments: moments.length,
        starCount: moments.filter(m => m.star).length,
        topMoment: moments.reduce((prev, current) => 
          (current.count || 0) > (prev.count || 0) ? current : prev, moments[0]
        )
      }));
  }, [moments, timeScale]);

  // Enhanced navigation functions with strict date validation
  const navigateTime = useCallback((direction: 'forward' | 'backward') => {
    const multiplier = direction === 'forward' ? 1 : -1;
    let newDate = currentDate;

    // Define reasonable bounds for navigation
    const minYear = 1900;
    const maxYear = 2100;
    const currentYear = currentDate.getFullYear();

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
        // Limit decade navigation to reasonable bounds
        const decadeChange = 50 * multiplier;
        if (currentYear + decadeChange >= minYear && currentYear + decadeChange <= maxYear) {
          newDate = addYears(currentDate, decadeChange);
        } else {
          newDate = new Date();
        }
        break;
      case 'century':
        // Limit century navigation to reasonable bounds
        const centuryChange = 500 * multiplier;
        if (currentYear + centuryChange >= minYear && currentYear + centuryChange <= maxYear) {
          newDate = addYears(currentDate, centuryChange);
        } else {
          newDate = new Date();
        }
        break;
      case 'millennium':
        // Limit millennium navigation to reasonable bounds
        const millenniumChange = 5000 * multiplier;
        if (currentYear + millenniumChange >= minYear && currentYear + millenniumChange <= maxYear) {
          newDate = addYears(currentDate, millenniumChange);
        } else {
          newDate = new Date();
        }
        break;
      case 'max':
        // Limit max navigation to reasonable bounds
        const maxChange = 10000 * multiplier;
        if (currentYear + maxChange >= minYear && currentYear + maxChange <= maxYear) {
          newDate = addYears(currentDate, maxChange);
        } else {
          newDate = new Date();
        }
        break;
    }

    // Final validation - ensure date is within reasonable bounds
    if (newDate.getFullYear() >= minYear && newDate.getFullYear() <= maxYear) {
      setCurrentDate(newDate);
    } else {
      // Reset to current date if invalid
      setCurrentDate(new Date());
    }
  }, [currentDate, timeScale]);

  const zoomIn = useCallback(() => {
    const scales: TimeScale[] = ['hour', 'day', 'week', 'month', 'year', 'decade', 'century', 'millennium', 'max'];
    const currentIndex = scales.indexOf(timeScale);
    if (currentIndex > 0) {
      setTimeScale(scales[currentIndex - 1]);
    }
  }, [timeScale]);

  const zoomOut = useCallback(() => {
    const scales: TimeScale[] = ['hour', 'day', 'week', 'month', 'year', 'decade', 'century', 'millennium', 'max'];
    const currentIndex = scales.indexOf(timeScale);
    if (currentIndex < scales.length - 1) {
      setTimeScale(scales[currentIndex + 1]);
    }
  }, [timeScale]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Enhanced time group rendering with better visual appeal
  const renderTimeGroup = useCallback((group: { key: string; moments: Moment[]; totalMoments: number; starCount: number; topMoment: Moment }) => {
    const date = parseISO(group.moments[0]?.startTime || new Date().toISOString());
    const formatDate = (date: Date, scale: TimeScale) => {
      switch (scale) {
        case 'hour':
          return format(date, 'MMM dd, yyyy HH:mm');
        case 'day':
          return format(date, 'MMM dd, yyyy');
        case 'week':
          return `Week of ${format(date, 'MMM dd, yyyy')}`;
        case 'month':
          return format(date, 'MMMM yyyy');
        case 'year':
          return format(date, 'yyyy');
        case 'decade':
          return `${Math.floor(date.getFullYear() / 10) * 10}s`;
        case 'century':
          return `${Math.floor(date.getFullYear() / 100) * 100}s`;
        case 'millennium':
          return `${Math.floor(date.getFullYear() / 1000) * 1000}s`;
        default:
          return format(date, 'MMM dd, yyyy');
      }
    };

    return (
      <div className="mb-8">
        {/* Enhanced Time Group Header */}
        <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg border border-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {formatDate(date, timeScale)}
              </h3>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {group.totalMoments.toLocaleString()} moments
                </span>
                {group.starCount > 0 && (
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4" />
                    {group.starCount} starred
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-400">
              {group.totalMoments.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">Total</div>
          </div>
        </div>

        {/* Enhanced Moments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {group.moments.slice(0, 6).map((moment) => (
            <div
              key={moment.id}
              className="group relative bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer"
              onClick={() => {
                setSelectedMoment(moment);
                onMomentClick?.(moment);
              }}
            >
              {/* Enhanced Moment Card */}
              <div className="space-y-3">
                {/* Header with star indicator */}
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {moment.title}
                  </h4>
                  {moment.star && (
                    <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  )}
                </div>

                {/* Enhanced metadata */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>{format(parseISO(moment.startTime), 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                  
                  {moment.location && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{moment.location}</span>
                    </div>
                  )}

                  {moment.dedication && (
                    <p className="text-slate-300 italic line-clamp-2">
                      "{moment.dedication}"
                    </p>
                  )}
                </div>

                {/* Enhanced tags */}
                {moment.tags && moment.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {moment.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {moment.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-slate-600 text-slate-400 rounded-full">
                        +{moment.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Enhanced stats */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{moment.count || 0}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      moment.isPublic 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-slate-600 text-slate-400'
                    }`}>
                      {moment.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Show more indicator if there are more moments */}
        {group.moments.length > 6 && (
          <div className="mt-4 text-center">
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors">
              View {group.moments.length - 6} more moments
            </button>
          </div>
        )}
      </div>
    );
  }, [timeScale, onMomentClick]);

  return (
    <div className={`timeline-virtuoso ${className}`}>
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

      {/* Enhanced Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-slate-300">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            <span>Loading timeline data...</span>
          </div>
        </div>
      )}

      {/* Enhanced Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Enhanced Virtual Scrolling */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
        <Virtuoso
          data={groupedMoments}
          itemContent={(index, group) => renderTimeGroup(group)}
          style={{ height: '600px' }}
          overscan={5}
          components={{
            Footer: () => (
              <div className="py-8 text-center text-slate-400">
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <p>End of timeline data</p>
                <p className="text-sm mt-1">Scroll up to explore more moments</p>
              </div>
            )
          }}
        />
      </div>

      {/* Enhanced Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {groupedMoments.length.toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">Time Groups</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {moments.length.toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">Total Moments</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {moments.filter(m => m.star).length}
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

      {/* Enhanced Moment Modal */}
      {selectedMoment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{selectedMoment.title}</h2>
                <button
                  onClick={() => setSelectedMoment(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>{format(parseISO(selectedMoment.startTime), 'MMM dd, yyyy HH:mm')}</span>
                </div>
                
                {selectedMoment.location && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedMoment.location}</span>
                  </div>
                )}
                
                {selectedMoment.dedication && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-300 italic">"{selectedMoment.dedication}"</p>
                  </div>
                )}
                
                {selectedMoment.description && (
                  <p className="text-slate-300">{selectedMoment.description}</p>
                )}
                
                {selectedMoment.tags && selectedMoment.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedMoment.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 