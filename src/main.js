import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import {
  getStore
} from '@/utils/storage'

//使用 vue-lazyload
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)
//配置
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'static/images/dist/error.png',
  loading: 'static/images/dist/load.gif', //加载图
  attempt: 1
})

Vue.config.productionTip = false

//挂载axios到vue的原型，由于继承性，所有的组件都可以使用 this.$http
Vue.prototype.$http = axios;
//设置公共的 url ，所有的组件在请求的时候都会拼接
axios.defaults.baseURL = "http://localhost:3000";

//除了请求拦截器之外还有响应拦截器，响应回来之前需要做点什么
//设置请求拦截器，给每一个请求添加 token
//每一次发送请求时进行拦截，然后在每一个请求头里添加后端需要的 authorization 字段
axios.interceptors.request.use(config => {
  //正确处理的时候
  //console.log(config);
  //获取token
  const token = getStore('token');
  //只有登录了，有token才会走，否则照常执行
  if (token) {
    //如果有值，表示用户已登录，在每一个请求头上都设置该字段
    config.headers.common['Authorization'] = token;
  }
  //一定要返回 config
  return config;
}, error => {
  //出错
  return Promise.reject(error);
})

//守卫
router.beforeEach((to, from, next) => {
  //对每一个路由进行验证，token进行对比
  //注意：第二个参数没有请求参数也需要传一个空对象
  axios.post('/api/validate', {}).then(res => {
    let data = res.data;
    //如果未通过，没有登录成功，token 不一致或者是过期了，返回当前用户未登录，跳转到登录页面
    if (data.state !== 1) {
      //判断当前路由是否需要权限
      //用户未登录，跳转到登录页面
      if (to.matched.some(record => record.meta.auth)) {
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      } else {
        next();
      }
      //验证通过，返回用户信息
    } else {
      //登录成功，如果没有错误，返回信息并保存，在store中进行
      //保存用户的信息，保存到store
      store.commit("ISLOGIN", data);
      //跳转首页，解决登录成功后，MHeader组件挂载时login打印还是false的问题
      if (to.path === '/login') {
        router.push({
          path: '/'
        })
      }
      //放行就解决了
      next();
    }
  }).catch(error => {
    console.log(error);
  })
  //注意，一定要放行
  //next();
})

//一定要注意代码书写的顺序
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')