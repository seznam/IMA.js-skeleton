var gulp = require('gulp');
var traceur = require('gulp-traceur');
var runSequence = require('run-sequence');
var karma = require('gulp-karma');

var coreDependency = require('./imajs/build.js');
var IMAGulpTasks = require('./imajs/gulpTasks');

try {
	var appDependency = require('./app/build.js');
} catch(e) {
	var appDependency = {
		js: [],
		languages: [],
		less: [],
		bundle: {
			js: [],
			css: []
		}
	};
	console.log(e);
}

var files = {
	vendor: {
		name: {
			server: 'vendor.server.js',
			client: 'vendor.client.js'
		},
		tmp: './build/imajs/es5transformedVendor.js',
		src:[
			'./build/imajs/es5transformedVendor.js'
		],
		dest: {
			server: './build/imajs/',
			client: './build/static/js/'
		},
		watch: ['./imajs/client/core/vendor.js', './app/vendor.js']
	},
	app: {
		name: {
			server: 'app.server.js',
			client: 'app.client.js'
		},
		src: coreDependency.js.concat(appDependency.js, coreDependency.mainjs),
		dest: {
			server: './build/imajs/',
			client: './build/static/js/'
		},
		watch:['./imajs/client/**/*.{js,jsx}', './imajs/client/main.js', '!./imajs/client/vendor.js', './app/**/*.{js,jsx}', '!./app/*.js']
	},
	server: {
		src: './server/',
		dest: './build/',
		watch: ['./server/*.js', './server/**/*.js', './app/environment.js', './imajs/server/*.js']
	},
	less: {
		cwd: '/',
		base: './app/assets/less/',
		name: './app/assets/less/app.less',
		src: appDependency.less,
		dest: './build/static/css/',
		watch: ['./app/**/*.less', '!./app/assets/bower/']
	},
	locale: {
		base: './app/locale/',
		src: appDependency.languages,
		dest:{
			server: './build/imajs/locale/',
			client: './build/static/js/locale/'
		},
		watch: ['./app/locale/**/*.json']
	},
	shim : {
		name: 'shim.js',
		src: [
			'./node_modules/es6-shim/es6-shim.js',
			traceur.RUNTIME_PATH
		],
		dest: {
			client: './build/static/js/',
			server: './build/imajs/'
		}
	},
	polyfill: {
		name: 'polyfill.js',
		src: [
			'./node_modules/custom-event-polyfill/custom-event-polyfill.js'
		],
		dest: {
			client: './build/static/js/'
		}
	},
	bundle: {
		js: {
			name: 'app.bundle.min.js',
			src: appDependency.bundle.js,
			dest: './build/static/js/'
		},
		css: {
			name: 'app.bundle.min.css',
			src: appDependency.bundle.css,
			dest: './build/static/css/'
		}
	},
	test: {
		src: [
			'./imajs/client/test.js',
			'./build/static/js/polyfill.js',
			'./build/static/js/shim.js',
			'./build/static/js/vendor.client.js',
			'./build/static/js/locale/cs.js',
			'./build/static/js/app.client.js',
			'./app/test/**/*.js',
			'./app/test/*.js',
			'./imajs/client/test/**/*.js',
			'./imajs/client/test/*.js'
		]
	}
};

IMAGulpTasks(files);

gulp.task('dev', function(callback) {
	return runSequence(
		['copy:appStatic', 'copy:imajsServer', 'copy:environment', 'shim', 'polyfill'],
		['Es6ToEs5:client', 'Es6ToEs5:server', 'Es6ToEs5:vendor'],
		['vendor:client', 'vendor:server', 'build:less', 'doc', 'locale'],
		'vendor:clean',
		['server'],
		['devTest', 'watch'],
		callback
	);
});

gulp
	.option('build', '-e, --env', 'Build environment')
	.task('build', function(callback) {

		if (this.flags.env === 'prod') {
			uglifyCompression.global_defs.$Debug = false;
		}
		return runSequence(
			['copy:appStatic', 'copy:imajsServer', 'copy:environment', 'shim', 'polyfill'], //copy folder public, concat shim
			['Es6ToEs5:client', 'Es6ToEs5:server', 'Es6ToEs5:vendor'], // convert app and vendor script
			['vendor:client', 'vendor:server', 'build:less', 'doc', 'locale'], // adjust vendors, compile less, create doc,
			['bundle:js:app', 'bundle:js:server', 'bundle:css'],
			['vendor:clean', 'bundle:clean'],// clean vendor
			callback
		);
});

gulp.task('test', function() {
	// Be sure to return the stream
	return gulp.src(files.test.src)
		.pipe(karma({
			configFile: './karma.conf.js',
			action: 'run'
		}))
		.on('error', function(err) {
			// Make sure failed tests cause gulp to exit non-zero
			throw err;
		});
});

gulp.task('devTest', function() {

	return gulp.src(files.test.src)
		.pipe(karma({
			configFile: './karma.conf.js',
			action: 'watch'
		}))
		.on('error', function(err) {
			throw err;
		});
});
