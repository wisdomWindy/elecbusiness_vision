import * as echarts from 'echarts'
export default {
    install(app){
        app.config.globalProperties.$echarts = echarts;
    }
}