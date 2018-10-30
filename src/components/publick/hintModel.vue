<template>

  <div class="model_con" v-if="showModel">
    <div class="model" v-if="showModel" @click="closeModel"></div>
    <div class="hint" v-if="showModel">
      <slot name="title">
        <div  class="title">验证码错误</div>
      </slot>
      <slot name="ico" >
        <div class="ico">

        </div>
      </slot>
      <slot name="sure" class="model_btn">
        <div class="model_btn" @click="closeModel">确定</div>
      </slot>
    </div>
  </div>

</template>

<script>
    export default {
        name: "hintModel",
        data(){
          return {
            showModel:false,
          }
        },
        methods:{
          /** 15:30
            *   @author: yuanjie
            *   @description:关闭模太层
            *   @param
            */
          closeModel(){
            this.showModel = false;
          }
        }
    }
</script>

<style>
  .model_con {
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    /*min-height: 240px;*/
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .model {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(00, 00, 00, .3);
    z-index: 1000;
  }
  .hint {
    /*position: absolute;*/
    /*left: 0;*/
    /*top: 0;*/
    /*right: 0;*/
    /*bottom: 0;*/
    /*z-index: 100;*/
    /*margin: auto;*/
    position: relative;
    z-index: 10000;
    width: 400px;
    min-height: 240px;
    background: #ffffff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    /*max-height: 360px;*/
  }

  .hint .title {
    font-size: 32px;
    margin: 30px 0 20px 0;
    padding: 0 20px;
    width: 100%;
    text-align: center;
  }

  .ico {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/error_ico.png") no-repeat center;
    background-size: contain;
    margin-bottom: 32px;
  }

  .model_btn {
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-top: 1px solid #e5e5e5;
    color: #e70015;
    width: 100%;
    display: flex;
    justify-content: center;
  }

</style>
