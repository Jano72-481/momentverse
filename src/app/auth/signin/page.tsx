'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import StarField from '@/components/StarField'
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check for redirect message
  useEffect(() => {
    const message = searchParams.get('message')
    if (message === 'verification-success') {
      toast.success('Email verified successfully! Please sign in.')
    } else if (message === 'password-reset-success') {
      toast.success('Password reset successfully! Please sign in with your new password.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
        toast.error('Sign in failed. Please check your credentials.')
      } else {
        toast.success('Welcome back!')
        router.push('/profile')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
      toast.error('Sign in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e as any)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 relative">
      <StarField />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-6">
              <Sparkles className="w-8 h-8 text-blue-400 mr-3" />
              <h1 className="text-4xl font-bold text-gradient">MomentVerse</h1>
              <Sparkles className="w-8 h-8 text-blue-400 ml-3" />
            </div>
            <p className="text-xl text-gray-300">Welcome back to eternity</p>
          </div>

          {/* Sign In Form */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    required
                    className="input-primary w-full pl-16 pr-4"
                    placeholder="Enter your email"
                    autoComplete="email"
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    required
                    className="input-primary w-full pl-16 pr-12"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white z-10 transition-colors"
                    disabled={isLoading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email.trim() || !password}
                className="w-full btn-primary text-lg py-3 font-semibold group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  disabled={isLoading}
                >
                  Sign up
                </button>
              </p>

              <button
                onClick={() => router.push('/auth/forgot-password')}
                className="text-gray-400 hover:text-white transition-colors text-sm"
                disabled={isLoading}
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 