export const FlareSystemsManagerAbi = [
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
        "internalType": "uint64",
        "name": "timestamp",
        "type": "uint64"
      }
    ],
    "name": "RandomAcquisitionStarted",
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
        "internalType": "uint64",
        "name": "timestamp",
        "type": "uint64"
      }
    ],
    "name": "RewardEpochStarted",
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
        "indexed": true,
        "internalType": "address",
        "name": "signingPolicyAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "rewardsHash",
        "type": "bytes32"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "rewardManagerId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "noOfWeightBasedClaims",
            "type": "uint256"
          }
        ],
        "indexed": false,
        "internalType": "struct IFlareSystemsManager.NumberOfWeightBasedClaims[]",
        "name": "noOfWeightBasedClaims",
        "type": "tuple[]"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "timestamp",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "thresholdReached",
        "type": "bool"
      }
    ],
    "name": "RewardsSigned",
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
        "internalType": "uint64",
        "name": "timestamp",
        "type": "uint64"
      }
    ],
    "name": "SignUptimeVoteEnabled",
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
        "indexed": true,
        "internalType": "address",
        "name": "signingPolicyAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "timestamp",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "thresholdReached",
        "type": "bool"
      }
    ],
    "name": "SigningPolicySigned",
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
        "indexed": true,
        "internalType": "address",
        "name": "signingPolicyAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "uptimeVoteHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "timestamp",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "thresholdReached",
        "type": "bool"
      }
    ],
    "name": "UptimeVoteSigned",
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
        "indexed": true,
        "internalType": "address",
        "name": "signingPolicyAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes20[]",
        "name": "nodeIds",
        "type": "bytes20[]"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "timestamp",
        "type": "uint64"
      }
    ],
    "name": "UptimeVoteSubmitted",
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
        "internalType": "uint64",
        "name": "votePowerBlock",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "timestamp",
        "type": "uint64"
      }
    ],
    "name": "VotePowerBlockSelected",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "firstRewardEpochStartTs",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "firstVotingRoundStartTs",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentRewardEpoch",
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
    "name": "getCurrentRewardEpochId",
    "outputs": [
      {
        "internalType": "uint24",
        "name": "",
        "type": "uint24"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentVotingEpochId",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
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
        "name": "_rewardEpochId",
        "type": "uint256"
      }
    ],
    "name": "getSeed",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_rewardEpochId",
        "type": "uint256"
      }
    ],
    "name": "getStartVotingRoundId",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
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
        "name": "_rewardEpochId",
        "type": "uint256"
      }
    ],
    "name": "getThreshold",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
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
    "name": "getVotePowerBlock",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "_votePowerBlock",
        "type": "uint64"
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
    "name": "getVoterRegistrationData",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_votePowerBlock",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_enabled",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isVoterRegistrationEnabled",
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
    "name": "rewardEpochDurationSeconds",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint24",
        "name": "_rewardEpochId",
        "type": "uint24"
      },
      {
        "internalType": "bytes32",
        "name": "_newSigningPolicyHash",
        "type": "bytes32"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IFlareSystemsManager.Signature",
        "name": "_signature",
        "type": "tuple"
      }
    ],
    "name": "signNewSigningPolicy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint24",
        "name": "_rewardEpochId",
        "type": "uint24"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "rewardManagerId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "noOfWeightBasedClaims",
            "type": "uint256"
          }
        ],
        "internalType": "struct IFlareSystemsManager.NumberOfWeightBasedClaims[]",
        "name": "_noOfWeightBasedClaims",
        "type": "tuple[]"
      },
      {
        "internalType": "bytes32",
        "name": "_rewardsHash",
        "type": "bytes32"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IFlareSystemsManager.Signature",
        "name": "_signature",
        "type": "tuple"
      }
    ],
    "name": "signRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint24",
        "name": "_rewardEpochId",
        "type": "uint24"
      },
      {
        "internalType": "bytes32",
        "name": "_uptimeVoteHash",
        "type": "bytes32"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IFlareSystemsManager.Signature",
        "name": "_signature",
        "type": "tuple"
      }
    ],
    "name": "signUptimeVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint24",
        "name": "_rewardEpochId",
        "type": "uint24"
      },
      {
        "internalType": "bytes20[]",
        "name": "_nodeIds",
        "type": "bytes20[]"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IFlareSystemsManager.Signature",
        "name": "_signature",
        "type": "tuple"
      }
    ],
    "name": "submitUptimeVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingEpochDurationSeconds",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];