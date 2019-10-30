import React from "react"

export default class MarketsPage extends React.Component {

    constructor(props, context) {
        super(props, context)
    }

    state = {}

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    createMarketClick = (e) => {
        e.preventDefault()
        this.setState(state => ({running: true}))
        const request = {}
        document.querySelectorAll("#test1 input").forEach(input => {
            request[input.id] = (input.id === "timestamp" ? parseInt(input.value) : input.value)
        })

        this.context.w3a.contracts.createContract.send(
            request.name,
            request.timestamp,
            request.apiPath,
            request.postOrGet,
            request.getData,
            request.postData,
            request.jsonRegex
        )
            .then(rest => {
                this.
                console.log(rest)
                this.fetchAllEvents(true)
            })
            .catch(e => {
                debugger
            })
            .finally(() => {
                this.setState(state => ({running: false}))
            })
    }

    render() {

        const inputs = [
            "name",
            "timestamp",
            "apiPath",
            "postOrGet",
            "getData",
            "postData",
            "jsonRegex"
        ]

        return (
            <div id="CreateMarketPage">

                <section className="container">

                    <h1>Create Market</h1>
                    <form id="create-market-form">
                        <div className="container">
                            <div className="row">

                                {inputs.map(input =>
                                    <div key={input} className="col-lg-3">
                                        <div className="form-group">
                                            <label className="btn-l">{input}</label>
                                            <input id={input} className="form-control"
                                                   defaultValue={input === "timestamp" ? 3000 : input}
                                                   disabled={this.state.running}/>
                                        </div>
                                    </div>
                                )}

                                <div className="col-lg-3" style={{textAlign: "center"}}>
                                    <button
                                        className={"btn btn-primary btn-a" + (this.state.running ? "btn-anima" : "")}
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)"
                                        }}
                                        disabled={this.state.running}
                                        onClick={this.createMarketClick}>
                                        {this.state.running ?
                                            <div className="spinner-border text-warning" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            :
                                            <h4>
                                                <b>Send Tx</b>
                                            </h4>}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </form>
                </section>
            </div>
        )
    }
}