import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import(/* webpackChunkName: "others" */ '../views/Detail.vue')
  },
  {
    path: '/updateperson',
    name: 'updatePerson',
    component: () => import(/* webpackChunkName: "others" */ '../views/UpdatePerson.vue')
  },
  {
    path: '/person',
    name: 'Person',
    component: () => import(/* webpackChunkName: "others" */ '../views/Person.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "others" */ '../views/Login.vue')
  },
  {
    path: '/favourite',
    name: 'Favourite',
    component: () => import(/* webpackChunkName: "others" */ '../views/Favourite.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default routes