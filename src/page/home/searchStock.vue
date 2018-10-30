<template>
    <div class="search_stock_con">
      <!--返回-->
      <!--<div class="back_top">-->
        <!--<div class="back" @click="back()"></div>-->
        <!--<span>股票搜索</span>-->
      <!--</div>-->
      <publick-head >
        <div slot="bakc" class="back" ></div>
        <span slot="title">股票搜索</span>
      </publick-head>
      <div class="main">
        <div class="recharge_input">
          <span>股票代码:</span>
          <input type="text" placeholder="请输入股票代码">
        </div>
        <div class="search_result">
          <span>搜索结果</span>
        </div>
        <div class="list">
          <span>00001</span>
          <span>平安银行</span>
        </div>
        <p class="not_search">没有搜索到相关数据！</p>
      </div>
    </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
    export default {
        name: "searchStock",
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
  .recharge_input {
    display: flex;
    padding-left: 38px;
    border-bottom: 1px dashed #d2d2d2;
  }
  .recharge_input span{
    line-height: 76px;
    font-size: 28px;
    color: #333333;
  }
  .recharge_input input{
    margin-left: 30px;
    width: 300px;
    line-height: 76px;
    font-size: 28px;
  }
  .search_result {
    margin: 0 24px;
    border-bottom: 1px dashed #d2d2d2;
    line-height: 76px;
    font-size: 30px;
    color: #525252;
  }
  .list {
    line-height: 76px;
    margin: 0 0 0 14px;
    font-size: 30px;
    color: #000000;
    border-bottom: 1px dashed #000000;
    padding-left: 14px;
  }
  .list span{
    padding-right: 36px;
  }
  .not_search {
    font-size: 30px;
    color: #000000;
    text-align: center;
    margin: 120px 0 0 0;
  }

</style>
