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
            <section className="container">

                <h2>Popular Markets:</h2>
                <div className="row">
                    {this.state.allEvents.map(event => (
                            <div key={event.add} className="col-lg-4 mb-4">
                                <div className="card h-100">
                                    <h4 className="card-header">add: {event.add}</h4>
                                    <div className="card-body">
                                        <p className="card-text">timestamp: {event.timestamp}</p>
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

                            </div>
                        </div>
                    </form>
                </div>

            </section>
        )
    }
}
IntroContent.contextType = AppContext