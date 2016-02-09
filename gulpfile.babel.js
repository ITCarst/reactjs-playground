'use strict'

/*
* Main entry point for gulp tasks
*/
import gulp from 'gulp';
import browserify from 'browserify';
import fs from 'fs';
import del from 'del';
import gutil from 'gulp-util';
import babelify from 'babelify';
import debowerify from 'debowerify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import reactify from 'reactify';

gulp.task("js", (cb) => {
	return browserify({entries: ['./app/js/main.jsx'], extensions: ['.jsx'], debug: true})
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', (cb) => {
	return del('./dist').then(paths => {
		console.log("deleted dist folder")
	}).catch(function (e) {
		console.log("NOT deleted")
  	});
});

gulp.task("copy-html", (cb) => {
	return gulp.src("./app/index.html")
		.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['clean'], () => {
	gulp.start('js', 'copy-html');
});

gulp.task('watch', () => {
	gulp.watch('./app/js/main.jsx', ["js"]);
	gulp.watch('./app/index.html', ["copy-html"]);
});




