'use strict'

/*
* Main entry point for gulp tasks
*/
import path 			from 'path';
import gulp 			from 'gulp';
import gutil 			from 'gulp-util';
import gulpSequence 	from 'gulp-sequence';
import browserSync 		from 'browser-sync';
import express 			from 'express';

browserSync.create();

//Webpack
import webpack 				from 'webpack';
import WebpackDevServer 	from 'webpack-dev-server';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import {
	webpackConfig, 
	clientConfig
} from './webpack.config.babel';


const BUILD_DIR = path.resolve(__dirname, 'build/');
const APP_DIR = path.resolve(__dirname, 'src/');


gulp.task("build", ["webpack:build"]);
gulp.task("webpack:build", (callback) => {
	let prodCompiler = webpackConfig;

	webpackConfig.plugins = webpackConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
        		warnings: false,
        		screw_ie8: true
      		}
		})
	);

	// run webpack
	webpack(webpackConfig, (err, stats) => {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});


/**
* Development build
*/
gulp.task("build:dev", ["webpack:build-dev"]);
gulp.task("webpack:build-dev", (callback) => {
	let devCompiler = webpack(clientConfig);
	// run webpack
	devCompiler.run( (err, stats) => {
		if(err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

/**
* Watch Task HMR
*/
gulp.task("serve", ["webpack-dev-server"]);
gulp.task("webpack-dev-server", ["build:dev"], (callback) => {
	const compiler = webpack(clientConfig);
	const reload = browserSync.reload;
	let bundleStart;

	compiler.plugin('compile', function() {
		console.log('Compiling...');
		bundleStart = Date.now();
   	});

	/**
	 * Reload all devices when bundle is complete
	 * or send a fullscreen error message to the browser instead
	 */
	compiler.plugin('done', function (stats) {
	    if (stats.hasErrors() || stats.hasWarnings()) {
	        return browserSync.sockets.emit('fullscreen:message', {
	            title: "Webpack Error:",
	            body:  stripAnsi(stats.toString()),
	            timeout: 100000
	        });
	    }
	   	console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
	    browserSync.reload();
	});
	
	const frontServer = new WebpackDevServer(compiler, {
		// webpack-dev-server options
		contentBase: BUILD_DIR + "/js",
		publicPath: webpackConfig.output.publicPath,
		port: 3000,
		outputPath: BUILD_DIR,
		filename: '[name].js',
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000
		},
		lazy: true,
        inline: true,
        quiet: false,
		noInfo: false,
		hot: true,	 // Enable special support for Hot Module Replacement
		// pretty colored output
		stats: {
            assets: true,
            colors: true,
            version: false,
            hash: true,
            timings: false,
            chunks: false,
            chunkModules: false
        },
        historyApiFallback: true,	//access dev server from arbitrary url.
        headers: { "X-Custom-Header": "yes" }
	});

	/**
	 * Run Browsersync and use middleware for Hot Module Replacement
	 */
	browserSync({
		server: {
			baseDir: './',
			middleware: [
				//frontServer,
				// compiler should be the same as above
				webpackHotMiddleware(compiler)
			]
		},
		browser: ["google chrome"],
		// including full page reloads if HMR won't work
		files: [
			APP_DIR + '/sass/**/*.scss',
			APP_DIR + '/js/**/*',
			APP_DIR + '/images/**/*',
			APP_DIR + 'index.html',
			APP_DIR + '/fonts/**/*'
		]
	});

	//HTML Changes
	gulp.watch("*.html").on('change', reload);
	//CSS Changes
	gulp.watch('src/sass/**/*.scss', ['styles']).on('change', reload);
	//JS Watch
	gulp.watch('src/js/**/*', ['build:dev']).on('change', reload);
});