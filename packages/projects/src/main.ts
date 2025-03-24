import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import NotFoundComponent from './components/NotFound.vue'
import HomeView from './views/home/Home.vue'
import YuQueView from './views/yuque/YuQue.vue'
import 'tailwindcss/index.css'
import './style.scss'

const routes = [
  { path: '/', component: YuQueView },
  { path: '/yuque', component: YuQueView },
  { path: '/:pathMatch(.*)', component: NotFoundComponent },
]

const router = createRouter({
  history: createWebHistory('/tiny-editor/projects'),
  routes,
})

router.addRoute({ path: '/', component: HomeView })

createApp(App).use(router).mount('#app')
