<template>
  <el-card>
    <!-- 面包屑导航 -->
    <Bread one="商品管理" two="商品分类" />
    <el-button class="mybtn" type="success" plain @click="btnFn">添加分类</el-button>
    <!-- 表格区域 -->
    <el-table v-loading='isloading' :data="tableData" border style="width: 100%">
      <!-- <el-table-column prop="cat_name" label="分类名称" width="180"></el-table-column> -->
      <el-table-tree-column
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        prop="cat_name"
        label="分类名称"
        width="180"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
      ></el-table-tree-column>
      <el-table-column label="级别" width="180">
        <template
          slot-scope="scope"
        >{{scope.row.cat_level === 0 ? '一级' : scope.row.cat_level === 1 ? '二级' : '三级'}}</template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">{{scope.row.cat_deleted ? '有效' : '无效'}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteFn(scope.row.cat_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      :current-page="pagenum"
      layout="total,sizes, prev, pager, next,jumper"
      :total="total"
    ></el-pagination>
    <!-- 新增框 -->
    <el-dialog title="添加商品分类" :visible.sync="isDialog">
      <el-form>
        <el-form-item label="活动名称" :label-width="labelWidth">
          <el-input autocomplete="off" v-model="goodsName"></el-input>
        </el-form-item>
        <el-form-item label="选择分类" :label-width="labelWidth">
            {{JLvalue}}
          <el-cascader v-model="JLvalue" :options="JLlist" :props='JLprops'></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false;JLvalue=''">取 消</el-button>
        <el-button type="primary" @click="addFn">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
//引入面包屑导航
import Bread from "../../bread/bread";
export default {
  components: {
    Bread,
  },
  data() {
    return {
      //表格数据
      tableData: [],
      //每页显示数据条数
      pagesizes: [5, 10, 15],
      //当前页容量
      pagesize: 5,
      //数据总条数
      total: 0,
      //当前页
      pagenum: 1,
      //添加框
      isDialog: false,
      //宽度
      labelWidth: "120px",
      //级联框数据
      JLlist :[],
      //级联框配置项
      JLprops : {
          label : 'cat_name',
          value : 'cat_id',
          checkStrictly : true
      },
      //双向绑定数据
      JLvalue : [],
      //商品名称
      goodsName:'',
      //loading
      isloading : true
    };
  },
  methods: {
    //获取数据
    getGoodsList() {
      this.$http({
        method: "GET",
        url: "categories",
      })
        .then((res) => {
          //   console.log(res);
          //解构
          let { meta, data } = res.data;
          if (meta.status === 200) {
            this.tableData = data;
            //设置数据总条数
            this.total = data.length;
            this.getpagelist();
            //loading
            setTimeout(()=>{
            this.isloading = false
            },1000)
          }
        })
        .catch((err) => {});
    },
    //从数据源中截取当前页的数据
    getpagelist() {
      let num1 = this.pagesize * (this.pagenum - 1);
      let num2 = this.pagesize * this.pagenum;
      this.tableData = this.tableData.slice(num1, num2);
    },
    //当前页改变
    currentChange(pagenum) {
      //   console.log(pagenum);
      this.pagenum = pagenum;
      this.getGoodsList();
    },
    //页容量改变
    sizeChange(pagesize) {
      // console.log(pagesize);
      this.pagesize = pagesize;
      this.getGoodsList();
    },
    //添加按钮
    btnFn() {
      this.$http({
          method : 'GET',
          url : 'categories?type=2'
      }).then(res=>{
          // console.log(res);
          let{meta,data} = res.data
          if(meta.status === 200) {
              this.JLlist = data 
          }
      }).catch(err=>{})
      //打开新增框
      this.isDialog = true;
    },
    //添加商品分类
    addFn() {
      this.$http({
        method : 'POST',
        url : 'categories',
        data : {
          cat_name : this.goodsName,
          cat_pid : this.JLvalue[this.JLvalue.length-1],
          cat_level : this.JLvalue.length
        }
      }).then(res=>{
        // console.log(res);
        let{meta} = res.data
        if(meta.status === 201) {
          this.$message.success(meta.msg)
          //重新获取数据
          this.getGoodsList()
          //清空输入框内容
          this.goodsName = ''
          this.JLvalue = ''
          //关闭对话框
          this.isDialog =false
        }else{
          this.$message.error(meta.msg)
        } 
      })
    },
    //删除商品分类
    deleteFn(id) {
      this.$http({
        method : 'DELETE',
        url :`categories/${id}`
      }).then(res=>{
        let {meta} = res.data
        if(meta.status === 200) {
          this.$message.success(meta.msg)
          //重新获取数据
          this.getGoodsList()
        }else{
          this.$message.error(meta.msg)
        }
      })
    }
  },
  mounted() {
    this.getGoodsList();
  },
};
</script>

<style scoped>
.mybtn {
  margin-top: 20px;
}
</style>