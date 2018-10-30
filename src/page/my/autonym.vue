<template>
  <div class="autonym_con">
    <!--头部-->
    <div class="header_top">
      <publick-head>
        <div slot="bakc" class="back"></div>
        <span slot="title">实名认证</span>
      </publick-head>
      <router-link :to="{name:'unbundleDetail', params: { id: cancelId }}"  tag="div" class="unbundle" v-if="!showBtn">解绑</router-link>
    </div>

    <!--注册信息-->
    <div class="bank_main" v-if="showBtn">
      <div class="main_top">
        <span>请绑定持卡本人的银行卡</span>
      </div>
      <div class="bank_message">
        <div class="message_item">
          <span>持卡人姓名:</span>
          <input type="text" v-model="attesTation.name" maxlength="5" :readonly="readOnly">
          <i class="name"></i>
        </div>
        <div class="message_item">
          <span>持卡人身份证:</span>
          <input type="text" v-model="attesTation.idcard" maxlength="18" :readonly="readOnly">
          <i class="id"></i>

        </div>
        <div class="message_item">
          <span>银行卡号:</span>
          <input type="text" v-model="attesTation.bank_card" maxlength="19">
          <i class="bank_code"></i>
        </div>
        <div class="message_item">
          <span>银行卡开户行:</span>
          <input type="text" v-model="attesTation.bank_name">
          <i class="bank_name"></i>
        </div>
        <div class="message_item">
          <span>银行预留电话:</span>
          <input type="tel" v-model="attesTation.bank_tel" maxlength="11">
          <i class="bank_phone"></i>
        </div>
        <div class="message_item">
          <span>开户行地址:</span>
          <input type="text" v-model="attesTation.bank_address" placeholder="选填">
        </div>
        <!--<div class="auth_code message_item">-->
        <!--<div class="auth_left">-->
        <!--<input type="text" placeholder="输入验证码">-->
        <!--</div>-->
        <!--<div class="auth_right">获取验证码</div>-->
        <!--</div>-->
      </div>
    </div>
    <div class="login_btn" v-if="showBtn && !btnSure">
      <span @click="bindBtn()">确定</span>
    </div>

    <div class="btn_sure"  v-if="btnSure">
      <i></i>
    </div>
    <!--注册过后展示的信息-->
    <div class="show_message" v-if="!showBtn">
      <div class="message_item">
        持卡人姓名: <span>{{userMessage.name}}</span>
      </div>
      <div class="message_item">
        持卡人身份证: <span>{{userMessage.userId}}</span>
      </div>
      <div class="message_item">
        银行卡号: <span>{{userMessage.userBankId}}</span>
      </div>
      <div class="message_item">
        银行开户行: <span>{{userMessage.userBankName}}</span>
      </div>
      <div class="message_item">
        银行预留电话: <span>{{userMessage.userPhone}}</span>
      </div>
    </div>

    <!--loading-->
    <loading ref="loading"></loading>
    <!--成功提示-->
    <hint-model ref="message">
      <div class="title" slot="title">{{message}}</div>
      <div class="ico_success" slot="ico" v-if="showSuccess"></div>
    </hint-model>
  </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import loading from '../../components/publick/loading'
  import hintModel from '@/components/publick/hintModel'
  import {autonym, judgeAutonym} from '../../api/user'

  export default {
    name: "autonym",
    data() {
      return {
        nanmeError: false,
        idError: false,
        bankError: false,
        bankMessageError: false,
        bankPhone: false,
        attesTation: {
          name: '',    //姓名
          idcard: '',    //身份证号码
          bank_name: '',    //开户行名称
          bank_card: '',    //银行卡号
          bank_tel: '',    //开户绑定电话
          bank_address: '',  //开户行地址
        },
        userMessage:{ //展示实名认证过后信息
          userName:'',
          userId:'',
          userBankId:'',
          userBankName:'',
          userPhone:''
        },
        showBtn: true,  //展示用户认证后的信息
        readOnly: false,     //只读
        cancelId:'',         //取消绑定银行卡的id
        showSuccess:false,
        message:'',  //错误信息
        btnSure: false,   //判断用户是否点击按钮
      }
    },
    created:function(){
      this.judgeAutonym();
    },
    mounted: function () {
      this.$store.commit('openLoading');
    },
    methods: {
      /** 13:57
       *   @author: yuanjie
       *   @description:判断用户是否实名认证过
       *   @param
       */
      judgeAutonym() {
        judgeAutonym().then((res) => {
          if(res.data.status == 0){
            if (res.data.data.code == 10022 || res.data.data.code == 10021) {
              if (res.data.data.code == 10022) {
                this.attesTation.name = res.data.data.realname;
                this.attesTation.idcard = res.data.data.idcard;
                this.readOnly = true;
              }

              this.showBtn = true;
            } else {
              this.showBtn = false;
              this.userMessage.name = res.data.data.banks[0].name;
              this.userMessage.userId =res.data.data.banks[0].idcard.substr(0,4) + '**********' + res.data.data.banks[0].idcard.substr(res.data.data.banks[0].idcard.length - 4,res.data.data.banks[0].idcard.length);
              this.userMessage.userBankId = '****  ****  ****  ****' + res.data.data.banks[0].bank_card.substr(res.data.data.banks[0].bank_card.length - 4,res.data.data.banks[0].bank_card.length);
              this.userMessage.userBankName = res.data.data.banks[0].bank_name;
              this.userMessage.userPhone = '*******' + res.data.data.banks[0].bank_tel.substr(res.data.data.banks[0].bank_tel.length - 4,res.data.data.banks[0].bank_tel.length);
              this.cancelId = res.data.data.banks[0].id;
            }
            this.$store.commit('closeLoading');
          }

        })
      },
      /** 13:10
       *   @author: yuanjie
       *   @description:验证身份证号
       *   @param
       */
      isCardNo(card) {
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(card) == false) {
          return false;
        } else {
          this.idError = true;
          $('.id').html('');
          return true;
        }
      },

      /** 12:40
       *   @author: yuanjie
       *   @description:实名认证
       *   @param
       */
      bindBtn() {
        if (this.attesTation.name != '') {
          if (this.attesTation.name.length <= 1) {
            $('.name').html('请输入两个字的姓名');
          } else {
            this.nanmeError = true;
            $('.name').html('');
          }
        } else {
          $('.name').html('请输入姓名');
        }

        if (this.attesTation.idcard != '') {
          if (!this.isCardNo(this.attesTation.idcard)) {
            $('.id').html('请输入正确的身份证号');
          }
        } else {
          $('.id').html('请输入身份证号码');
        }
        if (this.attesTation.bank_card != '') {
          if (this.attesTation.bank_card.length >= 16 && this.attesTation.bank_card.length <= 19) {
            this.bankError = true;
            $('.id').html('');
          } else {
            $('.id').html('请输入正确的银行卡号');
          }
        } else {
          $('.bank_code').html('请输入银行卡号');
        }
        if (this.attesTation.bank_name != '') {
          this.bankMessageError = true;
          $('.bank_name').html('');
        } else {
          $('.bank_name').html('请输入开户行名称');
        }

        if (this.attesTation.bank_tel != '') {
          if (this.attesTation.bank_tel.length == 11) {
            let phoneReg = /(^1[3|4|5|7|8|9a]\d{9}$)|(^09\d{8}$)/;
            if (!phoneReg.test(this.attesTation.bank_tel)) {
              $('.bank_phone').html('请输入正确的手机号码');
            } else {
              this.bankPhone = true;
              $('.bank_phone').html('');
            }
          } else {
            $('.bank_phone').html('请输入正确的手机号码');
          }
        } else {
          $('.bank_phone').html('请输入开户行的手机号码');
        }

        //提交信息
        if (this.nanmeError && this.idError && this.bankError && this.bankMessageError && this.bankPhone) {
            this.btnSure = true;
            setTimeout(() => {
              autonym(this.attesTation).then(res => {
                if(res.data.status == 0){
                  this.$refs.message.showModel = true;
                  this.message = res.data.msg;
                  this.btnSure = false;
                  this.showSuccess = true;
                  setTimeout(() => {
                    this.$router.push('myIndex')
                  },2000)
                }else{
                  this.$refs.message.showModel = true;
                  this.message = res.data.msg;
                  this.btnSure = false;
                }

              })
            },1000)

        }


      }
      ,
    },
    computed: {}
    ,
    components: {
      publickHead,
      hintModel,
      loading
    }
    ,
    watch: {
      //监听用户名不能输入中文以外的字符
      'attesTation.name':

        function (newVal, oldVal) {
          this.attesTation.name = newVal.replace(/[^\u4E00-\u9FA5]/g, '');
        }

      ,
      //监听用户只能输入数字和字母
      'attesTation.idcard':
        function (newVal, oldVal) {
          this.attesTation.idcard = newVal.replace(/[^\w\\/]/ig, '');
        },
      //监听银行号只能输入数字
      'attesTation.bank_card': function (newVal, oldVal) {
        this.attesTation.bank_card = newVal.replace(/\D/g, '');
      },
      //监听电话号码不能输入数字以外
      'attesTation.bank_tel':function (newVal,oldVal) {
          this.attesTation.bank_tel = newVal.replace(/\D/g,'');
      }

    }
  }
</script>

<style scoped>
  .header_top {
    position: relative;
  }

  .unbundle {
    position: absolute;
    font-size: 30px;
    color: #00a0e9;
    right: 20px;
    top: 20px;
  }

  .bank_main {
    background: #ffffff;
  }

  .main_top {
    height: 78px;
    padding: 0 0 0 50px;
    font-size: 24px;
    color: #8d8d8d;
    background: #eeeeee;
    box-sizing: border-box;
    padding-top: 30px;
  }

  .bank_message {
    margin: 0 0 0 50px;
  }
  .bank_message i{
    font-size: 24px;
    color: #8b8b8b;
  }

  .bank_message .message_item {
    border-bottom: 1px solid #eeeeee;
    height: 84px;
    display: flex;
    align-items: center;
    position: relative;
  }

  .message_item i {
    position: absolute;
    right: 10px;
  }

  .message_item input {
    text-indent: 20px;
  }

  .message_item span {
    font-size: 30px;
    color: #4c4c4c;
    line-height: 84px;
  }

  .auth_code {
    display: flex;
    border: none !important;
    justify-content: space-between;
    margin: 0 58px 20px 0;
  }

  .auth_left {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
    height: 84px;
    width: 326px;
  }

  .auth_left input {
    text-indent: 0 !important;
    line-height: 83px;
  }

  .auth_right {
    margin: 10px 0 0 0;
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

  /*绑定过银行卡后的样式*/
  .show_message div {
    height: 84px;
    margin-left: 50px;
    border-bottom: 1px solid #eeeeee;
    font-size: 30px;
    color: #4c4c4c;
    line-height: 84px;
  }

  .ico_success{
    background: url("../../assets/img/success_ico.png") no-repeat !important;
    display: block !important;
    width: 65px !important;
    height: 65px !important;
    background-size: contain !important;
    margin-bottom: 32px !important;
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
    font-size: 22px;
    color: #9f9f9f
  }

  /* WebKit browsers */
  input:-moz-placeholder {
    font-size: 22px;
    color: #9f9f9f
  }

  /* Mozilla Firefox 4 to 18 */
  input::-moz-placeholder {
    font-size: 22px;
    color: #9f9f9f
  }

  /* Mozilla Firefox 19+ */
  input:-ms-input-placeholder {
    font-size: 22px;
    color: #9f9f9f
  }

</style>
