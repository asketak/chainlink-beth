import React from "react"

export default class AccountPage extends React.Component {

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
            <div id="AccountPage">

				Account Page

            </div>
        )
    }
}