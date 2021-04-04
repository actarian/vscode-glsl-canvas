const {
	build,
	buildAndWatch,
	buildWatchAndServe,
	buildCss,
	buildCssAndWatch,
	buildJs,
	buildJsAndWatch,
	bundle,
	compile,
	serve,
	watch
} = require('gulpfile-config');

exports.compile = compile;
exports.bundle = bundle;
exports.serve = serve;
exports.watch = watch;
exports.build = build;
exports.start = buildAndWatch;
exports.buildCss = buildCss;
exports.startCss = buildCssAndWatch;
exports.buildJs = buildJs;
exports.startJs = buildJsAndWatch;

exports.default = buildWatchAndServe;
