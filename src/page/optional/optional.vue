<template>
  <div class="optional">
    <div class="main" :style="{'height':calcHeight}">
      <!--搜索头部-->
      <div class="optional_top">
        <router-link to="stockSearch" tag="div" class="search_content">
          <i></i>
          <span>搜索股票代码</span>
        </router-link>
      </div>
      <div class="exponent" v-if="exponentData.SH999999 != null">
        <div class="optional_item">
          <span class="optional_title">上证综指</span>
          <div class="exponent_ico">
            <i :class="{'decline_ico': Number(exponentData.SH999999.now_price).toFixed(2) < 0, 'add':Number(exponentData.SH999999.now_price).toFixed(2) > 0}"></i>
            <span class="add_txt">{{Number(exponentData.SH999999.now_price).toFixed(2)}}</span>
          </div>
          <div class="exponent_bottom">
            <div class="bottom_left">

              <!--<span class="decline_txt" v-if="(Number(exponentData.SH999999.now_price) - Number(exponentData.SH999999.yesterday_price)).toFixed(2)  < 0">-</span>-->
              <span class="add_txt" v-if="(Number(exponentData.SH999999.now_price) - Number(exponentData.SH999999.yesterday_price)).toFixed(2)  >  0">+</span>
              <span  :class="{'add_txt':(Number(exponentData.SH999999.now_price) - Number(exponentData.SH999999.yesterday_price)).toFixed(2) > 0,'decline_txt':(Number(exponentData.SH999999.now_price) - Number(exponentData.SH999999.yesterday_price)).toFixed(2) < 0}">{{(Number(exponentData.SH999999.now_price) - Number(exponentData.SH999999.yesterday_price)).toFixed(2) }}</span>
            </div>
            <span class="fen">/</span>
            <span  :class="{'decline_txt':(((Number(exponentData.SH999999.now_price) - Number(exponentData.SH999999.yesterday_price)) / Number(exponentData.SH999999.yesterday_price) ) * 100).toFixed(2) < 0,'add_txt':(((Number(exponentData.SH999999.now_price) - Number(exponentData.SH999999.yesterday_price)) / Number(exponentData.SH999999.yesterday_price) ) * 100).toFixed(2) > 0}">{{(((Number(exponentData.SH999999.now_price) - Number(exponentData.SH999999.yesterday_price)) / Number(exponentData.SH999999.yesterday_price) ) * 100).toFixed(2) }}%</span>
          </div>
        </div>
        <div class="optional_item">
          <span class="optional_title">深圳成指</span>
          <div class="exponent_ico">
            <i :class="{'decline_ico': Number(exponentData.SZ399001.now_price).toFixed(2) < 0, 'add':Number(exponentData.SZ399001.now_price).toFixed(2) > 0}"></i>
            <span class="add_txt">{{Number(exponentData.SZ399001.now_price).toFixed(2)}}</span>
          </div>
          <div class="exponent_bottom">
            <div class="bottom_left">

              <!--<span class="decline_txt" v-if="(Number(exponentData.SZ399001.now_price) - Number(exponentData.SZ399001.yesterday_price)).toFixed(2)  < 0">-</span>-->
              <span class="add_txt" v-if="(Number(exponentData.SZ399001.now_price) - Number(exponentData.SZ399001.yesterday_price)).toFixed(2)  >  0">+</span>
              <span  :class="{'add_txt':(Number(exponentData.SZ399001.now_price) - Number(exponentData.SZ399001.yesterday_price)).toFixed(2) > 0,'decline_txt':(Number(exponentData.SZ399001.now_price) - Number(exponentData.SZ399001.yesterday_price)).toFixed(2) < 0}">{{(Number(exponentData.SZ399001.now_price) - Number(exponentData.SZ399001.yesterday_price)).toFixed(2) }}</span>
            </div>
            <span class="fen">/</span>
            <span  :class="{'decline_txt':(((Number(exponentData.SZ399001.now_price) - Number(exponentData.SZ399001.yesterday_price)) / Number(exponentData.SZ399001.yesterday_price) ) * 100).toFixed(2) < 0,'add_txt':(((Number(exponentData.SZ399001.now_price) - Number(exponentData.SZ399001.yesterday_price)) / Number(exponentData.SZ399001.yesterday_price) ) * 100).toFixed(2) > 0}">{{(((Number(exponentData.SZ399001.now_price) - Number(exponentData.SZ399001.yesterday_price)) / Number(exponentData.SZ399001.yesterday_price) ) * 100).toFixed(2) }}%</span>

          </div>
        </div>
        <div class="optional_item">
          <span class="optional_title">创业板指</span>
          <div class="exponent_ico">
            <i :class="{'decline_ico': Number(exponentData.SZ399006.now_price).toFixed(2) < 0, 'add':Number(exponentData.SZ399006.now_price).toFixed(2) > 0}"></i>
            <span class="add_txt">{{Number(exponentData.SZ399006.now_price).toFixed(2)}}</span>
          </div>
          <div class="exponent_bottom">
            <div class="bottom_left">

              <!--<span class="decline_txt" v-if="(Number(exponentData.SZ399006.now_price) - Number(exponentData.SZ399006.yesterday_price)).toFixed(2)  < 0">-</span>-->
              <span class="add_txt" v-if="(Number(exponentData.SZ399006.now_price) - Number(exponentData.SZ399006.yesterday_price)).toFixed(2) > 0">+</span>
              <span  :class="{'add_txt':(Number(exponentData.SZ399006.now_price) - Number(exponentData.SZ399006.yesterday_price)).toFixed(2) > 0,'decline_txt':(Number(exponentData.SZ399006.now_price) - Number(exponentData.SZ399006.yesterday_price)).toFixed(2) < 0}">{{(Number(exponentData.SZ399006.now_price) - Number(exponentData.SZ399006.yesterday_price)).toFixed(2) }}</span>
            </div>
            <span class="fen">/</span>
            <span  :class="{'decline_txt':(((Number(exponentData.SZ399006.now_price) - Number(exponentData.SZ399006.yesterday_price)) / Number(exponentData.SZ399006.yesterday_price) ) * 100).toFixed(2) < 0,'add_txt':(((Number(exponentData.SZ399006.now_price) - Number(exponentData.SZ399006.yesterday_price)) / Number(exponentData.SZ399006.yesterday_price) ) * 100).toFixed(2) > 0}">{{(((Number(exponentData.SZ399006.now_price) - Number(exponentData.SZ399006.yesterday_price)) / Number(exponentData.SZ399006.yesterday_price) ) * 100).toFixed(2) }}%</span>
          </div>
        </div>
      </div>
      <!--股票列表-->
      <div class="optional_list" v-if="optionalList.length > 0">
        <div class="filtrate">
          <div class="left"><span>我的自选</span></div>
          <div class="center"><span>最新价</span></div>
          <div><span>涨跌幅(%)/涨跌</span></div>
        </div>
        <div class="list" v-for="item in optionalList" @click="localUrl('stockDetail',item.stock.stock_code)">
          <div class="list_left">
            <div>{{item.stock_name}}</div>
            <span>{{item.stock_code}}</span>
          </div>
          <div class="list_center">
            <div>{{Number(item.stock.now_price).toFixed(2)}}</div>
          </div>
          <div class="list_right">
            <div class="right_top">
              <span v-if="Number(item.stock.rose) > 0" class="add_txt">+</span>
              <!--<span v-else>-</span>-->
              <div  :class="{'add_txt':Number(item.stock.rose) > 0, 'drop_txt':Number(item.stock.rose) < 0 }">{{Number(item.stock.rose).toFixed(2)}}</div>
            </div>
            <div class="right_bottom">
              <span  v-if='Number(item.stock.now_price - item.stock.yesterday_price).toFixed(2) > 0 ' class="add_txt">+</span>
              <!--<span v-else>&#45;&#45;&#45;&#45;</span>-->
              <span :class="{'add_txt':Number(item.stock.now_price - item.stock.yesterday_price).toFixed(2) > 0, 'drop_txt':Number(item.stock.now_price - item.stock.yesterday_price).toFixed(2) < 0 }">{{Number(item.stock.now_price - item.stock.yesterday_price).toFixed(2) }}</span>
            </div>
          </div>
          <div class="remove_item" @click.stop="removeOptionalItem(item.id)">删除</div>
        </div>
      </div>

      <!--数据为空-->
      <div class="not_search"  v-if="optionalList.length == 0">
        <img src="../../assets/img/search_not.png" alt="">
        <p>什么东西都没有找到</p>

        <router-link to="stockSearch" tag="div" class="btn">去添加自选吧.....</router-link>
      </div>
    </div>

    <!--loading-->
    <loading ref="loading"></loading>

    <!--提示信息-->
    <hint-model ref="message">
      <p class="title" slot="title">{{errorMessage}}</p>
      <div class="ico_success" slot="ico" v-if="showSuccess"></div>
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



    <tabr></tabr>
  </div>
</template>

<script>
  import tabr from '../../components/publick/tabr'
  import loading from '../../components/publick/loading'
  import hintModel from '@/components/publick/hintModel'
  import {myOptional,removeOptional,exponent} from "../../api/user";

  export default {
    name: "optional",
    data() {
      return {
        oNav: null,
        errorMessage:'',   //提示信息
        showSuccess:false, //成功
        optionalList:[],
        showModelOver:false,
        setId:'',
        exponentData:{
          SH999999:null,
          SZ399001:null,
          SZ399006:null,

        },   //指数
      }
    },
    mounted: function () {
      this.oNav = document.getElementById('tab').offsetHeight;
      this.$store.commit('openLoading');
      this.getMyOptional();

    },
    methods:{
      /** 11:17
        *   @author: yuanjie
        *   @description:获取自选列表
        *   @param
        */
      getMyOptional(){
        exponent().then( res => {
          if(res.data.status == 0){
              this.exponentData = res.data.data;
            this.exponentData.SH999999 = JSON.parse(res.data.data.SH999999);
            this.exponentData.SZ399001 = JSON.parse(res.data.data.SZ399001);
            this.exponentData.SZ399006 = JSON.parse(res.data.data.SZ399006);
          }
        })
        myOptional().then(res => {
          if(res.data.status == 0){
              this.optionalList = res.data.data;
            this.$store.commit('closeLoading');
          }else{
            this.$store.commit('closeLoading');
          }
        })
      },
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
            this.showSuccess = true;
            this.errorMessage = res.data.msg;
            myOptional().then(res => {
              if(res.data.status == 0){
                this.optionalList = res.data.data;
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
      tabr,
      loading,
      hintModel
    },
    computed: {
      calcHeight() {
        let heightNum = document.documentElement.clientHeight - this.oNav + 'px';
        return heightNum;
      }
    }
  }
</script>

<style scoped>
  .optional {

  }
  .main {
    overflow-y:auto;
  }

  .optional_top {
    border-bottom: 1px solid #d2d2d2;
    padding: 14px 0;
  }

  .search_content {
    height: 58px;
    width: 556px;
    margin: 0 auto;
    background: #ebebeb;
    background-size: contain;
    border-radius: 10px;
    display: flex;
    align-items: center;
  }

  .search_content i {
    display: block;
    background: url("../../assets/img/Shape.png") no-repeat left center;
    width: 32px;
    height: 32px;
    margin-left: 170px;
  }

  .search_content span {
    font-size: 30px;
    color: #919191;
    line-height: 58px;
    padding-left: 8px;
  }

  .exponent {
    padding: 0 70px;
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    border-bottom: 10px solid #dddddd;
  }
  .exponent .optional_item {
    display: flex;
    flex-direction: column;
    padding: 20px 0 14px 0;
    justify-content: center;
    align-items: center;
    font-size: 28px;
  }
  .optional_item span{
    font-size: 26px;
  }
  .optional_title {
    color: #000000;
    padding-bottom: 10px;

  }
  .exponent_ico {
    display: flex;
    align-items: center;
    font-size: 24px;

  }
  .exponent_ico i {
    display: block;
    width: 11px;
    height:10px;
    margin-right: 6px;
  }
  .exponent_ico .add{
    background: url("../../assets/img/add.png")no-repeat;
    background-size: contain;
  }
  .exponent_ico span {
    color: #e70012;
  }
  .add_txt {
    color: #e70012;
  }
  .exponent_bottom {
    display: flex;
    /*justify-content: space-between;*/
  }
  .bottom_left {
    display: flex;
    /*margin-right: 6px;*/
  }
  .bottom{
    padding:0 0 0 10px;
  }
  .bottom_add {
    color: #e70012;
    font-size: 12px;
  }

  /*下降*/
  .decline_txt {
    color: #00e705;
  }
  .exponent_ico .decline_ico{
    background: url("../../assets/img/subtract_ico.png")no-repeat;
    background-size: contain;
  }
  .optional_list {

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
  .list:last-child {
    border: none;
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
    font-size:30px;
    color: #333333;
    margin-left: 40px;
    position: absolute;
    right: 14px;
  }
  .ico_success {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/success_ico.png") no-repeat center;
    background-size: contain;
    margin-bottom: 32px;
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
  .drop_txt {
    color: #00ff00 !important;
  }
  .not_search {
    text-align: center;
  }
  .not_search img{
    width: 166px;
    margin: 80px 0 0 0;
  }
  .not_search p {
    margin: 10px 0 0 0;
    font-size: 36px;
    color:#aaaaaa;
  }
  .btn{
    margin: 70px 130px 0 130px;
    background: #e70012;
    text-align: center;
    line-height: 66px;
    color: #ffffff;
    font-size: 24px;
    border-radius: 30px;
  }
  .fen {
    color: #3a3a3a !important;
    padding: 0 4px;
  }


</style>
