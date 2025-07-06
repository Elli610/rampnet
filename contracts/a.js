import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

// Contract ABI - only the functions we need
const TOKEN_SENDER_ABI = [
  'function isChainSupported(uint32 _eid) external view returns (bool)',
  'function setSupportedChain(uint32 _eid, bool _supported) external',
  'function sendDistribution(uint32 _dstEid, address _currency, uint256 _amount, address _recipient, bytes calldata _options) external payable',
  'function quoteDistribution(uint32 _dstEid, address _currency, uint256 _amount, address _recipient, bytes calldata _options, bool _payInLzToken) external view returns (tuple(uint256 nativeFee, uint256 lzTokenFee))',
];

async function main() {
  try {
    // Configuration
    const config = {
      rpcUrl: 'https://arbitrum-sepolia.gateway.tenderly.co',
      contractAddress: '0x8AF57d33f64d249D1D4522215B4c98E29bdB5178',
      privateKey: process.env.PRIVATE_KEY,
      dstEid: parseInt(process.env.ETHEREUM_HOLESKY_LZ_CHAIN_ID || '40217'),
      currency: '0xAd47237C79f64522A927Ff897a1EF9C3D2445fef',
      amount: '1000',
      recipient: '0x89F1B052b42Ca1360b68c6B91b7f64a85772a281',
      options: '0x',
      manualFee: ethers.utils.parseEther('0.01'), // 0.01 ETH - ethers v5 syntax
    };

    console.log('🚀 Starting distribution transaction...');
    console.log('Contract:', config.contractAddress);
    console.log('Destination EID:', config.dstEid);
    console.log('Amount:', config.amount);
    console.log('Recipient:', config.recipient);

    // Setup provider and wallet (ethers v5 syntax)
    const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    const wallet = new ethers.Wallet(config.privateKey, provider);
    const contract = new ethers.Contract(
      config.contractAddress,
      TOKEN_SENDER_ABI,
      wallet
    );

    console.log('📡 Connected to wallet:', wallet.address);

    // Check wallet balance
    const balance = await provider.getBalance(wallet.address);
    console.log('💰 Wallet balance:', ethers.utils.formatEther(balance), 'ETH');

    // Step 1: Check and add chain support if needed
    console.log('\n1️⃣ Checking chain support...');
    const isSupported = await contract.isChainSupported(config.dstEid);
    console.log('Chain supported:', isSupported);

    if (!isSupported) {
      console.log('🔧 Adding chain support...');
      const setSupportTx = await contract.setSupportedChain(
        config.dstEid,
        true,
        {
          gasLimit: 100000,
        }
      );
      console.log('Support tx hash:', setSupportTx.hash);
      await setSupportTx.wait();
      console.log('✅ Chain support added');
    }

    // Step 2: Optional - Try to get quote (may fail)
    console.log('\n2️⃣ Attempting to get quote...');
    try {
      const quote = await contract.quoteDistribution(
        config.dstEid,
        config.currency,
        config.amount,
        config.recipient,
        config.options,
        false
      );
      console.log('📊 Quote successful!');
      console.log(
        'Native fee:',
        ethers.utils.formatEther(quote.nativeFee),
        'ETH'
      );
      console.log(
        'LZ token fee:',
        ethers.utils.formatEther(quote.lzTokenFee),
        'ETH'
      );

      // Use quoted fee if available
      config.manualFee = quote.nativeFee;
    } catch (error) {
      console.log(
        '⚠️ Quote failed, using manual fee:',
        ethers.utils.formatEther(config.manualFee),
        'ETH'
      );
      console.log('Quote error:', error.message);
    }

    // Step 3: Send the distribution transaction
    console.log('\n3️⃣ Sending distribution transaction...');
    console.log(
      'Using fee:',
      ethers.utils.formatEther(config.manualFee),
      'ETH'
    );

    const txParams = {
      value: config.manualFee,
      gasLimit: 500000, // High gas limit to avoid issues
      gasPrice: ethers.utils.parseUnits('0.1', 'gwei'), // Manual gas price - ethers v5
    };

    console.log('Transaction params:', {
      ...txParams,
      value: ethers.utils.formatEther(txParams.value),
      gasPrice: ethers.utils.formatUnits(txParams.gasPrice, 'gwei') + ' gwei',
    });

    try {
      const tx = await contract.sendDistribution(
        config.dstEid,
        config.currency,
        config.amount,
        config.recipient,
        config.options,
        txParams
      );

      console.log('🎯 Transaction sent!');
      console.log('TX Hash:', tx.hash);
      console.log('🔗 Explorer:', `https://sepolia.arbiscan.io/tx/${tx.hash}`);

      // Wait for confirmation
      console.log('⏳ Waiting for confirmation...');
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        console.log('✅ Transaction confirmed!');
        console.log('Block number:', receipt.blockNumber);
        console.log('Gas used:', receipt.gasUsed.toString());
      } else {
        console.log('❌ Transaction failed on-chain');
      }
    } catch (error) {
      console.log('💥 Transaction failed:', error.message);

      // Try to extract revert reason
      if (error.data) {
        console.log('Revert data:', error.data);
      }

      // Still show the error details for debugging
      console.log('Full error:', error);
    }
  } catch (error) {
    console.error('🚨 Script failed:', error);
  }
}

// Helper function to run with better error handling
async function runScript() {
  try {
    await main();
  } catch (error) {
    console.error('💀 Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
runScript();
