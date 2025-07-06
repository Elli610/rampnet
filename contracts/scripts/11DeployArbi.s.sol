pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import {TokenSender} from "../contracts/TokenSender.sol";

contract DeployOApp is Script {
    function run() external {
        // Replace these env vars with your own values
        address endpoint = vm.envAddress("ARBITRUM_SEPOLIA_ENDPOINT_V2");
        address owner = vm.envAddress("OWNER_ADDRESS");

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        TokenSender oapp = new TokenSender(endpoint, owner);
        vm.stopBroadcast();

        console.log("MyOApp deployed to:", address(oapp));
    }
}
