import axios from './axios-set'
import Qs from 'qs'


//登录
export const login = function (data) {
  return axios.post('user/login',Qs.stringify(data))
}
//注册
export const regiSter = function (data) {
  return axios.post('user/register',Qs.stringify(data))
}

//拉取短信接口
export const getCode = function (data) {
  return axios.post('user/sendcode',Qs.stringify(data))
}
