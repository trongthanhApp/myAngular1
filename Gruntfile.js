'use strict';

module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.loadNpmTasks('grunt-karma');

	grunt.loadNpmTasks('grunt-html2js');

	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.loadNpmTasks('grunt-string-replace');

	function expandSnapshot(ver, date) {
		return ver.replace('SNAPSHOT', date);
	}

	function cssLink(what) {
		var app = what === 'app';
		return function (match, p1, offset, string) {
			return '\t\t<link rel="stylesheet" type="text/css" id="include.' + (app ? 'app' : 'vendor') + '.css" ' +
				'href="build/' + (app ? 'app' : 'vendor/vendor') + '-' + expandSnapshot( grunt.config.data.pkg.version, grunt.config.data.now) + '.min.css"/>';
		};
	}

	function jsLink(what) {
		var app = what === 'app';
		return function (match, p1, offset, string) {
			return '\t\t<script type="text/javascript" id="include.' + (app ? 'app' : 'vendor') + '.js" ' +
				'src="build/' + (app ? 'app' : 'vendor/vendor') + '-' + expandSnapshot(grunt.config.data.pkg.version, grunt.config.data.now) + '.min.js"></script>';
		};
	}

	var now = grunt.template.date('yyyymmddHHMM');
	var pkg= grunt.file.readJSON('package.json');
	grunt.initConfig({

		pkg: pkg,

		now: now,

		dirs: {
			src: 'src/main/webapp/src/',
			test: 'src/main/webapp/test',
			build: 'src/main/webapp/build',
			bower_components: 'src/main/webapp/bower_components/',
			unmanaged_components: 'src/main/webapp/unmanaged/'
		},

		src: {
			js: ['src/webapp/src/**/*.js'],
			templates: ['src/webapp/views/**/*.html']
		},

		clean: {
			build: {
				src: [ '<%=dirs.build%>']
			},
			bower: { // nettoyer tous les packages gérés par bower
				src: [ '<%=dirs.bower_components%>/*', '!<%=dirs.bower_components%>/readme.txt']
			}
		},

		"bower-install-simple": {
			options: {
				color: true,
				production: false,
				directory: "<%=dirs.bower_components%>"
			}
		},

		html2js: {
			options: {
				// custom options, see below
				base: 'src/main/webapp/',
				module: 'appTemplates'
			},
			main: {
				src: ['<%= dirs.src %>/**/*.html'],
				dest: '<%= dirs.build %>/templates.js'
			}
		},

		concat: {
			app: {
				src: [
					'<%= dirs.build %>/templates.js',
					'<%= dirs.src %>/ui-commons.js',
					'<%= dirs.src %>/dashboard/dashboard.js',
					'<%= dirs.src %>/*/**/*.js'
				],
				dest: '<%= dirs.build %>/app.js'
			},
			vendor: {
				src: [
					'<%= dirs.bower_components %>/lodash/dist/lodash.min.js',
					'<%= dirs.bower_components %>/bootstrap/js/bootstrap.min.js',
					'<%= dirs.bower_components %>/angular/angular.min.js',
					'<%= dirs.bower_components %>/angular-route/angular-route.min.js',
					'<%= dirs.bower_components %>/angular-animate/angular-animate.min.js',
					'<%= dirs.bower_components %>/momentjs/min/moment.min.js',
					'<%= dirs.bower_components %>/AngularJS-Toaster/toaster.js',
					'<%= dirs.unmanaged_components %>/eonasdan-datepicker/js/sma-bootstrap-datetimepicker.js',
					'<%= dirs.unmanaged_components %>/eonasdan-datepicker/js/bootstrap-datetimepicker.fr.js',
					'<%= dirs.unmanaged_components %>/davidstutz-bootstrap-multiselect/js/bootstrap-multiselect.js'
				],
				dest: '<%= dirs.build %>/vendor/vendor-' + expandSnapshot(pkg.version, now) + '.min.js'
			}
		},

		ngmin: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%=dirs.build%>',
						src: 'app.js',
						dest: '<%=dirs.build%>'
					}
				]
			}
		},

		uglify: {
			options: {
				banner: '/* <%=pkg.name%>:<%=pkg.version%> (<%=process.env.USERNAME%>@<%=process.env.COMPUTERNAME%>/<%=grunt.template.today("isoDateTime")%>) */\n',
				sourceMap: '<%=dirs.build%>/source-map.js'
			},
			build: {
				src: ['<%=dirs.build%>/app.js'],
				dest: '<%=dirs.build%>/<%= pkg.name %>-' + expandSnapshot(pkg.version, now) + '.min.js'

			}
		},

		cssmin: {
			sl: {
				src: [ '<%=dirs.src%>/**/*.css'],
				dest: '<%=dirs.build%>/app-' + expandSnapshot(pkg.version, now) + '.min.css'
			},
			vendor: {
				src: [
					'<%=dirs.bower_components%>/bootstrap/css/bootstrap.css',
					'<%=dirs.bower_components%>/Font-Awesome/css/font-awesome.min.css',
					'<%=dirs.bower_components%>/AngularJS-Toaster/toaster.css',
					'<%=dirs.unmanaged_components%>/eonasdan-datepicker/css/bootstrap-datetimepicker.css',
					'<%=dirs.unmanaged_components%>/davidstutz-bootstrap-multiselect/css/bootstrap-multiselect.css'
				],
				dest: '<%=dirs.build%>/vendor/vendor-' + expandSnapshot(pkg.version, now) + '.min.css'
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			files: {
				src: ['Gruntfile.js', '<%= dirs.src %>/**/*.js']
			}
		},

		csslint: {
			options: { ids: false, 'adjoining-classes': false, 'box-model': false, 'important': false, 'qualified-headings': false },
			files: {
				src: ['<%= dirs.src %>/**/*.css']
			}
		},

		copy: {
			assets: {
				files: [
					{
						expand: true,
						cwd: '<%= dirs.src %>',
						src: 'assets/**',
						dest: '<%=dirs.build%>'
					}
				]
			},
			fontsBootstrap: {
				files: [
					{
						expand: true,
						cwd: '<%= dirs.bower_components %>/bootstrap/',
						src: 'fonts/**',
						dest: '<%=dirs.build%>'
					}
				]
			},
			fontsAwesome: {
				files: [
					{
						expand: true,
						cwd: '<%= dirs.bower_components %>/Font-Awesome/',
						src: 'fonts/**',
						dest: '<%=dirs.build%>'
					}
				]
			}
		},

		'string-replace': {
			jsp: {
				files: {
					'src/main/webapp/index.jsp': ['src/main/webapp/index.jsp']
				},
				options: {
					replacements: [
						{
							pattern: /.*id="include.vendor.css".*/,
							replacement: cssLink('vendor')

						},
						{
							pattern: /.*id="include.app.css".*/,
							replacement: cssLink('app')

						},
						{
							pattern: /.*id="include.vendor.js".*/,
							replacement: jsLink('vendor')

						},
						{
							pattern: /.*id="include.app.js".*/,
							replacement: jsLink('app')

						}
					]
				}}
		},

		connect: {
			options: {
				port: 8000,
				hostname: '*',
				base: './src/main/webapp'
			},
			server: {
				options: {
					keepalive: true
				}
			},
			testserver: {}
		},

		karma: {
			unit: {
				configFile: '<%= dirs.src %>/../test/unit/config.js'
			}
		},

		protractor: {
			options: {
				configFile: "<%= dirs.test %>/e2e/config.js",
				args: { } // Arguments passed to the command
			},
			e2e: {
				options: {
					args: { } // Target-specific arguments
				}
			}
		}

	});

	grunt.registerTask('generate-test-index', 'Génération de test-index.html (pour les tests e2e)', function () {
		var generateIdx = require('./generate-test-index');
		generateIdx({ build: false, replace: {'services/services.js': 'services/services-mocks.js'} });
	});

	grunt.registerTask('default', ['build']);
	grunt.registerTask('build', 'Perform a normal build', ['clean', 'bower-install-simple', 'jshint', 'csslint', 'karma', 'html2js', 'concat', 'ngmin', 'uglify', 'cssmin', 'copy', 'string-replace']);
	//grunt.registerTask('build', 'Perform a normal build', ['clean','bower-install-simple','jshint','csslint','concat','ngmin','uglify','cssmin','test']);

	grunt.registerTask('test', ['generate-test-index', 'connect:testserver', 'protractor:e2e']);

	// lancer un serveur local pour les tests avec les mocks (avec génération de test-index.html)
	grunt.registerTask('server', ['generate-test-index', 'connect:server']);

	// réinitialiser les libs js (quand on change de branche il faut executer cette task)
	grunt.registerTask('bower', ['clean:bower', 'bower-install-simple']);

};
