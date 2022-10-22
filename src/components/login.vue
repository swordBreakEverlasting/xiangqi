<!--  -->
<template>
  <div class="contain">
    <div class="contain-info">
      <div class="input-box">
        <div class="contain-item" v-show="pageName === '登录'">
          <div class="title">用户登录</div>
          <div class="register-user">
            <input
              type="email"
              name="username"
              id="1"
              placeholder="账号"
              autocomplete="off"
              v-model="form.username"
            />
            <span class="errTips" v-show="existed">* 账号或密码错误！ *</span>
            <input
              type="password"
              name="password"
              id="2"
              placeholder="密码"
              v-model="form.userpwd"
            />
          </div>
          <button class="bbutton" @click="login">登录</button>
        </div>
        <div class="contain-item" v-show="pageName === '强退'">
          <div class="title">用户强退</div>
          <div class="register-user">
            <input
              type="email"
              name="username"
              id="1"
              placeholder="账号"
              autocomplete="off"
              v-model="form.username"
            />
            <span class="errTips" v-show="existed">* 账号或密码错误！ *</span>
            <input
              type="password"
              name="password"
              id="2"
              placeholder="密码"
              v-model="form.userpwd"
            />
          </div>
          <button class="bbutton" @click="forcedexit">发起强退</button>
        </div>
        <div class="contain-item" v-show="pageName === '注册'">
          <div class="title">创建用户</div>
          <div class="register-user">
            <input
              type="text"
              name="nickname"
              id="3"
              placeholder="昵称：您可以任意输入12位以内的昵称"
              autocomplete="off"
              v-model="form.nickname"
            />
            <input
              type="email"
              name="useremail"
              id="4"
              placeholder="邮箱"
              autocomplete="off"
              v-model="form.useremail"
            />
            <input
              type="text"
              name="username"
              id="5"
              placeholder="账号"
              autocomplete="off"
              v-model="form.username"
            />
            <!-- <span class="errTips" v-show="existed">* 账号已经存在！ *</span> -->
            <input
              type="password"
              name="userpwd"
              id="6"
              placeholder="密码"
              v-model="form.userpwd"
            />
          </div>
          <button class="bbbutton" @click="register">注册</button>
        </div>
      </div>
      <!-- :class="{ active: pageName }" -->
      <div class="text-box" >
        <div class="text-contain" v-show="pageName === '注册'">
          <div class="stitle">你好，朋友!</div>
          <div class="scontent">开始注册<br />和我们一起旅行</div>
          <button class="sbutton" @click="changeType('登录')">登录</button>
        </div>
        <div class="text-contain" v-show="pageName === '强退'">
          <div class="stitle">你好，朋友!</div>
          <div class="scontent">开始强退<br />和我们一起旅行</div>
          <button class="sbutton" @click="changeType('登录')">登录</button>
        </div>
        <div class="text-contain" v-show="pageName === '登录'">
          <div class="stitle">欢迎回来!</div>
          <div class="scontent">与我们保持联系<br />请登录你的账户</div>
          <button class="sbutton" @click="changeType('注册')">注册</button>
          <button class="sbutton" @click="changeType('强退')">强退</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        useremail: "",
        userpwd: "",
        nickname:"",
      },
      pageName: '登录', //决定显示登录界面还是注册界面
      existed: false, //错误显示
      isLogin:false,//是否登录的状态
    };
  },
  methods: {
    changeType(pageName) {
      this.pageName = pageName;
      this.form.username = "";
      this.form.useremail = "";
      this.form.userpwd = "";
      this.form.nickname = "";
      this.existed = false;
    },
    // 登录
    async login() {
      if (this.form.username != "" && this.form.userpwd != "") {
        const { data: res } = await this.$http.post("/login", {
          username: this.form.username,
          password: this.form.userpwd,
        });
        console.log(res);
        if (res.meta.status === 200) {
          this.existed = false;
          console.log(res.data)
          let idMsg = res.data
          this.$store.commit('updataIdMsg',idMsg)
          this.$store.commit('setSelfGameState','未开始')
          this.$message({
              type: 'success',
              message: '登录成功！\n欢迎您，'+res.data.nickname
          });
          this.$router.push({path:"/xiangqi"})
        } else if(res.meta.status === 204){
          this.$message({
              type: 'warning',
              message: '请不要重复登录！'
          });
        }else {
          this.existed = true;
          this.$message({
              type: 'warning',
              message: res.meta.msg
          });
        }
      } else {
        this.$message({
            type: 'warning',
            message: "登录内容不能留空！"
        });
      }
    },
    // 注册
    async forcedexit(){
      if (this.form.username != "" && this.form.userpwd != "") {
        this.existed = false;
        const { data: res } = await this.$http.post("/forcedexit", {
          username: this.form.username,
          password: this.form.userpwd,
        });
        console.log(res);
        if (res.meta.status === 200) {
          this.$message({
              type: 'success',
              message: res.data.msg
          });
        }else {
          this.$message({
              type: 'warning',
              message: res.meta.msg
          });
        }
      } else {
        this.$message({
            type: 'warning',
            message: "登录内容不能留空！"
        });
      }
    },
    async register() {
      if (
        this.form.username != "" &&
        this.form.useremail != "" &&
        this.form.userpwd != "" &&
        this.form.nickname != ""
      ) {
        const { data: res } = await this.$http.post("/register", {
          username: this.form.username,
          email: this.form.useremail,
          password: this.form.userpwd,
          nickname: this.form.nickname,
        });
        if (res.meta.status === 200) {
          this.existed = false; // 注册成功
          this.$message({
              type: 'success',
              message: '注册成功！'
          });
        } else {
          this.existed = true; // 注册失败
          this.$message({
              type: 'warning',
              message: '注册失败！'+res.meta.msg
          });
        }
      } else {
        this.$message({
            type: 'warning',
            message: '注册的内容不能为空！'
        });
      }
    },
  },
};
</script>


<style scoped>
.contain {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
}
.contain-info {
  width: 50%;
  height: 60%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 0 10px #f0f0f0, 0 0 10px #f0f0f0;
}
.input-box {
  width: 70%;
  height: 60%;
  position: absolute;
  top: 20%;
  right: 0;
  /* transform: translate(0, -50%); */
  transform: translateX(0%);
  transition: all 1s;
}
.contain-item {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.contain-item .title {
  font-size: 40px;
  color: #39a7b0;
  font-weight: 700;
}

.register-user {
  width: 70%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.register-user input {
  width: 100%;
  height: 40px;
  margin-top: 10px;
  border-style: none;
  outline: none;
  background-color: #eeee;
  border-radius: 10px;
  padding: 2px 10px;
}
.errTips {
  position: absolute;
  top: 55px;
  left: 10px;
  display: block;
  text-align: left;
  color: red;
  font-size: 0.7em;
}
.bbutton,
.bbbutton {
  width: 30%;
  height: 60px;
  margin-top: 20px;
  border-style: none;
  border-radius: 10px;
  outline: none;
  color:#fff;
  background-color: #409eff;
}
.text-box {
  width: 30%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
  /* transform: translateX(0%); */
  transition: all 1s;
  background-color: #2cbfaa;
  border-radius: 20px;
}
.text-contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
}
.stitle {
  font-size: 35px;
  font-weight: 700;
}
.scontent {
  margin: 20px 10px;
}
.sbutton {
  background-color: #eda54d;
  color: #fff;
  height: 40px;
  width: 100px;
  outline: none;
  margin: 10px auto;
  border-style: none;
  border-radius: 20px;
}
</style>