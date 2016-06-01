'use strict';

var gulp = require('gulp'),
		sass = require('gulp-sass'),
		sourcemaps = require('gulp-sourcemaps'),
		postcss = require('gulp-postcss'),
		autoprefixer = require('autoprefixer');
		// mqpacker = require('css-mqpacker'),
		// discomments = require('postcss-discard-comments'),
		// spritesmith = require('gulp.spritesmith'),
		// build
		// htmlreplace = require('gulp-html-replace'),
		// concat = require('gulp-concat'),
		// uglify = require('gulp-uglify'),
		// minifyCss = require('gulp-minify-css'),
		// rimraf = require('rimraf'); // remove directory

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
		.pipe(sourcemaps.init())
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
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(path.src.css));
});

//					 CLEAN
// =============================================
// remove distribution directory before build
// gulp.task('clean', function (cb) {
//    rimraf(path.build.root, cb);
// });

//					 CSS
// =============================================
// minify css
// gulp.task('minCss', ['clean'], function () {
// 	gulp.src(path.src.css + '*.css')
// 		.pipe(minifyCss())
// 		.pipe(gulp.dest(path.build.css));
// });

//					 JS
// =============================================
// concat && uglify
// gulp.task('js', ['clean'], function() {
// 	var libs = gulp.src(path.src.js + 'libs/**'), // all files
// 			plugins = gulp.src(path.src.js + 'plugins/**/*.js'),
// 			scripts = gulp.src(path.src.js + 'scripts/**/*.js');

// 	// w/0 concat
// 	libs
// 		.pipe(gulp.dest(path.build.js + 'libs'));

// 	plugins
// 		.pipe(concat(params.jsConcatNames.plugins))
// 		.pipe(uglify())
// 		.pipe(gulp.dest(path.build.js));

// 	scripts
// 		.pipe(concat(params.jsConcatNames.scripts))
// 		.pipe(uglify())
// 		.pipe(gulp.dest(path.build.js));
// });

//					 HTML
// =============================================
// parse HTML to replace non-optimized references
// gulp.task('html', ['clean'], function () {
// 	gulp.src(path.src.root + '*.html')
// 		.pipe(htmlreplace({
// 			// 'js': ['js/plugins.min.js', 'js/scripts.min.js']
// 			get js() {
// 				var rootFldLngth = path.build.root.length,
// 						jsFolder = path.build.js.slice(rootFldLngth);

// 				var key,
// 						arr = [];
// 				for (key in params.jsConcatNames) {
// 					arr.push(jsFolder + params.jsConcatNames[key]);
// 				}
// 				return arr;
// 			}
// 		}))
// 		.pipe(gulp.dest(path.build.root));
// });

//					 COPY
// =============================================
// gulp.task('copy', ['clean'], function() {
// 	var imgSprite = path.src.img + 'sprite/*.*',
// 			imgSvg = path.src.images + 'svg/*.*';

// 	var images = gulp.src([path.src.img + '**/*.*', '!'+imgSprite, '!'+imgSvg]),
// 			fonts = gulp.src(path.src.root + 'fonts/**'),
// 			ajax = gulp.src(path.src.root + 'ajax/**');

// 	images
// 		.pipe(gulp.dest(path.build.img));

// 	fonts
// 		.pipe(gulp.dest(path.build.root + 'fonts'));

// 	ajax
// 		.pipe(gulp.dest(path.build.root + 'ajax'));
// });

//					 BUILD
// =============================================
// gulp.task('build', ['html', 'minCss', 'js', 'copy']);

//					 WATCH
// =============================================
gulp.task('watch', function () {
	gulp.watch(path.src.sass + '**/*.scss', ['sass']);
});

//					 DEFAULT
// =============================================
gulp.task('default', ['sass', 'watch']);

//					 SPRITE
// =============================================
// gulp.task('sprite', function() {
// 	var sprite = gulp.src(path.src.img + 'sprite/*.png').pipe(spritesmith({
// 		retinaSrcFilter: params.sprite.retina ? [path.src.img + 'sprite/*@2x.png'] : false,
// 		imgName: params.sprite.imgName,
// 		retinaImgName: params.sprite.retina ? params.sprite.retinaImgName : false,
// 		cssName: params.sprite.cssName,
// 		padding: params.sprite.padding
// 	}));

// 	sprite.img.pipe(gulp.dest(path.src.img));
// 	sprite.css.pipe(gulp.dest(path.src.sass + 'modules'));
// });

//					 SPRITE-FALLBACK
// =============================================
// gulp.task('sprite-fallback', function() {
// 	var fallback = gulp.src(path.src.img + 'fallback/*.png').pipe(spritesmith({
// 		imgName: 'sprite_fallback.png',
// 		cssName: '__sprite-fallback.scss',
// 		padding: params.sprite.padding
// 	}));

// 	fallback.img.pipe(gulp.dest(path.src.img));
// 	fallback.css.pipe(gulp.dest(path.src.sass + 'modules'));
// });