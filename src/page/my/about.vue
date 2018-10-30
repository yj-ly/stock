<template>
  <div class="about">
    <!--头部返回-->
    <publick-head style="background:#ffffff">
      <div slot="bakc" class="back"></div>
      <span slot="title" v-if="$route.params.typeNum == 0">关于我们</span>
      <span slot="title" v-if="$route.params.typeNum == 1">服务协议</span>
      <span slot="title" v-if="$route.params.typeNum == 2">策略协议</span>
    </publick-head>
    <div class="main">
      <div class="con" v-html="aboutMsg"></div>
    </div>
    <!--loading-->
    <loading ref="loading"></loading>
  </div>

</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import loading from '../../components/publick/loading'
  import {about} from "../../api/user";

  export default {
        name: "about",
        data(){
          return {
              aboutMsg:null,  //关于我们信息
          }
        },
        mounted:function () {
          this.$store.commit('openLoading');
            this.getAbout();
        },
        methods:{
            /** 14:41
              *   @author: yuanjie
              *   @description:关于我们
              *   @param
              */
            getAbout(){
              about({type:this.$route.params.typeNum}).then(res => {
                if (res.data.status == 0){
                    this.aboutMsg = res.data.data[0].content;
                  this.$store.commit('closeLoading');

                }else{
                  this.$store.commit('closeLoading');

                }
              })
            }
        },
        components:{
          publickHead,
          loading
        },
      computed:{

      }
    }
</script>

<style scoped>
  .con {
    padding: 20px;
    font-size: 28px;
    text-indent: 30px;
  }

</style>
