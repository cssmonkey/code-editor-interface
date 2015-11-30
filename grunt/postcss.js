// https://github.com/nDmitry/grunt-postcss

module.exports = {
	options: {
		map: true,
		processors: [
		  require('autoprefixer-core')({ browsers: ['last 2 version'] })
		]
	},
	dist: {
		files: {
			'assets/css/styles.css': 'assets/css/styles.css'
		}
	}
}
