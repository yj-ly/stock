<template>
    <div class="tabr_content" id="tab">
      <router-link tag="div" to="/homeIndex">
          <i class="ico1"></i>
          <span>交易</span>
      </router-link>
      <router-link tag="div" to="/optional">
          <i class="ico2"></i>
          <span>自选</span>
      </router-link>
      <router-link tag="div" to="/message">
          <i class="ico3"></i>
          <span>消息</span>
      </router-link>
      <router-link tag="div" to="/myIndex">
          <i class="ico4"></i>
          <span>我的</span>
      </router-link>
    </div>
</template>

<script>
    export default {
        name: "tabr"
    }
</script>

<style scoped>
  .tabr_content {
    position: fixed;
    width: 100%;
    border-top: 1px solid #cccccc;
    display: flex;
    z-index: 100;
    bottom: 0;
    background: #ffffff;
  }
  .tabr_content div {
    width: 25%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .tabr_content i {
    display: block;
    margin: 10px 0 10px;
    width:42px;
    height: 42px;
  }
  .tabr_content span{
    padding-bottom: 8px;
    font-size: 22px;
  }
  .ico1{
    background: url("../../assets/img/deal.png")no-repeat;
    background-size: contain;
  }
  .ico2{
    background: url("../../assets/img/optional.png")no-repeat;
    background-size: contain;
  }
  .ico3{
    background: url("../../assets/img/message.png")no-repeat;
    background-size: contain;
  }
  .ico4{
    background: url("../../assets/img/my.png")no-repeat;
    background-size: contain;
  }
  .router-link-active .ico1 {
    background: url("../../assets/img/deal_down.png")no-repeat;
    background-size: contain;
  }
  .router-link-active .ico2 {
    background: url("../../assets/img/optional_down.png")no-repeat;
    background-size: contain;
  }
  .router-link-active .ico3 {
    background: url("../../assets/img/message_down.png")no-repeat;
    background-size: contain;
  }
  .router-link-active .ico4 {
    background: url("../../assets/img/my_down.png")no-repeat;
    background-size: contain;
  }
  .router-link-active span{
    color: #e70012;
  }


</style>
