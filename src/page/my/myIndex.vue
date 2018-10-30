<template>
  <div class="my_content">
    <div class="main" :style="{height:calcHeight}">
      <!--用户设置按钮-->
      <div class="setting">
        <div class="user_ico">
          <img src="../../assets/img/user.jpg" alt="">
          <span class="user_title">{{$store.state.userMessage.name}}</span>
        </div>
      </div>
      <!--用户信息-->
      <div class="my_message">
        <div class="user_money">
          <p>总资金(元):</p>
          <strong>{{$store.state.userMessage.cash_balance}}</strong>
        </div>
        <div class="user_item">

          <router-link tag="div" class="btn" to="rechargeMoney">充值</router-link>
          <router-link tag="div" class="btn" to="withdraw">提现</router-link>
        </div>
      </div>

      <!--用户冻结资金-->
      <div class="user_content">
        <div>
          <strong v-if="userMoney.total_balance != null">{{userMoney.total_money}}</strong>
          <strong v-else>----</strong>
          <span>总操盘资金</span>
        </div>
        <div>
          <strong v-if="userMoney.total_balance != null">{{userMoney.total_balance}}</strong>
          <strong v-else>----</strong>
          <span>总操盘资金余额</span>
        </div>
        <div>
          <strong v-if="userMoney.total_balance != null">{{userMoney.market_value}}</strong>
          <strong v-else>----</strong>
          <span>持仓总市值</span>
        </div>
      </div>

      <!--交易合作协议-->
      <div class="user_link">
        <router-link class="link_item" to="autonym" tag="div">
          <span>实名认证</span>
          <i class="more_ico"></i>
        </router-link>
        <router-link class="link_item" to="moneyDetail" tag="div">
          <span>资金流水</span>
          <i class="more_ico"></i>
        </router-link>
        <router-link class="link_item" to="passwordChange" tag="div">
          <span>密码修改</span>
          <i class="more_ico"></i>
        </router-link>
        <router-link class="link_item" :to="{name:'about',params:{typeNum:0}}" tag="div">
          <span>关于我们</span>
          <i class="more_ico"></i>
        </router-link>
        <router-link class="link_item" to="" tag="div">
          <div @click="showLoginOutClick">
            <span>退出登录</span>
            <i class="more_ico"></i>
          </div>
        </router-link>
      </div>

      <!--退出登录-->
      <div class="login_out" v-if="showLoginOut">
        <div class="model" @click="closeModel"></div>
        <div class="out_model">
          <p>是否要退出</p>
          <i class="ico"></i>
          <div class="loginout_bnt">
            <div class="sure" @click="out">确定</div>
            <div class="cancel" @click="closeModel">取消</div>
          </div>
        </div>
      </div>

      <!--新手引导-->
      <div class="guidance" v-if="firstGuidance" @click="goin(0)"><img src="../../assets/img/first.png" alt="" :style="{'height':calc}"></div>
      <div class="guidance" v-if="twoGuidance" @click="goin(1)"><img src="../../assets/img/two.png" alt=""></div>
    </div>
    <tabr></tabr>
  </div>
</template>

<script>
  import tabr from '../../components/publick/tabr'
  import {getUserMoney} from "../../api/user";
  import {firstLogin} from "../../libs/service";

  export default {
    name: "index",
    data() {
      return {
        oNav: null,
        showLoginOut: false, //是否显示退出登录提示框
        userMoney:{},       //用户金钱
        firstGuidance:false,   //是否为第一次登录
        twoGuidance:false,   //是否为第一次登录

      }
    },
    mounted: function () {

      //判断下如果是第一次登陆的时候就不在调用接口
      if(firstLogin() == null){
          this.firstGuidance = true;

      }else{
        this.oNav = document.getElementById('tab').offsetHeight;
        this.$store.dispatch('getUserInfo');
        this.getUserMoney();
      }


    },
    methods: {

      /** 10:46
       *   @author: yuanjie
       *   @description:关闭退出登录提示框
       *   @param
       */
      closeModel() {
        this.showLoginOut = false;
      },
      /** 10:50
       *   @author: yuanjie
       *   @description:展示登录提示框
       *   @param
       */
      showLoginOutClick() {
        this.showLoginOut = true;
      },

      /** 10:46
       *   @author: yuanjie
       *   @description:退出登录
       *   @param
       */
      out() {
        localStorage.removeItem('userInfo');
        this.$router.push('login');
      },
      //跳转到我的资金模块
      localUrl(strUlr) {
        this.$router.push(strUlr);
      },
      /** 18:27
       *   @author: yuanjie
       *   @description:获取用户金额
       *   @param
       */
      getUserMoney(){
        getUserMoney().then(res => {
          if(res.data.status == 0){
              this.userMoney = res.data.data;
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
            this.firstGuidance = false;
            this.twoGuidance = true;
        }else{
          this.twoGuidance = false;
          this.$router.push('homeIndex');
        }
      }
    },
    components: {
      tabr
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
    beforeDestroy: function () {
      // console.log('销毁之前');
    }
  }
</script>

<style scoped>
  .my_content {

  }

  .main {
    overflow-y: auto;
  }

  .setting {
    display: flex;
    justify-content: space-between;
    padding: 28px 28px 0 28px;
    margin-bottom: 10px;
  }

  .settion_ico {
    width: 42px;
    height: 42px;
    background: url("../../assets/img/setting.png") no-repeat;
    background-size: contain;
  }

  .user_ico {
    display: flex;
  }

  .user_ico img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    margin-right: 20px;
  }

  .user_ico span {
    font-size: 30px;
    color: #000000;
  }

  .my_message {
    display: flex;
    background: url("../../assets/img/wallet_bg.png") no-repeat;
    background-size: cover;
    /*width: 100%;*/
    height: 300px;
    flex-direction: column;
    /*box-sizing: border-box;*/

  }

  .details {
    display: flex;
    font-size: 18px;
    color: #ffffff;
    margin: 20px 20px 0 0;
    background: url("../../assets/img/details.png") no-repeat right center;
    background-size: contain;
    flex-flow: row-reverse;
    padding-right: 20px;
  }

  .user_money {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 52px 0 28px 0;
  }

  .user_money p {
    font-size: 30px;
    color: #ffffff;
  }

  .user_money strong {
    font-size: 40px;
    font-weight: 500;
    /*padding-top: 20px;*/
    color: #ffffff;
  }

  .user_item {
    display: flex;
    padding: 0 84px;
    justify-content: space-between;
  }

  .user_item div {
    width: 160px;
    text-align: center;
    line-height: 60px;
    height: 60px;
    color: #ffffff;
    border: 1px solid transparent;
    font-size: 28px;
    border-radius: 40px;
  }

  .user_item .btn:nth-child(1) {
    background: #ffffff;
    color: #eb0505;
    opacity: .9;
  }

  .user_item .btn:nth-child(2) {
    border: 2px solid #ffffff;
    /*background: #ffffff;*/
    /*opacity: .2;*/
  }

  .right_ico:after {
    position: absolute;
    content: '';
    width: 2px;
    height: 30px;
    background: url("../../assets/img/money_fenge.png") repeat-y;
    background-size: contain;
    left: 180px;
    top: 30px;
  }

  .user_content {
    display: flex;
    padding: 20px 70px 0 70px;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .user_content div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .user_content strong {
    font-size: 30px;
    padding: 0 0 16px 0;
    color: #2c2c2c;
  }

  .user_content span {
    color: #414141;
    font-size: 26px;
    padding-bottom: 16px;
  }

  .wallet {
    display: block;
    width: 36px;
    height: 36px;
    background: url("../../assets/img/wallet.png") no-repeat;
    background-size: contain;
    margin: 0 0 22px 0;
  }

  .user_link {
    border-top: 10px solid #dddddd;
    width: 100%;
  }

  .link_item {
    display: flex;
    margin-left: 70px;
    justify-content: space-between;
    border-bottom: 1px solid #d2d2d2;
    padding-right: 58px;
    align-items: center;
  }

  .link_item span {
    padding: 40px 0 30px 0;
    font-size: 28px;
    color: #535353;
  }

  .link_item i {
    display: block;
    width: 12px;
    height: 24px;
    background: url("../../assets/img/arrows.png") no-repeat right;
    background-size: contain;
  }

  .link_item div {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
  }

  /*退出提示框*/
  .model {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(00, 00, 00, .3);
    z-index: 1000;
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
    background: url("../../assets/img/login_out.png") no-repeat center;
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
