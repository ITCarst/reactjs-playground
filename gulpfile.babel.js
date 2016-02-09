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
	return browserify({entries: ['./main.jsx'], extensions: ['.jsx'], debug: true})
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('clean', (cb) => {
	return del('bundle.js').then(paths => {
		console.log("deleted")
	}).catch(function (e) {
		console.log("NOT deleted")
  	});
})

gulp.task('default', ['clean'], () => {
	gulp.start('js');
});

gulp.task('watch', () => {
	gulp.watch('main.jsx', ["js"]);
});




