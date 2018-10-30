<template>
  <div class="scheme_con">
    <!--头部 -->
    <publick-head>
      <div slot="bakc" class="back"></div>
      <span slot="title">方案</span>
    </publick-head>
    <div class="main" :style="{'min-height':calc}" v-if="list.length > 0">
      <div class="scheme_item" v-for="(item,index) in list" @click="setScheme(item)">
        <div class="item_top">
          <div class="top_left">
            <div class="title">{{item.name}}</div>
            <span>|</span>
          </div>
          <div class="top_right">
            保证金￥: <span v-if="item.min_deposit >= 10000">{{(item.min_deposit / 10000)}}</span><span  v-if="item.min_deposit < 10000">{{parseInt(item.min_deposit)}}</span><span v-if="item.min_deposit >= 10000">万</span>
            -<span v-if="item.max_deposit >= 10000">{{(item.max_deposit / 10000)}}</span><span  v-if="item.max_deposit < 10000">{{parseInt(item.max_deposit)}}</span><span v-if="item.max_deposit >= 10000">万</span>
          </div>
        </div>

        <div class="detail">
          <div class="detail_con">
            <p class="default_txt default">
              <!--是领导看见分厘卡电视机饭卡上的刻录机看到了实际付款了就打算离开房间ADSL空间附近的空空-->
              {{item.discript}}
              <span @click="showTxt(index)" class="show" v-if="item.discript!= null && item.discript.length >50">展示</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="not_search"  v-if="list.length == 0">
      <img src="../../assets/img/search_not.png" alt="">
      <p>什么东西都没有找到</p>
    </div>
    <!--loading-->
    <loading ref="loading"></loading>
    <!--<div class="model_con">-->
      <!--<div class="model"></div>-->
      <!--<img src="../../assets/img/loading.gif" alt="">-->
    <!--</div>-->
  </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import loading from '../../components/publick/loading'
  import {getScheme} from '../../api/index'

  export default {
    name: "stockScheme",
    data() {
      return {
        calcHeight: 0,
        list:[],   //方案列表
      }
    },
    created: function () {
    },
    mounted: function () {
      this.$store.commit('openLoading');
      this.getScheme();
      this.getHeadHeight();

    },
    methods: {
      /** 17:10
       *   @author: yuanjie
       *   @description:获取头部高度
       *   @param
       */
      getHeadHeight() {
        this.$nextTick(() => {
          let oHead = document.querySelector('.back_top');
          this.calcHeight = oHead.offsetHeight;
        })
      },

      /** 17:48
       *   @author: yuanjie
       *   @description:展示隐藏的字体
       *   @param{number} 下标
       */
      showTxt(index) {
        $('.show').show();
        $('.show').eq(index).hide();
        $('.default').addClass('default_txt');
        $('.default').eq(index).removeClass('default_txt');
        $('.default').eq(index).addClass('ac');
      },

      /** 19:30
        *   @author: yuanjie
        *   @description:获取策略产品
        *   @param
        */
      getScheme(){
        getScheme().then(res => {
          if(res.data.status == 0){
            this.list = res.data.data;
            this.$store.commit('closeLoading');
          }
        })
      },

      /** 9:10
        *   @author: yuanjie
        *   @description:选中方案
        *   @param{object} 当前点击的数据
        */
      setScheme(item){
          // this.$store.commit('setSchemAll',item);
          this.$router.push({name:'dayStrategy',params:{'schemId':item.no}});

      }

    },
    components: {
      publickHead,
      loading
    },
    computed: {
      /** 15:36
       *   @author: yuanjie
       *   @description:计算页面最小的高度
       *   @param
       */
      calc() {
        return document.documentElement.clientHeight - this.calcHeight + 'px';
      }
    },
    watch: {}
  }
</script>

<style scoped>
  .main {
    background: #eeeeee;
    padding: 2px 0 22px 0;
    box-sizing: border-box;
  }

  .scheme_item {
    background: #ffffff;
    border-radius: 10px;
    margin: 24px 28px 0 28px;
    box-shadow: 0 0 5px rgba(00, 00, 00, .5);
    padding: 0 30px 10px 30px;

  }

  .item_top {
    display: flex;
    /*justify-content: space-between;*/
    padding: 32px 0 20px 0;
    font-size: 30px;
    align-items: center;
  }

  .top_left {
    color: #3a3a3a;
    display: flex;
    align-items: center;
  }

  .top_left .title {
    width: 270px;
    height: 40px;
    margin-right: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .top_right {
    display: flex;
    align-items: center;
    color: #eb0505;
    margin-left: 20px;
    padding-top: 4px;
  }

  .detail_con {
    font-size: 26px;
    height: 100%;
    position: relative;
  }

  .detail_con .default_txt {
    height: auto;
    line-height: 50px;
    color: #b3b3b3;
    width: 600px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

  }

  .detail_con p span {
    color: #7ecef4;
    position: absolute;
    right: -10px;
    bottom: -5px;
  }

  .detail_con .ac {
    height: auto;
    line-height: 50px;
    color: #b3b3b3;
    width: 600px;
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
