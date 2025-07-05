// api/flare_ftso.js
import { Web3 } from "web3"

// Updated FTSOv2 Contract Address and ABI
const FTSOV2_ADDRESS = "0x7BDE3Df0624114eDB3A67dFe6753e62f4e7c1d20"
const RPC_URL = "https://flare-api.flare.network/ext/C/rpc" // Flare Mainnet RPC

// https://dev.flare.network/ftso/solidity-reference/

// FTSOv2 Implementation ABI for getFeedsById function
const FTSOV2_IMPLEMENTATION_ABI = [
  {
    "inputs": [
      {
        "internalType": "bytes21[]",
        "name": "_feedIds",
        "type": "bytes21[]"
      }
    ],
    "name": "getFeedsById",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "_values",
        "type": "uint256[]"
      },
      {
        "internalType": "int8[]",
        "name": "_decimals",
        "type": "int8[]"
      },
      {
        "internalType": "uint64",
        "name": "_timestamp",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

// Supported Feed IDs (only USDT and XRP for now)
const FEED_IDS = {
  'USDT': "0x01555344542f555344000000000000000000000000", // USDT/USD
  'XRP': "0x015852502f55534400000000000000000000000000",  // XRP/USD
}

// API service for swap quotes with FTSO data
export class QuoteService {
  
  // Get current exchange rates from FTSO
  static async getExchangeRates() {
    try {
      console.log("Fetching rates from FTSO...")
      
      // Connect to Flare Mainnet
      const w3 = new Web3(RPC_URL)
      
      // The proxy will forward calls to the implementation contract
      const ftsov2 = new w3.eth.Contract(FTSOV2_IMPLEMENTATION_ABI, FTSOV2_ADDRESS)

      // Get feed IDs and symbols
      const feedIds = Object.values(FEED_IDS)
      const symbols = Object.keys(FEED_IDS)

      console.log("Calling getFeedsById with feedIds:", feedIds)

      // Fetch feeds from FTSO - this will be forwarded through the proxy
      const res = await ftsov2.methods.getFeedsById(feedIds).call()
      const feeds = res["0"] // Feed values  
      const decimals = res["1"] // Decimals for each feed
      const timestamp = res["2"] // Timestamp

      console.log("FTSO Response:", { 
        feedCount: feeds.length, 
        timestamp: Number(timestamp),
        feeds: feeds.map(f => f.toString()),
        decimals: decimals.map(d => Number(d))
      })

      // Convert to ExchangeRate format
      const rates = []
      
      for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i]
        const rawValue = feeds[i]
        const decimal = decimals[i]
        
        if (rawValue && decimal !== undefined) {
          // Convert from FTSO format to USD rate
          const rate = Number(rawValue) / Math.pow(10, Number(decimal))
          
          console.log(`${symbol}/USD:`, {
            raw: rawValue.toString(),
            decimals: Number(decimal),
            rate: rate
          })
          
          rates.push({
            symbol,
            rate,
            decimals: Number(decimal),
            lastUpdated: Number(timestamp) * 1000 // Convert to milliseconds
          })
        }
      }

      return rates

    } catch (error) {
      console.error("Failed to fetch FTSO rates:", error)
      console.error("Error details:", error.message)
      
      // If the proxy call fails, we might need to handle it differently
      if (error.message.includes("execution reverted")) {
        console.log("Proxy call failed - the implementation might not support getFeedsById")
        throw new Error("FTSO proxy contract call failed - method may not be available")
      }
      
      throw new Error("Unable to fetch exchange rates from FTSO")
    }
  }

  // Get exchange rate for specific token
  static async getTokenRate(tokenSymbol) {
    const rates = await this.getExchangeRates()
    
    // Handle token symbol mapping
    let lookupSymbol = tokenSymbol
    if (tokenSymbol === 'USDT0') {
      lookupSymbol = 'USDT' // Map  to USDT
    }
    
    const rate = rates.find(r => r.symbol === lookupSymbol) || null
    console.log(`Rate lookup for ${tokenSymbol} (mapped to ${lookupSymbol}):`, rate)
    
    return rate
  }

  // Get swap quote with real FTSO rates
  static async getSwapQuote(inputAmount, outputToken, targetChain) {
    console.log(`Getting quote for ${inputAmount} USD -> ${outputToken} on ${targetChain}`)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const rate = await this.getTokenRate(outputToken)
    if (!rate) {
      throw new Error(`Exchange rate not found for ${outputToken}`)
    }

    // Calculate fees
    const wiseFee = inputAmount * 0.01 // 1% Wise fee
    const networkFee = 0.2 // Fixed network fee in USD
    const protocolFee = inputAmount * 0.001 // 0.1% protocol fee

    const totalFees = wiseFee + networkFee + protocolFee
    const netAmount = inputAmount - totalFees

    // For USDT/USDT0, rate should be close to 1.0 (1 USD = ~1 USDT)
    // For XRP, we need to invert the rate since FTSO gives us XRP/USD (price of 1 XRP in USD)
    // but we need USD/XRP (how many XRP we get for 1 USD)
    let exchangeRate
    if (outputToken === 'USDT' || outputToken === 'USDT0') {
      exchangeRate = rate.rate // Keep as is for stablecoins
    } else {
      exchangeRate = 1 / rate.rate // Invert for other tokens like XRP
    }
    
    const outputAmount = netAmount * exchangeRate

    console.log("Quote calculation:", {
      inputAmount,
      totalFees,
      netAmount,
      exchangeRate,
      outputAmount,
      token: outputToken
    })

    return {
      inputAmount,
      outputAmount,
      exchangeRate,
      fees: {
        wiseFee,
        networkFee,
        protocolFee
      },
      estimatedTime: this.getEstimatedTime(targetChain)
    }
  }

  static getEstimatedTime(chainId) {
    const times = {
      'mantle': '1-2 minutes',
      'flow': '1-2 minutes',
      'hedera': '1-2 minutes',
      'zircuit': '1-2 minutes',
      'xrpl': '1 minute',
      'katana': '1-2 minutes',
    }
    return times[chainId] || '10-30 minutes'
  }
}