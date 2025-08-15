'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import StarField from '@/components/StarField'
import { LoadingSpinner, CardSkeleton } from '@/components/LoadingSpinner'
import { Clock, Star, Award, Download, Share2, Heart, User, LogOut, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface Moment {
  id: string
  startTime: string
  endTime: string
  dedication: string
  isPublic: boolean
  hasStarAddon?: boolean
  hasPremiumCert?: boolean
  certificateUrl?: string
  certificateGenerated?: boolean
  createdAt: string
  order?: {
    status: string
    amount: number
  }
  star?: {
    name: string
  }
}

interface PaginationInfo {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function ProfilePage() {
  const session = useSession()
  const router = useRouter()
  const [moments, setMoments] = useState<Moment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Show loading while session is being determined
  if (!session || (session.status as string) === 'loading') {
    return (
      <div className="min-h-screen night-sky-bg flex items-center justify-center">
        <StarField />
        <div className="relative z-10">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (!session || session.status === 'loading') return

    if (session.status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session.status === 'authenticated' && session.data) {
      fetchUserMoments()
    }
  }, [session, session.status, session.data, router, currentPage, statusFilter])

  const fetchUserMoments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter })
      })
      
      const response = await fetch(`/api/moments/user?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch moments')
      }

      const data = await response.json()
      setMoments(data.moments || [])
      setPagination(data.pagination || null)
    } catch (error) {
      console.error('Error fetching moments:', error)
      setError('Failed to load your moments')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const handleDownloadCertificate = async (momentId: string) => {
    try {
      const response = await fetch(`/api/certificates/${momentId}`)
      
      if (!response.ok) {
        throw new Error('Failed to download certificate')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `momentverse-certificate-${momentId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading certificate:', error)
      alert('Failed to download certificate. Please try again.')
    }
  }

  const handleShareMoment = (momentId: string) => {
    const url = `${window.location.origin}/moment/${momentId}`
    
    if (navigator.share) {
      navigator.share({
        title: 'My Moment in Eternity',
        text: 'Check out my moment dedicated to eternity on MomentVerse!',
        url: url
      })
    } else {
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus)
    setCurrentPage(1) // Reset to first page when filtering
  }

  // Handle loading state
  if (session.status === 'loading') {
    return <LoadingSpinner size="lg" text="Loading your profile..." />
  }

  // Handle unauthenticated state
  if (session.status === 'unauthenticated') {
    return null // Will redirect to signin
  }

  // Handle missing session data
  if (!session.data) {
    return <LoadingSpinner size="lg" text="Loading session..." />
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <StarField />
      
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gradient">
                  {session.data.user?.name || 'User'}
                </h1>
                <p className="text-xl text-gray-300">
                  {session.data.user?.email}
                </p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => router.push('/')}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Moment
              </Button>
              
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="glass-card p-6 text-center group hover:scale-105 transition-all duration-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-3xl font-bold text-white mb-2">{pagination?.totalCount || moments.length}</div>
              <div className="text-gray-300">Total Moments</div>
            </div>
            <div className="glass-card p-6 text-center group hover:scale-105 transition-all duration-500">
              <Star className="w-12 h-12 mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-3xl font-bold text-white mb-2">
                {moments.filter(m => m.hasStarAddon).length}
              </div>
              <div className="text-gray-300">Star Pairings</div>
            </div>
            <div className="glass-card p-6 text-center group hover:scale-105 transition-all duration-500">
              <Award className="w-12 h-12 mx-auto mb-4 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-3xl font-bold text-white mb-2">
                {moments.filter(m => m.hasPremiumCert).length}
              </div>
              <div className="text-gray-300">Premium Certs</div>
            </div>
            <div className="glass-card p-6 text-center group hover:scale-105 transition-all duration-500">
              <Heart className="w-12 h-12 mx-auto mb-4 text-pink-400 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-3xl font-bold text-white mb-2">
                {moments.filter(m => m.isPublic).length}
              </div>
              <div className="text-gray-300">Public Moments</div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              {pagination && (
                <div className="text-gray-300 text-sm">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of {pagination.totalCount} moments
                </div>
              )}
            </div>
            
            {showFilters && (
              <div className="glass-card p-4 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">Status:</span>
                  <div className="flex space-x-2">
                    {['all', 'completed', 'pending'].map((status) => (
                      <Button
                        key={status}
                        variant={statusFilter === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterChange(status)}
                        className={statusFilter === status ? "bg-blue-500" : "border-gray-400 text-gray-400"}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="glass-card p-4 mb-6 bg-red-500/20 border border-red-500/30">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* Moments List */}
          {loading ? (
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : moments.length === 0 ? (
            <div className="text-center">
              <div className="glass-card p-12 max-w-md mx-auto">
                <Star className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-bold text-white mb-4">No Moments Found</h3>
                <p className="text-gray-300 mb-6">
                  {statusFilter !== 'all' 
                    ? `No moments found with ${statusFilter} status.`
                    : "You haven't dedicated any moments yet. Create your first moment to get started!"
                  }
                </p>
                <Button 
                  className="btn-primary"
                  onClick={() => router.push('/')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Moment
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-6">
                {moments.map((moment) => (
                  <div key={moment.id} className="glass-card p-6 group hover:scale-105 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {moment.dedication}
                        </h3>
                        <div className="text-gray-300 text-sm">
                          {new Date(moment.startTime).toLocaleString()} - {new Date(moment.endTime).toLocaleString()}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          Duration: {Math.floor((new Date(moment.endTime).getTime() - new Date(moment.startTime).getTime()) / 1000)} seconds
                        </div>
                        {moment.star?.name && (
                          <div className="text-purple-400 text-sm mt-1">
                            ⭐ Paired with {moment.star.name}
                          </div>
                        )}
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
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          moment.order?.status === 'COMPLETED' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {moment.order?.status === 'COMPLETED' ? '✓ Paid' : '⏳ Pending'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {moment.order?.status === 'COMPLETED' && moment.certificateGenerated && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                            onClick={() => handleDownloadCertificate(moment.id)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Certificate
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                          onClick={() => handleShareMoment(moment.id)}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                          onClick={() => router.push(`/moment/${moment.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {new Date(moment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasPrevPage}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="text-gray-300">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasNextPage}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
} 