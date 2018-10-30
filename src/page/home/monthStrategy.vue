<template>
  <div class="daystrategy_con">
    <!--返回-->
    <!--<div class="back_top">-->
    <!--<div class="back" @click="back()"></div>-->
    <!--<span>策略</span>-->
    <!--</div>-->
    <publick-head>
      <div slot="bakc" class="back"></div>
      <span slot="title">按月策略</span>
    </publick-head>
    <div class="stock_top">
      <router-link class="hot_stock" to="dayStrategy" tag="div">
        <span>热闹股票</span>
      </router-link>
      <router-link class="hot_optional" to="monthStrategy" tag="div">
        <span>热门自选</span>
      </router-link>
    </div>
    <div class="main">
      <div class="promise">
        <span>保证金</span>
        <span>100%实盘交易</span>
      </div>
      <div class="input_money">
        <input type="text" placeholder="请输入金额：最少100，500万">
      </div>
      <div class="daystrategy_money">
        <span>策略金额</span>
        <i>0元</i>
      </div>
      <div class="scheme">
        <span>策略倍数</span>
        <div class="scheme_item">
          <div class="scheme_top">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
          </div>
          <div class="scheme_top">
            <div>6</div>
            <div>7</div>
            <div>8</div>
            <div>9</div>
            <div>10</div>
          </div>
        </div>
      </div>
      <div class="scheme_detal">
        <div>
          <span>单票持仓</span>
          <div class="right">
            <span>主板50%,创业板60%</span>
          </div>
        </div>
        <div>
          <span>总操盘资金</span>
          <div class="right">
            <span>0元</span>
          </div>
        </div>
        <div>
          <span>亏损预警线</span>
          <div class="right">
            <span class="lose">0元</span>
          </div>
        </div>
        <div>
          <span>亏损平仓线</span>
          <div class="right">
            <span class="close">0元</span>
          </div>
        </div>
        <div>
          <span>保证金</span>
          <div class="right">
            <span>0元</span>
          </div>
        </div>
        <div>
          <span>预存管理费</span>
          <div class="right">
            <span>0.00元/交易日</span>
          </div>
        </div>
      </div>
      <div class="strategy_bot">
        <img src="../../assets/img/protocol.png" alt="">
        <div class="btn_con">
          <div class="order_money">
            共计确认支付: <i>0.00元</i>
          </div>
          <div class="btn" @click="apply('apply')">
            确认支付
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'

  export default {
    name: "monthStrategy",
    data() {
      return {}
    },
    mounted: function () {

    },
    methods: {
      //去支付
      apply() {
        this.$router.push('apply');
      },
    },
    components: {
      publickHead
    }
  }
</script>

<style scoped>

  .stock_top {
    padding: 0 86px;
    box-sizing: border-box;
    display: flex;
    border-bottom: 20px solid #dddddd;
    font-size: 30px;
    color: #e70012;
    justify-content: space-between;
    background: #ffffff;

  }

  .stock_top div {
    width: 190px;
    text-align: center;
    height: 60px;
    line-height: 60px;
  }

  .stock_top .router-link-active {
    border-bottom: 8px solid #e70012;
  }

  .promise {
    display: flex;
    justify-content: space-between;
    margin: 16px 50px 28px 50px;
    font-size: 24px;
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
    font-size: 20px;
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
    font-size: 24px;
    color: #5b5b5b;
    padding: 0 0 34px 0;
  }

  .scheme_item {
    display: flex;
    flex-direction: column;
  }

  .scheme_top {
    display: flex;
    justify-content: space-between;
  }

  .scheme_top div {
    margin: 0 0 20px 0;
    width: 100px;
    height: 42px;
    color: #5b5b5b;
    font-size: 20px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #d2d2d2;
    line-height: 42px;
  }

  .scheme_item .ac {
    background: #e70012;
    color: #ffffff;
  }

  .scheme_detal {
    background: #dddddd;
    padding: 10px 0 158px 0;
  }

  .scheme_detal div {
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    padding: 0 50px;
    line-height: 80px;
  }

  .scheme_detal div span {
    font-size: 27px;
    color: #5b5b5b;
  }

  .right span {
    font-size: 30px;
  }

  .right .lose {
    color: #eb0505;
  }

  .right .close {
    color: #00ff00;
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

  input::-webkit-input-placeholder {
    font-size: 20px;
    opacity: 1;
  }

  /* WebKit browsers */
  input:-moz-placeholder {
    font-size: 20px;
    opacity: 1;
  }

  /* Mozilla Firefox 4 to 18 */
  input::-moz-placeholder {
    font-size: 20px;
    opacity: 1;
  }

  /* Mozilla Firefox 19+ */
  input:-ms-input-placeholder {
    font-size: 20px;
    opacity: 1;
  }

  /* Mozilla Firefox 19+ */

</style>
