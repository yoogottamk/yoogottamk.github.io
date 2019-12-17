"use strict";

let gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"),
    cleanCSS = require("gulp-clean-css"),
    ghPages = require("gulp-gh-pages"),
    terser = require("gulp-terser");

gulp.task("styles", () => {
    return gulp
        .src("./_site/css/*.css", { base: "./" })
        .pipe(autoprefixer({ cascade: false }))
        .pipe(cleanCSS())
        .pipe(gulp.dest("."));
});

gulp.task("scripts", () => {
    return gulp
        .src("./_site/js/*.js", { base: "./" })
        .pipe(terser())
        .pipe(gulp.dest("."));
});

gulp.task("ghPages", () => gulp.src("./_site/**/*").pipe(ghPages({ branch: "master" })));

gulp.task("default", gulp.parallel("styles", "scripts"));
gulp.task("deploy", gulp.series(gulp.parallel("styles", "scripts"), "ghPages"));
