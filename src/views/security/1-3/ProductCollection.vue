<template>
  <div class="mobile-padding">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'产品收货'" />
    <div class="table-view">
      <div class="table-content" style="min-width: 840px;">
        <div class="header">
          <div class="code">
            <div class="subheading">产品防伪码</div>
            <div class="tip">不可添加与已添加码同属的箱码或盒码.最多10码</div>
            <Input v-model="code"class="input" placeholder="可填箱码与盒码，箱码将一次性对其下所有盒码进行收货" />
          </div>
          <div class="btns">
            <Button v-show="!$store.getters.isPC" class="btn" id="btn1" shape="circle" @click="scanCode" :disabled="codes.length >= 10">扫码</Button>
            <Button v-show="$store.getters.isPC" class="btn" id="btn1" shape="circle" @click="add()" :disabled="codes.length >= 10">添加</Button>
            <Button v-show="$store.getters.isPC" class="btn" id="btn2" shape="circle" @click="empty()">清空</Button>
          </div>
        </div>
        <Table class="table1" :row-class-name="rowClassName" :columns="columns1" :data="codesObjArr"></Table>
        <Buttons :btnText="'确认收货'" @confirm="submit()" :disabled="codesObjArr.length === 0" />
        <Table class="table2" v-show="showResl" :row-class-name="rowClassName" :columns="columns2" :data="resultArr"></Table>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import publicFunc from '../../../utils/public.js'
import wx from 'weixin-jsapi'

  export default {
    data() {
      return {
        onlyNewCode:true,
        contrastCodeArr_big:[],
        contrastCodeArr_sub:[],
        spinShow:false,
        index:0,
        totalIndex:0,
        code:'',
        codes:[],
        codesObjArr:[],
        current: 1,
        pageSize: 10,
        columns1: [{
            title: '序号',
            align: 'center',
            render: (h, params) => {
              let index = params.index + 1 + (this.current - 1) * this.pageSize
              if(index < 10) {
                index = '00' + index
              } else if(index < 100) {
                index = '0' + index
              }
              return h('span', index)
            }
          },
          {
            title: '待收货防伪码',
            align: 'center',
            key:'code'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    shape: 'circle',
                    size: 'small'
                  },
                  attrs: {
                    id: 'btn2'
                  },
                  on: {
                    click: () => {
                      this.codes.splice(params.index, 1)
                      this.codesObjArr.splice(params.index,1)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        columns2: [{
            title: '序号',
            align: 'center',
            render: (h, params) => {
              let index = params.index + 1
              return h('span', String(index).padStart(2,'0'))
            }
          },
          {
            title: '产品防伪码',
            align: 'center',
            key: 'codes'
          },
          {
            title: '收货结果',
            align: 'center',
            key: 'result',
          }
        ],
        resultArr:[]
      }
    },
    watch:{
      codes:function(val){
        this.onlyNewCode = publicFunc.verifyCode(val[0])
        this.contrastCodeArr_big = []
        this.contrastCodeArr_sub = []
        val.forEach((item) => {
          if(item.length==14){
            this.contrastCodeArr_big.push(item)
          } else {
            this.contrastCodeArr_sub.push(item)
          }
        })
      }
    },
    computed:{
      showResl:function(){
        return this.resultArr.length>0
      }
    },
    methods: {
      ...mapActions([
        'take_good',
        'getWechat'
      ]),
      scanCode(){
        var _self = this
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
               var code = res.resultStr.split('=')[1]
               alert(code)
               _self.code = code
               _self.add()
            },fail: function(res){
              _self.$Message.error('扫码失败')
            }
          });
      },
      addFun(){
        var newObj = {}
        newObj.code=this.code.trim()
        this.codesObjArr.push(newObj)
        this.codes.push(this.code.trim())
      },
      add() {
        var code = this.code.trim()
        //判断格式
        if(!publicFunc.verifyCode(code)){
          this.$Message.warning('请输入正确数据')
          return
        }
        //判断是否重复
        if(this.contrastCodeArr_big.indexOf(code)>-1&&code.length==14 || this.contrastCodeArr_sub.indexOf(code)>-1&&code.length==16){
          this.$Message.warning('此码已添加')
          return
        }
        //判断是否存在同属码
        if(code.length==14){
          if(this.contrastCodeArr_sub){
            for(var item of this.contrastCodeArr_sub){
              if(item.slice(0,14) == code){
                  this.$Message.warning(`${code}已添加同属盒码`)
                  return
              }
            }
          }
        } else {
          if(this.contrastCodeArr_big){
            for(var item of this.contrastCodeArr_big){
              if(item == code.slice(0,14)){
                 this.$Message.warning(`${code}已添加同属箱码`)
                 return
              }
            }
          }
        }
        this.addFun()
        // this.$parent.$emit('varHeight')
      },
      empty() {
        this.codes = []
        this.$parent.$emit('varHeight')
      },
      takeGood_func(index){
        this.spinShow = true

        this.take_good({codes:[this.codes[index]]}).then((msg) => {
          this.spinShow = false

          if(msg){
            this.resultArr.push({codes:this.codes[index], result:msg})
          } else {
            this.resultArr.push({codes:this.codes[index], result:'成功'})
          }

          this.$set(this,'index',this.index+1)

          if(this.index < this.totalIndex){
            this.takeGood_func(this.index)
          } else {
            this.empty()
            this.codes = []
            this.codesObjArr = []
          }
        })
      },
      submit() {
        this.index = 0;
        this.totalIndex = this.codesObjArr.length
        this.resultArr = []

        this.takeGood_func(this.index)
      },
      columns_mob(){
        this.$set(this.columns1[2],'width',100)
        this.$set(this.columns1[1],'width',120)
        this.$set(this.columns2[1],'width',120)
      },
      rowClassName(row, index) {
        if(index % 2 === 0) {
          return 'row-odd';
        } else if(index % 2 === 1) {
          return 'row-even';
        }
        return '';
      }
    },
    mounted() {
      if(!this.$store.getters.isPC){
        //获取微信sdk权限
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
      //移动端
      if(!this.$store.getters.isPC){
        this.columns_mob()
      }
    }
  }
</script>

<style scoped>
  .code,
  .btns {
    display: inline-block;
  }

  .code .tip {
    margin: 10px 0 12px;
  }

  .code .input {
    width: 343px;
  }

  .btns {
    width: calc(99.2% - 343px);
    text-align: right;
  }

  .btns .btn {
    width: 80px !important;
    height: 32px !important;
    font-weight: bold;
  }

  .btns .btn:first-of-type {
    margin-right: 20px;
  }

  .table2 {
    margin-top: 20px;
  }

  @media (max-width: 768px) {
    .code .tip{
      margin:3px 0
    }
    .header {
      height: auto;
    }
    .code,
    .code .input,
    .btns,
    .btns .btn {
      width: 100% !important;
    }
    .btns .btn {
      margin-top: 12px;
    }
    .btns .btn:first-of-type {
      margin-right: 0;
    }
    .table1,
    .table2 {
      margin-top: 50px;
    }
  }
</style>
