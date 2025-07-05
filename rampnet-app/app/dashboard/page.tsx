'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  Wallet, 
  User,
  Copy,
  Settings,
  LogOut,
} from 'lucide-react'
import PrivyWrapper from '../components/PrivyWrapper'
import SwapInterface from '../components/SwapInterface'

function DashboardContent() {
  const { authenticated, user, logout } = usePrivy()
  const router = useRouter()

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authenticated) {
      router.push('/')
    }
  }, [authenticated, router])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could add toast notification here
  }

  if (!authenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                RampNet
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Card */}
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Profile</h2>
                  <p className="text-gray-600">Connected via Privy</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Email */}
                {user.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-900 text-sm">{user.email.address}</span>
                      <button
                        onClick={() => copyToClipboard(user.email!.address)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Wallet Address */}
                {user.wallet && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Wallet Address</label>
                    <div className="mt-1 flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-900 font-mono text-sm">
                        {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(user.wallet!.address)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">EVM compatible address for all supported chains</p>
                  </div>
                )}

                {/* Connected Accounts */}
                {user.linkedAccounts && user.linkedAccounts.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Connected Accounts</label>
                    <div className="mt-2 space-y-2">
                      {user.linkedAccounts.map((account, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {account.type} Account
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Balance Overview */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Total Balance</h3>
                  <Wallet className="w-6 h-6 text-primary-200" />
                </div>
                <div className="text-3xl font-bold mb-2">$0.00</div>
                <div className="text-primary-200 text-sm">USD Equivalent</div>
              </div>
            </div>
          </div>

          {/* Right Column - Swap Interface */}
          <div className="lg:col-span-2">
            <SwapInterface 
              userWallet={user.wallet?.address}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Dashboard() {
  return (
    <PrivyWrapper>
      <DashboardContent />
    </PrivyWrapper>
  )
}