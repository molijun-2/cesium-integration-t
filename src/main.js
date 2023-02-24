import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './router/index'

// 适配
import '@/libs/utils/autoSelf.js'

const app = createApp(App)

app.use(router)

app.mount('#app')
