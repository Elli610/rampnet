// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import {OApp, Origin, MessagingFee} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import {OAppOptionsType3} from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TokenDistributor is OApp, OAppOptionsType3 {
    using SafeERC20 for IERC20;

    /// @notice Struct to hold token transfer data
    struct TokenTransferData {
        address currency; // Token contract address
        uint256 amount; // Amount to transfer
        address recipient; // Address to send tokens to
    }

    /// @notice Last distribution data received
    TokenTransferData public lastDistribution;

    /// @notice Msg type for receiving distribution instructions
    uint16 public constant RECEIVE_DISTRIBUTION = 1;

    /// @notice Mapping to track supported tokens
    mapping(address => bool) public supportedTokens;

    /// @notice Events
    event TokensDistributed(
        address indexed currency,
        uint256 amount,
        address indexed recipient,
        uint32 indexed srcEid
    );

    event TokenDistributionFailed(
        address indexed currency,
        uint256 amount,
        address indexed recipient,
        uint32 indexed srcEid,
        string reason
    );

    event TokenSupported(address indexed token, bool supported);

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

    /// @notice Add or remove supported tokens
    /// @param _token Token contract address
    /// @param _supported Whether the token is supported
    function setSupportedToken(
        address _token,
        bool _supported
    ) external onlyOwner {
        supportedTokens[_token] = _supported;
        emit TokenSupported(_token, _supported);
    }

    /// @notice Emergency withdraw function for stuck tokens
    /// @param _token Token contract address
    /// @param _amount Amount to withdraw
    function emergencyWithdraw(
        address _token,
        uint256 _amount
    ) external onlyOwner {
        IERC20(_token).safeTransfer(owner(), _amount);
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // RECEIVE BUSINESS LOGIC
    // ──────────────────────────────────────────────────────────────────────────────

    /// @notice Invoked by OAppReceiver when EndpointV2.lzReceive is called
    /// @param _origin    Metadata (source chain, sender address, nonce)
    /// @param _guid      Global unique ID for tracking this message
    /// @param _message   ABI-encoded TokenTransferData
    /// @param _executor  Executor address that delivered the message
    /// @param _extraData Additional data from the Executor (unused here)
    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _extraData
    ) internal override {
        // Decode the incoming message
        TokenTransferData memory transferData = abi.decode(
            _message,
            (TokenTransferData)
        );

        // Store the last distribution data
        lastDistribution = transferData;

        // Validate and execute the distribution
        _executeDistribution(transferData, _origin.srcEid);
    }

    /// @notice Execute the token distribution
    /// @param _transferData The decoded transfer data
    /// @param _srcEid Source endpoint ID
    function _executeDistribution(
        TokenTransferData memory _transferData,
        uint32 _srcEid
    ) internal {
        // Validate inputs
        if (_transferData.recipient == address(0)) {
            emit TokenDistributionFailed(
                _transferData.currency,
                _transferData.amount,
                _transferData.recipient,
                _srcEid,
                "Invalid recipient address"
            );
            return;
        }

        if (_transferData.amount == 0) {
            emit TokenDistributionFailed(
                _transferData.currency,
                _transferData.amount,
                _transferData.recipient,
                _srcEid,
                "Invalid amount"
            );
            return;
        }

        // Check if token is supported
        if (!supportedTokens[_transferData.currency]) {
            emit TokenDistributionFailed(
                _transferData.currency,
                _transferData.amount,
                _transferData.recipient,
                _srcEid,
                "Token not supported"
            );
            return;
        }

        // Check contract balance
        IERC20 token = IERC20(_transferData.currency);
        uint256 balance = token.balanceOf(address(this));

        if (balance < _transferData.amount) {
            emit TokenDistributionFailed(
                _transferData.currency,
                _transferData.amount,
                _transferData.recipient,
                _srcEid,
                "Insufficient balance"
            );
            return;
        }

        // Execute the distribution
        // Note: safeTransfer will revert on failure, so we wrap in try/catch using transfer
        try
            token.transfer(_transferData.recipient, _transferData.amount)
        returns (bool success) {
            if (success) {
                emit TokensDistributed(
                    _transferData.currency,
                    _transferData.amount,
                    _transferData.recipient,
                    _srcEid
                );
            } else {
                emit TokenDistributionFailed(
                    _transferData.currency,
                    _transferData.amount,
                    _transferData.recipient,
                    _srcEid,
                    "Transfer returned false"
                );
            }
        } catch Error(string memory reason) {
            emit TokenDistributionFailed(
                _transferData.currency,
                _transferData.amount,
                _transferData.recipient,
                _srcEid,
                reason
            );
        } catch {
            emit TokenDistributionFailed(
                _transferData.currency,
                _transferData.amount,
                _transferData.recipient,
                _srcEid,
                "Transfer failed"
            );
        }
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // VIEW FUNCTIONS
    // ──────────────────────────────────────────────────────────────────────────────

    /// @notice Get the balance of a token in this contract
    /// @param _token Token contract address
    /// @return balance Token balance
    function getTokenBalance(address _token) external view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }

    /// @notice Check if a token is supported
    /// @param _token Token contract address
    /// @return supported Whether the token is supported
    function isTokenSupported(address _token) external view returns (bool) {
        return supportedTokens[_token];
    }
}
