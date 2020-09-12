<template>
  <div class="bg">
    <div class="loginBox">
      <h3>用户登录</h3>
      <el-form
        label-position="top"
        label-width="80px"
        ref="rulesName"
        :rules="rules"
        :model="userObj"
      >
        <el-form-item label="用户名" prop="username" >
          <el-input type='text' v-model="userObj.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userObj.password" show-password></el-input>
        </el-form-item>
        <el-button type="primary" class="btn" @click.prevent="login">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userObj: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
    };
  },

  methods: {
    login() {
      this.$refs.rulesName.validate((valid) => {
        if (valid) {
          this.$http({
            url: "http://localhost:8888/api/private/v1/login",
            method: "POST",
            data: this.userObj,
          })
            .then((res) => {
              console.log(res);
              let { data, meta } = res.data;
              if (meta.status === 200) {
                window.localStorage.setItem('token',data.token)
                console.log(meta.msg);
                console.log(data);
                this.$router.push("/");
              } else {
                console.log(meta.msg);
              }
            })
            .catch((err) => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style>
.bg {
  width: 100%;
  height: 100%;
  background-color: cornflowerblue;
  position: relative;
}
.loginBox {
  width: 500px;
  height: 400px;
  background-color: white;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  padding: 10px;
}
.btn {
  width: 100%;
}
</style>
