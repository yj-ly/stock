import store from '../store/store.js'
import router from '../router/index'
import axios from 'axios'
import $ from 'jquery'
import Qs from 'qs'
import {getLocalToken} from '../libs/service'

/*110002*/


// 生产地址
// const apiUrl = 'http://www.grs666.com/api/v1/'

// 测试环境
// const apiUrl = 'http://demo.grs666.com/api/v1/'

//本地
const apiUrl = 'http://192.168.0.99/api/v1/'

var instance = axios.create({
  method: 'get',
  baseURL: apiUrl,
  transformRequest: [function (data) {
    // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
    // data = Qs.stringify(data)
    return data
  }],
  transformResponse: [function (data) {
    // 这里提前处理返回结果
    return data
  }],
  // 请求头信息
  headers: {
    'Authorization': 'Bearer ' + getLocalToken()
  },
  // 参数
  params: {
    source: 'wap',
    fromType: "sotck",
    // api_token: getLocalToken()
  },

  paramsSerializer: function (params) {
    return Qs.stringify(params, {
      arrayFormat: 'brackets'
    })
  },
  // 设置超时时间
  timeout: 5000,

  // 返回数据类型
  responseType: 'json'
})

//请求拦截器
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


//返回拦截器
instance.interceptors.response.use(function (response) {
  let _res = response
  if (_res.data.status != 0) {
    if (_res.data.data != null) {
      if (_res.data.data.code == 20000) {

        localStorage.removeItem('userInfo')
        // window.location.replace('http://' + window.location.host + '/h5/#' + '/login');
        // window.location.replace('http://' + window.location.host + '/#' + '/login');
        router.push('/login');
      }
      if (_res.data.data.code == 10021) {
        // window.location.replace('http://' + window.location.host + '/h5/#' + '/autonym');
        router.push('/autonym');
      }
    }
  }
  return _res
}, function (err) {
  var error = err.toString();
  if(!navigator.onLine){
    store.commit('closeLoading');
    let oDiv = document.createElement('div');
    oDiv.className = 'netWork_not';
    oDiv.innerHTML = '网络走丢了!';
    document.body.appendChild(oDiv);
    $('.netWork_not').fadeIn(1000);
    setTimeout(() => {
      $('.netWork_not').fadeOut(1000);
      document.body.removeChild(oDiv);
    },3000)
  }

  if(error == 'Error: timeout of 5000ms exceeded' ){

    store.commit('closeLoading');
    let oDiv = document.createElement('div');
    oDiv.className = 'netWork_not';
    oDiv.innerHTML = '网络连接超时!';
    document.body.appendChild(oDiv);
    $('.netWork_not').fadeIn(1000);
    setTimeout(() => {
      $('.netWork_not').fadeOut(1000);
      document.body.removeChild(oDiv);
    },3000)
  }

  return Promise.reject(err)
});
export default instance

