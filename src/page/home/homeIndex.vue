<template>
  <div class="content">
      <div class="main" :style="{height:calcHeight}">
        <!--搜索头部-->
        <div class="optional_top">
          <router-link to="stockSearch" tag="div" class="search_content">
            <i></i>
            <span>搜索股票代码</span>
          </router-link>
        </div>
        <!--轮播图-->
        <div class="banner">
          <banner>
            <ul class="listb" slot="list">
              <li><img src="../../assets/img/banner.png" alt=""></li>
              <li><img src="../../assets/img/banner1.png" alt=""></li>
              <li><img src="../../assets/img/banner3.png" alt=""></li>
            </ul>
            <nav class="nav" slot="nav">
              <a class="active"></a>
              <a></a>
              <a></a>
            </nav>
        </banner>
        </div>
        <!--功能模块-->
        <div class="function_module">
          <div class="module_top">
            <div class="module_item" @click="localUrlType('stockScheme')">
              <img src="../../assets/img/2.png" alt="">
              <p>创建策略</p>
            </div>
            <div class="module_item" @click="localUrlType('contract')">
              <img src="../../assets/img/4.png" alt="">
              <p>我的策略</p>
            </div>
            <div class="module_item" @click="localUrlType('stockDeal')">
              <img src="../../assets/img/1.png" alt="">
              <p>股票交易</p>
            </div>
            <div class="module_item" @click="localUrlType('positions')">
              <img src="../../assets/img/3.png" alt="">
              <p>我的持仓</p>
            </div>

          </div>

        </div>

        <!--股票列表-->
        <div class="stock_content">
          <div class="stock_top">
          <div class="hot_stock " :class="{'ac':tabNum == 0}" @click="changeTab(0)">
            <span>热门股票</span>
          </div>
          <div class="hot_optional" :class="{'ac':tabNum == 1}" @click="changeTab(1)">
            <span>热门自选</span>
          </div>
        </div>

          <!--热门股票 默认展示热门投票-->
          <div class="optional_list" v-if="tabNum == 0">
            <div class="filtrate">
              <div class="left"><span>股票名称</span></div>
              <div class="center"><span>最新价</span></div>
              <div><span>涨跌幅(%)/涨跌</span></div>
            </div>
            <div class="list" v-for="item in hotList" @click="localUrl('stockDetail',item.stock_code)" >
              <div class="list_left">
                <div>{{item.name}}</div>
                <span>{{item.code}}</span>
              </div>
              <div class="list_center">
               {{Number(item.now_price).toFixed(2)}}
              </div>
              <div class="list_right hot">
                <div class="right_top">
                  <span v-if="Number(item.rose) > 0" class="add_txt">+</span>
                  <!--<span v-else>-</span>-->
                  <div  :class="{'add_txt':Number(item.rose) > 0, 'drop_txt':Number(item.rose) < 0 }">{{Number(item.rose).toFixed(2)}}</div>
                </div>
                <div class="right_bottom">
                  <span  v-if='Number(item.now_price - item.yesterday_price).toFixed(2) > 0 ' class="add_txt">+</span>
                  <!--<span v-else>----</span>-->
                  <span :class="{'add_txt':Number(item.now_price - item.yesterday_price).toFixed(2) > 0, 'drop_txt':Number(item.now_price - item.yesterday_price).toFixed(2) < 0 }">{{Number(item.now_price - item.yesterday_price).toFixed(2) }}</span>
                </div>
              </div>

              <!--<div class="remove_item">-->
                <!--<span>14333</span>-->
                <!--<span>关注</span>-->
              <!--</div>-->
            </div>
          </div>

          <!--热门自选股票-->
          <div class="optional_list" v-if="tabNum == 1">
            <div class="filtrate">
              <div class="left"><span>股票名称</span></div>
              <div class="center"><span>最新价</span></div>
              <div><span>涨跌幅(%)/涨跌</span></div>
            </div>
            <div class="list" v-for="item in hotOptional" @click="localUrl('stockDetail',item.stock.stock_code)" >
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

              <!--<div class="remove_item">-->
                <!--<span>14333</span>-->
                <!--<span>关注</span>-->
              <!--</div>-->
            </div>
          </div>
        </div>
      </div>
<!--新手引导-->
    <div class="guidance" v-if="threeGuidance" @click="goin(0)"><img src="../../assets/img/three.png" alt="" :style="{'height':calc}"></div>
    <div class="guidance" v-if="fourGuidance" @click="goin(1)"><img src="../../assets/img/four.png" alt=""></div>
      <tabr></tabr>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
  import tabr from '../../components/publick/tabr'
  import banner from  '../../components/publick/banner'
  import {hotOptional} from "../../api/user";
  import {getStockList} from "../../api";
  import {firstLogin} from "../../libs/service";

  export default {
        name: "homeIndex",
      data() {
        return {
          oNav: null,
          loop:true,
          autoPlay:true,
          tabNum:0,   //tab显示状态
          testNum:0,
          hotOptional:[],  //热门自选
          hotList:[],  //热门自选
          threeGuidance:false,   //是否为第一次登录
          fourGuidance:false,   //是否为第一次登录

        }
      },
      beforeCreate:function(){
      },
      beforeMount:function(){

      },
      created:function(){
      },
      mounted: function () {

        //判断下如果是第一次登陆的时候就不在调用接口
        if(firstLogin() == null){
          this.threeGuidance = true;

        }else{
          this.oNav = document.getElementById('tab').offsetHeight;
          this.getHotStock();
        }
      },
      methods:{

          //更换股票的状态
          changeTab(num) {
            this.tabNum = num;
          },
          //跳转到不同路径下面的方法
        localUrlType(strUrl){
          this.$router.push(strUrl);
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
        /** 14:13
          *   @author: yuanjie
          *   @description:获取热门
          *   @param
          */
        getHotStock(){
          getStockList({'hot':1}).then(res => {
            if(res.data.status == 0){
                this.hotList = res.data.data;
            }
          })
          hotOptional().then(res => {
            if(res.data.status == 0){
                this.hotOptional = res.data.data;
                (res.data.data);
            }else{

            }
          })
        },
        /** 9:17
         *   @author: yuanjie
         *   @description:判断下当前点击的是那一个
         *   @param{number}
         */
        goin(num){
          if(num == 0){
            this.threeGuidance = false;
            this.fourGuidance = true;
          }else{
            this.fourGuidance = false;
            localStorage.setItem('newUser',true);
            this.oNav = document.getElementById('tab').offsetHeight;
            this.getHotStock();
          }
        }
      },
      components: {
        tabr,
        banner
      },
      computed: {
        calcHeight() {
          let heightNum = document.documentElement.clientHeight - this.oNav + 'px';
          return heightNum;
        },

        calc(){
          return document.documentElement.clientHeight + 'px';
        }
      },
      watch:{

      }

    }
</script>

<style scoped>
  .content{
    width: 100%;
    overflow-y: auto;
  }
  .optional_top {
    padding: 14px 0;
  }
  .banner {
    height: 300px;
    position: relative;
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
  .function_module {
    display: flex;
    flex-direction: column;
    padding: 42px 58px 34px 58px;
    background: #ffffff;
  }
  .module_top{
    display: flex;
    justify-content: space-between;
  }
  .module_item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .module_item img{
    width: 64px;
    height: 64px;
  }
  .module_item p {
    padding-top: 10px;
    font-size: 22px;
    color: #383838;
  }
  .stock_content {
    border-top: 10px solid #ebebeb;
  }
  .stock_top {
    padding: 0 86px;
    box-sizing: border-box;
    display: flex;
    border-bottom: 20px solid #dddddd;
    font-size:30px;
    color: #e70012;
    justify-content: space-between;
    background: #ffffff;
  }
  .stock_top div{
    width: 190px;
    text-align: center;
    height: 60px;
    line-height: 60px;
  }
  .stock_top .ac{
    border-bottom: 8px solid #e70012;
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
  .optional_list .list:last-child{
    border-bottom: none !important;
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
    /*align-items: center;*/
    justify-content: center;
    flex-direction: column;
    font-size: 30px;
    margin-left: 60px;
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
    display: flex;
    font-size:30px;
    color: #9c9c9c;
    margin-left: 40px;
    flex-direction: column;
    align-items: center;
    right: 14px;
  }
  .drop_txt {
    color: #00ff00 !important;
  }
  .hot {
    margin-left: 60px;
  }

  .guidance {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    overflow: hidden;
    z-index: 1000;
  }
  .guidance img{
    height: 100% !important;
    width: 100%;
  }


</style>
