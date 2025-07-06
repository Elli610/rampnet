// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import {ILayerZeroEndpointV2} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";

/// @title LayerZero Library Configuration Script
/// @notice Sets up send and receive libraries for OApp messaging
contract SetLibraries is Script {
    function run() external {
        // Load environment variables
        address endpoint = vm.envAddress("ARBITRUM_SEPOLIA_ENDPOINT_V2"); // LayerZero Endpoint address
        address oapp = vm.envAddress("ARBITRUM_SEPOLIA_OAPP"); // Your OApp contract address

        // Library addresses
        address sendLib = vm.envAddress("ARBITRUM_SEPOLIA_SEND_ULN_302"); // SendUln302 address

        // Chain configurations
        uint32 dstEid = uint32(vm.envUint("ETHEREUM_HOLESKY_LZ_CHAIN_ID")); // Destination chain EID
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        // Set send library for outbound messages
        ILayerZeroEndpointV2(endpoint).setSendLibrary(
            oapp, // OApp address
            dstEid, // Destination chain EID
            sendLib // SendUln302 address
        );

        vm.stopBroadcast();
    }
}
