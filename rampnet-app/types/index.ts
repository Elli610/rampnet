export interface WisePaymentMemo {
  usdAmount: number;
  address: string;
  currency: string;
  network: SupportedNetwork;
  ts: number;
}
export enum SupportedNetwork {
  MANTLE = 'mantle',
  FLOW = 'flow',
  HEDERA = 'hedera',
  ZIRCUT = 'zircuit',
  XRPL = 'xrpl',
  KATANA = 'katana'
}