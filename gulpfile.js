var fs = require('fs'),
	gulp = require('gulp'),
	gulpif = require('gulp-if'),
	merge = require("merge-stream"),
	autoprefixer = require('gulp-autoprefixer'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	concatutil = require('gulp-concat-util'),
	cssmin = require('gulp-cssmin'),
	html2js = require('gulp-html2js'),
	livereload = require('gulp-livereload'),
	path = require('path'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	watch = require('gulp-watch'),
	webserver = require('gulp-webserver');

// COMPILE
gulp.task('compile:sass', function () {
	var tasks = getCompilers('.scss').map(function (compile) {
		console.log(compile.inputFile);
		return gulp.src(compile.inputFile, {
				base: '.'
			})
			.pipe(plumber())
			.pipe(sass().on('compile:sass.error', function (error) {
				console.log('compile:sass.error', error);
			}))
			.pipe(autoprefixer()) // autoprefixer
			.pipe(rename(compile.outputFile))
			.pipe(gulp.dest('./'));
	});
	return merge(tasks);
});
gulp.task('compile', ['compile:sass']);

// BUNDLE
gulp.task('bundle:css', function () {
	var tasks = getBundles('.css').map(function (bundle) {
		return gulp.src(bundle.inputFiles, {
				base: '.'
			})
			.pipe(plumber())
			.pipe(concat(bundle.outputFileName))
			.pipe(gulp.dest('.'))
			.pipe(gulpif(bundle.minify && bundle.minify.enabled, cssmin()))
			.pipe(rename({
				extname: '.min.css'
			}))
			.pipe(gulp.dest('.'));
	});
	return merge(tasks);
});
gulp.task('bundle:js', function () {
	var tasks = getBundles('.js').map(function (bundle) {
		return gulp.src(bundle.inputFiles, {
				base: '.'
			})
			.pipe(plumber())
			.pipe(concat(bundle.outputFileName))
			.pipe(gulp.dest('.'))
			.pipe(sourcemaps.init())
			.pipe(gulpif(bundle.minify && bundle.minify.enabled, uglify()))
			.pipe(rename({
				extname: '.min.js'
			}))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('.'));
	});
	return merge(tasks);
});
gulp.task('bundle:partials', function () {
	return gulp.src('./artisan/**/*.html', {
			base: './artisan/'
		})
		.pipe(plumber())
		.pipe(rename(function (path) {
			path.dirname = path.dirname.split('\\').join('/');
			path.dirname = path.dirname.split('artisan/').join('');
			// path.basename += "-partial";
			path.extname = '';
			// console.log('path', path);
		}))
		.pipe(html2js('artisan-partials.js', {
			adapter: 'angular',
			// base: '.',
			name: 'artisan',
			fileHeaderString: '/* global angular: false */',
			quoteChar: '\'',
			indentString: '\t\t',
			singleModule: true,
			useStrict: true,
		}))
		.pipe(gulp.dest('./docs/js/')) // save .js
		.pipe(sourcemaps.init())
		.pipe(uglify()) // { preserveComments: 'license' }
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(sourcemaps.write('./')) // save .map
		.pipe(gulp.dest('./docs/js/')); // save .min.js
});
gulp.task('bundle:snippets', function () {
	return gulp.src('./src/snippets/**/*.glsl', {
			base: './src/snippets/'
		})
		.pipe(plumber())
		.pipe(rename(function (path) {
			path.dirname = path.dirname.split('\\').join('/');
			path.dirname = path.dirname.split('src/snippets/').join('');
			path.extname = '';
		}))
		.pipe(concatutil('glsl.json', {
			process: function (source, filePath) {
				// console.log('filePath', filePath);
				var folders = filePath.replace('src/snippets/', '').split(path.sep);
				// console.log('folders', folders);
				var name = folders.join('.');
				var body = source.trim();
				// body = body.replace(/^(?:\s?)+(?:\t?)(.*)(\n?)/gm, '$1\n');
				var description = name;
				var r = /^\/\*(?:\s?)(.*)\*\//g.exec(body);
				if (r && r.length === 2) {
					description = r[1];
				}
				var item = {
					prefix: 'glsl.' + name,
					body: body,
					description: description,
				};
				item.body = body;
				return '\t"' + name + '":' + JSON.stringify(item, null, 2) + ",\n";
			}
		}))
		.pipe(concatutil('glsl.json', {
			process: function (source, filePath) {
				source = source.replace(new RegExp(',\n' + '$'), '\n');
				return "{\n" + source + "\n}";
			}
		}))
		.pipe(gulp.dest('./snippets/')); // save .json
});
gulp.task('bundle', ['bundle:css', 'bundle:js', 'bundle:partials', 'bundle:snippets']);

// WEBSERVER
gulp.task('webserver', function () {
	return gulp.src('./docs/')
		.pipe(webserver({
			port: 6001,
			fallback: 'index.html',
			open: true,
			livereload: false,
			directoryListing: false,
		}));
});

// WATCH
gulp.task('watch', function (done) {
	function log(e) {
		console.log(e.type, e.path);
	}
	gulp.watch('./src/**/*.scss', ['compile:sass']).on('change', log);
	/*
	getCompilers('.scss').forEach(function(compiler) {
	    gulp.watch(compiler.inputFile, ['compile:sass']).on('change', log);
	});
	*/
	getBundles('.css').forEach(function (bundle) {
		gulp.watch(bundle.inputFiles, ['bundle:css']).on('change', log);
	});
	getBundles('.js').forEach(function (bundle) {
		gulp.watch(bundle.inputFiles, ['bundle:js']).on('change', log);
	});
	gulp.watch('./partials/**/*.html', ['bundle:partials']).on('change', log);
	gulp.watch('./src/snippets/**/*.glsl', ['bundle:snippets']).on('change', log);
	gulp.watch('./compilerconfig.json', ['compile', 'bundle']).on('change', log);
	gulp.watch('./bundleconfig.json', ['bundle']).on('change', log);
	done();
});

gulp.task('default', ['compile', 'bundle', 'webserver', 'watch']);

gulp.task('start', ['compile', 'bundle', 'watch']);

// UTILS
function getCompilers(ext) {
	var data = getJson('./compilerconfig.json');
	return data.filter(function (compile) {
		return new RegExp(`${ext}$`).test(compile.inputFile);
	});
}

function getBundles(ext) {
	var data = getJson('./bundleconfig.json');
	return data.filter(function (bundle) {
		return new RegExp(`${ext}$`).test(bundle.outputFileName);
	});
}

function stripBom(text) {
	text = text.toString();
	if (text.charCodeAt(0) === 0xFEFF) {
		text = text.slice(1);
	}
	return text;
}

function getJson(path) {
	var text = fs.readFileSync(path, 'utf8');
	// console.log('getJson', path, text);
	return JSON.parse(stripBom(text));
}