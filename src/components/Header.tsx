'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, User, LogOut, Settings, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, status } = useSession();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.header-menu')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Signed out successfully');
      setIsMenuOpen(false);
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ${
      isScrolled 
        ? 'backdrop-blur-lg bg-slate-900/90 border-b border-slate-700/50' 
        : 'backdrop-blur-md bg-slate-900/60'
    }`}>
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <span className="text-white font-bold text-sm">MV</span>
        </div>
        <span className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
          MomentVerse
        </span>
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 items-center">
        <Link 
          href="/claim" 
          className="text-gray-300 hover:text-white transition-colors font-medium hover:scale-105 transform duration-200"
        >
          Claim Moment
        </Link>
        <Link 
          href="/timeline" 
          className="text-gray-300 hover:text-white transition-colors font-medium hover:scale-105 transform duration-200"
        >
          Timeline
        </Link>
        
        {status === 'loading' ? (
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        ) : session ? (
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white transition-all duration-200 font-medium"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signup"
              className="px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white transition-all duration-200 font-medium"
            >
              Sign Up
            </Link>
            <Link
              href="/auth/signin"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={handleMenuToggle}
        className="md:hidden p-2 text-gray-300 hover:text-white transition-colors header-menu"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 md:hidden header-menu">
          <nav className="flex flex-col p-4 space-y-4">
            <Link 
              href="/claim" 
              className="text-gray-300 hover:text-white transition-colors font-medium py-2 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Star className="w-4 h-4" />
              Claim Moment
            </Link>
            <Link 
              href="/timeline" 
              className="text-gray-300 hover:text-white transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Timeline
            </Link>
            
            {status === 'loading' ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : session ? (
              <div className="flex flex-col space-y-2 pt-2 border-t border-slate-700/50">
                <Link
                  href="/profile"
                  className="px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white transition-all duration-200 font-medium text-center flex items-center justify-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium transition-all duration-200 text-center flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-slate-700/50">
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white transition-all duration-200 font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
} 