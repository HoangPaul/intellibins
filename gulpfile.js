'use strict';

var fs = require('fs-extra');
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var handlebars = require('gulp-compile-handlebars');
var copy = require('gulp-copy');
var childProcess = require('child_process');
var imagemin = require('gulp-imagemin');

gulp.task('build', ['build-static', 'build-web-demo']);

gulp.task('build-static', ['templates', 'images'], function () {
    return gulp.src('./src/static/build/**/*')
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-web-demo', function() {
    childProcess.execSync('cd src/spotless_web_frontend && npm install && npm run build');
    return gulp.src('./src/spotless_web_frontend/build/**/*')
        .pipe(gulp.dest('./dist/web-demo'));
});

gulp.task('sass', function () {
    return gulp.src('./src/static/src/scss/styles.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename('styles.css'))
        .pipe(rev())
        .pipe(gulp.dest('./src/static/build/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./tmp'));
});

gulp.task('images', function() {
    return gulp.src('./src/static/src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./src/static/build/images'));
});

gulp.task('templates', ['sass'], function() {
    var revManifest = JSON.parse(fs.readFileSync(
        './tmp/rev-manifest.json', {'encoding': 'utf8'}
    ));

    return gulp.src('./src/static/src/index.hbs')
        .pipe(handlebars({'styles': revManifest['styles.css']}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./src/static/build'))
});

gulp.task('clean', function(done) {
    fs.removeSync('dist');
    fs.removeSync('src/static/build');
    done();
});

gulp.task('watch', function() {
    gulp.watch('./src/static/src/scss/*.scss', ['sass']);
});
