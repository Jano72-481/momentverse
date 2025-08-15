'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, User, LogOut, Menu, X, Sparkles } from 'lucide-react'

export function Navigation() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Star className="w-8 h-8 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-purple-400 animate-pulse" />
            </div>
            <span className="text-2xl font-bold gradient-text">MomentVerse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/#timeline" 
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Timeline
            </Link>
            
            {session ? (
              <>
                <Link 
                  href="/profile" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="premium-button">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              size="sm"
              className="text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glass-card mt-2">
              <Link 
                href="/#timeline" 
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Timeline
              </Link>
              
              {session ? (
                <>
                  <Link 
                    href="/profile" 
                    className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 transition-colors duration-300 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/signin" 
                    className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 