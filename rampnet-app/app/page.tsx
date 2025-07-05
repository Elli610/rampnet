'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowRight, Zap, Shield, Globe, Sparkles, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import PrivyWrapper from './components/PrivyWrapper'

function HomeContent() {
  const { authenticated, login } = usePrivy()
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (authenticated) {
      router.push('/dashboard')
    }
  }, [authenticated, router])

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Header with enhanced blur effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image 
                src="/rampnet_logo.png" 
                alt="RampNet" 
                width={32}
                height={32}
                className="h-8 w-8 object-contain mr-3"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const fallback = document.createElement('div')
                  fallback.className = 'w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center mr-3'
                  fallback.innerHTML = '<span class="text-white font-bold text-sm">R</span>'
                  e.currentTarget.parentElement!.insertBefore(fallback, e.currentTarget)
                }}
              />
              <h1 className="text-2xl font-bold text-gray-900">
                RampNet
              </h1>
            </div>
            <button
              onClick={login}
              className="btn-primary hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-2xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-purple-600 hover:to-pink-500"
            >
              Connect
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with parallax and animations */}
      <main className="relative overflow-hidden">
        {/* Enhanced Background decorations with parallax */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-primary-300 to-purple-300 rounded-full opacity-30 blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          ></div>
          <div 
            className="absolute top-80 -left-40 w-96 h-96 bg-gradient-to-r from-violet-300 to-pink-300 rounded-full opacity-25 blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          ></div>
          <div 
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full opacity-20 blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.4}px)` }}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
          <div className="text-center">
            {/* Enhanced Badge with animation */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 rounded-full text-sm font-medium mb-12 border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text font-bold">
                Powered by Flare & LayerZero
              </span>
            </div>

            {/* Enhanced Main heading with fancy colors and animations */}
            <h1 className="text-6xl sm:text-8xl font-black mb-12 leading-tight">
              <div className="mb-4">
                <span className="text-gray-900 animate-fade-in">
                  Omnichain
                </span>
              </div>
              <div className="mb-4 relative">
                <span className="bg-gradient-to-r from-primary-600 via-purple-500 to-primary-600 bg-clip-text text-transparent animate-gradient-x">
                  On-Ramping
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-lg blur opacity-20 animate-pulse"></div>
              </div>
              <div>
                <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Infrastructure
                </span>
              </div>
            </h1>

            <p className="text-2xl text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
              <span className="font-semibold text-primary-700">
                Seamless, programmable
              </span> on/off-ramping protocol designed for the omnichain era. 
              Move funds between fiat and supported blockchain networks with 
              <span className="font-semibold text-primary-600"> minimal friction</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-24">
              <button
                onClick={login}
                className="group btn-primary flex items-center justify-center gap-3 text-xl px-10 py-5 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-500 hover:from-purple-600 hover:via-pink-500 hover:to-red-500 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 rounded-2xl"
              >
                <Sparkles className="w-6 h-6 animate-spin" />
                Get Started 
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              <button className="btn-secondary text-xl px-10 py-5 hover:bg-gradient-to-r hover:from-gray-50 hover:to-primary-50 border-2 hover:border-primary-300 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl">
                Learn More
              </button>
            </div>

            {/* Scroll indicator */}
            <div className="animate-bounce mb-20">
              <ChevronDown className="w-8 h-8 text-gray-400 mx-auto" />
            </div>
          </div>
        </div>        
        {/* Features Grid with enhanced animations */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          <div className="grid md:grid-cols-3 gap-10 mb-32">
            <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-10 hover:shadow-2xl hover:bg-white/95 transition-all duration-500 hover:-translate-y-3">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Instant fiat-to-crypto conversions powered by Wise integration and smart contract automation.
              </p>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-10 hover:shadow-2xl hover:bg-white/95 transition-all duration-500 hover:-translate-y-3">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Secure & Trusted</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Built on Flare&apos;s attestation protocols and price oracles for maximum security and reliability.
              </p>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-10 hover:shadow-2xl hover:bg-white/95 transition-all duration-500 hover:-translate-y-3">
              <div 
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-lg"
                style={{ backgroundColor: '#7c3aed' }}
              >
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Omnichain Ready</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Support for multiple chains including Mantle, Flow, Hedera, XRPL, and more via LayerZero & Flare.
              </p>
            </div>
          </div>

          {/* How it works section */}
          <div className="bg-gradient-to-br from-white/70 to-primary-50/70 backdrop-blur-sm rounded-4xl border border-gray-200/50 p-16 mb-32 shadow-2xl">
            <h2 className="text-5xl font-black text-center mb-6">
              <span className="text-gray-900">How </span>
              <span className="text-primary-600">RampNet </span>
              <span className="text-gray-900">Works</span>
            </h2>
            <p className="text-center text-gray-600 text-xl mb-16 max-w-3xl mx-auto">
              Four simple steps to bridge your fiat to any supported blockchain
            </p>
            <div className="grid md:grid-cols-4 gap-12">
              {[
                { num: '1', title: 'Send Fiat', desc: 'Transfer USD via Wise to RampNet', color: 'from-green-500 to-emerald-500' },
                { num: '2', title: 'Verify & Attest', desc: 'Flare FDC verifies payment and RampNet infra prepare the transaction', color: 'from-blue-500 to-cyan-500' },
                { num: '3', title: 'Cross-Chain', desc: 'LayerZero routes to target chain or Flare using fAssets', color: 'from-purple-500 to-pink-500' },
                { num: '4', title: 'Receive Tokens', desc: 'Get native tokens instantly on the chain of your choice', color: 'from-orange-500 to-red-500' }
              ].map((step, index) => (
                <div key={step.num} className="text-center group">
                  <div className="relative mb-8">
                    <div 
                      className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
                    >
                      <div 
                        style={{ 
                          fontSize: '40px', 
                          fontWeight: '900', 
                          color: '#ffffff',
                          fontFamily: 'system-ui, sans-serif'
                        }}
                      >
                        {step.num}
                      </div>
                    </div>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-12 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-4 text-xl">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Supported Chains */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-4xl p-16 text-white shadow-2xl">
            <h2 className="text-5xl font-black text-center mb-4">
              <span className="text-white">Supported </span>
              <span className="text-primary-400">Networks</span>
            </h2>
            <p className="text-center text-gray-400 text-xl mb-16">
              Connect to the blockchain ecosystem of your choice
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
              {[
                { name: 'Mantle', color: 'from-green-400 to-green-600', logo: 'mantle_logo.png' },
                { name: 'Katana', color: 'from-red-400 to-red-600', logo: 'katana_logo.png' },
                { name: 'Flow', color: 'from-blue-400 to-blue-600', logo: 'flow_logo.png' },
                { name: 'Hedera', color: 'from-purple-400 to-purple-600', logo: 'hedera_logo.png' },
                { name: 'Zircuit', color: 'from-yellow-400 to-yellow-600', logo: 'zircuit_logo.png' },
                { name: 'XRPL', color: 'from-indigo-400 to-indigo-600', logo: 'xrpl_logo.png' }
              ].map((chain) => (
                <div key={chain.name} className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-r from-white to-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 p-3 shadow-2xl">
                    <Image 
                      src={`/${chain.logo}`}
                      alt={`${chain.name} Logo`}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain rounded-full"
                      onError={(e) => {
                        const fallbackDiv = document.createElement('div');
                        fallbackDiv.className = `w-full h-full bg-gradient-to-r ${chain.color} rounded-full flex items-center justify-center`;
                        fallbackDiv.innerHTML = `<span class="text-white font-bold text-xl">${chain.name[0]}</span>`;
                        e.currentTarget.parentElement!.replaceChild(fallbackDiv, e.currentTarget);
                      }}
                    />
                  </div>
                  <div className="text-lg font-bold text-gray-300 group-hover:text-white transition-colors duration-300">{chain.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
                <span className="text-white font-black text-lg">R</span>
              </div>
              <span className="text-3xl font-black text-white">RampNet</span>
            </div>
            <p className="text-gray-400 mb-8 text-lg">
              &copy; 2024 RampNet. Built for the omnichain future.
            </p>
            <div className="flex justify-center space-x-8">
              {['Privacy', 'Terms', 'Docs', 'Support'].map((link) => (
                <a key={link} href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-lg font-medium hover:scale-105 transform">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rounded-4xl {
          border-radius: 2rem;
        }
      `}</style>
    </div>
  )
}

export default function Home() {
  return (
    <PrivyWrapper>
      <HomeContent />
    </PrivyWrapper>
  )
}