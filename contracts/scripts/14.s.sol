// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import {ILayerZeroEndpointV2} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";

/// @title LayerZero Library Configuration Script
/// @notice Sets up send and receive libraries for OApp messaging
contract SetLibraries is Script {
    function run() external {
        // Load environment variables
        address endpoint = vm.envAddress("ETHEREUM_HOLESKY_ENDPOINT_V2");

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address oapp = vm.envAddress("ETHEREUM_HOLESKY_APP"); // Your OApp contract address

        // Library addresses
        address receiveLib = vm.envAddress("ETHEREUM_HOLESKY_RECEIVE_ULN_302"); // SendUln302 address

        // Chain configurations
        uint32 srcEid = uint32(vm.envUint("ARBITRUM_SEPOLIA_LZ_CHAIN_ID")); // Source chain EID
        uint32 gracePeriod = uint32(vm.envUint("GRACE_PERIOD")); // Grace period for library switch

        vm.startBroadcast(deployerPrivateKey);

        // Set receive library for inbound messages
        ILayerZeroEndpointV2(endpoint).setReceiveLibrary(
            oapp, // OApp address
            srcEid, // Source chain EID
            receiveLib, // ReceiveUln302 address
            gracePeriod // Grace period for library switch
        );

        vm.stopBroadcast();
    }
}
