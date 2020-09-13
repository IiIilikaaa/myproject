<template>
  <el-container>
    <el-header>
      <!-- 头部组件 -->
      <Tophead />
    </el-header>
    <el-container>
      <Sidebar />
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
//引入组件
import Tophead from "../layout/tophead";
import Sidebar from "../layout/sidebar";

export default {
  components: {
    Tophead: Tophead,
    Sidebar: Sidebar,
  },
  mounted() {
    let token = window.localStorage.getItem("token");
    if (!token) {
      this.$message({
        showClose: true,
        message: "请先登录哦!",
        type: "warning",
      });
      this.$router.push("/login");
    }
  },
};
</script>

<style>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.left {
  margin-left: -27%;
}
.mid h3 {
  margin: 0;
  color: white;
  font-size: 27px;
}

.right a {
  float: right;
  text-decoration: none;
  color: tomato;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  /* text-align: center; */
  line-height: 200px;
}
.el-menu-vertical-demo {
  height: 100%;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>