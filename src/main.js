import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 1. 必须确保你的 assets 文件夹里真的有 main.scss 这个文件
//    如果没有，项目启动会直接报错找不到文件
import '@/assets/main.css'

import App from './App.vue'
import router from './router'
import persist from 'pinia-plugin-persistedstate'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
app.use(createPinia().use(persist))
// createPinia() 创建了仓库实例
// .use(persist)  给这个仓库装上了“持久化”的外挂
app.use(createPinia().use(persist))
