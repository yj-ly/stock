import Vue from 'vue'
import Router from 'vue-router'
import {getLocalDisInfo,getLocalToken} from '../libs/service'
Vue.use(Router)


const router = new Router({
  // mode:'history',
  routes: [
    {
      path:'/',
      // name: 'homeIndex',
      component: resolve => require(['../page/home/homeIndex'],resolve),  //默认的首页
      redirect:'/homeIndex'
    },
    {
      path:'/homeIndex',
      name: 'homeIndex',
      component: resolve => require(['../page/home/homeIndex'],resolve)  //首页
    },
    {
      path:'/optional',
      name: 'optional',
      component: resolve => require(['../page/optional/optional'],resolve)//自选模块
    },
    {
      path:'/stockSearch',
      name: 'stockSearch',
      component: resolve => require(['../page/optional/stockSearch'],resolve)//股票搜索
    },
    {
      path: '/myIndex',
      name: 'myIndex',
      component: resolve => require(['../page/my/myIndex'],resolve)//我的模块
    },
    {
      path: '/about/:typeNum',
      name: 'about',
      component: resolve => require(['../page/my/about'],resolve)//关于我们
    },
    {
      path: '/waterDetail/:id',
      name: 'waterDetail',
      component: resolve => require(['../page/my/waterDetail'],resolve)//流水详情
    },
    {
      path: '/message',
      name: 'message',
      component: resolve => require(['../page/message/message'],resolve)  //消息模块
    },
    {
      path: '/messageDetail/:id',
      name: 'messageDetail',
      component: resolve => require(['../page/message/messageDetail'],resolve)  //消息详情
    },
    {
      path: '/login',
      name: 'login',
      component:resolve => require(['../page/login/login'],resolve)  //登录
    },
    {
      path: '/forgetPwd',
      name: 'forgetPwd',
      component:resolve => require(['../page/login/forgetPwd'],resolve)  //忘记密码
    },
    {
      path: '/myBank',
      name: 'myBank',
      component:resolve => require(['../page/my/myBank'],resolve)  //我的银行卡
    },
    {
      path: '/rechargeMoney',
      name: 'rechargeMoney',
      component:resolve => require(['../page/my/rechargeMoney'],resolve)  //充值
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component:resolve => require(['../page/my/withdraw'],resolve)  //提现
    },
    {
      path: '/addBank',
      name: 'addBank',
      component:resolve => require(['../page/my/addBank'],resolve)  //添加银行卡
    },
    {
      path: '/autonym',
      name: 'autonym',
      component:resolve => require(['../page/my/autonym'],resolve)  //实名认证
    },
    {
      path: '/passwordChange',
      name: 'passwordChange',
      component:resolve => require(['../page/my/passwordChange'],resolve)  //密码修改
    },
    {
      path: '/moneyDetail',
      name: 'moneyDetail',
      component:resolve => require(['../page/my/moneyDetail'],resolve)  //资金明细
    },
    {
      path: '/unbundleDetail/:id',
      name: 'unbundleDetail',
      component:resolve => require(['../page/my/unbundleDetail'],resolve)  //解绑
    },
    {
      path: '/dayStrategy/:schemId',
      name: 'dayStrategy',
      component:resolve => require(['../page/home/dayStrategy'],resolve),  //按天策略

    },
    {
      path: '/monthStrategy',
      name: 'monthStrategy',
      component:resolve => require(['../page/home/monthStrategy'],resolve),  //按月策略
    },
    {
      path: '/apply',
      name: 'apply',
      component:resolve => require(['../page/home/apply'],resolve),  //支付
    },
    {
      path: '/stockDeal',
      name: 'stockDeal',
      component:resolve => require(['../page/home/stockDeal'],resolve),  //股票交易
    },
    {
      path: '/positions',
      name: 'positions',
      component:resolve => require(['../page/home/positions'],resolve),  //我的持仓
    },
    {
      path: '/myStock',
      name: 'myStock',
      component:resolve => require(['../page/home/myStock'],resolve),  //卖出股票的时候选择股票
    },
    {
      path: '/entrust',
      name: 'entrust',
      component:resolve => require(['../page/home/entrust'],resolve),  //我的委托
    },
    {
      path: '/contract',
      name: 'contract',
      component:resolve => require(['../page/home/contract'],resolve),  //我的策略
    },
    {
      path: '/changeContract',
      name: 'changeContract',
      component:resolve => require(['../page/home/changeContract'],resolve),  //策略切换
    },
    {
      path: '/positionDetails/:id',
      name: 'positionDetails',
      component:resolve => require(['../page/home/positionDetails'],resolve),  //我的策略详情
    },
    {
      path: '/wateRcourse/:id',
      name: 'wateRcourse',
      component:resolve => require(['../page/home/wateRcourse'],resolve),  //我的流水
    },
    {
      path: '/stockOrder/:id',
      name: 'stockOrder',
      component:resolve => require(['../page/home/stockOrder'],resolve),  //订单详情
    },
    {
      path: '/stockDetail/:id',
      name: 'stockDetail',
      component:resolve => require(['../page/home/stockDetail'],resolve),  //股票详情
    },
    {
      path: '/regiSter',
      name: 'regiSter',
      component:resolve => require(['../page/login/regiSter'],resolve),  //注册
    },
    {
      path: '/stockScheme',
      name: 'stockScheme',
      component:resolve => require(['../page/home/stockScheme'],resolve),  //选择策略方案
    },
    {
      path: '/promiseMoney/:typeNum/:contractNo',
      name: 'promiseMoney',
      component:resolve => require(['../page/home/promiseMoney'],resolve),  //追加策略金/保证金
    },
    {
      path: '/protectMoney/:typeNum/:no',
      name: 'protectMoney',
      component:resolve => require(['../page/home/protectMoney'],resolve),  //补保/取保
    },
    {
      path: '/cancelOrder/:typeNum',
      name: 'cancelOrder',
      component:resolve => require(['../page/home/cancelOrder'],resolve),  //撤单
    },
    {
      path: '/download',
      name: 'download',
      component:resolve => require(['../page/download/download'],resolve),  //下载页面
    },
    {
      path: '/success',
      name: 'success',
      component:resolve => require(['../page/my/success'],resolve),  //支付成功
    }

  ]
})
router.beforeEach((to, from, next) => {
    // console.log('路由导航守卫触发');
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  // console.log(router.history.current)
  // console.log(router.history.current.fullPath);
  const nextRoute = [ 'login', 'regiSter','forgetPwd','about','download'];
  // console.log('触发路由' + to.name);
  if(nextRoute.indexOf(to.name) > -1){

      next();
  }else{
    if(getLocalDisInfo() == null){
      localStorage.setItem('localUrl',router.history.current.fullPath);
      router.push({name:'login'});
      // next();
    }else{

      // if(router.history.current.fullPath == '/login' || router.history.current.fullPath == '/regiSter'  || router.history.current.fullPath == '/forgetPwd' ){
      //   console.log('进入返回url');
      //   router.push({name:'homeIndex'});
      // }else{
      //   next();
      // }
      next();
    }
  }

})

export default router;
