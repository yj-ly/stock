<template>
    <div class="water_detail">
      <!--头部返回-->
      <publick-head style="background:#ffffff">
        <div slot="bakc" class="back"></div>
        <span slot="title">资金详情</span>
      </publick-head>

      <!--main-->
      <div class="main">
          <div class="water_top">
            <div class="top_left">
              <span>提现</span>
              <div>
                <i>-</i>
                <i>+</i>
                <p>100</p>
              </div>

            </div>
            <div class="top_right">
              <div class="time">2018-12-10:10</div>
              <div class="status">处理状态: <i>处理中</i></div>
            </div>
          </div>

          <div class="water_msg">
            <div class="water_item">
              <i>流水号</i>
              <span>29034839833903</span>
            </div>
            <div class="water_item">
              <i>发生金额</i>
              <span>￥100</span>
            </div>
            <div class="water_item">
              <i>手续费</i>
              <span>￥10</span>
            </div>
            <div class="water_item">
              <i>账户余额</i>
              <span>￥10</span>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
    export default {
        name: "waterDetail",
        data(){
          return {

          }
        },
        mounted:function () {

        },
        methods:{

        },
        computed:{

        },
      components:{
        publickHead
      }
    }
</script>

<style scoped>
  .water_top {
    padding: 30px;
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    color: #7d7d7d;
    border-bottom: 1px solid #e9e9e9;
  }
  .top_left div {
    display: flex;
    padding-top: 30px;
  }
  .top_left div p{
    color: #000000;
  }
  .top_right .time{
      padding-bottom: 30px;
  }
  .top_right i,.top_left i {
    color: #000000;
  }
  .water_msg {
      margin: 5px 0 0 0;
  }
  .water_item {
    display: flex;
    font-size: 28px;
    color: #000000;
    height:86px;
    align-items: center;
    border-bottom: 1px solid #e9e9e9;
  }
  .water_item i{
    display: block;
    width:170px;
    padding-left: 30px;

  }
  .water_item span{
    color: #7d7d7d;
  }

</style>
