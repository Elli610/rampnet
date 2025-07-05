// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IWeb2Json} from "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";

contract MasterIssuer {

    event DataUpdated(
        uint256 indexed recipientId,
        uint256 indexed recipientAccount,
        string paymentStatus,
        string paymentReference
    );

    error InvalidProof();

    function submitProof(IWeb2Json.Proof calldata proof) public {
        if(!isWeb2JsonProofValid(proof)) revert InvalidProof();

       (string memory paymentStatus, uint256 recipientId,uint256 recipientAccount, string memory paymentReference) = abi.decode(
            proof.data.responseBody.abiEncodedData,
            (string, uint256, uint256, string)
        );

        emit DataUpdated(
            recipientId,
            recipientAccount,
            paymentStatus,
            paymentReference
        );
    }

    function isWeb2JsonProofValid(
        IWeb2Json.Proof calldata _proof
    ) private view returns (bool) {
        return ContractRegistry.getFdcVerification().verifyJsonApi(_proof);
    }
}
