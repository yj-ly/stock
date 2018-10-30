<template>
    <div class="entrust_con">
      <!--返回-->
      <!--<div class="back_top">-->
        <!--<div class="back" @click="back()"></div>-->
        <!--<span>我的委托</span>-->

      <publick-head >
        <div slot="bakc" class="back" ></div>
        <span slot="title">我的委托</span>
      </publick-head>
      <!--委托列表-->
      <div class="entrust_list">
        <div class="positions_top">
          <div><span>我的委托</span></div>
          <div><span>委托/均价</span></div>
          <div><span>委托/股数</span></div>
          <div><span>状态</span></div>
        </div>
        <div class="list_con">
          <div class="item">
            <div class="item_left">
              <span>美丽生态</span>
              <i>019873</i>
            </div>

            <div class="item_center">
              <span>500.00</span><i>/500.00</i>
            </div>
            <div class="item_center">
              <span>200000</span><i>/100000</i>
            </div>
            <div class="item_right">审核中</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
    export default {
        name: "entrust",
        data(){
          return {

          }
        },
        mounted:function () {

        },
        methods:{
        },
      components:{
        publickHead
      }
    }
</script>

<style scoped>

  .positions_top {
    height: 62px;
    display: flex;
    padding: 0 58px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #d2d2d2;
    margin: 0 10px 12px  10px;
  }
  .positions_top span {
    font-size: 24px;
    color: #000000;
  }
  .item {
    height: 92px;
    margin: 0 10px 0 70px;
    border-bottom: 1px solid #d2d2d2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 40px;
  }
  .item_left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .item_left span{
    font-size: 24px;
    color: #000000;
  }
  .item_left i {
    font-size: 18px;
    color: #ff868f;
    font-weight: normal;
  }
  .item_center span,i{
    font-size: 30px;
    color: #e70012;
    font-weight: 400;
  }
  .item_center i{
    color: #3a3a3a;
  }
  .item_right {
    font-size: 24px;
  }

</style>
