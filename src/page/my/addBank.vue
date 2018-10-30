<template>
    <div class="bank_con">
      <!--头部-->
      <publick-head >
        <div slot="bakc" class="back" ></div>
        <span slot="title">添加银行卡</span>
      </publick-head>
      <!--main区-->
      <div class="bank_main">
        <div class="main_top">
          <span>请绑定持卡本人的银行卡</span>
        </div>
        <div class="bank_message">
          <div class="message_item">
            <span>持卡人:</span>
            <input type="text">
          </div>
          <div class="message_item">
            <span>持卡人身份证:</span>
            <input type="text">
          </div>
          <div class="message_item">
            <span>银行卡号:</span>
            <input type="text">
          </div>
          <div class="message_item">
            <span>银行卡开户行:</span>
            <input type="text">
          </div>
          <div class="message_item">
            <span>银行预留电话:</span>
            <input type="text">
          </div>
          <div class="auth_code message_item">
              <div class="auth_left">
                <input type="text" placeholder="输入验证码">
              </div>
              <div class="auth_right">获取验证码</div>
          </div>
        </div>
      </div>

      <!--提交银行卡按钮-->

        <div class="login_btn">
          <span @click="localUrl('homeIndex')">确定</span>
        </div>

    </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
    export default {
        name: "addBank",
      components:{
        publickHead
      }
    }
</script>

<style scoped>
  .bank_main {
    background: #ffffff;
  }
  .main_top {
    height: 78px;
    padding: 0 0 0 50px;
    font-size: 24px;
    color: #8d8d8d;
    background: #eeeeee;
    box-sizing: border-box;
    padding-top: 30px;
  }
  .bank_message {
    margin: 0 0 0 50px;
  }
  .bank_message .message_item {
    border-bottom: 1px solid #eeeeee;
    height: 84px;
    display: flex;
    align-items: center;
  }
  .message_item input{
    text-indent: 20px;
  }
  .message_item span{
    font-size: 30px;
    color: #4c4c4c;
  }
  .auth_code {
    display: flex;
    border: none !important;
    justify-content: space-between;
    margin: 0 58px 20px 0;
  }
  .auth_left {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
    height: 84px;
    width: 326px;
  }
  .auth_left input{
    text-indent: 0 !important;
    line-height: 83px;
  }
  .auth_right {
    margin: 10px 0 0 0;
    width: 180px;
    text-align:center;
    height: 60px;
    line-height: 60px;
    color: #e70012;
    border-radius: 40px;
    border: 2px solid #e70012;
  }

  .login_btn {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login_btn span {
    display: block;
    width: 510px;
    height: 66px;
    background: #e70012;
    color: #ffffff;
    font-size: 24px;
    text-align: center;
    line-height: 66px;
    margin: 50px auto 34px auto;
    border-radius: 40px;
  }
  input {
    font-size: 30px;
  }
  input::-webkit-input-placeholder{font-size:30px; color: #9f9f9f}/* WebKit browsers */
  input:-moz-placeholder{font-size:30px;color: #9f9f9f}/* Mozilla Firefox 4 to 18 */
  input::-moz-placeholder{font-size:30px;color: #9f9f9f}/* Mozilla Firefox 19+ */
  input:-ms-input-placeholder{font-size:30px;color: #9f9f9f}/* Mozilla Firefox 19+ */

</style>
