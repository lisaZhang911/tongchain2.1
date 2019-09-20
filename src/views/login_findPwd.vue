<template>
  <div class="wrap">
    <div class="formBox" v-show="$store.getters.isPC">
      <label><span>请输入账号</span>Account Number</label>
      <div class="inputBox">
        <i><Icon type="ios-calculator" /></i>
        <input v-model="account" type="text" placeholder="输入账号">
      </div>
      <label><span>请输入手机号码</span>Phone Number</label>
      <div class="inputBox">
        <i><Icon type="ios-calculator" /></i>
        <input v-model="tel" type="text" placeholder="输入号码">
      </div>
      <label><span>请输入验证码</span>Login Password </label>
      <div class="inputBox">
        <i><Icon type="md-checkmark-circle-outline" /></i>
        <input v-model="reset_code" type="text" style="width:178px;border-right:0;border-top-right-radius:0;border-bottom-right-radius:0" placeholder="输入验证码"><button v-text="btnTxt" :disabled="verifyBtn_findPwd" class="codeBtn" @click="getVerifyCode_find"></button>
      </div>
      <div class="">
        <label><span>请设置新登录密码</span>Login Password </label>
        <div class="inputBox">
          <i><Icon type="md-finger-print" /></i>
          <input v-model="pwd" type="password" placeholder="输入新密码">
        </div>
      </div>
      <div class="submitBtn">
        <button @click="find_pwd">提交</button>
      </div>
    </div>
    <div class="selector_mob" v-show="!$store.getters.isPC">
      <div class="loginBox_mob">
         <Icon type="ios-phone-portrait" />
         <input type="text" v-model="tel" placeholder="电话号码">
      </div>
      <div class="loginBox_mob">
         <Icon type="ios-phone-portrait" />
         <input type="text" v-model="account" placeholder="登录账号">
      </div>
      <div class="loginBox_mob">
         <i><Icon type="md-checkmark-circle-outline" /></i>
         <input type="text" v-model="reset_code" placeholder="验证码"><button v-text="btnTxt" :disabled="verifyBtn_findPwd" class="codeBtn" style="margin-top:5px" @click="getVerifyCode_find">点击获取验证码</button>
      </div>
      <div class="loginBox_mob">
         <Icon type="md-finger-print" />
         <input type="password" v-model="pwd" placeholder="新密码">
      </div>
      <div class="loginBox_mob">
         <Icon type="md-finger-print" />
         <input type="password" v-model="re_pwd" placeholder="再次输入新密码">
      </div>
      <!-- <router-link to="/loginAdmin">控制台</router-link> -->
      <a style="float:right" @click="changeSelector('A')">注册</a>
      <Button type="primary" class="mob_btn" @click="find_pwd">提交</Button>
      <a style="display:block;text-align:right" @click="changeSelector('B')">登录</a>
    </div>
  </div>
</template>
<script>
import { mapActions,mapGetters } from 'vuex'
import publicFunc from '../utils/public.js'

export default {
  data() {
    return {
      btnTxt:"点击获取验证码",
      loginInfo:{},
      sec:60,
      verifyBtn_findPwd:false,
      password:false,
      tel:'',
      account:'',
      reg_code:'',
      pwd:'',
      re_pwd:'',
      reset_code:''
    }
  },
  methods: {
    ...mapActions([
      'registerCode_enterp',
      'getResetCode',
      'findPwd',
      'login_user'
    ]),
    changeSelector(index) {
      this.$emit('mob_select',index)
    },
    countDown(control){
      var timer=setInterval(() => {
        if(this.sec<=1){
          clearInterval(timer)
          this.$set(this,'verifyBtn_findPwd',false)
          this.btnTxt = "点击获取验证码"
          return
        }
        this.sec=this.sec-1
        this.btnTxt = `${this.sec}秒`
      },1000)
    },
    getVerifyCode_find(){
      this.verifyBtn_findPwd=true

      const load = this.$Message.loading({
                    content: '发送验证码...',
                    duration: 0
                });

      this.getResetCode({
        tel:this.tel.trim(),
        account:this.account.trim()
      }).then((msg) => {
        setTimeout(load, 300);
        if(msg || msg==undefined){
          this.$set(this,'verifyBtn_findPwd',false)
          this.$Message.error(msg || '发送信息失败请再试')
          return
        }
        this.$Message.success('请注意查收短信')
        this.countDown()
      })
    },
    find_pwd(){
      var result = publicFunc.verifyPwd(this.pwd.trim())
      if(!result){
        this.$Message.warning("密码必须包含数字和字母")
        return
      }
      const load = this.$Message.loading({
                    content: '登录中...',
                    duration: 0
                });
      this.findPwd({
        tel:this.tel.trim(),
        account:this.account.trim(),
        pwd:this.pwd.trim(),
        reset_code:this.reset_code.trim()
      }).then(msg => {
        setTimeout(load,100)
        if(msg || msg==undefined){
          this.$Message.error(msg || '找回密码失败')
          return
        }
        this.$Message.success('找回密码成功')
        this.loginInfo.account=this.tel.trim()
        this.loginInfo.password=this.pwd.trim()
        this.login(this.loginInfo,this.tel)
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
    }
  }
}
</script>

<style lang='less'>
</style>
