<template>
  <div class="wrap">
    <div class="formBox" v-show="$store.getters.isPC">
      <label><span>请输入手机号码</span>Phone Number</label>
      <div class="inputBox">
          <i><Icon type="ios-calculator" /></i>
          <input v-model="tel" type="text" placeholder="输入号码">
      </div>
      <label><span>请输入验证码</span>Login Password </label>
      <div class="inputBox">
          <i><Icon type="md-checkmark-circle-outline" /></i>
          <input v-model="reg_code" type="text" style="width:178px;border-right:0;border-top-right-radius:0;border-bottom-right-radius:0" placeholder="输入验证码"><button v-text="btnTxt" :disabled="verifyBtn" class="codeBtn" @click="getVerifyCode"></button>
      </div>
      <div v-show="password">
          <label><span>请设置登录密码</span>Login Password </label>
          <div class="inputBox">
            <i><Icon type="md-finger-print" /></i>
            <input v-model="pwd" type="password" placeholder="输入密码">
          </div>
          <div v-show="password">
            <label><span>请再次输入登录密码</span>Login Password </label>
            <div class="inputBox">
              <i><Icon type="md-finger-print" /></i>
              <input type="password" v-model="re_pwd" placeholder="输入密码">
            </div>
          </div>
      </div>
      <div class="submitBtn">
          <button @click="register">注册</button>
      </div>
    </div>
    <div class="selector_mob" v-show="!$store.getters.isPC">
      <div class="loginBox_mob">
         <Icon type="ios-phone-portrait" />
         <input type="text" v-model="tel" placeholder="电话号码">
      </div>
      <div class="loginBox_mob">
         <Icon type="md-finger-print" />
         <input type="text" v-model="reg_code" placeholder="验证码"><button v-text="btnTxt" :disabled="verifyBtn" class="codeBtn" @click="getVerifyCode"></button>
      </div>
      <div class="loginBox_mob" v-show="password">
         <Icon type="md-finger-print" />
         <input v-model="pwd" type="password" placeholder="输入密码">
      </div>
      <div class="loginBox_mob" v-show="password">
         <Icon type="md-finger-print" />
         <input type="password" v-model="re_pwd" placeholder="再次输入密码">
      </div>
      <!-- <router-link to="/loginAdmin">控制台</router-link> -->
      <a style="float:right" @click="changeSelector('B')">登录</a>
      <Button type="primary" class="mob_btn" @click="register">注册</Button>
      <a style="display:block;text-align:right" @click="changeSelector('C')">找回密码</a>
    </div>
  </div>

</template>
<script>
import { mapActions,mapGetters } from 'vuex'
import publicFunc from '../utils/public.js'

export default {
  name: "",
  data() {
    return {
      btnTxt:"点击获取验证码",
      sec:60,
      verifyBtn:false,
      password:false,
      tel:'',
      account:'',
      reg_code:'',
      pwd:'',
      re_pwd:''
    }
  },
  methods: {
    ...mapActions([
      'login_user',
      'registerCode_enterp',
      'register_enterp',
      'getResetCode',
    ]),
    changeSelector(index){
      this.$emit('mob_select',index)
    },
    countDown(){
      var timer=setInterval(() => {
        if(this.sec<=1){
          clearInterval(timer)
          this.$set(this,'verifyBtn',false)
          this.btnTxt = "点击获取验证码"
          return
        }
        this.sec=this.sec-1
        this.btnTxt = `${this.sec}秒`
      },1000)
    },
    getVerifyCode(){
      this.registerCode_enterp({tel:this.tel.trim()}).then((msg) => {
        if(msg){
          this.$Message.error('发送失败，请再试')
          this.$set(this,'verifyBtn',false)
          return
        }
        this.$Message.success('发送成功')
        this.$set(this,'verifyBtn',true)
        this.$set(this,'password',true)
        this.countDown()
      })
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
        localStorage.setItem('user_name',account)
        // var redirect = this.$router.currentRoute.query.redirect;
        var redirect = '/welcome';
        this.$router.replace(redirect)
      }).catch(() => {
        this.$Message.error('登录失败');
      })
    },
    register(){
      if(this.pwd == this.re_pwd){
        var result = publicFunc.verifyPwd(this.pwd.trim())
        if(!result){
          this.$Message.warning("密码必须包含数字和字母")
          return
        }

        this.register_enterp({
          tel:this.tel.trim(),
          pwd:this.pwd.trim(),
          reg_code:this.reg_code.trim()
        }).then((msg) => {
          if(msg){
            this.$Message.error(msg)
            return
          }
          this.$Message.success('注册成功')
          var regisInfo = {account:this.tel.trim(),password:this.pwd.trim()}
          this.login(regisInfo,this.tel)
        })
      } else {
        this.$Message.warning('两次输入密码不一致')
      }
    }
  },
}
</script>

<style lang='less' scoped>

</style>
