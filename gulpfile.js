/* jshint esversion: 6 */

const fs = require('fs'),
	path = require('path'),
	autoprefixer = require('gulp-autoprefixer'),
	browserify = require('browserify'),
	concat = require('gulp-concat'),
	concatutil = require('gulp-concat-util'),
	cssmin = require('gulp-cssmin'),
	filter = require('gulp-filter'),
	gulpif = require('gulp-if'),
	html2js = require('gulp-html2js'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	scss = require('gulp-sass'),
	terser = require('gulp-terser'),
	tfs = require('tfs'),
	through2 = require('through2'),
	tsify = require('tsify'),
	webserver = require('gulp-webserver'),
	yargs = require('yargs');

const { src, dest, watch, parallel, series } = require('gulp');

const argv = yargs.argv;
const target = argv.target || 'browser';

let configuration = getJson('./gulpfile.config.json');

const compileTask = parallel(compileScss, compileJs, compileTs, compileSnippets); // compilePartials, compileSnippets
const bundleTask = parallel(bundleCss, bundleJs);

exports.compile = compileTask;
exports.bundle = bundleTask;
exports.build = series(compileTask, bundleTask);
exports.watch = watchTask;
exports.serve = serveTask;
exports.start = series(compileTask, bundleTask, watchTask);
exports.default = series(compileTask, bundleTask, serveTask, watchTask);

// COMPILERS
function compileScss(done) {
	const items = getCompilers('.scss');
	const tasks = items.map(item => function itemTask() {
		return src(item.input, { base: '.', allowEmpty: true, sourcemaps: true })
			.pipe(plumber())
			.pipe(scss({
				includePaths: ['./node_modules/', __dirname + '/node_modules', 'node_modules'],
			}).on('compile:scss.error', (error) => {
				logger.error('compile:scss', error);
			}))
			.pipe(autoprefixer())
			.pipe(rename(item.output))
			.pipe(tfsCheckout())
			.pipe(dest('.', item.minify ? null : { sourcemaps: '.' }))
			.pipe(filter('**/*.css'))
			.on('end', () => logger.log('compile', item.output))
			.pipe(gulpif(item.minify, cssmin()))
			.pipe(gulpif(item.minify, rename({ extname: '.min.css' })))
			.pipe(tfsCheckout(!item.minify))
			.pipe(gulpif(item.minify, dest('.', { sourcemaps: '.' })))
			.pipe(filter('**/*.css'));
	});
	return tasks.length ? parallel(...tasks)(done) : done();
}

function compileJs(done) {
	const items = getCompilers('.js');
	const tasks = items.map(item => function itemTask(done) {
		return src(item.input, { base: '.', allowEmpty: true, sourcemaps: true })
			.pipe(plumber())
			.pipe(through2.obj((file, enc, next) => {
					browserify(file.path)
						.transform('babelify', {
							global: true,
							presets: [
							["@babel/preset-env", {
									targets: {
										chrome: '58',
										ie: '11'
									},
							}]
						],
							extensions: ['.js']
						})
						.bundle((error, response) => {
							if (error) {
								logger.error('compile:js', error);
							} else {
								logger.log('browserify.bundle.success', item.output);
								file.contents = response;
								next(null, file);
							}
						})
						.on('error', (error) => {
							logger.error('compile:js', error.toString());
						});
				}
				/*, (done) => {
					logger.log('through2.done', error);
				}*/
			))
			.pipe(rename(item.output))
			.pipe(tfsCheckout())
			.pipe(dest('.', item.minify ? null : { sourcemaps: '.' }))
			.pipe(filter('**/*.js'))
			.on('end', () => logger.log('compile', item.output))
			.pipe(gulpif(item.minify, terser()))
			.pipe(gulpif(item.minify, rename({ extname: '.min.js' })))
			.pipe(tfsCheckout(!item.minify))
			.pipe(gulpif(item.minify, dest('.', { sourcemaps: '.' })))
			.pipe(filter('**/*.js'));
	});
	return tasks.length ? parallel(...tasks)(done) : done();
}

function compileTs(done) {
	let options = {
		global: true,
		plugins: ['@babel/plugin-transform-flow-strip-types'],
		presets: [
			["@babel/preset-env", {
				targets: {
					chrome: '58',
					ie: '11'
				},
			}],
		],
		extensions: ['.ts']
	};
	const items = getCompilers('.ts');
	const tasks = items.map(item => function itemTask(done) {
		logger.log(item.input);
		return src(item.input, { base: '.', allowEmpty: true, sourcemaps: true })
			.pipe(plumber())
			.pipe(through2.obj((file, enc, next) => {
				browserify(file.path)
					.plugin(tsify)
					.transform('babelify', options)
					.bundle((error, response) => {
						if (error) {
							logger.error('compile:ts', error);
						} else {
							file.contents = response;
							next(null, file);
						}
					})
					.on('error', (error) => {
						logger.error('compile:ts', error.toString());
					});
			}, (done) => {
				done();
			}))
			.pipe(rename(item.output))
			.pipe(tfsCheckout())
			.pipe(dest('.', item.minify ? null : { sourcemaps: '.' }))
			.pipe(filter('**/*.js'))
			.on('end', () => logger.log('compile', item.output))
			.pipe(gulpif(item.minify, terser()))
			.pipe(gulpif(item.minify, rename({ extname: '.min.js' })))
			.pipe(tfsCheckout(!item.minify))
			.pipe(gulpif(item.minify, dest('.', { sourcemaps: '.' })))
			.pipe(filter('**/*.js'));
	});
	return tasks.length ? parallel(...tasks)(done) : done();
}

function compilePartials() {
	return src('./src/artisan/**/*.html', { base: './src/artisan/' })
		.pipe(plumber())
		.pipe(rename((path) => {
			path.dirname = path.dirname.split('\\').join('/');
			path.dirname = path.dirname.split('artisan/').join('');
			// path.basename += "-partial";
			path.extname = '';
			// logger.log('path', path);
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
		.pipe(dest('./docs/js/'))
		.pipe(src('.', { sourcemaps: true }))
		.pipe(terser())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(dest('./docs/js/', { sourcemaps: true }));
}

function compileSnippets() {
	return src('./src/snippets/**/*.glsl', {
			base: './src/snippets/'
		})
		.pipe(plumber())
		.pipe(rename((path) => {
			path.dirname = path.dirname.split('\\').join('/');
			path.dirname = path.dirname.split('src/snippets/').join('');
			path.extname = '';
		}))
		.pipe(concatutil('glsl.json', {
			process: (source, filePath) => {
				const folders = filePath.replace('src/snippets/', '').split(path.sep);
				const name = folders.join('.');
				const body = source.trim();
				const r = /^\/\*(?:\s?)(.*)\*\//g.exec(body);
				let description = name;
				if (r && r.length === 2) {
					description = r[1];
				}
				const item = {
					prefix: 'glsl.' + name,
					body: body,
					description: description,
				};
				item.body = body;
				return '\t"' + name + '":' + JSON.stringify(item, null, 2) + ",\n";
			}
		}))
		.pipe(concatutil('glsl.json', {
			process: (source, filePath) => {
				source = source.replace(new RegExp(',\n' + '$'), '\n');
				return "{\n" + source + "\n}";
			}
		}))
		.pipe(dest('./snippets/'));
}

// BUNDLERS
function bundleCss(done) {
	const items = getBundles('.css');
	const tasks = items.map(item => function itemTask(done) {
		return doCssBundle(item);
	});
	return tasks.length ? parallel(...tasks)(done) : done();
}

function bundleJs(done) {
	const items = getBundles('.js');
	const tasks = items.map(item => function itemTask(done) {
		return doJsBundle(item);
	});
	return tasks.length ? parallel(...tasks)(done) : done();
}

function doCssBundle(item) {
	const skip = item.input.length === 1 && item.input[0] === item.output;
	return src(item.input, { base: '.', allowEmpty: true, sourcemaps: true })
		.pipe(plumber())
		.pipe(gulpif(!skip, concat(item.output)))
		.pipe(tfsCheckout(skip))
		.pipe(gulpif(!skip, dest('.')))
		.on('end', () => logger.log('bundle', item.output))
		.pipe(gulpif(item.minify, cssmin()))
		.pipe(gulpif(item.minify, rename({ extname: '.min.css' })))
		.pipe(tfsCheckout(!item.minify))
		.pipe(gulpif(item.minify, dest('.', { sourcemaps: '.' })))
		.pipe(filter('**/*.css'));
}

function doJsBundle(item) {
	const skip = item.input.length === 1 && item.input[0] === item.output;
	return src(item.input, { base: '.', allowEmpty: true, sourcemaps: true })
		.pipe(plumber())
		.pipe(gulpif(!skip, concat(item.output)))
		.pipe(tfsCheckout(skip))
		.pipe(gulpif(!skip, dest('.')))
		.on('end', () => logger.log('bundle', item.output))
		.pipe(gulpif(item.minify, terser()))
		.pipe(gulpif(item.minify, rename({ extname: '.min.js' })))
		.pipe(tfsCheckout(!item.minify))
		.pipe(gulpif(item.minify, dest('.', { sourcemaps: '.' })))
		.pipe(filter('**/*.js'));
}

// TFS
function tfsCheckout(skip) {
	return gulpif(!skip && configuration.options.tfs,
		through2.obj((file, enc, callback) => {
			// console.log('tfsCheckout', file.path);
			if (fs.existsSync(file.path)) {
				tfs('checkout', [file.path], null, (responseError, response) => {
					callback(null, file);
					if (responseError) {
						console.error(responseError.error);
						return;
					}
					logger.log('checkout', file.path, response.message);
				});
			} else {
				callback(null, file);
			}
		})
	);
}

// WATCH
let watchers = [];

function watchTask(done) {
	while (watchers.length) {
		const w = watchers.shift();
		w.close();
	}
	// watch compile files
	// scss
	const scssWatch = watch(getCompilersGlobs('.scss'), compileScss).on('change', logWatch);
	// js
	const jsWatch = watch(getCompilersGlobs('.js'), compileJs).on('change', logWatch);
	// ts
	const tsWatch = watch(getCompilersGlobs('.ts'), compileTs).on('change', logWatch);

	// watch bundle files
	// css
	const cssWatches = getBundles('.css').map((item) => {
		return watch(item.input, function bundleCss(done) {
			return doCssBundle(item);
		}).on('change', logWatch);
	});
	// js
	const jsWatches = getBundles('.js').map((item) => {
		return watch(item.input, function bundleJs(done) {
			return doJsBundle(item);
		}).on('change', logWatch);
	});

	// CONFIG
	const configWatch = watch('./gulpfile.config.json', function config(done) {
		configuration = getJson('./gulpfile.config.json');
		return series(compileTask, bundleTask, watchTask)(done);
	}).on('change', logWatch);

	watchers = [].concat([scssWatch, jsWatch, tsWatch], cssWatches, jsWatches, [configWatch]);
	// watch('./src/artisan/**/*.html', ['compile:partials']).on('change', logWatch);
	// watch('./src/snippets/**/*.glsl', ['compile:snippets']).on('change', logWatch);
	done();
}

function watchAll() {
	watch(['**/*.*', '!node_modules/**/*.*'], function watch(done) {
		done();
	}).on('change', (path) => {
		logWatch(...arguments);
	});
}

// SERVE
function serveTask() {
	const options = Object.assign({
		src: './docs',
		port: 6001,
		fallback: 'index.html',
		open: true,
		livereload: true,
		directoryListing: false,
	}, configuration.options.server || {});
	return src(options.src)
		.pipe(webserver(options));
}

// UTILS
function getCompilers(ext) {
	const options = configuration.targets[target];
	if (options) {
		return options.compile.filter((item) => {
			return new RegExp(`${ext}$`).test(item.input);
		});
	} else {
		return [];
	}
}

function getBundles(ext) {
	const options = configuration.targets[target];
	if (options) {
		return options.bundle.filter((item) => {
			return new RegExp(`${ext}$`).test(item.output);
		});
	} else {
		return [];
	}
}

function getCompilersGlobs(ext) {
	return getCompilers(ext).map(x => {
		return x.input.replace(/\/[^\/]*$/, '/**/*' + ext);
	});
}

function getJson(path) {
	if (fs.existsSync(path)) {
		const text = fs.readFileSync(path, 'utf8');
		// logger.log('getJson', path, text);
		return JSON.parse(stripBom(text));
	} else {
		return null;
	}
}

function stripBom(text) {
	text = text.toString();
	if (text.charCodeAt(0) === 0xFEFF) {
		text = text.slice(1);
	}
	return text;
}

// LOGGER
const palette = {
	Reset: '\x1b[0m',
	Bright: '\x1b[1m',
	Dim: '\x1b[2m',
	Underscore: '\x1b[4m',
	Blink: '\x1b[5m',
	Reverse: '\x1b[7m',
	Hidden: '\x1b[8m',
	//
	FgBlack: '\x1b[30m',
	FgRed: '\x1b[31m',
	FgGreen: '\x1b[32m',
	FgYellow: '\x1b[33m',
	FgBlue: '\x1b[34m',
	FgMagenta: '\x1b[35m',
	FgCyan: '\x1b[36m',
	FgWhite: '\x1b[37m',
	//
	BgBlack: '\x1b[40m',
	BgRed: '\x1b[41m',
	BgGreen: '\x1b[42m',
	BgYellow: '\x1b[43m',
	BgBlue: '\x1b[44m',
	BgMagenta: '\x1b[45m',
	BgCyan: '\x1b[46m',
	BgWhite: '\x1b[47m',
};

const colors = [palette.FgWhite, palette.FgCyan, palette.FgGreen, palette.FgYellow, palette.FgMagenta, palette.FgBlue];

function padStart(text, count = 2, char = '0') {
	text = text.toString();
	while (text.length < count) {
		text = char + text;
	}
	return text;
}

class logger {
	static log() {
		const date = new Date();
		const hh = padStart(date.getHours());
		const mm = padStart(date.getMinutes());
		const ss = padStart(date.getSeconds());
		let a = Array.from(arguments);
		a = [].concat.apply([], (a.map((x, i) => [colors[i % colors.length], x])));
		a.unshift(`${palette.FgWhite}[${palette.Dim}${hh}:${mm}:${ss}${palette.Reset}${palette.FgWhite}]`);
		a.push(palette.Reset);
		console.log.apply(this, a);
	}
	static error() {
		const date = new Date();
		const hh = padStart(date.getHours());
		const mm = padStart(date.getMinutes());
		const ss = padStart(date.getSeconds());
		let a = Array.from(arguments);
		a = [].concat.apply([], (a.map((x, i) => [palette.Red, x])));
		a.unshift(`${palette.FgWhite}[${palette.Dim}${hh}:${mm}:${ss}${palette.Reset}${palette.FgWhite}]`);
		a.push(palette.Reset);
		console.log.apply(this, a);
	}
}

function logWatch(path, stats) {
	logger.log('changed', path);
}
