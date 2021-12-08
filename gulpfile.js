"use strict";

const gulp = require("gulp"),
  autoprefixer = require("gulp-autoprefixer"),
  cleanCSS = require("gulp-clean-css"),
  ghPages = require("gulp-gh-pages"),
  terser = require("gulp-terser"),
  removeEmptyLines = require("gulp-remove-empty-lines");

// fix css
gulp.task("styles", () =>
  gulp
    .src("./_site/css/*.css", { base: "./" })
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS())
    .pipe(gulp.dest(".")));

// fix js
gulp.task("scripts", () =>
  gulp
    .src("./_site/js/*.js", { base: "./" })
    .pipe(terser({ toplevel: true }))
    .pipe(gulp.dest(".")));

// clean html
gulp.task("html-clean", () =>
  gulp
    .src("./_site/**/*.html", { base: "./" })
    // was messing up newlines in code too :(
    // .pipe(removeEmptyLines())
    .pipe(gulp.dest(".")));

// push to github pages
gulp.task(
  "ghpages",
  () => gulp.src("./_site/**/*").pipe(ghPages({ branch: "master" })),
);

// by default, do everything except push to github pages
gulp.task("default", gulp.parallel("styles", "scripts", "html-clean"));

// deploy: do everything and push
gulp.task("deploy", gulp.series("default", "ghpages"));
