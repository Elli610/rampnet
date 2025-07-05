'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  ArrowUpDown, 
  DollarSign,
  TrendingUp,
  Clock,
  ChevronDown,
  Loader2,
  Send,
  CheckCircle
} from 'lucide-react'
import Image from 'next/image'
import { SUPPORTED_CHAINS, type Chain, type Token } from '../../config/chains'
import { QuoteService } from '../api/flare_ftso'
import WisePaymentProcessor, { type TransferData } from './WisePaymentProcessor'

interface SwapQuote {
  inputAmount: number
  outputAmount: number
  exchangeRate: number
  fees: {
    wiseFee: number
    networkFee: number
    protocolFee: number
  }
  estimatedTime: string
}

interface SwapInterfaceProps {
  userWallet?: string
}

export default function SwapInterface({ userWallet }: SwapInterfaceProps) {
  // Swap state
  const [inputAmount, setInputAmount] = useState('')
  const [selectedChain, setSelectedChain] = useState<Chain>(SUPPORTED_CHAINS[0])
  const [selectedToken, setSelectedToken] = useState<Token>(SUPPORTED_CHAINS[0].supportedTokens[0])
  const [recipientAddress, setRecipientAddress] = useState('')
  const [useConnectedWallet, setUseConnectedWallet] = useState(false)
  const [quote, setQuote] = useState<SwapQuote | null>(null)
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  // UI state
  const [showChainDropdown, setShowChainDropdown] = useState(false)
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(false)
  const [transferData, setTransferData] = useState<TransferData | null>(null)

  // Fix hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Update selected token when chain changes
  useEffect(() => {
    if (selectedChain.supportedTokens.length > 0) {
      setSelectedToken(selectedChain.supportedTokens[0])
    }
  }, [selectedChain])

  // Handle connected wallet checkbox
  useEffect(() => {
    if (useConnectedWallet && userWallet) {
      setRecipientAddress(userWallet)
    } else if (!useConnectedWallet) {
      setRecipientAddress('')
    }
  }, [useConnectedWallet, userWallet])

  // Get quote when inputs change
  useEffect(() => {
    if (inputAmount && parseFloat(inputAmount) > 0 && selectedToken) {
      const timeoutId = setTimeout(async () => {
        setIsLoadingQuote(true)
        try {
          const newQuote = await QuoteService.getSwapQuote(
            parseFloat(inputAmount),
            selectedToken.symbol,
            selectedChain.id
          )
          setQuote(newQuote)
        } catch (error) {
          console.error('Failed to get quote:', error)
          setQuote(null)
        } finally {
          setIsLoadingQuote(false)
        }
      }, 800)

      return () => clearTimeout(timeoutId)
    } else {
      setQuote(null)
    }
  }, [inputAmount, selectedToken, selectedChain])

  const handleChainSelect = useCallback((chain: Chain) => {
    setSelectedChain(chain)
    setShowChainDropdown(false)
  }, [])

  const toggleChainDropdown = useCallback((e: React.MouseEvent) => {
    if (!isMounted) return
    e.preventDefault()
    e.stopPropagation()
    setShowChainDropdown(prev => !prev)
  }, [isMounted])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isMounted) return
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.chain-dropdown-container')) {
        setShowChainDropdown(false)
      }
    }

    if (showChainDropdown) {
      // Use passive listener for better performance in production
      document.addEventListener('click', handleClickOutside, { passive: true })
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showChainDropdown, isMounted])

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setRecipientAddress(value)
    
    // Uncheck connected wallet if user manually types something different
    if (userWallet && value !== userWallet) {
      setUseConnectedWallet(false)
    }
  }

  const handleConnectedWalletToggle = (checked: boolean) => {
    setUseConnectedWallet(checked)
    if (checked && userWallet) {
      setRecipientAddress(userWallet)
    }
  }

  const handleInitiateTransfer = () => {
    if (!quote || !recipientAddress) return
    
    console.log('Transfer initiated directly!')
    
    // Préparer les données de transfert
    const transferData: TransferData = {
      amount: quote.outputAmount,
      usdAmount: parseFloat(inputAmount),
      recipientAddress,
      selectedChain,
      selectedToken,
      exchangeRate: quote.exchangeRate,
      fees: quote.fees
    }

    console.log('Transfer data:', transferData)
    setTransferData(transferData)
    setShowPaymentProcessor(true)
    console.log('Should show processor now')
  }

  const handleBackToSwap = () => {
    setShowPaymentProcessor(false)
    setTransferData(null)
  }

  // Afficher le WisePaymentProcessor si demandé
  if (showPaymentProcessor && transferData) {
    console.log('Rendering WisePaymentProcessor')
    return (
      <WisePaymentProcessor
        transferData={transferData}
        onBack={handleBackToSwap}
        onComplete={() => {}} // TODO: gérer la completion
      />
    )
  }

  // Render main swap interface
  if (!isMounted) {
    return (
      <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#7c3aed' }}
        >
          <ArrowUpDown className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">On-Ramp Swap</h2>
          <p className="text-gray-600">Send USD via Wise, receive crypto instantly</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* From USD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">From</label>
          <div className="flex items-center bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mr-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">USD</div>
                <div className="text-sm text-gray-500">via Wise</div>
              </div>
            </div>
            <input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-transparent text-right text-2xl font-bold text-gray-900 outline-none"
            />
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center">
          <div className="w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
            <ArrowUpDown className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {/* To Token */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">To</label>
          <div className="space-y-3">
            {/* Chain Selector */}
            <div className="relative chain-dropdown-container">
              <button
                onClick={toggleChainDropdown}
                className="w-full flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                type="button"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={selectedChain.icon}
                    alt={selectedChain.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{selectedChain.name}</div>
                    <div className="text-sm text-gray-500">Network</div>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>

              {/* Chain Dropdown */}
              {isMounted && showChainDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
                  {SUPPORTED_CHAINS.map((chain) => (
                    <button
                      key={chain.id}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleChainSelect(chain)
                      }}
                      className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      type="button"
                    >
                      <Image
                        src={chain.icon}
                        alt={chain.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{chain.name}</div>
                        <div className="text-sm text-gray-500">{chain.symbol}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Token Output */}
            <div className="flex items-center bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mr-4">
                <Image
                  src={selectedToken.icon || '/default_token.png'}
                  alt={selectedToken.symbol}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900">{selectedToken.symbol}</div>
                  <div className="text-sm text-gray-500">{selectedToken.name}</div>
                </div>
              </div>
              <div className="flex-1 text-right">
                {isLoadingQuote ? (
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400 ml-auto" />
                ) : quote ? (
                  <div className="text-2xl font-bold text-gray-900">
                    {quote.outputAmount.toFixed(6)}
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-gray-400">0.00</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quote Details */}
        {quote && (
          <div className="bg-blue-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-blue-800 font-medium">
              <TrendingUp className="w-4 h-4" />
              Quote Details
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Exchange Rate</span>
                <span>1 USD = {quote.exchangeRate.toFixed(6)} {selectedToken.symbol}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Wise Fee</span>
                <span>-${quote.fees.wiseFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Network Fee</span>
                <span>-${quote.fees.networkFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Protocol Fee</span>
                <span>-${quote.fees.protocolFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between font-medium text-blue-800">
                <span>You receive</span>
                <span>{quote.outputAmount.toFixed(6)} {selectedToken.symbol}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Estimated time: {quote.estimatedTime}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Recipient Address
          </label>
          <div className="space-y-4">
            {/* Connected Wallet Option */}
            {userWallet && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <input
                    id="use-connected-wallet"
                    type="checkbox"
                    checked={useConnectedWallet}
                    onChange={(e) => handleConnectedWalletToggle(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="use-connected-wallet" className="ml-2 text-sm font-medium text-gray-700">
                    Use my connected wallet
                  </label>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-xs">W</span>
                  </div>
                  <span className="font-mono">
                    {userWallet.slice(0, 6)}...{userWallet.slice(-4)}
                  </span>
                </div>
              </div>
            )}

            {/* Manual Input */}
            <div>
              <input
                type="text"
                value={recipientAddress}
                onChange={handleRecipientChange}
                placeholder="Enter recipient wallet address"
                disabled={useConnectedWallet}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                  useConnectedWallet 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-white text-gray-900'
                }`}
              />
              {useConnectedWallet && (
                <p className="mt-2 text-sm text-gray-500">
                  Connected wallet address is automatically filled. Uncheck the option above to enter a different address.
                </p>
              )}
            </div>

            {/* Address validation */}
            {recipientAddress && recipientAddress.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                {recipientAddress.match(/^0x[a-fA-F0-9]{40}$/) ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Valid address format</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-amber-600">
                    <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-amber-600 font-bold text-xs">!</span>
                    </div>
                    <span>Please verify the address format</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleInitiateTransfer}
          disabled={!quote || !recipientAddress || isLoadingQuote}
          className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingQuote ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Getting Quote...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              Start Transfer
            </div>
          )}
        </button>
      </div>
    </div>
  )
}