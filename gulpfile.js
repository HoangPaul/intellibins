'use strict';

var fs = require('fs');
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var handlebars = require('gulp-compile-handlebars');

gulp.task('sass', function () {
    return gulp.src('./src/static/src/scss/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('styles.css'))
        .pipe(rev())
        .pipe(gulp.dest('./src/static/public/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./tmp'));
});

gulp.task('templates', function() {
    var revManifest = JSON.parse(fs.readFileSync(
        './tmp/rev-manifest.json', {'encoding': 'utf8'}
    ));

    return gulp.src('./src/static/src/index.hbs')
        .pipe(handlebars({'styles': revManifest['styles.css']}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./src/static/public'))
});

gulp.task('watch', function() {
    gulp.watch('./src/static/src/scss/*.scss', ['sass']);
});