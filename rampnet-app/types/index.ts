export enum SupportedNetwork {
  ETHEREUM = 'ETHEREUM',
  POLYGON = 'POLYGON',
  BASE = 'BASE',
  ARBITRUM = 'ARBITRUM',
  SOLANA = 'SOLANA',
}

export interface WisePaymentMemo {
  usdAmount: number;
  address: string;
  currency: string;
  network: SupportedNetwork;
  ts: number;
}
