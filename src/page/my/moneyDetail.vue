<template>
    <div class="money_deatail">
      <!--头部返回-->
      <publick-head style="background:#ffffff">
        <div slot="bakc" class="back"></div>
        <span slot="title">资金流水  </span>
      </publick-head>

      <!--main区-->
      <div class="detail_main">
        <!--tab-->
        <div class="tab">
            <div :class="{'ac':showTabNum == 0}" @click="changeTab(0)">全部</div>
            <div :class="{'ac':showTabNum == 1}" @click="changeTab(1)">支出</div>
            <div :class="{'ac':showTabNum == 2}" @click="changeTab(2)">收入</div>
        </div>

        <div class="list_con" v-if="moneyList.length > 0" :style="{height:calcHeight + 'px'}">
          <div class="list_center" :style="{'min-height':calcHeight + 'px'}">
            <div class="list" v-for="item in moneyList ">
              <!--<div class="list_left" v-if="item.order_type == 0 || item.order_type == 1 || item.order_type == 5 ">-->
                <!--<div class="left_top">-->
                  <!--<span v-if="item.pay_direction == 0">+</span>-->
                  <!--<span v-else>-</span>-->
                  <!--<div class="money">{{item.money}}</div>-->
                <!--</div>-->
                <!--<span>{{payType[item.order_type]}} </span>-->
              <!--</div>-->
              <div class="list_left">
                <div class="left_top">
                  <div class="money running">流水编号:{{resetOrder(item.no)}}</div>
                </div>
                <span>{{payType[item.order_type]}} <i class="money_type" v-if="item.pay_direction == 0">+</i><i class="money_type" v-else>-</i> <i class="money_type">{{item.money}}</i> </span>
              </div>
              <div class="list_right">
                <div class="status" v-if="item.status == 0">成功</div>
                <div class="status dispose" v-if="item.status == 1">处理中</div>
                <div class="status error" v-if="item.status == 2">失败</div>
                <span>{{item.created_at}}</span>
              </div>
            </div>
            <span class="refresh" v-if="showRefresh">刷新成功</span>
            <div class="nont" >没有更多</div>
          </div>


        </div>

      </div>

      <!--loading-->
      <loading ref="loading"></loading>

      <!--没有数据的时候-->
      <div class="not_search"  v-if="moneyList.length == 0">
        <img src="../../assets/img/search_not.png" alt="">
        <p>什么东西都没有找到</p>
      </div>

    </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import loading from '../../components/publick/loading'
  import {getUserWater} from "../../api/user";

  export default {
        name: "moneyDetail",
      data(){
          return {
            showTabNum:0, //选项卡number
            waterModel:{
              pay_direction:0,
              page:1,
              size:15
            },
            moneyList:[],    //资金流水
            oDiv:null,
            payType:{
              0:'充值',
              1:'提现',
              2:'支付保证金',
              3:'退回保证金',
              4:'递延费',
              5:'交易手续费',
              6:'退还递延费'

            },
            showRefresh:false,
          }
      },
      mounted:function(){
        this.$store.commit('openLoading');
          this.getContractWater();

      },
      methods:{
          /** 11:52
            *   @author: yuanjie
            *   @description:跳转到资金详情
            *   @param{string} 当前的id
            */
          localUrl(id){
            this.$router.push({name:'waterDetail',params:{id:id}});
          },
        /** 18:15
          *   @author: yuanjie
          *   @description:获取资金流水
          *   @param
          */
        getContractWater(){
          getUserWater(this.waterModel).then(res => {
              if(res.data.status == 0){
                this.moneyList = res.data.data;
                this.$store.commit('closeLoading');
              }else{
                this.$store.commit('closeLoading');
              }
            this.addMore();

          })
        },
        /** 13:50
          *   @author: yuanjie
          *   @description:切换状态
          *   @param{number} 切换状态的值
          */
        changeTab(num){
          this.waterModel.pay_direction = num;
          this.waterModel.page = 1;
          this.showTabNum = num;
          this.getContractWater();
        },
        /** 14:11
          *   @author: yuanjie
          *   @description:下拉加载更多
          *   @param
          */
        addMore(){
          let that = this;
          if(this.moneyList.length > 0){
            this.$nextTick(() => {
              var oDiv = document.getElementsByClassName('list_con')[0];
              var list = document.getElementsByClassName('list_center')[0];
              that.oDiv =  document.getElementsByClassName('nont')[0];
              that.oDiv.style.visibility = 'hidden';
              var better = new BScroll(oDiv,{
                pullDownRefresh: {
                  threshold: -50,
                  stop: 20
                },
                pullUpLoad: {
                  threshold: 50,
                  // stop:-50

                },
              })

              /* 下拉刷新 */
              better.on("pullingDown",function(){
                list.classList.add("pullUp");
                that.waterModel.page = 1;
                getUserWater(that.waterModel).then(res => {
                  if(res.data.status == 0){
                    this.moneyList = res.data.data;
                    list.classList.remove("pullUp");
                    that.showRefresh = true;
                    setTimeout(() => {
                      that.showRefresh = false;
                      better.finishPullDown();
                      better.refresh();
                    },1000)
                  }else{
                  }
                })
              });

              better.on("pullingUp",function(){

                that.oDiv.style.visibility = 'hidden';
                that.waterModel.page += 1;
                list.classList.add("pullDown");
                getUserWater(that.waterModel).then(res => {
                  if(res.data.status == 0){
                    let orderList = res.data.data;
                    that.moneyList = that.moneyList.concat(orderList);
                    list.classList.remove("pullDown");
                    if(orderList.length == 0){
                      that.waterModel.page -= 1;
                      that.oDiv.style.visibility = 'visible';
                    }
                    better.finishPullUp();
                    better.refresh();
                  }else{
                  }
                })


              });
            })
          }

        },


        /** 13:59
          *   @author: yuanjie
          *   @description:格式化流水单号
          *   @param{num}当前每个的单号
          */
          resetOrder(num){
            return num.substr(num.length-6,num.length);

        }
      },
        components:{
          publickHead,
          loading
        },
    computed:{
          calcHeight(){
            let oHead = document.querySelector('.head_con');
            let oTab = document.querySelector('.tab');
              return document.documentElement.clientHeight - (oTab.offsetHeight + oHead.offsetHeight);
          }
    }
    }
</script>

<style scoped>
  .money_deatail {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  .tab {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e9e9e9;
    height: 58px;
    font-size: 30px;
    padding: 0 70px;
    color: #535353;
  }
  .tab div {
    border-bottom: 8px solid transparent;
    line-height: 50px;
  }
  .tab div:nth-child(2){
    margin: 0 0 0 30px;
  }
  .tab .ac{
    border-bottom: 8px solid #e70012;
    color: #eb0505;
  }
  .list_con{
      overflow: hidden;
  }
  .list {
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    justify-content: space-between;
    height: 124px;
    align-items: center;
    padding: 0 33px;
  }
  .list span{
    font-size: 28px;
    color: #aeaeae;
    display: flex;
    align-items: center;
  }
  .list_left {
    display: flex;
    flex-direction: column;
    /*align-items: center;*/
  }
  .list_left .left_top{
      display: flex;
      align-items: center;
  }
  .list_left .money,.left_top span{
    color: #3a3a3a;
    padding: 15px 0 5px 0;
    font-size: 32px;
  }
  .list_right {
    text-align: right;
  }
  .list_right .status{
    padding: 15px 0 5px 0;
    color: #00ff00;
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
  .list_right .error{
    color: #eb0505;
  }
  .list_right .dispose {
    color: #3a3a3a;
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
    background: url("../../assets/img/refresh_ico.gif")no-repeat  center #eeeeee;
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
    background: url("../../assets/img/refresh_ico.gif")no-repeat  center #eeeeee;
    background-size: contain;
  }
  .list_center{
    position: relative;
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
    bottom: 0;
    /*height: 0;*/
    visibility: hidden;
  }
  .money_type {
      color: #000000;
      /*font-weight: 700;*/
      font-size: 30px;
    padding-left: 10px;
  }
  .money_type:nth-child(2){
    padding: 0;
  }
  .running {
      font-size: 26px !important;
      color: #aeaeae !important;
  }




</style>
