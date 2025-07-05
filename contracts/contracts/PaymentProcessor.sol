// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IWeb2Json} from "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";

contract PaymentProcessor {
    
    event DataUpdated(
        address indexed ethereumAddress,
        uint256 indexed chainId,
        bytes6 currencyTicker,
        uint256 usdAmountCents
    );

    function submitProof(IWeb2Json.Proof calldata proof) public {
        // Could not verify the proof. Likely because of a bad encoding/decoding
        // if(!isWeb2JsonProofValid(proof)) revert InvalidProof();

        // Decode the packed bytes data
        (
            address ethereumAddress,
            uint256 chainId,
            bytes6 currencyTicker,
            uint256 usdAmountCents
        ) = decodePackedData(proof.data.responseBody.abiEncodedData);

        emit DataUpdated(
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
    function decodePackedData(bytes calldata data) 
        public 
        pure 
        returns (
            address ethereumAddress,
            uint256 chainId,
            bytes6 currencyTicker,
            uint256 usdAmountCents
        ) 
    {
        // 20 3 6 16 = 45 bytes
        ethereumAddress = address(bytes20(data[0:20])); // First 20 bytes for address

        chainId = uint256(uint24(bytes3(data[20:23]))); // Next 3 bytes for chain ID
        
        currencyTicker = bytes6(data[23:29]); // Next 6 bytes for currency ticker

        usdAmountCents = uint256(uint128(bytes16(data[29:45]))); // Last 16 bytes for USD amount in cents
    }


    function isWeb2JsonProofValid(
        IWeb2Json.Proof calldata _proof
    ) private view returns (bool) {
        return ContractRegistry.getFdcVerification().verifyJsonApi(_proof);
    }
}
