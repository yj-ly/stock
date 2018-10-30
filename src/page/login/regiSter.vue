<template>
  <div class="regiSter_con">
    <div class="login_content" :style="{height:calcHeight}">
      <!--头部 -->
      <div class="register_head">
        <div class="back" @click="localUrl"></div>
        <span>注册</span>
      </div>

      <!--注册模块-->
      <div class="login">

        <div class="login_input">
          <div class="phone">
            <i></i>
            <input type="tel" placeholder="请输入手机号" v-model="regiSterModel.phone" maxlength="11"
                   @blur="judgeInputStr('login_error')">
            <span class="login_error" :class="{hide:!phoneError}"></span>
          </div>
          <div class="password">
            <i></i>
            <input type="password" placeholder="请输入密码" v-model="regiSterModel.password" maxlength="20"
                   @blur="judgeInputStr('pwd_error')">
            <span class="pwd_error" :class="{hide:!pwdError}"></span>
          </div>
          <div class="password">
            <i></i>
            <input type="password" placeholder="请再次输入密码" v-model="regiSterModel.repassword" maxlength="20"
                   @blur="judgeInputStr('repeter_pwd')">
            <span class="repeter_pwd" :class="{hide:!repassword}"></span>
          </div>
          <div class="password">
            <i></i>
            <input type="text" placeholder="请输入邀请码" v-model="regiSterModel.askcode" maxlength="6"
                   @blur="judgeInputStr('invite_error')" :disabled="scanCode">
            <span class="invite_error" :class="{hide:!inviteError}"></span>
          </div>
          <div class="auth_code">
            <div class="auth_left">
              <i></i>
              <input type="text" placeholder="请输入验证码" v-model="regiSterModel.code" maxlength="6">
            </div>
            <div class="auth_btn" @click="getcode">获取验证码</div>
          </div>
        </div>
        <div class="login_btn">
          <span @click="regiSterBtn('homeIndex')">下一步</span>
        </div>

        <!--协议-->
        <div class="protocol">
          <!--<p>登录或注册即代表阅读并同意</p>-->
          <!--<router-link tag="div" :to="{name:'about',params:{typeNum:1}}">《服务协议》</router-link>-->
        </div>
      </div>

      <!--验证码错误-->
      <div class="auth_code_error" v-if="showError">
          <div class="model" @click="closeModel" v-if="showError"></div>
          <div class="auth_model" v-if="showError">
              <p>验证码错误</p>
              <i class="ico"></i>
              <div class="model_btn" @click="closeModel">确认</div>
          </div>
      </div>

      <!--&lt;!&ndash;提示安卓用户下载app&ndash;&gt;-->
      <!--<div class="auth_code_error" v-if="showDownLoad">-->
        <!--<div class="model" @click="cancelDownloadApk" ></div>-->
        <!--<div class="auth_model">-->
          <!--<p>是否下载app</p>-->
          <!--<i class="ico down_ico"></i>-->
          <!--<div class="model_btn" @click="downLoadApk">确认</div>-->
        <!--</div>-->
      <!--</div>-->

      <!--登录加载框-->
      <div class="login_loading" v-if="showLoading">

        <div class="login_model"></div>
        <div class="login_img">
          <img src="../../assets/img/login_loading.gif" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from '../../api/axios-set.js'
  import publickHead from '@/components/publick/publickHead'
  import {regiSter, getCode} from '../../api/login'

  export default {
    name: "regiSter",
    data() {
      return {
        regiSterModel: {
          phone: '', //注册的手机号码
          password: '', //注册的密码
          repassword: '',  //再次确认密码
          askcode: '', //邀请码
          code: '',   //验证码
          birthplace:2, //来源
        },
        phoneError: false,
        pwdError: false,
        repassword: false,
        inviteError: false,
        // verifyError: false,
        codeBoole: true,  //判断是否可以在点击获取验证码
        userPhoneBoole: '',       //判断用户的手机号码是否正确
        showError:false,   //显示验证码错误信息
        showLoading:false, //展示登录的loading
        clickBoole:true,  //不能重复点击注册按钮
        scanCode:false,
      }
    },
    components: {
      publickHead
    },
    mounted:function(){
      if(this.$route.query.inviteCode != null){
          this.regiSterModel.askcode = this.$route.query.inviteCode;
        this.scanCode = true;
      }

    },
    methods: {
      /** 15:40
        *   @author: yuanjie
        *   @description:关闭模态层
        *   @param
        */
      closeModel(){
        this.showError = false;
      },
      /** 10:50
       *   @author: yuanjie
       *   @description:返回
       *   @param
       */
      localUrl() {
        this.$router.push('/login');
      },
      /** 10:24
       *   @author: yuanjie
       *   @description:判断当前用户输入的手机号是否合法
       *   @param
       */
      judgeUserPhone(phone) {
        if (phone == '' || phone == undefined) {
          this.phoneError = true;
          document.querySelector('.login_error').innerHTML = '(手机号码为空)';
          return false;
        }
        let phoneReg = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/;
        if (!phoneReg.test(phone)) {
          this.userPhoneBoole = false;
          this.phoneError = true;
          $('.phone input').css({'color': '#eb0505'});
          document.querySelector('.login_error').innerHTML = '(手机号码格式不正确)';
          return false;
        } else {
          this.userPhoneBoole = true;
        }
      },

      /** 11:44
       *   @author: yuanjie
       *   @description:判断用户设置密码的时候是否有数字和字符类型(包括特殊字符)
       *   @param
       */
      judgePwd(pWd) {
        let pWdStr = /\D/;
        let pWdNum = /\d/;
        let pWdstr = /[A-Za-z]/;
        if (pWdStr.test(pWd) && pWdNum.test(pWd) && pWdstr.test(pWd)) {
          return true;
        } else {
          this.pwdError = true;
          $('.pwd_error').html('密码方式必须包含两种类型');
          return false;
        }
      },
      /** 12:06
       *   @author: yuanjie
       *   @description:记录用户在没有登录之前跳转的url
       *   @param
       */
      getUserUrl() {
        let getUrl = localStorage.getItem('localUrl');
        if (getUrl == null) {
          return '';
        } else {
          return getUrl;
        }
      },
      /** 10:34
       *   @author: yuanjie
       *   @description:获取验证码
       *   @param
       */
      getcode() {
        this.judgeUserPhone(this.regiSterModel.phone);
        if (this.regiSterModel.phone != '' && this.userPhoneBoole) {
          if (this.codeBoole) {
            this.codeBoole = false;
            getCode({'phone': this.regiSterModel.phone}).then(res => {
              if (res.data.status == 0) {
                let codeNum = 60;
                let codeBtn = document.querySelector('.auth_btn');
                codeBtn.style.border = '1px solid #9a9a9a';
                codeBtn.style.color = '#9a9a9a';
                let timer = null;
                timer = setInterval(() => {
                  if (codeNum > 0) {
                    codeBtn.innerHTML = '已发送' + codeNum;
                    codeNum--;
                  } else {
                    clearInterval(timer);
                    codeBtn.innerHTML = '重新发送';
                    this.codeBoole = true;
                    codeBtn.style.border = '1px solid #e70012';
                    codeBtn.style.color = '#e70012';
                  }
                }, 1000)
              } else {
                this.phoneError = true;
                this.codeBoole = true;
                document.querySelector('.login_error').innerHTML = res.data.msg;
                this.userPhoneBoole = true;
              }
            })
          }
        } else {
        }
      },
      /** 10:23
       *   @author: yuanjie
       *   @description:用户注册
       *   @param{string}接收一个注册成功的跳转地址
       */
      regiSterBtn(str) {
        if (this.regiSterModel.phone == '') {
          this.phoneError = true;
         $('.login_error').html('请输入手机号码');
          return false;
        }
        this.judgeUserPhone(this.regiSterModel.phone);
        if(!this.userPhoneBoole){
          return false;
        }
        if (this.regiSterModel.password == '') {
          this.pwdError = true;
          $('.pwd_error').html('密码为空');
          return false;
        }
        if (this.regiSterModel.password.length < 6) {
          this.pwdError = true;
          $('.pwd_error').html('密码必须大于6位');
          return false;
        }
        if(!this.judgePwd(this.regiSterModel.password)){
          this.pwdError = true;
          $('.pwd_error').html('密码必须有两种类型');
        }
        if (this.regiSterModel.repassword == '') {
          this.repassword = true;
          $('.repeter_pwd').html('确认密码为空');
          return false;
        }
        if (this.regiSterModel.repassword != '') {
          if (this.regiSterModel.repassword != this.regiSterModel.password) {
            this.repassword = true;
            $('.repeter_pwd').html('两次输入的密码不一致');
            return false;
          }
        }
        if (this.regiSterModel.askcode == '') {
          this.inviteError = true;
          $('.invite_error').html('请输入邀请码');
          return false;
        }
        if (this.regiSterModel.askcode.length != 6) {
          this.inviteError = true;
          $('.invite_error').html('请输入六位的邀请码');
          return false;
        }
        // if(this.regiSterModel.askcode.length == 6){
        //   regiSter({'checkInput':this.regiSterModel.phone}).then((res) => {
        //     if(res.status != 0){
        //       if(res.data.code == 10007 ){
        //         this.inviteError = true;
        //         $('.login_error').html(res.msg);
        //         return false;
        //       }
        //     }
        //   })
        // }

        if (this.regiSterModel.code == '') {
            this.showError = true;
            return false;
        }
        if(this.clickBoole){
          regiSter(this.regiSterModel).then((res) => {
            this.clickBoole = false;
            if(res.data.status != 0){
              this.clickBoole = true;
              if(res.data.data.code == 10007 ){
                this.inviteError = true;
                $('.invite_error').html(res.data.msg);
                return false;
              }
              if(res.data.data.code == 10011 ){
                this.showError = true;
                this.$nextTick(function () {
                  $('.auth_model p').html(res.data.msg);
                  return false;
                })
              }
              if(res.data.data.code == 10006 ){
                this.showError = true;
                this.$nextTick(function () {
                  $('.auth_model p').html(res.data.msg);
                  return false;
                })

              }
            }
            if(res.data.status == 0){
              this.showLoading = true;
              this.clickBoole = true;
              setTimeout(() => {
                axios.defaults.headers = {
                  'Authorization': 'Bearer '+ res.data.data.api_token
                }
                //判断是否是扫码进来
                if(this.$route.query.inviteCode != null){
                  localStorage.setItem('userInfo', JSON.stringify(res.data.data.api_token));
                  this.$router.push({name:'download',query:{id:JSON.stringify(res.data.data.api_token)}});
                }else{
                  if(localStorage.getItem('newUser') == null){
                    localStorage.setItem('userInfo', JSON.stringify(res.data.data.api_token));
                    this.$router.push('myIndex');
                  }else{
                    localStorage.setItem('userInfo',JSON.stringify(res.data.data.api_token));
                    if(this.getUserUrl() == ''){
                      this.showLoading = false;
                      this.$router.push('homeIndex');
                    }else{
                      if(localStorage.getItem('localUrl').indexOf('/login') >= 0 || localStorage.getItem('localUrl').indexOf('/regiSter') >= 0){
                        this.$router.push('homeIndex');
                      }else{
                        this.showLoading = false;
                        this.$router.push(this.getUserUrl());
                      }
                    }
                  }
                }


              },1000)
            }else{

            }
          })
        }

      },
      /** 11:38
       *   @author: yuanjie
       *   @description:每次离开input输入框的时候在去判断当前的是否合法
       *   @param{string} 接收一个可用做判断的字符串
       */
      judgeInputStr(str) {
        switch (str) {
          case 'login_error':
            if(this.regiSterModel.phone == '' || this.regiSterModel.phone == undefined){
              this.phoneError = true;
              $('.login_error').html('手机号码为空');
            }else{
                this.judgeUserPhone(this.regiSterModel.phone);
                if(this.phoneError == false){
                  regiSter({'checkInput':this.regiSterModel.phone}).then((res) => {
                      if(res.data.status != 0){
                        if(res.data.data.code == 10006 ){
                          this.phoneError = true;
                          $('.login_error').html(res.data.msg);
                        }
                      }
                  })
                }
            }
            break;
          case 'pwd_error':
            if(this.regiSterModel.password == '' || this.regiSterModel.password == undefined){
              this.pwdError = true;
              $('.pwd_error').html('密码为空');
            }else{
              if(this.regiSterModel.password.length >= 6){
                this.judgePwd(this.regiSterModel.password);
              }else{
                this.pwdError = true;
                $('.pwd_error').html('密码的长度不能小于6');
              }

            }
            break;
          case 'repeter_pwd':
            if(this.regiSterModel.repassword == '' || this.regiSterModel.repassword == undefined){
                this.repassword = true;
                 $('.repeter_pwd').html('确认密码为空');
            }else{
              if(this.regiSterModel.repassword != this.regiSterModel.password){
                this.repassword = true;
                $('.repeter_pwd').html('两次输入的密码不同');
              }
            }
            break;
          case 'invite_error':
            if(this.regiSterModel.askcode == '' || this.regiSterModel.askcode ==undefined){
                this.inviteError = true;
                $('.invite_error').html('请输入邀请码');
            }else{
              if(this.regiSterModel.askcode.length == 6){
                regiSter({'checkInput':this.regiSterModel.askcode}).then((res) => {
                  if(res.data.status != 0){
                    if(res.data.data.code == 10007){
                      this.inviteError = true;
                      $('.invite_error').html(res.data.msg);
                    }
                  }
                })
              }else{
                this.inviteError = true;
                $('.invite_error').html('请输入六位的邀请码');
              }
            }
            break;

        }
      },

    },
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
      'regiSterModel.phone': function (newVal, oldVal) {
        this.regiSterModel.phone = newVal.replace(/\D/g, '');
        if (this.phoneError) {
          this.regiSterModel.phone = '';
          this.phoneError = false;
          $('.login input').css({'color': '#9f9f9f'});
        }
      },
      //监听邀请码只能输入数字
      'regiSterModel.askcode': function (newVal, oldVal) {
        this.regiSterModel.askcode = newVal.replace(/\D/g, '');
        if( this.inviteError){
              this.regiSterModel.askcode = '';
              this.inviteError = false;

            }
      },
      //监听验证码只能有数字
      'regiSterModel.code': function (newVal, oldVal) {
        this.regiSterModel.code = newVal.replace(/\D/g, '');
      },
      //监听不能密码不能有中文
      'regiSterModel.password': function (newVal, oldVal) {
        this.regiSterModel.password = newVal.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, '');
        if(this.pwdError){
          this.regiSterModel.password = '';
          this.pwdError = false;
        }
      },
      'regiSterModel.repassword': function (newVal, oldVal) {
        this.regiSterModel.repassword = newVal.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, '');
        if(this.repassword){
          this.regiSterModel.repassword = '';
          this.repassword = false;

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

  .register_head {
    display: flex;
    font-size: 30px;
    color: #000000;
  }

  .back {
    width: 21px;
    height: 38px;
    background: url("../../assets/img/back.png") no-repeat;
    background-size: contain;
    margin: 20px 0 30px 20px;
  }

  .register_head span {
    padding: 20px 0 0 300px;
  }

  .login_input {
    background: #ffffff;
    opacity: .5;
    border-radius: 17px;
    margin: 0 75px;
    padding: 0 30px;
    display: flex;
    flex-direction: column;
  }

  .login_input div {
    position: relative;
  }

  .login_input div span {
    position: absolute;
    right: 0;
    top: -6px;
    font-size: 24px;
    color: #8b8b8b;
  }

  .phone, .password {
    border-bottom: 1px solid #9f9f9f;
    margin: 48px 0 0 0;
    display: flex;
  }

  .login_input input {
    margin: 0 0 20px 0;
    text-indent: 14px;
  }

  .phone i {
    display: block;
    width: 30px;
    height: 30px;
    background: url("../../assets/img/login_user.png") no-repeat left top;
    background-size: contain;
    margin: 0 0 0 18px;
  }

  .password i {
    display: block;
    width: 30px;
    height: 30px;
    background: url("../../assets/img/login_password.png") no-repeat left top;
    background-size: contain;
    margin: 0 0 0 18px;
  }

  .auth_code {
    display: flex;
    justify-content: space-between;
    margin: 38px 0;
  }

  .auth_left i {
    display: block;
    width: 30px;
    height: 30px;
    background: url("../../assets/img/login_authcode.png");
    background-size: contain;
    margin: 0 0 0 18px;
  }

  .auth_left {
    width: 296px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #929292;
  }

  .auth_left input {
    text-indent: 14px;
    margin: 0;
    /*display: flex;*/
    /*flex-grow: 1;*/
    width: 200px;
  }

  .auth_btn {
    width: 180px;
    text-align: center;
    height: 60px;
    line-height: 60px;
    color: #e70012;
    border-radius: 40px;
    border: 2px solid #e70012;
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
    background:rgba(00,00,00,.3);
  }
  .auth_model {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
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
  .ico{
    display: block;
    width:65px;
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
  input {
    color: #333333 !important;
    font-size: 28px !important;
    background: transparent;
  }
  input::-webkit-input-placeholder {
    font-size: 26px;
    color: #9f9f9f
  }
  .protocol {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30px 0 0 0;
    font-size: 26px;
    color: #353535;
  }
  .protocol div {
    color: #ff0000;
    margin: 2px 0 0 0;
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
  .down_ico {
    background: url("../../assets/img/download.png")no-repeat;
    background-size: contain;
  }

  .login_img img {
    width: 60px;
    margin: 60% 0 0 0;
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

  /* Mozilla Firefox 19+ */

</style>
