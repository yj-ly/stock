import axios from './axios-set'
import Qs from 'qs'

//获取策略方案
export const getScheme = function (data) {
    return axios.post('customer/getcontractproduct',Qs.stringify(data)) //
}
//创建策略
export const createScheme = function (data) {
  return axios.post('customer/buycontract',Qs.stringify(data))
}
//获取平仓线费率
export const getRate = function (data) {
  return axios.post('customer/getcustomerrisk',Qs.stringify(data))
}
//获取策略
export const contract = function (data) {
  return axios.post('customer/getcontract',Qs.stringify(data))
}
//获取股票
export const getStockList = function (data) {
  return axios.post('common/stock/lists',Qs.stringify(data))
}
//股票持仓
export const takePosition = function (data) {
  return axios.post('order/list',Qs.stringify(data))
}
//持仓详情
export const positionDetail = function (data) {
  return axios.post('order',Qs.stringify(data))
}
//买股票
export const buyStock = function (data) {
  return axios.post('order/entrust/buy',Qs.stringify(data))
}
//卖股票
export const sellStock = function (data) {
  return axios.post('order/entrust/sell',Qs.stringify(data))
}
//撤单
export const removeOrder = function (data) {
  return axios.post('order/entrust/cancel',Qs.stringify(data))
}

//股票详情
export const stockDetail = function (data) {
  return axios.post('common/stock/market',Qs.stringify(data))
}

//追加策略金和保证金
export const addPromiseMoney  = function (data) {
  return axios.post('customer/add',Qs.stringify(data))
}
//获取追加策略金和保证金的参数
export const getPromiseMsg  = function (data) {
  return axios.post('customer/getcontractcs',Qs.stringify(data))
}
//终止策略
export const overContract  = function (data) {
  return axios.post('customer/stop',Qs.stringify(data))
}
//获取策略流水
export const getContractWater  = function (data) {
  return axios.post('customer/getcontractrecords',Qs.stringify(data))
}






