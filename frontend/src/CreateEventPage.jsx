import React from "react"

import TextField from '@material-ui/core/TextField';
import AppContext from "./AppContext";

import {Button, Card, CardContent, FormControl, InputLabel, Select, MenuItem} from "@material-ui/core";

import moment from "moment";

export default class CreateEventPage extends React.Component {

    static contextType = AppContext

    constructor(props, context) {
        super(props, context)
    }

    state = {
        optionCount: 1
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    handleOptionCountChange = (e) => {
        this.setState(state => ({optionCount: e.target.value}))
    }

    createEventClick = (e) => {
        e.preventDefault()
        this.setState(state => ({running: true}))
        const request = {}
        document.querySelectorAll("#create-event-form .input-simple input, #create-event-form .input-simple textarea#description").forEach(input => {
            request[input.id] = input.value
        })
        request.options = []
        document.querySelectorAll("#create-event-form input[id^=optionM]").forEach(input => {
            const optionId = input.id.substr(-1)
            const minMax = input.id.startsWith("optionMin") ? "min": "max";

            if (!request.options[optionId]) {request.options[optionId] = {}}

            if (minMax === "min") {
                request.options[optionId] = {...request.options[optionId], min: parseInt(input.value)}
            } else {
                request.options[optionId] = {...request.options[optionId], max: parseInt(input.value)}
            }
        })

        const requestOptionsMap = request.options.map(option => (["" + option.min + " - " + option.max, option.min, option.max, ""]))

        debugger
        this.context.w3a.contracts.EventFactory.createContract.send(
            null,
            [
                request.name,
                request.description,
                request.apiPath,
                request.postOrGet,
                request.getData,
                request.postData,
                request.jsonRegex
            ],
            Math.floor(moment(request.endTimestamp).valueOf() / 1000),
            requestOptionsMap,
            false,
            false
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
                className="input-simple"
                //defaultValue={input}
                helperText={input.note}
                margin="dense"
                type="datetime-local"
                defaultValue={moment().add(1, 'hour').format("YYYY-MM-DDTHH:mm")}
                InputLabelProps={{
                    shrink: true,
                }}
                disabled={this.state.running}
            />
        } else if (input.type === "multiline") {
            return <TextField
                id={input.id}
                type="text"
                label={input.label}
                className="input-simple"
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
                type="text"
                label={input.label}
                className="input-simple"
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
                                        <div key={input.id}
                                             className="input-col col-lg-6">{this.renderInput(input)}</div>
                                    )}

                                    <div key="optionCount" className="input-col col-lg-12" style={{marginTop: "15px"}}>
                                        <FormControl variant="outlined">
                                            <InputLabel style={{width: "170px", fontSize: "25px"}}
                                                        id="demo-simple-select-outlined-label">
                                                Options count
                                            </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-outlined-label"
                                                id="optionCount"
                                                value={this.state.optionCount}
                                                onChange={this.handleOptionCountChange}
                                                labelWidth={160}
                                                disabled={this.state.running}
                                                margin="dense"
                                                style={{
                                                    width: "200px",
                                                    marginTop: "10px",
                                                    textAlign: "right",
                                                    paddingRight: "10px",
                                                    fontSize: "23px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(option =>
                                                    <MenuItem value={option}>
                                                        {option}
                                                    </MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </div>

                                    {(() => {
                                        const options = []
                                        for (let i = 0; i < this.state.optionCount; i++) {
                                            options.push(
                                                <div>
                                                    <h4>Range {i+1}:</h4>
                                                    <div className="d-flex">
                                                        <TextField
                                                            type="number"
                                                            style={{width: "90px", marginRight: "10px"}}
                                                            id={"optionMin" + i}
                                                            label="Min"
                                                            helperText=""
                                                            required
                                                            margin="dense"
                                                            fullWidth
                                                            variant="outlined"
                                                            disabled={this.state.running}
                                                        />
                                                        <TextField
                                                            type="number"
                                                            style={{width: "90px", marginRight: "10px"}}
                                                            id={"optionMax" + i}
                                                            label="Max"
                                                            helperText=""
                                                            required
                                                            margin="dense"
                                                            fullWidth
                                                            variant="outlined"
                                                            disabled={this.state.running}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return <div className="input-col col-lg-12"
                                                    style={{width: "200px"}}>{options}</div>
                                    })()}


                                    <div key="submitButton" className="submit-col col-lg-12" style={{marginTop: "20px"}}>
                                        <Button size="large"
                                                variant="contained"
                                                color="primary"
                                                disabled={this.state.running}
                                                onClick={this.createEventClick}>
                                            {
                                                this.state.running ?
                                                    <div className="spinner-border text-warning" role="status">
                                                        <span className="sr-only">Loading...</span>
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