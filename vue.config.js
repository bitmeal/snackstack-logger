const path = require('path');

module.exports = (() => {
  // building library target
  if (process.env.VUE_BUILD_TARGET === 'lib') {
    return {
      chainWebpack: config => {
        // do not bundle vuetify (necessary?)
        // we are not transpiling vuetify dependencies as well
        config
          .externals({
            vuetify: 'vuetify'
          })
      }

    }
  }
  // building dev app
  else {
    return {
      // transpile vuetify
      transpileDependencies: [
        'vuetify',
      ],
      // output bundle to dev/ dir
      outputDir: path.join(__dirname, './dev/bundle'),
      // build bundle form dev/ dir and dev/main.js as entry-point
      chainWebpack: config => {
        config
          .entry('app')
          .clear()
          .add('./dev/main.js')
          .end();
        config.resolve.alias
          .set("@", path.join(__dirname, './dev'));

      }
    }
  }
})();
