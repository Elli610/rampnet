export interface Token {
  symbol: string
  name: string
  decimals: number
  icon?: string
}

export interface Chain {
  id: string
  name: string
  symbol: string
  icon: string
  rpcUrl?: string
  blockExplorer?: string
  supportedTokens: Token[]
  addressType: 'evm' | 'xrpl' | 'other'
}

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 'mantle',
    name: 'Mantle',
    symbol: 'MNT',
    icon: '/mantle_logo.png',
    rpcUrl: 'https://rpc.mantle.xyz',
    blockExplorer: 'https://explorer.mantle.xyz',
    addressType: 'evm',
    supportedTokens: [
      {
        symbol: 'USDT0',
        name: 'USDT0 by LayerZero',
        decimals: 6,
        icon: '/usdt0_logo.png'
      }
    ]
  },
  {
    id: 'flow',
    name: 'Flow',
    symbol: 'FLOW',
    icon: '/flow_logo.png',
    rpcUrl: 'https://access-mainnet-beta.onflow.org',
    blockExplorer: 'https://flowscan.org',
    addressType: 'other',
    supportedTokens: [
      {
        symbol: 'USDT0',
        name: 'USDT0 by LayerZero',
        decimals: 6,
        icon: '/usdt0_logo.png'
      }
    ]
  },
  {
    id: 'hedera',
    name: 'Hedera',
    symbol: 'HBAR',
    icon: '/hedera_logo.png',
    rpcUrl: 'https://mainnet-public.mirrornode.hedera.com',
    blockExplorer: 'https://hashscan.io',
    addressType: 'other',
    supportedTokens: [
      {
        symbol: 'USDT0',
        name: 'USDT0 by LayerZero',
        decimals: 6,
        icon: '/usdt0_logo.png'
      }
    ]
  },
  {
    id: 'zircuit',
    name: 'Zircuit',
    symbol: 'ZRC',
    icon: '/zircuit_logo.png',
    rpcUrl: 'https://zircuit1-mainnet.p2pify.com',
    blockExplorer: 'https://explorer.zircuit.com',
    addressType: 'evm',
    supportedTokens: [
      {
        symbol: 'USDT0',
        name: 'USDT0 by LayerZero',
        decimals: 6,
        icon: '/usdt0_logo.png'
      }
    ]
  },
  {
    id: 'xrpl',
    name: 'XRPL',
    symbol: 'XRP',
    icon: '/xrpl_logo.png',
    rpcUrl: 'https://xrplcluster.com',
    blockExplorer: 'https://xrpscan.com',
    addressType: 'xrpl',
    supportedTokens: [
      {
        symbol: 'XRP',
        name: 'XRP',
        decimals: 6,
        icon: '/xrp_logo.png'
      }
    ]
  },
  {
    id: 'katana',
    name: 'Katana',
    symbol: 'KAT',
    icon: '/katana_logo.png',
    rpcUrl: 'https://rpc.katana.network',
    blockExplorer: 'https://explorer.katana.network',
    addressType: 'evm',
    supportedTokens: [
      {
        symbol: 'USDT0',
        name: 'USDT0 by LayerZero',
        decimals: 6,
        icon: '/usdt0_logo.png'
      }
    ]
  }
]

export const getChainById = (chainId: string): Chain | undefined => {
  return SUPPORTED_CHAINS.find(chain => chain.id === chainId)
}

export const getEvmChains = (): Chain[] => {
  return SUPPORTED_CHAINS.filter(chain => chain.addressType === 'evm')
}

export const getXrplChains = (): Chain[] => {
  return SUPPORTED_CHAINS.filter(chain => chain.addressType === 'xrpl')
}

// Mock exchange rates (USD to token)
export interface ExchangeRate {
  symbol: string
  rate: number
  lastUpdated: number
}

export const mockExchangeRates: ExchangeRate[] = [
  {
    symbol: 'USDT0',
    rate: 1.00, // 1 USD = 1 USDT0
    lastUpdated: Date.now()
  },
  {
    symbol: 'XRP',
    rate: 0.5234, // 1 USD = 0.5234 XRP (example rate)
    lastUpdated: Date.now()
  }
]

export const getExchangeRate = (tokenSymbol: string): ExchangeRate | undefined => {
  return mockExchangeRates.find(rate => rate.symbol === tokenSymbol)
}

