import React from "react"
import {Link} from "react-router-dom"

import AppContext from "./AppContext.js";

export default class Navbar extends React.Component {

    render() {
        return (
            <AppContext.Consumer>{appContext =>
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <div className="container">
                        <Link className="navbar-brand" to="/">BETH</Link>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/markets">Markets</Link>
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
            userAddress ?
                (
                    <li className="nav-item">
                        Address: {userAddress}
                        <Link id="login" className="nav-link btn btn-warning" style={{display: "inline-block"}} to="/account">Login</Link>
                    </li>
                )
                :
                (
                    <li className="nav-item">
                        <Link className="nav-link" to="/account">Login</Link>
                    </li>
                )


        );
    }
}