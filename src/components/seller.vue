<template>
  <div class="seller">
      <div class="echart" ref="echarts"></div>
  </div>
</template>

<script>
import roma from 'echarts/theme/roma'

export default {
    data(){
        return {
            chartInstance:null,
            allData:[],
            totalPage:0,
            currentPage:1,
            timerId:null
        }
    },
    methods:{
        initChart(){
           this.chartInstance = this.$echarts.init(this.$refs['echarts'], roma);
           let initOption = {
               title:{
                    text:'▎商家销售统计',
                    textStyle:{
                        fontSize:66,
                    },
                    left:20,
                    top:20,
                },
                tooltip:{
                    trigger:'axis',
                    axisPointer:{
                        type:'line',
                        z:0,
                        lineStyle:{
                            width:66,
                            color:'#2d3443'
                        }
                    }
                },
                grid:{
                    top:"20%",
                    right:"6%",
                    left:"3%",
                    bottom:'3%',
                    containLabel:true,
                },
                xAxis:{
                    type:"value"
                },
                yAxis:{
                    type:'category',
                },
                series:[{
                    type:'bar',
                    barWidth:66,
                    label:{
                        show:true,
                        position:'right',
                        
                        color:'#fff',
                        
                    },
                    itemStyle:{
                        borderRadius:[0, 33,33,0],
                        color:new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            {
                                offset:0,
                                color:'#505211'
                            },{
                                offset:1,
                                color:'#ab6EE5'
                            }
                        ])
                    }
                }]
           };
            this.chartInstance.setOption(initOption);
           this.chartInstance.on('mouseover', () => {
               clearInterval(this.timerId);
           });
           this.chartInstance.on('mouseout', () => {
               this.startInterval();
           });
        },
        getData(){
            this.$axios.get('seller').then(res => {
                console.log(res)
                this.allData = res.data;
                this.allData.sort((a, b) => {
                    return b.value -a.value;
                });
                this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1;
                  this.startInterval();
            });
                this.updateChart();
               
               
        },
        updateChart(){
            let start = (this.currentPage - 1) * 5;
            let end = this.currentPage * 5;
            let showData = this.allData.slice(start, end);
            let sellerName = showData.map((item) => {
                return item.name;
            });
            let sellerValues = showData.map((item) => {
                return item.value;
            });
            let option = {
                title:{
                    text:'▎商家销售统计',
                    textStyle:{
                        fontSize:66,
                    },
                    left:20,
                    top:20,
                },
                tooltip:{
                    trigger:'axis',
                    axisPointer:{
                        // type:'line',
                        z:2,
                        lineStyle:{
                            width:66,
                            color:'#2d3443',
                        }
                    }
                },
                grid:{
                    top:"20%",
                    right:"6%",
                    left:"3%",
                    bottom:'3%',
                    containLabel:true,
                },
                yAxis:{
                    data:sellerName
                },
                series:[{
                    type:'bar',
                    data:sellerValues,
                    barWidth:66,
                    label:{
                        show:true,
                        position:'right',
                        color:'#ccc',
                    },
                    itemStyle:{
                        borderRadius:[0, 33,33,0],
                        color:new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            {
                                offset:0,
                                color:'#505211'
                            },{
                                offset:1,
                                color:'#ab6EE5'
                            }
                        ])
                    }
                }]
            };
            this.chartInstance.setOption(option)
        },
        startInterval(){
            clearInterval(this.timerId);
            this.timerId = setInterval(() => {
                this.currentPage++;
                if(this.currentPage >= this.totalPage){
                    this.currentPage = 1;
                }
                this.updateChart();
            }, 3000)
        },
        createAdopter(){
            let titleFontSize = this.$refs['echarts'].offsetWidth / 100 * 3.6;
            let adopterOption = {
                title:{
                    textStyle:{
                        fontSize:titleFontSize,
                    },
                },
                tooltip:{
                    axisPointer:{
                        lineStyle:{
                            width:titleFontSize,
                        }
                    }
                },
                series:[{
                    barWidth:titleFontSize,
                    itemStyle:{
                        borderRadius:[0, titleFontSize / 2,titleFontSize / 2,0],
                    }
                }]
            }
            this.chartInstance.setOption(adopterOption);
            this.chartInstance.resize();
        }
    },
    mounted(){
        this.initChart();
        this.getData();
        window.addEventListener('resize', this.createAdopter)
        this.createAdopter();
    },
    unmounted(){
        clearInterval(this.timerId);
        window.removeEventListener('resize', this.createAdopter)
    }
}
</script>

<style lang='less'>
</style>