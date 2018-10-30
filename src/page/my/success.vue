<template>
    <div class="success">
      <!--头部返回-->
      <publick-head style="background:#ffffff">
        <!--<div slot="bakc" class="back"></div>-->
        <span slot="title">支付成功</span>
      </publick-head>

      <div class="main">
          <p>充值成功</p>
          <i class="ico"></i>

        <div class="btn">
          <span>确定</span>
        </div>
      </div>


    </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
    export default {
        name: "success",
        data(){
          return {

          }
        },
        methods:{

        },
        mounted:function () {

        },
        computed:{

        },
        components:{
            publickHead
        }

    }
</script>

<style scoped>
  .main {
      margin:100px 0 0 0;
      /*display: flex;*/
      /*flex-direction: column;*/
      /*align-items: center;*/
      overflow: hidden;
      text-align: center;
  }
  .main p{
    font-size:48px;
    margin-bottom: 30px;
    color: #000000;
  }
  .main i{
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/success_ico.png") no-repeat;
    background-size: contain;
    margin: 0 auto;
  }
  .btn {
    height: 66px;
  }

  .btn span {
    display: block;
    margin: 160px 130px 0 130px;
    background: #e70012;
    text-align: center;
    line-height: 66px;
    color: #ffffff;
    font-size: 18px;
    border-radius: 30px;
  }

</style>
