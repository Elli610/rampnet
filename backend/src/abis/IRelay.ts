export const IRelayAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint8",
        "name": "protocolId",
        "type": "uint8"
      },
      {
        "indexed": true,
        "internalType": "uint32",
        "name": "votingRoundId",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isSecureRandom",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "merkleRoot",
        "type": "bytes32"
      }
    ],
    "name": "ProtocolMessageRelayed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint24",
        "name": "rewardEpochId",
        "type": "uint24"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "startVotingRoundId",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "threshold",
        "type": "uint16"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "seed",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "voters",
        "type": "address[]"
      },
      {
        "indexed": false,
        "internalType": "uint16[]",
        "name": "weights",
        "type": "uint16[]"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "signingPolicyBytes",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "timestamp",
        "type": "uint64"
      }
    ],
    "name": "SigningPolicyInitialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "rewardEpochId",
        "type": "uint256"
      }
    ],
    "name": "SigningPolicyRelayed",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "feeCollectionAddress",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRandomNumber",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_randomNumber",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_isSecureRandom",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "_randomTimestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_votingRoundId",
        "type": "uint256"
      }
    ],
    "name": "getRandomNumberHistorical",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_randomNumber",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_isSecureRandom",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "_randomTimestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_timestamp",
        "type": "uint256"
      }
    ],
    "name": "getVotingRoundId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_votingRoundId",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_relayMessage",
        "type": "bytes"
      },
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "descriptionHash",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "chainId",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint8",
                "name": "protocolId",
                "type": "uint8"
              },
              {
                "internalType": "uint256",
                "name": "feeInWei",
                "type": "uint256"
              }
            ],
            "internalType": "struct IRelay.FeeConfig[]",
            "name": "newFeeConfigs",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct IRelay.RelayGovernanceConfig",
        "name": "_config",
        "type": "tuple"
      }
    ],
    "name": "governanceFeeSetup",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_protocolId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_votingRoundId",
        "type": "uint256"
      }
    ],
    "name": "isFinalized",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastInitializedRewardEpochData",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "_lastInitializedRewardEpoch",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "_startingVotingRoundIdForLastInitializedRewardEpoch",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_protocolId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_votingRoundId",
        "type": "uint256"
      }
    ],
    "name": "merkleRoots",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "_merkleRoot",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_protocolId",
        "type": "uint256"
      }
    ],
    "name": "protocolFeeInWei",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "relay",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_rewardEpochId",
        "type": "uint256"
      }
    ],
    "name": "startingVotingRoundIds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_startingVotingRoundId",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_rewardEpochId",
        "type": "uint256"
      }
    ],
    "name": "toSigningPolicyHash",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "_signingPolicyHash",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_protocolId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_votingRoundId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "_leaf",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "_proof",
        "type": "bytes32[]"
      }
    ],
    "name": "verify",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_relayMessage",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "_messageHash",
        "type": "bytes32"
      }
    ],
    "name": "verifyCustomSignature",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_rewardEpochId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];