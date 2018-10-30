<template>
  <div class="contract_con">
    <div class="contract_con_top">
      <publick-head>
        <div slot="bakc" class="back"></div>
        <span slot="title">选择策略</span>
      </publick-head>

      <router-link to="homeIndex" tag="div" class="go_home"></router-link>
    </div>

    <div class="contract_list" :style="{height:calc + 'px'}"  v-if="list.length > 0">
      <div class="list_center" :style="{'min-height':calc + 5 + 'px'}">
        <div class="list_item" v-for="item in list" v-if="item.status == 1">
          <!--生效中-->
          <div class="list_top" :style="{'width':calcWidth}"  v-if="item.status == 1">
            <span>策略名称:{{item.name}}&nbsp;&nbsp;策略编号:{{item.no}}</span>
            <i class="ico"></i>
          </div>
          <!--已结束 -->
          <div class="list_top not_list" :style="{'width':calcWidth}" v-if="item.status == 2">
            <span>策略名称:{{item.name}}&nbsp;&nbsp;策略编号:{{item.no}}</span>
            <i class="ico"></i>
          </div>
          <!--未生效-->
          <div class="list_top not_list" :style="{'width':calcWidth}" v-if="item.status == 5">
            <span>策略名称:{{item.name}}&nbsp;&nbsp;策略编号:{{item.no}}</span>
            <i class="ico"></i>
          </div>

          <div class="con" @click="localUrl(item)">
            <div class="con_top">
              <div class="con_left">
                <div class="left_top">
                  <div>
                    <p>保证金</p>
                    <span>￥{{judge(item.deposit)}}</span>
                  </div>
                  <div>
                    <p>策略倍数</p>
                    <span>{{item.multiple}}倍</span>
                  </div>
                  <div>
                    <p>操盘资金余额</p>
                    <span>￥{{judge(item.total_balance)}}</span>
                  </div>
                </div>
                <div class="left_bottom">
                  <p>策略编号:{{item.no}}</p>
                  <p>策略创建:{{item.created_at}}</p>
                </div>
              </div>
              <div class="con_right">
                <div>
                  <span>距离警戒线</span>
                  <i v-if="item.far_warning != 'xx'">￥{{judge(item.far_warning)}}</i>
                  <i v-else>---</i>
                </div>
                <div>
                  <span>距离平仓线</span>
                  <i v-if="item.far_die != 'xx'">￥{{judge(item.far_die)}}</i>
                  <i v-else>---</i>
                </div>
              </div>
            </div>

            <!--<div class="add_con">-->
            <!--<div class="add_promise">追加保证金</div>-->
            <!--<div class="add_promise">追加策略金</div>-->
            <!--</div>-->

          </div>
        </div>
        <span class="refresh" v-if="showRefresh">刷新成功</span>
        <div class="nont" >没有更多</div>
      </div>

    </div>

    <div class="not_search"  v-if="list.length == 0">
      <img src="../../assets/img/search_not.png" alt="">
      <p>什么东西都没有找到</p>
    </div>


    <!--loading-->
    <loading ref="loading"></loading>
  </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import loading from '../../components/publick/loading'
  import {contract} from "../../api";

  export default {
    name: "contract",
    data() {
      return {
        headHeight: 0,  //获取头部的高度
        list: [],       //策略列表
        showRefresh:false, //是否刷新成功
        contractModel:{
          type:0,
          page:1,
          size:5
        }
      }
    },
    mounted: function () {
      this.$store.commit('openLoading');
      let oHead = document.getElementsByClassName('head_con')[0];
      this.headHeight = oHead.offsetHeight;
      // this.$store.dispatch('getContract');
      this.getContractList();

    },
    methods: {
      //跳转到详情
      localUrl(item) {

          this.$router.push({name:'stockDeal',params:{judgeNum:item.no}});

      },
      /** 16:54
       *   @author: yuanjie
       *   @description:获取策略列表
       *   @param
       */
      getContractList() {
        contract(this.contractModel).then(res => {
          if (res.data.status == 0) {
            this.list = res.data.data;
            this.$store.commit('closeLoading');
            this.addMore();
          }
        })
      },
      /** 17:05
       *   @author: yuanjie
       *   @description:判断金额是否大于1万
       *   @param
       */
      judge(money) {
        money = Number(money);
        if (money >= 10000) {
          return Number(money / 10000).toFixed(2) + '万';
        } else {
          return money;
        }
      },
      /** 14:11
       *   @author: yuanjie
       *   @description:下拉加载更多
       *   @param
       */
      addMore(){
        let that = this;
        if(this.list.length > 0){
          this.$nextTick(() => {
            var oDiv = document.getElementsByClassName('contract_list')[0];
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
              that.contractModel.page = 1;
              list.classList.add("pullUp");
              contract(that.contractModel).then(res => {
                if(res.data.status == 0){
                  that.list = res.data.data;
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
              that.contractModel.page += 1;
              list.classList.add("pullDown");
              contract(that.contractModel).then(res => {
                if(res.data.status == 0){
                  let orderList = res.data.data;
                  that.list = that.list.concat(orderList);
                  list.classList.remove("pullDown");
                  if(orderList.length == 0){
                    that.contractModel.page -= 1;
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
    components: {
      publickHead,
      loading
    },
    computed: {
      /** 15:36
       *   @author: yuanjie
       *   @description:计算页面最小的高度
       *   @param
       */
      calc() {
        return document.documentElement.clientHeight - (this.headHeight + 1);
      },
      /** 17:34
       *   @author: yuanjie
       *   @description:计算页面宽度
       *   @param
       */
      calcWidth() {
        return document.documentElement.clientWidth + 'px';
      },
    }
  }
</script>

<style scoped>
  .contract_con_top {
    position: relative;
  }

  .go_home {
    position: absolute;
    top: 28px;
    left: 80px;
    width: 30px;
    height: 30px;
    background: url("../../assets/img/gohome_ico.png")no-repeat;
    background-size: contain;

  }
  .contract_list {
    background: #eeeeee;
    border-top: 1px solid transparent;
    height: 100%;
    padding-top: 20px;
    overflow: hidden;
  }
  .list_center {
    position: relative;
  }

  .list_item {
    position: relative;
    margin: 0 22px 24px 22px;
    background: #ffffff;
    border-radius: 10px;
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


  .con {
    margin: 20px 0 0 0;
    padding: 0 24px;
    font-size: 24px;

  }
  .con_top{
    display: flex;
    justify-content: space-between;
  }

  .con_left {
    display: flex;
    flex-direction: column;
  }

  .left_top {
    margin-bottom: 20px;
    display: flex;
  }

  .left_top p {
    color: #666666;
    margin-bottom: 5px;
  }

  .left_top div {

  }

  .left_top div:nth-child(1), .left_top div:nth-child(2) {
    margin-right: 46px;
    text-align: center;
  }

  .left_top div:nth-child(3) {
    margin-right: 58px;
  }

  left_top div span {
    font-size: 30px;
  }

  .left_top div:nth-child(1) span {
    color: #0add01;
    font-size: 30px;
  }

  .left_top div:nth-child(2) span {
    color: #000000;
    font-size: 30px;
  }

  .left_top div:nth-child(3) span {
    color: #eb0505;
    font-size: 30px;
  }

  .left_bottom p {
    margin-bottom: 5px;
    color: #909090;
  }

  .left_bottom p:nth-child(1) {
    margin: 0;
  }

  .con_right {
    position: relative;
    padding: 0 0 0 22px;
  }

  .con_right div {
    display: flex;
    flex-direction: column;
    justify-content: end;
  }

  .con_right:before {
    content: '';
    position: absolute;
    left: 0;
    top: 34px;
    width: 1px;
    height: 120px;
    background: #d2d2d2;
  }

  .con_right div:nth-child(1) {
    margin-bottom: 20px;
    /*text-align: center;*/
  }

  .con_right div {
    text-align: center;
  }

  .con_right div span {
    color: #666666;
  }

  .con_right div i {
    color: #eb0505;
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
  .not_list {
    background:#898989 !important;
  }
  .add_con {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #d9d9d9;
  }
  .add_con div{
    height: 60px;
    font-size: 26px;
    line-height: 60px;
    color: #909090;
    display: flex;
    flex: 1;
    justify-content: center;
  }
  .add_con div:nth-child(1){
    border-right: 1px solid #d9d9d9;
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
    bottom: 20px;
    /*height: 0;*/
    visibility: hidden;
  }

</style>
