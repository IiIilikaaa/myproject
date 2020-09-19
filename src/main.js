// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//引入myaxios插件
import myaxios from './assets/js/myaxios'
// 引入index.css
import './css/index.css'
//引入element 树状插件
//common 
const ElTreeGrid = require('element-tree-grid');
Vue.component(ElTreeGrid.name,ElTreeGrid);

// 引入element-ui
import ElementUI from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'



Vue.use(ElementUI)

//使用axios插件
Vue.use(myaxios)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
