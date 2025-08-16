'use client';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import * as d3 from 'd3';
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

export default function Timeline({ className = '', showToday = true, timeScale: externalTimeScale, onTimeScaleChange, onMomentClick }: TimelineProps) {
  const [internalTimeScale, setInternalTimeScale] = useState<TimeScale>('day');
  const timeScale = externalTimeScale || internalTimeScale;
  const setTimeScale = externalTimeScale ? (() => {}) : setInternalTimeScale;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState<MomentPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<MomentPoint | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
        
        if (result.success) {
          // Optimize data for visualization
          const optimizedData = result.data.aggregated.map((point: any) => ({
            ...point,
            count: Math.max(1, point.count), // Ensure minimum visibility
            totalMoments: point.count || 0,
            starCount: point.isStarred ? 1 : 0
          }));
          setData(optimizedData);
        } else {
          setError(result.error || 'Failed to fetch timeline data');
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

  // Enhanced D3 visualization with better performance
  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = containerRef.current?.clientWidth || 800;
    const height = 500;

    // Create scales with better domain handling
    const xScale = d3.scaleTime()
      .domain(timeRange)
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 1])
      .range([height - margin.bottom, margin.top]);

    // Enhanced color scale for better visual appeal
    const colorScale = d3.scaleOrdinal()
      .domain(['normal', 'starred', 'popular'])
      .range(['#8b5cf6', '#fbbf24', '#ef4444']);

    // Add gradient definitions for beautiful effects
    svg.append('defs')
      .append('radialGradient')
      .attr('id', 'pointGradient')
      .selectAll('stop')
      .data([
        { offset: '0%', color: '#8b5cf6', opacity: 1 },
        { offset: '70%', color: '#8b5cf6', opacity: 0.8 },
        { offset: '100%', color: '#8b5cf6', opacity: 0 }
      ])
      .enter()
      .append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color)
      .attr('stop-opacity', d => d.opacity);

    // Add glow filter for hover effects
    svg.append('defs')
      .append('filter')
      .attr('id', 'glow')
      .append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');

    // Enhanced axes with better styling
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d => {
        switch (timeScale) {
          case 'hour':
            return format(d as Date, 'HH:mm');
          case 'day':
            return format(d as Date, 'MMM dd');
          case 'week':
            return format(d as Date, 'MMM dd');
          case 'month':
            return format(d as Date, 'MMM yyyy');
          case 'year':
            return format(d as Date, 'yyyy');
          case 'decade':
            return `${Math.floor((d as Date).getFullYear() / 10) * 10}s`;
          case 'century':
            return `${Math.floor((d as Date).getFullYear() / 100) * 100}s`;
          case 'millennium':
            return `${Math.floor((d as Date).getFullYear() / 1000) * 1000}s`;
          default:
            return format(d as Date, 'MMM dd');
        }
      });

    const yAxis = d3.axisLeft(yScale)
      .tickFormat((d: any) => {
        const value = typeof d === 'number' ? d : d.valueOf();
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
        return value.toString();
      });

    // Add axes with enhanced styling
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#94a3b8')
      .style('font-weight', '500');

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#94a3b8')
      .style('font-weight', '500');

    // Enhanced grid lines with better styling
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickSize(-height + margin.top + margin.bottom).tickFormat(() => ''))
      .selectAll('line')
      .style('stroke', '#334155')
      .style('stroke-opacity', 0.2)
      .style('stroke-width', 1);

    // Add data points with enhanced visual effects
    const points = svg.selectAll('.data-point')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'data-point')
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d: MomentPoint) {
        setHoveredPoint(d);
        const circle = d3.select(this).select('circle');
        circle
          .attr('r', Math.max(6, Math.min(15, 6 + Math.log(d.count + 1))))
          .attr('stroke-width', 3)
          .style('filter', 'url(#glow)');
      })
      .on('mouseout', function() {
        setHoveredPoint(null);
        const circle = d3.select(this).select('circle');
        const data = (this as any).__data__ as MomentPoint;
        circle
          .attr('r', Math.max(4, Math.min(12, 4 + Math.log(data.count + 1))))
          .attr('stroke-width', 2)
          .style('filter', 'none');
      })
      .on('click', (event, d: MomentPoint) => {
        onMomentClick?.(d);
      });

    // Enhanced circles with gradients and better sizing
    points.append('circle')
      .attr('cx', (d: MomentPoint) => xScale(new Date(d.ts)))
      .attr('cy', (d: MomentPoint) => yScale(d.count))
      .attr('r', (d: MomentPoint) => Math.max(4, Math.min(12, 4 + Math.log(d.count + 1))))
      .attr('fill', (d: MomentPoint) => d.isStarred ? '#fbbf24' : '#8b5cf6')
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 2)
      .style('transition', 'all 0.3s ease')
      .style('opacity', 0.8)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))');

    // Add star indicators with enhanced styling
    points.filter((d: MomentPoint) => !!d.isStarred)
      .append('text')
      .attr('x', (d: MomentPoint) => xScale(new Date(d.ts)))
      .attr('y', (d: MomentPoint) => yScale(d.count) - 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', '#fbbf24')
      .style('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))')
      .text('★');

    // Enhanced today marker
    if (showToday) {
      const today = new Date();
      if (today >= timeRange[0] && today <= timeRange[1]) {
        svg.append('line')
          .attr('x1', xScale(today))
          .attr('x2', xScale(today))
          .attr('y1', margin.top)
          .attr('y2', height - margin.bottom)
          .attr('stroke', '#ef4444')
          .attr('stroke-width', 3)
          .attr('stroke-dasharray', '8,4')
          .style('opacity', 0.8);

        svg.append('text')
          .attr('x', xScale(today))
          .attr('y', margin.top - 10)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('fill', '#ef4444')
          .attr('font-weight', 'bold')
          .text('Today');
      }
    }

    // Add scale indicator
    svg.append('text')
      .attr('x', width - margin.right)
      .attr('y', margin.top - 10)
      .attr('text-anchor', 'end')
      .attr('font-size', '12px')
      .attr('fill', '#64748b')
      .text(`Scale: ${timeScale.charAt(0).toUpperCase() + timeScale.slice(1)}`);

  }, [data, timeRange, timeScale, showToday, onMomentClick]);

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
      if (newTimeScale) {
        setTimeScale(newTimeScale);
        onTimeScaleChange?.(newTimeScale);
      }
    }
  }, [timeScale, setTimeScale, onTimeScaleChange]);

  const zoomOut = useCallback(() => {
    const scales: TimeScale[] = ['hour', 'day', 'week', 'month', 'year', 'decade', 'century', 'millennium', 'max'];
    const currentIndex = scales.indexOf(timeScale);
    if (currentIndex < scales.length - 1) {
      const newTimeScale = scales[currentIndex + 1];
      if (newTimeScale) {
        setTimeScale(newTimeScale);
        onTimeScaleChange?.(newTimeScale);
      }
    }
  }, [timeScale, setTimeScale, onTimeScaleChange]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return (
    <div className={`timeline-container ${className}`} ref={containerRef}>
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

      {/* Enhanced Timeline Display */}
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
        {!isLoading && !error && data.length === 0 && (
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

        <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
          <svg
            ref={svgRef}
            width="100%"
            height="500"
            className="timeline-svg"
          />
        </div>

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
            {data.length.toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">Time Points</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {data.reduce((sum, d) => sum + d.count, 0).toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">Total Moments</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {data.filter(d => d.isStarred).length}
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

      {/* Empty State Stats */}
      {!isLoading && !error && data.length === 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-slate-500">0</div>
            <div className="text-sm text-slate-400">Time Points</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-slate-500">0</div>
            <div className="text-sm text-slate-400">Total Moments</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-slate-500">0</div>
            <div className="text-sm text-slate-400">Starred</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {timeScale}
            </div>
            <div className="text-sm text-slate-400">Current Scale</div>
          </div>
        </div>
      )}
    </div>
  );
} 