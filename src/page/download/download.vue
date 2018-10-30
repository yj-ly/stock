<template>
  <div class="download_con" :style="{'min-height':calc}">

    <div class="main">
      <div class="circle">
        <img src="../../assets/img/login_logo.png" alt="">
        <h3>便捷平台 轻松赚钱</h3>
        <p>一款大数据时代的炒股的app</p>
      </div>

      <div class="btn_con">
        <!--<router-link tag="div" class="item_btn" to="homeIndex">-->
        <!--<i class="Android"></i>-->
        <!--<span>IOS下载</span>-->
        <!--</router-link>-->
        <a  class="item_btn" href="">
          <i class="Android"></i>
          <span>Android下载</span>
        </a>

        <router-link tag="div" class="item_btn" to="myIndex" v-if="judgeDownload">
          <i class="h5"></i>
          <span>继续使用</span>
        </router-link>
      </div>
    </div>


    <!--提示安卓用户浏览器-->
    <div class="hint_img" :style="{height:calc}" v-if="androidShow">
      <img src="../../assets/img/Android_hind.png" alt="">
    </div>

    <div class="hint_img" :style="{height:calc}" v-if="iosShow">
      <img src="../../assets/img/ios_hind.png" alt="">
    </div>

  </div>
</template>

<script>
  export default {
    name: "download",
    data() {
      return {

        userToken: '',   //用户token
        androidShow: false,
        iosShow: false,
        judgeDownload:true   //判断是否从公众号来跳转来的
      }
    },
    mounted: function () {
      this.userToken = this.$route.query.id;
      if(this.$route.query.download != null){
          this.judgeDownload = false;
      }
      localStorage.setItem('userInfo',this.userToken);
      this.judgeBower();

    },
    methods: {
      /** 11:32
       *   @author: yuanjie
       *   @description:判断是否为微信浏览器
       *   @param
       */
      judgeBower() {

        var ua = window.navigator.userAgent.toLowerCase();
        //通过正则表达式匹配ua中是否含有MicroMessenger字符串
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          this.checkPhoneType();
          return true;
        } else {
          return false;
        }
      },

      checkPhoneType() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.indexOf("android") != -1) {
          this.androidShow = true;
        } else {
          this.iosShow = true;
        }
      },
    },
    computed: {
      calc() {
        return document.documentElement.clientHeight + 'px';
      }
    },
    watch: {},
    components: {}
  }
</script>

<style scoped>

  .model {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(00, 00, 00, .3);
  }

  .auth_model {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    margin: auto;
    width: 400px;
    height: 240px;
    background: #ffffff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .auth_model p {
    font-size: 32px;
    margin: 30px 0 20px 0;
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
  }

  .download_con {
    background: url("../../assets/img/download_ico.png") no-repeat;
    background-size: cover;
  }

  .main {
    border-top: 1px solid transparent;
  }

  .circle {
    background: #ffffff;
    border: 20px solid #fdd6c2;
    border-radius: 50%;
    text-align: center;
    margin: 140px 10px 50px 10px;
    height: 690px;
    width: 690px;

  }

  .circle img {
    margin: 120px 0 80px 0;
  }

  .circle h3 {
    font-size: 48px;
    color: #ef5b40;
    margin-bottom: 50px;
  }

  .circle p {
    font-size: 30px;
    color: #000000;
  }

  .btn_con {
    padding-bottom: 100px;
    display: flex;
    flex-direction: column;
  }

  .item_btn {
    margin: 0 120px;
    height: 90px;
    display: flex;
    align-items: center;
    background: #ffffff;
    opacity: .7;
    padding: 0 0 0 90px;
    font-size: 36px;
    color: #ef5b40;
    margin-bottom: 28px;
    border-radius: 10px;
    box-shadow: 0 4px rgba(00, 00, 00, .3);
  }

  .item_btn i {
    display: block;
    width: 60px;
    height: 60px;

  }

  .item_btn:last-child {
    margin-bottom: 0;
  }

  .item_btn .ios {
    background: url("../../assets/img/IOS.png") no-repeat;
    background-size: contain;
  }

  .item_btn .Android {
    background: url("../../assets/img/Android.png") no-repeat;
    background-size: contain;
  }

  .item_btn .h5 {
    background: url("../../assets/img/h5.png") no-repeat;
    background-size: contain;
  }

  .item_btn span {
    display: block;
    width: 280px;
    text-align: center;
  }
  .hint_img {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
  }
  .hint_img img {
    height: 100%;
    width: 100%;
  }

</style>
