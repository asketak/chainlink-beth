import React from "react"

import {Link} from "react-router-dom";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import moment from "moment";

import AppContext from "./AppContext";
import RemainingTimeSpan from "./RemainingTimeSpan.jsx";

export default class EventFragment extends React.Component {

    static contextType = AppContext

    constructor(props, context) {
        super(props, context)
    }

    state = {
        inited: false,
        event: null,
        expanded: false
    }

    componentDidMount() {
        this.fetchEvent()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.fetchEvent()
    }

    fetchEvent(force) {
        if (force || (!this.state.inited && this.state.event === null && this.context.w3a)) {
            this.setState({inited: true})

            this.context.w3a.contracts.PredictEvent._at(this.props.address).market.call()
                .then(event => {
                    this.setState(state => ({event}))
                })
        }
    }

    render() {
        const name = (this.state.event && this.state.event[0]) || "Loading..."

        const endTimestamp = this.props.endTimestamp
        const endDateString = moment(endTimestamp).format("MMMM D YYYY   kk:mm");

        const description = "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like."
        //const description = this.state.event ? this.state.event.description : "Loading ..."

        return (
            <Card raised={true}>
                <CardHeader className="event-head"
                            style={{backgroundImage: "linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(117, 19, 93, 0.73)) url('/img/trump1.jpg')"}}
                            title={
                                <div>
                                    <h3>{name}</h3>
                                    <h5>Ends: {endDateString} (<RemainingTimeSpan endTimestamp={endTimestamp}/>)</h5>
                                </div>
                            }
                            subheader={
                                <Typography variant="body2" color="textSecondary" component="p">{description}</Typography>
                            }
                />
                <CardActions className="event-card-action" style={{padding: 0}} disableSpacing>
                        <Link to={"/events/" + this.props.address}>
                            <div>Go To Event >>></div>
                        </Link>
                </CardActions>
            </Card>
        )
    }
}