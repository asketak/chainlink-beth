import {hot} from 'react-hot-loader/root';

import React from "react"
import {BrowserRouter as Router, Route} from "react-router-dom"

import Web3 from "web3"

import Web3Adapter from "./Web3Adapter.js";

import AppContext from "./AppContext.js";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import HomePage from "./HomePage.jsx";
import AllEventsPage from "./AllEventsPage.jsx";
import AccountPage from "./AccountPage.jsx";
import CreateMarketPage from "./CreateMarketPage.jsx"


export default hot(class App extends React.Component {

	state = {
		appContext: {}
	}

	changeContext(change) {
		this.setState(state => ({
			appContext: {...state.appContext, ...change}
		}))
	}

	componentDidMount() {
		if (window.ethereum) {
			this.setState(state => ({
				appContext: {
					w3a: new Web3Adapter(window.ethereum, this.changeContext.bind(this))
				}
			}))
		} else {
			window.alert("Non-Ethereum browser detected. Please install latest MetaMask browser extension!")
		}
	}

	render() {

		return (
			<AppContext.Provider value={this.state.appContext}>
				{window.ethereum
					?
					<Router>

						<Navbar/>

						<Route exact path='/'
							   render={props => <HomePage {...this.state} />}
						/>

						<Route path='/markets'
							   render={props => <AllEventsPage {...this.state} />}
						/>

						<Route path="/create-event"
							   render={props => <CreateMarketPage {...this.state} />}
						/>

						<Route path='/account'
							   render={props => <AccountPage {...this.state} />}
						/>

						<Footer/>

					</Router>
					:
					<Router>
						<Navbar/>
						<div style={{fontAlign: "center", fontSize: "20px"}}>Metamask not deteced</div>
						<Footer/>
					</Router>}
			</AppContext.Provider>
		)
	}
})