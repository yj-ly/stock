<template>
  <div class="stock_con" :style="{'minHeight':calc}">
    <div class="stock_head">
      <publick-head>
        <div slot="bakc" class="back"></div>
        <span slot="title" style="color: #ffffff">股票交易</span>
      </publick-head>

      <router-link to="homeIndex" tag="div" class="go_home"></router-link>

      <!--切换tab-->
      <div class="change_tab">
        <div @click="changeTab(0)" :class="{'ac':showTabNum == 0}">买入</div>
        <div @click="changeTab(1)" :class="{'ac':showTabNum == 1}">卖出</div>
        <div @click="changeTab(3)" :class="{'ac':showTabNum == 3}">查询</div>
      </div>
    </div>


    <!--用户策略-->
    <div class="checkd_contract" v-if="showTabNum == 0">
      <div class="contract_left">
        <span v-if="this.buyModel.contracts_no != ''">策略编号:{{this.buyModel.contracts_no}}</span>
        <span v-else>策略编号:----------</span>
        <span v-if="contractMoney != ''">策略可用金额: <i>{{contractMoney}}</i>元</span>
        <span v-else>策略可用金额: <i>-----------</i>元</span>
      </div>
      <div class="change_contract_btn" v-if="contractList.length > 0" @click="localUrl('changeContract')">
        变更策略
      </div>

      <!--没有创建策略的时候-->
      <div class="change_contract_btn" v-if="contractList.length == 0" @click="localUrl('stockScheme')">
        创建策略
      </div>
    </div>

    <!--买入股票-->
    <div v-if="showTabNum == 0" class="main">
      <!--搜索-->
      <div class="search_stock" v-if="newStockList.length > 0">
        <div class="search_list" v-for="item in newStockList" @click="setStock(item)" :class="{'not_stock':item.risk_status != 0}">
          <div>
            <span>{{item.name}}</span>
            <i v-if="item.risk_status == 1">(禁买)该股风险较大</i>
          </div>

          <span>{{item.code}}</span>

        </div>
      </div>
      <div class="stock_wrap">
        <!--左边-->
        <div class="stock_left">
          <div class="stock_name">
            <input type="text" placeholder="股票代码/名称" v-model="stockName">

          </div>


          <div class="stock_money">
            <div class="stock_money_top">
              <div class="subtract_stock">
                <i @click="changeVal(1)"></i>
              </div>
              <input type="text" placeholder="买入价格" v-model="buyModel.price">
              <div class="add_stock">
                <i @click="changeVal(0)"></i>
              </div>
            </div>
            <div class="stock_money_hint">
              <span class="money_hint_left">涨停：<i>{{harden}}</i></span>
              <span class="money_hint_right">
                    跌停: <i>{{limit}}</i>
                  </span>
            </div>
          </div>
          <div class="stock_money stock_num">
            <div class="stock_money_top">
              <div class="subtract_stock">
                <i @click="changeVal(3)"></i>
              </div>
              <input type="text" placeholder="买入数量" v-model="buyModel.num">
              <div class="add_stock">
                <i @click="changeVal(2)"></i>
              </div>
            </div>
            <div class="stock_money_hint" v-if="canBuy >= 100 && canBuy != Infinity ">
              <span>可买：<i>{{canBuy}}</i></span>

            </div>
            <div class="stock_money_hint" v-else>
              <span>可买：<i>0</i></span>
            </div>
          </div>

          <div class="storehouse">
            <div class="storehouse_item" @click="granary(1)" :class="{'acstock':acBuyIndex == 1}">全仓</div>
            <div class="storehouse_item" @click="granary(2)" :class="{'acstock':acBuyIndex == 2}">半仓</div>
            <div class="storehouse_item" @click="granary(3)" :class="{'acstock':acBuyIndex == 3}">1/3仓</div>
            <div class="storehouse_item" @click="granary(4)" :class="{'acstock':acBuyIndex == 4}">1/4仓</div>
          </div>
          <div class="convert">
            <span>折合:(￥)</span>
            <i v-if="buyModel.num <= this.canBuy">{{(buyModel.price * buyModel.num).toFixed(2)}}</i>
            <i v-else>0</i>
          </div>
          <span v-if="allMoney != '' && allMoney > 0 " class="stock_buy_num">该股票可用资金: <i>{{allMoney}}</i>元</span>
          <div class="apply_btn" @click="buy" v-if="!buyBtnSure">
            买入
          </div>
          <div class="btn_sure" v-if="buyBtnSure">
            <i></i>
          </div>

        </div>
        <!--五档图-->
        <div class="stock_right" v-if="fiveDetail.buy_five_price == null">
          <div class="stock_title">
            最新成交价:￥<i>-----</i>
          </div>
          <div class="sell">
            <div class="sell_item">
              <span class="sell_left">卖五</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="sell_item">
              <span class="sell_left">卖四</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="sell_item">
              <span class="sell_left">卖三</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="sell_item">
              <span class="sell_left">卖二</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="sell_item">
              <span class="sell_left">卖一</span>
              <span>-----</span>
              <span>-----</span>
            </div>
          </div>
          <div class="buy">
            <div class="buy_item">
              <span class="buy_left">买一</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买二</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买三</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买四</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买五</span>
              <span>-----</span>
              <span>-----</span>
            </div>
          </div>
        </div>
        <div class="stock_right" v-if="fiveDetail.buy_five_price != null">
          <div class="stock_title">
            最新成交价:￥<i>{{(fiveDetail.now_price * 1).toFixed(2)}}</i>
          </div>
          <div class="sell">
            <div class="sell_item">
              <span class="sell_left">卖五</span>
              <span>{{(fiveDetail.sell_five_price * 1).toFixed(2)}}</span>
              <span>{{(fiveDetail.sell_five_quantity * 1)}}</span>
            </div>
            <div class="sell_item">
              <span class="sell_left">卖四</span>
              <span>{{(fiveDetail.sell_four_price * 1).toFixed(2)}}</span>
              <span>{{(fiveDetail.sell_four_quantity * 1)}}</span>

            </div>
            <div class="sell_item">
              <span class="sell_left">卖三</span>
              <span>{{(fiveDetail.sell_three_price * 1).toFixed(2)}}</span>
              <span>{{(fiveDetail.sell_three_quantity * 1)}}</span>
            </div>
            <div class="sell_item">
              <span class="sell_left">卖二</span>
              <span>{{(fiveDetail.sell_two_price * 1).toFixed(2)}}</span>
              <span>{{(fiveDetail.sell_two_quantity * 1)}}</span>
            </div>
            <div class="sell_item">
              <span class="sell_left">卖一</span>
              <span>{{(fiveDetail.sell_one_price * 1).toFixed(2)}}</span>
              <span>{{(fiveDetail.sell_one_quantity * 1)}}</span>
            </div>
          </div>
          <div class="buy">
            <div class="buy_item">
              <span class="buy_left">买一</span>
              <span>{{(fiveDetail.buy_one_price * 1).toFixed(2)}}</span>
              <span>{{(fiveDetail.buy_one_quantity * 1)}}</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买二</span>
              <span>{{(fiveDetail.buy_two_price * 1).toFixed(2)}}</span>
              <span>{{(fiveDetail.buy_two_quantity * 1)}}</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买三</span>
              <span>{{(fiveDetail.buy_three_price * 1).toFixed(2)}}</span>
              <span>{{(fiveDetail.buy_three_quantity * 1)}}</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买四</span>
              <span>{{(fiveDetail.buy_four_price * 1).toFixed(2)}}</span>
              <span>{{(fiveDetail.buy_four_quantity * 1)}}</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买五</span>
              <span>{{(fiveDetail.buy_five_price * 1).toFixed(2)}}</span>
              <span>{{(fiveDetail.buy_five_quantity * 1)}}</span>
            </div>
          </div>
        </div>
      </div>
      <!--<div class="stock_bottom">-->
      <!--<div class="filtrate">-->
      <!--<div class="left"><span>我的自选</span></div>-->
      <!--<div class="center"><span>最新价</span></div>-->
      <!--<div><span>涨跌幅/涨跌</span></div>-->
      <!--</div>-->
      <!--<div class="list">-->
      <!--<div class="list_left">-->
      <!--<div>美丽生态</div>-->
      <!--<span>019873</span>-->
      <!--</div>-->
      <!--<div class="list_center">-->
      <!--<div>1000.00</div>-->
      <!--</div>-->
      <!--<div class="list_right">-->
      <!--<div class="right_top">-->
      <!--<span style="display: none">-</span>-->
      <!--<span>+</span>-->
      <!--<div class="add_txt">23.43%</div>-->
      <!--</div>-->
      <!--<div class="right_bottom">-->
      <!--<span style="display: none">-</span>-->
      <!--<span>+</span>-->
      <!--<span class="add_txt">0.62</span>-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="remove_item">删除</div>-->
      <!--</div>-->
      <!--</div>-->
    </div>

    <!--卖出股票-->
    <div v-if="showTabNum == 1" class="main">
      <div class="stock_wrap">
        <!--左边-->
        <div class="stock_left">
          <div class="stock_name" @click="localUrl('myStock')">
            <span v-if="shellStockCode == ''">选择股票</span>
            <span v-else>{{shellMsg}}</span>
          </div>
          <div class="stock_money">
            <div class="stock_money_top">
              <div class="subtract_stock">
                <i @click="addShellStock(3)"></i>
              </div>
              <input type="text" placeholder="卖出价格" v-model="shellModel.price">
              <div class="add_stock">
                <i @click="addShellStock(2)"></i>
              </div>
            </div>
            <div class="stock_money_hint">
              <span class="money_hint_left">涨停：<i>{{shellHarden}}</i></span>
              <span class="money_hint_right">
                    跌停: <i>{{shellLimit}}</i>
                  </span>
            </div>
            <div class="stock_money_top">
              <div class="subtract_stock">
                <i @click="addShellStock(1)"></i>
              </div>
              <input type="text" placeholder="卖出数量" v-model="shellModel.num">
              <div class="add_stock">
                <i @click="addShellStock(0)"></i>
              </div>
            </div>
            <div class="stock_money_hint">
              <span>可卖：<i>{{vendibilityNum}}</i></span>

            </div>


          </div>

          <div class="storehouse">
            <div class="storehouse_item" @click="setGranary(1)" :class="{'acstock':acStorehouse == 1}">全仓</div>
            <div class="storehouse_item" @click="setGranary(2)" :class="{'acstock':acStorehouse == 2}">半仓</div>
            <div class="storehouse_item" @click="setGranary(3)" :class="{'acstock':acStorehouse == 3}">1/3仓</div>
            <div class="storehouse_item" @click="setGranary(4)" :class="{'acstock':acStorehouse == 4}">1/4仓</div>
          </div>
          <div class="convert">
            <span>折合:(￥)</span>
            <i v-if="shellModel.num <= vendibilityNum ">{{(Number(shellModel.price) *
              Number(shellModel.num)).toFixed(2)}}</i>
            <i v-else>0</i>
          </div>
          <div class="apply_btn sell_btn" @click="sellStock" v-if="!sellBtnSure">
            卖出
          </div>

          <div class="btn_sure2" v-if="sellBtnSure">
            <i></i>
          </div>

        </div>
        <!--五档图-->
        <div class="stock_right" v-if="shellFiveDetail.buy_five_price == null">
          <div class="stock_title">
            最新成效价:￥<i>-----</i>
          </div>
          <div class="sell">
            <div class="sell_item">
              <span class="sell_left">卖五</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="sell_item">
              <span class="sell_left">卖四</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="sell_item">
              <span class="sell_left">卖三</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="sell_item">
              <span class="sell_left">卖二</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="sell_item">
              <span class="sell_left">卖一</span>
              <span>-----</span>
              <span>-----</span>
            </div>
          </div>
          <div class="buy">
            <div class="buy_item">
              <span class="buy_left">买一</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买二</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买三</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买四</span>
              <span>-----</span>
              <span>-----</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买五</span>
              <span>-----</span>
              <span>-----</span>
            </div>
          </div>
        </div>
        <div class="stock_right" v-if="shellFiveDetail.buy_five_price != null">
          <div class="stock_title">
            最新成效价:￥<i>{{(shellFiveDetail.now_price * 1).toFixed(2)}}</i>
          </div>
          <div class="sell">
            <div class="sell_item">
              <span class="sell_left">卖五</span>
              <span>{{(shellFiveDetail.sell_five_price * 1).toFixed(2)}}</span>
              <span>{{(shellFiveDetail.sell_five_quantity * 1)}}</span>
            </div>
            <div class="sell_item">
              <span class="sell_left">卖四</span>
              <span>{{(shellFiveDetail.sell_four_price * 1).toFixed(2)}}</span>
              <span>{{(shellFiveDetail.sell_four_quantity * 1)}}</span>
            </div>
            <div class="sell_item">
              <span class="sell_left">卖三</span>
              <span>{{(shellFiveDetail.sell_three_price * 1).toFixed(2)}}</span>
              <span>{{(shellFiveDetail.sell_three_quantity * 1)}}</span>
            </div>
            <div class="sell_item">
              <span class="sell_left">卖二</span>


              <span>{{(shellFiveDetail.sell_two_price * 1).toFixed(2)}}</span>
              <span>{{(shellFiveDetail.sell_two_quantity * 1)}}</span>
            </div>
            <div class="sell_item">
              <span class="sell_left">卖一</span>
              <span>{{(shellFiveDetail.sell_one_price * 1).toFixed(2)}}</span>
              <span>{{(shellFiveDetail.sell_one_quantity * 1)}}</span>
            </div>
          </div>
          <div class="buy">
            <div class="buy_item">
              <span class="buy_left">买一</span>
              <span>{{(shellFiveDetail.buy_one_price * 1).toFixed(2)}}</span>
              <span>{{(shellFiveDetail.buy_one_quantity * 1)}}</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买二</span>
              <span>{{(shellFiveDetail.buy_two_price * 1).toFixed(2)}}</span>
              <span>{{(shellFiveDetail.buy_two_quantity * 1)}}</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买三</span>
              <span>{{(shellFiveDetail.buy_three_price * 1).toFixed(2)}}</span>
              <span>{{(shellFiveDetail.buy_three_quantity * 1)}}</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买四</span>
              <span>{{(shellFiveDetail.buy_four_price * 1).toFixed(2)}}</span>
              <span>{{(shellFiveDetail.buy_four_quantity * 1)}}</span>
            </div>
            <div class="buy_item">
              <span class="buy_left">买五</span>
              <span>{{(shellFiveDetail.buy_five_price * 1).toFixed(2)}}</span>
              <span>{{(shellFiveDetail.buy_five_quantity * 1)}}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!--撤单-->
    <div class="main" v-if="showTabNum == 2">
      <div class="cancellations_con">
        <div class="cancellations_list">

          <div class="cancell_top">
            <div class="cancel_left">
              <div class="cancellations_time">
                2017/08/19 12:00
                <i>|</i>
                股票买入
              </div>
              <div class="cancell_name">
                <span>股票名称：</span>
                万达sa3873983
              </div>
              <div class="cancell_money">
                <span>委托价格：</span>
                ￥2899.00
              </div>
            </div>
            <div class="cancel_right">
              <div class="cancellations_btn">撤单</div>
              <div class="cancell_status">部份成效</div>
            </div>
          </div>
          <div class="cancell_bottom">
            <div><span>委托金额：</span>￥28</div>
            <div><span>成效数：</span>￥28</div>
            <div><span>剩余数：</span>￥28</div>
          </div>
        </div>
      </div>
    </div>
    <!--交易记录-->

    <div class="main" v-if="showTabNum == 3">
      <div class="record_con">
        <router-link :to="{name:'cancelOrder',params:{typeNum:0}}" tag="div" class="record_list">
          <span>当日成交</span>
          <i></i>
        </router-link>
        <router-link :to="{name:'cancelOrder',params:{typeNum:1}}" tag="div" class="record_list">
          <span>当日委托</span>
          <i></i>
        </router-link>
        <router-link :to="{name:'cancelOrder',params:{typeNum:2}}" tag="div" class="record_list">
          <span>历史成交</span>
          <i></i>
        </router-link>
        <router-link :to="{name:'cancelOrder',params:{typeNum:3}}" tag="div" class="record_list">
          <span>历史委托</span>
          <i></i>
        </router-link>
        <router-link :to="{name:'cancelOrder',params:{typeNum:4}}" tag="div" class="record_list">
          <span>交易流水</span>
          <i></i>
        </router-link>
      </div>
    </div>

    <!--loading-->
    <loading ref="loading"></loading>

    <!--提示信息-->
    <hint-model ref="message">
      <p class="title" slot="title">{{errorMessage}}</p>
      <div class="ico_success" slot="ico" v-if="showSuccess"></div>
    </hint-model>
  </div>
</template>

<script>
  import publickHead from '@/components/publick/publickHead'
  import loading from '../../components/publick/loading'
  import hintModel from '@/components/publick/hintModel'
  import {getStockList, contract, buyStock, sellStock, stockDetail,positionDetail} from "../../api";
  import {canBuy} from "../../api/user";

  export default {
    name: "stockDeal",
    data() {
      return {
        showTabNum: 0,  //默认显示按天策略
        caclHeight: 0,   //页面默认展示的调试
        stockList: [],
        newStockList: [],
        showSearchList: false,
        timer: null,      //函数防抖买入
        contractMoney: '',       //策略可用金额
        contractList: [],   //策略列表
        buyItem:null,
        buyModel: {
          contracts_no: '',  //策略编号
          stock_no: '',      //股票no
          num: '',           //股票数量
          price: '',         //委托价格
        },
        buyTimer: null,
        stockName: '',       //输入的字段
        harden: 0,          //股票涨停
        limit: 0,           //股票跌停
        canBuy: 0,          //股票可买数量
        nowStockMoney: 0,      //当前股票价格
        allMoney: '',       //总金额
        errorMessage: '',       //错误信息
        showSuccess: false,      //成功
        butNotBtn: true,         //买入股票按钮点击一次之后不可以在点击
        fiveDetail: {},          //买入股票的五档详情
        acBuyIndex: null,         //买入股票的参数
        stockStrNum: false,        //点击字段的长
        clickBoole: false,         //判断用户有没有搜索出来的股票
        setCode: null,             //选中当前股票的代码
        buyBtnSure:false,       //支付等待

        /*********卖出股票***********/
        vendibilityNum: 0,        //可以卖的股票数量
        shellStockCode: '',        //卖出的股票code
        shellStockName: '',        //卖出股票名称
        shellMsg: '',
        shellModel: {
          order_no: '',           //订单no
          stock_no: '',           //股票no
          num: '',                //委托数量
          price: '',              //价格
        },
        shellTimer: null,
        shellHarden: 0,          //卖出涨停
        shellLimit: 0,           //跌停
        shellFiveDetail: {},     //卖出五档详情
        acStorehouse: '',        //设置卖出的仓数
        btnOnce: true,           //卖出股票按钮只能点击一次    yesterday_price
        sellBtnSure:false,       //支付等待

      }
    },
    created: function () {

    },
    mounted: function () {

      //判断是否从选择股票页面跳过来
      if (this.$route.params.showNum == 1) {
        this.showTabNum = 1;
        this.getShellDetail(this.$route.params.no);
        this.shellModel.order_no = this.$route.params.no;
        this.shellModel.stock_no = this.$route.params.stock_no;
        this.shellStockCode = this.$route.params.stockCode;
       console.log(this.$route.params.stockCode);
        this.shellStockName = this.$route.params.stockName;
        this.shellMsg = this.shellStockName + '/' + this.shellStockCode;

      }
      if (this.$route.params.showNum == 2) {
        this.showTabNum = 2;
      }

      this.$store.commit('openLoading');
      let oHead = document.querySelector('.stock_head');
      this.calcHeight = oHead.offsetHeight;
      this.getStockList();     //获取股票列表


    },
    methods: {
      //更换显示num
      changeTab(num) {
        this.showTabNum = num;
        if (num == 0) {
          if (this.clickBoole && this.setCode != '') {
            clearInterval(this.buyTimer);
            this.realFiveData(this.setCode);
          }

          // clearInterval(this.shellTimer);

        }
        if (num == 1) {
          if (this.buyTimer != null) {
            clearInterval(this.buyTimer);
          }

        }
        // if(num == 3){
        //   if(this.shellTimer != null){
        //     clearInterval(this.shellTimer);
        //
        //   }
        // }
      },

      /** 14:34
       *   @author: yuanjie
       *   @description:跳转页面
       *   @param{string} 接收一个页面路径参数
       */
      localUrl(str) {
        this.$router.push(str);
      },

      /** 17:29
       *   @author: yuanjie
       *   @description:获取股票列表
       *   @param
       */
      getStockList() {
        getStockList().then(res => {
          if (res.data.status == 0) {
            this.stockList = res.data.data;
          }
        })
        contract().then(res => {
          if (res.data.status == 0) {
            this.contractList = res.data.data;
            if (res.data.data.length > 0) {
              this.buyModel.contracts_no = res.data.data[0].no
              this.contractMoney = res.data.data[0].total_balance;

            }
            //判断如果是从选择策略跳转回来的就获取当前选中的策略信息
            if (this.$route.params.judgeNum != null) {
              contract({'contract_no': this.$route.params}).then(res => {
                if (res.data.status == 0) {
                  this.buyModel.contracts_no = res.data.data.no;
                  this.contractMoney = res.data.data.total_balance;
                  this.$store.commit('closeLoading');
                }
              })
            } else if (this.$route.params.buyNum == 0) {
              this.setStock(this.$route.params.detail);
            }
            this.$store.commit('closeLoading');
          }
        })
      },
      /** 11:31
       *   @author: yuanjie
       *   @description:选中搜索的股票
       *   @param{object} 当前点击对象
       */
      setStock(item) {
        if(item.risk_status == 0){
          this.buyItem = item;
          this.newStockList = [];
          this.buyModel.stock_no = item.no;
          this.stockStrNum = item.code.length + item.name.length + 1;
          this.stockName = item.code + '/' + item.name;
          this.clickBoole = true;
          this.setCode = item.stock_code;
          stockDetail({'code': item.stock_code}).then(res => {
            if (res.data.status == 0) {
              this.harden = res.data.data.up_price;
              this.limit = res.data.data.down_price;
              this.nowStockMoney = (res.data.data.now_price * 1).toFixed(2);
              this.fiveDetail = res.data.data.stock_market;
              this.buyModel.price = this.nowStockMoney;
              canBuy({'contracts_no': this.buyModel.contracts_no, 'stock_no': item.no}).then(res => {
                if (res.data.status == 0) {
                  this.allMoney = res.data.data;
                  this.canBuy = (Math.floor(Number(this.allMoney / this.nowStockMoney) / 100) * 100);   //用后台返回过来的金额 / 当前的买入价格
                  this.realFiveData(item.stock_code);
                }
              })

            }
          })
        }

      },
      /** 17:17
       *   @author: yuanjie
       *   @description:选中股票的时候去开一个定时器
       *   @param{number} 当前选中的股票
       */
      realFiveData(code) {
        clearInterval(this.buyTimer);
        this.buyTimer = setInterval(() => {
          stockDetail({'code': code}).then(res => {
            if (res.data.status == 0) {
              this.fiveDetail = res.data.data.stock_market;
            }

          })

        }, 3000)

      },

      /** 16:14
       *   @author: yuanjie
       *   @description:相应值的修改
       *   @param{number}传一个值判断当前是那个操作
       */
      changeVal(num) {
        if (num == 0) {
          if (Number(this.buyModel.price) < Number(this.harden)) {
            this.buyModel.price = (Number(this.buyModel.price) + Number(0.01)).toFixed(2);
          }

        } else if (num == 1) {
          if (Number(this.buyModel.price) > Number(this.limit)) {
            this.buyModel.price = (Number(this.buyModel.price) - Number(0.01)).toFixed(2);
          }
        } else if (num == 2) {
          if (Number(this.buyModel.num) < Number(this.canBuy)) {
            this.buyModel.num = Number(this.buyModel.num) + 100;
          }
        } else {
          if (Number(this.buyModel.num) > 100) {
            this.buyModel.num = Number(this.buyModel.num) - 100;
          }
        }
      },
      /** 18:13
       *   @author: yuanjie
       *   @description:设置仓数
       *   @param{number} 来判断当前是选择那一个仓
       */
      granary(num) {
        if (this.canBuy < 100) {
          this.buyModel.num = 0;
          return false;
        }
        this.acBuyIndex = num;
        if (Number(this.canBuy / num) % 100 != 0) {
          let stockNum = parseInt(Number(this.canBuy / num));
          if(stockNum < 100){
              this.acBuyIndex = '';
            this.buyModel.num = 0;
            return;
          }
          for (let i = 0; i < stockNum; i++) {
            if (stockNum % 100 == 0) {
              this.buyModel.num = stockNum;
              break;
            }
            stockNum--;
          }
        } else {
          this.buyModel.num = Number(this.canBuy / num);
        }

        // console.log(Math.ceil((this.canBuy / 100) / num) * 100 ) ;


      },
      /** 11:33
       *   @author: yuanjie
       *   @description:买入股票
       *   @param
       */
      buy() {

        if (this.stockName == '') {
          this.$refs.message.showModel = true;
          this.errorMessage = '请填写股票代码/名称';
          return false;
        }
        if (this.buyModel.price != '') {
          if (this.buyModel.price > this.harden) {
            this.$refs.message.showModel = true;
            this.errorMessage = '金额大于最大的金额';
            return false;
          }
          if (this.buyModel.price < this.limit) {
            this.$refs.message.showModel = true;
            this.errorMessage = '金额小于最小金额';
            return false;
          }
        } else {
          this.$refs.message.showModel = true;
          this.errorMessage = '请输入购买金额';
          return false;
        }

        if (this.buyModel.num != '') {
          if (this.buyModel.num > this.canBuy) {
            this.$refs.message.showModel = true;
            this.errorMessage = '超过购买最大数量';
            return false;
          }
          if (this.buyModel.num < 100) {
            this.$refs.message.showModel = true;
            this.errorMessage = '超过最小购买100';
            return false;
          }
          if (this.buyModel.num % 100 != 0) {
            this.$refs.message.showModel = true;
            this.errorMessage = '请输入100的倍数';
            return false;
          }
        } else {
          this.$refs.message.showModel = true;
          this.errorMessage = '请输入购买数量';
          return false;
        }

        if (this.butNotBtn) {
          this.buyBtnSure = true;
          this.butNotBtn = false;
          setTimeout(() => {
            buyStock(this.buyModel).then(res => {
              if (res.data.status == 0) {
                this.$refs.message.showModel = true;
                this.showSuccess = true;
                this.errorMessage = res.data.msg;
                this.buyModel.num = '';
                this.acBuyIndex = '';
                this.setStock(this.buyItem);
                this.buyBtnSure = false;


              } else {
                this.$refs.message.showModel = true;
                this.errorMessage = res.data.msg;
                this.buyBtnSure = false;
              }
              this.butNotBtn = true;
            })
          },1000)

        }
      },

      /************************************卖股票*******************************************/
      /** 20:05
        *   @author: yuanjie
        *   @description:选择股票转来之后获取信息
        *   @param{number}订单编号
        */
        getShellDetail(no){
        positionDetail({'order_no':no}).then(res => {
          if(res.data.status == 0){
            this.vendibilityNum = res.data.data.usable_num;
            this.shellModel.num = '';
            this.acBuyIndex = '';
            stockDetail({'code': this.shellStockCode}).then(res => {
              if (res.data.status == 0) {
                this.shellHarden = res.data.data.up_price;
                this.shellLimit = res.data.data.down_price;
                this.shellModel.price = Number(res.data.data.now_price).toFixed(2)
                // this.nowStockMoney = (res.data.data.now_price * 1).toFixed(2);
                this.shellFiveDetail = res.data.data.stock_market;
              }
            })
            this.getSellFiveData(this.shellStockCode);
          }
        })

      },


      /** 17:30
       *   @author: yuanjie
       *   @description:选中股票名称的时候加上一个定时器去查询当前的五档
       *   @param{number}选中股票的code
       */
      getSellFiveData(code) {
        clearInterval(this.shellTimer);
        this.shellTimer = setInterval(() => {
          stockDetail({'code': code}).then(res => {
            if (res.data.status == 0) {
              this.shellFiveDetail = res.data.data.stock_market;
            }
          })
        }, 3000)

      },


      /** 19:02
       *   @author: yuanjie
       *   @description:设置卖出股票的仓数
       *   @param{number} 传入数字用来判断点击的是那一个
       */
      setGranary(num) {
        this.acStorehouse = num;
        if (Number(this.vendibilityNum / num) % 100 != 0) {
          let stockNum = parseInt(Number(this.vendibilityNum / num));
          for (let i = 0; i < stockNum; i++) {
            if (stockNum % 100 == 0) {
              this.shellModel.num = stockNum;
              break;
            }
            stockNum--;
          }
        } else {
          this.shellModel.num = this.vendibilityNum / num;
        }

      },


      /** 17:53
       *   @author: yuanjie
       *   @description:添加和增加股票数量
       *   @param{number}判断是增加不是减
       */
      addShellStock(num) {
        var num = Number(num);
        this.shellModel.num = Number(this.shellModel.num);
        if (this.vendibilityNum < 100) {
          return false;
        }

        if (num == 1) {

          if (Number(this.shellModel.num) > 100) {
            this.shellModel.num -= 100;
          }
        } else if (num == 0) {
          if (Number(this.shellModel.num) < this.vendibilityNum) {
            this.shellModel.num += 100;
          }
        } else if (num == 3) {  //卖出的减
          if (Number(this.shellModel.price) > Number(this.shellLimit)) {
            this.shellModel.price = (Number(this.shellModel.price) - Number(0.01)).toFixed(2);
          }


        } else {
          if (this.shellModel.price == '') {
            this.shellModel.price = this.shellLimit;
          }
          if (Number(this.shellModel.price) < Number(this.shellHarden)) {
            this.shellModel.price = (Number(this.shellModel.price) + Number(0.01)).toFixed(2);
          }
        }

      },
      /** 18:52
       *   @author: yuanjie
       *   @description:卖股票
       *   @param
       */
      sellStock() {

        if (this.shellStockCode == '') {
          this.$refs.message.showModel = true;
          this.errorMessage = '请选择一只股票';
          return false;
        }
        if (this.shellModel.price != '') {
          if (this.shellModel.price > this.shellHarden) {
            this.$refs.message.showModel = true;
            this.errorMessage = '金额大于最大的金额';
            return false;
          }
          if (this.shellModel.price < this.shellLimit) {
            this.$refs.message.showModel = true;
            this.errorMessage = '金额小于最小金额';
            return false;
          }
        } else {
          this.$refs.message.showModel = true;
          this.errorMessage = '请输入购卖股票的金额';
          return false;
        }

        if (this.shellModel.num != '') {
          if (this.shellModel.num > this.vendibilityNum) {
            this.$refs.message.showModel = true;
            this.errorMessage = '超过购买最大数量';
            return false;
          }
          if (this.shellModel.num < 100) {
            this.$refs.message.showModel = true;
            this.errorMessage = '超过最小购买100';
            return false;
          }
          if (this.shellModel.num % 100 != 0) {
            this.$refs.message.showModel = true;
            this.errorMessage = '请输入100的倍数';
            return false;
          }
        } else {
          this.$refs.message.showModel = true;
          this.errorMessage = '请输入购买数量';
          return false;
        }

        if (this.btnOnce) {
          this.btnOnce = false;
          this.sellBtnSure = true;
          setTimeout( () => {
            sellStock(this.shellModel).then(res => {
              if (res.data.status == 0) {
                this.$refs.message.showModel = true;
                this.showSuccess = true;
                this.errorMessage = res.data.msg;
                this.sellBtnSure = false;
                this.btnOnce = true;
                this.getShellDetail(this.$route.params.no);
              } else {
                this.$refs.message.showModel = true;
                this.errorMessage = res.data.msg;
                this.sellBtnSure = false;
                this.btnOnce = true;
              }
            })
          },1000)

        }


      }

    },
    components: {
      publickHead,
      loading,
      hintModel
    },
    computed: {
      /** 15:36
       *   @author: yuanjie
       *   @description:计算页面最小的高度
       *   @param
       */
      calc() {
        return document.documentElement.clientHeight + 'px';
      }
    },
    watch: {
      'stockName': function (newVal) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          if (newVal == '') {
            this.newStockList = [];
            this.buyModel.price = '';
            this.buyModel.num = '';
            this.buyModel.stock_no = '';
            this.buyModel.order_no = '';
            this.canBuy = 0;
            this.harden = 0;
            this.limit = 0;
            this.fiveDetail = {};
            this.stockStrNum = 0;
            this.allMoney = '';
            if (this.buyTimer != null) {
              clearInterval(this.buyTimer);
            }

            return;
          }
          if (newVal.length < this.stockStrNum) {
            this.stockName = '';
            this.allMoney = '';
            this.buyModel.price = '';
            this.buyModel.num = '';
            this.buyModel.stock_no = '';
            this.buyModel.order_no = '';
            this.canBuy = 0;
            this.harden = 0;
            this.limit = 0;
            this.stockStrNum = 0;
            this.fiveDetail = {};
            if (this.buyTimer != null) {
              clearInterval(this.buyTimer);
            }
          }
          getStockList({key: newVal}).then(res => {
            if (res.data.status == 0) {
              this.newStockList = res.data.data;
            } else {
              this.$store.commit('closeLoading');
            }
          })


        }, 400)
      },

      'buyModel.price': function (newVal) {
        if (this.harden == 0) {
          this.buyModel.price = '';
          return false;
        }
        this.buyModel.price = this.buyModel.price.replace(/[^\d.]/g, "");
//保证只有出现一个.而没有多个.
        this.buyModel.price = this.buyModel.price.replace(/\.{2,}/g, ".");
//必须保证第一个为数字而不是.
        this.buyModel.price = this.buyModel.price.replace(/^\./g, "");
//保证.只出现一次，而不能出现两次以上
        this.buyModel.price = this.buyModel.price.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
//只能输入两个小数
        this.buyModel.price = this.buyModel.price.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
        this.canBuy = (Math.floor(this.allMoney / 100 / this.buyModel.price)) * 100;   //用后台返回过来的金额 / 当前的买入价格

        // if (Number(newVal) >= Number(this.harden)) {
        //   this.buyModel.price = this.harden;
        //   return false;
        // }


      },
      'buyModel.num': function (newVal) {
        let val = String(newVal);
        if (val == '') {
          this.acBuyIndex = '';
        }
        this.buyModel.num = val.replace(/\D/g, '');
      },
      'shellModel.num': function (newVal) {
        let val = String(newVal);
        if (val == '') {
          this.acStorehouse = '';
        }
        this.shellModel.num = val.replace(/\D/g, '');
      },

//       'shellModel.price': function (newVal) {
//         let val = String(newVal);
//         if (this.shellHarden == 0) {
//           this.buyModel.price = '';
//           return false;
//         }
//         this.shellModel.price = val.replace(/[^\d.]/g, "");
// //保证只有出现一个.而没有多个.
//         this.shellModel.price = val.replace(/\.{2,}/g, ".");
// //必须保证第一个为数字而不是.
//         this.shellModel.price = val.replace(/^\./g, "");
// //保证.只出现一次，而不能出现两次以上
//         this.shellModel.price = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
// //只能输入两个小数
//         this.shellModel.price = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
//         console.log(this.showModel.price);
//
//       },
    },
    destroyed() {

      if (this.buyTimer != null) {
        clearInterval(this.buyTimer);

      }
      if (this.shellTimer != null) {
        clearInterval(this.shellTimer);
      }
    }
  }
</script>

<style scoped>
  .stock_con {
    background: #f8f7f4;
  }

  .stock_head {
    background: url("../../assets/img/stock_head.png") no-repeat;
    background-size: cover;
    position: relative;
  }
  .go_home {
    position: absolute;
    top: 28px;
    left: 80px;
    width: 30px;
    height: 30px;
    background: url("../../assets/img/gohome_ico.png")no-repeat;
    background-size: contain;

  }

  .change_tab {
    display: flex;
    margin: 36px 0 0 0;
    padding: 0 70px 0 70px;
    font-size: 34px;
    color: #ffffff;
    justify-content: space-between;
  }

  .change_tab div {
    border-bottom: 8px solid transparent;
  }

  .change_tab .ac {
    border-bottom: 8px solid #e70012;
  }

  .main {

    height: 100%;
    position: relative;
  }

  .stock_wrap {
    margin: 0 20px 0 20px;
    display: flex;
    justify-content: space-between;
  }

  .stock_left {
    width: 326px;
  }

  .stock_name {
    width: 326px;
    height: 64px;
    border: 2px solid #d2d2d2;
    text-align: center;
    font-size: 32px;
    color: #050505;
    line-height: 64px;
    margin: 40px 0 40px 0;
    border-radius: 40px;
    background: #ffffff;
  }

  .stock_name input {
    width: 90%;
    text-indent: 40px;
    background: #ffffff;

  }

  .stock_money_top {
    width: 326px;
    height: 64px;
    border: 2px solid #d2d2d2;
    text-align: center;
    font-size: 32px;
    color: #050505;
    line-height: 64px;
    margin: 20px 0 0 0;
    border-radius: 40px;
    position: relative;
    display: flex;
    justify-content: space-between;
    background: #ffffff;
  }

  .subtract_stock, .add_stock {
    width: 100px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .subtract_stock {
    border-right: 1px solid #dcdcdc;
  }

  .add_stock {
    border-left: 1px solid #dcdcdc;
  }

  .subtract_stock i {
    display: block;
    width: 30px;
    height: 7px;
    background: url("../../assets/img/subtract_stock.png") no-repeat center;
    background-size: contain;
  }

  .add_stock i {
    display: block;
    width: 30px;
    height: 31px;
    background: url("../../assets/img/stock_add.png") no-repeat center;
    background-size: contain;
  }

  .stock_money_top input {
    font-size: 30px;
    color: #050505;
    width: 100%;
    text-indent: 30px;
    background: #ffffff;
  }

  .stock_money_hint {
    padding: 0 14px 0 14px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
  }

  .buy_hint {

    flex-direction: column;
  }

  .buy_hint span:nth-child(2) {
    /*margin-top: 10px;*/
    font-size: 26px;
  }

  .stock_money_hint span {
    font-size: 24px;
    color: #2f2f2f;
  }

  .money_hint_left i {
    color: #e70012;
  }

  .money_hint_right i {
    color: #00e705;
  }

  .storehouse {
    display: flex;
    justify-content: space-between;
    margin: 24px 0 24px 0;
  }

  .storehouse div {
    height: 40px;
    width: 64px;
    border: 1px solid #d2d2d2;
    border-radius: 5px;
    text-align: center;
    line-height: 40px;
    font-size: 24px;
    color: #c7c7c7;
    background: #ffffff;
  }

  .storehouse .acstock {
    background: #e70012;
    color: #ffffff;
  }

  .stock_hint {
    font-size: 28px;
    color: #a1a1a1;
    padding: 0 0 0 10px;
    margin: 0 0 20px 0;
  }

  .stock_hint i {
    color: #3e3e3e;
  }

  .convert {
    width: 326px;
    height: 64px;
    border: 2px solid #d2d2d2;
    border-radius: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px 0 22px;
    font-size: 30px;
    margin-bottom: 40px;
    box-sizing: border-box;
    background: #ffffff;
  }

  .convert span {
    color: #a1a1a1;
  }

  .convert i {
    color: #3e3e3e;
  }

  .stock_buy_num {
    font-size: 26px;
    color: #a1a1a1;
    padding-left: 10px;

  }

  .apply_btn {
    width: 326px;
    height: 64px;
    line-height: 64px;
    text-align: center;
    color: #ffffff;
    font-size: 30px;
    border-radius: 40px;
    background: #e70012;
    margin-top: 20px;
    /*margin-bottom: 32px;*/
  }

  .sell_btn {
    background: blue;
  }

  .stock_right {
    display: flex;
    width: 280px;
    border-radius: 18px;
    border: 1px solid #d2d2d2;
    flex-direction: column;
    margin: 26px 0 0 0;
    padding: 0 14px 0 22px;
    background: #ffffff;
  }

  .stock_title {
    text-align: center;
    margin: 36px 0 30px 0;
    font-size: 26px;
    color: #050505;
  }

  .stock_title i {
    color: #e70012;
  }

  .stock_title span, strong {
    font-size: 24px;
    color: #4a4a4a;
  }

  .sell_item, .buy_item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    font-size: 24px;
  }

  .sell_item span:nth-child(1) {
    color: #00ff00;
    flex: 1;
  }

  .sell_item span:nth-child(2), .buy_item span:nth-child(2) {
    color: #050505;
    flex: 1;
  }

  .sell_item span:nth-child(3), .buy_item span:nth-child(3) {
    color: #a1a1a1;
    flex: 1;
  }

  .buy_item span:nth-child(1) {
    color: #e70012;
    flex: 1;
  }

  .buy {
    margin: 20px 0 0 0;
  }

  .stock_bottom {
    margin: 20px 0 0 0;
    border-top: 10px solid #dddddd;
  }

  .stock_bottom .checkd_tab {
    margin: 20px 50px 0 50px;
  }

  .stock_bottom .ac_img {
    background: #e70012;
    color: #ffffff;
  }

  .stock_img {
    margin: 20px 10px 0 10px;
  }

  .stock_img img {
    width: 100%;
    height: 300px;
  }

  .stock_img p {
    font-size: 24px;
    color: #9c9c9c;
    margin-top: 162px;
    text-align: center;
  }

  .buy_btn {
    background: blue;
  }

  .checkd_contract {
    display: flex;
    justify-content: space-between;
    height: 108px;
    align-items: center;
    background: #ffffee;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .contract_left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .contract_left span {
    font-size: 24px;
    color: #000000;
  }

  .contract_left i {
    color: #e70012;
  }

  .change_contract_btn {
    width: 154px;
    height: 54px;
    border-radius: 12px;
    background: #e70012;
    text-align: center;
    line-height: 54px;
    color: #ffffff;
    font-size: 30px;
  }

  input::-webkit-input-placeholder {
    font-size: 34px;
    color: #6b6b6b;
  }

  /* WebKit browsers */
  input:-moz-placeholder {
    font-size: 34px;
    color: #6b6b6b;
  }

  /* Mozilla Firefox 4 to 18 */
  input::-moz-placeholder {
    font-size: 34px;
    color: #6b6b6b;
  }

  /* Mozilla Firefox 19+ */
  input:-ms-input-placeholder {
    font-size: 34px;
    color: #6b6b6b;
  }

  .stock_bottom {
    background: #ffffff;
  }

  .filtrate {
    display: flex;
    margin: 0 30px;
    border-bottom: 1px solid #d2d2d2;
  }

  .filtrate div {
    display: flex;
    padding: 24px 0;
    font-size: 30px;
    color: #605e5e;
  }

  .filtrate .center {
    width: 300px;
    text-align: center;
    display: flex;
    justify-content: center;
  }

  .filtrate .left {
    width: 120px;
    display: flex;
    justify-content: center;
  }

  .list {
    margin: 0 30px;
    border-bottom: 1px solid #d2d2d2;
    display: flex;
    height: 130px;
    align-items: center;
    padding: 0 20px 0 0;
    background: #ffffff;
  }

  .list_left {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 120px;
  }

  .list_left span {
    font-size: 24px;
    color: #217ab1;
  }

  .list_left div {
    color: #605e5e;
    font-size: 30px;
    padding-bottom: 8px;
  }

  .list_center {
    width: 300px;
    font-size: 30px;
    color: #3e3e39;
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .list_right {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 30px;
  }

  .list_right span {
    color: #e70012;
  }

  .list_right i {
    display: block;
    width: 13px;
    height: 6px;
    margin: 0 5px 0 5px;
  }

  .right_top, .right_bottom {
    display: flex;
  }

  .remove_item {
    font-size: 30px;
    color: #333333;
    margin-left: 40px;
  }

  .add_txt {
    color: #e70012;
  }

  /*下降*/
  .decline_txt {
    color: #00e705;
  }

  .order_con {
    background: #ffffff;
    position: relative;
    border-radius: 10px;

  }

  .order_title {
    display: flex;
    justify-content: space-between;
    padding: 0 10px 0 19px;
    height: 64px;
    align-items: center;
    font-size: 30px;
    color: #000000;
    border-bottom: 1px solid #f7f7f7;
  }

  .order_title span {
    display: block;
    text-align: center;
  }

  .order_title span:nth-child(1) {
    width: 170px;
  }

  .order_title span:nth-child(2) {
    width: 280px;
  }

  .order_title span:nth-child(3) {
    width: 190px;
  }

  .order_item {
    display: flex;
    height: 112px;
    border-bottom: 1px solid #f7f7f7;
    align-items: center;
    font-size: 30px;
    margin: 0 30px 0 0;
    padding: 0 0 0 19px;
    justify-content: space-between;
  }

  .order_left {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 170px;
  }

  .order_left span {
    color: #3a3a3a;
  }

  .order_left div {
    font-size: 24px;
    color: #217ab1;
  }

  .order_cneter {
    color: #3a3a3a;
    display: flex;
    width: 280px;
    justify-content: center;
    text-align: center;
  }

  .list_item .new {
    color: #eb0505;
  }

  .order_right {
    display: flex;
    width: 190px;
  }

  .order_right .add_txt {
    color: #eb0505;
  }

  .order_right .drop_txt {
    color: #00ff00;
  }

  .sell_bottom {
    background: #f8f7f4;
    padding-bottom: 20px;
  }

  .list_item {
    border-radius: 10px;
    background: #ffffff;
    margin: 20px 20px 0 20px;

  }

  /*撤单*/
  .cancellations_con {
    padding-top: 45px;
  }

  .cancellations_list {
    margin: 0 25px;
    padding: 0 16px;
    background: #ffffff;
    box-shadow: 0 2px 1px 1px rgba(00, 00, 00, .2);
    border-radius: 10px;
  }

  .cancell_top {
    display: flex;
    justify-content: space-between;
    font-size: 26px;
  }

  .cancellations_time {
    padding-top: 20px;
    font-size: 30px;
    color: #414141;
    display: flex;
    margin-bottom: 10px;
  }

  .cancellations_time i {
    padding: 0 10px;
  }

  .cancellations_btn {
    width: 120px;
    height: 60px;
    margin: 20px 0 0 0;
    text-align: center;
    border-radius: 40px;
    color: #ffffff;
    line-height: 60px;
    font-size: 32px;
    background: #e70012;
  }

  .cancell_name, .cancell_money, .cancell_bottom div {
    font-size: 26px;
    color: #414141;
    margin: 0 0 10px 0;
  }

  .cancell_name span, .cancell_money span, .cancell_bottom span {
    color: #a3a3a3;
  }

  .cancell_bottom {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .cancell_status {
    font-size: 30px;
    color: #a3a3a3;
    margin-top: 24px;
  }

  /*交易记录*/
  .record_con {
    background: #ffffff;
  }

  .record_list {
    height: 98px;
    display: flex;
    justify-content: space-between;
    margin: 0 25px;
    padding: 0 35px 0 16px;
    font-size: 36px;
    color: #8f8f8f;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
  }

  .record_list i {
    display: block;
    width: 21px;
    height: 38px;
    background: url("../../assets/img/contract_more.png") no-repeat;
    background-size: contain;
  }

  .search_stock {
    position: absolute;
    top: 120px;
    /*bottom: 0;*/
    width: 100%;
    background: #ffffff;
    box-sizing: border-box;
    z-index: 100;
    height: 560px;
    overflow-y: auto;

  }

  .search_stock .search_list {
    height: 80px;
    border-bottom: 1px solid #d2d2d2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 100px;
    font-size: 34px;
    color: #000000;
    box-sizing: border-box;
  }
  .search_list div {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .search_list i {
    font-size: 26px;
    color: #eb0505;
  }

  .not_search {
    text-align: center;
  }

  .not_search img {
    width: 166px;
    margin: 80px 0 0 0;
  }

  .not_search p {
    margin: 10px 0 0 0;
    font-size: 36px;
    color: #aaaaaa;
  }

  .ico_success {
    display: block;
    width: 65px;
    height: 65px;
    background: url("../../assets/img/success_ico.png") no-repeat center;
    background-size: contain;
    margin-bottom: 32px;
  }

  .btn_sure {
    width: 326px;
    height: 64px;
    background: #e70012;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 40px;
    margin-top: 20px;
  }
  .btn_sure i{
    display: block;
    width: 50px;
    height: 50px ;
    background: url("../../assets/img/btn_ico.gif") no-repeat center;
    background-size: contain;
  }
  .btn_sure2 {
    width: 326px;
    height: 64px;
    background: blue;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 40px;
    margin-top: 20px;
  }

  .btn_sure2 i{
    display: block;
    width: 50px;
    height: 50px ;
    background: url("../../assets/img/btn_ico2.gif") no-repeat center;
    background-size: contain;
  }

  .stock_name input::-webkit-input-placeholder {
    font-size: 34px;
    color: #000000;
  }

  /* WebKit browsers */
  i.stock_name input:-moz-placeholder {
    font-size: 34px;
    color: #6b6b6b;
  }

  /* Mozilla Firefox 4 to 18 */
  .stock_name input::-moz-placeholder {
    font-size: 34px;
    color: #6b6b6b;
  }

  /* Mozilla Firefox 19+ */
  .stock_name input:-ms-input-placeholder {
    font-size: 34px;
    color: #6b6b6b;
  }

  /*不可点击的股票*/

  .not_stock {
    background: #d2d2d2;
    /*color: #ffffff !important;*/
  }
</style>
