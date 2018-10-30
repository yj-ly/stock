<template>
    <div class="watercourse_con">
      <!--返回-->
      <publick-head >
        <div slot="bakc" class="back"></div>
        <span slot="title">策略流水</span>
      </publick-head>

      <div class="main">
        <div class="list_top">
          <span>方式</span>
          <span>金额</span>
          <span>时间</span>

        </div>
        <div class="list_con" :style="{height:calcHeight}">
          <div class="list_center">
            <div class="list" v-for="item in waterList">
              <span class="status">{{waterType[item.order_type]}}</span>
              <div class="list_center">
                <span class="add_txt" v-if="item.pay_direction == 0">+</span>
                <span class="subtract" v-else>-</span>
                <span :class="{'add_txt':item.pay_direction == 0,'subtract':item.pay_direction != 0}">{{item.money}}</span>
              </div>
              <span class="time">{{item.created_at}}</span>
            </div>

            <span class="refresh" v-if="showRefresh">刷新成功</span>
            <div class="nont" >没有更多</div>
          </div>
        </div>

      </div>

      <!--loading-->
      <loading ref="loading"></loading>
    </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import loading from '../../components/publick/loading'
  import {getContractWater} from "../../api";

  export default {
        name: "wateRcourse",
      data() {
        return {
            waterList:[],  //获取流水
            waterType:{
                0:'创建策略转入策略金',
                1:'终止策略转出',
                2:'买票转出',
                3:'卖票转入',
                4:'撤单转入',
                5:'补保转入保证金',
                6:'补保转出保证金',
                7:'取保转出保证金',
                8:'增加配额转入保证金',
                9:'增加配额转入策略金',
                10:'创建策略转入保证金',
                11:'增加保证金转入',
                12:'收益分成转出',
                13:'成交差价退还',
                14:'订单结算'
            },
          waterModel:{
              page:1,
              size:20,
            contract_no:''
          },
          showRefresh:false,
          oDiv:null,

        }
      },
      mounted:function () {
          this.waterModel.contract_no = this.$route.params.id;
        this.$store.commit('openLoading');
        this.getContractWater();

      },
      methods:{
          /** 10:53
            *   @author: yuanjie
            *   @description:获取策略流水
            *   @param
            */
        getContractWater(){
            getContractWater(this.waterModel).then(res => {
                if(res.data.status == 0){
                  this.waterList = res.data.data;
                  this.$store.commit('closeLoading');
                  this.addMore();
                }
            })
          },
        /** 14:11
         *   @author: yuanjie
         *   @description:下拉加载更多
         *   @param
         */
        addMore(){
          let that = this;
          if(this.waterList.length > 0){
            this.$nextTick(() => {
              var oDiv = document.getElementsByClassName('list_con')[0];
              var list = document.getElementsByClassName('list_center')[0];
              that.oDiv =  document.getElementsByClassName('nont')[0];
              that.oDiv.style.visibility = 'hidden';
              var better = new BScroll(oDiv,{
                click:true,
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
              better.on("pullingDown",function(){
                that.waterModel.page = 1;
                list.classList.add("pullUp");
                getContractWater(that.waterModel).then(res => {
                  if(res.data.status == 0){
                    that.waterList = res.data.data;
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
                getContractWater(that.waterModel).then(res => {
                  if(res.data.status == 0){
                    let orderList = res.data.data;
                    that.waterList = that.waterList.concat(orderList);
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

        }

      },
      components:{
        publickHead,
        loading
      },
      computed:{
        /** 15:36
         *   @author: yuanjie
         *   @description:计算页面最小的高度
         *   @param
         */
        calcHeight() {
          // console.log('触发')
          // console.log(document.getElementsByClassName('main')[0])
          // let oHead = document.querySelector('.head_con');
          // let oTab = document.querySelector('.list_top');
          // console.log(oHead.offsetHeight)
          // console.log(oTab.offsetHeight)
          return document.documentElement.clientHeight - 104 + 'px';
        },
      }
    }
</script>

<style scoped>
  .list_con {
    overflow: hidden;
  }
  .list_center {
    position: relative;
  }
  .list_top {
    height: 62px;
    display: flex;
    padding: 0 100px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #d2d2d2;
    margin: 0 10px 12px  10px;
    font-size: 24px;
    color: #000000;
  }
  .list {
    display: flex;
    justify-content: space-between;
    height: 80px;
    align-items: center;
    margin: 0 20px 0 20px;
    border-bottom: 1px solid #d2d2d2;
    font-size: 30px;
    padding:0 0 0 0;
  }
  .list span{
    color: #a0a0a0;
  }
  .list div {
    display: flex;
  }
  .list .add_txt {
    color: #e70012;
  }
  .list .subtract {
    color: #00e705;
  }
  .list .status{
    color: #000000;
    flex: 1;
    line-height: 36px;
  }
  .list_center {
    flex: 1;
    text-align: center;
    justify-content: center;
  }
  .time {
    flex: 1;
    width: 233px;
    display: block;
    line-height: 30px;
    text-align: center;
    justify-content: center;
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


</style>
