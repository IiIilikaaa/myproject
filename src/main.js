// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//引入axios
import axios from 'axios'
// 引入index.css
import './css/index.css'

// 引入element-ui
import ElementUI from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'

//挂载到vue原型中
Vue.prototype.$http = axios


Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
