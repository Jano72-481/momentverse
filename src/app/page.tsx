'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ClaimMomentForm } from '@/components/ClaimMomentForm'
import { TimelineCanvas } from '@/components/TimelineCanvas'
import { StarField } from '@/components/StarField'
import { Sparkles, Clock, Star, Award, Users, Zap, ArrowRight, ChevronDown, Globe, Shield, Heart, Infinity as InfinityIcon } from 'lucide-react'

export default function HomePage() {
  const [moments, setMoments] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fetch public moments for timeline
    fetch('/api/moments/public')
      .then(res => res.json())
      .then(data => setMoments(data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % 4)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen star-field cosmic-bg">
      {/* Animated Star Field Background */}
      <StarField />
      
      {/* Particle Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center px-4 max-w-7xl mx-auto">
          {/* Animated Logo */}
          <div className={`mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black gradient-text glow-text mb-6 animate-pulse">
              MomentVerse
            </h1>
            <div className="flex justify-center items-center space-x-3 text-blue-400 mb-8">
              <Sparkles className="w-8 h-8 animate-pulse" />
              <span className="text-xl md:text-2xl font-medium">Where Time Meets Eternity</span>
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          {/* Dynamic Subtitle */}
          <div className="h-24 mb-12 flex items-center justify-center">
            <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto transition-all duration-700">
              {currentSection === 0 && (
                <span className="flex items-center justify-center animate-fade-in">
                  <Clock className="w-8 h-8 mr-3 animate-bounce" />
                  Dedicate moments in time, from seconds to days
                </span>
              )}
              {currentSection === 1 && (
                <span className="flex items-center justify-center animate-fade-in">
                  <Star className="w-8 h-8 mr-3 animate-spin" />
                  Pair your moments with real stars from the cosmos
                </span>
              )}
              {currentSection === 2 && (
                <span className="flex items-center justify-center animate-fade-in">
                  <Award className="w-8 h-8 mr-3 animate-pulse" />
                  Receive beautiful certificates for your special moments
                </span>
              )}
              {currentSection === 3 && (
                <span className="flex items-center justify-center animate-fade-in">
                  <Heart className="w-8 h-8 mr-3 animate-ping" />
                  Create a legacy that lasts forever
                </span>
              )}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="premium-button text-xl px-10 py-6 text-white font-bold group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Zap className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  Claim Your Moment
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card-dark">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold text-white flex items-center">
                    <Star className="w-8 h-8 mr-3 text-blue-400" />
                    Claim Your Moment in Time
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <ClaimMomentForm onSuccess={() => setIsDialogOpen(false)} />
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              size="lg"
              className="glass-card text-white border-white/20 hover:bg-white/10 text-xl px-10 py-6 font-semibold group"
              onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Timeline
              <ChevronDown className="w-6 h-6 ml-3 group-hover:translate-y-1 transition-transform duration-300" />
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-20">
            <div className="glass-card p-8 text-center group hover:scale-105 transition-all duration-500">
              <Users className="w-16 h-16 mx-auto mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-4xl font-bold text-white mb-3">1,247</div>
              <div className="text-gray-300 text-lg">Moments Dedicated</div>
            </div>
            <div className="glass-card p-8 text-center group hover:scale-105 transition-all duration-500">
              <Star className="w-16 h-16 mx-auto mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-4xl font-bold text-white mb-3">892</div>
              <div className="text-gray-300 text-lg">Stars Paired</div>
            </div>
            <div className="glass-card p-8 text-center group hover:scale-105 transition-all duration-500">
              <Award className="w-16 h-16 mx-auto mb-6 text-green-400 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-4xl font-bold text-white mb-3">$12,847</div>
              <div className="text-gray-300 text-lg">Value Created</div>
            </div>
            <div className="glass-card p-8 text-center group hover:scale-105 transition-all duration-500">
              <Heart className="w-16 h-16 mx-auto mb-6 text-pink-400 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-4xl font-bold text-white mb-3">∞</div>
              <div className="text-gray-300 text-lg">Legacy Built</div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold gradient-text mb-8">
              Timeline of Dedicated Moments
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore the beautiful moments that others have dedicated to eternity. 
              Each node represents a unique slice of time, forever preserved in the cosmos.
            </p>
          </div>
          <TimelineCanvas moments={moments} />
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold gradient-text mb-8">
              Why Choose MomentVerse?
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience the most sophisticated time dedication platform in the universe
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card p-10 text-center group hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Flexible Duration</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Dedicate anywhere from 1 second to 24 hours of time. 
                Every moment matters, no matter how brief or extended.
              </p>
            </div>
            
            <div className="glass-card p-10 text-center group hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Star Pairing</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Optionally pair your moment with a real star from the Hipparcos catalog. 
                Your dedication becomes part of the cosmic record.
              </p>
            </div>
            
            <div className="glass-card p-10 text-center group hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Premium Certificates</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Receive stunning PDF certificates with QR codes, 
                premium designs, and embossed seals for your special moments.
              </p>
            </div>

            <div className="glass-card p-10 text-center group hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Secure & Private</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Your moments are protected with enterprise-grade security. 
                Choose public or private dedications with full control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Viral Social Proof Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold gradient-text mb-8">
              What People Are Saying
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join thousands of people who've made their moments eternal
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 group hover:scale-105 transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Sarah M.</div>
                  <div className="text-gray-400 text-sm">TikTok Creator</div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                "I dedicated my graduation moment to a star and it went viral on TikTok! 
                Everyone loved the concept. My video got 2M views! 🌟"
              </p>
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="glass-card p-8 group hover:scale-105 transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Mike R.</div>
                  <div className="text-gray-400 text-sm">Wedding Photographer</div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                "My clients love this! I offer it as a premium add-on. 
                The certificates are absolutely stunning. 💫"
              </p>
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="glass-card p-8 group hover:scale-105 transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">L</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Lisa K.</div>
                  <div className="text-gray-400 text-sm">New Mom</div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                "I dedicated my baby's first breath to eternity. 
                The star pairing made it so special. Perfect for milestones! 👶"
              </p>
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold gradient-text mb-8">
              Simple, Transparent Pricing
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Choose the perfect package for your moment. No hidden fees, no surprises.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="glass-card p-10 relative group hover:scale-105 transition-all duration-500">
              <div className="absolute top-6 right-6">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-6">Basic Moment</h3>
              <div className="text-6xl font-bold text-blue-400 mb-8">$5</div>
              <ul className="space-y-6 text-gray-300 mb-10 text-lg">
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-4"></div>
                  Up to 60 seconds of time
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-4"></div>
                  Beautiful PDF Certificate
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-4"></div>
                  Timeline placement
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-4"></div>
                  QR code verification
                </li>
              </ul>
              <Button className="w-full premium-button text-lg py-6">
                Choose Basic
              </Button>
            </div>
            
            <div className="glass-card p-10 relative group hover:scale-105 transition-all duration-500 border-2 border-purple-500/30">
              <div className="absolute top-6 right-6">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  Premium
                </span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-6">Premium Package</h3>
              <div className="text-6xl font-bold text-purple-400 mb-8">$13</div>
              <ul className="space-y-6 text-gray-300 mb-10 text-lg">
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mr-4"></div>
                  Up to 60 seconds of time
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mr-4"></div>
                  Star pairing included
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mr-4"></div>
                  Premium certificate design
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mr-4"></div>
                  Gold border & embossed seal
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mr-4"></div>
                  Priority timeline placement
                </li>
              </ul>
              <Button className="w-full premium-button text-lg py-6">
                Choose Premium
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-10 py-16 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center items-center mb-8">
            <Sparkles className="w-8 h-8 text-blue-400 mr-3" />
            <span className="text-2xl font-bold text-white">MomentVerse</span>
            <Sparkles className="w-8 h-8 text-blue-400 ml-3" />
          </div>
          <p className="text-gray-400 mb-6 text-lg">
            Where moments become eternal. © 2024 MomentVerse. All rights reserved.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Contact</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
} 