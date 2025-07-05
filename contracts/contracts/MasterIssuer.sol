// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IWeb2Json} from "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";

contract MasterIssuer {
    uint256 public totalFacts;

    event LengthUpdated(uint256 indexed factId, uint256 length);

    error InvalidProof();

    function submitProof(IWeb2Json.Proof calldata proof) public {
        require(isWeb2JsonProofValid(proof), "Invalid Proof");

        uint256 factLength = abi.decode(
            proof.data.responseBody.abiEncodedData,
            (uint256)
        );

        totalFacts++;

        emit LengthUpdated(totalFacts, factLength);
    }

    function isWeb2JsonProofValid(
        IWeb2Json.Proof calldata _proof
    ) private view returns (bool) {
        return ContractRegistry.getFdcVerification().verifyJsonApi(_proof);
    }
}
