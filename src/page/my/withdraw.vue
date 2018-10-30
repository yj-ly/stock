<template>
  <div class="recharge_con">

    <publick-head>
      <div slot="bakc" class="back"></div>
      <span slot="title">提现</span>
    </publick-head>
    <!--充值金额-->
    <div class="recharge_money">
      <div class="recharge_input">
        <span>金额</span>
        <div class="money">
          <i>￥</i>
          <input type="text" placeholder="提现金额不得<￥100" v-model="withdrawModel.money" maxlength="8">
        </div>

      </div>
      <!--费率计算-->
      <div class="hint_money" v-if="allWithdraw == false">扣除{{Number(rateMoney).toFixed(2)}}手续费</div>

      <!--全部提现-->
      <div class="all" v-if="showAll && $store.state.userMessage.cash_balance > 0">全部余额：￥{{$store.state.userMessage.cash_balance}} <span @click="allBtn"
                                                                                            v-if="$store.state.userMessage.cash_balance >= 100">全部提现</span>
      </div>

      <!--超过的金额-->
      <div class="max_money" v-if="minMoney">当前金额不能小于100</div>
      <div class="max_money" v-if="maxMoney">当前金额不能超过余额</div>
    </div>

    <!--充值的到账方式-->
    <div class="to_mode" v-if="$store.state.userMessage.banks != null">
      <div class="to_top">到账方式</div>
      <div class="list_con">
        <div class="to_list last_list">
          <!--<div class="checkd"></div>-->
          <img src="../../assets/img/bank_card.png" alt="">
          <div class="list_name">
            <span>银行卡到账</span>
            <i>{{$store.state.userMessage.banks.bank_name}}尾号{{$store.state.userMessage.banks.bank_card.substr($store.state.userMessage.banks.bank_card.length
              - 4,$store.state.userMessage.banks.bank_card.length)}}</i>
          </div>

        </div>
      </div>

    </div>

    <!--确认充值-->
    <div class="confirm" @click="withdrawBtn" v-if="!btnSure">
      <span>确认提现</span>
    </div>

    <div class="btn_sure"  v-else>
      <i></i>
    </div>

    <!--提示-->
    <hint-model ref="message">
      <p class="title" slot="title">{{errorMessage}}</p>
      <div slot="ico" v-if="successIco" class="ico_success"></div>
    </hint-model>
  </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import hintModel from '@/components/publick/hintModel'
  import {withdraw, serviceMoney} from "../../api/user";

  export default {
    name: "withdraw",
    data() {
      return {
        withdrawModel: {
          money: '',
          pay_type: '0',
        },
        successIco: false,
        errorMessage: '',
        rate: 0,
        rateMoney: 0,   //收的费率
        timer: null,
        allWithdraw: true,
        showAll: true,
        minMoney: false,   //最小的金额
        maxMoney: false,    //最大的金额
        judeg: true,
        minCharge:0,       //提现最小手续费
        minMoneyWithdraw:0,   //最低提现金额
        btnSure: false,   //判断用户是否点击按钮

      }
    },
    methods: {
      //跳转到不同页面
      localUrl(strUrl) {
        this.$router.push(strUrl);
      },
      /** 14:21
       *   @author: yuanjie
       *   @description:获取费率
       *   @param
       */
      getRate() {
        serviceMoney().then(res => {
          if (res.data.status == 0) {
            this.rate = res.data.data.withdraw_charge;  //提现手续费
            this.minCharge = res.data.data.withdraw_charge_lowermoney;  //提现最小手续费
            this.minMoneyWithdraw = res.data.data.withdraw_lower;   //最低提现金额
          }
        })
      },
      /** 14:10
       *   @author: yuanjie
       *   @description:提现
       *   @param
       */
      withdrawBtn() {
        if (this.withdrawModel.money == '') {
          this.errorMessage = '金额为空';
          this.$refs.message.showModel = true;
        } else {
          if (Number(this.withdrawModel.money) < this.minMoneyWithdraw) {
            this.errorMessage = '金额必须大于' + this.minMoneyWithdraw;
            this.$refs.message.showModel = true;
          } else {
            this.btnSure = true;
            setTimeout(() => {
              withdraw(this .withdrawModel).then(res => {
                if (res.data.status == 0) {
                  this.$refs.message.showModel = true;
                  this.successIco = true;
                  this.errorMessage = res.data.msg;
                  this.btnSure = false;
                  setTimeout(() => {
                    this.$router.push('myIndex');
                  },2000)
                } else {
                  this.errorMessage = res.data.msg;
                  this.$refs.message.showModel = true;
                  this.btnSure = false;
                }
              })
            },1000)

          }
        }
      },
      /** 15:31
       *   @author: yuanjie
       *   @description:全部提现
       *   @param
       */
      allBtn() {
        if(this.$store.state.userMessage.cash_balance >= this.minMoneyWithdraw ){
          this.judeg = false;
          this.rateMoney = (this.$store.state.userMessage.cash_balance * this.rate);
          if(this.rateMoney < this.minCharge){
            this.rateMoney = this.minCharge;
          }
          this.withdrawModel.money = this.$store.state.userMessage.cash_balance ;
          this.allWithdraw = false;
          this.showAll = false;
        }else{
          this.errorMessage = '金额必须大于' + this.minMoneyWithdraw;
          this.$refs.message.showModel = true;
        }

      }
    },
    created: function () {
      this.$store.dispatch('getUserInfo');
      this.getRate();
    },
    mounted: function () {

    },
    components: {
      publickHead,
      hintModel
    },
    watch: {
      'withdrawModel.money': function (newVal, oldVal) {
        if (this.judeg) {
          // this.withdrawModel.money = newVal.replace(/[^\d\.]/, '').replace(/^0(?=[0-9])/, '');
          // this.withdrawModel.money =this.withdrawModel.money.replace(/[^\0]/g,"");
          //先把非数字的都替换掉，除了数字和.
          this.withdrawModel.money = this.withdrawModel.money.replace(/[^\d.]/g, "");
//保证只有出现一个.而没有多个.
          this.withdrawModel.money = this.withdrawModel.money.replace(/\.{2,}/g, ".");
//必须保证第一个为数字而不是.
          this.withdrawModel.money = this.withdrawModel.money.replace(/^\./g, "");
//保证.只出现一次，而不能出现两次以上
          this.withdrawModel.money = this.withdrawModel.money.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
//只能输入两个小数
          this.withdrawModel.money = this.withdrawModel.money.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');

        }
        if (newVal < 100) {
          this.minMoney = true;
          this.allWithdraw = true;
        } else {
          this.minMoney = false;
        }

        if (Number(newVal) > this.$store.state.userMessage.cash_balance) {
          this.maxMoney = true;
          this.allWithdraw = true;
          return false;
        } else {
          this.maxMoney = false;
        }
        this.showAll = false;
        if (newVal >= 100) {
          this.allWithdraw = false;

          clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              if(newVal * this.rate < 5){
                this.rateMoney = 5;
              }else{
                this.rateMoney =  newVal * this.rate;
              }
            }, 500)

        }
        if (newVal == '') {
          this.showAll = true;
          this.minMoney = false;

        }
      }
    }
  }
</script>

<style scoped>

  .recharge_money {
    display: flex;
    flex-direction: column;
  }

  .recharge_input {
    display: flex;
    flex-direction: column;
    padding-left: 38px;
    border-bottom: 2px solid #d2d2d2;
  }

  .recharge_input span {
    line-height: 76px;
    font-size: 28px;
    color: #333333;
  }

  .money i {
    font-size: 36px;
  }

  .recharge_input input {
    margin-left: 30px;
    width: 500px;
    color: #000000;
    font-size: 48px;
  }

  .to_mode {
    margin: 40px 0 0 0;
  }

  .to_top {
    font-size: 28px;
    color: #000000;
    padding: 0 0 12px 38px;
    border-bottom: 2px solid #d2d2d2;
  }

  .to_list {
    display: flex;
    border-bottom: 2px solid #d2d2d2;
    height: 130px;
    box-sizing: border-box;
    align-items: center;
    padding-left: 40px;
  }

  .checkd {
    width: 26px;
    height: 26px;
    background: url("../../assets/img/not_checkd.png") no-repeat;
    background-size: contain;
    margin: 0 58px 0 46px;
  }

  .to_list .ac {
    background: url("../../assets/img/cofirm_checkd.png") no-repeat;
  }

  .to_list img {
    width: 75px;
    height: 75px;
    margin: 0 20px 0 0;
  }

  .list_name {
    display: flex;
    flex-direction: column;
  }

  .list_name span {
    font-size: 24px;
    color: #3c3c3c;
    padding-bottom: 10px;
  }

  .list_name i {
    font-size: 20px;
    color: #a4a4a4;
  }

  /*.last_list {*/
  /*border: none !important;*/
  /*background: url("../../assets/img/arrows.png")no-repeat 680px center;*/
  /*}*/
  .confirm {
    border-top: 10px solid #dddddd;
    height: 66px;
  }

  .confirm span {
    display: block;
    margin: 30px 130px 0 130px;
    background: #e70012;
    text-align: center;
    line-height: 66px;
    color: #ffffff;
    font-size: 28px;
    border-radius: 30px;
  }

  .ico_success {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/success_ico.png") no-repeat center;
    background-size: contain;
    margin-bottom: 32px;
  }

  .hint_money {
    margin: 12px 0 0 102px;
    font-size: 26px;
    color: #9a9a9a;
    margin-bottom: 86px;
  }

  .all {
    margin: 12px 0 0 102px;
    font-size: 26px;
    color: #9a9a9a;
    margin-bottom: 86px;
  }

  .all span {
    color: #00a0e9;
    padding-left: 20px;
  }

  .max_money {
    color: #eb0505;
    margin: 12px 0 0 102px;
    font-size: 26px;
  }

  .btn_sure {
    margin: 30px 130px 0 130px;
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
    font-size: 28px;
    opacity: 1;
  }

  /* WebKit browsers */
  input:-moz-placeholder {
    font-size: 28px;
    opacity: 1;
  }

  /* Mozilla Firefox 4 to 18 */
  input::-moz-placeholder {
    font-size: 28px;
    opacity: 1;
  }

  /* Mozilla Firefox 19+ */
  input:-ms-input-placeholder {
    font-size: 28px;
    opacity: 1;
  }

  /* Mozilla Firefox 19+ */

</style>
