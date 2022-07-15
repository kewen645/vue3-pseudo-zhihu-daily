import axios from "./http";

// GET请求需要params关键字，POST不需要
export default {
  //获取今日新闻
  queryNewsLatest() {
    return axios.get('/api/news_latest')
  },
  // 获取往日新闻
  queryNewsBefore(time) {
    return axios.get('/api/news_before', { params: { time } })
  },
  // 获取详情页数据
  queryNewsInfo(id) {
    return axios.get('/api/news_info', { params: { id } })
  },
  // 获取点赞, 评论信息
  queryStoryExtra(id) {
    return axios.get('/api/story_extra', { params: { id } })
  },
  // 用户登录
  login(phone, code) {
    return axios.post('/api/login', { phone, code })
  },
  //获取手机验证码
  getPhoneCode(phone) {
    return axios.post('/api/phone_code', { phone })
  },
  // ------------ 以上都不需要携带token -------------
  // 检测是否登录
  checkLogin() {
    return axios.get('/api/check_login')
  },
  // 获取登录用户信息
  getUserInfo() {
    return axios.get('/api/user_info')
  },
  // 修改用户名和头像
  updateUser(username, file) {
    let fm = new FormData();
    fm.append("name", username);
    fm.append("file", file);
    return axios.post('/api/user_update', fm);
  },
  // 添加收藏
  addFavour(newsId) {
    return axios.post('/api/store', { newsId })
  },
  // 移除收藏 (这里的id是收藏item的id，不是新闻news自身的id，别混淆了)
  removeFavour(id) {
    return axios.get('/api/store_remove', { params: { id } })
  },
  // 获取登录用户收藏信息
  getFavourList() {
    return axios.get('/api/store_list')
  }
}