export default {
	EventFactory: {
		address: "0xf8813b79Fe692bE6a55b9a96e74A43139098CE79",
		"abi": [
			{
				"constant": true,
				"inputs": [
					{
						"name": "",
						"type": "uint256"
					}
				],
				"name": "allContracts",
				"outputs": [
					{
						"name": "add",
						"type": "address"
					},
					{
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"name": "_name",
						"type": "string"
					},
					{
						"name": "_marketResolutionTimestamp",
						"type": "uint256"
					},
					{
						"name": "_apiPath",
						"type": "string"
					},
					{
						"name": "_httpPostOrGet",
						"type": "string"
					},
					{
						"name": "_getData",
						"type": "string"
					},
					{
						"name": "_postData",
						"type": "string"
					},
					{
						"name": "_jsonRegexString",
						"type": "string"
					}
				],
				"name": "createContract",
				"outputs": [],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [],
				"name": "getAddressCount",
				"outputs": [
					{
						"name": "",
						"type": "uint256"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [],
				"name": "getAllEvents",
				"outputs": [
					{
						"components": [
							{
								"name": "add",
								"type": "address"
							},
							{
								"name": "timestamp",
								"type": "uint256"
							}
						],
						"name": "",
						"type": "tuple[]"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			}
		]
	},
	PredictEvent: {
		address: "",
		"abi": [
			{
				"constant": true,
				"inputs": [
					{
						"name": "",
						"type": "uint256"
					}
				],
				"name": "lowest_limit_sell",
				"outputs": [
					{
						"name": "",
						"type": "uint256"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [],
				"name": "eventFinalResult",
				"outputs": [
					{
						"name": "",
						"type": "uint256"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [],
				"name": "initialized",
				"outputs": [
					{
						"name": "",
						"type": "bool"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [],
				"name": "market",
				"outputs": [
					{
						"name": "name",
						"type": "string"
					},
					{
						"name": "marketResolutionTimestamp",
						"type": "uint256"
					},
					{
						"components": [
							{
								"name": "apiPath",
								"type": "string"
							},
							{
								"name": "httpPostOrGet",
								"type": "string"
							},
							{
								"name": "getData",
								"type": "string"
							},
							{
								"name": "postData",
								"type": "string"
							},
							{
								"name": "jsonRegexString",
								"type": "string"
							}
						],
						"name": "request",
						"type": "tuple"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [
					{
						"name": "",
						"type": "uint256"
					},
					{
						"name": "",
						"type": "uint256"
					}
				],
				"name": "Orderbooks",
				"outputs": [
					{
						"name": "unfilledBuyOrdersPointer",
						"type": "uint256"
					},
					{
						"name": "unffilledBuys",
						"type": "uint256"
					},
					{
						"name": "unfilledSellOrdersPointer",
						"type": "uint256"
					},
					{
						"name": "unffilledSells",
						"type": "uint256"
					},
					{
						"name": "sellLen",
						"type": "uint256"
					},
					{
						"name": "buyLen",
						"type": "uint256"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [],
				"name": "finalized",
				"outputs": [
					{
						"name": "",
						"type": "bool"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [],
				"name": "last_finalizer",
				"outputs": [
					{
						"name": "",
						"type": "address"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [
					{
						"name": "",
						"type": "uint256"
					}
				],
				"name": "highest_limit_buy",
				"outputs": [
					{
						"name": "",
						"type": "uint256"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"name": "agg",
						"type": "string"
					},
					{
						"indexed": false,
						"name": "a",
						"type": "uint256"
					}
				],
				"name": "logs",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"components": [
							{
								"name": "amount",
								"type": "uint256"
							},
							{
								"name": "owner",
								"type": "address"
							},
							{
								"name": "filled",
								"type": "uint256"
							},
							{
								"name": "isBuy",
								"type": "bool"
							}
						],
						"indexed": false,
						"name": "agg",
						"type": "tuple"
					}
				],
				"name": "lord",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"name": "finalizer",
						"type": "address"
					}
				],
				"name": "InvalidChainlinkRequest",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"name": "id",
						"type": "bytes32"
					}
				],
				"name": "ChainlinkRequested",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"name": "id",
						"type": "bytes32"
					}
				],
				"name": "ChainlinkFulfilled",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"name": "id",
						"type": "bytes32"
					}
				],
				"name": "ChainlinkCancelled",
				"type": "event"
			},
			{
				"constant": true,
				"inputs": [
					{
						"name": "a",
						"type": "uint256"
					},
					{
						"name": "b",
						"type": "uint256"
					},
					{
						"name": "c",
						"type": "uint256"
					},
					{
						"name": "isBuy",
						"type": "bool"
					}
				],
				"name": "showOrder",
				"outputs": [
					{
						"components": [
							{
								"name": "amount",
								"type": "uint256"
							},
							{
								"name": "owner",
								"type": "address"
							},
							{
								"name": "filled",
								"type": "uint256"
							},
							{
								"name": "isBuy",
								"type": "bool"
							}
						],
						"name": "res",
						"type": "tuple"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [],
				"name": "showBooks",
				"outputs": [
					{
						"name": "res",
						"type": "uint256[100][2][10]"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [
					{
						"name": "a",
						"type": "uint256"
					}
				],
				"name": "showBook",
				"outputs": [
					{
						"name": "res",
						"type": "uint256[100][2][10]"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [
					{
						"name": "_marketID",
						"type": "uint256"
					}
				],
				"name": "computeLimits",
				"outputs": [
					{
						"name": "buy",
						"type": "uint256"
					},
					{
						"name": "sell",
						"type": "uint256"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"name": "_price",
						"type": "uint256"
					},
					{
						"name": "_amount",
						"type": "uint256"
					},
					{
						"name": "_isBuy",
						"type": "bool"
					},
					{
						"name": "_marketID",
						"type": "uint256"
					}
				],
				"name": "placeOrder",
				"outputs": [],
				"payable": true,
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"components": [
							{
								"name": "name",
								"type": "string"
							},
							{
								"name": "marketResolutionTimestamp",
								"type": "uint256"
							},
							{
								"components": [
									{
										"name": "apiPath",
										"type": "string"
									},
									{
										"name": "httpPostOrGet",
										"type": "string"
									},
									{
										"name": "getData",
										"type": "string"
									},
									{
										"name": "postData",
										"type": "string"
									},
									{
										"name": "jsonRegexString",
										"type": "string"
									}
								],
								"name": "request",
								"type": "tuple"
							},
							{
								"components": [
									{
										"name": "name",
										"type": "string"
									},
									{
										"name": "maxValue",
										"type": "uint256"
									},
									{
										"name": "minValue",
										"type": "uint256"
									}
								],
								"name": "possibleOutcomes",
								"type": "tuple[]"
							}
						],
						"name": "_market",
						"type": "tuple"
					}
				],
				"name": "initialize",
				"outputs": [],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"name": "auth_token",
						"type": "string"
					}
				],
				"name": "finalize",
				"outputs": [],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"name": "_requestId",
						"type": "bytes32"
					},
					{
						"name": "_result",
						"type": "bytes32"
					}
				],
				"name": "fulfill",
				"outputs": [],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "function"
			}
		]
	}
}