import React from "react"

import IntroHeading from './IntroHeading.jsx'
import IntroContent from "./IntroContent.jsx";


export default class HomePage extends React.Component {

    componentDidMount() {
        console.log("Mount Home page")
    }

    componentDidUpdate() {
        console.log("Update Home page")
    }

    render() {

        const { userAddress } = this.props

        return (
            <div id="HomePage">

				<IntroHeading/>

                <IntroContent/>

            </div>
        )
    }
}