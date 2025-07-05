// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MockErc20} from "../contracts/MockErc20.sol";
/*
forge script scripts/DeployMockErc20.s.sol:DeployMockErc20 \
                --rpc-url https://coston2-api.flare.network/ext/C/rpc --broadcast
*/
contract DeployMockErc20 is Script {
    function run() external {
        // Get the private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the tokens
        MockErc20 usdt0 = new MockErc20("USDT0", "usdt0");
        
        MockErc20 fxrp = new MockErc20("Fxrp", "fxrp"); // only used for Hedera mainnet

        
        // Stop broadcasting
        vm.stopBroadcast();
        
        // Log the deployed token addresses
        console.log("USDT0 deployed at:", address(usdt0));
        console.log("Fxrp deployed at:", address(fxrp));
    }
}