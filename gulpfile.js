var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var cssmin = require('gulp-minify-css');


gulp.task('browser-sync', ['sass', 'html'], function () {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task ('html', function() {
  gulp.src('*.html')
    .pipe(gulp.dest('_site/'))
    .pipe(browserSync.reload({stream: true}))
});

/**
 * Compile files from _scss into both _site/css (for live injecting)
 */
gulp.task('sass', function () {
  gulp.src('_sass/*.scss')
    .pipe(sass({
      includePaths: ['sass'],
      onError: browserSync.notify
    }))
    .pipe(prefix(['last 3 versions', '> 1%'], { cascade: true }))
    .pipe(gulp.dest('_site/css'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('css/'));
});


/**
 * Compile files from _scss into minified css
 */
gulp.task('sassmin', function () {
  gulp.src('_sass/main.scss')
    .pipe(sass({ includePaths: ['sass'] }))
    .pipe(prefix(['last 3 versions', '> 1%'], { cascade: true }))
    .pipe(cssmin())
    .pipe(gulp.dest('_site/css/'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, & reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch('_sass/**/*', ['sass']);
  gulp.watch('*.html', ['html']);
});


// Tasks
// ---------------------------------------------------

// Default task, running just `gulp` will compile the Sass, launch BrowserSync & watch files.
gulp.task('default', ['browser-sync', 'watch']);

// Build-prod task, with minified files
gulp.task('production', ['sassmin']);
