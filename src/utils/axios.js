import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/';
export default {
    install(app){
        app.config.globalProperties.$axios = axios;
    }
}