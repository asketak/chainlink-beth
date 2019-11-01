import Web3 from "web3";

import deployedContracts from "./deployedContracts.js";

export default class Web3Adapter extends EventTarget {
    constructor(web3Provider, changeContext) {
        super()

        this.web3 = new Web3(web3Provider)
        this.changeContext = changeContext
        this.userAcc = null

        this.gasPrice = this.web3.utils.toWei("0.1", "gwei")

        this.nextActionNumber = 1

        console.log("Created web3 adapter with version: " + JSON.stringify(this.web3.version))

        this.contracts = this.wrapContracts()

        this.connect()
    }

    wrapContracts() {
        const wrapedContracts = {}
        for (let contractName in deployedContracts) {
            wrapedContracts[contractName] = this._wrapContract(contractName, deployedContracts)
        }
        return wrapedContracts
    }

    _wrapContract(contractName, deployedContracts) {
        const w3a = this
        const initConfigContract = new this.web3.eth.Contract(deployedContracts[contractName].abi, deployedContracts[contractName].address)

        function fillWrapper(wrappededContract) {
            Object.keys(initConfigContract.methods).forEach(methodName => {
                wrappededContract[methodName] = {
                    call: async function (...args) {
                        return await w3a.contractCall(wrappededContract._contract.methods[methodName](...args))
                    },
                    send: async function (weiAmount, ...args) {
                        return await w3a.contractSend(wrappededContract._contract.methods[methodName](...args), weiAmount)
                    }
                }
            })
        }

        const wrappedContract = {
            _contract: initConfigContract,
            _at: (contractAddress) => {
                const newWrap = {
                    _contract: new this.web3.eth.Contract(deployedContracts[contractName].abi, contractAddress)
                }
                fillWrapper(newWrap)
                return newWrap
            }
        }
        fillWrapper(wrappedContract)

		return wrappedContract
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
            switchAccount(this.web3.currentProvider.selectedAddress) // should be like accounts[0]
        })

        var subscription = this.web3.eth.subscribe('newBlockHeaders', (error, result) => {
            if (!error) {
                this.dispatchEvent(new Event('newBlock'));
            } else {
                console.error("Error when subcribing to new blocks", error);
            }
        })

        /*// unsubscribes the subscription
        subscription.unsubscribe(function(error, success){
            if (success) {
                console.log('Successfully unsubscribed!');
            }
        });*/
    }

    async contractSend(contractMethod, weiAmount) {
        const actionNumber = this.nextActionNumber++
        try {
            console.log("Contract send #(" + this.nextActionNumber + "): " + contractMethod._method.name + "(" + JSON.stringify(contractMethod.arguments) + ")")
            const sendParams = {
                from: this.userAcc,
                gasPrice: this.gasPrice
            }
            if (weiAmount !== null) sendParams.value = weiAmount

            const receipt = await contractMethod.send(sendParams);
            console.log("Contract send RECEIPT #(" + actionNumber + "): " + contractMethod._method.name)
            console.log(receipt)
            return receipt
        } catch (e) {
            console.error("Contract send ERROR #(" + actionNumber + "): " + contractMethod._method.name)
            console.error(e)
            throw e
        }
    }

    async contractCall(contractMethod) {
        const actionNumber = this.nextActionNumber++
        try {
            console.log("Contract call #(" + actionNumber + "): " + contractMethod._method.name + "(" + JSON.stringify(contractMethod.arguments) + ")")
            const result = await contractMethod.call()
            console.log("Contract call RESULT #(" + actionNumber + "): " + contractMethod._method.name)
            console.log(result)
            return result
        } catch (e) {
            console.error("Contract call ERROR #(" + actionNumber + "): " + contractMethod._method.name)
            console.error(e)
            throw e
        }
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
}