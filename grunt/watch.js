// https://github.com/gruntjs/grunt-contrib-watch

module.exports = {
	js: {
		files: ['assets/js/**/**.js'],
		options: {
			livereload: true
		}
	},
	css: {
		files: ['assets/sass/**/**.scss'],
		options: {
			livereload: true
		},
		tasks: ['sass:dist']
	},
	html: {
		files: ['**/*.html'],
		options: {
			livereload: true,
		}
	},
};
