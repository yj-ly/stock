import axios from './axios-set'
import Qs from 'qs'

//获取用户信息
export const getUserInfo = function (data) {
    return axios.post('customer/getinfo',Qs.stringify(data));
}

//实名认证
export const autonym = function (data) {
  return axios.post('customer/userrealcheck',Qs.stringify(data));
}

//判断用户是否实名认证过
export const judgeAutonym = function (data) {
  return axios.post('customer/getrealinfo',Qs.stringify(data));
}
//解绑
export const unbundle = function (data) {
  return axios.post('customer/delbank',Qs.stringify(data));
}

//忘记密码
export const passwordChange = function (data) {
  return axios.post('user/updatepassword',Qs.stringify(data));
}

//修改密码
export const forgetPwdChange = function (data) {
  return axios.post('customer/updatepassword',Qs.stringify(data));
}

//充值
export const recharge = function (data) {
  return axios.post('customer/rechargemoney',Qs.stringify(data));
}
//提现
export const withdraw = function (data) {
  return axios.post('customer/withdraw',Qs.stringify(data));
}

//获取提现手续费
export const serviceMoney = function (data) {
  return axios.post('customer/withdrawcharge',Qs.stringify(data));
}

//获取用户在我的页面金额
export const getUserMoney = function (data) {
  return axios.post('customer/getstockinfo',Qs.stringify(data));
}
//获取资金流水
export const getUserWater = function (data) {
  return axios.post('customer/getwalletrecord',Qs.stringify(data));
}
//委托-列表-今日委托与成效
export const getTaday = function (data) {
  return axios.post('order/entrust/today',Qs.stringify(data));
}
//委托-列表-历史委托与成效
export const getHistory = function (data) {
  return axios.post('order/entrust/history',Qs.stringify(data));
}
//资金列表
export const moneyList = function (data) {
  return axios.post('order/payment/list',Qs.stringify(data));
}
//补保和取保数据
export const coverPromise = function (data) {
  return axios.post('order/margin',Qs.stringify(data));
}

//补保和取保提交
export const promiseBtn = function (data) {
  return axios.post('order/marginStore',Qs.stringify(data));
}

//撤单
export const cancelOrder  = function (data) {
  return axios.post('order/entrust/cancel',Qs.stringify(data))
}

//可买
export const canBuy  = function (data) {
  return axios.post('order/buyable',Qs.stringify(data))
}
//我的自选
export const myOptional  = function (data) {
  return axios.post('customer/collect/lists',Qs.stringify(data))
}
//添加自选
export const addOptional  = function (data) {
  return axios.post('customer/collect/create',Qs.stringify(data))
}
//删除自选
export const removeOptional  = function (data) {
  return axios.post('customer/collect/destroy',Qs.stringify(data))
}
//热门自选
export const hotOptional  = function (data) {
  return axios.post('customer/collect/hot',Qs.stringify(data))
}

//消息列表
export const msgList  = function (data) {
  return axios.post('customer/notice/lists',Qs.stringify(data))
}
//消息详情
export const msgDetail  = function (data) {
  return axios.post('customer/notice/show',Qs.stringify(data))
}
//关于我们
export const about  = function (data) {
  return axios.post('common/agreement/lists',Qs.stringify(data))
}
//指数接口
export const exponent  = function (data) {
  return axios.post('common/stock/indexs',Qs.stringify(data))
}
