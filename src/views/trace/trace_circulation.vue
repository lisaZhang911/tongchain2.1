<template>
  <div id="">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading style="margin-bottom:20px" :c-name="'流通环节溯源'" :btn-add="true" @add="add()"/>
    <!-- 新增 -->
    <Modal v-model="addModal" :mask-closable="false" @on-ok="addCircul('add_form')">
      <Form ref="add_form" :model="circulateItem" :rules="ruleValidate">
        <FormItem label="溯源事件" prop="trace_event_id">
          <Select v-model="circulateItem.trace_event_id" style="width:300px">
            <Option v-for="i in traceCatg_circul" :key="i.id" :value="i.id">{{i.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="地点" prop="place">
          <Input v-model="circulateItem.place"></Input>
        </FormItem>
        <FormItem label="快递公司" prop="express">
          <Select v-model="circulateItem.express" style="width:200px" @on-change="expressVal">
            <Option v-for="item in expressList" :value="item.name" :key="item.value" >{{ item.name }}</Option>
          </Select>
          <Input v-model="express_name" v-show="express_manully" placeholder="输入快递公司名" style="margin-top:10px"></Input>
        </FormItem>
        <FormItem label="快递号" prop="express_order">
          <Input v-model="circulateItem.express_order"></Input>
        </FormItem>
      </Form>
      <div class="modalForm">
        <label>防伪码组</label>
        <input v-model="newCode" style="margin-right:5px" placeholder="输入防伪码">
        <button style="cursor:pointer" v-show="$store.getters.isPC" @click="add_codeArr">添加</button>
        <button v-show="!$store.getters.isPC" style="cursor:pointer" @click="scanCode">扫码</button>
        <ul style="width:85%;font-size:15px;margin-top:5%;margin-left:3%">
          <li v-for="(i,index) in circulateItem.codes" :key="i">{{i}} <button style="float:right;font-size:15px;cursor:pointer" @click="deletItem(index)"><Icon type="md-close" /></button> </li>
        </ul>
      </div>
    </Modal>
    <!-- 移动端-新增 -->
    <div class="mobForm" v-show="!$store.getters.isPC && circul_form">
      <div class="mobForm_title">
        <a @click="goback('circul_form')" class="backIcon" style="position:absolute"><Icon type="ios-arrow-back" /></a>
        <h2 class="title">{{head}}</h2>
        <button type="button" @click="addCircul">保存</button>
      </div>
      <div class="mobForm_item">
        <label>溯源事件类型</label>
        <select v-show="!$store.getters.isPC" class="originalSelect" v-model="circulateItem.trace_event_id">
          <option v-for="i in traceCatg_circul" :value="i.id">{{i.name}}</option>
        </select>
      </div>
      <div class="mobForm_item">
        <label>地点</label>
        <input type="text" v-model="circulateItem.place"/>
      </div>
      <div class="mobForm_item">
        <span>快递公司</span>
        <Select v-model="circulateItem.express" style="width:200px">
          <Option v-for="item in expressList" :value="item.name" :key="item.value">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="mobForm_item">
        <span>运单号</span><input style="width:300px" type="text" v-model="circulateItem.express_order">
      </div>
      <div class="mobForm_item">
        <label>防伪码组</label>
        <input v-model="newCode" style="margin-right:5px" placeholder="输入防伪码"> <button @click="add_codeArr">扫码</button>
        <ul>
          <li v-for="(i,index) in circulateItem.codes" :key="i">{{i}} <button @click="deletItem(index)">&times;</button> </li>
        </ul>
      </div>
    </div>
    <!-- 删除 -->
    <Modal v-model="deletModal" :mask-closable="false" title="删除流通环节溯源事件" @on-ok="del_traceCirculate">
      <p>确定删除防伪码为 <span style="font-weight:bold">{{currentCode}}</span>的流通环节？</p>
    </Modal>
    <Input v-model="code" placeholder="输入防伪码查询" style="margin-right:5px" :class="{pcWid:$store.getters.isPC}"/><Button type="primary" @click="query_trace">搜索</Button>
    <div class="table-view" style="margin-top:10px">
    <Table v-show="flag=='search'" :row-class-name="rowClassName" :columns="columns" :data="traceCircul_Event_List"></Table>
    <Table v-show="flag=='result'" :row-class-name="rowClassName" :columns="columns_resul_new" :data="reasult_new"></Table>
    <button v-show="!$store.getters.isPC" @click="mob_add" type="button" class="mob_addBtn" >新增</button>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-jsapi'
import {mapActions,mapGetters} from 'vuex'
import {year,month,date,hh,mm,ss,timeExchange} from '../../utils/timeExchange.js'
import delivery from '../../utils/deliveryCompany.js'
import publicFunc from '../../utils/public.js'

export default {
  data(){
    return {
      flag:'',
      reasult_new:[],
      onlyNewCode:true,
      express_name:'',
      express_manully:false,
      spinShow:false,
      circul_form:false,
      head:'',
      addModal:false,
      deletModal:false,
      currentId:-1,
      expressList: delivery,
      circulateItem:{codes:[]},
      currentCode:'',
      code:'',
      newCode:'',
      traceCircul_Event_List:[],
      add_traceCircul_info:[],
      traceCatg_circul:[],
      trace_cate:-1,
      ruleValidate:{
        trace_event_id:[
          {required:true, type:'number', message:'必填', trigger:'change'}
        ],
        place:[
          {required:true, message:'必填', trigger:'blur'}
        ],
        express:[
          {required:true, message:'必选', trigger:'change'}
        ],
        express_order:[
          {required:true, message:'必填', trigger:'blur'}
        ]
      },
      columns_resul_new:[{
        title:'序列',
        align: 'center',
        render: (h,param) => {
          return h('span',param.index+1)
        }
      },{
        title:'溯源码',
        align: 'center',
        key:'code'
      },{
        title:'结果',
        align: 'center',
        render: (h,param) => {
          if(param.row.success){
            return h('span','成功')
          } else return h('span',param.row.error)
        }
      }],
      columns:[{
        title:'溯源事件类别',
        align: 'center',
        render:(h,param) => {
          var newArr = this.traceCatg_circul.map((item) => {
            if(item.id == param.row.trace_event_id){
              return h('span',item.name)
            }
          })
          return h('div',newArr)
        }
      },
        {
          title:'地点',
          align: 'center',
          key:'place'
        },{
          title:'快递',
          align: 'center',
          key:'express'
        },{
          title:'运单号',
          align: 'center',
          key:'express_order'
        },{
          title:'防伪码',
          align: 'center',
          key:'code'
        },{
          title:'创建时间',
          align: 'center',
          render:(h,param) => {
            timeExchange(param.row.created_time)
            return h('span',`${year}年${month}月${date}日-${hh}:${mm}:${ss}`)
          }
        }]
    }
  },
  computed:{
    ...mapGetters([
      'circuTraceResult',
      'queryTraceCatg_re',
      'addCirculate_result',
      'query_optionCodeList'
    ])
  },
  watch:{
    query_optionCodeList:function(val){
      console.log('search',val);
      this.reasult_new = []
    },
    addCirculate_result:function(val){
      this.traceCircul_Event_List = []
      val.forEach((i,index) => {
        i.code = this.circulateItem.codes[index]
      })
      console.log('add',val);
      this.reasult_new = val
    },
    circuTraceResult:function(val){
      this.reasult_new = []
      this.$set(this,'traceCircul_Event_List',val)
    },
    queryTraceCatg_re:function(val){
      val.forEach(i => {
        if(i.type == 1){
          this.traceCatg_circul.push(i)
        }
      })
    }
  },
  methods: {
    ...mapActions([
      'queryTraceCatg_',
      'addCirculateTrace',
      'circul_trace',
      'queryOptionCode_trace',
      'del_traceCirculate_',
      'getWechat'
    ]),
    goback(str){
      this.$set(this,str,false)
      this.circulateItem = {}
    },
    mob_add(){
      this.circul_form=true
      this.head='新增流通环节溯源'
    },
    expressVal(val){
      if(val == '其他'){
        this.express_manully = true
      } else {
        this.express_manully = false
        this.express_name = ''
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
             _self.add_codeArr()
          },
          fail: function(res){
            _self.$Message.error(res)
          }
        });
    },
    add_codeArr(){
      var code = this.newCode.trim()
      // var emptyArr = []
      if(!publicFunc.verifyCode(code) || !code){
        this.$Message.warning('请输入正确的溯源码')
        return
      }
      // emptyArr.push(this.newCode.trim())
      // console.log('empSrr',emptyArr);
      this.circulateItem.codes.push(code)
      this.onlyNewCode = publicFunc.verifyCode(this.circulateItem.codes[0])
      this.$set(this,'newCode','')
    },
    deletItem(index){
      this.circulateItem.codes.splice(index,1)
    },
    add(){
      this.circulateItem = {}
      this.circulateItem.codes = []
      this.$set(this,'addModal',true)
    },
    addCirculFunc(){
      this.flag = 'result'
      this.spinShow=true
      if(this.express_name){
        this.circulateItem.express = this.express_name
      }
      this.addCirculateTrace(this.circulateItem).then((msg) => {
        this.spinShow=false
        this.circul_form=false

        if(msg || msg==undefined){
          this.$Message.error(msg || '添加失败')
          return
        }
        // this.$Message.success('新建流通环节溯源事件成功')
      }).catch(() => this.spinShow = false)
    },
    addCircul(name){
      var adVice = this.$store.getters.isPC
      if(adVice){
        publicFunc.validateForm.apply(this,[name,this.addCirculFunc,this.add])
      } else {
        if(Object.keys(this.circulateItem).length<5){
          this.$Message.warning('请填满所有数据')
          return
        }
        this.addCirculFunc()
      }
    },
    query_trace(){
      this.flag = 'search'
      var code = this.code.trim()
     if(publicFunc.verifyCode(code)){
        this.circul_trace({code:code})
      } else { this.$Message.warning('请输入正确的溯源码') }
    },
    delTrace_circulateM(row){
      this.$set(this,'currentId',row.id)
      this.$set(this,'currentCode',row.code)
      this.$set(this,'deletModal',true)
    },
    del_traceCirculate(){
      this.del_traceCirculate_(
        {id:this.currentId,code:this.code}
      ).then((msg) => {
        if(msg){
          this.$Message.error(msg)
          return
        }
        this.$Message.success('删除成功')
        this.circul_trace({code:this.code})
      })
    },
    column_mob(){
      if(this.$store.getters.isPC){
        return
      }
      this.$set(this.columns[0],'fixed','left')
      this.$set(this.columns[0],'width',100)
      this.$set(this.columns[1],'width',100)
      this.$set(this.columns[2],'width',100)
      this.$set(this.columns[3],'width',100)
      this.$set(this.columns[4],'width',200)
      this.$set(this.columns[5],'width',200)
      this.$set(this.columns[6],'width',100)
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
    this.queryTraceCatg_({})
    //获取微信sdk权限
    if(!this.$store.getters.isPC){
      this.getWechat({url:location.href.split('#')[0]}).then(resp => {
        var respData = resp.data
        wx.config({
          debug: true,
          appId: respData.appid,
          timestamp: respData.time,
          nonceStr: respData.noncestr,
          signature: respData.signature,
          jsApiList: ['scanQRCode']
       });
      })
    }
    //移动端-表格
    this.column_mob()
  }
}
</script>

<style scoped>
.originalSelect{
  width: 70%
}
.ivu-input-wrapper {
  width: 70%;
}
.pcWid {
  width:300px;
}
</style>
