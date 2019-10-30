export default {
	EventFactory: {
		address: "0xaF6aC95e47683e926AF16b1b72E246BAcb2A4ae2",
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
				"name": "myAddress",
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
						"name": "_owner",
						"type": "address"
					},
					{
						"name": "result",
						"type": "uint256"
					}
				],
				"name": "placeBuyOrder",
				"outputs": [],
				"payable": false,
				"stateMutability": "nonpayable",
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
						"name": "_owner",
						"type": "address"
					},
					{
						"name": "result",
						"type": "uint256"
					}
				],
				"name": "placeSellOrder",
				"outputs": [],
				"payable": false,
				"stateMutability": "nonpayable",
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
								"name": "possibleOutcomes",
								"type": "uint256[]"
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
						"name": "result",
						"type": "uint256"
					}
				],
				"name": "placeOrder",
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
				"constant": false,
				"inputs": [
					{
						"name": "_oracle",
						"type": "address"
					},
					{
						"name": "_jobId",
						"type": "bytes32"
					},
					{
						"name": "_payment",
						"type": "uint256"
					},
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
			}
		]
	}
}