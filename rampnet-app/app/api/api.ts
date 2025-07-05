import { ExchangeRate, mockExchangeRates } from '../../config/chains'

export interface SwapQuote {
  inputAmount: number
  outputAmount: number
  exchangeRate: number
  fees: {
    wiseFee: number
    networkFee: number
    protocolFee: number
  }
  estimatedTime: string
  referenceId: string
}

// Mock API service
export class ApiService {
  
  // Get current exchange rates
  static async getExchangeRates(): Promise<ExchangeRate[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Add some random variation to simulate real market data
    return mockExchangeRates.map(rate => ({
      ...rate,
      rate: rate.rate * (0.98 + Math.random() * 0.04), // ±2% variation
      lastUpdated: Date.now()
    }))
  }

  // Get exchange rate for specific token
  static async getTokenRate(tokenSymbol: string): Promise<ExchangeRate | null> {
    const rates = await this.getExchangeRates()
    return rates.find(rate => rate.symbol === tokenSymbol) || null
  }

  // Get swap quote
  static async getSwapQuote(
    inputAmount: number,
    outputToken: string,
    targetChain: string
  ): Promise<SwapQuote> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const rate = await this.getTokenRate(outputToken)
    if (!rate) {
      throw new Error(`Exchange rate not found for ${outputToken}`)
    }

    // Calculate fees (mock values)
    const wiseFee = inputAmount * 0.01 // 1% Wise fee
    const networkFee = 2 // Fixed network fee in USD
    const protocolFee = inputAmount * 0.001 // 0.1% protocol fee

    const totalFees = wiseFee + networkFee + protocolFee
    const netAmount = inputAmount - totalFees
    const outputAmount = netAmount * rate.rate

    return {
      inputAmount,
      outputAmount,
      exchangeRate: rate.rate,
      fees: {
        wiseFee,
        networkFee,
        protocolFee
      },
      estimatedTime: this.getEstimatedTime(targetChain),
      referenceId: this.generateReferenceId()
    }
  }

  // Initiate transfer
  static async initiateTransfer(
    amount: number,
    targetChain: string,
    outputToken: string,
    recipientAddress: string
  ): Promise<{
    success: boolean
    transactionId: string
    wiseInstructions: {
      accountName: string
      accountNumber: string
      sortCode: string
      reference: string
      amount: number
    }
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Log parameters for debugging
    console.log('Initiating transfer:', {
      amount,
      targetChain,
      outputToken,
      recipientAddress
    })

    // Mock response
    return {
      success: true,
      transactionId: this.generateTransactionId(),
      wiseInstructions: {
        accountName: "RampNet Ltd",
        accountNumber: "12345678",
        sortCode: "12-34-56",
        reference: this.generateReferenceId(),
        amount: amount
      }
    }
  }

  private static getEstimatedTime(chainId: string): string {
    const times: { [key: string]: string } = {
      'mantle': '1-2 minutes',
      'flow': '1-2 minutes',
      'hedera': '1-2 minutes',
      'zircuit': '1-2 minutes',
      'xrpl': '1 minute',
      'katana': '1-2 minutes',
    }
    return times[chainId] || '10-30 minutes'
  }

  private static generateReferenceId(): string {
    return 'RN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase()
  }

  private static generateTransactionId(): string {
    return 'TX' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 6).toUpperCase()
  }
}