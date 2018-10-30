<template>
  <div class="stock_con">
    <publick-head>
      <div slot="bakc" class="back"></div>
      <span slot="title">订单详情</span>
    </publick-head>
    <div class="main">
      <div class="main_top">
        <div class="main_title">
          <span>股票代码:</span>
          <span class="stock_num">{{orderDetail.stock_name}}/{{stockDetail.code}}</span>
        </div>
        <div class="stock_status">
          <span>最新: <i class="new_stock">{{Number(orderDetail.now_price).toFixed(2)}}</i></span>
          <span>昨收: <i>{{Number(orderDetail.yesterday_price).toFixed(2)}}</i></span>
          <span>涨停: <i class="stock_stop">{{Number(orderDetail.up_price).toFixed(2)}}</i></span>
          <span>跌停: <i class="fall_stop">{{Number(orderDetail.down_price).toFixed(2)}}</i></span>
        </div>
      </div>

      <!--更换显示图片-->
      <div class="change_con">
        <div class="stock_top">
          <div class="hot_stock " :class="{'ac':tabNum == 0}" @click="changeTab(0)">
            <span>分时图</span>
          </div>
          <div class="hot_optional" :class="{'ac':tabNum == 1}" @click="changeTab(1)">
            <span>日K图</span>
          </div>
        </div>
        <!--分时图-->
        <img :src="stockDetail.time_line" alt="" v-if="tabNum == 0" class="stock_img">
        <img :src="stockDetail.day_line" alt="" v-else class="stock_img">
      </div>

      <!--股票详情列表-->
      <div class="details_list">
        <div class="list_item">
          <span>订单编号</span>
          <span>{{orderDetail.no}}</span>
        </div>
        <div class="list_item">
          <span>成交时间</span>
          <span>{{orderDetail.end_deal_at}}</span>
        </div>
        <div class="list_item">
          <span>买入均价</span>
          <span>{{Number(orderDetail.buy_avg_price).toFixed(2)}}元</span>
        </div>
        <div class="list_item">
          <span>手续费</span>
          <span>{{Number(orderDetail.charge_price).toFixed(2)}}元</span>
        </div>
        <div class="list_item">
          <span>订单持有数量</span>
          <span>{{orderDetail.num}}股</span>
        </div>
        <div class="list_item">
          <span>可用股票</span>
          <span>{{orderDetail.usable_num}}股</span>
        </div>
        <div class="list_item">
          <span>总市值</span>
          <span>{{Number(orderDetail.market_value).toFixed(2)}}元</span>
        </div>
        <div class="list_item">
          <span>持仓盈亏</span>
          <span>{{orderDetail.loss_rate}}/{{Number(orderDetail.loss).toFixed(2)}}元</span>
        </div>
        <div class="list_item">
          <span>预警价格</span>
          <span>{{Number(orderDetail.waining_price).toFixed(2)}}元</span>
        </div>
        <div class="list_item">
          <span>平仓价格 </span>
          <span>{{Number(orderDetail.die_price).toFixed(2)}}元 </span>
        </div>

      </div>

      <!--五档详情-->
      <div class="five_detail" v-if="stockDetail.stock_market != null">
        <div class="five_title">五档详情</div>
        <div class="five_con">
          <div class="left border_right">
            <div>
              <span>买一</span>
              <span class="detail_money">{{Number(stockDetail.stock_market.buy_one_price).toFixed(2)}}</span>
              <span class="detail_num">{{Number(stockDetail.stock_market.buy_one_quantity)}}</span>
            </div>
            <div>
              <span>买二</span>
              <span class="detail_money">{{Number(stockDetail.stock_market.buy_two_price).toFixed(2)}}</span>
              <span class="detail_num">{{Number(stockDetail.stock_market.buy_two_quantity)}}</span>
            </div>
            <div>
              <span>买三</span>
              <span class="detail_money">{{Number(stockDetail.stock_market.buy_three_price).toFixed(2)}}</span>
              <span class="detail_num">{{Number(stockDetail.stock_market.buy_three_quantity)}}</span>
            </div>
            <div>
              <span>买四</span>
              <span class="detail_money">{{Number(stockDetail.stock_market.buy_five_price).toFixed(2)}}</span>
              <span class="detail_num">{{Number(stockDetail.stock_market.buy_four_quantity)}}</span>
            </div>
            <div>
              <span>买五</span>
              <span class="detail_money">{{Number(stockDetail.stock_market.buy_five_price).toFixed(2)}}</span>
              <span class="detail_num">{{Number(stockDetail.stock_market.buy_five_quantity)}}</span>
            </div>
          </div>
          <div class="left right">
            <div>
              <span>卖一</span>
              <span class="detail_money">{{Number(stockDetail.stock_market.sell_one_price).toFixed(2)}}</span>
              <span class="detail_num">{{Number(stockDetail.stock_market.sell_one_quantity)}}</span>
            </div>
            <div>
              <span>卖二</span>
              <span class="detail_money">{{Number(stockDetail.stock_market.sell_two_price).toFixed(2)}}</span>
              <span class="detail_num">{{Number(stockDetail.stock_market.sell_two_quantity)}}</span>
            </div>
            <div>
              <span>卖三</span>
              <span class="detail_money">{{Number(stockDetail.stock_market.sell_three_price).toFixed(2)}}</span>
              <span class="detail_num">{{Number(stockDetail.stock_market.sell_three_quantity)}}</span>
            </div>
            <div>
              <span>卖四</span>
              <span class="detail_money">{{Number(stockDetail.stock_market.sell_four_price).toFixed(2)}}</span>
              <span class="detail_num">{{Number(stockDetail.stock_market.sell_four_quantity)}}</span>
            </div>
            <div>
              <span>卖五</span>

              <span class="detail_money">{{Number(stockDetail.stock_market.sell_five_price).toFixed(2)}}</span>
              <span class="detail_num">{{Number(stockDetail.stock_market.sell_five_quantity)}}</span>
            </div>
          </div>
        </div>
      </div>

      <!--卖出-->
      <div class="btn" v-if="orderDetail.usable_num >= 100">
        <span  @click="shellUrl('stockDeal')">我要卖出</span>
      </div>
    </div>

    <!--loading-->
    <loading ref="loading"></loading>

    <!--提示-->
    <hint-model ref="message">
      <p class="title" slot="title">{{errorMessage}}</p>
      <div slot="ico" v-if="successIco" class="ico_success"></div>
    </hint-model>
  </div>
</template>

<script>
  import {overContract, positionDetail, stockDetail} from "../../api";
  import loading from '../../components/publick/loading'
  import hintModel from '@/components/publick/hintModel'
  import publickHead from '@/components/publick/publickHead'

  export default {
    name: "stockOrder",
    data() {
      return {
        tabNum: 0,  //那个展示
        errorMessage: '',   //错误提示信息
        successIco: false,   //成功
        orderDetail: {},     //订单详情数据
        stockDetail: {},     //股票详情

      }
    },
    mounted: function () {
      this.$refs.loading.show = true
      this.positionDetail();
    },
    methods: {
      /** 17:56
       *   @author: yuanjie
       *   @description:切换tab
       *   @param{num}
       */
      changeTab(num) {
        this.tabNum = num;
      },
      /** 11:33
       *   @author: yuanjie
       *   @description:获取订单详情
       *   @param
       */
      positionDetail() {
        positionDetail({order_no: this.$route.params.id}).then(res => {
          if (res.data.status == 0) {
            this.orderDetail = res.data.data;
            stockDetail({'code': this.orderDetail.stock_code}).then(res => {
              if (res.data.status == 0) {
                this.stockDetail = res.data.data;
                this.$store.commit('closeLoading');
              } else {
                this.$store.commit('closeLoading');
              }
            })

          }
        })
      },
      /** 10:35
       *   @author: yuanjie
       *   @description:
       *   @param{string} url地址
       */
      shellUrl(strUrl) {
        // console.log(this.orderDetail.no);
        this.$router.push({
          name: strUrl,
          params: {
            showNum: 1,
            canBuyNum: this.orderDetail.usable_num,
            stockCode: this.stockDetail.stock_code,
            stockName: this.stockDetail.name,
            no: this.orderDetail.no,
            stock_no: this.orderDetail.stock_no
          }
        });

      }
    },
    components: {
      publickHead,
      loading,
      hintModel
    }
  }
</script>

<style scoped>
  .stock_con {
    /*background:#eeeeee;*/
  }

  .main_top {
    margin: 0 20px;
    padding: 0 10px;
  }

  .main_title {
    font-size: 30px;
    color: #000000;
    padding: 28px 0 14px 0;
    border-bottom: 1px solid #d2d2d2;
  }

  .stock_status {
    font-size: 24px;
    padding: 12px 0;
    color: #000000;
    display: flex;
    justify-content: space-between;
  }

  .new_stock, .stock_stop {
    color: #e70012;
  }

  .fall_stop {
    color: #00e705;
  }

  .main_title .stock_num {
    /*padding-left: 127px;*/
  }

  .change_con {
    border-top: 10px solid #dddddd;
  }

  .change_con img {
    margin: 10px;
  }

  .stock_top {
    padding: 0 86px;
    box-sizing: border-box;
    display: flex;
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

  .stock_top .ac {
    border-bottom: 8px solid #e70012;
  }

  .details_list {
    border-top: 10px solid #dddddd;
  }

  .list_item {
    display: flex;
    justify-content: space-between;
    margin: 0 10px;
    height: 80px;
    line-height: 80px;
    font-size: 30px;
    color: #040000;
    border-bottom: 1px solid #eeeeee;
    padding: 0 20px;
  }

  .details_list .list_item:last-child {
    border-bottom: none;
  }

  .five_detail {
    border-top: 10px solid #dddddd;
    padding: 0 32px;
    font-size: 24px;
    box-sizing: border-box;
  }

  .five_title {
    padding: 20px 0 26px 0;
  }

  .five_con {
    display: flex;
    justify-content: space-between;
  }

  .left {
    position: relative;
    color: #000000;
    flex: 1;
  }

  /*.border_right:after {*/
    /*content: '';*/
    /*width: 1px;*/
    /*height: 300px;*/
    /*position: absolute;*/
    /*right: 20px;*/
    /*top: 0;*/
    /*border-left: 1px dashed #d2d2d2;*/
  /*}*/

  .left div {
    display: flex;
    padding-bottom: 34px;
  }

  .left .detail_money {
    padding: 0 60px 0 68px;
    /*color: #00e705;*/
  }

  .right .detail_money {
    /*color: #e70012;*/
  }

  .btn {
    width: 100%;
    height: 168px;
    background: #eeeeee;
    /*bottom: 0;*/
    border-top: 1px solid transparent;
    display: flex;
  }

  .btn span {
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-top: 1px solid #e5e5e5;
    width: 100%;
    display: block;
    margin: 60px 120px;
    background: blue;
    color: #ffffff;
    border-radius: 40px;

  }

  .btn_con {
    width: 100%;
    display: flex;
    align-self: flex-end;
  }

  .stock_img {
    height: 413px;
    width: 100%;
    margin: 0 !important;
  }
  .left div span:nth-child(1){
    color: #eb0505;
  }
  .right div span:nth-child(1){
    color: #00ff00;
  }
  .detail_num {
    color: #a1a1a1;
  }

  /*.btn_con span{*/
  /*display: block;*/
  /*background: #9c9c9c;*/
  /*text-align: center;*/
  /*line-height: 80px;*/
  /*height: 80px;*/
  /*color: #ffffff;*/
  /*font-size: 28px;*/
  /*width: 33.33%;*/
  /*}*/
  /*.btn_con span:nth-child(1){*/
  /*background:#eb0505;*/
  /*}*/
  /*.btn_con span:nth-child(2){*/
  /*background:#eb8105;*/
  /*}*/
  /*.btn_con span:nth-child(3){*/
  /*background:#898989;*/
  /*}*/

</style>
