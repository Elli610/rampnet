// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;
import {console} from "forge-std/console.sol";

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IWeb2Json} from "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";
import {TokenSender} from "./TokenSender.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {MockErc20} from "./MockErc20.sol";
import {IAssetManager} from "@flarenetwork/flare-periphery-contracts/coston2/IAssetManager.sol";

import {TestFtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";
import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IFeeCalculator} from "@flarenetwork/flare-periphery-contracts/coston2/IFeeCalculator.sol";


struct DTO {
    string paymentStatus;
    uint256 recipientId;
    uint256 recipientAccount;
    bytes paymentReference;
}

uint256 constant FLARE_MAINNET_CHAIN_ID = 14;
// Arbitrary chain Id set for xrpl testnet end receiver
uint256 constant XRPL_TESTNET_CHAIN_ID = 100;
// Layer0 offchain chain Ids for flare and hedera mainnets
uint256 constant FLARE_LZ_CHAIN_ID = 30316; // real: 30295
uint256 constant HEDERA_LZ_CHAIN_ID = 30295; // real: 30316

// Fxrp token address on Coston2 (token not available on flare mainnet)
address constant FXRP_COSTON2_ADDRESS = address(0x8b4abA9C4BD7DD961659b02129beE20c6286e17F); 
IAssetManager constant ASSET_MANAGER = IAssetManager(0xDeD50DA9C3492Bee44560a4B35cFe0e778F41eC5);

// Contract supposed to be deployed on Flare Coston2 testnet or Flare Mainnet (with proof verification disabled)
contract PaymentProcessor {

    TokenSender public immutable tokenSender;
    MockErc20 public immutable USDT0_FLARE;

    // Lz chainId -> currencyId -> token address
    mapping(uint256 => mapping(bytes6 => address)) public currencies;
    // currencyId -> flare feedId
    mapping(bytes6 => bytes21) public feedId;

    event DecodedReference(
        address indexed ethereumAddress,
        uint256 chainId,
        bytes6 currencyTicker,
        uint256 usdAmountCents
    );

    event TokenRegistered(
        uint256 indexed chainId,
        bytes6 indexed currencyTicker,
        address tokenAddress
    );

    error InvalidProof();
    error InvalidDataLength(uint256 length);

    constructor(TokenSender tokenSender_) {
        tokenSender = tokenSender_;
        // For demo purposes, we use a mocked USDT0 token
        USDT0_FLARE = new MockErc20("USDT0", "USDT0");

        // Register tokens for Flare Mainnet and Hedera Mainnet
        currencies[FLARE_LZ_CHAIN_ID][bytes6("Fxrp")] = address(FXRP_COSTON2_ADDRESS);
        emit TokenRegistered(
            FLARE_LZ_CHAIN_ID,
            bytes6("Fxrp"),
            address(1)
        );
        currencies[FLARE_LZ_CHAIN_ID][bytes6("USDT0")] = address(USDT0_FLARE); // Mocked USDT0 on Flare Coston2
        emit TokenRegistered(
            FLARE_LZ_CHAIN_ID,
            bytes6("USDT0"),
            address(2)
        );
        // Mint some USDT0 tokens to this contract (to emulate a real scenario)
        USDT0_FLARE.mint(address(this), 10_000 ether); // Mint 10_000 USDT0 token (18 decimals)

        // Hedera Mainnet
        currencies[HEDERA_LZ_CHAIN_ID][bytes6("Fxrp")] = address(1); // todo: deploy mock token  
        emit TokenRegistered(
            HEDERA_LZ_CHAIN_ID,
            bytes6("Fxrp"),
            address(1)
        );
        currencies[HEDERA_LZ_CHAIN_ID][bytes6("USDT0")] = address(2); // todo: deploy mock token 
        emit TokenRegistered(
            HEDERA_LZ_CHAIN_ID,
            bytes6("USDT0"),
            address(2)
        ); 

        feedId[bytes6("Fxrp")] = bytes21(0x015852502f55534400000000000000000000000000); // XRP/USD feed
        feedId[bytes6("USDT0")] = bytes21(0x01555344542f555344000000000000000000000000); // USDT/USD feed (USDT0 feed not available)
    }

    function submitProof(IWeb2Json.Proof calldata proof) public returns (
        uint256 recipientId,
        uint256 recipientAccount,
        string memory paymentStatus,
        address receiverEthereumAddress,
        uint256 chainId,
        bytes6 currencyTicker,
        uint256 usdAmountCents
    ){
        // Since Web2Json proof verification is not available on Flare Mainnet,
        // we skip the verification step here.
        if (block.chainid != FLARE_MAINNET_CHAIN_ID) {
            if(!isWeb2JsonProofValid(proof)) revert InvalidProof();
        }

        DTO memory aa = abi.decode(
            proof.data.responseBody.abiEncodedData,
            (DTO)
        );

        (
            receiverEthereumAddress,
            chainId,
            currencyTicker,
            usdAmountCents
        ) = decodePackedData(aa.paymentReference);

        emit DecodedReference(
            receiverEthereumAddress,
            chainId,
            currencyTicker,
            usdAmountCents
        );

        recipientId = aa.recipientId;
        recipientAccount = aa.recipientAccount;
        paymentStatus = aa.paymentStatus;

        address currency = getCurrencyAddr(
            chainId,
            currencyTicker
        );

        (uint256 price, int8 decimals) = usdPriceForAsset(currencyTicker);

        uint256 amount = decimals >= 0 ? (usdAmountCents * 10**uint256(uint8(decimals)) * 10**uint256(uint8(decimals)) ) / (price * 100) : (usdAmountCents * price) / (10**uint256(uint8(decimals))*10**uint256(uint8(decimals)) * 100); // Math.muldiv

        // Send the payment
        if (chainId == FLARE_LZ_CHAIN_ID) {

            IERC20 token = IERC20(currency);

            require(token.balanceOf(address(this)) >= amount, "Insufficient balance in contract");
            
            token.transfer(receiverEthereumAddress, amount);
        } else if (chainId == XRPL_TESTNET_CHAIN_ID) {
            uint256 lot_size = 10;

            require(amount % lot_size == 0, "Amount must be a multiple of lot size");
            // Bridge to XRPL Testnet

            // allow the assetManager to transfer the token
            IERC20 token = IERC20(currency);
            require(token.balanceOf(address(this)) >= amount, "Insufficient balance in contract");

            // Increase allowance
            token.approve(address(ASSET_MANAGER), amount);

            // // Redeem the token on XRPL Testnet
            // ASSET_MANAGER.redeem(
            //     amount / lot_size, // Convert to lots
            //     bytesToXrplAddress(receiverEthereumAddress), // Convert address to XRPL format
            //     payable(receiverEthereumAddress)
            // );
            revert("todo"); // todo: convert bytes to XRPL address and call redeem function (first get 33 bytes addresses)

        } else{
            // Pass through Layer0
            if (chainId != FLARE_MAINNET_CHAIN_ID) {
                revert("Cannot trigger Layer0 from Coston2 testnet");
            }

            tokenSender.sendDistribution(
            uint32(chainId),
            currency,
            amount,
            receiverEthereumAddress,
            "" // options
            );
        }
    }

    /**
    * @dev Manually decode packed bytes data into component parts
    * @param data The packed bytes data to decode
    * @return ethereumAddress The decoded address (20 bytes)
    * @return chainId The decoded chain ID (4 bytes as uint256)
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
        if (data.length != 46) revert InvalidDataLength(data.length);
        
        // Extract address (20 bytes)
        bytes20 addressBytes;
        for (uint256 i = 0; i < 20; i++) {
            addressBytes |= bytes20(data[i] & 0xFF) >> (i * 8);
        }
        ethereumAddress = address(addressBytes);
        
        // Extract chain ID (4 bytes -> uint256)
        chainId = 
                uint256(uint8(data[20])) << 24 |
                uint256(uint8(data[21])) << 16 | 
                uint256(uint8(data[22])) << 8 | 
                uint256(uint8(data[23]));
        
        // Extract currency ticker (6 bytes)
        for (uint256 i = 0; i < 6; i++) {
            currencyTicker |= bytes6(data[24 + i] & 0xFF) >> (i * 8);
        }
        
        // Extract USD amount (16 bytes -> uint256)
        for (uint256 i = 0; i < 16; i++) {
            usdAmountCents |= uint256(uint8(data[30 + i])) << ((15 - i) * 8);
        }
    }

    function isWeb2JsonProofValid(
        IWeb2Json.Proof calldata _proof
    ) private view returns (bool) {
        return ContractRegistry.getFdcVerification().verifyJsonApi(_proof);
    }

    function getCurrencyAddr(
        uint256 chainId,
        bytes6 currencyTicker
    ) private view returns (address token) {
        token = currencies[chainId][currencyTicker];

        require(token != address(0), "Token not registered for this chainId and currencyTicker");
    }

    function usdPriceForAsset(bytes6 asset) 
        private 
        view 
        returns (uint256 price, int8 decimals)
    {
        bytes21 feed = feedId[asset];
        require(feed != bytes21(0), "Feed not registered for this asset");

        // Get the price from the Flare Oracle
        /* THIS IS A TEST METHOD, in production use: ftsoV2 = ContractRegistry.getFtsoV2(); */
        TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();

        (price, decimals, /** todo: check if timestamp is not too far in the past */) =  ftsoV2.getFeedById(feed);
    }

    function debugUsdPriceForAsset(
        bytes6 asset
    ) public view returns (uint256 price, int8 decimals) {
        return usdPriceForAsset(asset);
    }
}
