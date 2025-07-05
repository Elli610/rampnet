// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

// Contract imports
import {TokenSender, MessagingFee} from "../../contracts/InfoSender.sol";
import {TokenDistributor} from "../../contracts/TokenDistributor.sol";
import {console} from "forge-std/console.sol";

// OApp imports
import {IOAppOptionsType3, EnforcedOptionParam} from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";
import {OptionsBuilder} from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";

// OZ imports
import {IERC20} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Forge imports
import "forge-std/console.sol";

// DevTools imports
import {TestHelperOz5} from "@layerzerolabs/test-devtools-evm-foundry/contracts/TestHelperOz5.sol";

// Mock ERC20 token for testing
contract MockToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000 * 10 ** 18); // Mint 1M tokens
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract TokenContractsTest is TestHelperOz5 {
    using OptionsBuilder for bytes;

    uint32 private flareEid = 1; // Flare chain (sender)
    uint32 private ethEid = 2; // Ethereum chain (distributor)

    TokenSender private senderContract;
    TokenDistributor private distributorContract;

    MockToken private tokenOnEth;

    address private userA = address(0x1);
    address private userB = address(0x2);
    address private recipient = address(0x3);

    uint256 private initialBalance = 100 ether;
    uint256 private tokenAmount = 1000 * 10 ** 18; // 1000 tokens

    function setUp() public virtual override {
        vm.deal(userA, 1000 ether);
        vm.deal(userB, 1000 ether);
        vm.deal(recipient, 1000 ether);

        super.setUp();
        setUpEndpoints(2, LibraryType.UltraLightNode);

        // Deploy TokenSender on Flare (chain A)
        senderContract = TokenSender(
            _deployOApp(
                type(TokenSender).creationCode,
                abi.encode(address(endpoints[flareEid]), address(this))
            )
        );

        // Deploy TokenDistributor on Ethereum (chain B)
        distributorContract = TokenDistributor(
            _deployOApp(
                type(TokenDistributor).creationCode,
                abi.encode(address(endpoints[ethEid]), address(this))
            )
        );

        // Deploy mock token on Ethereum
        tokenOnEth = new MockToken("Test Token", "TEST");

        // Wire the contracts together
        address[] memory oapps = new address[](2);
        oapps[0] = address(senderContract);
        oapps[1] = address(distributorContract);
        this.wireOApps(oapps);

        // Setup distributor contract
        distributorContract.setSupportedToken(address(tokenOnEth), true);

        // Fund distributor contract with tokens
        tokenOnEth.transfer(address(distributorContract), tokenAmount * 10); // 10,000 tokens

        // Setup sender contract
        senderContract.setSupportedChain(ethEid, true);
    }

    function test_constructor() public {
        assertEq(senderContract.owner(), address(this));
        assertEq(distributorContract.owner(), address(this));
        assertEq(
            address(senderContract.endpoint()),
            address(endpoints[flareEid])
        );
        assertEq(
            address(distributorContract.endpoint()),
            address(endpoints[ethEid])
        );
    }

    function test_supported_tokens_and_chains() public {
        // Test token support
        assertTrue(distributorContract.isTokenSupported(address(tokenOnEth)));
        assertFalse(distributorContract.isTokenSupported(address(0x123)));

        // Test chain support
        assertTrue(senderContract.isChainSupported(ethEid));
        assertFalse(senderContract.isChainSupported(999));

        // Test balances
        assertEq(
            distributorContract.getTokenBalance(address(tokenOnEth)),
            tokenAmount * 10
        );
        assertEq(tokenOnEth.balanceOf(recipient), 0);
    }

    function test_single_distribution() public {
        bytes memory options = OptionsBuilder
            .newOptions()
            .addExecutorLzReceiveOption(200000, 0);

        // Quote the fee
        MessagingFee memory fee = senderContract.quoteDistribution(
            ethEid,
            address(tokenOnEth),
            tokenAmount,
            recipient,
            options,
            false
        );

        // Check initial state
        assertEq(senderContract.getMessageCount(), 0);
        assertEq(tokenOnEth.balanceOf(recipient), 0);

        // Send distribution instruction
        vm.prank(userA);
        senderContract.sendDistribution{value: fee.nativeFee}(
            ethEid,
            address(tokenOnEth),
            tokenAmount,
            recipient,
            options
        );

        // Verify packets (this processes the cross-chain message)
        verifyPackets(ethEid, addressToBytes32(address(distributorContract)));

        // Check final state
        assertEq(senderContract.getMessageCount(), 1);

        console.logUint(tokenOnEth.balanceOf(recipient));
        assertEq(tokenOnEth.balanceOf(recipient), tokenAmount);

        // Check last distribution data
        (address currency, uint256 amount, address rcpt) = distributorContract
            .lastDistribution();
        assertEq(currency, address(tokenOnEth));
        assertEq(amount, tokenAmount);
        assertEq(rcpt, recipient);
    }

    /*function test_batch_distribution() public {
        bytes memory options = OptionsBuilder
            .newOptions()
            .addExecutorLzReceiveOption(300000, 0);

        address recipient1 = address(0x101);
        address recipient2 = address(0x102);
        address recipient3 = address(0x103);

        // Create batch distribution data
        TokenSender.TokenDistributionData[]
            memory distributions = new TokenSender.TokenDistributionData[](3);
        distributions[0] = TokenSender.TokenDistributionData({
            currency: address(tokenOnEth),
            amount: tokenAmount,
            recipient: recipient1
        });
        distributions[1] = TokenSender.TokenDistributionData({
            currency: address(tokenOnEth),
            amount: tokenAmount * 2,
            recipient: recipient2
        });
        distributions[2] = TokenSender.TokenDistributionData({
            currency: address(tokenOnEth),
            amount: tokenAmount / 2,
            recipient: recipient3
        });

        // Quote fee (approximate - batch operations might need more gas)
        MessagingFee memory fee = senderContract.quoteDistribution(
            ethEid,
            address(tokenOnEth),
            tokenAmount,
            recipient1,
            options,
            false
        );

        // Send batch distribution
        vm.prank(userA);
        senderContract.sendBatchDistribution{value: fee.nativeFee * 2}( // Extra gas for safety
            ethEid,
            distributions,
            options
        );

        // Process the message
        verifyPackets(ethEid, addressToBytes32(address(distributorContract)));

        // Verify distributions
        assertEq(tokenOnEth.balanceOf(recipient1), tokenAmount);
        assertEq(tokenOnEth.balanceOf(recipient2), tokenAmount * 2);
        assertEq(tokenOnEth.balanceOf(recipient3), tokenAmount / 2);
        assertEq(senderContract.getMessageCount(), 1);
    }*/

    function test_distribution_failure_insufficient_balance() public {
        bytes memory options = OptionsBuilder
            .newOptions()
            .addExecutorLzReceiveOption(200000, 0);

        uint256 largeAmount = tokenAmount * 100; // More than contract balance

        MessagingFee memory fee = senderContract.quoteDistribution(
            ethEid,
            address(tokenOnEth),
            largeAmount,
            recipient,
            options,
            false
        );

        vm.prank(userA);
        senderContract.sendDistribution{value: fee.nativeFee}(
            ethEid,
            address(tokenOnEth),
            largeAmount,
            recipient,
            options
        );

        verifyPackets(ethEid, addressToBytes32(address(distributorContract)));

        // Should fail, recipient gets nothing
        assertEq(tokenOnEth.balanceOf(recipient), 0);

        // But message counter still increments
        assertEq(senderContract.getMessageCount(), 1);
    }

    function test_distribution_failure_unsupported_token() public {
        bytes memory options = OptionsBuilder
            .newOptions()
            .addExecutorLzReceiveOption(200000, 0);

        // Deploy another token that's not supported
        MockToken unsupportedToken = new MockToken("Unsupported", "UNSUP");

        MessagingFee memory fee = senderContract.quoteDistribution(
            ethEid,
            address(unsupportedToken),
            tokenAmount,
            recipient,
            options,
            false
        );

        vm.prank(userA);
        senderContract.sendDistribution{value: fee.nativeFee}(
            ethEid,
            address(unsupportedToken),
            tokenAmount,
            recipient,
            options
        );

        verifyPackets(ethEid, addressToBytes32(address(distributorContract)));

        // Should fail, recipient gets nothing
        assertEq(unsupportedToken.balanceOf(recipient), 0);
        assertEq(senderContract.getMessageCount(), 1);
    }

    function test_validation_failures() public {
        bytes memory options = OptionsBuilder
            .newOptions()
            .addExecutorLzReceiveOption(200000, 0);

        // Test unsupported chain
        vm.expectRevert("Unsupported destination chain");
        vm.prank(userA);
        senderContract.sendDistribution{value: 1 ether}(
            999, // Unsupported chain
            address(tokenOnEth),
            tokenAmount,
            recipient,
            options
        );

        // Test zero recipient
        vm.expectRevert("Invalid recipient address");
        vm.prank(userA);
        senderContract.sendDistribution{value: 1 ether}(
            ethEid,
            address(tokenOnEth),
            tokenAmount,
            address(0),
            options
        );

        // Test zero amount
        vm.expectRevert("Invalid amount");
        vm.prank(userA);
        senderContract.sendDistribution{value: 1 ether}(
            ethEid,
            address(tokenOnEth),
            0,
            recipient,
            options
        );
    }

    function test_emergency_withdraw() public {
        uint256 initialOwnerBalance = tokenOnEth.balanceOf(address(this));
        uint256 contractBalance = distributorContract.getTokenBalance(
            address(tokenOnEth)
        );

        // Emergency withdraw
        distributorContract.emergencyWithdraw(
            address(tokenOnEth),
            contractBalance
        );

        assertEq(distributorContract.getTokenBalance(address(tokenOnEth)), 0);
        assertEq(
            tokenOnEth.balanceOf(address(this)),
            initialOwnerBalance + contractBalance
        );
    }

    function test_admin_functions() public {
        // Test setSupportedToken
        address newToken = address(0x456);
        assertFalse(distributorContract.isTokenSupported(newToken));

        distributorContract.setSupportedToken(newToken, true);
        assertTrue(distributorContract.isTokenSupported(newToken));

        distributorContract.setSupportedToken(newToken, false);
        assertFalse(distributorContract.isTokenSupported(newToken));

        // Test setSupportedChain
        uint32 newChain = 999;
        assertFalse(senderContract.isChainSupported(newChain));

        senderContract.setSupportedChain(newChain, true);
        assertTrue(senderContract.isChainSupported(newChain));

        senderContract.setSupportedChain(newChain, false);
        assertFalse(senderContract.isChainSupported(newChain));
    }
}
