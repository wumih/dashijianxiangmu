import { createApp } from 'vue'
import pinia from '@/stores'

// 1. 必须确保你的 assets 文件夹里真的有 main.scss 这个文件
//    如果没有，项目启动会直接报错找不到文件
import '@/assets/main.scss'

import App from './App.vue'
import router from './router'
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
