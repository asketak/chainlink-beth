import React from "react"

import AppContext from "./AppContext.js";

import deployedContracts from "./deployedContracts.js";

export default class IntroHeading extends React.Component {

	state = {
		output: []
	}

	componentDidMount() {

	}

	// Ropsten MoveCoin contract :   0xD95C884237b1A8B7D289dBbd9dC6b3c58fafbD1B


	render() {
		return (
			<header className="bg-primary py-5 mb-5">
				<div className="container h-100">

				</div>
			</header>
		)
	}
}
IntroHeading.contextType = AppContext;