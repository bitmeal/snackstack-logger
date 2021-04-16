import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify/lib/framework';
import SnackStackLogger from 'snackstack-logger-vuetify-vuex/dist/snackstack-logger-vuetify-vuex.umd';
import '@mdi/font/css/materialdesignicons.css'

// setup vuetify
Vue.use(Vuetify);
const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
});

// setup vuex
Vue.use(Vuex);
const store = new Vuex.Store({});

// setup logger (snackstack); injected in all modules as log
Vue.use(SnackStackLogger, 'log');


// mount app
new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
