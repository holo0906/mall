import Vue from 'vue'
import VueRouter from 'vue-router'
/* import Index from '@/views/Index'
//不需要写到Login/index，会自动默认将Login文件夹下的index导入
import Login from '@/views/Login'
import Home from '@/views/Home'
import Goods from '@/views/Goods'
import Thanks from '@/views/Thanks'
import GoodsDetail from "@/views/GoodsDetail"
import User from "@/views/User" */

//异步组件加载
const Index = () => import('@/views/Index')
const Login = () => import('@/views/Login')
const Home = () => import('@/views/Home')
const Goods = () => import('@/views/Goods')
const Thanks = () => import('@/views/Thanks')
const GoodsDetail = () => import('@/views/GoodsDetail')
const User = () => import('@/views/User')

//解决路由地址跳转相同时，控制台报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  //配置路由
  //1. home
  {
    path: '/',
    //重定向到/home
    redirect: '/home',
    name: 'home',
    component: Index,
    //首页的其他内容
    children: [{
      path: 'home',
      component: Home
    }, {
      path: 'goods',
      component: Goods
    }, {
      path: 'thanks',
      component: Thanks
    }, {
      path: 'goodsDetail',
      name: 'goodsDetail',
      component: GoodsDetail
    }]
  },
  //2. login
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  //3. user
  {
    path: '/user',
    name: 'user',
    component: User,
    //权限
    meta: {
      auth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router