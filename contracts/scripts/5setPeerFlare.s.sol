// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import {MyOApp} from "../contracts/MyOApp.sol";

/// @title LayerZero OApp Peer Configuration Script
/// @notice Sets up peer connections between OApp deployments on different chains
contract SetPeers is Script {
    function run() external {
        // Load environment variables
        address oapp = vm.envAddress("OAPP_FLARE_ADDRESS"); // Your OApp contract address
        address signer = vm.envAddress("SIGNER"); // Address with owner permissions

        // Example: Set peers for different chains
        // Format: (chain EID, peer address in bytes32)
        (uint32 eid1, bytes32 peer1) = (
            uint32(vm.envUint("HEDERA_LZ_CHAIN_ID")),
            bytes32(uint256(uint160(vm.envAddress("OAPP_HEDERA_ADDRESS"))))
        );

        vm.startBroadcast(signer);

        // Set peers for each chain
        MyOApp(oapp).setPeer(eid1, peer1);

        vm.stopBroadcast();
    }
}
