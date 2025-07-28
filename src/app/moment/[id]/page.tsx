import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface MomentPageProps {
  params: {
    id: string
  }
}

export default async function MomentPage({ params }: MomentPageProps) {
  const moment = await prisma.moment.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      star: true,
      order: true,
    },
  })

  if (!moment) {
    notFound()
  }

  const session = await getServerSession(authOptions)
  const isOwner = session?.user?.email === moment.user.email
  const canViewDedication = moment.isPublic || isOwner

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Certificate of Time Dedication
            </h1>
            <p className="text-xl text-gray-300">
              Moment #{moment.id}
            </p>
          </div>

          {/* Certificate Preview */}
          <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Certificate of Time Dedication
              </h2>
              <p className="text-gray-600">MomentVerse</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left side - Time details */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Time Dedicated
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Start:</strong> {moment.startTime.toLocaleString()}</p>
                  <p><strong>End:</strong> {moment.endTime.toLocaleString()}</p>
                  <p><strong>Duration:</strong> {
                    Math.floor((moment.endTime.getTime() - moment.startTime.getTime()) / 1000)
                  } seconds</p>
                </div>
              </div>

              {/* Right side - Dedication */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Dedication
                </h3>
                {canViewDedication && moment.dedication ? (
                  <p className="text-gray-600 italic">"{moment.dedication}"</p>
                ) : (
                  <p className="text-gray-400 italic">
                    {moment.isPublic ? 'No dedication provided' : 'Private dedication'}
                  </p>
                )}
              </div>
            </div>

            {/* Star information */}
            {moment.star && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Paired Star
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⭐</span>
                  <span className="text-lg text-gray-700">{moment.star.name}</span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500">
              <p>Issued to: {moment.user.name || moment.user.email}</p>
              <p>Date: {moment.createdAt.toLocaleDateString()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {moment.order?.status === 'COMPLETED' && (
              <Button className="bg-green-600 hover:bg-green-700">
                Download Certificate
              </Button>
            )}
            
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              Share Moment
            </Button>
            
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              View on Timeline
            </Button>
          </div>

          {/* Order details (for owner) */}
          {isOwner && moment.order && (
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Order Details</h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <p><strong>Status:</strong> {moment.order.status}</p>
                  <p><strong>Amount:</strong> {formatPrice(moment.order.amount)}</p>
                </div>
                <div>
                  <p><strong>Star Addon:</strong> {moment.order.hasStarAddon ? 'Yes' : 'No'}</p>
                  <p><strong>Premium Certificate:</strong> {moment.order.hasPremiumCert ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 