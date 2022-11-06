<template>
  <div class="map" @dbclick="backMap">
    <div class="echarts" ref="echarts"></div>
  </div>
</template>

<script>
import roma from "echarts/theme/roma";
import axios from "axios";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      provinces: {
        西安: "xian",
        哈尔滨: "haerbin",
      },
      mapData: {},
    };
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs["echarts"], roma);
      axios.get("http://127.0.0.1:8999/assets/map/china.json").then((res) => {
        console.log(res);
        this.$echarts.registerMap("china", res.data);
        let initOption = {
          title: {
            text: "▎商家分布",
            left: 20,
            top: 20,
          },
          legend: {
            left: "5%",
            bottom: "5%",
            orientation: "vertical",
          },
          geo: {
            type: "map",
            map: "china",
            top: "5%",
            bottom: "5%",
            itemStyle: {
              areaColor: "#27ef72",
              borderColor: "#333",
            },
          },
        };
        this.chartInstance.setOption(initOption);
        this.chartInstance.on("click", async (e) => {
          if (!this.mapData[this.provinces[e.name]]) {
            let res = await axios.get("http://127.0.0.1:8999/assets/map/province/" + this.provinces[e.name] + ".josn");
            this.mapData[this.provinces[e.name]] = res.data;
            this.$echarts.resgisterMap(this.provinces[e.name], res.data);
          } else {
              this.$echarts.resgisterMap(this.provinces[e.name], this.mapData[this.provinces[e.name]]);
          }
          let changeOption = {
            geo: {
              map: this.provinces[e.name],
            },
          };
          this.chartInstance.setOption(changeOption);
        });
      });
    },
    getData() {
      this.$axios.get("map").then((res) => {
        console.log(res);
        this.allData = res.data;
        this.updateChart();
      });
    },
    updateChart() {
      let legendArr = this.allData.map((item) => {
        return item.name;
      });
      let seriesArr = this.allData.map((item) => {
        return {
          type: "effectScatter",
          rippleEffect: {
            scale: 5,
            bruhsType: "stroke",
          },
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
        };
      });

      let dataOption = {
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    createAdopter() {
      let titleFontSize = (this.$refs["echarts"].offsetWidth / 100) * 3.6;
      let adopterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize,
          },
          itemGap: titleFontSize / 2,
        },
      };
      this.chartInstance.setOption(adopterOption);
      this.chartInstance.resize();
    },
    backMap() {
      let revertOption = {
        geo: {
          map: "china",
        },
      };
      this.chartInstance.setOption(revertOption);
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
  },
};
</script>

<style>
</style>