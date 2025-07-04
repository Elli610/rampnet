export const FdcHubAbi= [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fee",
        "type": "uint256"
      }
    ],
    "name": "AttestationRequest",
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
        "components": [
          {
            "internalType": "bytes32",
            "name": "attestationType",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "source",
            "type": "bytes32"
          },
          {
            "internalType": "uint24",
            "name": "inflationShare",
            "type": "uint24"
          },
          {
            "internalType": "uint8",
            "name": "minRequestsThreshold",
            "type": "uint8"
          },
          {
            "internalType": "uint224",
            "name": "mode",
            "type": "uint224"
          }
        ],
        "indexed": false,
        "internalType": "struct IFdcInflationConfigurations.FdcConfiguration[]",
        "name": "fdcConfigurations",
        "type": "tuple[]"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "InflationRewardsOffered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "requestsOffsetSeconds",
        "type": "uint8"
      }
    ],
    "name": "RequestsOffsetSet",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "fdcInflationConfigurations",
    "outputs": [
      {
        "internalType": "contract IFdcInflationConfigurations",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fdcRequestFeeConfigurations",
    "outputs": [
      {
        "internalType": "contract IFdcRequestFeeConfigurations",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "requestAttestation",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "requestsOffsetSeconds",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];