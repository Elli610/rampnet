pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import {TokenDistributor} from "../contracts/TokenDistributor.sol";

contract DeployOApp is Script {
    function run() external {
        // Replace these env vars with your own values
        address endpoint = vm.envAddress("ETHEREUM_HOLESKY_ENDPOINT_V2");
        address owner = vm.envAddress("OWNER_ADDRESS");

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        TokenDistributor oapp = new TokenDistributor(endpoint, owner);
        vm.stopBroadcast();

        console.log("MyOApp deployed to:", address(oapp));
    }
}
