pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import {MyOApp} from "../contracts/MyOApp.sol";

contract DeployOApp is Script {
    function run() external {
        // Replace these env vars with your own values
        address endpoint = vm.envAddress("HEDERA_ENDPOINT_V2");
        address owner = vm.envAddress("OWNER_ADDRESS");

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        MyOApp oapp = new MyOApp(endpoint, owner);
        vm.stopBroadcast();

        console.log("MyOApp deployed to:", address(oapp));
    }
}
