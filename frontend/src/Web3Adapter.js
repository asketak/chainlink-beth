import Web3 from "web3";

export default class Web3Adapter {
	constructor(web3Provider, changeContext) {
		this.web3 = new Web3(web3Provider)
		this.changeContext = changeContext
		this.userAcc = null

		console.log("Created we3 adapter with version: " + JSON.stringify(this.web3.version))

		this.connect()
	}

	get eth() {
		return this.web3.eth
	}

	get utils() {
		return this.web3.utils
	}

	connect() {
		const switchAccount = (address) => {
			this.userAcc = address
			this.web3.eth.defaultAccount = this.userAcc
			this.changeContext({userAddress: this.userAcc})
		}

		this.web3.currentProvider.enable()
			.then(accounts => {
				switchAccount(accounts[0]) // should be like web3.currentProvider.selectedAddress
			})
			.catch(err => {
				window.alert("Error: Could not connect to Ethereum\n" +
					"Reason: " + err.message + "\n" +
					"Complete Error: " + JSON.stringify(err))
			})

		this.web3.currentProvider.on('accountsChanged', (accounts) => {
			switchAccount(web3.currentProvider.selectedAddress) // should be like accounts[0]
		})
	}

	async sendTransactionAndWaitForResult(contractMethod) {
		try {
			const receipt = await contractMethod.send({from: this.userAcc, gasPrice: this.web3.utils.toWei("50", "gwei")});
			return receipt
		} catch (e) {
			console.log("Error in waiting for Receipt: " + e);
			throw e
		}
	}

	async call(contractMethod) {
		return await contractMethod.call()
	}

	async checkEvent() {
		// to process all future events
		ContractInstance.MyEvent().watch((error, result) => {
			// do awesome stuff
		})

		// to process all past events
		ContractInstance.MyEvent({}, {
			fromBlock: 0,
			toBlock: 'latest'
		}).get((error, result) => {
			// do awesome stuff
		})
	}

	getContract(deploymentConfig) {
		return new this.web3.eth.Contract(deploymentConfig.abi, deploymentConfig.address)
	}
}