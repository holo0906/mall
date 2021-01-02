import Vue from 'vue'
import Vuex from 'vuex'
import {
  setStore,
  getStore
} from "@/utils/storage"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login: false, //是否登录
    userInfo: null, //用户信息
    cartList: [], //加入购物车的商品
    showCart: false, //是否显示购物车
  },
  mutations: {
    //网页初始化时，从本地缓存获取购物车数据
    INITBUYCART(state) {
      let initCart = getStore('buyCart');
      //console.log(initCart);
      if (initCart) {
        //数组
        state.cartList = JSON.parse(initCart);
      }
    },
    SHOWCART(state, {
      showCart
    }) {
      state.showCart = showCart;
    },
    //导航守卫中调用，保存用户信息
    ISLOGIN(state, info) {
      state.userInfo = info;
      //改变登录状态
      state.login = true;
      //保存用户信息
      setStore('userInfo', info);
    },
    ADDCART(state, {
      productId,
      salePrice,
      productName,
      productImageBig,
      productNum = 1
    }) {
      let cart = state.cartList;
      let goods = {
        productId,
        salePrice,
        productName,
        productImageBig
      }

      //设置标志，是否是第一次添加该商品
      let flag = true;
      if (cart.length) {
        //只需要执行方法，不需要返回，forEach
        cart.forEach(item => {
          if (item.productId === productId) {
            if (item.productNum >= 1) {
              //修改标记
              flag = false;
              //数量+1
              item.productNum += productNum;
            }
          }
        })
      }

      if (!cart.length || flag) {
        //添加商品数量属性
        goods.productNum = productNum;
        //console.log(goods);
        cart.push(goods);
      }

      //修改 cartList 的值
      state.cartList = cart;
      //console.log(state.cartList);
      //不管登录还是未登录，都存储数据
      setStore('buyCart', cart);
    }
  },
  actions: {},
  modules: {}
})