export interface WisePaymentMemo {
  usdAmount: number;
  address: string;
  currency: string;
  network: SupportedNetwork;
  ts: number;
}
export enum SupportedNetwork {
  HEDERA = 'hedera',
  XRPL = 'xrpl',
  FLARE = 'flare',
}