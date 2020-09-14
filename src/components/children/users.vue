<template>
  <el-card>
    <!-- 面包屑导航 -->
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
        <el-button type="success" plain @click="show">添加用户</el-button>
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
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change = 'setStatus(scope.row.id,scope.row.mg_state)'></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- {{scope.row.id}} -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            @click="editShow(scope.row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            @click="roleFn(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            @click="del(scope.row.id)"
          ></el-button>
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
    <!-- 新增页面 -->
    <el-dialog title="新增用户" :visible.sync="isShow">
      <!-- {{form}} -->
      <el-form :model="addForm">
        <el-form-item label="用户名" :label-width="dialogWidth">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="dialogWidth">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="dialogWidth">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="dialogWidth">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hide">取 消</el-button>
        <el-button type="primary" @click="addFn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑页面 -->
    <el-dialog title="编辑信息" :visible.sync="isShowEdit">
      <!-- {{form}} -->
      <el-form :model="editForm">
        <el-form-item label="用户名" :label-width="dialogWidth">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="dialogWidth">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="dialogWidth">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editHide">取 消</el-button>
        <el-button type="primary" @click="editFn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 用户角色页面 -->
    <el-dialog title="用户角色" :visible.sync="isShowRole">
      <!-- {{form}} -->
      <el-form :model="roleForm">
        <el-form-item label="用户名" :label-width="dialogWidth">
          <el-input v-model="roleForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="选择角色" :label-width="dialogWidth">
          {{roleForm.rid}}
          <el-select placeholder="请选择" v-model="roleForm.rid">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option
              v-for="item in optionName"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowRole=false">取 消</el-button>
        <el-button type="primary" @click="roleUserFn">确 定</el-button>
      </div>
    </el-dialog>
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
      pagesize: 5,
      //数据总条数
      total: 0,
      //查询参数
      query: "",
      //新增显示
      isShow: false,
      //新增框的宽
      dialogWidth: "100px",
      //新增框数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //编辑框显示
      isShowEdit: false,
      //编辑数据
      editForm: {
        id: "",
        username: "",
        email: "",
        mobile: "",
      },
      //选择用户角色框
      isShowRole: false,
      //用户角色数据
      roleForm: {
        username: "",
        id: "",
        rid: "",
      },
      //用户角色下拉框数据
      optionName: [],
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
            if (data.users.length === 0 && this.pagenum !== 1) {
              this.pagenum--;
              this.getDataList();
              return;
            }
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
    //新增框的显示
    show() {
      this.isShow = true;
    },
    //新增框的隐藏
    hide() {
      this.isShow = false;
      this.addForm.username = "";
      this.addForm.password = "";
      this.addForm.email = "";
      this.addForm.mobile = "";
    },
    //新增用户
    addFn() {
      this.$http({
        url: "http://localhost:8888/api/private/v1/users",
        method: "POST",
        data: this.addForm,
        headers: { Authorization: window.localStorage.getItem("token") }, //axios中设置请求头的方法
      }).then((res) => {
        // console.log(res);
        let { meta } = res.data;
        if (meta.status === 201) {
          this.$message({
            message: meta.msg,
            type: "success",
          });
          this.getDataList();
          this.isShow = false;
          this.addForm.username = "";
          this.addForm.password = "";
          this.addForm.email = "";
          this.addForm.mobile = "";
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    //删除用户
    del(id) {
      this.$http({
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        method: "DELETE",
        headers: { Authorization: window.localStorage.getItem("token") }, //axios中设置请求头的方法
      }).then((res) => {
        // console.log(res);
        let { meta } = res.data;
        if (meta.status === 200) {
          this.getDataList();
          this.$message({
            message: meta.msg,
            type: "success",
          });
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    //编辑框显示
    //根据id获取数据
    editShow(id) {
      this.isShowEdit = true;
      this.$http({
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        method: "GET",
        headers: { Authorization: window.localStorage.getItem("token") }, //axios中设置请求头的方法
      })
        .then((res) => {
          // console.log(res);
          let { data, meta } = res.data;
          if (meta.status === 200) {
            this.editForm.id = data.id;
            this.editForm.username = data.username;
            this.editForm.email = data.email;
            this.editForm.mobile = data.mobile;
          }
        })
        .catch((err) => {});
    },
    //编辑框隐藏
    editHide() {
      this.isShowEdit = false;
      // this.editForm.username = "";
      // this.editForm.email = "";
      // this.editForm.mobile = "";
    },
    //编剧用户资料
    editFn() {
      this.$http({
        url: `http://localhost:8888/api/private/v1/users/${this.editForm.id}`,
        method: "PUT",
        data: {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        },
        headers: { Authorization: window.localStorage.getItem("token") }, //axios中设置请求头的方法
      })
        .then((res) => {
          // console.log(res);
          let { data, meta } = res.data;
          if (meta.status === 200) {
            this.$message.success(meta.msg);
            this.isShowEdit = false;
            this.editForm.id = "";
            this.editForm.username = "";
            this.editForm.email = "";
            this.editForm.mobile = "";
            this.getDataList();
          } else {
            this.$message.error(meta.msg);
          }
        })
        .catch((err) => {});
    },
    //选择用户角色
    roleFn(id) {
      this.isShowRole = true;
      this.$http({
        method: "GET",
        url: "http://localhost:8888/api/private/v1/roles",
        headers: { Authorization: window.localStorage.getItem("token") }, //axios中设置请求头的方法
      })
        .then((res) => {
          // console.log(res);
          let { meta, data } = res.data;
          if (meta.status === 200) {
            this.optionName = data;
            //根据id获取数据
            this.$http({
              method: "GET",
              url: `http://localhost:8888/api/private/v1/users/${id}`,
              headers: { Authorization: window.localStorage.getItem("token") }, //axios中设置请求头的方法
            })
              .then((res) => {
                let { meta, data } = res.data;
                if (meta.status === 200) {
                  this.roleForm.username = data.username;
                  this.roleForm.id = data.id;
                  this.roleForm.rid = data.rid;
                }
              })
              .catch((err) => {});
          }
        })
        .catch((err) => {});
    },
    //根据id 修改用户角色
    roleUserFn() {
      this.$http({
        method: "PUT",
        url: `http://localhost:8888/api/private/v1/users/${this.roleForm.id}/role`,
        data: { rid: this.roleForm.rid },
        headers: { Authorization: window.localStorage.getItem("token") }, //axios中设置请求头的方法
      })
        .then((res) => {
          let { meta } = res.data;
          if (meta.status === 200) {
            this.$message.success(meta.msg);
          } else {
            this.$message.error(meta.msg);
          }
          this.isShowRole = false;
        })
        .catch((err) => {});
    },
    //设置用户状态
    setStatus(uid, type) {
      this.$http({
        method: "PUT",
        url: `http://localhost:8888/api/private/v1/users/${uid}/state/${type}`,
        headers: { Authorization: window.localStorage.getItem("token") }, //axios中设置请求头的方法
      }).then(res=>{
        let {meta} = res.data
        if ( meta.status === 200 ) {
          this.$message.success(meta.msg)
        }else{
          this.$message.error(meta.msg)
        }
      }).catch(err=>{})
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