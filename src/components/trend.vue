<template>
  <div class="trend">
    <div class="title">
      <span :style="comStyle">{{ showTitle }}</span>
      <span
        class="title-icon icon-select-expand"
        @click="showChoice = !showChoice"
        :style="comStyle"
        >我是剪头</span
      >
      <div class="select-con" :style="marginStyle" v-show="showChoice">
        <div
          class="select-item"
          v-for="item in selectTypes"
          :key="item.type"
          @click="handleSelect(item.type)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="echarts" ref="echarts"></div>
  </div>
</template>

<script>
import roma from "echarts/theme/roma";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      showChoice: false,
      choiceType: "map",
    };
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs["echarts"], roma);
      let initOption = {
        grid: {
          left: "3%",
          top: "35%",
          right: "4%",
          bottom: "1%",
          containerLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          left: 20,
          top: "15%",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
      };
      this.chartInstance.setOption(initOption);
    },
    getData() {
      this.$axios.get("trend").then((res) => {
        console.log(res);
        this.allData = res.data;
        this.updateChart();
      });
    },
    updateChart() {
      let timeArr = this.allData.common.month;
      let valueArr = this.allData[this.choiceType].data;
      let colorArr = [
        "rgba(11, 168, 44, 0.5)",
        "rgba(44, 110, 255, 0.5)",
        "rgba(22, 242, 217, 0.5)",
        "rgba(254,33, 30, 0.5)",
        "rgba(250, 105, 0, 0.5)",
      ];
      let colorArr2 = [
        "rgba(11, 168, 44, 0)",
        "rgba(44, 110, 255, 0)",
        "rgba(22, 242, 217, 0)",
        "rgba(254,33, 30, 0)",
        "rgba(250, 105, 0, 0)",
      ];
      let serierArr = valueArr.map((item, index) => {
        return {
          type: "line",
          data: item.data,
          stack: "line",
          areaStyle: {
            color: new this.$echarts.graphic.linearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr[index],
              },
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
        };
      });
      let lengedArr = valueArr.map((item) => {
        return item.name;
      });
      let dataOption = {
        xAxis: {
          data: timeArr,
        },
        legend: {
          data: lengedArr,
        },
        series: serierArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    createAdopter() {
      this.titleFontSize = (this.$refs["echarts"].offsetWidth / 100) * 3.6;
      let adopterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSzie: this.titleFontSize / 2,
          },
        },
      };
      this.chartInstance.setOption(adopterOption);
      this.chartInstance.resize();
    },
    handleSelect(currentType) {
      this.choiceType = currentType;
      this.updateChart();
    },
  },
  computed: {
    selectTypes() {
      if (!this.allData) {
        return [];
      } else {
        return this.allData.type.filter((ele) => {
          return item.key !== this.choiceType;
        });
      }
    },
    showTitle() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.choiceType].title;
      }
    },
    comStyle() {
      return {
        fontSzie: titleFontSize + "px",
      };
    },
    marginStyle(){
        return {
            marginLeft:10 + 'px'
        }
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
  },
};
</script>

<style lang='less'>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  color: #fff;
  z-index: 10;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .select-con{
      background-color:#222733;
  }
}
</style>