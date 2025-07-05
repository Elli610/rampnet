export function encodePackedBytes(
  address: string,
  chainId: number,
  currencyTicker: string,
  usdAmountCents: bigint
): Uint8Array {
  // Validate inputs
  if (!/^[0-9a-fA-F]{40}$/.test(address)) {
    throw new Error(
      'Invalid Ethereum address format. Must be 40 hex characters without 0x prefix.'
    );
  }

  if (chainId < 0 || chainId > 0xffffff) {
    throw new Error('Chain ID must be between 0 and 16777215 (3 bytes max).');
  }

  if (currencyTicker.length > 6) {
    throw new Error('Currency ticker must be 6 characters or less.');
  }

  if (
    usdAmountCents < 0n ||
    usdAmountCents > 0xffffffffffffffffffffffffffffffffn
  ) {
    throw new Error('USD amount must be between 0 and 2^128-1.');
  }

  // Calculate total size: 20 (address) + 3 (chainId) + 6 (ticker) + 16 (uint128) = 45 bytes
  const buffer = new Uint8Array(45);
  let offset = 0;

  // 1. Ethereum address (20 bytes)
  for (let i = 0; i < 20; i++) {
    buffer[offset++] = parseInt(address.substr(i * 2, 2), 16);
  }

  // 2. Chain ID (3 bytes, big-endian)
  buffer[offset++] = (chainId >> 16) & 0xff;
  buffer[offset++] = (chainId >> 8) & 0xff;
  buffer[offset++] = chainId & 0xff;

  // 3. Currency ticker (6 bytes, ASCII, null-padded)
  const tickerBytes = new TextEncoder().encode(currencyTicker);
  for (let i = 0; i < 6; i++) {
    buffer[offset++] = i < tickerBytes.length ? tickerBytes[i] : 0;
  }

  // 4. USD amount in cents (16 bytes, uint128, big-endian)
  for (let i = 15; i >= 0; i--) {
    buffer[offset++] = Number((usdAmountCents >> BigInt(i * 8)) & 0xffn);
  }

  return buffer;
}

/**
 * Utility function to decode packed bytes back to original values
 * Useful for testing and verification
 */
export function decodePackedBytes(packedData: Uint8Array): {
  address: string;
  chainId: number;
  currencyTicker: string;
  usdAmountCents: bigint;
} {
  if (packedData.length !== 45) {
    throw new Error('Invalid packed data length. Expected 45 bytes.');
  }

  let offset = 0;

  // 1. Ethereum address (20 bytes)
  let address = '';
  for (let i = 0; i < 20; i++) {
    address += packedData[offset++].toString(16).padStart(2, '0');
  }

  // 2. Chain ID (3 bytes, big-endian)
  const chainId =
    (packedData[offset++] << 16) |
    (packedData[offset++] << 8) |
    packedData[offset++];

  // 3. Currency ticker (6 bytes, ASCII, null-terminated)
  const tickerBytes = packedData.slice(offset, offset + 6);
  offset += 6;

  // Find the null terminator or use full length
  let tickerLength = tickerBytes.findIndex((b) => b === 0);
  if (tickerLength === -1) tickerLength = 6;

  const currencyTicker = new TextDecoder().decode(
    tickerBytes.slice(0, tickerLength)
  );

  // 4. USD amount in cents (16 bytes, uint128, big-endian)
  let usdAmountCents = 0n;
  for (let i = 0; i < 16; i++) {
    usdAmountCents = (usdAmountCents << 8n) | BigInt(packedData[offset++]);
  }

  return {
    address,
    chainId,
    currencyTicker,
    usdAmountCents,
  };
}

export function Uint8ArrayToHex(uint8Array: Uint8Array): string {
  return Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToUint8Array(hexString: string) {
  // Remove any whitespace and convert to lowercase
  const cleanHex = hexString.replace(/\s+/g, '').toLowerCase();

  // Check if hex string has even length
  if (cleanHex.length % 2 !== 0) {
    throw new Error('Hex string must have even length');
  }

  // Check if hex string contains only valid hex characters
  if (!/^[0-9a-f]*$/i.test(cleanHex)) {
    throw new Error('Invalid hex string');
  }

  const bytes = new Uint8Array(cleanHex.length / 2);

  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }

  return bytes;
}
