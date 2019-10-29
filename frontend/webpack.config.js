const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== 'production';

console.log("devMode: " + devMode)

module.exports = {
	mode: devMode ? "development" : "production",

	entry: {
		"bundle.js": [
			"react-hot-loader/patch",
			"webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
			"./src/pageInit.js",
			"./src/adjust.scss"
		]
	},
	output: {
		path: __dirname + "/public",
		filename: "[name]",
		publicPath: "/"
	},

	devtool: "source-map",

	optimization: {
		minimize: false
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					cacheDirectory: true,
					presets: ['@babel/preset-react', '@babel/preset-env'],
					plugins: ["react-hot-loader/babel", '@babel/plugin-proposal-class-properties'],
				}
			},
			{
				test: /\.scss$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: devMode,
						},
					},
					"css-loader",
					"sass-loader"
				]
			},
		]
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// all options are optional
			filename: devMode ? 'styles.css' : 'styles.[hash].css',
			//chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
			ignoreOrder: false, // Enable to remove warnings about conflicting order
		})
	]
}