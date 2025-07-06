// 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test, console} from "forge-std/Test.sol";
import {PaymentProcessor} from "../../contracts/PaymentProcessor.sol";
import {TokenSender} from "../../contracts/TokenSender.sol";
import {IWeb2Json} from "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";

contract PaymentProcessorProofTest is Test {
    
    // Base58 alphabet used by XRPL
    string constant ALPHABET = "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz";
    
    function bytesToXrplAddress(bytes20 addr) private pure returns (string memory) {
        // Create payload: 0x00 + 20 bytes + 4 byte checksum
        bytes memory payload = new bytes(25);
        
        // Add version byte (0x00 for XRPL addresses)
        payload[0] = 0x00;
        
        // Add the 20-byte address
        for (uint i = 0; i < 20; i++) {
            payload[i + 1] = addr[i];
        }
        
        // Calculate double SHA256 checksum
        bytes memory slice = new bytes(21);
        for (uint i = 0; i < 21; i++) {
            slice[i] = payload[i];
        }
        bytes32 hash1 = sha256(abi.encodePacked(slice));
        bytes32 hash2 = sha256(abi.encodePacked(hash1));
        
        // Add first 4 bytes of checksum
        for (uint i = 0; i < 4; i++) {
            payload[21 + i] = hash2[i];
        }
        
        // Convert to base58
        return base58Encode(payload);
    }
    
    function base58Encode(bytes memory data) private pure returns (string memory) {
        if (data.length == 0) return "";
        
        // Calculate the number of leading zeros
        uint leadingZeros = 0;
        for (uint i = 0; i < data.length && data[i] == 0; i++) {
            leadingZeros++;
        }
        
        // Convert to big integer representation
        uint[] memory digits = new uint[](data.length * 138 / 100 + 1);
        uint digitsLength = 1;
        
        for (uint i = 0; i < data.length; i++) {
            uint carry = uint(uint8(data[i]));
            for (uint j = 0; j < digitsLength; j++) {
                carry += digits[j] * 256;
                digits[j] = carry % 58;
                carry /= 58;
            }
            while (carry > 0) {
                digits[digitsLength] = carry % 58;
                digitsLength++;
                carry /= 58;
            }
        }
        
        // Convert to base58 string
        bytes memory result = new bytes(leadingZeros + digitsLength);
        
        // Add leading zeros as 'r' characters
        for (uint i = 0; i < leadingZeros; i++) {
            result[i] = bytes(ALPHABET)[0];
        }
        
        // Add base58 digits (in reverse order)
        for (uint i = 0; i < digitsLength; i++) {
            result[leadingZeros + i] = bytes(ALPHABET)[digits[digitsLength - 1 - i]];
        }
        
        return string(result);
    }
    
    // Public function for testing
    function convertAddress(bytes20 addr) public pure returns (string memory) {
        return bytesToXrplAddress(addr);
    }


    // function testJsp() public {

    //     // xrpl to bytes: 724c487a507358366f586b7a5532714c31326b484348384738636e5a763172424a68
    //     bytesToXrplAddress
    // }
}
