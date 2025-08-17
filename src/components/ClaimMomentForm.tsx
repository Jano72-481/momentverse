'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { formatPrice, calculatePrice } from '@/lib/utils'
import { Clock, Star, Award, Calendar, MessageSquare, Eye, EyeOff, Zap, Share2, Heart, TrendingUp, Users, Sparkles, CheckCircle } from 'lucide-react'

interface ClaimMomentFormProps {
  onSuccess: () => void
  startTime?: string
  endTime?: string
  hasStarAddon?: boolean
}

export function ClaimMomentForm({ onSuccess, startTime: initialStartTime, endTime: initialEndTime, hasStarAddon: initialHasStarAddon = false }: ClaimMomentFormProps) {
  // Set default times (current time and 1 minute later)
  const now = new Date()
  const oneMinuteLater = new Date(now.getTime() + 60000)
  
  const [startTime, setStartTime] = useState(initialStartTime || now.toISOString().slice(0, 16))
  const [endTime, setEndTime] = useState(initialEndTime || oneMinuteLater.toISOString().slice(0, 16))
  const [dedication, setDedication] = useState('This moment represents a special time in my life that I want to preserve forever.')
  const [isPublic, setIsPublic] = useState(true)
  const [hasStarAddon, setHasStarAddon] = useState(initialHasStarAddon)
  const [hasPremiumCert, setHasPremiumCert] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showViralStats, setShowViralStats] = useState(false)

  // Optimize price calculation with useMemo
  const price = useMemo(() => calculatePrice(
    startTime ? new Date(startTime) : new Date(),
    endTime ? new Date(endTime) : new Date(),
    hasStarAddon,
    hasPremiumCert
  ), [startTime, endTime, hasStarAddon, hasPremiumCert])

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

  // Live summary
  const summary = (
    <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-700/30 to-cyan-700/20 border border-purple-500/30 flex flex-col md:flex-row items-center gap-4">
      <div className="flex items-center gap-2 text-white">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <span className="font-semibold">{isPublic ? 'Public' : 'Private'} Moment</span>
      </div>
      <div className="flex items-center gap-2 text-white">
        <Star className="w-5 h-5 text-yellow-400" />
        <span>{hasStarAddon ? 'Star Paired' : 'No Star'}</span>
      </div>
      <div className="flex items-center gap-2 text-white">
        <Award className="w-5 h-5 text-fuchsia-400" />
        <span>{hasPremiumCert ? 'Premium Certificate' : 'Standard Certificate'}</span>
      </div>
    </div>
  );

  // Certificate preview (mock)
  const certPreview = hasPremiumCert ? (
    <div className="mb-6 flex justify-center">
      <div className="w-64 h-40 bg-gradient-to-br from-yellow-200/80 to-fuchsia-200/60 border-4 border-yellow-400 rounded-xl shadow-xl flex items-center justify-center relative overflow-hidden">
        <span className="absolute top-2 right-2 text-xs bg-yellow-400 text-white px-2 py-1 rounded-full font-bold shadow">PREMIUM</span>
        <div className="text-center">
          <div className="text-lg font-bold text-fuchsia-700 mb-1">Certificate of Eternity</div>
          <div className="text-xs text-fuchsia-900 mb-2">This certifies a moment is dedicated forever</div>
          <div className="text-xs text-yellow-700">{dedication.slice(0, 40)}...</div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {summary}
      {certPreview}
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
              <div className="text-2xl font-bold text-white">2.1M</div>
              <div className="text-xs text-gray-400">TikTok Views</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">89%</div>
              <div className="text-xs text-gray-400">Share Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">$847</div>
              <div className="text-xs text-gray-400">Avg. Value</div>
            </div>
          </div>
        )}
      </div>
      {/* Dedication */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-fuchsia-400" />
          Your Dedication
        </h3>
        <textarea
          value={dedication}
          onChange={(e) => setDedication(e.target.value)}
          placeholder="Describe what this moment means to you..."
          className="w-full min-h-[120px] resize-none bg-slate-800/60 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          required
        />
      </div>
      {/* Privacy Settings */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-fuchsia-400" />
          Privacy Settings
        </h3>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="privacy"
              value="public"
              checked={isPublic}
              onChange={() => setIsPublic(true)}
              className="text-fuchsia-600 focus:ring-fuchsia-500"
            />
            <span className="text-white">Public - Share with the world</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="privacy"
              value="private"
              checked={!isPublic}
              onChange={() => setIsPublic(false)}
              className="text-fuchsia-600 focus:ring-fuchsia-500"
            />
            <span className="text-white">Private - Just for you</span>
          </label>
        </div>
      </div>
      {/* Add-ons */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-fuchsia-400" />
          Enhance Your Moment
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-black/20 rounded-lg cursor-pointer hover:bg-black/30 transition-colors">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={hasStarAddon}
                onChange={(e) => setHasStarAddon(e.target.checked)}
                className="text-fuchsia-600 focus:ring-fuchsia-500"
              />
              <Star className="w-5 h-5 text-fuchsia-400" />
              <div>
                <div className="text-white font-semibold">Star Pairing</div>
                <div className="text-gray-400 text-sm">Pair your moment with a real star</div>
              </div>
            </div>
            <div className="text-fuchsia-400 font-semibold">+$3</div>
          </label>
          <label className="flex items-center justify-between p-4 bg-black/20 rounded-lg cursor-pointer hover:bg-black/30 transition-colors">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={hasPremiumCert}
                onChange={(e) => setHasPremiumCert(e.target.checked)}
                className="text-fuchsia-600 focus:ring-fuchsia-500"
              />
              <Award className="w-5 h-5 text-fuchsia-400" />
              <div>
                <div className="text-white font-semibold">Premium Certificate</div>
                <div className="text-gray-400 text-sm">Gold border & embossed seal</div>
              </div>
            </div>
            <div className="text-fuchsia-400 font-semibold">+$6</div>
          </label>
        </div>
      </div>
      {/* Price Summary */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Total</h3>
          <div className="text-3xl font-bold text-fuchsia-400 animate-pulse">{formatPrice(price)}</div>
        </div>
        <div className="text-sm text-gray-400 space-y-1">
          <div>Base moment dedication</div>
          {hasStarAddon && <div>+ Star pairing</div>}
          {hasPremiumCert && <div>+ Premium certificate</div>}
        </div>
      </div>
      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-lg py-6 font-semibold rounded-xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all focus:ring-2 focus:ring-purple-500"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="spinner-optimized w-5 h-5"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Dedicate to Eternity</span>
          </div>
        )}
      </Button>
      {/* Share Button */}
      <Button
        type="button"
        onClick={handleShare}
        variant="outline"
        className="w-full glass-card text-white border-white/20 hover:bg-white/10 mt-2 shadow-md hover:scale-105 transition-all"
      >
        <Share2 className="w-5 h-5 mr-2" />
        Share This Experience
      </Button>
    </form>
  )
} 