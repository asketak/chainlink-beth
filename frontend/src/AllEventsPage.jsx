import React from "react"

import {Link} from "react-router-dom";
import AppContext from "./AppContext";
import EventFragment from "./EventFragment.jsx";
import {Button} from "@material-ui/core";

export default class AllEventsPage extends React.Component {

    static contextType = AppContext

    constructor(props, context) {
        super(props, context)
    }

    state = {
        inited: false,
        allEvents: null,
        sortType: "endsoon"
    }

    componentDidMount() {
        this.fetchAllEvents()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.fetchAllEvents()
    }

    fetchAllEvents(force) {
        if (force || (!this.state.inited && this.state.allEvents === null && this.context.w3a)) {
            this.setState({inited: true})
            this.context.w3a.contracts.EventFactory.getAllEvents.call()
                .then(allEvents => {
                    this.setState(state => ({
                        allEvents: allEvents
                    }))
                })
        }
    }

    evenSortFunction(sortType) {
        return function (event1, event2) {
            switch (sortType) {
                case "endsoon":
                    return event1.timestamp - event2.timestamp;
                    break;
                case "endlate":
                    return event2.timestamp - event1.timestamp;
                    break;
                case "newest":
                    return event1.resolutionDate - event2.resolutionDate;
                    break;
                case "oldest":
                    return event2.resolutionDate - event1.resolutionDate;
                    break;
                case "mostVolume":
                    return event2.volume - event1.volume;
                    break;
                case "mostOrders":
                    return event2.orderBook - event1.resolutionDate;
                    break;
            }
        }
    }

    render() {
        const allEvents = this.state.allEvents

        return (
            <div id="AllEventsPage" className="container-content">
                <section className="container">
                    <h1 style={{position: "relative", marginBottom:"20px"}}>
                        All&nbsp;
                        <b>
                            {allEvents
                                ? allEvents.length
                                : <div className="spinner-border text-warning" role="status"/>}
                        </b>
                        &nbsp;Markets:
                        <Link to={"/create-event"}>
                            <Button style={{position: "absolute", right: 0}} size="large" variant="contained" color="primary">
                                Create Event
                            </Button>
                        </Link>
                    </h1>

                    <div className="row">
                        {(allEvents || []).map(event => (
                                <div key={event.add} className="col-lg-6 mb-4">
                                    <EventFragment address={event.add} endTimestamp={event.timestamp}/>
                                </div>
                            )
                        )}
                    </div>

                    <h1 style={{position: "relative", marginBottom:"20px"}}>
                        Finished Events:
                    </h1>
                </section>
            </div>
        )
    }
}