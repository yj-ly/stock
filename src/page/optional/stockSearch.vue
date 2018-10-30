<template>
  <div class="search_con">
    <!--头部-->
    <publick-head>
      <div slot="bakc" class="back"></div>
      <span slot="title">股票搜索</span>
    </publick-head>

    <!--main-->
    <div class="search_main">
      <div class="recharge_input">
        <span>股票代码:</span>
        <input type="text" placeholder="请输入股票代码或简拼" v-model="stockMsg" :autofocus="autoFocus">
      </div>

      <!--自选股票列表-->
      <!--<div class="optional_list" v-if="myOptionalList.length > 0">-->
        <!--<div class="filtrate">-->
          <!--<div class="left"><span>我的自选</span></div>-->
          <!--<div class="center"><span>最新价</span></div>-->
          <!--<div><span>涨跌幅(%)/涨跌</span></div>-->
        <!--</div>-->
        <!--<div class="list" v-for="item in myOptionalList">-->
          <!--<div class="list_left">-->
            <!--<div>{{item.stock_name}}</div>-->
            <!--<span>{{item.stock_code}}</span>-->
          <!--</div>-->
          <!--<div class="list_center">-->
            <!--<div>{{Number(item.stock.now_price).toFixed(2)}}</div>-->
          <!--</div>-->
          <!--<div class="list_right">-->
            <!--<div class="right_top">-->
              <!--<span v-if="Number(item.stock.rose) > 0">+</span>-->
              <!--&lt;!&ndash;<span v-else>-</span>&ndash;&gt;-->
              <!--<div  :class="{'add_txt':Number(item.stock.rose) > 0, 'drop_txt':Number(item.stock.rose) < 0 }">{{Number(item.stock.rose).toFixed(2)}}</div>-->
            <!--</div>-->
            <!--<div class="right_bottom">-->
              <!--<span  v-if='Number(item.stock.now_price - item.stock.yesterday_price).toFixed(2) > 0 '>+</span>-->
              <!--&lt;!&ndash;<span v-else>&#45;&#45;&#45;&#45;</span>&ndash;&gt;-->
              <!--<span :class="{'add_txt':Number(item.stock.now_price - item.stock.yesterday_price).toFixed(2) > 0, 'drop_txt':Number(item.stock.now_price - item.stock.yesterday_price).toFixed(2) < 0 }">{{Number(item.stock.now_price - item.stock.yesterday_price).toFixed(2) }}</span>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="remove_item" @click="removeOptionalItem(item.id)">删除</div>-->
        <!--</div>-->
      <!--</div>-->

      <!--搜索股票列表-->
      <div class="optional_list search" v-if="stockList.length > 0">
        <div class="filtrate">
          <div class="left"><span>股票名称</span></div>
          <div class="center"><span>最新价</span></div>
          <div><span>涨跌幅(%)/涨跌</span></div>
        </div>
        <div class="list" v-for="item in stockList" @click="localUrl('stockDetail',item.stock_code)">
          <div class="list_left">
            <div>{{item.name}}</div>
            <span>{{item.code}}</span>
          </div>
          <div class="list_center">
            <div>{{Number(item.now_price).toFixed(2)}}</div>
          </div>
          <div class="list_right">
            <div class="right_top">
              <span v-if="Number(item.rose) > 0" class="add_txt">+</span>
              <div :class="{'add_txt':Number(item.rose) > 0, 'drop_txt':Number(item.rose) < 0 }">{{Number(item.rose).toFixed(2)}}</div>
            </div>
            <div class="right_bottom">
              <span  v-if='Number(item.now_price - item.yesterday_price).toFixed(2) > 0 ' class="add_txt">+</span>
              <span :class="{'add_txt':Number(item.now_price - item.yesterday_price).toFixed(2) > 0, 'drop_txt':Number(item.now_price - item.yesterday_price).toFixed(2) < 0 }">{{Number(item.now_price - item.yesterday_price).toFixed(2) }}</span>
            </div>
          </div>
          <div class="remove_item" @click.stop="addStock(item.no)">添加</div>
        </div>
      </div>
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
        <p>是否删除自选</p>
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
  import publickHead from '@/components/publick/publickHead'
  import loading from '../../components/publick/loading'
  import hintModel from '@/components/publick/hintModel'
  import {getStockList} from "../../api";
  import {myOptional,removeOptional,addOptional} from "../../api/user";

  export default {
    name: "stockSearch",
    data(){
      return {
        successIco:false, //成功的提示
        errorMessage:'', //消息
        stockList:[],     //股票列表
        stockMsg:'',
        timer:null,       //函数防抖
        newStockList:[],
        // myOptionalList:[],   //我的自选
        setId:null,
        showModelOver:false,
        autoFocus:true
      }
    },
    mounted:function(){
      // this.$store.commit('openLoading');
      // this.getStockList();
      this.$store.commit('closeLoading');

    },
    methods:{
        /** 9:20
          *   @author: yuanjie
          *   @description:获取股票列表
          *   @param
          */
        // getStockList(){
        //   getStockList().then(res => {
        //      if(res.data.status == 0){
        //           this.stockList = res.data.data;
        //      }else{
        //        this.$store.commit('closeLoading');
        //      }
        //   })
        //   // myOptional().then(res => {
        //   //     if(res.data.status == 0){
        //   //       this.myOptionalList = res.data.data;
        //   //       console.log(this.myOptionalList)
        //   //       this.$store.commit('closeLoading');
        //   //     }else{
        //   //       this.$store.commit('closeLoading');
        //   //     }
        //   // })
        // },
      /** 14:49
       *   @author: yuanjie
       *   @description:记录当前点击的那个值
       *   @param{number} 当前点击
       */
      removeOptionalItem(num){
        this.setId = num;
        this.showModelOver = true;
      },
      /** 14:51
       *   @author: yuanjie
       *   @description:删除自选
       *   @param
       */
      overContract(){
        this.showModelOver = false;
        removeOptional({id:this.setId}).then(res => {
          if(res.data.status == 0){
            this.$refs.message.showModel = true;
            this.successIco = true;
            this.errorMessage = res.data.msg;
            myOptional().then(res => {
              if(res.data.status == 0){
                this.myOptionalList = res.data.data;
              }else{
                this.$store.commit('closeLoading');
              }
            })
          }else{
            this.$refs.message.showModel = true;
            this.errorMessage = res.data.msg;
          }
        })
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
            this.successIco = true;
            this.errorMessage = res.data.msg;
            setTimeout(() => {
              this.$router.push({name:'optional'});
            },2000)
          }else{
            this.$refs.message.showModel = true;
            this.errorMessage = res.data.msg;
          }
        })
      },
      /** 11:38
       *   @author: yuanjie
       *   @description:跳转到股票详情
       *   @param{string} 路径
       *   @param{number} 当前点击id
       */
      localUrl(strUrl,num){
        this.$router.push({name:strUrl,params:{id:num}});
      },

    },
    components: {
      publickHead,
      loading,
      hintModel
    },
    watch:{
        'stockMsg':function (newVal) {
            let val = newVal;
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            // if (val == '') {
            //   console.log('val空');
            //   this.newStockList = [];
            //   return false;
            // }
            // this.newStockList = this.stockList.filter((item) => {
            //   console.log(val);
            //   return item.name.indexOf(val) != -1 || item.code.indexOf(val) != -1;
            // })
            // if(this.newStockList.length > 10){
            //     this.newStockList = this.newStockList.splice(0,10);
            // }
            if(val != ''){
              getStockList({key:val}).then(res => {
                if(res.data.status == 0){
                  this.stockList = res.data.data;
                }else{
                  this.$store.commit('closeLoading');
                }
              })
            }
            if(val == ''){
              this.stockList = [];
            }
          }, 200)
        }
    }
  }
</script>

<style scoped>
  .recharge_input {
    display: flex;
    padding-left: 38px;
    border-bottom: 2px solid #d2d2d2;
  }
  .recharge_input span{
    line-height: 76px;
    font-size: 28px;
    color: #333333;
  }
  .recharge_input input{
    margin-left: 30px;
    width: 300px;
    line-height: 76px;
    font-size: 26px;
  }
  .filtrate {
    display: flex;
    margin: 0 30px;
    border-bottom: 1px solid #d2d2d2;
  }
  .filtrate div{
    display: flex;
    padding: 24px 0;
    font-size: 30px;
    color: #605e5e;
  }
  .filtrate .center{
    width: 300px;
    text-align: center;
    display: flex;
    justify-content: center;
  }
  .filtrate .left{
    width: 120px;
    display: flex;
    justify-content: center;
  }
  .list {
    margin: 0 30px;
    border-bottom: 1px solid #d2d2d2;
    display: flex;
    height: 130px;
    align-items: center;
    padding:0 20px 0 0;
    position: relative;
  }
  .list:last-child{
    border-bottom: none;
  }
  .list_left {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 120px;
  }
  .list_left span{
    font-size: 24px;
    color: #217ab1;
  }
  .list_left div {
    color: #605e5e;
    font-size:30px;
    padding-bottom: 8px;
  }
  .list_center {
    width: 300px;
    font-size: 30px;
    color: #3e3e39;
    display: flex;
    justify-content: center;
    text-align: center;
  }
  .list_right {
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-size: 30px;
  }
  .add_txt {
    color: #e70012;
  }
  .decline_txt {
    color: #00e705;
  }
  .list_right span{
    /*color: #e70012;*/
  }
  .list_right i {
    display: block;
    width: 13px;
    height: 6px;
    margin: 0 5px 0 5px;
  }
  .right_top,.right_bottom{
    display: flex;
  }
  .remove_item {
    position: absolute;
    right: 14px;
    font-size:30px;
    color: #333333;
    margin-left: 40px;
  }
  .search{
    border-top: 20px solid #dddddd;
    margin: 20px 0 0 0;
  }
  .search .remove_item {
    color: #e70012 !important;
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
  }

  .out_model p {
    font-size: 32px;
    margin: 20px 0 20px 0;
  }
  .ico_success {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/success_ico.png") no-repeat center;
    background-size: contain;
    margin-bottom: 32px;
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
  .drop_txt {
    color: #00ff00 !important;
  }
  input::-webkit-input-placeholder{font-size:28px;opacity:1;}/* WebKit browsers */
  input:-moz-placeholder{font-size:28px;opacity:1;}/* Mozilla Firefox 4 to 18 */
  input::-moz-placeholder{font-size:28px;opacity:1;}/* Mozilla Firefox 19+ */
  input:-ms-input-placeholder{font-size:28px;opacity:1;}/* Mozilla Firefox 19+ */




</style>
