<template>
  <el-card>
    <!-- 面包屑(蟹)导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="myrow">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="query">
          <el-button slot="append" icon="el-icon-search" @click.prevent="searchUser"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6" class="col-btn">
        <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%" class="mytable">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <!-- slot-scope="scope"  获取本行数据的数据源 -->
        <template slot-scope="scope">
          <!-- {{scope.row.mg_state}} -->
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <!-- current-page --当前页  page-sizes--页码集合 page-size--每页显示数据的条数 total -- 总条目数-->
    <!-- layout属性 -- 组件布局 子组件用逗号隔开 total--总条数 sizes--页码集合 prev--上一页 pager--页码 next--下一页 jumper--跳转 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="pagenum"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      //列表数据
      tableData: [],
      //当前页
      pagenum: 1,
      //页码集合
      pagesizes: [1, 2, 3, 5],
      //每页显示数据的条数
      pagesize: 2,
      //数据总条数
      total: 0,
      //查询参数
      query: "",
    };
  },
  methods: {
    //获取数据
    getDataList() {
      this.$http({
        url: `http://localhost:8888/api/private/v1/users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
        method: "GET",
        headers: { Authorization: window.localStorage.getItem("token") }, //axios中设置请求头的方法
      })
        .then((res) => {
          //console.log(res);
          //解构
          let { data, meta } = res.data;
          if (meta.status === 200) {
            this.tableData = data.users;
            this.total = data.total;
          }
        })
        .catch((err) => {});
    },
    //size-change每页条数 改变时触发
    sizeChange(val) {
      //   console.log(val);
      this.pagesize = val;
      this.getDataList();
    },
    //current-change 当前页改变触发
    currentChange(val) {
      // console.log(val);
      this.pagenum = val;
      this.getDataList();
    },
    //搜索用户
    searchUser() {
      this.getDataList();
    },
  },
  mounted() {
    this.getDataList();
  },
};
</script>

<style scoped>
.myrow {
  margin-top: 20px;
}
.col-btn {
  margin-left: 20px;
}
.mytable {
  margin-bottom: 20px;
}
</style>