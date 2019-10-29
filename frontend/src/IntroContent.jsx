import React from "react"

import AppContext from "./AppContext.js";

import deployedContracts from "./deployedContracts.js";

export default class IntroContent extends React.Component {

	constructor(props, context) {
		super(props, context)
	}

	state = {
		inited: false,
		addressCount: null,
		markets: []
	}

	componentDidMount() {
		this.refreshEventsView()
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.refreshEventsView()
	}

	refreshEventsView(force) {
		if (force || (!this.state.inited && this.state.addressCount === null && this.context.w3a)) {
			this.setState({inited: true})
			this.EventFactory = this.context.w3a.getContract(deployedContracts.eventFactory)
			this.EventFactory.methods.getAddressCount().call()
				.then(addressCount => {
					this.setState(state => ({markets: []}))
					for (let i = 0; i < addressCount; i++) {
						this.EventFactory.methods.allContracts(i).call()
							.then(contract => {
								this.setState(state => ({
									markets: state.markets.concat(contract)
								}))
							})
					}
					this.setState(state => ({addressCount: addressCount}))
				})
		}
	}

	render() {

		const inputs = [
			"name",
			"timestamp",
			"apiPath",
			"postOrGet",
			"getData",
			"postData",
			"jsonRegex"
		]

		return (
			<section className="container">

				<h2>Markets Count <b>{this.state.addressCount}</b></h2>
				<h2>Markets:</h2>

				<div className="row">
					{this.state.markets.map(market => (
							<div className="col-lg-4 mb-4">
								<div className="card h-100">
									<h4 className="card-header">add: {market.add}</h4>
									<div className="card-body">
										<p className="card-text">timestamp: {market.timestamp}</p>
									</div>
									<div className="card-footer">
										<a href="/markets/address" className="btn btn-primary">Not Impl</a>
									</div>
								</div>
							</div>
						)
					)}
				</div>


				<div className="row">
					<form id="test1">
						<div className="container">
							<div className="row">

								{inputs.map(input =>
									<div className="col-lg-3">
										<div className="form-group">
											<label className="btn-l">{input}</label>
											<input id={input} className="form-control"
												   defaultValue={input === "timestamp" ? 3000 : input}
												   disabled={this.state.running}/>
										</div>
									</div>
								)}

								<div className="col-lg-3" style={{textAlign: "center"}}>
									<button className={"btn btn-primary btn-a" + (this.state.running ? "btn-anima": "")}
											style={{
												position: "absolute",
												top: "50%",
												left: "50%",
												transform: "translate(-50%, -50%)"
											}}
											disabled={this.state.running}
											onClick={e => {
												e.preventDefault()
												this.setState(state => ({running: true}))
												const request = {}
												document.querySelectorAll("#test1 input").forEach(input => {
													request[input.id] = (input.id === "timestamp" ? parseInt(input.value) : input.value)
												})

												this.context.w3a.sendTransactionAndWaitForResult(this.EventFactory.methods.createContract(request.name, request.timestamp,
													request.apiPath, request.postOrGet, request.getData, request.postData, request.jsonRegex))
													.then(rest => {
														console.log("transactino commited")
														console.log(rest)
														this.refreshEventsView(true)
													})
													.catch(e => {
														debugger
													})
													.finally(() => {
														this.setState(state => ({running: false}))
													})
											}}>
										{this.state.running ?
											<div className="spinner-border text-warning" role="status">
												<span className="sr-only">Loading...</span>
											</div>
											:
											<h4>
												<b>Send Tx</b>
											</h4>}
									</button>
								</div>

							</div>
						</div>
					</form>
				</div>

			</section>
		)
	}
}
IntroContent.contextType = AppContext