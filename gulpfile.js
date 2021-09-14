// Import modules
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create(); // run create to initialize browser-sync server

// Gulp Tasks (ie. functions)
// SCSS Task
function scssTask() {
  // return a Node stream using the src function from gulp
  // source file to get sass styles from + turn on sourcemaps
  return src("app/scss/style.scss", { sourcemaps: true })
    .pipe(sass()) // pipe on the sass function
    .pipe(postcss([cssnano])) //then minify it
    .pipe(dest("dist", { sourcemaps: "." })); // with minified css file save it using dest function in a new folder 'dist' and save sourcemaps there (the . tells gulp to save it in the same location the dist folder)
}

// JS Task
function jsTask() {
  return src("app/js/main.js", { sourcemaps: true })
    .pipe(terser()) // minify js file
    .pipe(dest("dist", { sourcemaps: "." })); // save it using dest again in the dist folder
}

// Browsersync Tasks
// Browsersync server - going to initialize a local server and start running it
// need a callback function as the parameter bc the browsersync function is not a gulp plugin...not returning anything
// in order to tell the asynchronous function that it's complete, need to manually/explicityly end it by using the callback function
function browsersyncServe(cb) {
  // starts up the server
  browsersync.init({
    // where the server will be based out of
    server: {
      // to be the root directory running gulp file from which is the prohject root bc it's where the index.html file is located
      baseDir: ".",
    },
  });
  // run callback function at the end to signify that it's complete
  cb();
}

// Browsersync reload - reload the server whenever code changes
function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch task
function watchTask() {
  // make changes in html
  watch("*.html", browsersyncReload);
  // make changes in sass or javascript files --> run sass and javascript tasks and run reload function
  watch(
    ["app/scss/**/*.scss", "app/js/**/*.js"],
    series(scssTask, jsTask, browsersyncReload)
  );
}

// Sass and JS tasks set up? --> add into the gulp workflow
// Default gulp task - this is what's going to run when type in 'gulp' in cl
exports.default = series(
  // using series to run a bunch of things one after the other
  // list all tasks created
  scssTask,
  jsTask,
  browsersyncServe,
  watchTask
);
