import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Star, Clock, Download, Share2, Award, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import StarField from '@/components/StarField'
import MomentActions from './MomentActions'

interface MomentPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: MomentPageProps): Promise<Metadata> {
  try {
    const moment = await prisma.moment.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { name: true } },
        star: { select: { name: true } },
      },
    })

    if (!moment) {
      return {
        title: 'Moment Not Found - MomentVerse',
        description: 'This moment could not be found.',
      }
    }

    const duration = Math.round((moment.endTime.getTime() - moment.startTime.getTime()) / 1000)
    const startDate = moment.startTime.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    return {
      title: `${moment.dedication || 'Dedicated Moment'} - MomentVerse`,
      description: `A ${duration}-second moment dedicated to eternity on ${startDate}. ${moment.star ? `Paired with star ${moment.star.name}.` : ''} ${moment.dedication || ''}`,
      openGraph: {
        title: `${moment.dedication || 'Dedicated Moment'} - MomentVerse`,
        description: `A ${duration}-second moment dedicated to eternity on ${startDate}.`,
        url: `${process.env.NEXTAUTH_URL}/moment/${params.id}`,
        images: [
          {
            url: '/og-moment.jpg',
            width: 1200,
            height: 630,
            alt: moment.dedication || 'Dedicated Moment',
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${moment.dedication || 'Dedicated Moment'} - MomentVerse`,
        description: `A ${duration}-second moment dedicated to eternity on ${startDate}.`,
        images: ['/og-moment.jpg'],
      },
    }
  } catch (error) {
    return {
      title: 'Moment - MomentVerse',
      description: 'View this dedicated moment in time.',
    }
  }
}

export default async function MomentPage({ params }: MomentPageProps) {
  const moment = await prisma.moment.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true } },
      star: { select: { name: true, hipparcosId: true } },
      order: { select: { amount: true, status: true, createdAt: true } },
    },
  })

  if (!moment) {
    notFound()
  }

  const duration = Math.round((moment.endTime.getTime() - moment.startTime.getTime()) / 1000)
  const startDate = moment.startTime.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="min-h-screen star-field cosmic-bg">
      <StarField />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
              {moment.dedication || 'Dedicated Moment'}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-gray-300">
              <Clock className="w-6 h-6" />
              <span className="text-xl">{duration} seconds</span>
              <Star className="w-6 h-6" />
              <span className="text-xl">Eternal</span>
            </div>
          </div>

          {/* Moment Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-blue-400" />
                Time Details
              </h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <span className="font-semibold">Start Time:</span> {startDate}
                </div>
                <div>
                  <span className="font-semibold">Duration:</span> {duration} seconds
                </div>
                <div>
                  <span className="font-semibold">Status:</span> 
                  <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                    Dedicated to Eternity
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-purple-400" />
                Dedication
              </h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <span className="font-semibold">Dedicated by:</span> {moment.user.name}
                </div>
                <div>
                  <span className="font-semibold">Visibility:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${moment.isPublic ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {moment.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
                {moment.dedication && (
                  <div>
                    <span className="font-semibold">Message:</span>
                    <p className="mt-2 italic">"{moment.dedication}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Star Information */}
          {moment.star && (
            <div className="glass-card p-8 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Star className="w-6 h-6 mr-3 text-yellow-400" />
                Paired Star
              </h2>
              <div className="grid md:grid-cols-2 gap-6 text-gray-300">
                <div>
                  <span className="font-semibold">Star Name:</span>
                  <div className="text-xl text-yellow-400 font-bold">{moment.star.name}</div>
                </div>
                <div>
                  <span className="font-semibold">Catalog ID:</span>
                  <div className="text-lg">HIP {moment.star.hipparcosId}</div>
                </div>
              </div>
            </div>
          )}

          {/* Certificate Features */}
          <div className="glass-card p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Award className="w-6 h-6 mr-3 text-green-400" />
              Certificate Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${moment.hasStarAddon ? 'bg-yellow-400' : 'bg-gray-500'}`}></div>
                  <span>Star Pairing: {moment.hasStarAddon ? 'Included' : 'Not included'}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${moment.hasPremiumCert ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                  <span>Premium Certificate: {moment.hasPremiumCert ? 'Included' : 'Standard'}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                  <span>QR Code Verification</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                  <span>Timeline Placement</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <MomentActions momentId={moment.id} momentDedication={moment.dedication} />

          {/* Order Information (for moment owner) */}
          {moment.order && (
            <div className="glass-card p-6 mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Order Details</h3>
              <div className="grid md:grid-cols-3 gap-4 text-gray-300 text-sm">
                <div>
                  <span className="font-semibold">Amount:</span> ${(moment.order.amount / 100).toFixed(2)}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> 
                  <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 rounded">
                    {moment.order.status}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Created:</span> {moment.order.createdAt.toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 