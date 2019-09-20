<template>
  <div class="mobile-padding">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'产品发货'"/>
    <div class="header">
      <div class="agent">
        <div class="subheading">选择代理商进行发货</div>
        <div class="tip" v-show="$store.getters.isPC">一次仅可选择一个代理商</div>
        <AutoComplete
          :data="agent_auto"
          :filter-method="filter_auto"
          @on-change="getAgentId"
          :placeholder="agent_txt"
          style="width:100%">
        </AutoComplete>
        <!-- <Select v-model="deliveryInfo.agency_id" v-show="$store.getters.isPC" @on-change="getChange">
          <Option v-for="i in agentList" :value="i.id" :key="i.id">{{i.authorization}}</Option>
        </Select>
        <select v-show="!$store.getters.isPC" class="originalSelect" style="width:100%" v-model="deliveryInfo.agency_id">
            <option v-for="i in agentList" :value="i.id">{{i.authorization}}</option>
        </select> -->
      </div>
      <div class="code" :class="{ml15:$store.getters.isPC,mt10:!$store.getters.isPC}">
        <div class="subheading">产品防伪码</div>
        <div class="tip">不可添加与已添加码同属的箱码或盒码.最多10个码</div>
          <Input v-model="code" class="input" placeholder="箱码与盒码均可，箱码将一次性对其下所有盒码进行操作" />
      </div>
      <div class="btns" :class="{ml15:$store.getters.isPC}">
        <Button v-show="!$store.getters.isPC" class="btn" id="btn1" shape="circle" @click="scanCode()" :disabled="data1.length >= 10">扫码</Button>
        <Button v-show="$store.getters.isPC" class="btn" id="btn1" shape="circle" @click="add()" :disabled="data1.length >= 10">添加</Button>
        <Button v-show="$store.getters.isPC" class="btn" id="btn2" shape="circle" @click="empty()" :disabled="data1.length < 1">清空</Button>
      </div>
     </div>
     <Table class="table1" :row-class-name="rowClassName" :columns="columns1" :data="data1"></Table>
     <Buttons :class="{mob_btn:!$store.getters.isPC}" :btnText="'确认发货'" @confirm="submit" :disabled="data1.length === 0" />
     <Table class="table2" v-show="resultArr.length>0" :row-class-name="rowClassName" :columns="columns2" :data="resultArr"></Table>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import publicFunc from '../../../utils/public.js'
import wx from 'weixin-jsapi'

  export default {
    data() {
      return {
        contrastCodeArr_big:[],
        contrastCodeArr_sub:[],
        agent_auto:[],
        spinShow:false,
        index:0,
        totalIndex:0,
        agentList: [],
        code:'',
        testObj:{},
        deliveryInfo:{
          agency_id:"",
          codes:[]
        },
        current: 1,
        pageSize: 10,
        columns1: [{
            title: '代理商授权名',
            align: 'center',
            render:(h,param) => {
              var key = 'authorization'
              for(var i of this.agentList){
                for(var j in i){
                  if(j=='id' && i[j]==param.row.agency_id){
                    return h('span',i[key])
                  }
                }
              }
            }
          },
          {
            title: '防伪码',
            align: 'center',
            render:(h,param) => {
              return h('span',param.row.code)
            }
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
                      this.data1.splice(params.index, 1)
                      this.deliveryInfo.codes.splice(params.index, 1)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        columns2: [
          {
            title: '发货至(代理商)',
            align:'center',
            render:(h,param) => {
              for(var i of this.agentList){
                if(i.id == param.row.agency_id){
                  return h('span',i.authorization)
                }
              }
            }
          },
          {
            title: '发货防伪码',
            align:'center',
            key: 'codes'
          },
          {
            title: '结果',
            align:'center',
            key: 'result',
          }
        ],
        data1: [],
        resultArr: []
      }
    },
    computed: {
      ...mapGetters([
        'queryAgency_re',
      ]),
      agent_txt(){
        return this.$store.getters.isPC?'查询代理商':'查询代理商,一次仅可选择一个代理商'
      }
    },
    watch:{
      data1:function(val){
        this.contrastCodeArr_big = []
        this.contrastCodeArr_sub = []
        val.forEach((item) => {
          if(item.code.length==14){
            this.contrastCodeArr_big.push(item.code)
          } else {
            this.contrastCodeArr_sub.push(item.code)
          }
        })
      },
      queryAgency_re:function(val){
        this.$set(this,'agentList',val.filter(i => i.actived))
        var arr = this.agentList.map(i => i.authorization)
        this.agent_auto = arr
      }
    },
    methods: {
      ...mapActions([
        'queryAgency_',
        'deliver_goods',
        'getWechat'
      ]),
      filter_auto(val,option){
        return option.indexOf(val) !== -1;
      },
      getAgentId(val){
        var r = this.agentList.find(i => i.authorization == val)
        if(r){
          this.deliveryInfo.agency_id = r.id
        }
      },
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
      getChange(e){
        this.data1.forEach(item => {
          item.agency_id = e
        })
      },
      add() {
        var newObj = {}
        var code = this.code.trim()
        //是否填满数据，格式是否正确
        if(typeof this.deliveryInfo.agency_id!='number' || !publicFunc.verifyCode(code)){
           this.$Message.warning('请输入正确数据')
           return
        }
        //是否重复
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

        this.deliveryInfo.codes.push(code)

        newObj.agency_id = this.deliveryInfo.agency_id
        newObj.code = code


        this.data1.push(newObj)

        this.$set(this,'code','')
        // this.$parent.$emit('varHeight')
      },
      empty() {
        this.data1 = []
        this.$parent.$emit('varHeight')
      },
      deliverGood_func(index){
        this.spinShow = true
        var originalObj = {agency_id:this.deliveryInfo.agency_id,codes:this.deliveryInfo.codes[index]}

        this.deliver_goods({
          agency_id:this.deliveryInfo.agency_id,
          codes:[this.deliveryInfo.codes[index]]}).then(msg => {
            this.spinShow = false
            if(msg){
              var newObj = Object.assign(originalObj, {result:msg})
              this.resultArr.push(newObj)
            } else {
              var newObj = Object.assign(originalObj, {result:'成功'})
              this.resultArr.push(newObj)
            }

            this.$set(this,'index',this.index+1)

            if(this.index < this.totalIndex){
              this.deliverGood_func(this.index)
            } else {
              this.empty()
              // this.deliveryInfo = {}
              this.deliveryInfo.codes = []
            }
        })
      },
      submit() {
        this.totalIndex = this.data1.length
        this.index = 0
        this.resultArr = []


        this.deliverGood_func(this.index)
        // this.$parent.$emit('varHeight')
      },
      columns_mob(){
        this.$set(this.columns1[1],'width',150)
        this.$set(this.columns2[1],'width',150)
        this.$set(this.columns1[2],'width',100)
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
      //获取代理商
      this.queryAgency_({per_page_num: 999999,page_idx: 1})
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
      //移动端表格
      if(!this.$store.getters.isPC){
        this.columns_mob()
      }
    }
  }
</script>

<style scoped>
.mt10{
  margin-top: 9%
}
.ml15{
  margin-left: 15px
}
.mob_btn {
  margin-bottom: 20px;
}
  .agent,
  .code {
    display: inline-block;
  }

  .agent, .code {
    width: 35%;
  }

  .agent .subheading {
    margin-bottom: 10px;
  }
  .code .tip,
  .agent .tip {
    margin: 10px 0 12px;
  }

  .btns {
    display: inline-block;
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
    margin-top: 100px;
  }

  @media (max-width: 768px) {
    .code .tip{
      margin: 3px 0
    }
    .header {
      height: auto;
    }
    .agent,
    .agent .select,
    .code,
    .code .input,
    .btns,
    .btns .btn {
      width: 100% !important;
    }
    .agent .select {
      margin: 10px 0 24px;
    }
    .agent .subheading {
      margin: 0;
    }
    .btns .btn {
      margin-top: 12px;
    }
    .btns .btn:first-of-type {
      margin-right: 0;
    }
    .table1,
    .table2 {
      margin-top: 20px;
    }
  }
</style>
