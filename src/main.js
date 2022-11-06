import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './utils/axios'
import './assets/css/font.css'
import echarts from './utils/echarts'
import './assets/css/global.less';
import ws from './utils/socket'

createApp(App).use(store).use(axios).use(echarts).use(router).use(ws).mount('#app')
