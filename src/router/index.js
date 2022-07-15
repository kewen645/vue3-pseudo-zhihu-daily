import { createRouter, createWebHashHistory } from "vue-router"
import routes from './routes'
import store from '@/store'
import api from '@/api'
import { Toast } from 'vant'

const router = createRouter(
  {
    history: createWebHashHistory(),
    routes
  }
)

// 路由前置守卫决定是否跳转，/person, /updateperson, /favourite都只能在登录后进入
// 若果未登录，则进入/login进行登录
router.beforeEach(async (to, from, next) => {
  let arr = ['/person', '/updateperson', '/favourite']
  if (arr.includes(to.path)) {
    // 检验是否已经登录
    let isLogin = store.state.isLogin
    // 已经登录
    if (isLogin) {
      next()
      return
    }
    // 未登录
    if (isLogin === false) {
      Toast('You need to log in.')
      next('/login')
      return
    }
    // 不确定登录与否
    if (isLogin === null) {
      // 不能在这里dispatch，因为尽管成功dispatch后，并且也改了isLogin状态
      // 这里也无从确定是否已经登录
      // 这里需要单纯调用api来确认是否已经登录
      try {
        let { code, data } = await api.checkLogin()
        // 如果未登录，跳到登录页面
        if (+code !== 0) {
          Toast('You need to log in.')
          next('/login')
          return
        }
        // 如果已经登录，直接更新登录状态和用户信息并且跳转相应页面
        store.commit('changeIsLogin', true)
        store.commit('changeInfo', data)
        next()
        return
      } catch (error) {
        console.log(error);
      }
    }
  }
  next()
})

export default router