import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/login', name: 'login', component: Login },
    { path: '/home', name: 'home', component: Home },
    //重定向
    { path: '/', redirect: '/home' }
  ]
})
