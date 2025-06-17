import { createApp } from 'vue'
import './app/global.scss'
import App from './app/App.vue'
import { router } from './app/providers/router'

createApp(App).use(router).mount('#app')
