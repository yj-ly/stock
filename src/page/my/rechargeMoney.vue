<template>
  <div class="recharge_con">

    <div class="recharge_money"  :style="{height:calc}">
      <publick-head style="background: #ffffff">
        <div slot="bakc" class="back"></div>
        <span slot="title">充值</span>
      </publick-head>
      <img src="../../assets/img/pay_money.png" alt="">
      <p>当前总资金:￥{{$store.state.userMessage.cash_balance}}</p>
      <div class="input_money">
        <span>￥:</span>
        <input type="text" :placeholder="hind " v-model="rechargeModel.money" maxlength="7">
      </div>
      <!--<div class="hind_money">-->
        <!--<span>扣除手续费:{{hindRate}}</span>-->
        <!--<span>实际到账:{{withdrawHid}}</span>-->
      <!--</div>-->
      <div class="hind_money">
      <span>单笔充值金额不高于100w</span>
      <span>充值手续费率为{{this.rate}}‰</span>
      </div>

      <!--确认充值-->
      <div class="confirm" @click="rechargeBtn" v-if="!btnSure">
        <span>确认充值</span>
      </div>
      <div class="btn_sure"  v-else>
        <i></i>
      </div>
    </div>

    <!--<div>-->
      <!--<div class="back_top">-->
        <!--<div  class="back_con">-->
        <!--</div>-->
        <!--<div class="back" @click="backMyIndex"></div>-->
        <!--&lt;!&ndash;<span>我的持仓</span>&ndash;&gt;-->
        <!--&lt;!&ndash;<slot name="title"></slot>&ndash;&gt;-->
        <!--<span>支付</span>-->
      <!--</div>-->
      <!--<iframe name="apply" class="apply" :style="{'height':calcMoney,'width':calcWidth}"></iframe>-->
    <!--</div>-->


    <!--提示信息-->
    <hint-model ref="message">
      <p class="title" slot="title">{{errorMessage}}</p>
      <div class="ico_scuess" slot="ico" v-if="showScuess"></div>
    </hint-model>
  </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import hintModel from '@/components/publick/hintModel'
  import {recharge, serviceMoney} from "../../api/user";

  export default {
    name: "rechargeMoney",
    data() {
      return {
        errorMessage: '',
        showScuess: false,//是否展示成功的提醒
        rechargeModel: {
          money: '',  //提醒
          pay_type: '2', //提现方式
        },
        rate: 0,
        minMoneyWithdraw: 0,
        hind: '',
        showApplyBoole: false,
        btnSure: false,   //判断用户是否点击按钮
        hindRate:0,      //提现手续费提醒
        withdrawHid:0,    //充值后到账的金额提醒
      }
    },
    mounted: function () {
      this.$store.dispatch('getUserInfo');
      this.getRate();
    },
    methods: {

      /** 11:41
       *   @author: yuanjie
       *   @description:更换支付方式
       *   @param{number} 更换的状态值
       */
      changeType(num) {
        this.rechargeModel.pay_type = num;
      },
      /** 14:21
       *   @author: yuanjie
       *   @description:获取费率
       *   @param
       */
      getRate() {
        serviceMoney().then(res => {
          if (res.data.status == 0) {

            this.rate = res.data.data.recharge_charge;  //充值手续费
            this.minMoneyWithdraw = res.data.data.recharge_lower;   //充值提现最小金额
            this.hind = '充值金额不得<￥' + res.data.data.recharge_lower;   //充值提现最小金额

          }
        })
      },

      /** 11:43
       *   @author: yuanjie
       *   @description:冲值
       *   @param
       */
      rechargeBtn() {
        if (this.rechargeModel.money == '') {
          this.errorMessage = '金额为空';
          this.$refs.message.showModel = true;
        } else {
          if (Number(this.rechargeModel.money) >= Number(this.minMoneyWithdraw)) {
            let num = String(this.rechargeModel.money / 100);
            if (num.indexOf('.') == -1) {
              this.btnSure = true;
              setTimeout(() => {
                recharge(this.rechargeModel).then(res => {
                  if (res.data.status == 0) {
                    this.showApplyBoole = true;
                    this.btnSure = false;
                    window.location.href = res.data.data;
                    // console.log(res.data.data)
                    // this.$nextTick(() => {
                    //   // document.getElementsByClassName('apply')[0].src = res.data.data;
                    // })

                  } else {
                    this.errorMessage = res.data.msg;
                    this.$refs.message.showModel = true;
                    this.btnSure = false;
                  }
                })
              },1000)

            } else {
              this.errorMessage = '请输入100的整数倍';
              this.$refs.message.showModel = true;
            }
          } else {
            this.errorMessage = '请大于或等于' + this.minMoneyWithdraw;
            this.$refs.message.showModel = true;
          }
        }
      },
      /** 14:56
        *   @author: yuanjie
        *   @description:跳转到myindex
        *   @param
        */
      backMyIndex(){
        this.$router.push('myIndex');
      }
    },
    components: {
      publickHead,
      hintModel

    },
    computed: {
      calc() {
        return document.documentElement.clientHeight + 'px';
      },
      calcMoney() {
        return document.documentElement.clientHeight - 84 + 'px';
      },
      calcWidth() {
        return document.documentElement.clientWidth + 'px';
      }
    },
    watch: {
      //money只能输入两位小数
      'rechargeModel.money': function (newVal, oldVal) {
        this.rechargeModel.money = newVal.replace(/\D/g, '');
        if(newVal >= 100){
            this.hindRate = (this.rate * newVal).toFixed(2);
            this.withdrawHid = Number(newVal - this.hindRate).toFixed(2);
        }
        if(newVal == ''){
          this.hindRate = 0;
          this.withdrawHid = 0;
        }
      }
    }
  }
</script>

<style scoped>

  .recharge_money {
    text-align: center;
    background: #fffef1;
    width: 100%;
    overflow: hidden;

  }

  .recharge_money img {
    margin: 60px 0 80px 0;
    width: 150px;
  }

  .recharge_money p {
    font-size: 36px;
    color: #6d6d6d;
    margin-bottom: 70px;
  }

  .input_money {

    margin: 0 86px;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    font-size: 60px;
    color: #000000;
  }

  .input_money span {
    padding: 0 0 26px 34px;
    line-height: 60px;
  }
  .input_money input{
    height: 60px;
    background: transparent;
  }

  .confirm {
    height: 66px;
    margin: 70px 0 0 0;
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
  .back_top {

    display: flex;
    position: revert;
    height: 84px;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #d2d2d2;
  }
  .add_border{
    border-bottom: 1px solid #d2d2d2;
  }
  .back_con {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .back{
    width: 21px;
    height: 38px;
    background: url("../../assets/img/back.png")no-repeat;
    background-size: contain;
    position: absolute;
    left: 20px;

  }
  .back_top span{
    font-size:32px;
    color: #000000;
    display: block;
  }

  .ico_scuess {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/success_ico.png") no-repeat center;
    background-size: contain;
    margin-bottom: 32px;
  }

  .btn_sure {
    margin: 70px 130px 0 130px;
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
  .hind_money {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin:10px 0 0 200px ;
    color: #9a9a9a;
    font-size: 26px;
  }

  input::-webkit-input-placeholder {
    font-size: 40px;
    opacity: 1;
  }

  /* WebKit browsers */
  input:-moz-placeholder {
    font-size: 40px;
    opacity: 1;
  }

  /* Mozilla Firefox 4 to 18 */
  input::-moz-placeholder {
    font-size: 40px;
    opacity: 1;
  }

  /* Mozilla Firefox 19+ */
  input:-ms-input-placeholder {
    font-size: 40px;
    opacity: 1;
  }

  /* Mozilla Firefox 19+ */

</style>
