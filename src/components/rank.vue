<template>
  <div class="rank">
    <div class="echarts" ref="echarts"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      srtartValue: 0,
      endVlaue: 9,
      timer: null,
    };
  },
  methods: {
     initChart() {
      this.chartInstance = this.$echarts.init(this.$refs["echarts"], roma);
      let initOption = {
        title: {
          text: "▎地区销售排行",
          left: 20,
          top: 20,
        },
        grid: {
          top: "40%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        tooltip: {
          label: {
            show: true,
          },
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
          },
        ],
      };

      this.chartInstance.setOption(initOption);
      this.chartInstance.on('mouseover', () => {
         clearInterval(this.timer);
      });
      this.chartInstance.on('mouseout', () => {
          thjis.startInterval();
      })
    },
    getData() {
      this.$axios.get("map").then((res) => {
        console.log(res);
        this.allData = res.data;
        this.allData.sort((a, b) => {
          return a.value - b.value;
        });
        this.updateChart();
      });
    },
    updateChart() {
      let colorArr = [
        ["#0ba82c", "#4f778"],
        ["#2e72bf", "#23e5e5"],
        ["#5052ee", "#ab6ee5"],
      ];
      let provinceArr = this.allData.map((item) => {
        return item.name;
      });
      let valueArr = this.allData.map((item) => {
        return item.value;
      });

      let dataOption = {
        xAxis: {
          data: provinceArr,
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endVlaue,
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (e) => {
                let targeArr = null;
                if (e.data > 300) {
                  targetArr = colorArr[0];
                } else if (e.data > 200) {
                  targetArr = colorArr[1];
                } else {
                  targetArr = colorArr[2];
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetArr[0],
                  },
                  {
                    offset: 1,
                    color: targetArr[0],
                  },
                ]);
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    createAdopter() {
      let titleFontSize = (this.$refs["echarts"].offsetWidth / 100) * 3.6;
      let adopterOption = {
          title:{
              textStyle:{
                  fontSize:titleFontSize,
              }
          },
          series:[{
              barWidth:titleFontSize,
              itemStyle:{
                  borderRadius:[titleFontSize / 2, titleFontSize / 2, 0, 0]
              }
          }]
      };
      this.chartInstance.setOption(adopterOption);
      this.chartInstance.resize();
    },
    startInterval() {
      this.timer = setInterval(() => {
        if (this.timer) {
          clearInterval(this.timer);
        }

        this.startValue++;
        this.endVlaue++;
        if (this.endVlaue > this.allData.length - 1) {
          this.startValue = 0;
          this.endVlaue = 9;
        }
        this.updateChart();
      }, 2000);
    },
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

<style>
</style>