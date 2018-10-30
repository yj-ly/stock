// import {getPayInfo} from 'api'


//获取登录信息
export function getLocalDisInfo() {
  let info = localStorage.getItem('userInfo')
  return info === null ? null : toJson(info)
}

//转换为可执行的代码
export function toJson(str) {
  return eval('(' + str + ')')
}

//获取本地token
export function getLocalToken() {
  let userInfo = getLocalDisInfo();
  return userInfo === null ? null : userInfo;
}

//判断用户是否是第一次登录
//获取登录信息
export function firstLogin() {
  let info = localStorage.getItem('newUser');
  return info === null ? null : toJson(info)
}
