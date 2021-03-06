import Vue from 'vue'
import Router from 'vue-router'
// import Login from '../components/login/login.vue'
// import Home from '../components/home/home.vue'
// import Users from '@/components/children/users/users'
// import Rights from '@/components/children/rights/rights.vue'
// import Roles from '@/components/children/roles/roles'
// import Categories from '@/components/children/categories/categories'
// import Goods from '@/components/children/goods/goods'
// import Goodsadd from '@/components/children/goodsAdd/goodsadd'
// import Orders from '@/components/children/orders/orders.vue'
// import Reports from '@/components/children/reports/reports.vue'

//首屏优化 
//路由懒加载
const Login = () => import('../components/login/login.vue')
const Home = () => import('../components/home/home.vue')
const Users = () => import('@/components/children/users/users')
const Rights = () => import('@/components/children/rights/rights.vue')
const Roles = () => import('@/components/children/roles/roles')
const Categories = () => import('@/components/children/categories/categories')
const Goods = () => import('@/components/children/goods/goods')
const Goodsadd = () => import('@/components/children/goodsAdd/goodsadd')
const Orders = () => import('@/components/children/orders/orders.vue')
const Reports = () => import('@/components/children/reports/reports.vue')

Vue.use(Router)

const routes = [
  { path: '/login', name: 'login', component: Login },
  {
    path: '/home', name: 'home', component: Home,
    children: [
      { path: '/users', name: 'users', component: Users },
      { path: '/rights', name: 'rights', component: Rights },
      { path: '/roles', name: 'roles', component: Roles },
      { path: '/categories', name: 'categories', component: Categories },
      { path: '/goods', name: 'goods', component: Goods },
      { path: '/goods/add', name: 'goodsadd', component: Goodsadd },
      { path: '/orders', name: 'orders', component: Orders },
      { path: '/reports', name: 'reports', component: Reports }
    ]
  },
  //重定向
  { path: '/', redirect: '/home' }
]

const router = new Router({
  routes: routes
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
