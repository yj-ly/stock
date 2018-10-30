<template>
  <div class="positions_con" :style="{'minHeight':calc}">
    <!--返回-->
    <publick-head style="background:#ffffff; margin-bottom: 15px">
      <div slot="bakc" class="back"></div>
      <span slot="title">我的持仓</span>
    </publick-head>
    <!--持仓列表-->
    <div class="list_con" :style="{height:calcHeight + 'px'}" v-if="takeList.length > 0">
      <div class="list_center" :style="{'min-height':calcHeight + 'px'}">
        <div class="list_item" v-for="item in takeList">
          <!--order-->
          <div class="order_con">
            <!--策略编号-->
            <div class="list_top" :style="{'width':calcWidth}"
                 @click="localUrl('positionDetails',item[0].contracts_no)">
              <span>策略名称:{{item[0].contract_name}}&nbsp;&nbsp;策略编号:{{item[0].contracts_no}}</span>
              <i class="ico"></i>
            </div>
            <div class="order_title" @click="localUrl('positionDetails',item[0].contracts_no)">
              <span>我的持仓</span>
              <span>涨跌幅(%)/涨跌</span>
              <span>持仓盈亏</span>
            </div>
            <div class="order_item" @click="localUrl('stockOrder',orderItem.no)" v-for="orderItem in item">
              <div class="order_left">
                <span>{{orderItem.stock_name}}</span>
                <div>{{orderItem.stock_code}}</div>
              </div>
              <div class="order_cneter">
                <div :class="{'new':(Number(orderItem.now_price) - Number(orderItem.buy_avg_price)).toFixed(2) > 0,'drop_txt':Number(orderItem.now_price) - Number(orderItem.buy_avg_price) < 0
                 ,'position_txt':(Number(orderItem.now_price) - Number(orderItem.buy_avg_price))
                  == 0}">{{((Number(orderItem.now_price) - Number(orderItem.buy_avg_price)) /
                  orderItem.buy_avg_price).toFixed(2)}}
                </div>
                <span class="fen">/</span>
                <div :class="{'new':(Number(orderItem.now_price) - Number(orderItem.buy_avg_price)).toFixed(2) > 0, 'drop_txt':Number(orderItem.now_price) - Number(orderItem.buy_avg_price) < 0,'position_txt':(Number(orderItem.now_price) - Number(orderItem.buy_avg_price))
                  == 0}">{{(Number(orderItem.now_price) - Number(orderItem.buy_avg_price) ).toFixed(2)}}</div>

              </div>
              <div class="order_right">
                <!--<span class="add_txt">+</span>-->
                <!--<span class="drop_txt" style="display: none">-</span>-->
                <!--<span class="add_txt position_txt">{{orderItem.loss_rate}}</span>-->
                <!--<span class="fen">/</span>-->
                <!--<span class="add_txt">+</span>-->
                <!--<span class="drop_txt" style="display: none">-</span>-->
                <span :class="{'add_txt':orderItem.loss > 0,'drop_txt': orderItem.loss < 0,'position_txt':orderItem.loss == 0}">{{orderItem.loss}}元</span>
              </div>

              <div class="last_right">
                <div @click.stop="goProtectMoney(0,orderItem)">补保</div>
                <div @click.stop="goProtectMoney(1,orderItem)" v-if="orderItem.margin_money > 0">取保</div>
              </div>
            </div>
          </div>
        </div>
        <span class="refresh" v-if="showRefresh">刷新成功</span>
        <div class="nont">没有更多</div>
      </div>
    </div>

    <!--loading-->
    <loading ref="loading"></loading>

    <!--数据为空-->
    <div class="not_search" v-if="takeList.length == 0">
      <img src="../../assets/img/search_not.png" alt="">
      <p>什么东西都没有找到</p>

      <router-link to="stockDeal" tag="div" class="btn">来一单就来一单</router-link>
    </div>
  </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import loading from '../../components/publick/loading'
  import {takePosition} from "../../api";

  export default {
    name: "positions",
    data() {
      return {
        headHeight: 0,  //获取头部的高度
        takeList: [],    //持仓列表
        takeModel: {   //传入接口
          page: 1,
          size: 10,
          sort: 'created_at',
          order: 'desc'

        },
        showRefresh: false, //刷新成功
      }
    },
    mounted: function () {
      this.$store.commit('openLoading');
      this.takePosition();
    },
    methods: {
      /** 9:23
       *   @author: yuanjie
       *   @description:跳转地址
       *   @param{number}跳转到详情需要的参数
       */
      localUrl(strUrl, id) {
        this.$router.push({name: strUrl, params: {id: id}});

      },
      /** 10:39
       *   @author: yuanjie
       *   @description:获取持仓列表
       *   @param
       */
      takePosition() {
        takePosition(this.takeModel).then(res => {
          if (res.data.status == 0) {
            this.takeList = res.data.data;
            this.$store.commit('closeLoading');
            if (this.takeList.length > 0) {
              this.addMore();
            }

          }
        })
      },
      /** 15:54
       *   @author: yuanjie
       *   @description:补保和取保
       *   @param{number} 判断点击的是那一个
       *   @param{object} 当前点击的对象
       */
      goProtectMoney(num, item) {
        this.$router.push({name: 'protectMoney', params: {typeNum: num, no: item.no}});
      },
      /** 14:11
       *   @author: yuanjie
       *   @description:下拉加载更多
       *   @param
       */
      addMore() {
        let that = this;
        if(this.takeList.length > 0){
          this.$nextTick(() => {
            var oDiv = document.getElementsByClassName('list_con')[0];
            var list = document.getElementsByClassName('list_center')[0];
            that.oDiv = document.getElementsByClassName('nont')[0];
            that.oDiv.style.visibility = 'hidden';
            var better = new BScroll(oDiv, {
              click: true,
              pullDownRefresh: {
                threshold: 50,  //大于多少才开始
                stop: 20
              },
              pullUpLoad: {
                threshold: 50,
                // stop:-50
              },
            })

            /* 下拉刷新 */
            better.on("pullingDown", function () {
              list.classList.add("pullUp");
              that.takeModel.page = 1;
              takePosition(that.takeModel).then(res => {
                if (res.data.status == 0) {
                  that.takeList = res.data.data;
                  list.classList.remove("pullUp");
                  that.showRefresh = true;
                  setTimeout(() => {
                    that.showRefresh = false;
                    better.finishPullDown();
                    better.refresh();
                  }, 1000)
                } else {
                }
              })
            });

            better.on("pullingUp", function () {
              that.oDiv.style.visibility = 'hidden';
              that.takeModel.page += 1;
              list.classList.add("pullDown");
              takePosition(that.takeModel).then(res => {
                if (res.data.status == 0) {
                  let orderList = res.data.data;
                  that.takeList = that.takeList.concat(orderList);
                  list.classList.remove("pullDown");
                  if (orderList.length == 0) {
                    that.takeModel.page -= 1;
                    that.oDiv.style.visibility = 'visible';
                  }
                  better.finishPullUp();
                  better.refresh();
                } else {
                }
              })


            });
          })
        }

      }

    },
    components: {
      publickHead,
      loading
    },
    computed: {
      /** 17:34
       *   @author: yuanjie
       *   @description:计算页面宽度
       *   @param
       */
      calcWidth() {
        return document.documentElement.clientWidth + 'px';
      },
      /** 15:36
       *   @author: yuanjie
       *   @description:计算页面最小的高度
       *   @param
       */
      calc() {
        // let oHead = document.querySelector('.head_con');
        return document.documentElement.clientHeight + 'px';
      },
      calcHeight() {
        // let oHead = document.querySelector('.head_con');
        // console.log(oHead);
        return document.documentElement.clientHeight;
      }
    }
  }
</script>

<style scoped>
  .list_con {
    overflow: hidden;
  }

  .positions_con {
    background: #eeeeee;
  }

  .list_item {
    width: 100%;
    position: relative;
    margin: 0 0 30px 0;
    border-radius: 10px;
    border-top: 1px solid transparent;
    background: #eeeeee;
  }

  .list_top {
    position: relative;
    width: 100%;
    left: -22px;
    top: 16px;
    height: 44px;
    background: #f45d55;
    color: #ffffff;
    font-size: 24px;
    padding: 0 20px;
    line-height: 44px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .list_top i {
    display: block;
    float: right;
    width: 13px;
    height: 23px;
    background: url("../../assets/img/positions_more.png") no-repeat;
    background-size: contain;
    margin: 10px 0 0 0;
  }

  .order_con {
    margin: 0 22px 0 22px;
    background: #ffffff;
    position: relative;
    border-radius: 10px;

  }

  .order_title {
    display: flex;
    /*justify-content: space-between;*/
    margin: 16px 0 0 0;
    /*padding: 0 10px 0 19px;*/
    height: 64px;
    align-items: center;
    font-size: 26px;
    color: #000000;
    border-bottom: 1px solid #f7f7f7;
  }

  .order_title span {
    display: block;
    text-align: center;
  }

  .order_title span:nth-child(1) {
    width: 104px;
    margin: 0 0 0 40px;
  }

  .order_title span:nth-child(2) {
    width: 200px;
    margin: 0 0 0 50px;
  }

  .order_title span:nth-child(3) {
    width: 170px;
    margin: 0 0 0 30px;
  }

  .order_item {
    display: flex;
    height: 112px;
    border-bottom: 1px solid #f7f7f7;
    align-items: center;
    font-size: 26px;
    /*margin: 0 40px 0 34px;*/
    /*padding: 0 0 0 19px;*/
    justify-content: space-between;
    background: #ffffff;
  }

  .order_left {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 104px;
    margin: 0 0 0 40px;

  }

  .order_left span {
    color: #3a3a3a;
  }

  .order_left div {
    font-size: 24px;
    color: #217ab1;
  }

  .order_cneter {
    color: #3a3a3a;
    display: flex;
    width: 220px;
    /*margin: 0 0 0 50px ;*/
    justify-content: center;
    text-align: center;
    align-items: center;
    margin: 0 0 0 20px;

  }

  .list_item .new {
    color: #eb0505;
    font-size: 30px !important;
  }

  .order_right {
    display: flex;
    /*width: 190px;*/
    width: 170px;
    font-size: 30px;
    /*text-align: center;*/
    justify-content: center;
    margin: 0 40px 0 0;

  }

  .order_right .add_txt {
    color: #eb0505;
  }

  .order_right .drop_txt {
    color: #00ff00;
  }

  .last_right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 0;
    margin-right: 30px;
  }

  .last_right div {
    font-size: 28px;
    color: #eb0505;

  }

  .lose {
    color: #00ff00 !important;
  }

  .not_search {
    text-align: center;
  }

  .not_search img {
    width: 166px;
    margin: 80px 0 0 0;
  }

  .not_search p {
    margin: 10px 0 0 0;
    font-size: 36px;
    color: #aaaaaa;
  }

  .pullUp:after {
    content: '';
    position: absolute;
    left: 0;
    top: -40px;
    height: 40px;
    /*line-height: 60px;*/
    text-align: center;
    width: 100%;
    background: url("../../assets/img/refresh_ico.gif") no-repeat center #eeeeee;
    background-size: contain;
  }

  .pullDown:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 80px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    width: 100%;
    background: url("../../assets/img/refresh_ico.gif") no-repeat center #eeeeee;
    background-size: contain;
  }

  .list_center {
    position: relative;
    padding-bottom: 100px;
  }

  .refresh {
    position: absolute;
    top: -40px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 26px;
    color: #a7a7a7;
    height: 40px;
    line-height: 40px;
    background: #eeeeee;
  }

  .nont {
    width: 100%;
    line-height: 40px;
    height: 40px;
    text-align: center;
    position: relative;
    bottom: 20px;
    visibility: hidden;
  }

  .btn {
    margin: 70px 130px 0 130px;
    background: #e70012;
    text-align: center;
    line-height: 66px;
    color: #ffffff;
    font-size: 26px;
    border-radius: 30px;
  }

  .fen {
    color: #3a3a3a !important;
    font-weight: 100 !important;
  }
  .drop_txt {
    color: #00ff00 !important;
  }
  .position_txt {
    color: #000000 !important;
  }
</style>
