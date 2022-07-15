import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/reset.min.css'
import 'amfe-flexible'
import {
  Swipe, SwipeItem, Divider,
  Skeleton, Lazyload, Loading,
  Icon, Button, Form, Field,
  CellGroup, NavBar, Cell,
  Uploader, SwipeCell, Empty
} from 'vant'

// 处理最大宽度
import { handleMaxWidth } from './assets/utils'
handleMaxWidth()
window.addEventListener('resize', handleMaxWidth)

const app = createApp(App)
app.use(store).use(router)
app.use(Swipe).use(SwipeItem)
  .use(Divider).use(Skeleton)
  .use(Lazyload).use(Loading)
  .use(Icon).use(Button)
  .use(Field).use(CellGroup)
  .use(NavBar).use(Form)
  .use(Cell).use(Uploader)
  .use(SwipeCell).use(Empty)

app.mount('#app')
