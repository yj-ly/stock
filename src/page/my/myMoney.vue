<template>
    <div class="mymoney_content">
      <!--返回-->
        <!--<div class="back_top">-->
          <!--<div class="back" @click="back()"></div>-->
          <!--<span>我的资金</span>-->
        <!--</div>-->
      <publick-head >
        <div slot="bakc" class="back" ></div>
        <span slot="title">我的资金</span>
      </publick-head>
      <!--用户信息-->
      <div class="my_message">
        <div class="user_money">
          <p>总资金(元):</p>
          <strong>300000.00</strong>
        </div>
        <div class="user_item">
          <div class="right_ico">
            <p>0.00</p>
            <span>冻结资金</span>
          </div>
          <div class="right_ico">
            <p>0.00</p>
            <span>持仓盈亏</span>
          </div>
          <div>
            <p>0.00</p>
            <span>可用资金</span>
          </div>
        </div>
      </div>

      <!--用户充值-->
      <div class="recharge">
        <div class="recharge_btn" @click="localUrl('rechargeMoney')" >充值</div>
        <div @click="localUrl('withdraw')">提现</div>
      </div>

      <!--添加银行卡列表-->
      <div class="add_bank_list">
        <div class="add">
          <span>添加银行卡</span>
        </div>
      </div>
    </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
    export default {
        name: "myMoney",
        data(){
          return {

          }
        },
        methods:{
          //跳转到不同页面
          localUrl(strUrl){
            this.$router.push(strUrl);
          }
        },
        components:{
          publickHead
        }
    }
</script>

<style scoped>

  .my_message {
    display: flex;
    margin: 0 14px;
    background: url("../../assets/img/wallet_bg.png")no-repeat;
    background-size:cover;
    height: 289px;
    flex-direction: column;
    box-shadow: 0 0 20px #cccccc;
  }
  .user_money {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 28px;
    margin-top: 28px;
  }
  .user_money p{
    font-size:30px;
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
    padding: 0 58px;
    justify-content: space-between;
  }
  .user_item div{
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: center;

  }
  .user_item div p {
    font-size: 40px;
    font-weight: 500;
    /*padding-bottom: 26px;*/
    color: #ffffff;
  }
  .user_item div span{
    font-size: 24px;
    color: #ffffff;
  }
  .right_ico:after {
    position: absolute;
    content: '';
    width:2px;
    height: 30px;
    background: url("../../assets/img/money_fenge.png")repeat-y;
    background-size: contain;
    left:180px;
    top: 30px;
  }

  .recharge {
    display: flex;
    padding: 48px 70px;
    justify-content: space-between;
  }
  .recharge div {
    width: 240px;
    height: 66px;
    text-align: center;
    line-height: 66px;
    border: 4px solid #e70012;
    color: #e70012;
    font-size: 28px;
    border-radius: 40px;
  }
  .recharge .recharge_btn {
    background: #e70012;
    color: #ffffff;
  }
  .add_bank_list{
    border-top: 10px solid #dddddd;
  }
  .add {
    margin: 0 10px;
    height: 200px;
    border: 2px solid #c9c9c9;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("../../assets/img/add_bank.png")no-repeat 450px center;
  }
  .add span{
    font-size: 30px;
    color: #c9c9c9;
  }

</style>
