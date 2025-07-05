// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import {OApp, Origin, MessagingFee} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import {OAppOptionsType3} from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSender is OApp, OAppOptionsType3 {
    /// @notice Struct to hold token distribution data (must match TokenDistributor)
    struct TokenDistributionData {
        address currency; // Token contract address on destination chain
        uint256 amount; // Amount to distribute
        address recipient; // Address to send tokens to
    }

    /// @notice Msg type for sending distribution instructions
    uint16 public constant SEND_DISTRIBUTION = 1;

    /// @notice Counter for tracking sent messages
    uint256 public messageCount;

    /// @notice Mapping to track supported destination chains
    mapping(uint32 => bool) public supportedChains;

    /// @notice Events
    event DistributionSent(
        uint32 indexed dstEid,
        address indexed currency,
        uint256 amount,
        address indexed recipient,
        uint256 messageId
    );

    event ChainSupported(uint32 indexed eid, bool supported);

    /// @notice Initialize with Endpoint V2 and owner address
    /// @param _endpoint The local chain's LayerZero Endpoint V2 address
    /// @param _owner    The address permitted to configure this OApp
    constructor(
        address _endpoint,
        address _owner
    ) OApp(_endpoint, _owner) Ownable(_owner) {}

    // ──────────────────────────────────────────────────────────────────────────────
    // ADMIN FUNCTIONS
    // ──────────────────────────────────────────────────────────────────────────────

    /// @notice Add or remove supported destination chains
    /// @param _eid Endpoint ID of the destination chain
    /// @param _supported Whether the chain is supported
    function setSupportedChain(
        uint32 _eid,
        bool _supported
    ) external onlyOwner {
        supportedChains[_eid] = _supported;
        emit ChainSupported(_eid, _supported);
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // QUOTE FUNCTIONS
    // ──────────────────────────────────────────────────────────────────────────────

    /// @notice Quotes the gas needed to send a distribution instruction
    /// @param _dstEid Destination chain's endpoint ID
    /// @param _currency Token contract address on destination chain
    /// @param _amount Amount to distribute
    /// @param _recipient Address to send tokens to
    /// @param _options Message execution options
    /// @param _payInLzToken Whether to return fee in ZRO token
    /// @return fee A `MessagingFee` struct containing the calculated gas fee
    function quoteDistribution(
        uint32 _dstEid,
        address _currency,
        uint256 _amount,
        address _recipient,
        bytes calldata _options,
        bool _payInLzToken
    ) public view returns (MessagingFee memory fee) {
        TokenDistributionData memory distributionData = TokenDistributionData({
            currency: _currency,
            amount: _amount,
            recipient: _recipient
        });

        bytes memory _message = abi.encode(distributionData);
        fee = _quote(
            _dstEid,
            _message,
            combineOptions(_dstEid, SEND_DISTRIBUTION, _options),
            _payInLzToken
        );
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // SEND FUNCTIONS
    // ──────────────────────────────────────────────────────────────────────────────

    /// @notice Send distribution instruction to a remote TokenDistributor
    /// @param _dstEid Destination Endpoint ID
    /// @param _currency Token contract address on destination chain
    /// @param _amount Amount to distribute
    /// @param _recipient Address to send tokens to
    /// @param _options Execution options for gas on the destination
    function sendDistribution(
        uint32 _dstEid,
        address _currency,
        uint256 _amount,
        address _recipient,
        bytes calldata _options
    ) external payable {
        // Validate inputs
        require(supportedChains[_dstEid], "Unsupported destination chain");
        require(_recipient != address(0), "Invalid recipient address");
        require(_amount > 0, "Invalid amount");

        // Create distribution data
        TokenDistributionData memory distributionData = TokenDistributionData({
            currency: _currency,
            amount: _amount,
            recipient: _recipient
        });

        // Encode the message
        bytes memory _message = abi.encode(distributionData);

        // Increment message counter
        messageCount++;

        // Send the cross-chain message
        _lzSend(
            _dstEid,
            _message,
            combineOptions(_dstEid, SEND_DISTRIBUTION, _options),
            MessagingFee(msg.value, 0),
            payable(msg.sender)
        );

        // Emit event
        emit DistributionSent(
            _dstEid,
            _currency,
            _amount,
            _recipient,
            messageCount
        );
    }

    /// @notice Batch send distribution instructions to multiple recipients on the same chain
    /// @param _dstEid Destination Endpoint ID
    /// @param _distributions Array of distribution data
    /// @param _options Execution options for gas on the destination
    function sendBatchDistribution(
        uint32 _dstEid,
        TokenDistributionData[] calldata _distributions,
        bytes calldata _options
    ) external payable {
        require(supportedChains[_dstEid], "Unsupported destination chain");
        require(_distributions.length > 0, "Empty distributions array");
        require(_distributions.length <= 50, "Too many distributions"); // Prevent gas issues

        // Validate all distributions
        for (uint256 i = 0; i < _distributions.length; i++) {
            require(
                _distributions[i].recipient != address(0),
                "Invalid recipient address"
            );
            require(_distributions[i].amount > 0, "Invalid amount");
        }

        // Encode the message
        bytes memory _message = abi.encode(_distributions);

        // Increment message counter
        messageCount++;

        // Send the cross-chain message
        _lzSend(
            _dstEid,
            _message,
            combineOptions(_dstEid, SEND_DISTRIBUTION, _options),
            MessagingFee(msg.value, 0),
            payable(msg.sender)
        );

        // Emit events for each distribution
        for (uint256 i = 0; i < _distributions.length; i++) {
            emit DistributionSent(
                _dstEid,
                _distributions[i].currency,
                _distributions[i].amount,
                _distributions[i].recipient,
                messageCount
            );
        }
    }

    /// @notice Send distribution to multiple chains (same recipient, same token)
    /// @param _dstEids Array of destination Endpoint IDs
    /// @param _currency Token contract address (should exist on all destination chains)
    /// @param _amount Amount to distribute on each chain
    /// @param _recipient Address to send tokens to (same on all chains)
    /// @param _options Execution options for gas on the destinations
    /*    function sendMultiChainDistribution(
        uint32[] calldata _dstEids,
        address _currency,
        uint256 _amount,
        address _recipient,
        bytes calldata _options
    ) external payable {
        require(_dstEids.length > 0, "Empty chains array");
        require(_dstEids.length <= 10, "Too many chains"); // Prevent gas issues
        require(_recipient != address(0), "Invalid recipient address");
        require(_amount > 0, "Invalid amount");

        // Calculate total required fee
        uint256 totalFee = 0;
        for (uint256 i = 0; i < _dstEids.length; i++) {
            require(supportedChains[_dstEids[i]], "Unsupported destination chain");

            MessagingFee memory fee = quoteDistribution(_dstEids[i], _currency, _amount, _recipient, _options, false);
            totalFee += fee.nativeFee;
        }

        require(msg.value >= totalFee, "Insufficient fee");

        // Create distribution data
        TokenDistributionData memory distributionData = TokenDistributionData({
            currency: _currency,
            amount: _amount,
            recipient: _recipient
        });

        bytes memory _message = abi.encode(distributionData);

        // Send to each chain
        uint256 remainingValue = msg.value;
        for (uint256 i = 0; i < _dstEids.length; i++) {
            messageCount++;

            MessagingFee memory fee = quoteDistribution(_dstEids[i], _currency, _amount, _recipient, _options, false);

            _lzSend(
                _dstEids[i],
                _message,
                combineOptions(_dstEids[i], SEND_DISTRIBUTION, _options),
                MessagingFee(fee.nativeFee, 0),
                payable(msg.sender)
            );

            remainingValue -= fee.nativeFee;

            emit DistributionSent(_dstEids[i], _currency, _amount, _recipient, messageCount);
        }

        // Refund any excess
        if (remainingValue > 0) {
            payable(msg.sender).transfer(remainingValue);
        }
    }*/

    // ──────────────────────────────────────────────────────────────────────────────
    // VIEW FUNCTIONS
    // ──────────────────────────────────────────────────────────────────────────────

    /// @notice Check if a chain is supported
    /// @param _eid Endpoint ID
    /// @return supported Whether the chain is supported
    function isChainSupported(uint32 _eid) external view returns (bool) {
        return supportedChains[_eid];
    }

    /// @notice Get total number of messages sent
    /// @return count Message count
    function getMessageCount() external view returns (uint256) {
        return messageCount;
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // RECEIVE FUNCTIONS (Optional - for acknowledgments)
    // ──────────────────────────────────────────────────────────────────────────────

    /// @notice Handle incoming messages (optional - for acknowledgments from TokenDistributor)
    /// @param _origin Source chain information
    /// @param _guid Message GUID
    /// @param _message Encoded message data
    /// @param _executor Executor address
    /// @param _extraData Extra data
    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _extraData
    ) internal override {
        // Optional: Handle acknowledgments or status updates from TokenDistributor
        // For now, just store the last received message
        // You can expand this to handle success/failure confirmations
    }
}
