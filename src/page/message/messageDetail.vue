<template>
    <div class="message_detail">
      <!--头部-->
      <publick-head>
        <div slot="bakc" class="back"></div>
        <span slot="title">消息详情</span>
      </publick-head>

      <!--消息详情-->
      <div class="message_main" :style="{'min-height':calcHeight}">
        <div class="message_con">
          <h5>{{msgDetailCon.title}}</h5>
          <div>{{msgDetailCon.content}}</div>
          <p class="time">{{msgDetailCon.created_at}}</p>
        </div>

      </div>

      <!--loading-->
      <loading ref="loading"></loading>
    </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import loading from '../../components/publick/loading'
  import {msgDetail} from "../../api/user";

  export default {
        name: "messageDetail",
      data(){
          return {
              msgDetailCon:{}
          }
      },
      mounted:function () {
        this.$store.commit('openLoading');
        this.getMsgDetail();
      },
      methods:{
          /** 15:27
            *   @author: yuanjie
            *   @description:获取消息详情
            *   @param{number} 消息id
            */
          getMsgDetail(){
            msgDetail({no:this.$route.params.id}).then(res => {
              if( res.data.status == 0){
                this.$store.commit('closeLoading');
                this.msgDetailCon = res.data.data;
              }else{
                this.$store.commit('closeLoading');
              }
            })
          }

      },
      computed:{
          //取最小高度
        calcHeight() {
          return document.documentElement.clientHeight - 42 + 'px';
        }
      },
      components:{
          publickHead,
        loading
      }
    }
</script>

<style scoped>
  .message_main {
      background: #ffffff;
  }
  .message_con {
    /*background: #ffffff;*/
   padding: 0 70px 30px 0;
  }
  .message_con h5{
    padding:30px 0 30px 30px;
    font-size: 30px;
    color: #535353;
  }
  .message_con div{
    font-size: 26px;
    color: #979797;
    padding: 0 0 30px 70px;
    line-height: 40px;
  }

  .time {
    display:flex;
    flex-direction: row-reverse;
    font-size: 20px;
    color: #bebebe;
  }





</style>
