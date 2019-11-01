import React from "react"

import AppContext from "./AppContext.js";

import deployedContracts from "./deployedContracts.js";
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom";

export default class IntroContent extends React.Component {

    constructor(props, context) {
        super(props, context)
    }

    state = {
        inited: false,
        addressCount: null,
        allEvents: []
    }

    componentDidMount() {
        this.fetchAllEvents()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.fetchAllEvents()
    }

    fetchAllEvents(force) {
        if (force || (!this.state.inited && this.state.addressCount === null && this.context.w3a)) {
            this.setState({inited: true})
            this.EventFactory = this.context.w3a.contracts.EventFactory.getAllEvents.call()
                .then(allEvents => {
                    this.setState(state => ({
                        allEvents: allEvents
                    }))
                })
        }
    }

    render() {
        return (
            <section className="container" style={{textAlign: "center"}}>
                <div style={{fontSize: "150px", fontWeight: "bold", color: "#2780E3", margin:"30px auto 50px"}}><img src="/logo.png" style={{widtg: "200px", height: "200px"}}/> BETH</div>

                <Link to="/events">
                    <Button style={{
                        display: "block",
                        fontSize: "30px",
                        fontWeight: "bold",
                        padding: "30px",
                        boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                        margin: "0 auto 30px"
                    }}>
                        Go To Events
                    </Button>
                </Link>

            </section>
        )
    }
}
IntroContent.contextType = AppContext