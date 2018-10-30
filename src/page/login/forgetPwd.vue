<template>
  <div class="forget_pwd">
    <!--头部-->
    <publick-head>
      <div slot="bakc" class="back"></div>
      <span slot="title">忘记密码</span>
    </publick-head>
    <div class="login_input">
      <div class="phone">
        <i></i>
        <input type="tel" placeholder="请输入预留电话" maxlength="11" v-model="changeModel.phone">
        <span class="phone_error"></span>
      </div>
      <div class="auth_code">
        <div class="auth_left">
          <i></i>
          <input type="text" placeholder="输入手机验证码" maxlength="6" v-model="changeModel.code">
        </div>
        <div class="auth_btn" @click="getCode">获取验证码</div>
      </div>
      <div class="password">
        <i></i>
        <input type="password" placeholder="新密码" v-model="changeModel.password">
      </div>
      <div class="password">
        <i></i>
        <input type="password" placeholder="确认密码" v-model="changeModel.repassword">
      </div>
    </div>
    <div class="login_btn" v-if="!btnSure">
      <span @click="changePassword()">确定</span>
    </div>
    <div class="btn_sure" v-else>
      <i></i>
    </div>

    <!--错误提示信息-->
    <hint-model ref="message">
      <p class="title" slot="title">{{errorMessage}}</p>
      <div class="ico_scuess" slot="ico" v-if="showSucess"></div>
    </hint-model>
  </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import hintModel from '@/components/publick/hintModel'
  import {getCode} from '../../api/login'
  import {passwordChange} from "../../api/user";

  export default {
    name: "forgetPwd",
    data() {
      return {
        changeModel: {
          phone: '',
          code: '',
          password: '',
          repassword: ''
        },
        showSucess: false,//是否展示成功的提醒
        phoneError: false,
        codeError: false,
        newPassword: false,
        rePassword: false,
        errorMessage: '',
        codeBoole: true,  //验证码按钮不能重复点击
        passwordBtn: true,  //修改密码的按钮不能重复点击
        btnSure: false,   //判断用户是否点击按钮
      }
    },
    mounted:function () {

    },
    methods: {
      /** 11:44
       *   @author: yuanjie
       *   @description:判断用户设置密码的时候是否有数字和字符类型(包括特殊字符)
       *   @param
       */
      judgePwd(pWd) {
        let pWdStr = /\D/;
        let pWdNum = /\d/;
        let pWdstring = /[A-Za-z]/;
        if (pWdStr.test(pWd) && pWdNum.test(pWd) && pWdstring.test(pWd)) {
          this.newPassword = true;
          return true;
        } else {
          this.$refs.message.showModel = true;
          this.errorMessage = '密码的格式不正确';
          return false;
        }
      },

      /** 16:18
       *   @author: yuanjie
       *   @description:获取验证码
       *   @param
       */
      getCode() {
        if(this.changeModel.phone != ''){
          if(this.changeModel.phone.length == 11){
            let phoneReg = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/;
            if (!phoneReg.test(this.changeModel.phone)) {
              this.$refs.message.showModel = true;
              this.errorMessage = '手机号错误';
            } else {
              if(this.codeBoole){
                this.codeBoole = false;
                this.phoneError = true;
                let codeNum = 60;
                let timer = null;
                getCode({'phone':this.changeModel.phone,'type':'忘记密码'}).then(res => {
                  if(res.data.status == 0){
                    this.codeBoole = true;
                    $('.auth_btn').css({'color':'#9a9a9a', 'border':'1px solid #9a9a9a'});
                    timer = setInterval(() => {
                      if (codeNum > 0) {
                        $('.auth_btn').html('重新发送' + codeNum);
                        codeNum--;
                      } else {
                        clearInterval(timer);
                        $('.auth_btn').html('重新发送');
                        $('.auth_btn').css({'color':'#e70012', 'border':'1px solid #e70012'});
                      }
                    }, 1000)
                  }else{
                    this.$refs.message.showModel = true;
                    this.errorMessage = res.data.msg;
                    this.codeBoole = true;
                  }
                })
              }
            }
          }else{
            this.$refs.message.showModel = true;
            this.errorMessage = '手机号码错误'
          }
        }else{
          this.$refs.message.showModel = true;
          this.errorMessage = '手机号码为空'
        }

      },

      /** 9:53
       *   @author: yuanjie
       *   @description:修改密码
       *   @param
       */
      changePassword() {
        if (this.changeModel.phone != '') {
          if (this.changeModel.phone.length == 11) {
            let phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
            if (!phoneReg.test(this.changeModel.phone)) {
              this.$refs.message.showModel = true;
              this.errorMessage = '手机号码错误';
              return false;
            } else {
              this.phoneError = true;
            }
          } else {
            this.$refs.message.showModel = true;
            this.errorMessage = '手机号码错误';
            return false;
          }
        } else {
          this.$refs.message.showModel = true;
          this.errorMessage = '手机号码错误';
          return false;
        }

        if(this.changeModel.code != ''){

          if(this.changeModel.code.length == 6){
            this.codeError = true;
          }else{
            this.$refs.message.showModel = true;
            this.errorMessage = '验证码格式错误';
            return false;
          }
        }else{
          this.$refs.message.showModel = true;
          this.errorMessage = '请输入验证码'
          return false;
        }

        if(this.changeModel.password != ''){
          if(this.changeModel.password.length >= 6 && this.changeModel.password.length < 20){
            if(this.judgePwd(this.changeModel.password)){
              this.newPassword = true;
            }else{
              return false;
            }
          }
        }else{
          this.$refs.message.showModel = true;
          this.errorMessage = '新密码为空';
        }

        if(this.changeModel.repassword != ''){
          if( !(this.changeModel.password == this.changeModel.repassword) ){
            this.$refs.message.showModel = true;
            this.errorMessage = '两次输入的密码不一致';
            return false;
          }else{
            this.rePassword = true;
          }
        }else{
          this.$refs.message.showModel = true;
          this.errorMessage = '确认密码为空';
        }
        if(this.phoneError && this.codeError && this.newPassword && this.rePassword && this.passwordBtn){
          this.passwordBtn = false;
          this.btnSure = true;
          setTimeout(() => {
            passwordChange(this.changeModel).then(res => {
              if(res.data.status == 0){
                this.showSucess = true;
                this.errorMessage = res.data.msg;
                this.$refs.message.showModel = true;
                this.passwordBtn = true;
                this.btnSure = false;
                setTimeout(() => {
                  this.$router.push("login");
                },2000)
              }else{
                this.errorMessage = res.data.msg;
                this.$refs.message.showModel = true;
                this.passwordBtn = true;
                this.btnSure = false;
              }
            })
          },1000)


        }

      },
    },
    components: {
      publickHead,
      hintModel
    }, watch: {
      //手机号不能输入数字以外的
      'changeModel.phone': function (newVal, oldVal) {
        this.changeModel.phone = newVal.replace(/\D/g, '');
      },
      //验证码不能输入数字以外的
      'changeModel.code': function (newVal, oldVal) {
        this.changeModel.code = newVal.replace(/\D/g, '');
      },
      //监听不能密码不能有中文
      'changeModel.password': function (newVal, oldVal) {
        this.changeModel.password = newVal.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, '');
      },
      'changeModel.repassword': function (newVal, oldVal) {
        this.changeModel.repassword = newVal.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, '');
      },
    }
  }
</script>

<style scoped>
  .login_input {
    background: #ffffff;
    border-radius: 17px;
    margin: 0 75px;
    padding: 0 30px;
    display: flex;
    flex-direction: column;
  }

  .phone, .password {
    border-bottom: 1px solid #9f9f9f;
    margin: 24px 0 0 0;
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

  .auth_code {
    display: flex;
    justify-content: space-between;
    margin: 18px 0 0 0;
  }

  .auth_left i {
    display: block;
    width: 30px;
    height: 30px;
    background: url("../../assets/img/unbundel_phone.png") no-repeat;
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

  .ico_scuess {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/success_ico.png") no-repeat center;
    background-size: contain;
    margin-bottom: 32px;
  }

  input {
    color: #333333 !important;
    font-size: 28px !important;
  }
  .btn_sure {
    margin: 50px auto 34px auto;
    width: 510px;
    height: 66px;
    background: #e70012;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
  }
  .btn_sure i{
    display: block;
    width: 50px;
    height: 50px ;
    background: url("../../assets/img/btn_ico.gif") no-repeat center;
    background-size: contain;
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
