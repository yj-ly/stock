<template>
  <div class="unbundele">
    <!--头部-->
    <publick-head>
      <div slot="bakc" class="back"></div>
      <span slot="title">解绑申请</span>
    </publick-head>

    <div class="main">
      <div class="login_input">
        <div class="phone">
          <i></i>
          <input type="text" placeholder="请输入预留电话" v-model="unbundle.phone" maxlength="11">
          <span class="phone_error"></span>
        </div>
        <div class="auth_code">
          <div class="auth_left">
            <i></i>
            <input type="text" placeholder="输入手机验证码" maxlength="6" v-model="unbundle.code">
          </div>
          <div class="auth_btn" @click="getCode">获取验证码</div>
        </div>
      </div>
      <div class="login_btn" v-if="!btnSure">
        <span @click="applyFor">申请</span>
      </div>

      <div class="btn_sure" v-else>
        <i></i>
      </div>
    </div>

    <!--错误信息-->
    <hint-model ref="message">
        <div slot="title" id="title" class="title">{{errorMessage}}</div>
        <div class="ico_2" v-if="success" slot="ico"></div>
    </hint-model>
  </div>

</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import hintModel from '@/components/publick/hintModel'
  import {getCode} from '../../api/login'
  import {unbundle} from '../../api/user'

  export default {
    name: "unbundleDetail",
    data() {
      return {
        unbundle: {
          phone: '',
          code: '',
          id: '',
        },
        phoneError: false,
        codeError:false,
        errorMessage:'',
        codeBoole:true,  //不可以多次点击
        success:false,
        btnSure: false,   //判断用户是否点击按钮
      }
    },
    mounted: function () {
      this.unbundle.id = this.$route.params.id;
    },
    methods: {
      /** 16:05
       *   @author: yuanjie
       *   @description:申请解绑
       *   @param
       */
      applyFor() {

        if (this.unbundle.phone != '') {
          if (this.unbundle.phone.length == 11) {
            let phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
            if (!phoneReg.test(this.unbundle.phone)) {
              this.$refs.message.showModel = true;
              this.errorMessage = '手机号码错误'
            } else {
              this.phoneError = true;
              $('.phone_error').html('');
            }
          } else {
            this.$refs.message.showModel = true;
            this.errorMessage = '手机号码错误'
          }
        } else {
          this.$refs.message.showModel = true;
          this.errorMessage = '手机号码错误'
        }

        if(this.unbundle != ''){

          if(this.unbundle.code.length == 6){
            this.codeError = true;
          }else{
            this.$refs.message.showModel = true;
            this.errorMessage = '验证码格式错误'
          }
        }else{
          this.$refs.message.showModel = true;
          this.errorMessage = '请输入验证码'
        }
        if(this.phoneError && this.codeError){
          this.btnSure = true;
          setTimeout(() => {
            unbundle(this.unbundle).then(res => {
              if(res.data.status == 0){
                this.success = true;
                this.$refs.message.showModel = true;
                this.errorMessage = res.data.msg;
                this.btnSure = false;
                setTimeout(() => {
                  this.$router.push({name:'myIndex'});
                },2000)

              }else{
                this.$refs.message.showModel = true;
                this.errorMessage = res.data.msg;
                this.btnSure = false;
              }
            })
          },1000)

        }


      },

      /** 16:18
       *   @author: yuanjie
       *   @description:获取验证码
       *   @param
       */
      getCode() {
          if(this.unbundle.phone != ''){
                if(this.unbundle.phone.length == 11){
                  let phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
                  if (!phoneReg.test(this.unbundle.phone)) {
                    // this.error = true;
                    this.$refs.message.showModel = true;
                    this.errorMessage = '手机号错误';
                  } else {
                    if(this.codeBoole){
                      this.codeBoole = false;
                      this.phoneError = true;
                      let codeNum = 60;
                      let timer = null;

                      getCode({'phone':this.unbundle.phone,'type':'银行卡解绑'}).then(res => {
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
                  this.error = true;
                  this.$refs.message.showModel = true;
                  this.errorMessage = '手机号码错误'
                }
          }else{
            this.error = true;
            this.$refs.message.showModel = true;
            this.errorMessage = '手机号码为空'
          }

      },
    },
    components: {
      publickHead,
      hintModel
    },
    watch: {
      //监听手机号码不能中文以外的数字
      'unbundle.phone':function(newVal,oldVal) {
        this.unbundle.phone = newVal.replace(/\D/g,'');
      },

      //监听验证码只能输入数字
      'unbundle.code':function(newVal,oldVal) {
        this.unbundle.code = newVal.replace(/\D/g,'');
      }
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
    border-bottom: 1px solid #e5e5e5;
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
    width: 34px;
    height: 24px;
    background: url("../../assets/img/id_card.png") no-repeat left top;
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
    margin: 18px 0;
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
    border-bottom: 1px solid #e5e5e5;
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
  .ico_2{
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
