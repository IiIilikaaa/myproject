<template>
  <div id="main" style="width: 600px;height:400px;"></div>
</template>

<script>
import Echarts from "echarts";
// var echarts = require('echarts');
export default {
  methods: {},
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = Echarts.init(document.getElementById("main"));
    // 指定图表的配置项和数据
    var data = [];

    for (var i = 0; i <= 100; i++) {
      var theta = (i / 100) * 360;
      var r = 5 * (1 + Math.sin((theta / 180) * Math.PI));
      data.push([r, theta]);
    }

    let option = {
      title: {
        text: "极坐标双数值轴",
      },
      legend: {
        data: ["line"],
      },
      polar: {},
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      angleAxis: {
        type: "value",
        startAngle: 0,
      },
      radiusAxis: {},
      series: [
        {
          coordinateSystem: "polar",
          name: "line",
          type: "line",
          data: data,
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  },
};
</script>

<style>
</style>