<template>
  <el-card>
    <!-- 面包屑 -->
    <Bread one="商品管理" two="商品列表" />
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" class="search" v-model="query">
      <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
    </el-input>
    <!-- 新增按钮 -->
    <el-button type="success" plain @click="addFn">添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="tableData.goods" style="width: 100%" border>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="360"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="goods_number" label="商品数量"></el-table-column>
      <el-table-column prop="add_time" label="添加时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          {{scope.row.goods_id}}
          <el-button type="primary" icon="el-icon-edit" size="mini" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
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
//引入面包屑
import Bread from "../../bread/bread";
export default {
  //注册子组件
  components: {
    Bread: Bread,
  },
  data() {
    return {
      //表格数据
      tableData: [],
      //当前页
      pagenum: 1,
      //条数集合
      pagesizes: [10, 15, 20],
      //当前页条数
      pagesize: 10,
      //数据总条数
      total: 0,
      //搜索框数据
      query : '',
    };
  },
  methods: {
    getGoodsList() {
      this.$http({
        method: "GET",
        url: `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
      })
        .then((res) => {
          console.log(res);
          let { meta, data } = res.data;
          if (meta.status === 200) {
            this.tableData = data;
            //数据总条数
            this.total = data.total;
          } else {
            this.$message.error(meta.msg);
          }
        })
        .catch((err) => {});
    },
    //页容量改变
    sizeChange(pagesize) {
      //改变当前页容量
      this.pagesize = pagesize;
      //重新获取数据
      this.getGoodsList();
    },
    //当前页码改变
    currentChange(pagenum) {
      //改变当前页码
      this.pagenum = pagenum;
      //重新获取数据
      this.getGoodsList();
    },
    //搜索功能
    searchGoods() {
     this.getGoodsList()
    },
    //新增按钮
    addFn() {
        //页面跳转
        this.$router.push('/goods/add')
    }
  },
  mounted() {
    this.getGoodsList();
  },
};
</script>

<style scoped>
.search {
  width: 300px;
  margin-top: 20px;
}
</style>