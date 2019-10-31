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
                            <li className="nav-item">
                                <Link className="nav-link" to="/events">Markets</Link>
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
                <Link id="login" className="nav-link btn btn-warning font-weight-bolder" style={{display: "inline-block"}} to="/account">
                    Account: {addressAbbreviation}
                </Link>
            </li>
        )
    }

    renderLoggedOut() {
        return (
            <li className="nav-item">
                <Link className="nav-link" to="/account">Login</Link>
            </li>
        )
    }
}