<template>
  <div class="mobile-padding">
    <Heading :c-name="'标签更换'" />
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="table-view">
      <div class="table-content" style="min-width: 820px;">
        <div class="header">
          <div class="new">
            <div class="subheading">原标签</div>
            <div class="tip">原标签不可被发货/收货操作，不可绑定溯源事件。仅限小码</div>
            <Input v-model="old_code" class="input" :placeholder="placeholder" />
            <Button v-show="!$store.getters.isPC" class="denp_btn" id="btn1" shape="circle" @click="scanCode('old')">扫码</Button>
          </div>
          <div class="new">
            <div class="subheading">新标签</div>
            <div class="tip">新标签不可被使用。仅限小码</div>
            <Input v-model="new_code" class="input" :placeholder="placeholder" />
            <Button v-show="!$store.getters.isPC" class="denp_btn" id="btn1" shape="circle" @click="scanCode">扫码</Button>
          </div>
        </div>
      </div>
    </div>
    <hr v-show="$store.getters.isPC" />
    <Buttons :btnText="'确认提交'" @confirm="confirm()" />
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import publicFunc from '../../../utils/public.js'
import wx from 'weixin-jsapi'

  export default {
    data() {
      return {
        spinShow:false,
        old_code:'',
        new_code:'',
        placeholder: '请输入盒码'
      }
    },
    watch:{
      old_code(val){
        if(publicFunc.verifyCode(val)){
        } else { }
      }
    },
    methods: {
      ...mapActions([
        'change_code',
        'getWechat'
      ]),
      scanCode(...args){
        var _self = this
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
               var code = res.resultStr.split('=')[1]
               if(args[0]=='old'){
                 _self.old_code = code
               } else _self.new_code = code
               _self.add()
            }
          });
      },
      confirm() {
        var oldCode = this.old_code.trim()
        var newCode = this.new_code.trim()
        if(!oldCode || !newCode){
          this.$Message.warning('新旧标签码都要填写')
          return
        }
        if(oldCode.length!=16 || newCode.length!=16){
          this.$Message.warning('只可更换小码')
          return
        }
        //检测是否新旧码混用
        if(publicFunc.verifyCode(oldCode)){
          if(!publicFunc.verifyCode(newCode)){
            this.$Message.warning('请输入正确的标签码')
            return
          }
        } else if(publicFunc.verifyOldCode(oldCode)){
            if(!publicFunc.verifyOldCode(newCode)){
              this.$Message.warning('请输入正确的标签码')
              return
            }
        } else {
          this.$Message.warning('请输入正确的标签码')
        }
        this.spinShow = true

        this.change_code(
          {old_code:oldCode,
          new_code:newCode}).then((msg) => {
            this.spinShow=false
            if(msg){
              this.$Message.error(msg)
              return
            }
            this.$Message.success('更换成功')
          })
      }
    },
    mounted() {
      //获取微信sdk权限
      if(!this.$store.getters.isPC){
        this.getWechat({url:location.href.split('#')[0]}).then(resp => {
          var respData = resp.data
          wx.config({
            debug: false,
            appId: respData.appid,
            timestamp: respData.time,
            nonceStr: respData.noncestr,
            signature: respData.signature,
            jsApiList: ['scanQRCode']
         });
        })
      }
    }
  }
</script>

<style scoped>
  .old,
  .new {
    display: inline-block;
    width: 408px;
  }

  .old {
    width: 408px;
  }

  .input {
    width: 214px;
  }

  .old .input {
    margin-top: 40px;
  }

  .new .tip {
    margin: 10px 0 12px;
  }

  @media (max-width: 768px) {
    .header {
      height: auto;
    }
    .old,
    .new,
    .input {
      float: none;
      width: 100%;
    }
    .new {
      margin: 20px 0;
    }
    .old .input {
      margin-top: 10px;
    }
    .new .tip {
      margin: 10px 0 12px;
    }
  }
</style>
