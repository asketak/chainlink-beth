import React from "react"
import ReactDOM from "react-dom"

import App from "./App.jsx";

const appElement = document.getElementById("app");

ReactDOM.render(
    React.createElement(App),
    appElement
)