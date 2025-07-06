export const MasterIssuerAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "tokenSender_",
        "type": "address",
        "internalType": "contract TokenSender"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "currencies",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "bytes6",
        "internalType": "bytes6"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decodePackedData",
    "inputs": [
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "ethereumAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "currencyTicker",
        "type": "bytes6",
        "internalType": "bytes6"
      },
      {
        "name": "usdAmountCents",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "submitProof",
    "inputs": [
      {
        "name": "proof",
        "type": "tuple",
        "internalType": "struct IWeb2Json.Proof",
        "components": [
          {
            "name": "merkleProof",
            "type": "bytes32[]",
            "internalType": "bytes32[]"
          },
          {
            "name": "data",
            "type": "tuple",
            "internalType": "struct IWeb2Json.Response",
            "components": [
              {
                "name": "attestationType",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "sourceId",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "votingRound",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "lowestUsedTimestamp",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "requestBody",
                "type": "tuple",
                "internalType": "struct IWeb2Json.RequestBody",
                "components": [
                  {
                    "name": "url",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "httpMethod",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "headers",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "queryParams",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "body",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "postProcessJq",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "abiSignature",
                    "type": "string",
                    "internalType": "string"
                  }
                ]
              },
              {
                "name": "responseBody",
                "type": "tuple",
                "internalType": "struct IWeb2Json.ResponseBody",
                "components": [
                  {
                    "name": "abiEncodedData",
                    "type": "bytes",
                    "internalType": "bytes"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "recipientId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "recipientAccount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "paymentStatus",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "receiverEthereumAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "currencyTicker",
        "type": "bytes6",
        "internalType": "bytes6"
      },
      {
        "name": "usdAmountCents",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "tokenSender",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract TokenSender"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "DecodedReference",
    "inputs": [
      {
        "name": "ethereumAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "currencyTicker",
        "type": "bytes6",
        "indexed": false,
        "internalType": "bytes6"
      },
      {
        "name": "usdAmountCents",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TokenRegistered",
    "inputs": [
      {
        "name": "chainId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "currencyTicker",
        "type": "bytes6",
        "indexed": true,
        "internalType": "bytes6"
      },
      {
        "name": "tokenAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "InvalidDataLength",
    "inputs": [
      {
        "name": "length",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidProof",
    "inputs": []
  }
];