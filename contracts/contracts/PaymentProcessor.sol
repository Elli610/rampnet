// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IWeb2Json} from "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";

// // enum Chains {

// // }

// // enum Tokens {
// //     USDC,
// //     USDT,
// //     FLR
// // }

struct DTO {
    string paymentStatus;
    uint256 recipientId;
    uint256 recipientAccount;
    bytes paymentReference;
}

contract PaymentProcessor {
    
   event DataUpdated(
        uint256 indexed recipientId,
        uint256 indexed recipientAccount,
        string paymentStatus,
        bytes paymentReference
    );

    event DecodedReference(
        address indexed ethereumAddress,
        uint256 chainId,
        bytes6 currencyTicker,
        uint256 usdAmountCents
    );

    error InvalidProof();
    error InvalidDataLength(uint256 length);

    function submitProof(IWeb2Json.Proof calldata proof) public {
        if(!isWeb2JsonProofValid(proof)) revert InvalidProof();

       DTO memory aa = abi.decode(
            proof.data.responseBody.abiEncodedData,
            (DTO)
        );

        emit DataUpdated(
            aa.recipientId,
            aa.recipientAccount,
            aa.paymentStatus,
            aa.paymentReference
        );

        (
            address ethereumAddress,
            uint256 chainId,
            bytes6 currencyTicker,
            uint256 usdAmountCents
        ) = decodePackedData(aa.paymentReference);

        emit DecodedReference(
            ethereumAddress,
            chainId,
            currencyTicker,
            usdAmountCents
        );
    }

    /**
    * @dev Manually decode packed bytes data into component parts
    * @param data The packed bytes data to decode
    * @return ethereumAddress The decoded address (20 bytes)
    * @return chainId The decoded chain ID (32 bytes as uint256)
    * @return currencyTicker The decoded currency ticker (6 bytes)
    * @return usdAmountCents The decoded USD amount in cents (32 bytes as uint256)
    */
    function decodePackedData(bytes memory data) 
        public 
        pure 
        returns (
            address ethereumAddress,
            uint256 chainId,
            bytes6 currencyTicker,
            uint256 usdAmountCents
        ) 
    {
        if (data.length != 45) revert InvalidDataLength(data.length);
        
        // Extract address (20 bytes)
        bytes20 addressBytes;
        for (uint256 i = 0; i < 20; i++) {
            addressBytes |= bytes20(data[i] & 0xFF) >> (i * 8);
        }
        ethereumAddress = address(addressBytes);
        
        // Extract chain ID (3 bytes -> uint256)
        chainId = uint256(uint8(data[20])) << 16 | 
                uint256(uint8(data[21])) << 8 | 
                uint256(uint8(data[22]));
        
        // Extract currency ticker (6 bytes)
        for (uint256 i = 0; i < 6; i++) {
            currencyTicker |= bytes6(data[23 + i] & 0xFF) >> (i * 8);
        }
        
        // Extract USD amount (16 bytes -> uint256)
        for (uint256 i = 0; i < 16; i++) {
            usdAmountCents |= uint256(uint8(data[29 + i])) << ((15 - i) * 8);
        }
    }

    function isWeb2JsonProofValid(
        IWeb2Json.Proof calldata _proof
    ) private view returns (bool) {
        return ContractRegistry.getFdcVerification().verifyJsonApi(_proof);
    }
}
