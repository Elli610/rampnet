pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import {TokenSender} from "../contracts/TokenSender.sol";
import {MessagingFee} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import {OptionsBuilder} from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";

/// @title TokenSender Distribution Script
/// @notice Sends distribution instructions using TokenSender contract
contract CallSendDistribution is Script {
    using OptionsBuilder for bytes;

    function run() external {
        // Load environment variables (following LZ pattern)
        address oapp = address(0x8AF57d33f64d249D1D4522215B4c98E29bdB5178); // Your TokenSender contract
        uint32 dstEid = uint32(vm.envUint("ETHEREUM_HOLESKY_LZ_CHAIN_ID")); // Destination chain EID
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Distribution parameters
        address currency = address(0xAd47237C79f64522A927Ff897a1EF9C3D2445fef); // Token address
        uint256 amount = uint256(1000); // Amount to send
        address recipient = address(0x89F1B052b42Ca1360b68c6B91b7f64a85772a281); // Recipient address
        bytes memory options = OptionsBuilder
            .newOptions()
            .addExecutorLzReceiveOption(100000, 0);
        // Get the TokenSender contract instance
        TokenSender tokenSender = TokenSender(oapp);

        // 1. First ensure the destination chain is supported
        vm.startBroadcast(deployerPrivateKey);

        if (!tokenSender.isChainSupported(dstEid)) {
            console.log("Adding support for destination EID:", dstEid);
            tokenSender.setSupportedChain(dstEid, true);
        }

        vm.stopBroadcast();

        // 2. Quote the gas cost first
        MessagingFee memory fee = tokenSender.quoteDistribution(
            dstEid,
            currency,
            amount,
            recipient,
            options,
            false // Pay in native gas, not ZRO tokens
        );

        console.log("Estimated native fee:", fee.nativeFee);
        console.log("Estimated LZ token fee:", fee.lzTokenFee);
        // 3. Send the distribution with the quoted fee
        vm.startBroadcast(deployerPrivateKey);
        tokenSender.sendDistribution{value: 0.01 ether}(
            dstEid,
            currency,
            amount,
            recipient,
            options
        );

        vm.stopBroadcast();

        console.log("Distribution sent successfully!");
        console.log("Destination EID:", dstEid);
        console.log("Currency:", currency);
        console.log("Amount:", amount);
        console.log("Recipient:", recipient);
    }
}
