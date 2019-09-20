<template>
  <div class="wrap">
    <div class="formBox" v-show="$store.getters.isPC">
      <label><span>请输入账号</span>Account</label>
      <div class="inputBox">
        <i><Icon type="ios-calculator" /></i>
        <input type="text" v-model="loginInfo.account" placeholder="输入账号">
      </div>
      <label><span>请输入登录密码</span>Login Password </label>
      <div class="inputBox">
        <i><Icon type="md-finger-print" /></i>
        <input type="password" v-model="loginInfo.password" placeholder="输入密码">
      </div>
      <div class="submitBtn">
        <button @click="login_entity">登录</button>
      </div>
    </div>
    <div v-show="!$store.getters.isPC">
      <div class="loginBox_mob" >
         <Icon type="ios-phone-portrait" />
         <input type="text" v-model="loginInfo.account" placeholder="电话号码">
      </div>
      <div class="loginBox_mob">
         <Icon type="md-finger-print" />
         <input type="password" v-model="loginInfo.password" placeholder="登录密码">
      </div>
      <!-- <router-link to="/loginAdmin">控制台</router-link> -->
      <a style="float:right" @click="changeSelector('A')">注册</a>
      <Button type="primary" class="mob_btn" @click="login_entity">登录</Button>
      <a style="display:block;text-align:right" @click="changeSelector('C')">找回密码</a>
    </div>
  </div>
</template>

<script>
import { mapActions,mapGetters } from 'vuex'

export default {
  name: "",
  data() {
    return {
      tel:'',
      account:'',
      pwd:'',
      loginInfo: {
        account: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions([
      'login_user'
    ]),
    changeSelector(index) {
      this.$emit('mob_select',index)
    },
    login_entity(){
      for(var i in this.loginInfo){
        this.loginInfo[i] = this.loginInfo[i].trim()
      }
      this.login(this.loginInfo,this.loginInfo.account)
    },
    login(loginInfo,account){
      const load = this.$Message.loading({
                    content: '登录中...',
                    duration: 0
                });
      this.login_user(loginInfo).then((msg) => {
        setTimeout(load, 300);
        if(msg){
          this.$Message.error(msg)
          return
        }
        // var redirect = this.$router.currentRoute.query.redirect;
        var redirect = '/welcome';
        this.$router.replace(redirect)
      })
    }
  }
}
</script>

<style lang='less'>
</style>
