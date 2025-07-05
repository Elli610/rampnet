// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IWeb2Json} from "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";

contract MasterIssuer {
    uint256 public totalQueries;

    event DataUpdated(uint256 indexed totalQueries, uint256 response);

    error InvalidProof();

    function submitProof(IWeb2Json.Proof calldata proof) public {
        if(!isWeb2JsonProofValid(proof)) revert InvalidProof();

        uint256 response = abi.decode(
            proof.data.responseBody.abiEncodedData,
            (uint256)
        );

        totalQueries++;

        emit DataUpdated(totalQueries, response);
    }

    function isWeb2JsonProofValid(
        IWeb2Json.Proof calldata _proof
    ) private view returns (bool) {
        return ContractRegistry.getFdcVerification().verifyJsonApi(_proof);
    }
}
