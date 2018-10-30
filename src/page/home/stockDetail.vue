<template>
    <div class="stock_detail" :style="{'min-height':calcHeight}">
      <div class="head_con">
        <publick-head style=" background: #ffffff">
          <div slot="bakc" class="back"></div>
          <span slot="title">股票详情</span>
        </publick-head>
        <!--<span class="add" @click="addStock(detailMsg.no)">添加</span>-->
      </div>

      <div class="main">
        <div class="main_detail">
          <div class="main_title">
            <span>股票代码:</span>
            <span class="stock_num">{{detailMsg.name}}/{{detailMsg.code}}</span>
          </div>
          <div class="main_money" v-if="detailMsg.stock_market != null">
            <div class="money_top">
              <div class="money_item">
                <span>今开</span>
                <h3>{{Number(detailMsg.opening_price).toFixed(2)}}</h3>
              </div>
              <div class="money_item">
                <span>现价</span>
                <h3>{{Number(detailMsg.now_price).toFixed(2)}}</h3>
              </div>
              <div class="money_item">
                <span>最高</span>
                <h3>{{Number(detailMsg.stock_market.max_price).toFixed(2)}}</h3>
              </div>
              <div class="money_item">
                <span>最低</span>
                <h3>{{Number(detailMsg.stock_market.min_price).toFixed(2)}}</h3>
              </div>
            </div>
              <div  class="money_top">
                <div class="money_item harden">
                  <span>涨停价</span>
                  <h3>{{detailMsg.up_price}}</h3>
                </div>
                <div class="money_item limit">
                  <span>跌停价</span>
                  <h3>{{detailMsg.down_price}}</h3>
                </div>
                <div class="money_item">
                  <span>成交量</span>
                  <h3>{{detailMsg.stock_market.gross}}</h3>
                </div>
                <div class="money_item">
                  <span>成交额</span>
                  <h3>{{judgeMoney(detailMsg.stock_market.total_money)}}</h3>
                </div>
              </div>

          </div>
        </div>

        <div class="tab_change">
            <div class="tab_item" :class="{'ac':defaultNum == 0}" @click="changNum(0)">分时图</div>
            <div class="tab_item" :class="{'ac':defaultNum == 1}" @click="changNum(1)">日k图</div>
        </div>
        <!--切换图片-->
        <div class="img_con">
          <img :src="detailMsg.time_line" alt="" v-if="defaultNum == 0">
          <img :src="detailMsg.day_line" alt="" v-if="defaultNum == 1">

        </div>

      <div class="btn_con" @click="buy" v-if="detailMsg.risk_status == 0">
        <span>我要持仓</span>
      </div>
      </div>

      <!--loading-->
      <loading ref="loading"></loading>

      <!--提示信息-->
      <hint-model ref="message">
        <p class="title" slot="title">{{errorMessage}}</p>
        <div class="ico_success" slot="ico" v-if="showSuccess"></div>
      </hint-model>

    </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import loading from '../../components/publick/loading'
  import hintModel from '@/components/publick/hintModel'
  import {stockDetail} from "../../api";
  import {addOptional} from "../../api/user";

  export default {
        name: "stockDetail",
        data(){
          return {
            errorMessage:'',//提示信息
            showSuccess:false, //成功
              detailMsg:{},    //股票数据
              defaultNum:0,
              timer:null,
          }
        },
        mounted:function () {
          this.$store.commit('openLoading');
          this.getStockDetail();
          this.langTimeGetDel();
        },
      methods:{
          /** 14:03
            *   @author: yuanjie
            *   @description:获取股票详情
            *   @param
            */
          getStockDetail(){
            stockDetail({code:this.$route.params.id}).then(res => {
              if(res.data.status == 0){
                  this.detailMsg = res.data.data;
                  this.$store.commit('closeLoading');

              }else{
                this.$store.commit('closeLoading');
              }
            })
          },
        /** 11:14
          *   @author: yuanjie
          *   @description:展示不同的图片
          *   @param{number} 传入数字
          */
        changNum(num){
          this.defaultNum = num;
        },
        /** 14:40
          *   @author: yuanjie
          *   @description:买入
          *   @param
          */
        buy(){

            this.$router.push({name:'stockDeal',params:{buyNum:0,detail:this.detailMsg}});
        },
        /** 14:55
          *   @author: yuanjie
          *   @description:判断当前的成交额的单位
          *   @param{number} 传入一个金额
          */
        judgeMoney(num){
              let newNum = Number(num);
            if(newNum < 10000){
                return newNum;
            }
            else if(newNum >= 10000 && newNum < 100000000){

                return (newNum / 10000).toFixed(2) + '万';
            }else if(newNum >= 100000000){
              return (newNum / 100000000).toFixed(2) + '亿';

            }
        },
        /** 10:23
         *   @author: yuanjie
         *   @description:添加自选
         *   @param{number} 当前的编号
         */
        addStock(num){
          addOptional({'stock_no':num}).then(res => {
            if(res.data.status == 0){
              this.$refs.message.showModel = true;
              this.showSuccess = true;
              this.errorMessage = res.data.msg;
            }else{
              this.$refs.message.showModel = true;
              this.errorMessage = res.data.msg;
            }
          })
        },
        /** 11:57
          *   @author: yuanjie
          *   @description:3秒去查股票详情
          *   @param
          */
          langTimeGetDel(){
            clearInterval(this.timer);
              this.timer = setInterval(() => {
                stockDetail({code:this.$route.params.id}).then(res => {
                  if(res.data.status == 0){
                    this.detailMsg = res.data.data;
                  }else{
                  }
                })
              },3000)
        }
      },
      computed:{
        //获取当前屏幕最小高度
        calcHeight(){
          return document.documentElement.clientHeight +  'px';

        }
      },
      components:{
          publickHead,
        loading,
        hintModel
      },
      watch:{

      },
      destroyed(){
          clearInterval(this.timer);
      }
    }
</script>

<style scoped>
  .stock_detail {
    background: #eeeeee;
    box-sizing: border-box;
  }
  .head_con {
    position: relative;
  }
  .add {
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 30px;
    color:#0090e9;
  }
  .main_detail {
      background: #ffffff;
  }
  .main_title {
    margin: 0 10px;
    padding: 0 2px;
  }
  .main_title {
    font-size: 30px;
    color: #000000;
    padding: 28px 0 14px 0;
    border-bottom: 1px solid #d2d2d2;
  }
  .main_title .stock_num {
    /*padding-left: 127px;*/
  }
  .main_money {
    display: flex;
    color: #000000;
    flex-direction: column;
    padding: 20px 0 20px 60px;
  }
  .money_top{
    display: flex;
    justify-content: space-between;
    /*padding: 0 0 0 30px;*/
  }
  .money_top:nth-child(1){
    margin-bottom: 50px;
    /*padding-right: 90px;*/
  }
  .money_top:nth-child(2){
      /*padding-right: 20px ;*/
  }
  .money_top div{
    display: flex;
    flex-direction: column;
  }
  .main_money span{
    font-size: 24px;

  }
  .main_money h3{
    font-size: 30px;
    font-weight:  700;

  }
  .tab_change {
    background: #ffffff;
    padding: 0 86px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    margin-top: 10px;
  }
  .tab_change div {
    height: 60px;
    line-height: 60px;
    font-size: 24px;
    border-bottom: 8px solid transparent;
    color: #eb0505;
    width: 190px;
    text-align: center;
  }
  .tab_change .ac{
    border-bottom: 8px solid #eb0505;
  }
  .img_con {
      background: #ffffff;
      padding-bottom: 40px;
    margin-bottom: 60px;
  }
  .img_con img{
    height: 413px;
    width: 100%;
    margin: 0 !important;

  }
  .btn_con {
    border-top: 1px solid transparent;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-top: 1px solid #e5e5e5;
    /*width: 100%;*/
    display: block;
    margin: 0 120px;
    background: #eb0505;
    color: #ffffff;
    border-radius: 40px;
  }
  .harden h3 {
      color: #eb0505;
  }
  .limit h3 {
    color: #00ff00;
  }
  .ico_success {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/success_ico.png") no-repeat center;
    background-size: contain;
    margin-bottom: 32px;
  }
  .money_item {
    flex: 1;
    align-items: left;
  }




</style>
