// https://github.com/sindresorhus/grunt-sass

module.exports = {
  options: {
      sourceMap: true
  },
  dist: {
      files: {
          'assets/css/styles.css': 'assets/sass/styles.scss'
      }
  }
}
