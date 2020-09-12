import Vue from 'vue'
import Router from 'vue-router'
import Test from '../components/test/test.vue'
import Login from '../components/login/login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'test',
      component: Test
    },
    {
      path : '/login',
      name : 'login',
      component : Login
    }
  ]
})
