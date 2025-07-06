// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import {TokenDistributor} from "../contracts/TokenDistributor.sol";

/// @title LayerZero OApp Peer Configuration Script
/// @notice Sets up peer connections between OApp deployments on different chains
contract SetPeers is Script {
    function run() external {
        // Load environment variables
        address oapp = vm.envAddress("ETHEREUM_HOLESKY_APP"); // Your OApp contract address
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Example: Set peers for different chains
        // Format: (chain EID, peer address in bytes32)
        (uint32 eid1, bytes32 peer1) = (
            uint32(vm.envUint("ARBITRUM_SEPOLIA_LZ_CHAIN_ID")),
            bytes32(uint256(uint160(vm.envAddress("ARBITRUM_SEPOLIA_OAPP"))))
        );

        vm.startBroadcast(deployerPrivateKey);

        // Set peers for each chain
        TokenDistributor(oapp).setPeer(eid1, peer1);

        vm.stopBroadcast();
    }
}
