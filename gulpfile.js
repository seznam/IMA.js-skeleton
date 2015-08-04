var coreDependency = require('./imajs/build.js');

var coreTasks = require('./imajs/gulp-tasks');

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


coreTasks(files);
