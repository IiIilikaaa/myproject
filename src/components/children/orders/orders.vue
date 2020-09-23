<template>
  <div id="mapContainer" style="width:100%;height:500px"></div>

  <!-- <BMap id="mymap"/> -->
</template>

<script>
import BMap from "BMap";
export default {
  // components:{
  //     BMap :BMap
  // },
  data() {
    return {};
  },
  mounted() {
    // this.dbMap;
    // let map = new BMap.Map("mapContainer");
    // let point = new BMap.Point(113.3309751406, 23.1123809784);
    // map.centerAndZoom(point, 15); // 创建点坐标
    let map = new BMap.Map("mapContainer");
    let point = new BMap.Point(113.3309751406, 23.1123809784);
    map.centerAndZoom(point, 15); // 创建点坐标
    map.addControl(new BMap.NavigationControl());
    map.enableScrollWheelZoom(true); //允许鼠标滚动缩放
    // 初始化地图， 设置中心点坐标和地图级别
    let marker = new BMap.Marker(point);
    map.addOverlay(marker); //添加覆盖物
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    //添加覆盖物文字
    let label = new BMap.Label("广州塔", {
      offset: new BMap.Size(20, -25),
    });
    marker.setLabel(label);
  },
  methods: {
    // bdMap() {
    //   //   创建地图
    //   let map = new BMap.Map("mapContainer");
    //   let point = new BMap.Point(113.3309751406, 23.1123809784);
    //   map.centerAndZoom(point, 15); // 创建点坐标
    //   map.addControl(new BMap.NavigationControl());
    //   map.enableScrollWheelZoom(true); //允许鼠标滚动缩放
    //   // 初始化地图， 设置中心点坐标和地图级别
    //   let marker = new BMap.Marker(point);
    //   map.addOverlay(marker); //添加覆盖物
    //   marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    //   //添加覆盖物文字
    //   let label = new BMap.Label("广州塔", {
    //     offset: new BMap.Size(20, -25),
    //   });
    //   marker.setLabel(label);
    // },
  },
};
</script>

<style>
</style>