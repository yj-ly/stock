<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {

    }
  },
  mounted:function () {
      this.judgeNetWork();
      this.judgeVersion();
      this.monitorCancel();
  },
  methods:{
  /** 11:26
    *   @author: yuanjie
    *   @description:监听网络状态
    *   @param
    */
  judgeNetWork(){
    var EventUtil = {
      addHandler: function (element, type, handler) {
        if(element.addEventListener) {
          element.addEventListener(type, handler, false);
        }else if (element.attachEvent) {
          element.attachEvent("on" + type, handler);
        }else {
          element["on" + type] = handler;
        }
      }
    };
    EventUtil.addHandler(window, "online", function () {
      let oDiv = document.createElement('div');
      oDiv.className = 'netWork_not';
      oDiv.innerHTML = '网络恢复正常!';
      document.body.appendChild(oDiv);
      $('.netWork_not').fadeIn(1000);
      setTimeout(() => {
        $('.netWork_not').fadeOut(1000);
        document.body.removeChild(oDiv);
      },3000)
    });
    // EventUtil.addHandler(window, "offline", function () {
    //   document.write("网络不给力，请检查网络设置!");
    // });
  },

    /** 17:46
      *   @author: yuanjie
      *   @description:监听安卓的返回
      *   @param
      */
    monitorCancel(){
      let that = this;
      document.addEventListener('plusready', function() {
        var webview = plus.webview.currentWebview();
        plus.key.addEventListener('backbutton', function() {
          webview.canBack(function(e) {
            if(e.canBack) {
              // webview.back();
              if(that.$route.name == 'regiSter'){
                  that.$router.push('/login');
              }else if (that.$route.name == 'forgetPwd'){
                that.$router.push('/login');
              }else{
                that.$router.go(-1);
              }
            } else {
              mui.plusReady(function() {
                //首页返回键处理
                //处理逻辑：1秒内，连续两次按返回键，则退出应用；
                var first = null;
                plus.key.addEventListener('backbutton', function() {
                  //首次按键，提示‘再按一次退出应用’
                  if (!first) {
                    first = new Date().getTime();
                    mui.toast('再按一次退出应用');
                    setTimeout(function() {
                      first = null;
                    }, 1000);
                  } else {
                    if (new Date().getTime() - first < 1500) {
                      plus.runtime.quit();
                    }
                  }
                }, false);
              });
            }
          })
        });
      });
    },

    /** 10:12
      *   @author: yuanjie
      *   @description: 检查当前版本，与从后台获取的版本作比较，以此判断是否更新
     *   @param
      */
    judgeVersion(){
      let that = this;
      document.addEventListener('plusready',function () {
        plus.runtime.getProperty(plus.runtime.appid,function(inf){
          // 当前版本
          var wgtVersion = Number(inf.version);
          mui.ajax("http://www.grs666.com/api/v1/common/apply/version", {
            data: {},
            dataType: 'json',
            type: 'post',
            success:function(data){
              // 如果有新版本，则提示需要更新
              if( Number(data.data.version) > wgtVersion ){
                mui.confirm('检查更新','发现新版本，是否更新',['确定','取消'],function(e){
                  if(e.index==0){
                    that.downWgt(data.data.update_url); // 下载wgt方法
                  }else{
                    return;
                  }
                })
              }else{
                return;
              }
            },
            error:function(err){

            }
          });
        });
      })

    },

      /** 10:33
        *   @author: yuanjie
        *   @description:下载wgt方法
        *   @param
        */

      downWgt(url){
        var that = this;
        // 更新文件 wgt 文件地址
        var wgtUrl = url;
          plus.nativeUI.showWaiting("正在更新...");
          plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
            if ( status == 200 ) {
              that.installWgt(d.filename); // 安装wgt方法
            } else {
              plus.nativeUI.alert("下载wgt失败！");
            }
            plus.nativeUI.closeWaiting();
          }).start();

      },

    /** 10:35
      *   @author: yuanjie
      *   @description:安装wgt方法
      *   @param
      */
    installWgt(path){

        plus.nativeUI.showWaiting("安装wgt文件...");
        plus.runtime.install(path,{},function(){
          plus.nativeUI.closeWaiting();
          plus.nativeUI.alert("应用资源更新完成！",function(){
            plus.runtime.restart();
          });
        },function(e){
          plus.nativeUI.closeWaiting();
          plus.nativeUI.alert("安装wgt文件失败["+e.code+"]："+e.message);
        });
    },



  }
}
</script>

<style>

</style>
