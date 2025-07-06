// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test, console} from "forge-std/Test.sol";
import {PaymentProcessor} from "../../contracts/PaymentProcessor.sol";
import {TokenSender} from "../../contracts/TokenSender.sol";

contract PaymentProcessorTest is Test {
    PaymentProcessor public paymentProcessor;
    
    function setUp() public {
        paymentProcessor = new PaymentProcessor(TokenSender(address(0)));
    }
    // 20 3 6 16 = 45 bytes
    function testDecodePackedData() public view {
        // Test data: ethereum address + chain id + currency ticker + usd amount
        // Address: 0x742d35Cc6634C0532925a3b8D400aA888E86D14b
        // Chain ID: 1 (Ethereum mainnet)
        // Currency: "USDC"
        // Amount: 123456789 cents ($1,234,567.89)
        
        bytes memory packedData = hex"742D35CC6634C0532925A3B8d400aA888E86D14b00000001999999999999000000000000000000000000075BCD15";
        
        // Call the internal function through a wrapper
        (
            address ethereumAddress,
            uint256 chainId,
            bytes6 currencyTicker,
            uint256 usdAmountCents
        ) = paymentProcessor.decodePackedData(packedData);
        
        // Assertions
        assertEq(ethereumAddress, address(0x742D35CC6634C0532925A3B8d400aA888E86D14b));
        assertEq(chainId, 1);
        assertEq(currencyTicker, bytes6(hex"999999999999"));
        assertEq(usdAmountCents, 123456789);
    }
}