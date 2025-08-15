'use client';
import Timeline from '@/components/Timeline';
import TimelineVirtuoso from '@/components/TimelineVirtuoso';
import { useState } from 'react';
import { Clock, Calendar, TrendingUp, Zap, Star, Globe, Crown, Maximize2 } from 'lucide-react';

// Enhanced sample data for demonstration
const sampleMoments = [
  {
    id: '1',
    title: 'First Steps',
    description: 'The beginning of a beautiful journey',
    startTime: '2024-01-15T10:30:00Z',
    endTime: '2024-01-15T11:00:00Z',
    isPublic: true,
    dedication: 'To new beginnings and endless possibilities',
    star: true,
    location: 'San Francisco, CA',
    tags: ['milestone', 'personal'],
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    count: 150,
    totalMoments: 150,
    starCount: 1,
    user: { name: 'Alex Chen', id: 'user1' }
  },
  {
    id: '2',
    title: 'Sunset at the Beach',
    description: 'A perfect evening watching the sun disappear into the ocean',
    startTime: '2024-02-20T18:00:00Z',
    endTime: '2024-02-20T19:30:00Z',
    isPublic: true,
    dedication: 'For the moments that take our breath away',
    star: false,
    location: 'Malibu, CA',
    tags: ['nature', 'peaceful', 'sunset'],
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    count: 89,
    totalMoments: 89,
    starCount: 0,
    user: { name: 'Maria Rodriguez', id: 'user2' }
  },
  {
    id: '3',
    title: 'Coffee with Friends',
    description: 'Catching up over lattes and laughter',
    startTime: '2024-03-10T14:00:00Z',
    endTime: '2024-03-10T16:00:00Z',
    isPublic: false,
    dedication: 'To friendship and shared memories',
    star: true,
    location: 'Downtown Coffee Shop',
    tags: ['friends', 'coffee', 'conversation'],
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    count: 234,
    totalMoments: 234,
    starCount: 1,
    user: { name: 'David Kim', id: 'user3' }
  },
  {
    id: '4',
    title: 'Mountain Hiking Adventure',
    description: 'Reached the summit and the view was absolutely breathtaking',
    startTime: '2024-04-05T08:00:00Z',
    endTime: '2024-04-05T17:00:00Z',
    isPublic: true,
    dedication: 'To the mountains that call us higher',
    star: true,
    location: 'Rocky Mountains, CO',
    tags: ['adventure', 'hiking', 'nature'],
    imageUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=400&h=300&fit=crop',
    count: 567,
    totalMoments: 567,
    starCount: 1,
    user: { name: 'Emma Wilson', id: 'user4' }
  },
  {
    id: '5',
    title: 'Late Night Coding Session',
    description: 'Building something amazing with great music and coffee',
    startTime: '2024-05-12T22:00:00Z',
    endTime: '2024-05-13T02:00:00Z',
    isPublic: false,
    dedication: 'To the creators who build the future',
    star: false,
    location: 'Home Office',
    tags: ['coding', 'creative', 'late-night'],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    count: 123,
    totalMoments: 123,
    starCount: 0,
    user: { name: 'James Miller', id: 'user5' }
  },
  {
    id: '6',
    title: 'Birthday Celebration',
    description: 'Another year of life, love, and laughter',
    startTime: '2024-06-15T19:00:00Z',
    endTime: '2024-06-15T23:00:00Z',
    isPublic: true,
    dedication: 'To growing older but never growing up',
    star: true,
    location: 'Local Restaurant',
    tags: ['birthday', 'celebration', 'family'],
    imageUrl: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=400&h=300&fit=crop',
    count: 445,
    totalMoments: 445,
    starCount: 1,
    user: { name: 'Sarah Johnson', id: 'user6' }
  },
  {
    id: '7',
    title: 'Morning Meditation',
    description: 'Finding peace in the quiet moments',
    startTime: '2024-07-08T06:00:00Z',
    endTime: '2024-07-08T06:30:00Z',
    isPublic: true,
    dedication: 'To inner peace and mindfulness',
    star: false,
    location: 'Garden',
    tags: ['meditation', 'peaceful', 'morning'],
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    count: 78,
    totalMoments: 78,
    starCount: 0,
    user: { name: 'Michael Brown', id: 'user7' }
  },
  {
    id: '8',
    title: 'Art Gallery Opening',
    description: 'Supporting local artists and their beautiful creations',
    startTime: '2024-08-22T18:30:00Z',
    endTime: '2024-08-22T21:00:00Z',
    isPublic: true,
    dedication: 'To the artists who make our world more beautiful',
    star: true,
    location: 'Downtown Gallery',
    tags: ['art', 'culture', 'community'],
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    count: 312,
    totalMoments: 312,
    starCount: 1,
    user: { name: 'Lisa Chen', id: 'user8' }
  }
];

// Time scale options with icons and descriptions
const timeScales = [
  { key: 'hour', label: 'Hour', icon: Clock, description: 'View moments by the hour', color: 'from-blue-500 to-cyan-500' },
  { key: 'day', label: 'Day', icon: Calendar, description: 'Daily timeline view', color: 'from-green-500 to-emerald-500' },
  { key: 'week', label: 'Week', icon: TrendingUp, description: 'Weekly overview', color: 'from-purple-500 to-pink-500' },
  { key: 'month', label: 'Month', icon: Calendar, description: 'Monthly timeline', color: 'from-orange-500 to-red-500' },
  { key: 'year', label: 'Year', icon: TrendingUp, description: 'Yearly perspective', color: 'from-indigo-500 to-purple-500' },
  { key: 'decade', label: 'Decade', icon: Star, description: 'Decade view', color: 'from-yellow-500 to-orange-500' },
  { key: 'century', label: 'Century', icon: Globe, description: 'Century timeline', color: 'from-red-500 to-pink-500' },
  { key: 'millennium', label: 'Millennium', icon: Crown, description: 'Millennium view', color: 'from-purple-500 to-indigo-500' },
  { key: 'max', label: 'Max', icon: Maximize2, description: 'Full timeline view', color: 'from-cyan-500 to-blue-500' },
];

export default function TimelinePage() {
  const [viewMode, setViewMode] = useState<'chart' | 'grid'>('chart');
  const [selectedTimeScale, setSelectedTimeScale] = useState('day');

  return (
    <main className="pt-20 pb-32 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Enhanced Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Explore the Timeline
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Journey through time and discover moments that shaped history, from the dawn of civilization 
          to the present day. Navigate through 12,000+ years of human experience with our enhanced timeline.
        </p>
      </div>

      {/* Enhanced View Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-800 rounded-lg p-1 border border-slate-700 shadow-lg">
          <button
            onClick={() => setViewMode('chart')}
            className={`px-6 py-3 rounded-md transition-all duration-300 flex items-center gap-2 ${
              viewMode === 'chart'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Chart View
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-6 py-3 rounded-md transition-all duration-300 flex items-center gap-2 ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Grid View
          </button>
        </div>
      </div>

      {/* Time Scale Toggle - NEW */}
      <div className="mb-12">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-slate-200 mb-2">Choose Your Time Scale</h3>
          <p className="text-slate-400">Zoom from hours to millennia to explore different perspectives of time</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 sm:gap-3 max-w-6xl mx-auto">
          {timeScales.map((scale) => {
            const IconComponent = scale.icon;
            return (
              <button
                key={scale.key}
                onClick={() => setSelectedTimeScale(scale.key)}
                className={`group relative p-2 sm:p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                  selectedTimeScale === scale.key
                    ? `bg-gradient-to-br ${scale.color} border-white shadow-lg shadow-purple-500/30`
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 hover:bg-slate-700/60'
                }`}
              >
                <div className="text-center">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 flex items-center justify-center rounded-full ${
                    selectedTimeScale === scale.key
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-700 text-slate-300 group-hover:text-white'
                  }`}>
                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <div className={`text-xs font-medium ${
                    selectedTimeScale === scale.key ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {scale.label}
                  </div>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                  {scale.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Current Selection Display */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg">
            <span className="text-slate-300">Current Scale:</span>
            <span className="font-semibold text-white">
              {timeScales.find(s => s.key === selectedTimeScale)?.label}
            </span>
            <span className="text-slate-400 text-sm">
              ({timeScales.find(s => s.key === selectedTimeScale)?.description})
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Timeline Components */}
      {viewMode === 'chart' ? (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">Interactive Timeline Chart</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Visualize moments across time with our enhanced D3-powered timeline. Zoom from hours to millennia 
              and explore human history with beautiful data visualization optimized for millions of data points.
            </p>
            <Timeline 
              showToday={true}
              timeScale={selectedTimeScale as any}
              onTimeScaleChange={(newTimeScale) => setSelectedTimeScale(newTimeScale)}
              onMomentClick={(moment) => {
                console.log('Moment clicked:', moment);
                // Handle moment click
              }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">Timeline Grid View</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Browse moments in a high-performance grid layout with virtual scrolling. Perfect for exploring 
              massive datasets with elegant time grouping and enhanced visual appeal.
            </p>
            <TimelineVirtuoso 
              moments={sampleMoments}
              onMomentClick={(moment) => {
                console.log('Moment clicked:', moment);
                // Handle moment click
              }}
            />
          </div>
        </div>
      )}

      {/* Enhanced Features Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Lightning Fast</h3>
          <p className="text-slate-400 leading-relaxed">
            Handle millions of data points with virtual scrolling, optimized rendering, and intelligent caching for smooth performance.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Smart Navigation</h3>
          <p className="text-slate-400 leading-relaxed">
            Zoom from hours to millennia with intuitive controls, smooth transitions, and intelligent time scale management.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Beautiful Design</h3>
          <p className="text-slate-400 leading-relaxed">
            Elegant visualizations with smooth animations, enhanced hover effects, and modern UI components.
          </p>
        </div>
      </div>

      {/* Enhanced Historical Context */}
      <div className="mt-16 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700 p-8">
        <h2 className="text-2xl font-semibold text-slate-200 mb-4">12,000 Years of Human History</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-200 mb-3">From Ancient Civilizations to Today</h3>
            <p className="text-slate-400 mb-4 leading-relaxed">
              Our enhanced timeline spans from the dawn of agriculture around 10,000 BCE to the present day, 
              covering the rise and fall of empires, scientific discoveries, cultural revolutions, 
              and personal moments that shaped our world.
            </p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                Agricultural Revolution (10,000 BCE)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                First Cities (3500 BCE)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Classical Antiquity (500 BCE - 500 CE)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                Middle Ages (500 - 1500 CE)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                Age of Discovery (1400 - 1800 CE)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                Industrial Revolution (1760 - 1840 CE)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                Modern Era (1900 - Present)
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Enhanced Timeline Features</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                Zoom from hours to millennia
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Navigate through time with ease
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Handle millions of data points efficiently
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                Beautiful data visualization
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                Interactive moment exploration
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                Real-time data updates
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                Responsive design for all devices
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 