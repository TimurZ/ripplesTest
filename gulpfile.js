'use strict';

var gulp = require('gulp'),
		sass = require('gulp-sass'),
		sourcemaps = require('gulp-sourcemaps'),
		postcss = require('gulp-postcss'),
		autoprefixer = require('autoprefixer'),
		babel = require('gulp-babel');
		// mqpacker = require('css-mqpacker'),

var path = {
	src: {
		root: './',
		sass: 'sass/',
		js:   'js/',
		img:  'images/',
		css:  'css/'
	},
	build: {
		root: './',
		css:  './css/',
		js:   './js/',
		img:  './images/'
	}
};

var params = {
	autoPref: {
		// https://github.com/ai/browserslist
		browsers: ['last 3 versions', 'ie >= 9'],
		cascade: false
	},
	mq: {
		// min-width, max-width, false
		sort: 'min-width'
	},
	sass: {
		// nested, expanded, compact, compressed
		outputStyle: 'expanded'
	},
	sprite: {
		imgName: 'sprite.png',
		retina: true,
		retinaImgName: 'sprite@2x.png',
		cssName: '_sprite.scss',
		padding: 3
	},
	jsConcatNames: {
		plugins: 'plugins.min.js',
		scripts: 'scripts.min.js'
	}
};

//					 SASS-CSS
// =============================================
gulp.task('sass', function () {
	gulp.src(path.src.sass + '*.scss')
		// .pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: params.sass.outputStyle
		}).on('error', sass.logError))
		.pipe(postcss([
			autoprefixer({
				browsers: params.autoPref.browsers,
				cascade: params.autoPref.cascade
			}),
			// standart gulp plugin like combine media queries
			// doesn't support sourcemaps and messes it up
			// mqpacker({
			// 	sort: function(a, b) {
			// 		a = a.replace(/\D/g,'');
			// 		b = b.replace(/\D/g,'');
			// 		// a - b for mobile first approach
			// 		return params.mq.sort === 'min-width'
			// 			? a - b
			// 			: params.mq.sort === 'max-width'
			// 			? b - a : false
			// 	}
			// }),
			// discomments()
		]))
		// .pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(path.src.css));
});

// 		JS
// ========================================
gulp.task('js', function() {
	gulp.src(path.src.js + 'src/**/*.js')
		.pipe(babel({
				presets: ['es2015', 'stage-0']
		}))
		.pipe(gulp.dest(path.src.js));
});

//					 WATCH
// =============================================
gulp.task('watch', function () {
	gulp.watch(path.src.sass + '**/*.scss', ['sass']);
	gulp.watch(path.src.js + 'src/**/*.js', ['js']);

});

//					 DEFAULT
// =============================================
gulp.task('default', ['sass', 'js', 'watch']);
