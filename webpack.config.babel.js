'use strict';

import gulp 			from 'gulp';
import gutil 			from 'gulp-util';
import path 			from 'path';

import webpack 				from 'webpack';
import WebpackDevServer 	from "webpack-dev-server";
import webpackHotMiddleware from 'webpack-hot-middleware';

//dirs
const BUILD_DIR = path.resolve(__dirname, 'build');
const APP_DIR = path.resolve(__dirname, 'src/js');

//outputs
const entryFile = 'app.js';
const outputFile = 'bundle.js';

const webpackConfig = {
	context: path.resolve(__dirname, './'),
	cache: true,
	debug: false,
	stats: {
		colors: true
	},
	devtool: false,
	plugins: [
	    new webpack.optimize.OccurenceOrderPlugin(),
	    new webpack.NoErrorsPlugin()
	],
	resolve: {
		modulesDirectories: ['node_modules'],
		extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
	},
	entry: [
		'babel-polyfill',
		'webpack/hot/dev-server',
        'webpack-hot-middleware/client?reload=true',
		APP_DIR + '/'+ entryFile
	],
	output: {
		path: BUILD_DIR + "/js",
		publicPath: '/public/js/', //the public URL address of the output files when referenced in a browser
		sourceMapFilename: 'debugging/[file].map',
		filename: outputFile,
		sourcePrefix: '  ',
	},
	module: {
		loaders: [
			{
				loader: "babel-loader",
				test: /(\.jsx|\.js)$/,
				exclude: /node_modules/,				
				query: {
					presets: ['es2015', 'react', "stage-0", 'es2016']
				},
				include: path.join(__dirname, '.')
			},
			/*{
				test: /(\.jsx|\.js)$/,
				loader: "eslint-loader",
				exclude: /node_modules/
			},*/
			{
        		test: /\.json$/,
        		loader: 'json-loader',
      		},
      		{
		        test: /\.txt$/,
		        loader: 'raw-loader',
	      	},
	      	{
        		test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        		loader: 'url-loader',
        		query: {
          			name: '[path][name].[ext]?[hash]',
          			limit: 10000,
        		},
      		}
		]
	}	
}

/**
 * Configuration for the client-side bundle
 */
const clientConfig = Object.assign({}, webpackConfig, {
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				"NODE_ENV": JSON.stringify("development")
			}
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.OldWatchingPlugin()
	],
	// modify some webpack config options
	devtool : "eval",
	cache: false,
	debug: true,
	console: true,
	stats: {
        assets: true,
        colors: true,
        version: false,
        hash: true,
        timings: false,
        chunks: false,
        chunkModules: false
    }
});
/**
 * Configuration for the server-side bundle (server.js)
 */

export {clientConfig, webpackConfig};
