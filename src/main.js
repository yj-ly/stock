// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible.js'
import '../static/css/reset.css'
import store from './store/store.js';
import $ from 'jquery'
// import VConsole from 'vconsole'
// const vConsole = new VConsole()

Vue.config.productionTip = false

/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

