// 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test, console} from "forge-std/Test.sol";
import {PaymentProcessor} from "../../contracts/PaymentProcessor.sol";
import {TokenSender} from "../../contracts/TokenSender.sol";
import {IWeb2Json} from "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";

contract PaymentProcessorProofTest is Test {
    PaymentProcessor public paymentProcessor;

    function setUp() public {
        paymentProcessor = new PaymentProcessor(TokenSender(address(0)));
    }

    function testProofSubmission() public {
        // Define the Proof struct components
        bytes32[] memory merkleProof = new bytes32[](4);
        merkleProof[0] = 0xeb3408088fdfad8402b1eeeea3e86b39bccf253a6b2eac5b213d602e183ff618;
        merkleProof[1] = 0x0da834f77c52d23e77c8ad13fe10558a4f292d73c101c947585435e73deb57c6;
        merkleProof[2] = 0x196873c37822e917d16f732bca4e27f95942ba1aa0fd81b1f78b3e5c6d2622de;
        merkleProof[3] = 0xdc4e1d3f377ffdc3e9c4cb1d47837336d88523a750201553b2c6d360c26e057b;

        // Define the RequestBody struct
        IWeb2Json.RequestBody memory requestBody = IWeb2Json.RequestBody({
            url: "https://wise.com/api/v3/payment/details",
            httpMethod: "GET",
            headers: "{\"Authorization\": \"Bearer 78addb7a-7988-4bab-bce2-26334d6838d5\"}",
            queryParams: "{\"paymentId\":1615160706, \"simplifiedResult\":0}",
            body: "",
            postProcessJq: "{paymentStatus: .paymentStatus, recipientId: (.recipient.id | tonumber), recipientAccount: (.recipient.account | split(\"(\")[1] | split(\")\")[0] | tonumber), paymentReference: (\"0x\" + .paymentReference) }",
            abiSignature: "{\"components\": [{\"internalType\": \"string\", \"name\": \"paymentStatus\", \"type\": \"string\"},{\"internalType\": \"uint256\", \"name\": \"recipientId\", \"type\": \"uint256\"},{\"internalType\": \"uint256\", \"name\": \"recipientAccount\", \"type\": \"uint256\"},{\"internalType\": \"bytes\", \"name\": \"paymentReference\", \"type\": \"bytes\"}],\"name\": \"task\",\"type\": \"tuple\"}"
        });

        // Define the ResponseBody struct
        IWeb2Json.ResponseBody memory responseBody = IWeb2Json.ResponseBody({
            abiEncodedData: hex"00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000003fcc77ed000000000000000000000000000000000000000000000000000000000451f3fe00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000b7472616e73666572726564000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002ebc10ea9f1d53c273d7fd25d39394b8b2eb761d2a0000766c5553445430000000000000000000000000000000000a000000000000000000000000000000000000"
        });

        // Define the Response struct
        IWeb2Json.Response memory response = IWeb2Json.Response({
            attestationType: 0x576562324a736f6e000000000000000000000000000000000000000000000000,
            sourceId: 0x5075626c69635765623200000000000000000000000000000000000000000000,
            votingRound: 1036988,
            lowestUsedTimestamp: 0,
            requestBody: requestBody,
            responseBody: responseBody
        });

        // Define the complete Proof struct
        IWeb2Json.Proof memory proof = IWeb2Json.Proof({
            merkleProof: merkleProof,
            data: response
        });

        // Submit the proof using the actual function call
        paymentProcessor.submitProof(proof);

        // If we reach here, the call was successful
        console.log("Proof submitted successfully");
    }
}