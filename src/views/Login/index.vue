<template>
  <div class="login">
    <div class="box">
      <span>使用账号 登录官网</span>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="user">
          <el-input type="text" v-model="ruleForm.user" autocomplete="off" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <!-- 滑动验证 -->
        <!-- <div class="geetest"></div> -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button>返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//引入storage.js
import { setStore, getStore, removeStore } from "@/utils/storage";

export default {
  data() {
    let validateUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        //放行，一定要回调回去
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        user: "",
        pass: "",
      },
      rules: {
        //这边的键一定跟 rulesForm 中的键一样
        //校验规则，鼠标光标失去焦点时触发
        user: [{ validator: validateUser, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
      },
      cart: [],
    };
  },
  mounted() {
    //缓存当前购物车中的数据
    this.login_addCart();
  },
  methods: {
    login_addCart() {
      let cartArr = [];
      //获取 localStorage 中的购物车数据
      let localCart = JSON.parse(getStore("buyCart"));
      //如果有值才进行操作
      if (localCart && localCart.length) {
        localCart.forEach((item) => {
          cartArr.push({
            userId: getStore("id"),
            productId: item.productId,
            productNum: item.productNum,
          });
        });
      }
      //缓存数据
      this.cart = cartArr;
      //console.log(this.cart);
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //获取用户名和密码
          //let { user, pass } = this.ruleForm;
          //发送post请求，进行验证，获取token
          //注意：post的请求参数写在第二个参数上
          let res = await this.$http.post("/api/login", this.ruleForm);
          //console.log(res);
          //登录成功
          if (res.data.code === 200) {
            let { username, token, id } = res.data;
            //持久化存储后端返回回来的 token 标识等
            //每一次发请求都会经过请求拦截器，通过当前token进行验证
            setStore("token", token);
            setStore("id", id);

            //将未登录时的购物车数据添加到后端
            if (this.cart && this.cart.length) {
              this.cart.forEach(async (item) => {
                let res = await this.$http.post("/api/addCart", item);
                if (res.data.success) {
                  console.log("添加成功");
                }
              });
              //将未登录时本地缓存的购物车的数据清除
              removeStore("buyCart");
              this.$router.push({ path: "/" });
            } else {
              //未登录成功，直接跳转到首页
              this.$router.push({ name: "home" });
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  overflow: visible;
  background: #ededed;
  .box {
    width: 450px;
    border: 1px solid #dadada;
    border-radius: 10px;
    position: absolute;
    top: 200px;
    left: 50%;
    padding: 50px 50px 50px 10px;
    margin-left: -225px;
    box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
      0 18px 20px -10px rgba(0, 0, 0, 0.04),
      0 18px 20px -10px rgba(0, 0, 0, 0.04),
      0 10px 20px -10px rgba(0, 0, 0, 0.04);
    text-align: center;
    form {
      margin-top: 30px;
    }
    span {
      color: #333;
      font-weight: 400;
    }
  }
}
</style>