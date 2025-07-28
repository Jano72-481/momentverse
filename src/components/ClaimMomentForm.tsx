'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatPrice, calculatePrice } from '@/lib/utils'
import { Clock, Star, Award, Calendar, MessageSquare, Eye, EyeOff, Zap, Share2, Heart, TrendingUp, Users, Sparkles } from 'lucide-react'

interface ClaimMomentFormProps {
  onSuccess: () => void
}

export function ClaimMomentForm({ onSuccess }: ClaimMomentFormProps) {
  // Set default times (current time and 1 minute later)
  const now = new Date()
  const oneMinuteLater = new Date(now.getTime() + 60000)
  
  const [startTime, setStartTime] = useState(now.toISOString().slice(0, 16))
  const [endTime, setEndTime] = useState(oneMinuteLater.toISOString().slice(0, 16))
  const [dedication, setDedication] = useState('This moment represents a special time in my life that I want to preserve forever.')
  const [isPublic, setIsPublic] = useState(true)
  const [hasStarAddon, setHasStarAddon] = useState(false)
  const [hasPremiumCert, setHasPremiumCert] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showViralStats, setShowViralStats] = useState(false)

  const price = calculatePrice(
    startTime ? new Date(startTime) : new Date(),
    endTime ? new Date(endTime) : new Date(),
    hasStarAddon,
    hasPremiumCert
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/moments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime,
          endTime,
          dedication,
          isPublic,
          hasStarAddon,
          hasPremiumCert,
        }),
      })

      if (response.ok) {
        const { checkoutUrl } = await response.json()
        window.location.href = checkoutUrl
      } else {
        throw new Error('Failed to create moment')
      }
    } catch (error) {
      console.error('Error creating moment:', error)
      alert('Failed to create moment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'I just dedicated a moment to eternity!',
          text: 'Check out my moment on MomentVerse - where time meets eternity!',
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Viral Stats Banner */}
      <div className="glass-card p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-purple-400 animate-pulse" />
            <div>
              <div className="text-white font-semibold">🔥 Trending on TikTok</div>
              <div className="text-gray-300 text-sm">Join 1,247+ people who've dedicated moments</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowViralStats(!showViralStats)}
            className="text-purple-400 hover:text-white transition-colors"
          >
            {showViralStats ? 'Hide' : 'Show'} Stats
          </button>
        </div>
        
        {showViralStats && (
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-gray-300 text-sm">Moments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">892</div>
              <div className="text-gray-300 text-sm">Stars</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">$12,847</div>
              <div className="text-gray-300 text-sm">Value</div>
            </div>
          </div>
        )}
      </div>

      {/* Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-base font-semibold text-white mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-blue-400" />
            Start Time
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="premium-input w-full p-3 text-base"
            placeholder="Select start time"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-base font-semibold text-white mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-purple-400" />
            End Time
          </label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="premium-input w-full p-3 text-base"
            placeholder="Select end time"
          />
        </div>
      </div>

      {/* Dedication */}
      <div className="space-y-2">
        <label className="block text-base font-semibold text-white mb-2 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2 text-green-400" />
          Dedication (Optional)
        </label>
        <textarea
          value={dedication}
          onChange={(e) => setDedication(e.target.value)}
          placeholder="What makes this moment special? Share your story..."
          rows={3}
          className="premium-input w-full p-3 text-base resize-none"
        />
        <div className="text-gray-400 text-sm flex items-center">
          <Sparkles className="w-3 h-3 mr-1" />
          Pro tip: Emotional stories get more engagement on social media!
        </div>
      </div>

      {/* Privacy Toggle */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isPublic ? (
              <Eye className="w-4 h-4 text-blue-400" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
            <div>
              <label className="text-base font-semibold text-white">Privacy Setting</label>
              <p className="text-gray-400 text-sm">
                {isPublic ? 'Public - Visible on timeline' : 'Private - Only you can see'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ${
              isPublic ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                isPublic ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Enhanced Add-ons */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" />
          Premium Add-ons
        </h3>
        
        <div className="glass-card p-4 group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <label className="text-base font-semibold text-white flex items-center">
                  <input
                    type="checkbox"
                    checked={hasStarAddon}
                    onChange={(e) => setHasStarAddon(e.target.checked)}
                    className="mr-2 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  Star Pairing
                </label>
                <p className="text-gray-400 text-sm">Pair your moment with a real star from the cosmos</p>
              </div>
            </div>
            <span className="text-xl font-bold text-purple-400">+$3</span>
          </div>
        </div>

        <div className="glass-card p-4 group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <label className="text-base font-semibold text-white flex items-center">
                  <input
                    type="checkbox"
                    checked={hasPremiumCert}
                    onChange={(e) => setHasPremiumCert(e.target.checked)}
                    className="mr-2 w-4 h-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  Premium Certificate
                </label>
                <p className="text-gray-400 text-sm">Gold border and embossed seal design</p>
              </div>
            </div>
            <span className="text-xl font-bold text-yellow-400">+$5</span>
          </div>
        </div>
      </div>

      {/* Enhanced Price Summary */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-semibold text-white">Base Price:</span>
          <span className="text-lg text-gray-300">$5.00</span>
        </div>
        
        {hasStarAddon && (
          <div className="flex justify-between items-center mb-3">
            <span className="text-base text-gray-300">Star Pairing:</span>
            <span className="text-base text-purple-400">+$3.00</span>
          </div>
        )}
        
        {hasPremiumCert && (
          <div className="flex justify-between items-center mb-3">
            <span className="text-base text-gray-300">Premium Certificate:</span>
            <span className="text-base text-yellow-400">+$5.00</span>
          </div>
        )}
        
        <div className="border-t border-white/20 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-white">Total Price:</span>
            <span className="text-2xl font-bold text-blue-400">{formatPrice(price)}</span>
          </div>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Share2 className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-white font-semibold">Share Your Moment</div>
              <div className="text-gray-400 text-sm">Let friends know about your cosmic dedication</div>
            </div>
          </div>
          <Button
            type="button"
            onClick={handleShare}
            variant="outline"
            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
          >
            Share
          </Button>
        </div>
      </div>

      {/* Enhanced Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !startTime || !endTime}
        className="w-full premium-button text-lg py-4 font-bold group"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          <div className="flex items-center">
            <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Proceed to Checkout
          </div>
        )}
      </Button>
    </form>
  )
} 