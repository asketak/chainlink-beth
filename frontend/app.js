const express = require('express')
const app = express()
const port = 3000

/////// HMR SETUP

const webpack = require("webpack")
const webpackConfig = require("./webpack.config")
const compiler = webpack(webpackConfig)
app.use(require("webpack-dev-middleware")(compiler, {noInfo: true, publicPath: webpackConfig.output.publicPath}))
app.use(require("webpack-hot-middleware")(compiler))

/////// END HMR SETUP

app.use(express.static('public'))

app.get(['/', "/markets", "/account", "/create-contract"], (req, res) => res.sendFile('/index.html', {root: __dirname + "/public"}))

app.listen(port, () => console.log(`Listening on port ${port}!`))