// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {PaymentProcessor} from "../contracts/PaymentProcessor.sol";
import {TokenSender} from "../contracts/TokenSender.sol";

/*
forge script scripts/DeployPaymentProcessor.s.sol:DeployPaymentProcessor \
  --rpc-url https://coston2-api.flare.network/ext/C/rpc \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url https://flare-explorer.flare.network/api
*/
/*
verify:
forge verify-contract 0xb70229cae82A5B0D68A9231E8c4d4478aD2395e9 \
  contracts/PaymentProcessor.sol:PaymentProcessor \
  --rpc-url https://coston2-api.flare.network/ext/C/rpc \
  --verifier blockscout \
  --verifier-url https://coston2-explorer.flare.network/api
*/
contract DeployPaymentProcessor is Script {
    function run() external {
        // Get the private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the contract
        PaymentProcessor paymentProcessor = new PaymentProcessor(TokenSender(address(0)));

        // (uint256 price, int8 decimals) = paymentProcessor.debugUsdPriceForAsset(bytes6("USDT0"));

        // console.log("xrp/usd price: ", price);
        // console.log("xrp/usd decimals: ", decimals);

        // uint256 usdAmountCents = 100 * 10; // 10 USD in cents

        // uint256 amount = decimals >= 0 ? (usdAmountCents * 10**uint256(uint8(decimals)) * 10**uint256(uint8(decimals)) ) / (price * 100) : (usdAmountCents * price) / (10**uint256(uint8(decimals))*10**uint256(uint8(decimals)) * 100); // Math.muldiv
        // console.log("amount: ", amount);
        // Stop broadcasting
        vm.stopBroadcast();
        
        // Log the deployed contract address
        console.log("PaymentProcessor deployed to:", address(paymentProcessor));
    }
}
