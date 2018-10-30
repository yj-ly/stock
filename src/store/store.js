import Vue from 'vue';
import Vuex from 'vuex';
import {getUserInfo} from '../api/user'
import {contract} from '../api'
Vue.use(Vuex);
let store = new Vuex.Store({
  // 1. state  用于存放数据
  state:{
    userMessage:{
      name:'', //用户信息
      totalMoney:'', //总资金
      strategyMoney:'', //策略资金
      usableMoney:'', //可用策略资金
      marketMoney:'',  //持仓总市值
      cashMoney:'',     //余额
    },
    contractList:[], //策略列表
    loadingBoole:true,
  },

  // 2. getters  获取state中的数据
  getters:{
    // 参数列表state指的是state数据
    getCityFn(state){
      return state.city;
    }
  },
  // 3. actions
  // 通常跟api接口打交道
  actions:{
    // 设置城市信息
    // 参数列表：{commit, state}
    // state指的是state数据
    // commit调用mutations的方法
    // name就是调用此方法时要传的参数
    getUserInfo({commit,state}){
      getUserInfo().then(res => {
        if(res.data.status == 0){
          commit("setUserinfo",res.data.data.userinfo);
        }
      })

    },
    /** 14:07
     *   @author: yuanjie
     *   @description:获取策略
     *   @param
     */
    getContract({commit,state}){
      contract().then(res => {
        if(res.data.status == 0){
         commit('setContract',res.data.data);
        }
      })
    },
  },
  // 4. mutations
  mutations:{
    // state指的是state的数据
    // name传递过来的数据

    setUserinfo(state, data){
      state.userMessage = data;//将传参设置给state的city
    },

    //设置方案
    setContract(state,data){
      state.contractList = data;
    },
    //close关闭loading
    closeLoading(state){
      // console.log('触发closeLoading');
      state.loadingBoole = false;
    },
    //打开loading
    openLoading(state){
      // console.log('触发openLoading');
      state.loadingBoole = true;
    }


  }
});

export default store;
