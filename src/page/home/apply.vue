<template>
    <div class="apply_con">
      <!--返回-->
      <!--<div class="back_top">-->
        <!--<div class="back" @click="back()"></div>-->
        <!--<span>支付</span>-->
      <!--</div>-->
      <publick-head >
        <div slot="bakc" class="back" ></div>
        <span slot="title">支付</span>
      </publick-head>
      <!--支付金额-->
      <div class="recharge_money">
        <div class="recharge_input">
          <span>金额(￥):</span>
          <input type="text" placeholder="请填写需要支付的金额">
        </div>
        <!--<div class="hint">每次提现金额不得低于100(元)</div>-->

      </div>

      <!--支付的到账方式-->
      <div class="to_mode">
        <div class="to_top">支付方式</div>
        <div class="list_con">
          <div class="to_list">
            <div class="checkd"></div>
            <img src="../../assets/img/wechat_pay.png" alt="">
            <div class="list_name">
              <span>微信到账</span>
              <i>微信钱包</i>
            </div>
          </div>
          <div class="to_list">
            <div class="checkd"></div>
            <img src="../../assets/img/apply.png" alt="">
            <div class="list_name">
              <span>支付宝到账</span>
              <i>快捷钱包</i>
            </div>
          </div>
          <div class="to_list last_list">
            <div class="checkd"></div>
            <img src="../../assets/img/bank_card.png" alt="">
            <div class="list_name">
              <span>银行卡支付</span>
              <i>工商银行 尾号4756</i>
            </div>

          </div>
        </div>

      </div>

      <!--确认支付-->
      <div class="confirm">
        <span>确认支付</span>
      </div>
    </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
    export default {
        name: "apply",
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


  .recharge_money {
    display: flex;
    flex-direction: column;
  }
  .recharge_input {
    display: flex;
    padding-left: 38px;
    border-bottom: 2px dashed #d2d2d2;
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
  /*.hint {*/
    /*padding:10px 0 0 38px;*/
    /*font-size: 22px;*/
    /*color: #c9c9c9;*/
  /*}*/
  .to_mode {
    margin: 40px 0 0 0;
  }
  .to_top {
    font-size: 28px;
    color: #000000;
    padding: 0 0 12px 38px;
    border-bottom: 2px dashed #d2d2d2;
  }
  .to_list {
    display: flex;
    border-bottom: 2px dashed #d2d2d2;
    height: 130px;
    box-sizing: border-box;
    align-items: center;
  }
  .checkd {
    width: 26px;
    height: 26px;
    background: url("../../assets/img/not_checkd.png")no-repeat;
    background-size: contain;
    margin: 0 58px 0 46px;
  }
  .to_list .ac{
    background: url("../../assets/img/cofirm_checkd.png")no-repeat;
  }
  .to_list img{
    width: 75px;
    height: 75px;
    margin: 0 20px 0 0;
  }
  .list_name {
    display: flex;
    flex-direction: column;
  }
  .list_name span{
    font-size: 24px;
    color: #3c3c3c;
    padding-bottom: 10px;
  }
  .list_name i {
    font-size: 20px;
    color: #a4a4a4;
  }
  .last_list {
    border: none !important;
    background: url("../../assets/img/arrows.png")no-repeat 680px center;
  }
  .confirm {
    border-top: 10px solid #dddddd;
  }
  .confirm span{
    display: block;
    margin: 30px 130px 0 130px;
    background: #e70012;
    text-align: center;
    line-height: 60px;
    color: #ffffff;
    font-size: 18px;
    border-radius: 30px;
  }
  input::-webkit-input-placeholder{font-size:28px;opacity:1;}/* WebKit browsers */
  input:-moz-placeholder{font-size:28px;opacity:1;}/* Mozilla Firefox 4 to 18 */
  input::-moz-placeholder{font-size:28px;opacity:1;}/* Mozilla Firefox 19+ */
  input:-ms-input-placeholder{font-size:28px;opacity:1;}/* Mozilla Firefox 19+ */

</style>
