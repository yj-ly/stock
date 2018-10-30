<template>
  <div class="position_con" :style="{height:calc}">
    <!--返回-->
    <div content="position_con_top">
      <div class="back_top">
        <div class="back" @click="back()"></div>
        <div class="title_top">策略详情</div>
        <span @click="localUrl('wateRcourse')">策略流水</span>
      </div>

      <router-link to="/homeIndex" tag="div" class="go_home"></router-link>
    </div>


    <!--details-->
    <div class="wrap">
      <div class="list">
        <div class="bot_item">
          <span>策略编号</span>
          <span>{{contractDetail.no}}</span>
        </div>
        <div class="list_top">
          <span>策略类型</span>
          <i class="cash" v-if="contractDetail.settle == 0">按月配资 </i>
          <i class="cash" v-else>按天配资 </i>
        </div>
        <div class="list_bot">
          <div class="bot_item">
            <span class="cash">保证金</span>
            <span class="cash"><i>{{contractDetail.deposit}}</i>元</span>
          </div>
          <div class="bot_item">
            <span>策略倍数</span>
            <span class="cash">{{contractDetail.multiple}}</span>
          </div>
          <div class="bot_item">
            <span>策略金额</span>
            <span class="cash"><i>{{contractDetail.strategy_money}}</i>元</span>
          </div>
        </div>
      </div>
      <div class=" bottom">
        <div class="bot_item">
          <span>单票持仓</span>
          <span>主板A股80%，B股80%，创业板60%</span>
        </div>
        <div class="bot_item">
          <span>总操盘资金</span>
          <span>{{contractDetail.total_money}}元</span>
        </div>
        <div class="bot_item">
          <span>预警线</span>
          <span class="cash"><i> {{contractDetail.line_warning}}</i>元</span>
        </div>
        <div class="bot_item">
          <span>距离预警线</span>
          <span class="cash lose" v-if="contractDetail.far_warning != 'xx'"><i>{{contractDetail.far_warning}}</i>元</span>
          <span class="not" v-else><i>---</i>元</span>
        </div>
        <div class="bot_item">
          <span>平仓线</span>
          <span class="cash"><i> {{contractDetail.line_die}}</i>元</span>
        </div>
        <div class="bot_item">
          <span>距离平仓线</span>
          <span class="cash lose" v-if="contractDetail.far_die != 'xx'"><i>{{contractDetail.far_die}}</i>元</span>
          <span class="not" v-else><i>---</i>元</span>
        </div>
        <div class="bot_item">
          <span>递延费</span>
          <span>{{Number(contractDetail.deferred_charge).toFixed(2)}}</span>
        </div>
        <div class="bot_item">
          <span>总操盘资金余额</span>
          <span>{{contractDetail.total_balance}}元</span>
        </div>
        <div class="bot_item">
          <span>创建时间</span>
          <span>{{contractDetail.created_at}}</span>
        </div>
        <div class="bot_item">
          <span>生效时间</span>
          <span>{{contractDetail.start_at}}</span>
        </div>
        <div class="bot_item">
          <span>结束时间</span>
          <span>{{contractDetail.stop_at}}</span>
        </div>
      </div>
    </div>
    <!--<div class="btn" :style="{'height':calc}" v-if="contractDetail.status == 1 || contractDetail.status == 5 ">-->
      <!--<span @click="overContract">结束策略策略</span>-->
    <!--</div>-->

    <div class="btn_con" v-if="contractDetail.status == 1 || contractDetail.status == 5 ">
      <router-link tag="span" :to="{name:'promiseMoney',params:{typeNum:0,contractNo:contractDetail.no}}" v-if="contractDetail.product_type == 0" >追加保证金</router-link>
      <router-link tag="span" :to="{name:'promiseMoney',params:{typeNum:1,contractNo:contractDetail.no}}" v-if="contractDetail.product_type == 0">追加策略金</router-link>
      <span @click="setContractNo" :class="{'oneCe':contractDetail.product_type == 1}">终止该策略</span>
    </div>

    <!--loading-->
    <loading ref="loading"></loading>

    <!--提示-->
    <hint-model ref="message">
      <p class="title" slot="title">{{errorMessage}}</p>
      <div slot="ico" v-if="successIco" class="ico_success"></div>
    </hint-model>

    <!--是否结束策略-->
    <div class="login_out" v-if="showModelOver">
      <div class="model" @click="showModelOver = false"></div>
      <div class="out_model">
        <p>是否结束该策略</p>
        <i class="ico"></i>
        <div class="loginout_bnt">
          <div class="sure" @click="overContract">确定</div>
          <div class="cancel" @click="showModelOver = false">取消</div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import {contract,overContract} from "../../api";
  import loading from '../../components/publick/loading'
  import hintModel from '@/components/publick/hintModel'

  export default {
    name: "positionDetails",
    data() {
      return {
        calcHeight: 0,  //获取头部的高度
        contract_no: '',   //获取策略详情的no
        contractDetail: {},    //策略详情
        errorMessage:'',      //提示信息
        successIco:false,     //成功提示图片
        btnOnce:true,         //按钮只能点击一次
        showModelOver:false,
      }
    },
    mounted: function () {
      this.$store.commit('openLoading');
      this.contract();
      this.initCalcHeight();
    },
    methods: {
      //返回上一级
      back() {
        this.$router.go(-1);
      },
      //跳转到流水
      localUrl(strUrl) {
        this.$router.push({name:strUrl,params:{id:this.$route.params.id}});
      },
      /** 16:01
       *   @author: yuanjie
       *   @description:找到元素的高度
       *   @param
       */
      initCalcHeight() {
        let oHead = document.getElementsByClassName('back_top')[0];
        let oList = document.getElementsByClassName('wrap')[0];
        this.calcHeight = Number(oHead.offsetHeight);
        this.calcHeight += Number(oList.offsetHeight);
      },
      /** 10:55
       *   @author: yuanjie
       *   @description:记录点击的值
       *   @param{object}当前点击的对象
       */
      setContractNo(){
        this.showModelOver = true;
        this.contractNo = this.contract_no;
      },
      /** 9:27
       *   @author: yuanjie
       *   @description:获取策略详情
       *   @param
       */
      contract() {
        contract({contract_no: this.$route.params.id}).then(res => {
          if (res.data.status == 0) {
            this.contractDetail = res.data.data;
            this.$store.commit('closeLoading');
          }
        })
      },
      overContract(){
        this.showModelOver = false;
        if(this.btnOnce){
          this.btnOnce = false;
          overContract({contract_no:this.$route.params.id}).then(res => {
            if(res.data.status == 0){
              this.successIco = true;
              this.errorMessage = res.data.msg;
              this.btnOnce = true;
            }else{
              this.successIco = false;
              this.errorMessage = res.data.msg;
              this.$refs.message.showModel = true;
              this.btnOnce = true;
            }
          })
        }
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
      loading,
      hintModel
    }
  }
</script>

<style scoped>
  .position_con{
    background:#eeeeee;
    position:relative;
  }
  .position_con_top{
    position: relative;
  }
  .go_home {
    position: absolute;
    top: 28px;
    left: 80px;
    width: 30px;
    height: 30px;
    background: url("../../assets/img/gohome_ico.png")no-repeat;
    background-size: contain;

  }
  .back_top {
    /*border-bottom: 1px solid #d2d2d2;*/
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    align-items: center;
    background: #ffffff;
    height: 84px;
    text-align: center;
    position: relative;
  }

  .back {
    width: 21px;
    height: 38px;
    background: url("../../assets/img/back.png") no-repeat;
    background-size: contain;
    margin: 20px 0 20px 0;
  }

  .back_top span {
    font-size: 30px;
    /*color: #000000;*/
    color: #00a0e9;
    /*padding: 14px 0 0 280px;*/
  }
  .title_top {
    font-size: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translateX(-50%) translateY(-50%);
    -moz-transform: translateX(-50%) translateY(-50%);
    -ms-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
  }

  .wrap {
    /*background: #dddddd;*/
  }

  .list, .bottom {
    /*margin-bottom: 10px;*/
    padding: 0 54px;
    background: #ffffff;
    font-size: 30px;
    color: #5b5b5b;
  }

  .list_top {
    display: flex;
    justify-content: space-between;
    padding: 16px 0 22px 0;
  }

  .bot_item {
    display: flex;
    justify-content: space-between;
    line-height: 60px;
  }

  .bot_item i {
    color: #e70012;
  }

  .list .cash {
    color: #000000;
  }

  .bottom {
    border-top: 10px solid #dddddd;
  }

  /*.btn {*/
    /*position: fixed;*/
    /*width: 100%;*/
    /*!*height: 260px;*!*/
    /*background: #eeeeee;*/
    /*bottom: 0;*/
    /*text-align: center;*/

  /*}*/

  .btn span {
    display: block;
    margin: 115px 130px 0 130px;
    background: #9c9c9c;
    text-align: center;
    line-height: 60px;
    color: #ffffff;
    font-size: 18px;
    border-radius: 30px;
  }
  .lose i {
    color: #00e705;
  }

  .ico_success {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/success_ico.png") no-repeat center;
    background-size: contain;
    margin-bottom: 32px;
  }
  .btn_con {
    width: 100%;
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 0;
  }
  .btn_con span{
    display: block;
    background: #9c9c9c;
    text-align: center;
    line-height: 80px;
    height: 80px;
    color: #ffffff;
    font-size: 28px;
    width: 33.33%;
  }
  .btn_con span:nth-child(1){
    background:#eb0505;
  }
  .btn_con span:nth-child(2){
    background:#eb8105;
  }
  .btn_con span:nth-child(3){
    background:#898989;
  }

  /*结束提示框*/
  .model {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(00, 00, 00, .3);
  }

  .out_model {
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

  .out_model p {
    font-size: 32px;
    margin: 20px 0 20px 0;
  }

  .out_model .ico {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/over_contract.png") no-repeat center;
    background-size: contain;
    margin-bottom: 26px;
  }

  .loginout_bnt {
    box-sizing: border-box;
    display: flex;
    width: 100%;

  }

  .loginout_bnt div {
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-top: 1px solid #e5e5e5;
    color: #e70015;
    width: 50%;
  }
  .loginout_bnt .sure{
    border-right: 1px solid #e5e5e5;
    color: #e70012;
  }
  .loginout_bnt .cancel{
    color: #aaaaaa;
  }
  .oneCe {
    width: 100% !important;
  }


</style>
