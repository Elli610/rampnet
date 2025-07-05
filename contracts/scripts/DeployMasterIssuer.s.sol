// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MasterIssuer} from "../contracts/MasterIssuer.sol";

/*
forge script scripts/DeployMasterIssuer.s.sol:DeployMasterIssuer \
                --rpc-url https://coston2-api.flare.network/ext/C/rpc --broadcast
*/
contract DeployMasterIssuer is Script {
    function run() external {
        // Get the private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the contract
        MasterIssuer masterIssuer = new MasterIssuer();
        
        // Stop broadcasting
        vm.stopBroadcast();
        
        // Log the deployed contract address
        console.log("MasterIssuer deployed to:", address(masterIssuer));
    }
}