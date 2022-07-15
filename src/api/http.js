import axios from "axios";
import qs from 'qs';
import { isPlainObject } from '@/assets/utils';
import { Notify } from 'vant';
import md5 from 'blueimp-md5'
axios.defaults.baseURL = '';
axios.defaults.timeout = 60000;
axios.defaults.transformRequest = data => {
  if (isPlainObject(data)) return qs.stringify(data);
  return data;
};
axios.interceptors.request.use(config => {
  // 针对需要token的接口注入token和sign(token + timestamp)
  let apiList = ['/check_login', '/user_info', '/user_update', '/store', '/store_remove', '/store_list']
  let token = localStorage.getItem('token')
  // 对应接口并且已有token的话，封装请求头部
  if (apiList.includes(config.url.replace('/api', '')) && token) {
    let time = +new Date()
    // 生成sign: token@time@zhufeng
    let sign = md5(`${token}@${time}@zhufeng`)
    // 注入配置: timestamp
    config.headers['authorization'] = token
    config.headers['time'] = time
    config.headers['sign'] = sign
  }

  return config;
})

axios.interceptors.response.use(response => {
  return response.data;
}, reason => {
  Notify({
    type: 'danger',
    message: '小主,当前网络繁忙,请稍后再试!'
  });
  return Promise.reject(reason);
})

export default axios;