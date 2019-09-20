<template>
  <Form ref="formValidate" :model="formData" :rules="rules" class="mobile-padding">
    <Heading :c-name="'密码修改'" />
    <div class="table-view">
      <div class="table-content" style="min-width: 710px;">
        <div class="header">
          <div class="part">
            <div class="subheading required">旧密码</div>
            <FormItem prop="old">
              <Input class="input" type="password" v-model="formData.old" placeholder="请输入旧密码" />
            </FormItem>
          </div>
          <div class="part">
            <div class="subheading required">新密码</div>
            <FormItem prop="new1">
              <Input class="input" type="password" v-model="formData.new1" placeholder="请输入新密码" />
            </FormItem>
          </div>
          <div class="part">
            <div class="subheading required">再次确认新密码</div>
            <FormItem prop="confirmNew">
              <Input class="input" type="password" v-model="formData.confirmNew" placeholder="请输入新密码" />
            </FormItem>
          </div>
        </div>
      </div>
    </div>
    <hr v-show="$store.getters.isPC" />
    <Buttons :btnText="'确认提交'"  @confirm="handleSubmit('formValidate')" />
  </Form>
</template>

<script>
  import {mapActions,mapGetters} from 'vuex'
  import publicFunc from '../../utils/public.js'

  export default {
    data() {
      return {
        loginPwd:localStorage.getItem('password'),
        formData: {},
        rules: {
          old: [{
            required: true,
            message: '必填',
            trigger: 'blur'
          }],
          new1: [{
            required: true,
            message: '必填',
            trigger: 'blur'
          }],
          confirmNew: [{
            required: true,
            message: '必填',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      ...mapActions([
        'modifyPwd',
        'logout_'
      ]),
      handleSubmit(name) {
        if(this.formData.old != this.loginPwd){
          this.$Message.warning("旧密码错误")
          return
        }
        if(this.formData.new1 != this.formData.confirmNew){
          this.$Message.warning("两次输入不匹配")
          return
        } else {
          var result=publicFunc.verifyPwd(this.formData.new1.trim())
          if(!result){
            this.$Message.warning("密码必须包含数字和字母")
            return
          }
        }
        this.$refs[name].validate((valid) => {
          if(valid) {
            this.modifyPwd({password:this.formData.new1.trim()}).then((msg) => {
              if(msg || msg==undefined){
                this.$Message.error(msg || '修改失败')
                return
              }
              this.$Message.success('修改成功')
              this.logout_()
              setTimeout(() => {
                this.$router.replace('/login')
              },1000)
            })
          } else {
            this.$Message.warning('请设置新密码')
          }
        })
      }
    },
    mounted() {
      localStorage.setItem('pageName','密码修改')
    }
  }
</script>

<style scoped>
  .header {
    height: auto;
    overflow: hidden;
  }
  .input {
    width: 200px;
    margin-top: 40px;
  }
  .part >>> .ivu-form-item-error-tip{
    top: 10% !important;
    color: #ADCD00 !important;
  }
  @media (max-width: 768px) {
    .header {
      height: auto;
    }
    .part,
    .input {
      width: 100%;
      margin-top: 0;
    }
    .part {
      margin-top: 10px;
    }
    .part:not(:first-of-type) {
      margin-left: 0;
    }
    .part >>> .ivu-form-item-error-tip{
      top: 100% !important;
      color: #ADCD00 !important;
    }
  }
</style>
