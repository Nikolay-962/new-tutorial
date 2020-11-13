var gulp = require('gulp'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  rigger = require('gulp-rigger'),
  twig = require("gulp-twig"),
  gcmq = require('gulp-group-css-media-queries'),
  csscomb = require('gulp-csscomb'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  browsersync = require("browser-sync"),
  changed = require('gulp-changed'),
  del = require("del"),
  reload = browsersync.reload;

var path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/*.js',
    style: 'src/style/*.scss',
    img: 'src/img/**/*.*',
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/img/**/*.*',
  },
  clean: './build'
};

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./build"
    },
    port: 3000
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function clean() {
  return del(path.clean);
}

function html() {
  return gulp
    .src(path.src.html)
    .pipe(twig())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({ stream: true }));
}

function js() {
  return gulp
    .src(path.src.js)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({ stream: true }));
}

function style() {
  return gulp
    .src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(prefixer())
    .pipe(gcmq())
    .pipe(csscomb())
    .pipe(sourcemaps.write('/sourcemaps'))
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({ stream: true }));
}

function image() {
  return gulp
    .src(path.src.img)
    .pipe(changed(path.build.img))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({ stream: true }));
}

function watchFiles() {
  gulp.watch([path.watch.style], style);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.img], image);
}

gulp.task("image", image);
gulp.task("style", style);
gulp.task("js", js);
gulp.task("html", html);
gulp.task("clean", clean);

gulp.task("build", gulp.series(clean, gulp.parallel(style, image, html, js)));
gulp.task("watch", gulp.parallel(watchFiles, browserSync));