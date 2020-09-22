<template>
  <el-card>
    <!-- 面包屑导航 -->
    <Bread one="商品管理" two="商品分类" />
    <!-- 消息提醒 -->
    <el-alert title="添加商品" type="info" center show-icon class="info"></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="myactive" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-tabs
      :tab-position="tabPosition"
      class="mytabs"
      v-model="actived"
      @tab-click="tabclick"
      :stretch="true"
    >
      <el-tab-pane label="基本信息" name="first">
        <el-form label-position="top" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addobj.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addobj.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addobj.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addobj.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            {{value}}
            <el-cascader v-model="value" :options="options" :props="propsJL"></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="second">
        <div v-for="(item,index) in goodsMany" :key="index" class="box">
          <div class="title">{{item.attr_name}}</div>
          <div>
            <el-checkbox
              v-model="checked1"
              v-for="(item1,index1) in item.attr_vals.split(',')"
              :key="index1"
              border
            >{{item1}}</el-checkbox>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="third">
        <el-form
          label-position="top"
          label-width="80px"
          v-for="(item,index) in goodsOnly"
          :key="index"
        >
          <el-form-item :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="fourth">
        <!-- action 必须参数 上传的地址 -->
        <!-- headers 设置上传请求头-->
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="upHeard"
          list-type="picture"
          :on-success="successFn"
          :on-remove="removeFn"
          :on-preview="previewFn"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        {{imgPathList}}
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="fivth">
        <el-button type="primary" plain @click="addGoodsFn">添加用户</el-button>
        <quill-editor
          ref="myQuillEditor"
          v-model="addobj.goods_introduce"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 预览图片 -->
    <el-dialog title="预览图片" :visible.sync="isDialog">
      <img ref="yamaji" class="yamaji" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false">取 消</el-button>
        <el-button type="primary" @click="isDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
//引入面包屑导航
import Bread from "../../bread/bread";
export default {
  //注册子组件
  components: { Bread },
  data() {
    return {
      // 标签页对齐方式
      tabPosition: "left",
      //步骤条选中
      myactive: 0,
      //设置默认选中tab
      actived: "first",
      //级联框双绑数据
      value: "",
      //级联框数据源
      options: [],
      //级联框配置项
      propsJL: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
      },
      //多选框选中
      checked1: true,
      //商品参数
      goodsMany: [],
      //商品属性
      goodsOnly: [],
      //请求头
      upHeard: {
        Authorization: window.localStorage.getItem("token"),
      },
      //上传图片信息
      imgPathList: [],
      //图片预览框
      isDialog: false,
      //富文本编辑
      // content : '781号 GAI',
      //新增商品数据对象
      addobj : {
        goods_name : '',
        goods_cat : '',
        goods_price : '',
        goods_number : '',
        gooods_weight : '',
        goods_introduce : ''
      }
     
    };
  },
  methods: {
    //标签点击触发
    tabclick(obj) {
      // console.log(+obj.index);
      // let index = +obj.index;
      // this.myactive = index++;
      this.myactive = +obj.index;
      if (this.myactive === 1) {
        this.getParam("many");
      } else if (this.myactive === 2) {
        this.getParam("only");
      }
    },
    //获取级联框数据
    getlist() {
      this.$http({
        url: "categories",
      })
        .then((res) => {
          // console.log(res);
          let { meta, data } = res.data;
          if (meta.status === 200) {
            this.options = data;
          }
        })
        .catch((err) => {});
    },
    //获取商品参数和商品属性
    getParam(sel) {
      //判断是否选中分类
      if (this.value.length !== 0) {
        let id = this.value[this.value.length - 1];
        this.$http({
          url: `categories/${id}/attributes?sel=${sel}`,
        })
          .then((res) => {
            // console.log(res);
            let { meta, data } = res.data;
            if (meta.status === 200) {
              if (sel === "many") {
                this.goodsMany = data;
              } else {
                this.goodsOnly = data;
              }
            }
          })
          .catch((err) => {});
      } else {
        this.$message.error("请选择商品分类哦");
      }
    },
    //文件上传成功执行
    successFn(response, file, fileList) {
      // console.log(response);
      this.imgPathList.push(response.data.tmp_path);
    },
    //删除时执行
    removeFn(file, fileList) {
      // console.log(fileList);
      let path = file.response.data.tmp_path;
      //forEach方法遍历数组  splice方法删除对应图片信息
      this.imgPathList.forEach((item, index) => {
        if (index == 0) {
          index++;
        }
        this.imgPathList.splice(path, index);
      });
    },
    //点击文件列表中已经上传的文件时执行
    previewFn(file) {
      console.log(file);
      this.isDialog = true;
      //$nextTick  将代码延时到下次dom更新时执行
      this.$nextTick(() => {
        let src = file.response.data.url;
        this.$refs.yamaji.src = src;
      });
    },
    //新增商品
    addGoodsFn() {
      //处理级联框数据 
      //数组 ----> 字符串
      this.addobj.goods_cat = this.value.join(',')
      this.$http({
        url : 'goods',
        method:'POST',
        data:this.addobj
      }).then(res=>{
        // console.log(res);
        let { meta , data} = res.data
        if(meta.status === 201) {
          this.$message.success(meta.msg)
          this.$router.push('/goods')
        }else{
          this.$message.error(meta.msg)
        }
      }).catch(err=>{})
    }
  },
  mounted() {
    this.getlist();
  },
};
</script>


<style>
/* 修改element-uicss样式时不能加scoped */
.info {
  margin-top: 20px;
}
.el-step__title {
  font-size: 14px;
  line-height: 38px;
}
.el-tabs__content,
.el-tabs__item {
  font-size: 14px;
}
.mytabs {
  margin-top: 10px;
  height: 100%;
}
label.el-checkbox {
  margin-right: 0px;
}
.title {
  margin-bottom: 10px;
}
.box {
  margin-bottom: 10px;
}
.yamaji {
  width: 100%;
}
.ql-container.ql-snow {
    height: 400px;
}
</style>