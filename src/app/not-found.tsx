import Link from 'next/link'
import StarField from '@/components/StarField'

export default function NotFound() {
  return (
    <main className="relative min-h-screen night-sky-bg flex items-center justify-center py-20">
      <StarField />
      <div className="relative z-10 max-w-2xl w-full mx-auto px-4 text-center">
        <div className="glass-card p-8 shadow-2xl">
          <h1 className="text-6xl font-bold mb-6 night-sky-gradient-text">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">
            The moment you're looking for doesn't exist in our timeline. 
            Perhaps it's waiting to be claimed?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn-primary-night text-white font-semibold inline-flex items-center gap-2"
            >
              Return Home
            </Link>
            <Link
              href="/claim"
              className="btn-secondary-night text-white font-semibold inline-flex items-center gap-2"
            >
              Claim Your Moment
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
