<template>
    <div class="mesage_content">
      <!--头部返回-->
      <publick-head style="background:#ffffff">
        <!--<div slot="bakc" class="back"></div>-->
        <span slot="title">消息</span>
      </publick-head>


      <div class="main" :style="{height:calcHeight}">
        <div class="message_list">
          <!---->
            <div class="list" @click="localUrl(item.no)" v-for="item in msgList">

                <div class="list_left">
                  <h5>{{item.title}}</h5>
                  <p>{{item.content}}</p>
                </div>
                <div class="list_right">
                  <div class="time">
                    <span>{{item.created_at}} </span>
                  </div>
                </div>
            </div>

        </div>

        <!--数据为空-->
        <div class="not_search"  v-if="msgList.length == 0">
          <img src="../../assets/img/search_not.png" alt="">
          <p>什么东西都没有找到</p>
        </div>
      </div>
      <!--loading-->
      <loading ref="loading"></loading>
      <tabr></tabr>
    </div>

</template>

<script>
  import tabr from '../../components/publick/tabr'
  import loading from '../../components/publick/loading'
  import publickHead from '@/components/publick/publickHead'
  import {msgList} from "../../api/user";

  export default {
        name: "message",
      data() {
        return {
          oNav: null,
          msgList:[],
        }
      },
      mounted: function () {
        this.oNav = document.getElementById('tab').offsetHeight;
        this.$store.commit('openLoading');
        this.getMsgList();
      },
      methods:{
          /** 11:25
            *   @author: yuanjie
            *   @description:跳转消息详情
            *   @param{number} 接收一个num参数
            */
        localUrl(id){
          this.$router.push({name:'messageDetail',params:{id:id}})
        },
        /** 14:44
          *   @author: yuanjie
          *   @description:消息列表
          *   @param
          */
        getMsgList(){
          msgList().then(res => {
            if(res.data.status == 0){
                this.msgList = res.data.data;
              this.$store.commit('closeLoading');
            }else{
              this.$store.commit('closeLoading');
            }
          }).catch((error) => {

          })
        }
      },
      components: {
        tabr,
        loading,
        publickHead
      },
      computed: {
        calcHeight() {
          let heightNum = document.documentElement.clientHeight - this.oNav + 'px';
          return heightNum;
        }
      }
    }
</script>

<style scoped>
  .mesage_content {
    /*border-top: 1px solid #d2d2d2;*/
  }
  .message_list {
    box-sizing: border-box;
  }
  .list {
    margin: 0 0 0 30px;
    border-bottom: 1px solid #d2d2d2;
    display: flex;
    padding: 30px 30px 0 0;
    justify-content: space-between;
    position: relative;
    box-sizing: border-box;
    font-size: 24px;

  }

  .list_left {
    display: flex;
    flex-direction: column;
  }
  .list_left h5 {
    font-size: 28px;
    color: #535353;
  }
  .list_left p {
    color: #979797;
    width: 470px;
    word-break: break-all;
    text-overflow: ellipsis;
     display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 1; /** 显示的行数 **/
    overflow: hidden;
    margin-bottom: 28px;
  }
  .list_right {

  }
  .time{
    text-align: center;
    color: #bebebe;
    line-height: 32px;
    margin: 10px 0 0 0;
  }
  .terrace {
    background: url("../../assets/img/10.png")no-repeat;
    background-size: contain;
  }
  .system {
    background: url("../../assets/img/11.png")no-repeat;
    background-size: contain;
  }
  .user {
    background: url("../../assets/img/9.png")no-repeat;
    background-size: contain;
  }
  .not_search {
    text-align: center;
  }
  .not_search img{
    width: 166px;
    margin: 80px 0 0 0;
  }
  .not_search p {
    margin: 10px 0 0 0;
    font-size: 36px;
    color:#aaaaaa;
  }

</style>
