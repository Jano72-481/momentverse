'use client'

import { useEffect, useRef, useState } from 'react'
import { Star, Calendar, Clock, Heart } from 'lucide-react'

interface Moment {
  id: string
  startTime: string
  endTime: string
  dedication?: string
  isPublic: boolean
  star?: {
    name: string
  }
}

interface TimelineCanvasProps {
  moments: Moment[]
}

export function TimelineCanvas({ moments }: TimelineCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    const container = canvasRef.current
    let startX = 0
    let scrollLeft = 0

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true)
      startX = e.pageX - container.offsetLeft
      scrollLeft = container.scrollLeft
      container.style.cursor = 'grabbing'
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const x = e.pageX - container.offsetLeft
      const walk = (x - startX) * 2
      container.scrollLeft = scrollLeft - walk
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      container.style.cursor = 'grab'
    }

    container.addEventListener('mousedown', handleMouseDown)
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('mouseleave', handleMouseUp)

    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [isDragging])

  const sortedMoments = moments.sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const durationMs = end.getTime() - start.getTime()
    const seconds = Math.floor(durationMs / 1000)
    
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  return (
    <div className="relative">
      {/* Timeline Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-4 text-gray-400">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">Timeline</span>
          </div>
          <div className="w-px h-4 bg-gray-600"></div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">{sortedMoments.length} Moments</span>
          </div>
          <div className="w-px h-4 bg-gray-600"></div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span className="text-sm font-medium">
              {sortedMoments.filter(m => m.star).length} Starred
            </span>
          </div>
        </div>
      </div>

      {/* Timeline Container */}
      <div 
        ref={canvasRef}
        className="timeline-container cursor-grab active:cursor-grabbing"
      >
        <div className="inline-flex items-center min-w-full py-8">
          {/* Enhanced Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 timeline-line transform -translate-y-1/2"></div>
          
          {/* Moment nodes */}
          {sortedMoments.map((moment, index) => (
            <div
              key={moment.id}
              className="timeline-node claimed relative group"
              title={moment.isPublic && moment.dedication ? moment.dedication : 'Dedicated moment'}
              onClick={() => setSelectedMoment(selectedMoment?.id === moment.id ? null : moment)}
            >
              {/* Node Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>
              
              {/* Star indicator */}
              {moment.star && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-yellow-900" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Enhanced Tooltip/Modal */}
      {selectedMoment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card-dark p-8 max-w-md w-full relative">
            <button
              onClick={() => setSelectedMoment(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Dedicated Moment</h3>
              <p className="text-gray-400">
                {formatDate(selectedMoment.startTime)} - {formatDate(selectedMoment.endTime)}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 glass-card rounded-lg">
                <span className="text-gray-300">Duration:</span>
                <span className="text-blue-400 font-semibold">
                  {calculateDuration(selectedMoment.startTime, selectedMoment.endTime)}
                </span>
              </div>
              
              {selectedMoment.dedication && (
                <div className="p-4 glass-card rounded-lg">
                  <p className="text-white text-lg leading-relaxed">
                    "{selectedMoment.dedication}"
                  </p>
                </div>
              )}
              
              {selectedMoment.star && (
                <div className="flex items-center justify-center space-x-2 p-3 glass-card rounded-lg">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">
                    Paired with {selectedMoment.star.name}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                {selectedMoment.isPublic ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Public dedication</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Private dedication</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced Navigation hints */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center space-x-6 text-gray-400 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Drag to scroll</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <span>Click nodes for details</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span>⭐ = Star paired</span>
          </div>
        </div>
      </div>
    </div>
  )
} 