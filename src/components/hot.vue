<template>
  <div class="hot">
    <div class="echarts" ref="echarts"></div>
    <span class="left-arrow" @click="left" :style="comStyle"><</span>
    <span class='right-class' @click='right' :style="comStyle">></span>
    <span class="cat-name" :style="comStyle">{{catName}}</span>
  </div>
</template>

<script>
import roma from "echarts/theme/roma";
export default {
  data:{
    chartInstance:null,
    currentIndex:0,
    allData:null,
    titleFontSize:0,
  },
  computed:{
    catName(){
      if(!this.allData){
        return '';
      } else {
        return thia.allData[this.currentIndex].name;
      }
    },
    comStyle(){
      return {
        fontSize:this.titleFontSize + 'px',
      }
    }
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs["echarts"], roma);
      let initOption = {
        title:{
          text:'▎热销商品的占比统计',
        },
        legend:{
          top:'15%',
          icon:'circle',
        },
        tooltip:{
          show:true,
          formatter:(arg) => {
            thirdCategory = arg.data.children;
            let total = 0;
            thirdCategory.forEach((item) => {
              total += item.value;
            });
            let retStr = ""
            thirdCategory.forEach((item) => {
              retStr += `${item.name}:${parseInt(item.value / total * 100)} + %</br>`
            });
            return retStr; 
          }
        },
        series:{
          type:'pie',
          label:{
            show:false,
          },
          emphasis:{
            label:{
              show:true,
            }
          }
        }
      };
      this.chartInstance.setOption(initOption);
    },
    getData() {
      this.$axios.get("hotproduct").then((res) => {
        console.log(res);
        this.allData = res.data;

        
        this.updateChart();
      });
    },
    updateChart() {
      
        let seriesData= this.allData[this.currentIndex].children.map((item) =>{
            return {
                name:item.name,
                value:item.value,
                children:item.children,
            }
        });
        let legendArr = this.allData[this.currentIndex].children.map(item => {
            return item.name;
        });
      let dataOption = {
          legend:{
              data:legendArr,
          },
        series:[
            {
                data:seriesData,
            }
        ]
      };
      this.chartInstance.setOption(dataOption);
    },
    createAdopter() {
      this.titleFontSize = (this.$refs["echarts"].offsetWidth / 100) * 3.6;
      let adopterOption = {
        title:{
          textStyle:{
            fontSize:this.titleFontSize,
          }
        },
        legend:{
          itemWidth: this.titleFontSize / 2,
          itemHeight:this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle:{
            fontSize:this.titleFontSize / 2,
          }
        },
        series:[{
          radius:this.titleFontSize * 4.5,
          center:['50%', '60%'],
        }],
      };
      this.chartInstance.setOption(adopterOption);
      this.chartInstance.resize();
    },
    left(){
      if(this.currentIndex > 0){
        this.currentIndex--;
        
      } else{
        this.currentIndex = 0;
      }
      this.updateChart();
    },
    right(){
      if(this.currentIndex < this.allData.length) {
        this.currentIndex++;
        
      } else {
        this.currentIndex = this.allData.length - 1;
      }
      this.updateChart();
    }
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.createAdopter);
    this.createAdopter();
  },
  unmounted() {
    window.removeEventListener("resize", this.createAdopter);
    clearInterval(this.timer);
  },
};
</script>

<style lang='less' scoped>
.hot{
  position: relative;
}
.left-arrow{
  position: absolute;
  left:0;
    top:50%;
  transform: translateY(-50%);
}
.right-arrow{
  position: absolute;
  right:0;
  top:50%;
  transform: translateY(-50%);
}
.cat-name{
  position: absolute;
  right:100px;
  bottom: 200px;
}
</style>