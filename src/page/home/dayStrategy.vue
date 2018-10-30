<template>
  <div class="daystrategy_con">
    <!--头部-->

    <!--主体区域-->
    <div class="main">
      <publick-head>
        <div slot="bakc" class="back"></div>
        <span slot="title">创建策略</span>
      </publick-head>

      <div :style="{'height':calcHeight}" class="con">
        <div class="title_d">{{detailMessage.name}}</div>
        <div class="promise">
          <span>保证金</span>
          <span>100%实盘交易</span>
        </div>
        <div class="input_money">
          <input type="text" :placeholder=hint v-model="schemeModel.deposit">
        </div>
        <!--<div class="daystrategy_money">-->
        <!--<span>策略金额</span>-->
        <!--<i>{{schemeModel.strategy_money}}元</i>-->
        <!--</div>-->
        <div class="scheme">
          <span>策略倍数</span>
          <div class="scheme_item">
            <div class="scheme_top">
              <div v-for="(item,index) in newArray" @click="setMultiple(item,index)"
                   :class="{'ac':item.no == numClass}">
                {{item.multiple}}
              </div>
              <div v-for="item2 in notClickArray" class="not_click" @click="notClickHind">
                <span>{{item2.multiple}}</span></div>
            </div>
          </div>
        </div>
        <div class="scheme_detal">
          <div>
            <span>策略金额</span>
            <div class="right">
              <span>￥{{schemeModel.strategy_money}}</span>
            </div>
          </div>
          <div>
            <span>总操盘资金</span>
            <div class="right">
              <span>￥{{schemeModel.total_money}}</span>
            </div>
          </div>
          <div>
            <span>预警线</span>
            <div class="right">
              <span>￥{{schemeModel.waining_money}}</span>
            </div>
          </div>
          <div>
            <span>平仓线</span>
            <div class="right">
              <span>￥{{schemeModel.die_money}}</span>
            </div>
          </div>
          <div>
            <span>递延费</span>
            <div class="right">
              <span>￥{{schemeModel.deferred_charge}}</span>
            </div>
          </div>
          <div class="last">
            <span>生效时间</span>

            <!--<span>0.00元/交易日</span>-->
            <span @click="changTime(0)"><i :class="{'ac_ico':schemeModel.start_type == 0}"></i>即时生效</span>
            <span @click="changTime(2)"><i :class="{'ac_ico':schemeModel.start_type == 2}"></i>下一交易日生效</span>

          </div>
          <div class="cover">
            <span>其它</span>
            <span @click="setAutoCover"><i :class="{'ac_ico':schemeModel.is_auto == 1}"></i>自动补保</span>
          </div>
        </div>

        <!--说明-->
        <div class="explain">
          <span>策略说明:</span>
          <p>{{detailMessage.discript}}</p>
        </div>

      </div>
    </div>
    <!--支付-->
    <div class="strategy_bot">
      <router-link :to="{name:'about',params:{typeNum:2}}" tag="div" class="img">
        <img src="../../assets/img/protocol.png" alt="" @click="">
      </router-link>

      <div class="btn_con">
        <div class="order_money">
          共计确认支付: <i>{{schemeModel.total_pay_money}}元</i>
        </div>
        <div class="btn" @click="apply" v-if="!btnSure">
          确认支付
        </div>
        <div class="btn_sure" v-else>
          <i></i>
        </div>
      </div>
    </div>

    <!--提示-->
    <hint-model ref="message">
      <p class="title" slot="title">{{errorMessage}}</p>
      <div slot="ico" v-if="successIco" class="ico_success"></div>
    </hint-model>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
  import hintModel from '@/components/publick/hintModel'
  import {createScheme, getRate, getScheme} from "../../api";
  import publickHead from '@/components/publick/publickHead'

  export default {
    name: "dayStrategy",
    data() {
      return {
        numClass: 0,  //选中位数的值
        schemeModel: {//策略模型
          deferred_charge: 0,  //递延费
          deferred_charge_rate: 0,  //递延费费率
          deposit: '',  //保证金
          die_money: 0,  //平仓线
          waining_money: 0,  //警戒线
          is_auto: 0,  //是否自动补仓（false：否，true：是）
          start_type: 0,  //生效时间类型（0：自然日，1:交易日）
          multiple: 0,  //策略倍数
          product_no: 0,  //产品no
          product_rate_no: 0,  //产品倍数no
          total_money: 0,  //总操盘资金
          total_pay_money: 0,  //总计支付金额
          strategy_money: 0,  //策略金
          first_settle_cycle: 0,   //初次结算周期
        },
        newArray: [],     //新的数组
        notClickArray: [],   //不可以点击的数组
        timer: null,     //定时器
        hint: '',       //提示信息
        closeNum: 0,     //平仓费率
        waringNum: 0,    //预警费率
        successIco: false,  //成功提示
        errorMessage: '',   //提示信息
        detailMessage: {},   //返回的详情
        scheme: {},
        reBtn: true,        //以免用户重复支付
        firstMoney: 0,
        oHead: null,
        oBottom: null,
        oDivHeight: 0,
        btnSure: false,   //判断用户是否点击按钮
        clickIndex: null,
      }
    },
    created: function () {
      this.getRate();
      this.getScheme(this.$route.params.schemId)

    },
    mounted: function () {
      this.oHead = document.getElementsByClassName('head_con')[0];
      this.oBottom = document.getElementsByClassName('strategy_bot')[0];
      this.oDivHeight = Number(this.oHead.offsetHeight) + Number(this.oBottom.offsetHeight);
    },
    methods: {
      /** 19:30
       *   @author: yuanjie
       *   @description:获取策略产品
       *   @param
       */
      getScheme(id) {
        getScheme({'product_no': id}).then(res => {
          if (res.data.status == 0) {
            this.detailMessage = res.data.data;
            this.scheme = res.data.data;
            this.newArray = this.scheme.rates;
            if (this.newArray.length > 0) {
              // this.numClass = this.newArray[0].no;
              // this.schemeModel.multiple = this.newArray[0].multiple;
              // this.schemeModel.deferred_charge_rate = this.newArray[0].rate;//获取每个倍数递延费的费率
              // this.schemeModel.product_rate_no = this.newArray[0].no;
              // this.setMoney();
            }
            // this.schemeModel.multiple = this.scheme.rates[0].multiple;  //获取默倍的位数
            this.schemeModel.product_no = this.scheme.no;   //获取产品编号
            // this.schemeModel.deferred_charge_rate = this.scheme.rates[0].rate;   //获取每个倍数递延费的费率
            // this.schemeModel.product_rate_no = this.scheme.rates[0].no;
            this.hint = '最小金额' + this.scheme.min_deposit + '最大金额' + this.scheme.max_deposit;
            this.schemeModel.first_settle_cycle = this.scheme.first_settle_cycle;

          }
        })
      },
      /** 13:36
       *   @author: yuanjie
       *   @description:获取平仓线的费率和预警线的费率
       *   @param
       */
      getRate() {
        getRate().then(res => {
          if (res.data.status == 0) {
            this.closeNum = res.data.contract_coerce;
            this.waringNum = res.data.contract_warning;
          }
        })
      },
      //去支付
      apply() {
        if (this.schemeModel.deposit == '') {
          this.$refs.message.showModel = true;
          this.errorMessage = '请完善内容';
        } else {
          if(this.schemeModel.total_pay_money <= 0){
            this.$refs.message.showModel = true;
            this.errorMessage = '请完善内容';
          }
          else if (Number(this.schemeModel.deposit) < Number(this.scheme.min_deposit)) {
            this.$refs.message.showModel = true;
            this.errorMessage = '金额小于最小金额';
          } else if (Number(this.schemeModel.deposit) > Number(this.scheme.max_deposit)){
            this.$refs.message.showModel = true;
            this.errorMessage = '金额大于最大金额';
          }else {
            if (this.reBtn) {
              this.reBtn = false;
              this.btnSure = true;
              setTimeout(() => {
                createScheme(this.schemeModel).then(res => {
                  if (res.data.status == 0) {
                    this.$refs.message.showModel = true;
                    this.successIco = true;
                    this.errorMessage = res.data.msg;
                    this.btnSure = false;
                    this.reBtn = true;
                    setTimeout(() => {
                      this.$router.push({name: 'homeIndex'});
                    }, 2000)
                  } else {
                    this.$refs.message.showModel = true;
                    this.errorMessage = res.data.msg;
                    this.reBtn = true;
                    this.btnSure = false;
                  }
                })
              }, 1000)

            }


          }
        }
        // this.$router.push('apply');
      },
      /** 10:23
       *   @author: yuanjie
       *   @description:选择位数
       *   @param{object}当前对象
       *   @param{number}下标
       */
      setMultiple(item, index) {
        this.clickIndex = index;
        this.hint = '最小金额' + this.scheme.min_deposit + '最大金额' + item.max_deposit;
        this.numClass = item.no;
        this.schemeModel.multiple = item.multiple;
        this.schemeModel.deferred_charge_rate = item.rate;
        this.schemeModel.product_rate_no = item.no;
        this.setMoney();
        // this.schemeModel.deferred_charge =this.judegMoney(this.schemeModel.strategy_money* this.schemeModel.deferred_charge_rate); //递延费

      },
      /** 13:20
       *   @author: yuanjie
       *   @description:
       *   @param{number}金额
       */
      judegMoney(money) {

        return Math.round(money * 100) / 100;

      },
      /** 14:24
       *   @author: yuanjie
       *   @description:设置金额
       *   @param
       */
      setMoney() {
        this.schemeModel.strategy_money = this.schemeModel.deposit * this.schemeModel.multiple; //策略金额
        this.schemeModel.total_money = this.judegMoney(this.schemeModel.strategy_money + Number(this.schemeModel.deposit)); //操盘金额
        this.schemeModel.waining_money = this.judegMoney((this.schemeModel.total_money - this.schemeModel.deposit * this.waringNum)); //亏损预警线
        this.schemeModel.die_money = this.judegMoney(this.schemeModel.total_money - this.schemeModel.deposit * this.closeNum); //亏损平仓线
        this.schemeModel.deferred_charge = this.judegMoney(this.schemeModel.strategy_money * this.schemeModel.deferred_charge_rate * this.schemeModel.first_settle_cycle); //递延费
        this.schemeModel.total_pay_money = this.judegMoney(Number(this.schemeModel.deposit) + Number(this.schemeModel.deferred_charge));
      },
      /** 14:04
       *   @author: yuanjie
       *   @description:修改生效时间
       *   @param{number}传入数字
       */
      changTime(num) {
        this.schemeModel.start_type = num;
      },
      /** 15:47
       *   @author: yuanjie
       *   @description:自动补仓
       *   @param
       */
      setAutoCover() {
        if (this.schemeModel.is_auto == 0) {
          this.schemeModel.is_auto = 1;
        } else {
          this.schemeModel.is_auto = 0;
        }
      },
      /** 19:25
       *   @author: yuanjie
       *   @description:点击不可以选中的倍数的时候
       *   @param
       */
      notClickHind() {
        this.$refs.message.showModel = true;
        this.errorMessage = '当前倍数不可用';
      }


    },
    components: {
      publickHead,
      hintModel
    },
    computed: {
      //获取当前的高度
      calcHeight() {
        return document.documentElement.clientHeight - this.oDivHeight + 'px';

      }

    },
    watch: {
      'schemeModel.deposit': function (newVal, oldVal) {
        let val = String(newVal);
        this.schemeModel.deposit = val.replace(/\D/g, '');
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.newArray = this.scheme.rates.filter((item) => {
            return Number(item.max_deposit) >= Number(val);
          })
          this.notClickArray = this.scheme.rates.filter((item) => {
            return Number(item.max_deposit) < Number(val);
          })
          if (this.clickIndex != null) {
            let clickMoney = this.scheme.rates[this.clickIndex].max_deposit;
            if (Number(this.schemeModel.deposit) <= Number(clickMoney)) {
              this.numClass = this.newArray[this.clickIndex].no;
              this.schemeModel.multiple = this.newArray[this.clickIndex].multiple;
              this.schemeModel.deferred_charge_rate = this.newArray[this.clickIndex].rate;//获取每个倍数递延费的费率
              this.schemeModel.product_rate_no = this.newArray[this.clickIndex].no;
              this.setMoney();
            } else {
              this.numClass = '';
              this.schemeModel.multiple = '';
              this.schemeModel.deferred_charge_rate = 0;
              this.schemeModel.product_rate_no = '';
              this.schemeModel.strategy_money = 0; //策略金额
              this.schemeModel.total_money = 0; //操盘金额
              this.schemeModel.waining_money = 0; //亏损预警线
              this.schemeModel.die_money = 0; //亏损平仓线
              this.schemeModel.deferred_charge = 0; //递延费
              this.schemeModel.total_pay_money = 0;
            }
          }
          // else{
          //
          //   if (Number(val) >= Number(this.scheme.max_deposit)) {
          //     this.numClass = '';
          //     this.schemeModel.multiple = '';
          //     this.schemeModel.deferred_charge_rate = 0;
          //     this.schemeModel.product_rate_no = '';
          //     this.schemeModel.strategy_money = 0; //策略金额
          //     this.schemeModel.total_money = 0; //操盘金额
          //     this.schemeModel.waining_money = 0; //亏损预警线
          //     this.schemeModel.die_money = 0; //亏损平仓线
          //     this.schemeModel.deferred_charge = 0; //递延费
          //     this.schemeModel.total_pay_money = 0;
          //
          //   }else{
          //
          //   }
          // }


        }, 200)
        //  else {
        //   this.schemeModel.strategy_money = 0;
        //   this.schemeModel.total_money = 0;
        //   this.schemeModel.waining_money = 0;
        //   this.schemeModel.die_money = 0;
        //   this.schemeModel.deferred_charge = 0;
        // }

      },
      'newArray': function () {

      }
    }
  }
</script>

<style scoped>
  .title_d {
    height: 50px;
    text-align: center;
    font-size: 30px;
    line-height: 50px;
    color: #ffffff;
    background: #eb0505;
  }

  .con {
    overflow-y: auto;
  }

  .promise {
    display: flex;
    justify-content: space-between;
    margin: 16px 50px 28px 50px;
    font-size: 28px;
    color: #000000;
  }

  .input_money {
    border: 4px solid #e70012;
    margin: 0 50px 46px 50px;
    border-radius: 40px;
    height: 50px;
  }

  .input_money input {
    width: 100%;
    font-size: 28px;
    color: #000000;
    text-indent: 12px;
    border-radius: 40px;
    height: 50px;
  }

  .daystrategy_money {
    margin: 0 50px;
    display: flex;
    justify-content: space-between;
    padding-bottom: 18px;
  }

  .daystrategy_money span {
    font-size: 24px;
    color: #5b5b5b;
  }

  .daystrategy_money i {
    font-size: 24px;
    color: #000000;
  }

  .scheme {
    margin: 0 15px;
    border-top: 1px solid #d2d2d2;
    padding: 0 35px;
    display: flex;
    flex-direction: column;
  }

  .scheme span {
    font-size: 28px;
    color: #5b5b5b;
    padding: 10px 0 24px 0;
  }

  .scheme_item {
    display: flex;
    flex-direction: column;
  }

  .scheme_top {
    display: flex;
    flex-wrap: wrap;
  }

  .scheme_top div {
    margin: 0 30px 20px 0;
    width: 100px;
    height: 42px;
    color: #5b5b5b;
    font-size: 20px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #d2d2d2;
    line-height: 42px;
  }

  .scheme_top div:nth-child(5n+0) {
    margin: 0;
  }

  .scheme_item .ac {
    background: #e70012;
    color: #ffffff;
  }

  .scheme_detal {
    background: #dddddd;
    padding: 10px 0 158px 0;
  }

  .scheme_detal {
    padding: 0 50px;
    background: #ffffff;
  }

  .scheme_detal div {
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    line-height: 80px;
  }

  .scheme_detal div span {
    font-size: 27px;
    color: #5b5b5b;
  }

  .right div, .right span {
    font-size: 30px !important;
    color: #000000 !important;
    font-weight: 500 !important;
  }

  .last {
    display: flex;
    justify-content: space-between;
  }

  .last span {
    display: flex;
    align-items: center;
  }

  .last span:nth-child(2) i, .last span:nth-child(3) i {
    display: block;
    background: url("../../assets/img/not_checkd.png") no-repeat 0px center;
    background-size: contain;
    height: 26px;
    width: 26px;
    margin-right: 30px;
  }

  .last span:nth-child(2), .last span:nth-child(3) {
    font-size: 30px !important;
    color: #000000 !important;
    font-weight: 500 !important;
  }

  .last .ac_ico {
    background: url("../../assets/img/cofirm_checkd.png") no-repeat !important;
    background-size: contain !important;
    /*display: block !important;*/
    /*height:26px !important;*/
    /*width: 26px !important;*/
  }

  .cover .ac_ico {
    background: url("../../assets/img/cofirm_checkd.png") no-repeat !important;
    background-size: contain !important;
  }

  .cover span:nth-child(2) {
    font-size: 30px !important;
    color: #000000 !important;
    font-weight: 500 !important;
    display: flex;
    align-items: center;
  }

  .cover span:nth-child(2) i {
    display: block;
    background: url("../../assets/img/not_checkd.png") no-repeat 0px center;
    background-size: contain;
    height: 26px;
    width: 26px;
    margin-right: 30px;
  }

  .strategy_bot img {
    height: 50px;
  }

  .btn_con {
    display: flex;
  }

  .strategy_bot {
    display: flex;
    flex-direction: column;
    position: fixed;
    width: 100%;
    bottom: 0;
  }

  .order_money {
    padding: 0 36px 0 36px;
    font-size: 30px;
    color: #4f4f4f;
    background: #ffffff;
    display: flex;
    flex-grow: 1;
    align-items: center;

    /*justify-content: space-between;*/
  }

  .order_money i {
    font-size: 36px;
    color: #000000;
    padding-left: 30px;
  }

  .btn {
    width: 232px;
    font-size: 30px;
    color: #ffffff;
    display: flex;
    align-items: center;
    background: #e70012;
    justify-content: center;
    height: 105px;
  }

  .ico_success {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/success_ico.png") no-repeat center;
    background-size: contain;
    margin-bottom: 32px;
  }

  .explain {
    border-top: 10px solid #eeeeee;
    display: flex;
    flex-direction: column;
    font-size: 26px;
    color: #5b5b5b;
    margin-bottom: 20px;
  }

  .explain span {
    padding: 14px 0 10px 54px;
  }

  .explain p {
    padding: 0 54px 0 54px;
    line-height: 40px;
  }

  .img {
    height: 50px;
  }

  .btn_sure {
    width: 232px;
    height: 105px;
    background: #e70012;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .btn_sure i {
    display: block;
    width: 50px;
    height: 50px;
    background: url("../../assets/img/btn_ico.gif") no-repeat center;
    background-size: contain;
  }

  .not_click {
    background: #eeeeee;
    position: relative;
  }

  .not_click:after {
    content: '';
    position: absolute;
    left: 30px;
    top: 50%;
    display: block;
    width: 40%;
    height: 1px;
    border-bottom: 1px solid #5b5b5b;
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
