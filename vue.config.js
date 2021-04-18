const path = require('path');

const ext_factory = (root, pkg) => {
  return {
    root: root,
    commonjs: pkg,
    commonjs2: pkg,
    amd: pkg
  };
};

module.exports = (() => {
  // building library target
  if (process.env.VUE_BUILD_TARGET === 'lib') {
    return {
      outputDir: path.join(__dirname, './bundle'),
      chainWebpack: config => {
        // do not bundle vuetify, vuex and vue (should be excluded per default)
        // we are not transpiling vuetify dependencies as well
        config
          .externals({
            vuetify: ext_factory('Vuetify', 'vuetify'),
            vuex: ext_factory('Vuex', 'vuex'),
            vue: ext_factory('Vue', 'vue')
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
