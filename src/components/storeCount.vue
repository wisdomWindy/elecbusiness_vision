<template>
  <div class="store-count">
    <div class="echarts" ref="echarts"></div>
  </div>
</template>

<script>
import roma from "echarts/theme/roma";
export default {
  data: {
    chartInstance: null,
    allData: null,
    currentIndex: 0,
    timer: null,
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs["echarts"], roma);
      let initOption = {
        title: {
          text: "▎库存和销量分析",
        },
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    getData() {
      this.$axios.get("stock").then((res) => {
        console.log(res);
        this.allData = res.data;

        this.updateChart();
        this.startInterval();
      });
    },
    updateChart() {
      let centerArr = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ];
      let colorArr = [
        ["#4ff778", "#0ba8zc"],
        ["#e5dd45", "#e8b11c"],
        ["#5052ee", "#ab6ee5"],
        ["#23e5e5", "#2e72bf"],
      ];
      const start = this.currentIndex * 5;
      const end = (this.currentIndex + 1) * 5;
      let showData = this.allData.slice(start, end);
      let seriesArr = showData.map((item, index) => {
        return {
          type: "pie",
          radius: [110, 100],
          center: centerArr[index],
          hoverAnimation: false,
          label: {
            position: "center",
            color: color[index][0],
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              name: item.name + "\n" + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.linearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0],
                  },
                  {
                    offset: 1,
                    color: color[index][1],
                  },
                ]),
              },
            },
            {
              value: item.stock,
              itemStyle: {
                color: "#333843",
              },
            },
          ],
        };
      });
      let dataOption = {
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    createAdopter() {
      let titleFontSize = (this.$refs["echarts"].offsetWidth / 100) * 3.6;
      let innerRadius = titleFontSize * 2;
      let outerRadius = innerRadius * 1.125;
      let adopterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2,
          },
        },
        series: [
          {
            type: "pie",
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
        ],
      };
      this.chartInstance.setOption(adopterOption);
      this.chartInstance.resize();
    },
    startInterval() {
      if (this.tiemr) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.currentIndex++;
        if (this.currentIndex > 1) {
          this.currentIndex = 0;
        }
        this.updateChart();
      }, 5000);
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