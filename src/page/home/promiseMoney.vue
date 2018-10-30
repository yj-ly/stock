<template>
  <div class="promiseMoney" :style="{height:calc}">
    <!--返回-->
    <publick-head style="background:#ffffff">
      <div slot="bakc" class="back"></div>
      <span slot="title" v-if="showNum == 0">追加保证金</span>
      <span slot="title" v-if="showNum == 1">追加策略金</span>
    </publick-head>

    <!--main-->
    <div class="main">

      <!--追加保证金-->

      <!--<div class="recharge_input">-->
      <!--<span>金额</span>-->
      <!--<div class="money">-->
      <!--<i>￥</i>-->
      <!--<input type="text" placeholder="提现金额不得<￥100" maxlength="8">-->
      <!--</div>-->
      <!--</div>-->

      <div class="money" v-if="showNum == 0">
        <div class="recharge_input">
          <span>金额</span>
          <div class="money">
            <i>￥</i>
            <input type="text" placeholder="请输入追加保证金" maxlength="8" v-model="strategyModel.money">
          </div>
        </div>

        <div class="money_detail">
          <div class="money_item">
            <span class="item_left">保证金</span>
            <div class="right">

              <span>￥{{promiseMsg.deposit}} +<i v-if="strategyModel.money >= 0 && strategyModel.money != ''  ">{{strategyModel.money}}</i><i v-if=" strategyModel.money == '' ">0</i></span>
            </div>
          </div>
          <div class="money_item">
            <span class="item_left">策略金</span>
            <div class="right">
              <span>￥{{promiseMsg.strategy_money}} +<i>0</i></span>
            </div>
          </div>
          <div class="money_item">
            <span class="item_left">预警线</span>
            <div class="right">
              <span>￥{{promiseMsg.waining_money}}+ <i>{{(Number(strategyModel.money)  -  Number(strategyModel.money) * Number(promiseMsg.line_waining )).toFixed(2)}}</i></span>
            </div>
          </div>
          <div class="money_item">
            <span class="item_left">平仓线</span>
            <div class="right">
              <span>￥{{promiseMsg.die_money}} +<i>{{(Number(strategyModel.money) - Number(strategyModel.money * promiseMsg.line_die )).toFixed(2)}}</i></span>
            </div>
          </div>
          <div class="money_item">
            <span class="item_left">总操盘资金</span>
            <div class="right">
              <span>￥{{promiseMsg.total_money}} +<i>{{Number(strategyModel.money)}}</i></span>
            </div>
          </div>
          <div class="money_item">
            <span class="item_left">总操盘资金余额</span>
            <div class="right">
              <span>￥{{promiseMsg.total_balance}}+<i>{{Number(strategyModel.money)}}</i></span>
            </div>
          </div>
          <div class="money_item">
            <span class="item_left">递延费</span>
            <div class="right">
              <span><i>￥0</i></span>
            </div>
          </div>
          <div class="money_item all_money">
            <span class="item_left">支付总金额</span>
            <div class="right">
              <span><i>￥{{( Number(strategyModel.money)).toFixed(2)}}</i></span>
            </div>
          </div>
        </div>
      </div>


      <!--追加策略金-->

      <div class="money" v-if="showNum == 1">
        <div class="recharge_input">
          <span>金额</span>
          <div class="money">
            <i>￥</i>
            <input type="text" :placeholder="'追加金额最小' +(promiseMsg.min) + '最大'+(promiseMsg.max)" maxlength="8"
                   v-model="strategyModel.money">
          </div>
        </div>

        <div class="money_detail">
          <div class="money_item">
            <span class="item_left">保证金</span>
            <div class="right">
              <span>￥{{promiseMsg.deposit}} +<i v-if="strategyModel.money >= 0 && strategyModel.money != ''  ">{{strategyModel.money}}</i><i v-if=" strategyModel.money == '' ">0</i></span>
            </div>
          </div>
          <div class="money_item">
            <span class="item_left">策略金</span>
            <div class="right">
              <span>￥{{promiseMsg.strategy_money}} +<i>{{strategyModel.money * multiple}}</i></span>
            </div>
          </div>
          <div class="money_item">
            <span class="item_left">预警线</span>
            <div class="right">
              <span>￥{{promiseMsg.waining_money}}+ <i>{{(Number(strategyModel.money) + Number(strategyModel.money ) * Number(multiple) -  Number(strategyModel.money) * Number(promiseMsg.line_waining)).toFixed(2)}}</i></span>
            </div>
          </div>
          <div class="money_item">
            <span class="item_left">平仓线</span>
            <div class="right">
              <span>￥{{promiseMsg.die_money}} +<i>{{(Number(strategyModel.money) + Number(strategyModel.money ) * Number(multiple) - Number(strategyModel.money * promiseMsg.line_die )).toFixed(2)}}</i></span>
            </div>
          </div>
          <div class="money_item">
            <span class="item_left">总操盘资金</span>
            <div class="right">
              <span>￥{{promiseMsg.total_money}} +<i>{{(Number(strategyModel.money) + Number(strategyModel.money ) * Number(multiple)).toFixed(2)}}</i></span>
            </div>
          </div>
          <div class="money_item">
            <span class="item_left">总操盘资金余额</span>
            <div class="right">
              <span>￥{{promiseMsg.total_balance}}+<i>{{(Number(strategyModel.money) + Number(strategyModel.money ) * Number(multiple)).toFixed(2)}}</i></span>
            </div>
          </div>
          <div class="money_item">
            <span class="item_left">递延费</span>
            <div class="right">
              <span><i>￥{{(strategyModel.money * multiple * rate).toFixed(2)}}</i></span>
            </div>
          </div>
          <div class="money_item all_money">
            <span class="item_left ">支付总金额</span>
            <div class="right">
              <span><i>￥{{((strategyModel.money * multiple * rate) + Number(strategyModel.money)).toFixed(2)}}</i></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--保证金追加按钮-->
    <div class="btn" v-if="showNum == 0 && !btnSure" @click="addMoney(0)">我要追加</div>
    <!--策略金追加按钮-->
    <div class="btn" v-if="showNum == 1 && !btnSure" @click="addMoney(1)">我要追加</div>

    <div class="btn_sure" v-if="btnSure">
      <i></i>
    </div>



    <!--提示信息-->
    <hint-model ref="message">
      <p class="title" slot="title">{{errorMessage}}</p>
      <div class="ico_success" slot="ico" v-if="showSuccess"></div>
    </hint-model>

    <!--loading-->
    <loading ref="loading"></loading>
  </div>
</template>

<script>
  import {addPromiseMoney, getPromiseMsg} from "../../api";
  import publickHead from '@/components/publick/publickHead'
  import hintModel from '@/components/publick/hintModel'
  import loading from '../../components/publick/loading'

  export default {
    name: "promiseMoney",
    data() {
      return {
        showNum: 0,  //判断那个展示
        errorMessage: '',//提示信息
        showSuccess: false,  //成功
        calcHeight: 0,        //页面高度
        contract_no: '',        //策略编号
        promiseMsg: {},       //页面数据

        multiple: 0,          //追加策略金的倍数
        rate: 0,              //追加策略金的费率
        strategyModel: {
          contract_no: '',
          money: '',
          type: 0,
        },
        btnOnce: true,       //按钮只可以点击一次
        timer:null,    //定时器
        btnSure: false,   //判断用户是否点击按钮


      }
    },
    mounted: function () {
      this.$store.commit('openLoading');
      this.strategyModel.contract_no = this.$route.params.contractNo;
      if (this.$route.params.typeNum == 0) {
        this.strategyModel.type = 0;
      } else {
        this.strategyModel.type = 1;
      }
      this.showNum = this.$route.params.typeNum;
      this.getParamsContract();
    },
    methods: {
      /** 16:57
       *   @author: yuanjie
       *   @description:获取保证金和策略金的参数
       *   @param
       */
      getParamsContract() {
        getPromiseMsg({contract_no: this.$route.params.contractNo}).then(res => {
          if (res.data.status == 0) {
            this.promiseMsg = res.data.data;
            this.rate = this.promiseMsg.deferred_charge_rate;
            this.multiple = this.promiseMsg.multiple;
            this.$store.commit('closeLoading');
          } else {
            this.$store.commit('closeLoading');
          }
        })
      },

      /** 15:51
       *   @author: yuanjie
       *   @description:追加金额
       *   @param{num} 判断当前点击是那一个按钮
       */
      addMoney(num) {

        this.strategyModel.type = num;
        if (this.strategyModel.money == '') {
          this.$refs.message.showModel = true;
          this.showSuccess = false;
          this.errorMessage = '金额为空';
          return false;
        } else {
          if (this.strategyModel.type == 1) {
            if (Number(this.strategyModel.money) < Number(this.promiseMsg.min)) {
              this.$refs.message.showModel = true;
              this.errorMessage = '金额小于最小金额';
              return false
            }
            if (Number(this.strategyModel.money) > Number(this.promiseMsg.max)) {
              this.$refs.message.showModel = true;
              this.errorMessage = '金额大于最大金额';
              return false
            }
          }
          if (this.btnOnce) {
            this.btnSure = true;
            setTimeout(() => {
              addPromiseMoney(this.strategyModel).then(res => {
                this.btnOnce = false;
                if (res.data.status == 0) {
                  this.$refs.message.showModel = true;
                  this.showSuccess = true;
                  this.errorMessage = res.data.msg;
                  this.btnSure = false;
                  this.btnOnce = true;
                  setTimeout(() => {
                    this.$router.push({name:'contract'});
                  },2000)
                } else {
                  this.$refs.message.showModel = true;
                  this.errorMessage = res.data.msg;
                  this.btnOnce = true;
                  this.btnSure = false;
                }
              })
            },1000)

          }
        }

      },
      /** 14:17
        *   @author: yuanjie
        *   @description:点击支付之后一直去监听支付状态
        *   @param
        */
      monitorApplyType(){

          this.timer = setInterval(() => {



          },1000)
      }
    },
    computed: {
      /** 15:36
       *   @author: yuanjie
       *   @description:计算页面最小的高度
       *   @param
       */
      calc() {
        return document.documentElement.clientHeight + 'px';
      }
    },
    components: {
      publickHead,
      hintModel,
      loading
    },
    destroyed(){
      if(this.timer != null){
        clearInterval(this.timer);
      }
    },
    watch: {
      'strategyModel.money': function (newVal, oldVal) {
        let val = newVal;
        this.strategyModel.money = this.strategyModel.money.replace(/[^\d.]/g, "");
//保证只有出现一个.而没有多个.
        this.strategyModel.money = this.strategyModel.money.replace(/\.{2,}/g, ".");
//必须保证第一个为数字而不是.
        this.strategyModel.money = this.strategyModel.money.replace(/^\./g, "");
//保证.只出现一次，而不能出现两次以上
        this.strategyModel.money = this.strategyModel.money.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
//只能输入两个小数
        this.strategyModel.money = this.strategyModel.money.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');


      }
    }
  }
</script>

<style scoped>
  .promiseMoney {

    background: #eeeeee;
  }

  .recharge_input {
    display: flex;
    flex-direction: column;
    padding-left: 38px;
    border-bottom: 2px solid #d2d2d2;
    background: #ffffff;
  }

  .recharge_input span {
    line-height: 76px;
    font-size: 36px;
    color: #333333;
  }

  .recharge_input input {
    margin-left: 30px;
    width: 500px;
    line-height: 76px;
    color: #000000;
    font-size: 48px;
  }

  .recharge_input i {
    font-size: 40px;
  }

  .money_detail {
    background: #ffffff;
    padding: 20px 50px;
    font-size: 28px;
    color: #5b5b5b;
    margin-top: 10px;
  }

  .money_item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
  }

  .money_item:last-child {
    margin: 0;
  }

  .btn {
    margin: 100px 120px 0 120px;
    color: #ffffff;
    font-size: 26px;
    text-align: center;
    line-height: 66px;
    height: 66px;
    border-radius: 40px;
    background: #eb0505;
  }

  .money_detail i {
    color: #eb5050;

  }
  .all_money .right i  {
      font-size: 36px;
      font-weight: bolder;
      color: #000000;
  }

  .btn_sure {
    margin: 100px 120px 0 120px;
    height: 66px;
    background: #e70012;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 40px;
  }
  .btn_sure i{
    display: block;
    width: 50px;
    height: 50px ;
    background: url("../../assets/img/btn_ico.gif") no-repeat center;
    background-size: contain;
  }

  .ico_success {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/success_ico.png") no-repeat center;
    background-size: contain;
    margin-bottom: 32px;
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

</style>
