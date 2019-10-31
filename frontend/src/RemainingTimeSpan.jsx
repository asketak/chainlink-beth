import React from "react";

import moment from "moment";

export default class RemainingTimeSpan extends React.Component {

    state = {
        setIntervalHandle: null
    }

    domElement = React.createRef()

    updateRemainngTimeElement = () => {
        const remainingTimeText = this.props.endTimestamp ? moment(this.props.endTimestamp).fromNow() : ""
        this.domElement.current.innerHTML = remainingTimeText
    }

    componentDidMount() {
        this.setState(state => ({
            setIntervalHandle: setInterval(this.updateRemainngTimeElement, 1000)
        }))
    }
    componentWillUnmount() {
        if (this.state.setIntervalHandle) {
            clearInterval(this.state.setIntervalHandle)
            this.state.setIntervalHandle = null
        }
    }

    render() {return (<span ref={this.domElement}/>)}
}