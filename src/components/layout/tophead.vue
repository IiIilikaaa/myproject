<template>
  <el-row>
    <el-col :span="6">
      <div class="left">
        <img src="../../assets/logo1.png" alt height="60px" />
      </div>
    </el-col>
    <el-col :span="12">
      <div class="mid">
        <h3>电商后台平台管理系统</h3>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="right">
        <a href="#" @click.prevent="outFn">退出</a>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    outFn() {
      this.$confirm("不要走,好吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$message({
          type: "success",
          message: "退出成功",
        });
        window.localStorage.removeItem("token");
        this.$router.push({name:'login'})
      }).catch(()=>{
        
      })
    },
  },
};
</script>

<style>
</style>