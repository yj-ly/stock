<template>
    <div class="mymoney_content">
      <publick-head >
        <div slot="bakc" class="back" ></div>
        <span slot="title">我的银行卡</span>
      </publick-head>

      <!--添加银行卡列表-->
      <div class="add_bank_list">
        <div class="add" @click="localUrl('addBank')">
          <span>添加银行卡</span>
        </div>
      </div>
    </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
    export default {
        name: "myMoney",
        data(){
          return {

          }
        },
        methods:{
          //跳转到不同页面
          localUrl(strUrl){
            this.$router.push(strUrl);
          }
        },
        components:{
          publickHead
        }
    }
</script>

<style scoped>

  .my_message {
    display: flex;
    margin: 0 14px;
    background: url("../../assets/img/wallet_bg.png")no-repeat;
    background-size:cover;
    height: 289px;
    flex-direction: column;
    box-shadow: 0 0 20px #cccccc;
  }
  .user_money {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 28px;
    margin-top: 28px;
  }
  .user_money p{
    font-size:30px;
    color: #ffffff;
  }
  .user_money strong {
    font-size: 40px;
    font-weight: 500;
    /*padding-top: 20px;*/
    color: #ffffff;
  }
  .user_item div{
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: center;

  }
  .user_item div p {
    font-size: 40px;
    font-weight: 500;
    /*padding-bottom: 26px;*/
    color: #ffffff;
  }
  .user_item div span{
    font-size: 24px;
    color: #ffffff;
  }
  .add {
    margin:20px 10px 0 10px;
    height: 200px;
    border: 2px solid #c9c9c9;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("../../assets/img/add_bank.png")no-repeat 450px center;
  }
  .add span{
    font-size: 30px;
    color: #c9c9c9;
  }

</style>
