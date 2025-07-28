'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { StarField } from '@/components/StarField'
import { Clock, Star, Award, Download, Share2, Heart } from 'lucide-react'

interface Moment {
  id: string
  startTime: string
  endTime: string
  dedication: string
  isPublic: boolean
  hasStarAddon: boolean
  hasPremiumCert: boolean
  certificateUrl?: string
  certificateGenerated: boolean
  createdAt: string
}

export default function ProfilePage() {
  const [moments, setMoments] = useState<Moment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Temporarily show demo data
    setMoments([
      {
        id: 'demo-1',
        startTime: '2024-01-15T10:00:00Z',
        endTime: '2024-01-15T10:01:00Z',
        dedication: 'My first moment dedicated to eternity',
        isPublic: true,
        hasStarAddon: true,
        hasPremiumCert: false,
        certificateGenerated: true,
        certificateUrl: '/certificates/demo.pdf',
        createdAt: '2024-01-15T10:00:00Z'
      }
    ])
    setLoading(false)
  }, [])

  return (
    <div className="min-h-screen star-field cosmic-bg">
      <StarField />
      
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold gradient-text mb-4">
              My Moments
            </h1>
            <p className="text-2xl text-gray-300">
              Welcome back, Demo User
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="glass-card p-6 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <div className="text-3xl font-bold text-white mb-2">{moments.length}</div>
              <div className="text-gray-300">Total Moments</div>
            </div>
            <div className="glass-card p-6 text-center">
              <Star className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <div className="text-3xl font-bold text-white mb-2">
                {moments.filter(m => m.hasStarAddon).length}
              </div>
              <div className="text-gray-300">Star Pairings</div>
            </div>
            <div className="glass-card p-6 text-center">
              <Award className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <div className="text-3xl font-bold text-white mb-2">
                {moments.filter(m => m.hasPremiumCert).length}
              </div>
              <div className="text-gray-300">Premium Certs</div>
            </div>
            <div className="glass-card p-6 text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-pink-400" />
              <div className="text-3xl font-bold text-white mb-2">
                {moments.filter(m => m.isPublic).length}
              </div>
              <div className="text-gray-300">Public Moments</div>
            </div>
          </div>

          {/* Moments List */}
          {loading ? (
            <div className="text-center text-white text-xl">Loading your moments...</div>
          ) : moments.length === 0 ? (
            <div className="text-center">
              <div className="glass-card p-12 max-w-md mx-auto">
                <Star className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-bold text-white mb-4">No Moments Yet</h3>
                <p className="text-gray-300 mb-6">
                  You haven't dedicated any moments yet. Create your first moment to get started!
                </p>
                <Button className="premium-button">
                  Create Your First Moment
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {moments.map((moment) => (
                <div key={moment.id} className="glass-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {moment.dedication}
                      </h3>
                      <div className="text-gray-300 text-sm">
                        {new Date(moment.startTime).toLocaleString()} - {new Date(moment.endTime).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {moment.hasStarAddon && (
                        <div className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                          ⭐ Star
                        </div>
                      )}
                      {moment.hasPremiumCert && (
                        <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                          🏆 Premium
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {moment.certificateGenerated && moment.certificateUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                          onClick={() => window.open(moment.certificateUrl, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Certificate
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                        onClick={() => {
                          const url = `${window.location.origin}/moment/${moment.id}`
                          navigator.clipboard.writeText(url)
                          alert('Link copied to clipboard!')
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {new Date(moment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 