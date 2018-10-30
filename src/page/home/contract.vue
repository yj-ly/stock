<template>
  <div class="contract_con" :style="{'min-height':calcHeight}">
    <div content="contract_con_top">
      <publick-head style=" background: #ffffff">
        <div slot="bakc" class="back"></div>
        <span slot="title">我的策略</span>
      </publick-head>

      <router-link to="homeIndex" tag="div" class="go_home"></router-link>
    </div>


    <!--策略tab-->
    <div class="contract_tab" >
        <div  :class="{'ac_tab':tabNum == 0}" @click="changTab(0)">已生效</div>
        <div  :class="{'ac_tab':tabNum == 1}" @click="changTab(1)">待生效</div>
        <div  :class="{'ac_tab':tabNum == 2}" @click="changTab(2)">已终止</div>
        <div  :class="{'ac_tab':tabNum == 3}" @click="changTab(3)">结算中</div>
        <div  :class="{'ac_tab':tabNum == 4}" @click="changTab(4)">已过期</div>
    </div>
    <div class="contract_list" :style="{height:calc + 'px'}"  v-if="list.length > 0">
      <div class="list_center" :style="{'min-height':calc + 5 + 'px'}">
        <div class="list_item" v-for="item in list">
          <!--生效中-->
          <div class="list_top" :style="{'width':calcWidth}" @click="localUrl('positionDetails',item.no)" v-if="item.status == 1">
            <span>策略名称:{{item.name}}&nbsp;&nbsp;策略编号:{{item.no}}</span>
            <i class="ico"></i>
          </div>
          <!--已结束 -->
          <div class="list_top not_list" :style="{'width':calcWidth}" @click="localUrl('positionDetails',item.no)" v-if="item.status == 2">
            <span>策略名称:{{item.name}}&nbsp;&nbsp;策略编号:{{item.no}}</span>
            <i class="ico"></i>
          </div>
          <!--未生效-->
          <div class="list_top not_list" :style="{'width':calcWidth}" @click="localUrl('positionDetails',item.no)" v-if="item.status == 0">
            <span>策略名称:{{item.name}}&nbsp;&nbsp;策略编号:{{item.no}}</span>
            <i class="ico"></i>
          </div>

          <div class="con">
            <div class="con_top" @click="localUrl('positionDetails',item.no)">
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
                  <p>创建时间:{{item.created_at}}</p>
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

            <div class="add_con" v-if="item.status == 0 || item.status == 1 || item.status == 4  ">
              <div class="add_promise" @click="goPromise(0,item)" v-if="item.product_type == 0 && (item.status == 0 || item.status == 1) ">追加保证金</div>
              <div class="add_promise" @click="goPromise(1,item)" v-if="item.product_type == 0 && (item.status == 0 || item.status == 1) ">追加策略金</div>
              <div class="add_promise" @click="setContractNo(item)" :class="{'not_border':item.product_type == 1}">终止策略</div>
            </div>

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

    <!--是否结束策略-->
    <div class="login_out" v-if="showModelOver">
      <div class="model" @click="showModelOver = false"></div>
      <div class="out_model">
        <p>是否结束该策略</p>
        <i class="ico"></i>
        <div class="loginout_bnt">
          <div class="sure" @click="suerOverContract">确定</div>
          <div class="cancel" @click="showModelOver = false">取消</div>
        </div>
      </div>
    </div>

    <!--提示-->
    <hint-model ref="message">
      <p class="title" slot="title">{{errorMessage}}</p>
      <div slot="ico" v-if="successIco" class="ico_success"></div>
    </hint-model>
  </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import hintModel from '@/components/publick/hintModel'
  import loading from '../../components/publick/loading'
  import {contract,overContract} from "../../api";

  export default {
    name: "contract",
    data() {
      return {
        headHeight: 0,  //获取头部的高度
        list: [],       //策略列表
        tabNum:0,

        showModelOver:false,
        contractNo:0,  //结束该策略的no
        successIco:false,
        errorMessage:'',
        btnOnce:true,    //按钮只可以点击一次
        showRefresh:false,  //刷新成功
        contractModel:{
          type:0,
          page:1,
          size:5
        }
      }
    },
    mounted: function () {
      this.$store.commit('openLoading');
      this.getContractList(this.type);
    },
    methods: {
      //跳转到详情
      localUrl(strUrl,no) {
        this.$router.push({name:strUrl,params:{id:no}});
      },
      /** 16:54
       *   @author: yuanjie
       *   @description:获取策略列表
       *   @param
       */
      getContractList(num) {
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
      /** 15:12
        *   @author: yuanjie
        *   @description:去追加保证金
        *   @param{number} 判断当前点击的是那一个
        *   @param{object} 当前点击对象
        */
      goPromise(num,item){
          // console.log(item);
          this.$router.push({name:'promiseMoney',params:{typeNum:num,contractNo:item.no}});
      },
      /** 10:10
        *   @author: yuanjie
        *   @description:更换状态
        *   @param{number} 传入number判断点击的是那一个
        */
      changTab(num){

          if(num == this.tabNum){
            return false;
          }else{
            this.contractModel.type = num;
            this.contractModel.page = 1;
            this.getContractList(this.contractModel.type);
            this.tabNum = num;

          }
      },
      /** 10:55
        *   @author: yuanjie
        *   @description:记录点击的值
        *   @param{object}当前点击的对象
        */
      setContractNo(item){
          this.showModelOver = true;
          this.contractNo = item.no;
      },
      /** 10:52
        *   @author: yuanjie
        *   @description:结束策略
        *   @param
        */
        suerOverContract(){
          this.showModelOver = false;
        if(this.btnOnce){

          this.btnOnce = false;
          overContract({contract_no:this.contractNo}).then(res => {
            if(res.data.status == 0){
              this.successIco = true;
              this.$refs.message.showModel = true;
              this.errorMessage = res.data.msg;
              this.contractModel.page = 1;
              this.btnOnce = true;
              contract(this.contractModel).then(res => {
                if (res.data.status == 0) {
                  this.list = res.data.data;
                }
              })
            }else{
              this.errorMessage = res.data.msg;
              this.$refs.message.showModel = true;
              this.btnOnce = true;
            }
          })
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
        let oHead = document.querySelector('.head_con');
        let oTab = document.querySelector('.contract_tab');
        return document.documentElement.clientHeight - (oTab.offsetHeight + oHead.offsetHeight);
      },
      /** 17:34
       *   @author: yuanjie
       *   @description:计算页面宽度
       *   @param
       */
      calcWidth() {
        return document.documentElement.clientWidth + 'px';
      },
      //
      calcHeight(){
        return document.documentElement.clientHeight + 'px';
      }
    }
  }
</script>

<style scoped>
  .contract_con {
    background: #eeeeee;
  }
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
    overflow: hidden;
  }
  .list_center {
    position: relative;
    padding-bottom: 20px;
  }
  .contract_tab {
    display: flex;
    justify-content: space-between;
    font-size: 26px;
    color: #535353;
    padding: 0 35px;
    margin-bottom: 20px;
    background: #ffffff;


  }
  .contract_tab div{
    height: 60px;
    line-height: 60px;
    border-bottom:8px solid transparent;

  }
  .contract_tab .ac_tab{
      color: #eb0505;
      border-bottom: 8px solid #eb0505;

  }

  .contract_list {
    background: #eeeeee;
    border-top: 1px solid transparent;
    height: 100%;
    /*padding-top: 20px;*/
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

  .list_top i {
    display: block;
    float: right;
    width: 13px;
    height: 23px;
    background: url("../../assets/img/positions_more.png") no-repeat;
    background-size: contain;
    margin: 10px 0 0 0;
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
  .add_con div:nth-child(2){
    border-right: 1px solid #d9d9d9;
  }
  .over_contract div{
    border: none !important;
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
  .loginout_bnt .sure{
    border-right: 1px solid #e5e5e5;
    color: #e70012;
  }
  .loginout_bnt .cancel{
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
  .ico_success {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/success_ico.png") no-repeat center;
    background-size: contain;
    margin-bottom: 32px;
  }
  .not_border {
    border-right: none !important;
  }
</style>
