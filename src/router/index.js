import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'
import Users from '@/components/children/users'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/login', name: 'login', component: Login },
    { path: '/home', name: 'home', component: Home ,
    children:[
      {path:'/users',name:'users',component:Users}
    ]
  },
    //重定向
    { path: '/', redirect: '/home' }
  ]
})
