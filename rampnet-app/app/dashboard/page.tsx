'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  User,
  Copy,
  ExternalLink,
  Settings,
  LogOut,
  CreditCard,
  Send,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import PrivyWrapper from '../components/PrivyWrapper'

function DashboardContent() {
  const { authenticated, user, logout } = usePrivy()
  const router = useRouter()
  const [showWiseModal, setShowWiseModal] = useState(false)
  const [transferAmount, setTransferAmount] = useState('')
  const [selectedChain, setSelectedChain] = useState('ethereum')
  const [recipientWallet, setRecipientWallet] = useState('')

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authenticated) {
      router.push('/')
    }
  }, [authenticated, router])

  // Mock data for transactions
  const recentTransactions = [
    {
      id: '1',
      type: 'on-ramp',
      amount: '$500.00',
      chain: 'Ethereum',
      status: 'completed',
      date: '2024-01-15',
      hash: '0x1234...5678'
    },
    {
      id: '2',
      type: 'on-ramp',
      amount: '$250.00',
      chain: 'Mantle',
      status: 'pending',
      date: '2024-01-14',
      hash: '0xabcd...efgh'
    }
  ]

  const supportedChains = [
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'mantle', name: 'Mantle', symbol: 'MNT' },
    { id: 'flow', name: 'Flow', symbol: 'FLOW' },
    { id: 'hedera', name: 'Hedera', symbol: 'HBAR' },
    { id: 'xrpl', name: 'XRPL', symbol: 'XRP' },
    { id: 'zircuit', name: 'Zircuit', symbol: 'ZRC' }
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could add toast notification here
  }

  const handleWiseTransfer = () => {
    // This would integrate with your backend API
    console.log('Initiating Wise transfer:', {
      amount: transferAmount,
      chain: selectedChain,
      recipient: recipientWallet
    })
    setShowWiseModal(false)
    // Reset form
    setTransferAmount('')
    setRecipientWallet('')
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
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
          {/* Left Column - Profile & Actions */}
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
                      <span className="text-gray-900">{user.email.address}</span>
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
                  </div>
                )}

                {/* Connected Accounts */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Connected Accounts</label>
                  <div className="mt-2 space-y-2">
                    {user.linkedAccounts?.map((account, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {account.type} Account
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowWiseModal(true)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Start Wise Transfer
                </button>
                
                <button className="w-full btn-secondary flex items-center justify-center gap-2" disabled>
                  <ArrowDownLeft className="w-4 h-4" />
                  Off-Ramp (Coming Soon)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Transactions & Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Total Balance</h3>
                  <Wallet className="w-6 h-6 text-primary-200" />
                </div>
                <div className="text-3xl font-bold mb-2">$0.00</div>
                <div className="text-primary-200 text-sm">USD Equivalent</div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
                  <ArrowUpRight className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
                <div className="text-gray-600 text-sm">Total Completed</div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Networks</h3>
                  <div className="w-6 h-6 text-blue-500">🔗</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">6</div>
                <div className="text-gray-600 text-sm">Supported Chains</div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </button>
              </div>

              {recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          tx.type === 'on-ramp' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {tx.type === 'on-ramp' ? (
                            <ArrowUpRight className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowDownLeft className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{tx.amount}</div>
                          <div className="text-sm text-gray-600">{tx.chain} • {tx.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.status === 'completed' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {tx.status}
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h4>
                  <p className="text-gray-600 mb-4">Start your first Wise transfer to see activity here</p>
                  <button
                    onClick={() => setShowWiseModal(true)}
                    className="btn-primary"
                  >
                    Start Transfer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Wise Transfer Modal */}
      {showWiseModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowWiseModal(false)}></div>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Wise Transfer</h3>
                <button
                  onClick={() => setShowWiseModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Target Chain */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Chain</label>
                  <select
                    value={selectedChain}
                    onChange={(e) => setSelectedChain(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  >
                    {supportedChains.map((chain) => (
                      <option key={chain.id} value={chain.id}>
                        {chain.name} ({chain.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recipient Wallet */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Wallet</label>
                  <input
                    type="text"
                    value={recipientWallet}
                    onChange={(e) => setRecipientWallet(e.target.value)}
                    placeholder="0x... or use your connected wallet"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={() => setRecipientWallet(user.wallet?.address || '')}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                  >
                    Use my connected wallet
                  </button>
                </div>

                {/* Transfer Instructions */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-blue-900 mb-1">Transfer Instructions</div>
                      <div className="text-blue-700">
                        1. Send ${transferAmount || '0.00'} via Wise to RampNet<br/>
                        2. Reference ID will be provided<br/>
                        3. Tokens will be sent to your wallet automatically
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowWiseModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWiseTransfer}
                    disabled={!transferAmount || !recipientWallet}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Transfer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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