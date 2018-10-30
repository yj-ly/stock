<template>
  <div class="protectMoney" :style="{height:calc}">

    <!--返回-->
    <publick-head style="background:#ffffff">
      <div slot="bakc" class="back"></div>
      <span slot="title" v-if="showNum == 0">补保</span>
      <span slot="title" v-if="showNum == 1">取保</span>
    </publick-head>

    <!--main-->
    <div class="main">

      <div class="recharge_input">
        <span>金额</span>
        <div class="money">
          <i>￥</i>
          <input type="text" :placeholder="hintMessage" maxlength="8" v-model="coverModel.money">
          <!--<span class="min_money" v-if="showNum == 0">最小补保金额{{minMoney}}元</span>-->
          <span v-if="showNum == 1 && outMaxMoney > 0" class="all_money" @click="allOut">全部取出</span>
          <span v-if="showNum == 0" class="all_money" @click="allEnter">直接补入</span>
        </div>
      </div>

      <!--money詳情-->
      <div class="money_detail">
        <div class="money_item" v-if="showNum == 0">
          <span class="item_left">现价</span>
          <div class="right">
            <span>￥{{Number(coverInfo.now_price).toFixed(2)}}</span>
          </div>
        </div>
        <div class="money_item" v-else>
          <span class="item_left">昨收</span>
          <div class="right">
            <span>￥{{Number(coverInfo.yesterday_price).toFixed(2)}}</span>
          </div>
        </div>
        <div class="money_item">
          <span class="item_left">持股股数</span>
          <div class="right">
            <span>{{coverInfo.num}}</span>
          </div>
        </div>
        <div class="money_item" v-if="firstInput">
          <span class="item_left">预警线</span>
          <div class="right">
            <span>￥{{newWaringAllMoney}}</span>
          </div>
        </div>
        <div class="money_item" v-if="firstInput">
          <span class="item_left">平仓线</span>
          <div class="right">
            <span>￥{{newStockContract}}</span>
          </div>
        </div>

        <div class="money_item" v-if="!firstInput">
          <span class="item_left">预警线</span>
          <div class="right">
            <span>￥{{intWarningMoney}}</span>
          </div>
        </div>
        <div class="money_item" v-if="!firstInput">
          <span class="item_left">平仓线</span>
          <div class="right">
            <span>￥{{intOpenMoney}}</span>
          </div>
        </div>
        <div class="money_item">
          <span class="item_left">保证金</span>
          <div class="right">
            <span>￥{{Number(coverInfo.margin_money).toFixed(2)}}</span>
          </div>
        </div>
      </div>


    </div>

    <p v-if="showNum == 0" class="hint_bot">注:最小补保金额 = 现价 * 持股股数 * 10%</p>
    <p v-else class="hint_bot">注:最大取保金额 = 保证金 - 昨收 * 持股股数 * 10%</p>
    <div class="btn" v-if="showNum == 0 && !btnSure" @click="promiseSet()">我要补保</div>
    <div class="btn" v-if="showNum == 1 && !btnSure " @click="promiseSet()">我要取保</div>
    <div class="btn_sure" v-if="btnSure ">
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
  import publickHead from '@/components/publick/publickHead'
  import hintModel from '@/components/publick/hintModel'
  import loading from '../../components/publick/loading'
  import {coverPromise, promiseBtn} from "../../api/user";

  export default {
    name: "protectMoney",
    data() {
      return {

        showNum: 0,    //判斷顯示那一個
        errorMessage: '',   //錯誤信息
        showSuccess: false,   //正確的時候提醒
        hintMessage: '',       //默认提示信息
        coverInfo: {},
        coverModel: { //传输的信息
          way: 0,
          money:'',
          order_no: '',
        },
        firstInput: false,    //第一次输入
        intWarningMoney: 0,   //初始化计算数据
        intOpenMoney: 0,      //初始化计算数据
        newWaringAllMoney: 0,    //展示的新预警总价
        newStockContract: 0,      //新的平仓价格
        btnOnce: true,
        minMoney: 0,
        btnSure: false,   //判断用户是否点击按钮
        outMaxMoney:0,

      }
    },
    mounted: function () {
      this.showNum = this.$route.params.typeNum;
      this.coverModel.order_no = this.$route.params.no;

      this.$store.commit('openLoading');

      this.getInfo();


    },
    methods: {
      /** 11:39
       *   @author: yuanjie
       *   @description:获取信息
       *   @param
       */
      getInfo() {
        coverPromise({'order_no': this.$route.params.no}).then(res => {
          if (res.data.status == 0) {
            this.coverInfo = res.data.data;
            if(this.showNum == 0){
              this.minMoney = Number(this.coverInfo.market_value * 0.1).toFixed(2);
              this.hintMessage = '最小补保金额' + this.minMoney ;
            }else{
              this.outMaxMoney = (Number(this.coverInfo.margin_money) -  (this.coverInfo.yesterday_price * this.coverInfo.num * 0.1)).toFixed(2);
              this.outMaxMoney = this.outMaxMoney <= 0 ? '0': this.outMaxMoney;
              this.hintMessage = '最大取保金额' + this.outMaxMoney;
            }
            // if(this.showNum == 1){
            //     this.outMinMoney = ((Number(this.coverInfo.margin_money) + Number(this.coverInfo.yesterday_price)) * this.coverInfo.num * 0.1).toFixed(2);
            // }
            this.intWarningMoney = Number(((Number(this.coverInfo.total_buy_money) - Number(this.coverInfo.total_sell_money)) - ((Number(this.coverInfo.margin_money) + Number(this.coverModel.money)))) * (1 - Number(this.coverInfo.stock_warning)) / this.coverInfo.num).toFixed(2);
            if(this.intWarningMoney < 0)  this.intWarningMoney = 0;
            this.intOpenMoney = Number(((Number(this.coverInfo.total_buy_money) - Number(this.coverInfo.total_sell_money)) - ((Number(this.coverInfo.margin_money) + Number(this.coverModel.money)))) * (1 - Number(this.coverInfo.stock_coerce)) / this.coverInfo.num).toFixed(2);
            if(this.intOpenMoney < 0) this.intOpenMoney = 0;
            this.$store.commit('closeLoading');
          } else {
            this.$store.commit('closeLoading');
          }
        })
      },
      /** 14:30
       *   @author: yuanjie
       *   @description:实时修改价格
       *   @param{number} 价格
       *   @param{number} 判断当前是补保还是取保
       */
      changeMoney(val, typeNum) {
        var val = (val * 1);

        if (typeNum == 0) {   //补保的计算
          let allWaring = ((Number(this.coverInfo.total_buy_money) - Number(this.coverInfo.total_sell_money)) - ((Number(this.coverInfo.margin_money) + Number(this.coverModel.money)))) * (1 - Number(this.coverInfo.stock_warning));
          if (allWaring / this.coverInfo.num <= 0) {
            this.newWaringAllMoney = 0;
          } else {
            this.newWaringAllMoney = (allWaring / this.coverInfo.num).toFixed(2);
          }

          let stockContract = ((Number(this.coverInfo.total_buy_money) - Number(this.coverInfo.total_sell_money)) - ((Number(this.coverInfo.margin_money) + Number(this.coverModel.money)))) * (1 - Number(this.coverInfo.stock_coerce));
          if (stockContract / this.coverInfo.num <= 0) {
            this.newStockContract = 0;
          } else {
            this.newStockContract = (stockContract / this.coverInfo.num).toFixed(2);
          }
        } else { //取保计算
          let allWaring = ((Number(this.coverInfo.total_buy_money) - Number(this.coverInfo.total_sell_money)) - ((Number(this.coverInfo.margin_money) - Number(this.coverModel.money)))) * (1 - Number(this.coverInfo.stock_warning));
          if (allWaring / this.coverInfo.num <= 0) {
            this.newWaringAllMoney = 0;
          } else {
            this.newWaringAllMoney = (allWaring / this.coverInfo.num).toFixed(2);
          }

          let stockContract = ((Number(this.coverInfo.total_buy_money) - Number(this.coverInfo.total_sell_money)) - ((Number(this.coverInfo.margin_money) - Number(this.coverModel.money)))) * (1 - Number(this.coverInfo.stock_coerce));
          if (stockContract / this.coverInfo.num <= 0) {
            this.newStockContract = 0;
          } else {
            this.newStockContract = (stockContract / this.coverInfo.num).toFixed(2);
          }
        }
      },
      /** 15:56
       *   @author: yuanjie
       *   @description:补保和取保
       *   @param
       */
      promiseSet() {
        this.coverModel.way = this.showNum;
        if (this.coverModel.money == '') {
          this.$refs.message.showModel = true;
          this.errorMessage = '请输入金额';
          return false;
        }
        if (this.coverModel.money == 0) {
          this.$refs.message.showModel = true;
          this.errorMessage = '金额不能为0';
          return false;
        }
        if (Number(this.coverModel.money) < Number(this.minMoney) && this.$route.params.typeNum == 0) {
          this.$refs.message.showModel = true;
          this.errorMessage = '金额不能小于最小补保金额';
          return false;
        }
        if(this.$route.params.typeNum == 1){
            if(this.outMaxMoney <=0 ){
              this.$refs.message.showModel = true;
              this.errorMessage = '当前可取金额为0';
              return false;
            }

            if(this.coverModel.money > this.outMaxMoney ){
              this.$refs.message.showModel = true;
              this.errorMessage = '取保金额大于最大取保金额';
              return false;
            }
        }
        if (this.btnOnce) {
          this.btnOnce = false;
          this.btnSure = true;
          setTimeout(() => {
            promiseBtn(this.coverModel).then(res => {
              if (res.data.status == 0) {
                this.$refs.message.showModel = true;
                this.showSuccess = true;
                this.errorMessage = res.data.msg;
                this.btnOnce = true;
                this.btnSure = false;
                coverPromise({'order_no': this.$route.params.no}).then(res => {
                  if (res.data.status == 0) {
                    this.coverInfo = res.data.data;
                    this.minMoney = Number(this.coverInfo.market_value * 0.1).toFixed(2);
                    this.intWarningMoney = Number(((Number(this.coverInfo.total_buy_money) - Number(this.coverInfo.total_sell_money)) - ((Number(this.coverInfo.margin_money) + Number(this.coverModel.money)))) * (1 - Number(this.coverInfo.stock_warning)) / this.coverInfo.num).toFixed(2);
                    if(this.intWarningMoney < 0)  this.intWarningMoney = 0;
                    this.intOpenMoney = Number(((Number(this.coverInfo.total_buy_money) - Number(this.coverInfo.total_sell_money)) - ((Number(this.coverInfo.margin_money) + Number(this.coverModel.money)))) * (1 - Number(this.coverInfo.stock_coerce)) / this.coverInfo.num).toFixed(2);
                    if(this.intOpenMoney < 0) this.intOpenMoney = 0;
                    setTimeout(() => {
                      this.$router.push({name:'positions'});
                    },2000)
                  } else {
                  }
                })

              } else {
                this.$refs.message.showModel = true;
                this.errorMessage = res.data.msg;
                this.btnOnce = true;
                this.btnSure = false;
              }
            })
          },1000)

        }

      },
      /** 18:29
       *   @author: yuanjie
       *   @description:全部取出
       *   @param
       */
      allOut() {
        this.coverModel.money = String(this.outMaxMoney);
      },
      /** 10:58
        *   @author: yuanjie
        *   @description:直接补入
        *   @param
        */
      allEnter(){
        this.coverModel.money = String(this.minMoney);
      }


    },
    components: {
      publickHead,
      hintModel,
      loading

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
    watch: {
      'coverModel.money': function (newVal) {
        let val = String(newVal);
        this.firstInput = true;
        if (val == '' || val == 0) {
          this.coverModel.money = '';
          this.newWaringAllMoney = 0;
          this.newStockContract = 0;
          this.firstInput = false;
          return false;
        }

        this.coverModel.money = this.coverModel.money.replace(/[^\d.]/g, "");
//保证只有出现一个.而没有多个.
        this.coverModel.money = this.coverModel.money.replace(/\.{2,}/g, ".");
//必须保证第一个为数字而不是.
        this.coverModel.money = this.coverModel.money.replace(/^\./g, "");
//保证.只出现一次，而不能出现两次以上
        this.coverModel.money = this.coverModel.money.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
//只能输入两个小数
        this.coverModel.money = this.coverModel.money.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
        this.changeMoney(val, this.showNum);


      }
    }
  }
</script>

<style scoped>
  .protectMoney {
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
    width: 300px;
    line-height: 76px;
    color: #000000;
    font-size: 48px;
  }

  .recharge_input i {
    font-size: 40px;
  }

  .money {
    position: relative;
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

  .all_money {
    position: absolute;
    right: 54px;
    font-size: 28px !important;
    color: #00a0e9 !important;
  }

  .ico_success {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/success_ico.png") no-repeat center;
    background-size: contain;
    margin-bottom: 32px;
  }

  .min_money {
    color: #eb0505 !important;
    font-size: 24px !important;
    position: absolute;
    right: 54px;
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
  .hint_bot {
      color: #eb0505;
      font-size: 26px;
    margin: 20px 0 0 50px;
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
