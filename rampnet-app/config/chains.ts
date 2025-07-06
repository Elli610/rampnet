export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  icon?: string;
}

export interface Chain {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  chainId: number;
  rpcUrl?: string;
  blockExplorer?: string;
  supportedTokens: Token[];
  addressType: 'evm' | 'xrpl' | 'other';
}

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 'hedera',
    name: 'Hedera',
    symbol: 'HBAR',
    icon: '/hedera_logo.png',
    rpcUrl: 'https://mainnet-public.mirrornode.hedera.com',
    blockExplorer: 'https://hashscan.io',
    addressType: 'other',
    chainId: 30316,
    supportedTokens: [
      {
        symbol: 'USDT0',
        name: 'USDT0 by LayerZero',
        decimals: 6,
        icon: '/usdt0_logo.png',
      },
    ],
  },
  {
    id: 'xrpl',
    name: 'XRPL',
    symbol: 'XRP',
    icon: '/xrpl_logo.png',
    rpcUrl: 'https://xrplcluster.com',
    blockExplorer: 'https://xrpscan.com',
    addressType: 'xrpl',
    chainId: 99999,
    supportedTokens: [
      {
        symbol: 'XRP',
        name: 'XRP',
        decimals: 6,
        icon: '/xrp_logo.png',
      },
    ],
  },
  {
    id: 'flare',
    name: 'Flare',
    symbol: 'FLR',
    icon: '/flare_logo.png',
    rpcUrl: 'https://coston2-api.flare.network/ext/C/rpc',
    blockExplorer: 'https://coston2-explorer.flare.network',
    addressType: 'evm',
    chainId: 30295,
    supportedTokens: [
      {
        symbol: 'USDT0',
        name: 'USDT0 by LayerZero',
        decimals: 6,
        icon: '/usdt0_logo.png',
      },
    ],
  },
];

export const getChainById = (chainId: string): Chain | undefined => {
  return SUPPORTED_CHAINS.find((chain) => chain.id === chainId);
};

export const getEvmChains = (): Chain[] => {
  return SUPPORTED_CHAINS.filter((chain) => chain.addressType === 'evm');
};

export const getXrplChains = (): Chain[] => {
  return SUPPORTED_CHAINS.filter((chain) => chain.addressType === 'xrpl');
};

// Mock exchange rates (USD to token)
export interface ExchangeRate {
  symbol: string;
  rate: number;
  lastUpdated: number;
}

export const mockExchangeRates: ExchangeRate[] = [
  {
    symbol: 'USDT0',
    rate: 1.0, // 1 USD = 1 USDT0
    lastUpdated: Date.now(),
  },
  {
    symbol: 'XRP',
    rate: 0.5234, // 1 USD = 0.5234 XRP (example rate)
    lastUpdated: Date.now(),
  },
];

export const getExchangeRate = (
  tokenSymbol: string
): ExchangeRate | undefined => {
  return mockExchangeRates.find((rate) => rate.symbol === tokenSymbol);
};
