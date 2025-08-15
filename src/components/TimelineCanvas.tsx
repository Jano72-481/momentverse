'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { Star, Calendar, Clock, MapPin } from 'lucide-react';

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
}

interface TimelineCanvasProps {
  moments: Moment[];
  onMomentClick?: (moment: Moment) => void;
  className?: string;
}

export function TimelineCanvas({ moments, onMomentClick, className = '' }: TimelineCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      container.style.cursor = 'grab';
    };

    const handleScroll = () => {
      setScrollPosition(container.scrollLeft);
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isDragging]);

  const sortedMoments = moments.sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy HH:mm');
  };

  const calculateDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return null;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const handleMomentClick = useCallback((moment: Moment) => {
    setSelectedMoment(selectedMoment?.id === moment.id ? null : moment);
    onMomentClick?.(moment);
  }, [selectedMoment, onMomentClick]);

  return (
    <div className={`timeline-canvas ${className}`}>
      {/* Timeline Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Your Timeline</h2>
        <p className="text-slate-400">
          {sortedMoments.length} moments captured across time
        </p>
      </div>

      {/* Timeline Container */}
      <div 
        ref={canvasRef}
        className="timeline-container cursor-grab active:cursor-grabbing overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="inline-flex items-center min-w-full py-8 relative">
          {/* Enhanced Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 transform -translate-y-1/2 rounded-full shadow-lg"></div>
          
          {/* Moment nodes */}
          {sortedMoments.map((moment, index) => (
            <div
              key={moment.id}
              className="timeline-node relative group mx-8"
              title={moment.isPublic && moment.dedication ? moment.dedication : 'Dedicated moment'}
              onClick={() => handleMomentClick(moment)}
            >
              {/* Node Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>
              
              {/* Main Node */}
              <div className={`relative w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                moment.star 
                  ? 'bg-yellow-400 border-yellow-300 shadow-lg shadow-yellow-400/50' 
                  : 'bg-purple-500 border-purple-300 shadow-lg shadow-purple-500/50'
              } group-hover:scale-125`}>
                
                {/* Star indicator */}
                {moment.star && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-1.5 h-1.5 text-yellow-900" />
                  </div>
                )}
              </div>

              {/* Moment Info Card */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl min-w-48">
                  <div className="flex items-start gap-2">
                    {moment.imageUrl && (
                      <img 
                        src={moment.imageUrl} 
                        alt={moment.title}
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-200 text-sm">{moment.title}</h4>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(moment.startTime)}
                      </div>
                      {moment.location && (
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                          <MapPin className="w-3 h-3" />
                          {moment.location}
                        </div>
                      )}
                      {moment.endTime && (
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                          <Clock className="w-3 h-3" />
                          {calculateDuration(moment.startTime, moment.endTime)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Enhanced Tooltip/Modal */}
      {selectedMoment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-200">{selectedMoment.title}</h3>
              <button
                onClick={() => setSelectedMoment(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(selectedMoment.startTime)}</span>
              </div>
              
              {selectedMoment.location && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedMoment.location}</span>
                </div>
              )}
              
              {selectedMoment.endTime && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Clock className="w-4 h-4" />
                  <span>Duration: {calculateDuration(selectedMoment.startTime, selectedMoment.endTime)}</span>
                </div>
              )}
              
              {selectedMoment.description && (
                <p className="text-sm text-slate-400 mt-3">{selectedMoment.description}</p>
              )}
              
              {selectedMoment.dedication && (
                <div className="mt-3 p-3 bg-slate-700 rounded border-l-4 border-purple-500">
                  <p className="text-sm text-slate-300 italic">"{selectedMoment.dedication}"</p>
                </div>
              )}
              
              {selectedMoment.tags && selectedMoment.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {selectedMoment.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  // Handle view moment
                  window.open(`/moment/${selectedMoment.id}`, '_blank');
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => setSelectedMoment(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 