'use client'

import { Star, Sparkles } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Main spinning star */}
        <Star 
          className={`${sizeClasses[size]} text-blue-400 animate-spin`}
        />
        
        {/* Orbiting sparkles */}
        <Sparkles 
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 animate-pulse`}
          style={{
            animation: 'orbit 2s linear infinite'
          }}
        />
        <Sparkles 
          className={`absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 text-pink-400 animate-pulse`}
          style={{
            animation: 'orbit 2s linear infinite reverse'
          }}
        />
        <Sparkles 
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 text-yellow-400 animate-pulse`}
          style={{
            animation: 'orbit 2s linear infinite'
          }}
        />
      </div>
      
      {text && (
        <p className={`mt-4 text-gray-300 ${textSizes[size]} text-center`}>
          {text}
        </p>
      )}
      
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(20px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(20px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  )
}

// Full screen loading component
export function FullScreenLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen star-field cosmic-bg flex items-center justify-center">
      <div className="glass-card p-8 text-center">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  )
}

// Inline loading component
export function InlineLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner size="md" text={text} />
    </div>
  )
}

// Button loading state
export function ButtonLoader({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className="flex items-center">
      <div className={`animate-spin rounded-full border-b-2 border-white ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} mr-2`}></div>
      <span>Loading...</span>
    </div>
  )
}

// Skeleton loading component
export function SkeletonLoader({ className = '', lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className="h-4 bg-gray-600 rounded mb-2"
          style={{ 
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${i * 0.1}s`
          }}
        ></div>
      ))}
    </div>
  )
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-600 rounded mb-2"></div>
          <div className="h-3 bg-gray-600 rounded w-2/3"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-600 rounded w-5/6"></div>
        <div className="h-4 bg-gray-600 rounded w-4/6"></div>
      </div>
    </div>
  )
} 