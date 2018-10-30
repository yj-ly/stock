<template>
  <div class="login_content" :style="{height:calcHeight}">
    <!--返回按钮 -->
    <!--<div class="back clear_float" @click="back"></div>-->

    <!--登录模块-->
    <div class="login">
      <div class="login_logo">
        <img src="../../assets/img/login_logo.png" alt="">
        <p>鸽睿斯操盘</p>
      </div>

      <div class="login_input">
        <div class="phone">
          <i></i>
          <input type="tel" placeholder="请输入手机号" v-model="loginModel.phone" @blur="judegPhone" maxlength="11">
          <span class="login_error" :class="{hide:!phoneError}"></span>
        </div>
        <div class="password">
          <i></i>
          <input type="password" placeholder="请输入密码" v-model="loginModel.password" maxlength="20">
        </div>
        <router-link to="forgetPwd" tag="div" class="forget_password">忘记密码?</router-link>
        <!--<router-link to="regiSter" tag="div">没有账号?注册一个</router-link>-->
      </div>
      <div class="login_btn">
        <span @click="loginBtn('homeIndex')">下一步</span>
        <router-link to="/regiSter" tag="div">没有账号?注册一个</router-link>
      </div>
    </div>

    <!--密码错误-->
    <div class="auth_code_error" v-if="showError">
      <div class="model" @click="closeModel" v-if="showError"></div>
      <div class="auth_model" v-if="showError">
        <p>验证码错误</p>
        <i class="ico"></i>
        <div class="model_btn" @click="closeModel">确认</div>
      </div>
    </div>

    <!--登录加载框-->
    <div class="login_loading" v-if="showLoading">

      <div class="login_model"></div>
      <div class="login_img">
        <img src="../../assets/img/login_loading.gif" alt="">
      </div>
    </div>

  </div>
</template>

<script>
  import axios from '../../api/axios-set.js'
  import {regiSter, getCode, login} from '../../api/login'

  export default {
    name: "login",
    data() {
      return {
        loginModel: {
          phone: '', //登录的手机号码
          password: '', //注册的密码
        },
        judgeBtn: true,   //用户点击登录的时候不能在重复的点击
        showError: false,  //提示错误信息
        phoneError: false,  //手机号码错误
        userPhoneBoole: '',
        showLoading: false, //展示登录的loading
        clickBoole:true,
      }
    },
    mounted: function () {
      axios.defaults.headers = {};

    },
    methods: {
      /** 15:40
       *   @author: yuanjie
       *   @description:关闭模态层
       *   @param
       */
      closeModel() {
        this.showError = false;
      },
      /** 10:24
       *   @author: yuanjie
       *   @description:判断当前用户输入的手机号是否合法
       *   @param
       */
      judgeUserPhone(phone) {
        if (phone == '' || phone == undefined) {
          this.phoneError = true;
          $('.login_error').html('手机号码为空');
          return false;
        }
        this.clickBoole = true;
        let phoneReg = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/;
        if (!phoneReg.test(phone)) {
          this.clickBoole = true;
          this.userPhoneBoole = false;
          this.phoneError = true;
          $('.phone input').css({'color': '#eb0505'});
          $('.login_error').html('手机号码格式不正确');
          return false;
        } else {
          regiSter({'checkInput': this.loginModel.phone}).then((res) => {
            if (res.data.status != 0) {
              this.phoneError = true;
              this.userPhoneBoole = true;
              $('.login_error').html('该手机可用');
              return false;
            }
            if (res.data.status == 0) {
              this.phoneError = true;
              $('.login_error').html('该手机未注册');
              this.userPhoneBoole = false;
              return false;
            }

          })

        }
      },
      /** 11:08
       *   @author: yuanjie
       *   @description:返回上一级
       *   @param
       */
      back() {
        this.$router.go(-1);
      },
      /** 17:02
       *   @author: yuanjie
       *   @description:离开input的时候判断下用户的手机号码
       *   @param
       */
      judegPhone() {
        this.judgeUserPhone(this.loginModel.phone);
      },
      /** 12:20
       *   @author: yuanjie
       *   @description:登录按钮
       *   @param
       */
      loginBtn() {
        if(this.clickBoole){
          this.judgeUserPhone(this.loginModel.phone);
        }
        if (this.userPhoneBoole == false) {
          return false;
        }
        if (this.loginModel.password == '' || this.loginModel.password == undefined) {
          this.showError = true;
          this.$nextTick(() => {
            $('.auth_model p').html('请输入密码');
          })
          return false;
        }
        if (this.loginModel.password.length < 6) {
          this.showError = true;
          this.$nextTick(() => {
            $('.auth_model p').html('密码最少六位');
          })
          return false;
        }
        if(this.clickBoole){
          this.clickBoole = false;
          login(this.loginModel).then(res => {
            if (res.data.status == 0) {
              this.showLoading = true;
              axios.defaults.headers = {
                'Authorization': 'Bearer '+ res.data.data.api_token
              }
              setTimeout(() => {
                if(localStorage.getItem('newUser') == null){
                  localStorage.setItem('userInfo', JSON.stringify(res.data.data.api_token));
                  this.$router.push('myIndex');
                }else{
                  if (localStorage.getItem('localUrl') == null) {
                    this.showLoading = false;
                    localStorage.setItem('userInfo', JSON.stringify(res.data.data.api_token));
                    this.$router.push('homeIndex');
                  } else {
                    this.showLoading = false;
                    localStorage.setItem('userInfo', JSON.stringify(res.data.data.api_token));
                    //判断当前记录的地址如果是登录的地址的话那都直接跳到起首页
                    if(localStorage.getItem('localUrl').indexOf('/login') >= 0 || localStorage.getItem('localUrl').indexOf('/regiSter') >= 0 ){
                      this.$router.push('homeIndex');
                    }else{
                      this.$router.push(localStorage.getItem('localUrl'));
                    }

                  }
                }

              }, 1000)

            }else{
              this.showError = true;
              this.clickBoole = true;
              this.$nextTick(() => {
                $('.auth_model p').html(res.data.msg);
              })
            }
          })
        }

      }
    },
    components: {},
    computed: {
      /** 11:44
       *   @author: yuanjie
       *   @description:计算当前可视区的高度
       *   @param
       */
      calcHeight() {
        return document.documentElement.clientHeight + 'px';
      }
    },
    watch: {
      //监听手机号码只能输入数字
      'loginModel.phone': function (newVal, oldVal) {
        this.loginModel.phone = newVal.replace(/\D/g, '');
        if (this.phoneError) {
          this.loginModel.phone = '';
          this.phoneError = false;
          $('.login input').css({'color': '#333333'});
        }
      },
    }
  }
</script>

<style scoped>
  .login_content {
    background: url("../../assets/img/login_background.png");
    background-size: cover;
    overflow: hidden;
  }

  .back {
    width: 21px;
    height: 38px;
    background: url("../../assets/img/back.png") no-repeat;
    background-size: contain;
    margin: 20px 0 30px 20px;
    /*float: left*/
  }

  .login {
    clear: both;
  }

  .clear_float:after {
    content: '';
    display: block;
    overflow: hidden;
    clear: both;

  }

  .login_logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 140px;
  }

  .login_logo img {
    width: 120px;
    margin: 0 0 8px 0;
  }

  .login_logo p {
    font-size: 30px;
    color: #ef5b40;
    margin-bottom: 50px;
  }

  .login_input {
    background: url("../../assets/img/login_con.png") no-repeat 0 10px;
    background-size: contain;
    border-radius: 17px;
    margin: 0 75px;
    padding: 0 30px;
    display: flex;
    flex-direction: column;
  }

  .phone, .password {
    border-bottom: 1px solid #9f9f9f;
    margin: 48px 0 0 0;
    display: flex;
    position: relative;
  }

  .login_input input {
    margin: 0 0 20px 0;
    text-indent: 14px;
    color: #333333;
  }

  .phone i {
    display: block;
    width: 30px;
    height: 30px;
    background: url("../../assets/img/login_user.png") no-repeat left top;
    background-size: contain;
    margin: 0 0 0 18px;
  }

  .phone .login_error {
    position: absolute;
    right: 0;
    top: -6px;
    font-size: 24px;
    color: #8b8b8b;
  }

  .password i {
    display: block;
    width: 30px;
    height: 30px;
    background: url("../../assets/img/login_password.png") no-repeat left top;
    background-size: contain;
    margin: 0 0 0 18px;
  }

  .forget_password {
    display: flex;
    flex-flow: row-reverse;
    font-size: 22px;
    color: #9f9f9f;
    margin: 28px 0 40px 0;
  }

  .login_btn {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login_btn span {
    display: block;
    width: 510px;
    height: 66px;
    background: #e70012;
    color: #ffffff;
    font-size: 24px;
    text-align: center;
    line-height: 66px;
    margin: 50px auto 34px auto;
    border-radius: 40px;
  }

  .login_btn div {
    font-size: 24px;
    color: #e70012;
    text-align: center;
    text-decoration: underline;
  }

  /*隐藏元素*/
  .hide {
    visibility: hidden;
  }

  .auth_code_error {
    display: flex;
    justify-content: center;
  }

  .model {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(00, 00, 00, .3);
  }

  .auth_model {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 400px;
    height: 240px;
    background: #ffffff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10000;
  }

  .auth_model p {
    font-size: 32px;
    margin: 30px 0 20px 0;
  }

  .ico {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/error_ico.png") no-repeat center;
    background-size: contain;
    margin-bottom: 32px;
  }

  .model_btn {
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-top: 1px solid #e5e5e5;
    color: #e70015;
    width: 100%;
  }

  .login {

  }

  .login_model {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(00, 00, 00, .3);
  }

  .login_img {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
  }

  .login_img img {
    width: 60px;
    margin: 60% 0 0 0;
  }

  input {
    color: #333333 !important;
    font-size: 28px !important;
    background: transparent;
  }

  input::-webkit-input-placeholder {
    font-size: 26px;
    color: #9f9f9f
  }

  /* WebKit browsers */
  input:-moz-placeholder {
    font-size: 26px;
    color: #9f9f9f
  }

  /* Mozilla Firefox 4 to 18 */
  input::-moz-placeholder {
    font-size: 26px;
    color: #9f9f9f
  }

  /* Mozilla Firefox 19+ */
  input:-ms-input-placeholder {
    font-size: 26px;
    color: #9f9f9f
  }



</style>
