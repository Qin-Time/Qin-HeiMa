import '@/styles/common.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 引入懒加载指令插件
import { lazyPlugin } from '@/directives'


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
app.use(lazyPlugin)

