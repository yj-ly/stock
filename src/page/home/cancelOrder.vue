<template>
  <div class="cancel_order" :style="{'minHeight':calc}">

    <!--返回-->
    <publick-head style="background:#ffffff">
      <div slot="bakc" class="back"></div>
      <span slot="title">{{title}}</span>
    </publick-head>

    <!--main-->
    <!--撤单-->
    <div class="main">
      <div class="con" :style="{height:clHeight + 'px'}" v-if="list.length > 0">
        <div class="list_center_con" :style="{'min-height':clHeight + 2 + 'px'}">
          <div class="cancellations_con" v-for="item in list" v-if="list.length > 0 && $route.params.typeNum != 4">
            <div class="cancellations_list">

              <div class="cancell_top">
                <div class="cancel_left" v-if="item.type == 0 || item.type == 1 ">
                  <div class="cancellations_time">
                    {{item.created_at}}
                    <i>|</i>
                    <span v-if="item.die_status != 1"> {{detailType[item.type]}}</span>

                    <span v-if="item.die_status == 1">{{sellType[item.die_status]}}</span>

                    ({{orderType[item.status]}})
                  </div>
                  <div class="cancell_name">
                    <span>股票名称：</span>
                    {{item.stock_name}}({{item.stock_code}})
                    <div class="cancell_status">{{statusType[item.entrust_status]}}</div>
                    <div class="cancellations_btn"
                         v-if="item.entrust_status != 2 && item.status != 2 && item.status != 0 && item.status != 3 && item.status != 6 && item.status != 5 　&& $route.params.typeNum != 3"
                         @click="setOrder(item.no)">撤单
                    </div>
                  </div>
                  <div class="cancell_money" v-if="$route.params.typeNum == 1 || $route.params.typeNum == 3">
                    <span>委托总价：</span>
                    ￥{{item.total_price}}
                  </div>

                  <div class="cancell_money" v-if="$route.params.typeNum == 0 || $route.params.typeNum == 2">
                    <span>成交总价：</span>
                    ￥{{item.success_price}}
                  </div>
                </div>

                <div class="cancel_right first_right">
                  <!--<div class="withhold">预扣实际:</div>-->
                </div>
              </div>
              <div class="cancell_bottom">
                <div><span>委托/成交单价：</span>￥{{item.price}}/{{item.avg_price}}</div>
                <div class="last_position">
                  <div class="withhold">预扣/实际：<i>￥{{item.adv_sum_charge}}/{{item.actual_sum_charge}}</i></div>
                  <span>委托/成交股数：</span>{{item.entrust_num}}/{{item.success_num}}
                </div>
              </div>
            </div>
          </div>
          <div class="cancellations_con" v-for="item in list" v-if="list.length > 0 && $route.params.typeNum == 4">
            <div class="cancellations_list">

              <div class="cancell_top">
                <div class="cancel_left" v-if="item.type == 0 || item.type == 1 ">
                  <div class="cancellations_time">
                    {{item.created_at}}
                    <i>|</i>
                    {{detailType[item.type]}}
                  </div>
                  <div class="cancell_name">
                    <span>股票名称：</span>
                    {{item.stock_name}}({{item.stock_code}})
                  </div>
                  <div class="cancell_money">
                    <span>委托总价：</span>
                    ￥{{item.total_price}}
                  </div>
                </div>

                <div class="cancel_left" v-if="item.type == 10 || item.type == 11 ">
                  <div class="cancellations_time">
                    {{item.created_at}}
                    <i>|</i>
                    {{dataType[item.type]}}
                  </div>
                  <div class="cancell_name">
                    <span>股票名称：</span>
                    {{item.stock_name}}({{item.stock_code}})
                  </div>
                  <!--<div class="cancell_money">-->
                  <!--<span>委托总价：</span>-->
                  <!--￥{{item.total_price}}-->
                  <!--</div>-->
                </div>
                <div class="cancel_right detail" v-if="item.type == 0 || item.type == 1 ">
                  <!--<div class="cancellations_btn" v-if="item.entrust_status != 2 && item.status != 2 && item.status != 3 && item.status != 6 && item.status != 5 " @click="setOrder(item.no)">撤单</div>-->
                  <div class="cancell_status"><span>委托手续费：</span>￥{{Number(item.charge_sum).toFixed(2)}}</div>
                  <div class="cancell_status"><span>委托股数：</span>{{item.entrust_num}}</div>
                </div>
                <div class="cancel_right detail" v-if="item.type == 10 || item.type == 11 ">
                  <!--<div class="cancellations_btn" v-if="item.entrust_status != 2 && item.status != 2 && item.status != 3 && item.status != 6 && item.status != 5 " @click="setOrder(item.no)">撤单</div>-->
                  <div><span>金额：</span>￥{{item.success_price}}</div>

                </div>
              </div>
              <div class="cancell_bottom" v-if="item.type == 0 || item.type == 1 ">
                <div><span>委托均价：</span>￥{{item.price}}</div>
                <!--<div><span>委托/成交股数：</span>{{item.entrust_num}}/{{item.success_num}}</div>-->
              </div>

              <!--<div class="cancell_bottom" v-if="item.type == 10 || item.type == 11 ">-->
              <!--<div ><span>金额：</span>￥{{item.success_price}}</div>-->

              <!--&lt;!&ndash;<div><span>委托/成交股数：</span>{{item.entrust_num}}/{{item.success_num}}</div>&ndash;&gt;-->
              <!--</div>-->
            </div>
          </div>

          <span class="refresh" v-if="showRefresh">刷新成功</span>
          <div class="nont">没有更多</div>
        </div>
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
        <p>是否撤销该订单</p>
        <i class="ico"></i>
        <div class="loginout_bnt">
          <div class="sure" @click="cancelOrder">确定</div>
          <div class="cancel" @click="showModelOver = false">取消</div>
        </div>
      </div>
    </div>

    <div class="not_search" v-if="list.length == 0">
      <img src="../../assets/img/search_not.png" alt="">
      <p>什么东西都没有找到</p>
    </div>
  </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import loading from '../../components/publick/loading'
  import hintModel from '@/components/publick/hintModel'
  import {getTaday, getHistory, moneyList, cancelOrder} from '@/api/user.js'

  export default {
    name: "cancelOrder",
    data() {
      return {
        errorMessage: '',   //提示信息
        showSuccess: false,  //成功的信息
        calcHeight: 0,
        title: '',          //展示不同的title
        list: [],    //数据
        showModelOver: false,
        showRefresh: false, //刷新成功
        orderNum: '',
        oDiv: null,
        dayModel: {
          page: 1,
          size: 6,
          way: 0,
        },
        moneyModel: {
          page: 1,
          size: 6
        },
        orderType: {
          0: '已挂单',
          1: '委托中',
          2: '委托失败',
          3: '系统结束',
          5: '撤销中',
          6: '撤销成功',
          7: '撤销失败',
          8:'已完成'
        },
        statusType: {
          0: '未成交',
          1: '部分成交',
          2: '完全成交',
        },
        detailType: {
          0: '买入',
          1: '卖出'
        },
        dataType: {
          10: '补保证金',
          11: '取保证金',
        },
        sellType: {
          1: '平仓卖出'
        }
      }
    },
    mounted: function () {
      this.$store.commit('openLoading');
      this.judgeTitle();

    },
    methods: {

      /** 9:22
       *   @author: yuanjie
       *   @description:judge判断当前点击的是那一个
       *   @param
       */
      judgeTitle() {
        let num = String(this.$route.params.typeNum);
        switch (num) {
          case '0':
            this.title = '当日成交';
            this.dayModel.way = 1;
            getTaday(this.dayModel).then(res => {
              if (res.data.status == 0) {
                this.list = res.data.data;
                this.$store.commit('closeLoading');
                this.addMore();
              } else {
                this.$store.commit('closeLoading');
              }
            })
            break;
          case '1':
            this.title = '当日委托';
            this.dayModel.way = 0;
            getTaday(this.dayModel).then(res => {
              if (res.data.status == 0) {
                this.list = res.data.data;
                this.$store.commit('closeLoading');
                this.addMore();
              } else {
                this.$store.commit('closeLoading');
              }
            })
            break;
          case '2':
            this.title = '历史成交';
            this.dayModel.way = 1;
            getHistory(this.dayModel).then(res => {
              if (res.data.status == 0) {
                this.list = res.data.data;
                this.$store.commit('closeLoading');
                this.addMore();
              } else {
                this.$store.commit('closeLoading');
              }
            })
            break;
          case '3':
            this.title = '历史委托';
            this.dayModel.way = 0;
            getHistory(this.dayModel).then(res => {
              if (res.data.status == 0) {
                this.list = res.data.data;
                this.$store.commit('closeLoading');
                this.addMore();
              } else {
                this.$store.commit('closeLoading');
              }
            })
            break;
          case '4':
            this.title = '交易流水';
            moneyList(this.moneyModel).then(res => {
              if (res.data.status == 0) {
                this.list = res.data.data;
                this.$store.commit('closeLoading');
                this.addMore();
              } else {
                this.$store.commit('closeLoading');
              }
            })
            break;
        }

      },
      /** 15:16
       *   @author: yuanjie
       *   @description:第一次撤单
       *   @param{number}
       */
      setOrder(num) {
        this.orderNum = num;
        this.showModelOver = true;
      },
      /** 15:05
       *   @author: yuanjie
       *   @description:撤单
       *   @param{number}
       */
      cancelOrder(num) {
        this.showModelOver = false;
        cancelOrder({'entrust_no': this.orderNum}).then(res => {
          if (res.data.status == 0) {
            this.$refs.message.showModel = true;
            this.showSuccess = true;
            this.errorMessage = res.data.msg;
            this.dayModel.page = 1;
            this.moneyModel.page = 1;
            if (this.$route.params.typeNum != 4) {

              if (this.$route.params.typeNum == 0 || this.$route.params.typeNum == 1) {

                getTaday(this.dayModel).then(res => {
                  if (res.data.status == 0) {
                    this.list = res.data.data;
                  }
                })
              } else if (this.$route.params.typeNum == 2 || this.$route.params.typeNum == 3) {
                getHistory(this.dayModel).then(res => {
                  if (res.data.status == 0) {
                    this.list = res.data.data;
                  }
                })
              }

            }
          } else {
            this.$refs.message.showModel = true;
            this.errorMessage = res.data.msg;
          }
        })
      },
      /** 14:11
       *   @author: yuanjie
       *   @description:下拉加载刷新
       *   @param
       */
      addMore() {
        let that = this;
        if (this.list.length > 0) {
          this.$nextTick(() => {
            var oDiv = document.getElementsByClassName('con')[0];
            var list = document.getElementsByClassName('list_center_con')[0];
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
              },
            })

            /* 下拉刷新 */
            better.on("pullingDown", function () {
              list.classList.add("pullUp");
              that.judegNumber(that.$route.params.typeNum, that, list, better);

            });

            better.on("pullingUp", function () {
              list.classList.add("pullDown");
              that.oDiv.style.visibility = 'hidden';
              that.dayModel.page += 1;
              that.moneyModel.page += 1;
              that.judgePull(that.$route.params.typeNum, that, list, better);

            });
          })
        }

      },

      /** 16:04
       *   @author: yuanjie
       *   @description:下拉刷新的判断
       *   @param{number}传入当前的id判断是那一个
       */
      judegNumber(num, that, list, better) {
        this.moneyModel.page = 1;
        this.dayModel.page = 1;
        if (num == 0 || num == 1) {

          if (num == 0) {
            this.dayModel.way = 1;
            getTaday(this.dayModel).then(res => {
              if (res.data.status == 0) {
                this.list = res.data.data;
                list.classList.remove("pullUp");
                this.showRefresh = true;
                setTimeout(() => {
                  this.showRefresh = false;
                  better.finishPullDown();
                  better.refresh();
                }, 1000)
              } else {
              }
            })
          } else {
            this.dayModel.way = 0;
            getTaday(this.dayModel).then(res => {
              if (res.data.status == 0) {
                this.list = res.data.data;
                list.classList.remove("pullUp");
                this.showRefresh = true;
                setTimeout(() => {
                  this.showRefresh = false;
                  better.finishPullDown();
                  better.refresh();
                }, 1000)
              } else {
              }
            })
          }
        } else if (num == 2 || num == 3) {
          if (num == 2) {
            this.dayModel.way = 1;
            getHistory(this.dayModel).then(res => {
              if (res.data.status == 0) {
                this.list = res.data.data;
                list.classList.remove("pullUp");
                this.showRefresh = true;
                setTimeout(() => {
                  this.showRefresh = false;
                  better.finishPullDown();
                  better.refresh();
                }, 1000)
              } else {
              }
            })
          } else {
            this.dayModel.way = 0;
            getHistory(this.dayModel).then(res => {
              if (res.data.status == 0) {
                this.takeList = res.data.data;
                list.classList.remove("pullUp");
                this.showRefresh = true;
                setTimeout(() => {
                  this.showRefresh = false;
                  better.finishPullDown();
                  better.refresh();
                }, 1000)
              } else {
              }
            })
          }
        } else {
          moneyList(this.moneyModel).then(res => {
            if (res.data.status == 0) {
              this.takeList = res.data.data;
              list.classList.remove("pullUp");
              this.showRefresh = true;
              setTimeout(() => {
                this.showRefresh = false;
                better.finishPullDown();
                better.refresh();
              }, 1000)
            } else {
            }
          })
        }

      },


      /** 16:32
       *   @author: yuanjie
       *   @description:上拉加载的判断
       *   @param
       */
      judgePull(num, that, list, better) {
        if (num == 0 || num == 1) {
          if (num == 0) {
            this.dayModel.way = 1;
            getTaday(this.dayModel).then(res => {
              if (res.data.status == 0) {
                let orderList = res.data.data;
                this.list = this.list.concat(orderList);
                if (orderList.length == 0) {
                  this.dayModel.page -= 1;
                  this.oDiv.style.visibility = 'visible';
                }
                list.classList.remove("pullDown");
                better.finishPullUp();
                better.refresh();
                return false;

              } else {
              }
            })
          } else {
            this.dayModel.way = 0;
            getTaday(this.dayModel).then(res => {
              if (res.data.status == 0) {
                let orderList = res.data.data;
                this.list = this.list.concat(orderList);
                if (orderList.length == 0) {
                  this.dayModel.page -= 1;
                  this.oDiv.style.visibility = 'visible';
                }
                list.classList.remove("pullDown");
                better.finishPullUp();
                better.refresh();
                return false;

              } else {
              }
            })
          }
        } else if (num == 2 || num == 3) {
          if (num == 2) {
            this.dayModel.way = 1;
            getHistory(this.dayModel).then(res => {
              if (res.data.status == 0) {

                let orderList = res.data.data;
                this.list = this.list.concat(orderList);
                if (orderList.length == 0) {
                  this.dayModel.page -= 1;
                  this.oDiv.style.visibility = 'visible';
                }
                list.classList.remove("pullDown");
                better.finishPullUp();
                better.refresh();
                return false;

              } else {
              }
            })
          } else {
            this.dayModel.way = 0;
            getHistory(this.dayModel).then(res => {
              if (res.data.status == 0) {
                let orderList = res.data.data;
                this.list = this.list.concat(orderList);
                if (orderList.length == 0) {
                  this.dayModel.page -= 1;
                  this.oDiv.style.visibility = 'visible';
                }
                list.classList.remove("pullDown");
                better.finishPullUp();
                better.refresh();
                return false;

              } else {
              }
            })
          }
        } else {
          moneyList(this.moneyModel).then(res => {
            if (res.data.status == 0) {
              let orderList = res.data.data;
              this.list = this.list.concat(orderList);
              if (orderList.length == 0) {
                this.moneyModel.page -= 1;
                this.oDiv.style.visibility = 'visible';
              }
              list.classList.remove("pullDown");
              better.finishPullUp();
              better.refresh();

            } else {
            }
          })
        }

      }
    },
    components: {
      publickHead,
      loading,
      hintModel
    },
    computed: {
      /** 15:36
       *   @author: yuanjie
       *   @description:计算页面最小的高度
       *   @param
       */
      calc() {
        return document.documentElement.clientHeight + 'px';
      },

      clHeight() {
        return document.documentElement.clientHeight - 42;
      }
    }
  }
</script>

<style scoped>
  .con {
    overflow: hidden;
  }

  .cancel_order {
    background: #ebebeb;
    overflow-y: auto;
  }

  .cancellations_con {
    padding-top: 45px;
  }

  .cancellations_list {
    margin: 0 25px;
    padding: 0 16px;
    background: #ffffff;
    box-shadow: 0 2px 1px 1px rgba(00, 00, 00, .2);
    border-radius: 10px;
    position: relative;
  }

  .cancell_top {
    display: flex;
    justify-content: space-between;
    font-size: 26px;
  }

  .cancellations_time {
    padding-top: 20px;
    font-size: 30px;
    color: #414141;
    display: flex;
    margin-bottom: 10px;
    align-items: center;
  }

  .cancellations_time i {
    padding: 0 10px;
  }

  .cancellations_btn {
    width: 100px;
    height: 40px;
    margin-left: 120px;
    text-align: center;
    border-radius: 40px;
    color: #ffffff;
    line-height: 40px;
    font-size: 26px;
    background: #e70012;
    position: absolute;
    right: 20px;
  }

  .cancell_name {
    display: flex;
    /*justify-content: space-between;*/
    align-items: center;
  }

  .cancell_name, .cancell_money, .cancell_bottom div {
    font-size: 26px;
    color: #414141;
    margin: 0 0 10px 0;
  }

  .cancell_name span, .cancell_money span, .cancell_bottom span {
    color: #a3a3a3;
  }

  .cancell_bottom {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .cancell_status {
    font-size: 30px;
    color: #a3a3a3;
    /*margin-top: 20px;*/
    margin-left: 10px;
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

  .not_list {
    background: #898989 !important;
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

  .loginout_bnt .sure {
    border-right: 1px solid #e5e5e5;
    color: #e70012;
  }

  .loginout_bnt .cancel {
    color: #aaaaaa;
  }

  .detail {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 16px;
    bottom: 0;

  }

  .detail div {
    margin: 0;
    margin-bottom: 10px !important;
    font-size: 26px;
  }

  .detail div {
    color: #414141;
  }

  .detail div span {
    color: #a3a3a3;
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
    background: url("../../assets/img/refresh_ico.gif") no-repeat center #ebebeb;
    background-size: contain;
  }

  .pullDown:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    width: 100%;
    background: url("../../assets/img/refresh_ico.gif") no-repeat center #ebebeb;
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
    background: #ebebeb;
  }

  .nont {
    width: 100%;
    line-height: 40px;
    height: 40px;
    text-align: center;
    position: relative;
    bottom: 0;
    visibility: hidden;
  }

  .ico_success {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/success_ico.png") no-repeat center;
    background-size: contain;
    margin-bottom: 32px;
  }

  .withhold {
    /*margin-top: 80px;*/
    color: #a3a3a3 !important;
    position: absolute;
    left: 0;
    width: 500px;
    /*text-align: right;*/
    top: -46px;
  }

  .withhold i {
    color: #414141 !important;
  }

  .last_position {
    position: relative;
  }


</style>
