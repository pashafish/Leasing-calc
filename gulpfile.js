const {src, dest, series, watch} = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoPrefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const gutil = require('gulp-util');
const webpack = require('webpack');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();

const html = () => {
  return src('src/*.html')
  .pipe(htmlMin({
    collapseWhitespace: true,
    removeComments: true
  }))
  .pipe(dest('docs/'))
  .pipe(browserSync.stream())
}

const sassToCss = () => {
  return src('src/scss/main.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoPrefixer({
    cascade: false
  }))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(dest('docs/css'))
  .pipe(browserSync.stream())
}

const clean = () => {
  return del(['docs'])
}

const plugins = () => {
  return src('src/plugins/**/*')
  .pipe(dest('docs/plugins'))
  .pipe(browserSync.stream())
}

const fonts = () => {
  return src('src/fonts/**/*')
  .pipe(dest('docs/fonts'))
  .pipe(browserSync.stream())
}

const img = () => {
  return src('src/img/**/*')
  .pipe(dest('docs/img'))
  .pipe(browserSync.stream())
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'docs'
    }
  })
}

const webPack = () => {
  return webpack(
    require('./webpack.config.js'),
    function(err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
        // output options
    }))
    if(!browserSync.active) watchFiles()
    else {
      browserSync.reload();
      watch('src/components/**/*.jsx', webPack);
    }
  })
}

watch('src/*.html', html);
watch('src/scss/**/*.scss', sassToCss);
watch('src/components/**/*.jsx', webPack);
watch('src/plugins/**/*', plugins)
watch('src/fonts/**/*', fonts)
watch('src/img/**/*', img)

exports.default = series( clean, html, sassToCss, plugins, fonts, img, webPack );
