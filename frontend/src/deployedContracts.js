export default {
	EventFactory: {
		address: "0xcb6D145D45A05878D21B937D8f70F0cEA234aC96",
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
						"name": "descriptions",
						"type": "string[]"
					},
					{
						"name": "_eventResolutionTimestamp",
						"type": "uint256"
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
							},
							{
								"name": "strValue",
								"type": "string"
							}
						],
						"name": "_possibleOutcomes",
						"type": "tuple[]"
					},
					{
						"name": "_outcomeIsString",
						"type": "bool"
					},
					{
						"name": "_exactStringMatch",
						"type": "bool"
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
				"inputs": [
					{
						"name": "",
						"type": "address"
					}
				],
				"name": "toPay",
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
				"inputs": [
					{
						"name": "",
						"type": "uint256"
					}
				],
				"name": "addressesToPay",
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
				"inputs": [],
				"name": "Event",
				"outputs": [
					{
						"name": "name",
						"type": "string"
					},
					{
						"name": "description",
						"type": "string"
					},
					{
						"name": "eventResolutionTimestamp",
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
						"name": "outcomeIsString",
						"type": "bool"
					},
					{
						"name": "exactStringMatch",
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
				"name": "result",
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
				"inputs": [
					{
						"name": "",
						"type": "uint256"
					}
				],
				"name": "depositedA",
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
				"inputs": [
					{
						"name": "",
						"type": "address"
					}
				],
				"name": "deposited",
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
				"name": "oracleAdd",
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
						"indexed": false,
						"name": "amount",
						"type": "uint256"
					},
					{
						"indexed": false,
						"name": "price",
						"type": "uint256"
					},
					{
						"indexed": false,
						"name": "owner",
						"type": "address"
					},
					{
						"indexed": false,
						"name": "filled",
						"type": "uint256"
					},
					{
						"indexed": false,
						"name": "isBuy",
						"type": "bool"
					},
					{
						"indexed": false,
						"name": "marketID",
						"type": "uint256"
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
								"name": "price",
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
							},
							{
								"name": "marketID",
								"type": "uint256"
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
				"name": "getOutcomes",
				"outputs": [
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
							},
							{
								"name": "strValue",
								"type": "string"
							}
						],
						"name": "res",
						"type": "tuple[]"
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
						"name": "_EventID",
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
						"name": "_EventID",
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
								"name": "description",
								"type": "string"
							},
							{
								"name": "eventResolutionTimestamp",
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
									},
									{
										"name": "strValue",
										"type": "string"
									}
								],
								"name": "possibleOutcomes",
								"type": "tuple[]"
							},
							{
								"name": "outcomeIsString",
								"type": "bool"
							},
							{
								"name": "exactStringMatch",
								"type": "bool"
							}
						],
						"name": "_Event",
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
						"name": "auth_token",
						"type": "string"
					}
				],
				"name": "getChainlinkResult",
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
						"type": "uint256"
					}
				],
				"name": "fulfill",
				"outputs": [],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [
					{
						"name": "_bytes32",
						"type": "bytes32"
					}
				],
				"name": "bytes32ToStr",
				"outputs": [
					{
						"name": "",
						"type": "string"
					}
				],
				"payable": false,
				"stateMutability": "pure",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"name": "x",
						"type": "address"
					}
				],
				"name": "toString",
				"outputs": [
					{
						"name": "",
						"type": "string"
					}
				],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "function"
			}
		]
	}
}