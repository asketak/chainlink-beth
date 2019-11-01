import React from "react"
import {Link} from "react-router-dom"

import AppContext from "./AppContext.js";

import {Button} from '@material-ui/core';

export default class Navbar extends React.Component {

    render() {
        return (
            <AppContext.Consumer>{appContext =>
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <div className="container">
                        <Link className="navbar-brand" to="/">BETH</Link>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item" style={{position: "absolute", left: "47%"}}>
                                <Link className="nav-link" style={{padding: "0"}} to="/events">
                                    <button className="btn btn-primary" style={{fontSize: "20px", textDecoration: "underline"}} type="button">Events</button>
                                </Link>
                            </li>
                            <AccountNavbarArea userAddress={appContext.userAddress}/>
                        </ul>
                    </div>
                </nav>}
            </AppContext.Consumer>
        )
    }
}

class AccountNavbarArea extends React.Component {
    render() {

        const {userAddress} = this.props

        return (
            userAddress ? this.renderLogin(userAddress) : this.renderLoggedOut()
        );
    }

    renderLogin(userAddress) {
        const classes =
            {
                button: {
                    margin: "1rem"
                }
            }
        const addressAbbreviation = userAddress.substring(0, 6) + "..." + userAddress.substring(userAddress.length - 4)
        return (
            <li className="nav-item">
                <div className="font-weight-bold text-white" style={{fontSize: "20px", marginTop: "10px"}}>Your Account: {addressAbbreviation}</div>
            </li>
        )
    }

    renderLoggedOut() {
        return (
            <li className="nav-item">
                <div className="font-weight-bold text-white" style={{fontSize: "20px", marginTop: "10px"}}>&nbsp;</div>
            </li>
        )
    }
}