const { src,dest,watch,series } = require('gulp');
const sass = require('gulp-sass')
const del = require('del')
const concat = require('gulp-concat')
const minify = require('gulp-minify')
const cssmin = require('gulp-cssmin')
const sourcemaps = require('gulp-sourcemaps')
    

function styles(cb) {
    return src('src/sass/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compact'}).on('error',sass.logError))
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(dest('src/css'))
        
    cb();
}



exports.styles = styles;
exports.default = function() {
    watch('src/sass/**/*.scss', styles);
};


/* gulp.task('concatStyles', function() {
    return gulp.src('src/css/libs/*.css')
        .pipe(concat('libs.minify.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('src/css/'));
}); */


/* gulp.task('concatJS', function() {
    return gulp.src('src/js/libs/*.js')
        .pipe(concat('libs.concat.js'))
        .pipe(minify({
            ext:{
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('src/js/'));
}); */
