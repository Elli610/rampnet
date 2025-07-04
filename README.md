# 🚀 RampNet – Omnichain On-Ramping Infrastructure

**RampNet** is a seamless, programmable on/off-ramping protocol designed for the omnichain era. It enables users to move funds between fiat (via Wise) and supported blockchain networks with minimal friction, leveraging the most advanced cross-chain infrastructure available today.

> 🚧 **Note:** In the current version, **only on-ramping is enabled**. Off-ramping is planned for a future release.

## 🔗 What RampNet Enables (v1)

- ✅ **On-Ramp**: Users send fiat (USD) via Wise and receive native tokens on their chosen blockchain (e.g., XRP on XRPL, USDT0 on Flare...)
- ❌ **Off-Ramp**: _Coming soon_ – Users will be able to send tokens from supported chains and receive fiat directly to their bank account.
- 🧩 **Programmable**: Built around smart contracts, Oracles & cross-chain messaging (Flare FDC, FTSO, LayerZero).

## 🧠 Core Concepts

- **Fiat integration** via Wise (global banking rails)
- **Attestation & Proofs** powered by Flare Data Connector (FDC)
- **Price feeds** via Flare Time Series Oracle (FTSO)
- **Cross-chain execution** using fAssets, Flare EVM, and LayerZero OApp
- **Smart contract-based distribution** of native assets on target chains
- **Privy integration** for seamless Web3 onboarding with social logins across all supported chains
- **Hardhat v3** is used as the primary framework for testing and network simulation

## 🌐 Supported Chains

RampNet currently supports the following chains for token delivery and liquidity management:

- Mantle
- Katana
- Flow
- Hedera
- Zircuit
- XRPL (XRP Ledger)
- (soon) All EVM-compatible chains supported by LayerZero OApp and chains supporting fAssets.

## 📦 Architecture Overview
```
+---------------------------+
| [1] User sends USD via   |
|     Wise to RampNet      |
+---------------------------+
             |
             v
+---------------------------+
| [2] Backend verifies Wise|
|     transfer via API     |
+---------------------------+
             |
             v
+-----------------------------+
| [3] Call Flare FDC for      |
|     payment attestation     |
+-----------------------------+
             |
             v
+---------------------------+
| [4] Call Flare FTSO for   |
|     USD/token rate        |
+---------------------------+
             |
             v
+---------------------------+
| [5] Send to Flare EVM     |
|     smart contract        |
|  (attestation + wallet +  |
|   amount)                 |
+---------------------------+
             |
             v
+-------------------------------+
| [6] Token-dependent logic     |
+-------------------------------+
        |                 |
       XRP              Other
        |                 |
        v                 v
+-------------------+   +-----------------------------+
| [7] Bridge fXRP → |   | [7] Send msg via LayerZero  |
|     native XRP    |   |     OApp to dest chain      |
+-------------------+   +-----------------------------+
        |                             |
        v                             v
+-------------------------+   +---------------------------+
| [8] User receives       |   | [8] Destination contract  |
|     native XRP on XRPL |    |     unlocks token         |
+-------------------------+   +---------------------------+
                                      |
                                      v
                           +----------------------------+
                           | [9] User receives native   |
                           |     token on target chain  |
                           +----------------------------+

```
