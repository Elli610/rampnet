export const IFdcVerificationAbi = [
  {
    "inputs": [],
    "name": "fdcProtocolId",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "_fdcProtocolId",
        "type": "uint8"
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
        "internalType": "contract IRelay",
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
        "components": [
          {
            "internalType": "bytes32[]",
            "name": "merkleProof",
            "type": "bytes32[]"
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
                "name": "sourceId",
                "type": "bytes32"
              },
              {
                "internalType": "uint64",
                "name": "votingRound",
                "type": "uint64"
              },
              {
                "internalType": "uint64",
                "name": "lowestUsedTimestamp",
                "type": "uint64"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "addressStr",
                    "type": "string"
                  }
                ],
                "internalType": "struct IAddressValidity.RequestBody",
                "name": "requestBody",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "bool",
                    "name": "isValid",
                    "type": "bool"
                  },
                  {
                    "internalType": "string",
                    "name": "standardAddress",
                    "type": "string"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "standardAddressHash",
                    "type": "bytes32"
                  }
                ],
                "internalType": "struct IAddressValidity.ResponseBody",
                "name": "responseBody",
                "type": "tuple"
              }
            ],
            "internalType": "struct IAddressValidity.Response",
            "name": "data",
            "type": "tuple"
          }
        ],
        "internalType": "struct IAddressValidity.Proof",
        "name": "_proof",
        "type": "tuple"
      }
    ],
    "name": "verifyAddressValidity",
    "outputs": [
      {
        "internalType": "bool",
        "name": "_proved",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes32[]",
            "name": "merkleProof",
            "type": "bytes32[]"
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
                "name": "sourceId",
                "type": "bytes32"
              },
              {
                "internalType": "uint64",
                "name": "votingRound",
                "type": "uint64"
              },
              {
                "internalType": "uint64",
                "name": "lowestUsedTimestamp",
                "type": "uint64"
              },
              {
                "components": [
                  {
                    "internalType": "bytes32",
                    "name": "transactionId",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "sourceAddressIndicator",
                    "type": "bytes32"
                  }
                ],
                "internalType": "struct IBalanceDecreasingTransaction.RequestBody",
                "name": "requestBody",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "uint64",
                    "name": "blockNumber",
                    "type": "uint64"
                  },
                  {
                    "internalType": "uint64",
                    "name": "blockTimestamp",
                    "type": "uint64"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "sourceAddressHash",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "int256",
                    "name": "spentAmount",
                    "type": "int256"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "standardPaymentReference",
                    "type": "bytes32"
                  }
                ],
                "internalType": "struct IBalanceDecreasingTransaction.ResponseBody",
                "name": "responseBody",
                "type": "tuple"
              }
            ],
            "internalType": "struct IBalanceDecreasingTransaction.Response",
            "name": "data",
            "type": "tuple"
          }
        ],
        "internalType": "struct IBalanceDecreasingTransaction.Proof",
        "name": "_proof",
        "type": "tuple"
      }
    ],
    "name": "verifyBalanceDecreasingTransaction",
    "outputs": [
      {
        "internalType": "bool",
        "name": "_proved",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes32[]",
            "name": "merkleProof",
            "type": "bytes32[]"
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
                "name": "sourceId",
                "type": "bytes32"
              },
              {
                "internalType": "uint64",
                "name": "votingRound",
                "type": "uint64"
              },
              {
                "internalType": "uint64",
                "name": "lowestUsedTimestamp",
                "type": "uint64"
              },
              {
                "components": [
                  {
                    "internalType": "uint64",
                    "name": "blockNumber",
                    "type": "uint64"
                  },
                  {
                    "internalType": "uint64",
                    "name": "queryWindow",
                    "type": "uint64"
                  }
                ],
                "internalType": "struct IConfirmedBlockHeightExists.RequestBody",
                "name": "requestBody",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "uint64",
                    "name": "blockTimestamp",
                    "type": "uint64"
                  },
                  {
                    "internalType": "uint64",
                    "name": "numberOfConfirmations",
                    "type": "uint64"
                  },
                  {
                    "internalType": "uint64",
                    "name": "lowestQueryWindowBlockNumber",
                    "type": "uint64"
                  },
                  {
                    "internalType": "uint64",
                    "name": "lowestQueryWindowBlockTimestamp",
                    "type": "uint64"
                  }
                ],
                "internalType": "struct IConfirmedBlockHeightExists.ResponseBody",
                "name": "responseBody",
                "type": "tuple"
              }
            ],
            "internalType": "struct IConfirmedBlockHeightExists.Response",
            "name": "data",
            "type": "tuple"
          }
        ],
        "internalType": "struct IConfirmedBlockHeightExists.Proof",
        "name": "_proof",
        "type": "tuple"
      }
    ],
    "name": "verifyConfirmedBlockHeightExists",
    "outputs": [
      {
        "internalType": "bool",
        "name": "_proved",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes32[]",
            "name": "merkleProof",
            "type": "bytes32[]"
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
                "name": "sourceId",
                "type": "bytes32"
              },
              {
                "internalType": "uint64",
                "name": "votingRound",
                "type": "uint64"
              },
              {
                "internalType": "uint64",
                "name": "lowestUsedTimestamp",
                "type": "uint64"
              },
              {
                "components": [
                  {
                    "internalType": "bytes32",
                    "name": "transactionHash",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "uint16",
                    "name": "requiredConfirmations",
                    "type": "uint16"
                  },
                  {
                    "internalType": "bool",
                    "name": "provideInput",
                    "type": "bool"
                  },
                  {
                    "internalType": "bool",
                    "name": "listEvents",
                    "type": "bool"
                  },
                  {
                    "internalType": "uint32[]",
                    "name": "logIndices",
                    "type": "uint32[]"
                  }
                ],
                "internalType": "struct IEVMTransaction.RequestBody",
                "name": "requestBody",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "uint64",
                    "name": "blockNumber",
                    "type": "uint64"
                  },
                  {
                    "internalType": "uint64",
                    "name": "timestamp",
                    "type": "uint64"
                  },
                  {
                    "internalType": "address",
                    "name": "sourceAddress",
                    "type": "address"
                  },
                  {
                    "internalType": "bool",
                    "name": "isDeployment",
                    "type": "bool"
                  },
                  {
                    "internalType": "address",
                    "name": "receivingAddress",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                  },
                  {
                    "internalType": "bytes",
                    "name": "input",
                    "type": "bytes"
                  },
                  {
                    "internalType": "uint8",
                    "name": "status",
                    "type": "uint8"
                  },
                  {
                    "components": [
                      {
                        "internalType": "uint32",
                        "name": "logIndex",
                        "type": "uint32"
                      },
                      {
                        "internalType": "address",
                        "name": "emitterAddress",
                        "type": "address"
                      },
                      {
                        "internalType": "bytes32[]",
                        "name": "topics",
                        "type": "bytes32[]"
                      },
                      {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                      },
                      {
                        "internalType": "bool",
                        "name": "removed",
                        "type": "bool"
                      }
                    ],
                    "internalType": "struct IEVMTransaction.Event[]",
                    "name": "events",
                    "type": "tuple[]"
                  }
                ],
                "internalType": "struct IEVMTransaction.ResponseBody",
                "name": "responseBody",
                "type": "tuple"
              }
            ],
            "internalType": "struct IEVMTransaction.Response",
            "name": "data",
            "type": "tuple"
          }
        ],
        "internalType": "struct IEVMTransaction.Proof",
        "name": "_proof",
        "type": "tuple"
      }
    ],
    "name": "verifyEVMTransaction",
    "outputs": [
      {
        "internalType": "bool",
        "name": "_proved",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes32[]",
            "name": "merkleProof",
            "type": "bytes32[]"
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
                "name": "sourceId",
                "type": "bytes32"
              },
              {
                "internalType": "uint64",
                "name": "votingRound",
                "type": "uint64"
              },
              {
                "internalType": "uint64",
                "name": "lowestUsedTimestamp",
                "type": "uint64"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "url",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "httpMethod",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "headers",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "queryParams",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "body",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "postProcessJq",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "abiSignature",
                    "type": "string"
                  }
                ],
                "internalType": "struct IWeb2Json.RequestBody",
                "name": "requestBody",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "bytes",
                    "name": "abiEncodedData",
                    "type": "bytes"
                  }
                ],
                "internalType": "struct IWeb2Json.ResponseBody",
                "name": "responseBody",
                "type": "tuple"
              }
            ],
            "internalType": "struct IWeb2Json.Response",
            "name": "data",
            "type": "tuple"
          }
        ],
        "internalType": "struct IWeb2Json.Proof",
        "name": "_proof",
        "type": "tuple"
      }
    ],
    "name": "verifyJsonApi",
    "outputs": [
      {
        "internalType": "bool",
        "name": "_proved",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes32[]",
            "name": "merkleProof",
            "type": "bytes32[]"
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
                "name": "sourceId",
                "type": "bytes32"
              },
              {
                "internalType": "uint64",
                "name": "votingRound",
                "type": "uint64"
              },
              {
                "internalType": "uint64",
                "name": "lowestUsedTimestamp",
                "type": "uint64"
              },
              {
                "components": [
                  {
                    "internalType": "bytes32",
                    "name": "transactionId",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "uint256",
                    "name": "inUtxo",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "utxo",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct IPayment.RequestBody",
                "name": "requestBody",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "uint64",
                    "name": "blockNumber",
                    "type": "uint64"
                  },
                  {
                    "internalType": "uint64",
                    "name": "blockTimestamp",
                    "type": "uint64"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "sourceAddressHash",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "sourceAddressesRoot",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "receivingAddressHash",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "intendedReceivingAddressHash",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "int256",
                    "name": "spentAmount",
                    "type": "int256"
                  },
                  {
                    "internalType": "int256",
                    "name": "intendedSpentAmount",
                    "type": "int256"
                  },
                  {
                    "internalType": "int256",
                    "name": "receivedAmount",
                    "type": "int256"
                  },
                  {
                    "internalType": "int256",
                    "name": "intendedReceivedAmount",
                    "type": "int256"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "standardPaymentReference",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bool",
                    "name": "oneToOne",
                    "type": "bool"
                  },
                  {
                    "internalType": "uint8",
                    "name": "status",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct IPayment.ResponseBody",
                "name": "responseBody",
                "type": "tuple"
              }
            ],
            "internalType": "struct IPayment.Response",
            "name": "data",
            "type": "tuple"
          }
        ],
        "internalType": "struct IPayment.Proof",
        "name": "_proof",
        "type": "tuple"
      }
    ],
    "name": "verifyPayment",
    "outputs": [
      {
        "internalType": "bool",
        "name": "_proved",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes32[]",
            "name": "merkleProof",
            "type": "bytes32[]"
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
                "name": "sourceId",
                "type": "bytes32"
              },
              {
                "internalType": "uint64",
                "name": "votingRound",
                "type": "uint64"
              },
              {
                "internalType": "uint64",
                "name": "lowestUsedTimestamp",
                "type": "uint64"
              },
              {
                "components": [
                  {
                    "internalType": "uint64",
                    "name": "minimalBlockNumber",
                    "type": "uint64"
                  },
                  {
                    "internalType": "uint64",
                    "name": "deadlineBlockNumber",
                    "type": "uint64"
                  },
                  {
                    "internalType": "uint64",
                    "name": "deadlineTimestamp",
                    "type": "uint64"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "destinationAddressHash",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "standardPaymentReference",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "bool",
                    "name": "checkSourceAddresses",
                    "type": "bool"
                  },
                  {
                    "internalType": "bytes32",
                    "name": "sourceAddressesRoot",
                    "type": "bytes32"
                  }
                ],
                "internalType": "struct IReferencedPaymentNonexistence.RequestBody",
                "name": "requestBody",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "uint64",
                    "name": "minimalBlockTimestamp",
                    "type": "uint64"
                  },
                  {
                    "internalType": "uint64",
                    "name": "firstOverflowBlockNumber",
                    "type": "uint64"
                  },
                  {
                    "internalType": "uint64",
                    "name": "firstOverflowBlockTimestamp",
                    "type": "uint64"
                  }
                ],
                "internalType": "struct IReferencedPaymentNonexistence.ResponseBody",
                "name": "responseBody",
                "type": "tuple"
              }
            ],
            "internalType": "struct IReferencedPaymentNonexistence.Response",
            "name": "data",
            "type": "tuple"
          }
        ],
        "internalType": "struct IReferencedPaymentNonexistence.Proof",
        "name": "_proof",
        "type": "tuple"
      }
    ],
    "name": "verifyReferencedPaymentNonexistence",
    "outputs": [
      {
        "internalType": "bool",
        "name": "_proved",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
  ;