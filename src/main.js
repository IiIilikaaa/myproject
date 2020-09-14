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

//给axios设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
//设置统一请求头
//有bug,由于下面方法在设置axios 被初始化时只会执行一次, 所有一旦token设置 不会改变
// axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('token')

//解决方法 在拦截器中设置
axios.interceptors.request.use(function (config) {
  console.log(config.url);
  //在登录页时(/login)时 不需要设置请求头
  if (config.url !== 'login'){
  config.headers.Authorization = window.localStorage.getItem('token')
}
return config;
})
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
