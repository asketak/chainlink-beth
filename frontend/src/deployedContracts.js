export default {
	eventFactory: {
		address: "0x165d892DF842F7906046206f5105fbdF7c467E02",
		abi: [
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
			}
		]
	},
	moveExample: {
		address: "0xD95C884237b1A8B7D289dBbd9dC6b3c58fafbD1B",
		abi: [
			{
				"constant": false,
				"inputs": [
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"name": "moveAnyonesCoins",
				"outputs": [
					{
						"internalType": "bool",
						"name": "sufficient",
						"type": "bool"
					}
				],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"name": "sendCoin",
				"outputs": [
					{
						"internalType": "bool",
						"name": "sufficient",
						"type": "bool"
					}
				],
				"payable": false,
				"stateMutability": "nonpayable",
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
						"internalType": "address",
						"name": "_from",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "_to",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "_value",
						"type": "uint256"
					}
				],
				"name": "Transfer",
				"type": "event"
			},
			{
				"constant": true,
				"inputs": [
					{
						"internalType": "address",
						"name": "addr",
						"type": "address"
					}
				],
				"name": "getBalance",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			}
		]
	}
}