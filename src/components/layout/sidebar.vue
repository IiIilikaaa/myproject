<template>
  <el-aside width="250px">
    <el-menu class="el-menu-vertical-demo" :unique-opened="true" router>
      <el-submenu v-for="(item,index) in sideMenus" :key="index" :index='item.path'>
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item
          v-for="(item1,index1) in item.children"
          :key="index1"
          :index="'/'+ item1.path"
        >
          <i class="el-icon-menu"></i>
          <span>{{item1.authName}}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  data() {
    return {
      //动态侧边栏内容
      sideMenus: [],
    };
  },
  methods: {
    //动态获取侧边栏内容
    getSideMenus() {
      this.$http({
        method: "GET",
        url: "menus",
      })
        .then((res) => {
          // console.log(res);
          let { meta, data } = res.data;
          if (meta.status === 200) {
            this.sideMenus = data;
          } else {
            this.$message.error(meta.msg);
          }
        })
        .catch((err) => {});
    },
  },
  mounted() {
    this.getSideMenus();
  },
};
</script>

<style>
</style>