<template>
  <el-card>
    <!-- 面包屑导航 -->
    <bread one="权限管理" two="角色列表" />
    <!-- 添加按钮 -->
    <el-button plain class="mybtn">添加角色</el-button>
    <!-- 表格区域 -->
    <el-table :data="tableData" border style="width: 100%" type="expand">
      <el-table-column type="expand">
        <template slot-scope="scope">
          {{scope.row.id}}
          <el-row v-for="(item1,index1) in scope.row.children" :key="index1">
            <el-col :span="5">
              <el-tag
                closable
                @close="closeRole(scope.row.id,item1.id,scope.row)"
              >{{item1.authName}}{{item1.id}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row v-for="(item2,index2) in item1.children" :key="index2">
                <el-col :span="4">
                  <el-tag
                    type="success"
                    closable
                    @close="closeRole(scope.row.id,item2.id,scope.row)"
                  >{{item2.authName}}{{item2.id}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    class="tagthree"
                    type="warning"
                    closable
                    v-for="(item3,index3) in item2.children"
                    :key="index3"
                    @close="closeRole(scope.row.id,item3.id,scope.row)"
                  >{{item3.authName}}{{item3.id}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" circle></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            circle
            @click="getrightslist(scope.row.children,scope.row.id)"
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限框 -->
    <!-- data :数据源 -->
    <!-- props : 配置项 -->
    <!-- node-key : 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 -->
    <!-- default-expanded-keys:默认展开的节点的 key 的数组	 -->
    <!-- default-expand-all : 是否展开所有节点 Boolean -->
    <el-dialog title="分配权限" :visible.sync="RightsDislog">
      <el-tree
        :data="rightslist"
        :props="Theprops"
        node-key="id"
        show-checkbox
        :default-expand-all="true"
        :default-checked-keys="idlist"
        ref="tree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="RightsDislog = false">取 消</el-button>
        <el-button type="primary" @click="rightsFn">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
//引入面包屑导航
import bread from "../../bread/bread";
export default {
  //注册为子组件
  components: {
    bread: bread,
  },
  data() {
    return {
      //表格数据
      tableData: [],
      //分配权限框
      RightsDislog: false,
      //分配框数据
      rightslist: [],
      //树型控件配置项
      Theprops: {
        label: "authName",
        children: "children",
      },
      //控制默认选中
      idlist: [],
      //角色id
      roleid: "",
    };
  },
  methods: {
    //获取数据
    getList() {
      this.$http({
        method: "GET",
        url: "roles",
      })
        .then((res) => {
          //   console.log(res);
          //解构
          let { data, meta } = res.data;
          //获取成功 返回数据给设置好的tableData数组
          if (meta.status === 200) {
            this.tableData = data;
          }
        })
        .catch((err) => {});
    },
    //删除角色指定权限
    closeRole(roleId, rightId, scoperow) {
      //  console.log(roleID);
      //  console.log(rightId);
      this.$http({
        method: "DELETE",
        url: `roles/${roleId}/rights/${rightId}`,
      })
        .then((res) => {
          console.log(res);
          let { meta, data } = res.data;
          if (meta.status === 200) {
            this.$message.success(meta.msg);
            //将跟新数据设置给数据源
            scoperow.children = data;
          } else {
            this.$message.error(meta.msg);
          }
        })
        .catch((error) => {});
    },
    //获取权限数据树状解构
    getrightslist(datalist, id) {
      this.idlist = [];
      this.RightsDislog = true;
      //保存角色id
      this.roleid = id;
      this.$http({
        method: "GET",
        url: "rights/tree",
      })
        .then((res) => {
          // console.log(res);
          //解构
          let { meta, data } = res.data;
          if (meta.status === 200) {
            this.rightslist = data;
            datalist.forEach((item1) => {
              item1.children.forEach((item2) => {
                item2.children.forEach((item3) => {
                  this.idlist.push(item3.id);
                });
              });
            });
          } else {
            this.$message.error(meta.msg);
          }
        })
        .catch((error) => {});
    },
    //角色授权
    //树形空间中的方法
    //getCheckedKeys() 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
    //getHalfCheckedNodes  若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点所组成的数组
    rightsFn() {
      //获取全选id数组
      let arr1 = this.$refs.tree.getCheckedKeys();
      //获取半选id数组
      let arr2 = this.$refs.tree.getHalfCheckedNodes();
      //整合成字符串
      let arr3 = [...arr1, ...arr2];
      console.log(arr3.join(","));

      this.$http({
        method: "POST",
        url: `roles/${this.roleid}/rights`,
        data: {
          rids: arr3.join(","),
        },
      }).then((res) => {
        let { meta } = res.data;
        if (meta.status === 200) {
          this.$message.success(meta.msg);
          this.getList();
          //关闭分配框
          this.RightsDislog = false;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped>
.mybtn {
  margin-top: 20px;
}
.tagthree {
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>