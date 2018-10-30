<template>
    <div class="head_con">
      <div class="back_top" :class="{'add_border':addClass}">
        <div @click="back()" class="back_con">
          <slot name="bakc" ></slot>
        </div>
        <!--<div class="back" ></div>-->
        <!--<span>我的持仓</span>-->
        <slot name="title"></slot>
      </div>
    </div>
</template>

<script>
  import {getLocalDisInfo} from '../../libs/service'
    export default {
        name: "publickHead",
        data(){
          return {
            addClass:true,  //判断当前页面是否在股票页面
          }
        },
        mounted:function () {
          this.judgeUrl();
        },
        methods:{
          //返回上一个页面
          back(){

            if(this.$route.name == 'regiSter'){
              this.$router.push('/login');
            }else if (this.$route.name == 'forgetPwd'){
              this.$router.push('/login');
            }else{
              this.$router.go(-1);
            }
          },
          /** 18:15
           *   @author: yuanjie
           *   @description:判断当前的页面是否在股票交易页面
           *   @param
           */
          judgeUrl(){
            if(this.$route.name == 'stockDeal'){
              this.addClass = false;
            }
          }
        },
        computed:{


        }
    }
</script>

<style scoped>
  .back_top {

    display: flex;
    position: revert;
    height: 84px;
    align-items: center;
    justify-content: center;
  }
  .add_border{
    border-bottom: 1px solid #d2d2d2;
  }
  .back_con {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .back{
    width: 21px;
    height: 38px;
    background: url("../../assets/img/back.png")no-repeat;
    background-size: contain;
    position: absolute;
    left: 20px;

  }
  .back_top span{
    font-size:32px;
    color: #000000;
    display: block;
  }

</style>
