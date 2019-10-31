import React from "react"

import TextField from '@material-ui/core/TextField';
import AppContext from "./AppContext";

import {Button, Card, CardContent} from "@material-ui/core";

import moment from "moment";

export default class CreateEventPage extends React.Component {

    static contextType = AppContext

    constructor(props, context) {
        super(props, context)
    }

    state = {}

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    createEventClick = (e) => {
        e.preventDefault()
        this.setState(state => ({running: true}))
        const request = {}
        document.querySelectorAll("#create-event-form input").forEach(input => {
            request[input.id] = (input.id === "timestamp" ? parseInt(input.value) : input.value)
        })

        this.context.w3a.contracts.EventFactory.createContract.send(
            null,
            request.name,
            moment(request.endTimestamp).valueOf(),
            request.apiPath,
            request.postOrGet,
            request.getData,
            request.postData,
            request.jsonRegex
        )
            .then(rest => {
                window.location.href = "/events";
            })
            .catch(e => {
                debugger
            })
            .finally(() => {
                this.setState(state => ({running: false}))
            })
    }

    renderInput(input) {
        if (input.type === "date") {
            return <TextField
                id={input.id}
                label={input.label}
                //defaultValue={input}
                helperText={input.note}
                margin="dense"
                type="datetime-local"
                defaultValue={moment().add(7, 'days').format("2017-05-24THH:mm")}
                InputLabelProps={{
                    shrink: true,
                }}
                disabled={this.state.running}
            />
        } else if (input.type === "multiline") {
            return <TextField
                id={input.id}
                label={input.label}
                //defaultValue={input}
                helperText={input.note}
                margin="dense"
                fullWidth
                multiline
                variant="outlined"
                disabled={this.state.running}
            />
        } else {
            return <TextField
                id={input.id}
                label={input.label}
                //defaultValue={input}
                helperText={input.note}
                margin="dense"
                fullWidth
                variant="outlined"
                disabled={this.state.running}
            />
        }
    }

    render() {

        const inputs = [
            {id: "name", label: "Event name"},
            {id: "endTimestamp", type: "date", label: "End Date", note: ""},
            {id: "description", type: "multiline", label: "Description", note: ""},
            {id: "apiPath", label: "Api Path", note: "Cesta k rozuzleni"},
            {id: "postOrGet", label: "POST or GET", note: ""},
            {id: "getData", label: "Get Params", note: ""},
            {id: "postData", label: "Post Params", note: ""},
            {id: "jsonRegex", label: "Json Regex", note: ""}
        ]

        return (
            <div id="CreateEventPage" className="container-content">

                <section className="container">

                    <h1>Create Event</h1>
                    <Card>
                        <CardContent>
                            <form id="create-event-form">
                                <div className="row">

                                    {inputs.map(input =>
                                        <div key={input.id} className="input-col col-lg-6">{this.renderInput(input)}</div>
                                    )}

                                    <div key="submitButton" className="submit-col col-lg-6">
                                        <Button size="large"
                                                variant="contained"
                                                color="primary"
                                                disabled={this.state.running}
                                                onClick={this.createEventClick}>
                                            {
                                                this.state.running ?
                                                    <div className="spinner-border text-warning" role="status">
                                                        Loading...<span className="sr-only">Loading...</span>
                                                    </div>
                                                    :
                                                    <h4>
                                                        <b>Submit</b>
                                                    </h4>
                                            }
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </section>
            </div>
        )
    }
}