var gulp = require('gulp'),

    less = require('gulp-less'),

    cssmin = require('gulp-cssmin'),

    htmlmin = require('gulp-htmlmin'),

    autoprefixer = require('gulp-autoprefixer'),

    rev = require('gulp-rev'),

    imagemin = require('gulp-imagemin'),

    useref = require('gulp-useref'),

    gulpif = require('gulp-if'),

    uglify = require('gulp-uglify'),

    rename = require('gulp-rename'),

    revCollector = require('gulp-rev-collector');


// 处理css
gulp.task('css', function () {
    return gulp.src(['lib/css/**/*.css', 'ipo/css/**/*.css', './stock/css/**/*.css', "./user/css/**/*.css"], {base: './'})
        .pipe(cssmin())
        //.pipe(autoprefixer())
        //.pipe(rev())
        .pipe(gulp.dest('./release/public'))
    //.pipe(rev.manifest()) // 生成对应关系
    //.pipe(rename('css-manifest.json'))
    //.pipe(gulp.dest('./release/rev')); // 保存对应关系
});

// 处理图片
gulp.task('image', function () {
    return gulp.src(['lib/images/**/*', 'ipo/images/**/*', './stock/images/**/*', "./user/images/**/*"], {base: './'})
        .pipe(imagemin())
        //.pipe(rev())
        .pipe(gulp.dest('./release/public'))
    //.pipe(rev.manifest())
    //.pipe(rename('image-manifest.json'))
    //.pipe(gulp.dest('./release/rev'));
});

// 处理js
gulp.task('js', function () {
    return gulp.src(['lib/js/**/*.js', 'ipo/js/**/*.js', './stock/js/**/*.js', "./user/js/**/*.js"], {base: './'})
        .pipe(gulpif('*.js', uglify({
            mangle: true,
            mangle: {except: ['require', 'exports', 'module', '$']}
        })))
        //.pipe(rev())
        .pipe(gulp.dest('./release/public'))
    //.pipe(rev.manifest())
    //.pipe(rename('js-manifest.json'))
    //.pipe(gulp.dest('./release/rev'));
});

// 处理html
gulp.task('html', function () {
    return gulp.src(['./stock/**/*.html', './user/**/*.html'], {base: './'})
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true, minifyJS: true}))
        .pipe(gulp.dest('./release/public'));
});

// 其它
gulp.task('other', function () {
    return gulp.src(['plugins/**/*'], {base: './'})
        .pipe(gulp.dest('./release/public'));
});

// 替换
gulp.task('rev', ['css', 'image', 'js', 'html'], function () {
    gulp.src(['./release/rev/*.json', './release/public/**/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('./release/public'));
});

//gulp.task('default', ['rev', 'other']);
gulp.task('default', ['css', 'image', 'js', 'html', 'other']);

// gulp.task('default', function () {
// 	console.log('默认');
// })

// gulp.task('demo', ['css', 'image'], function () {
// 	console.log(11);
// });