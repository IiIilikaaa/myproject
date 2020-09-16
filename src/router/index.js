import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'
import Users from '@/components/children/users/users'
import Rights from '@/components/children/rights/rights.vue'
import Roles from '@/components/children/roles/roles'

Vue.use(Router)

const routes =  [
  { path: '/login', name: 'login', component: Login },
  { path: '/home', name: 'home', component: Home ,
  children:[
    {path:'/users',name:'users',component:Users},
    {path:'/rights',name:'rights',component:Rights},
    {path:'/roles',name:'roles',component:Roles},
  ]
},
  //重定向
  { path: '/', redirect: '/home' }
]

const router = new Router({
  routes : routes
})
 

//全局前置导航守卫 (路由守卫)
// 当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 等待中。
router.beforeEach((to, from, next) => {
  // to: 目标路由
  // from: 发送请求的路由
  // next: (函数数据)是否继续执行后续代码
  // console.log(to);
  // console.log(from);
  if (to.name !== 'login') {
    let token = window.localStorage.getItem('token')
    if (!token) {
      // $message({
      //   showClose: true,
      //   message: "请先登录哦!",
      //   type: "warning",
      // });
      // alert('请先登录');
      // next({ path: '/login' })
      router.push('/login')
    }
    else {
      next()
    }
  } else {
    next()
  }
})



export default router
