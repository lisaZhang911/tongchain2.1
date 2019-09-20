<template>
  <div class="mobile-padding">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading c-name="产品溯源查询"/>
    <div class="header">
      <div class="subheadings">
        <span class="subheading">追踪查询</span>
      </div>
      <Input class="input" v-model="code" placeholder="请输入要查询的防伪码，仅支持盒码查询，箱码无效" />
      <!-- <Select v-model="sweep_type" style="width:200px;margin-top:25px">
        <Option v-for="item in sweepT_list" :value="item.value" :key="item.value">{{ item.name }}</Option>
      </Select> -->
      <Button v-show="!$store.getters.isPC" class="btn" id="btn1" shape="circle" @click="scanCode()" >扫码</Button>
    </div>
    <hr v-show="$store.getters.isPC" />
    <Buttons :btnText="'查询'" @confirm="confirm()" />
    <div class="resultShow" v-show="flag && sweep_type==1">
      <p>首次密码查询时间：{{first_validTime}}</p>
      <p>查询次数：{{validCount}}</p>
    </div>
    <div class="resultShow" v-show="flag && sweep_type==2">
      <p>防伪码：{{this.code}}</p>
      <h5>流通环节溯源</h5>
      <Table  :row-class-name="rowClassName" :columns="columns_circuEve" :data="circulEve_list"></Table>
      <h5>生产环节溯源</h5>
      <Table  :row-class-name="rowClassName" :columns="columns_prodEve" :data="prodEve_list"></Table>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import {timeExchange,year,month,date,hh,mm,ss} from '../../utils/timeExchange.js'
  import wx from 'weixin-jsapi'
  import publicFunc from '../../utils/public.js'

  export default {
    data() {
      return {
        flag:false,
        spinShow:false,
        code:'',
        sweep_type:2,
        prod_txt:'',
        first_validTime:'',
        validCount:'',
        trace_events_list:[],
        procesorList:[],
        circulEve_list:[],
        prodEve_list:[],
        prodList:[],
        agencyList:[],
        circuleList:[],
        sweepT_list:[{name:'防伪码查询',value:1},{name:'溯源码查询',value:2}],
        queryCodeObj:{},
        columns_prodEve:[{
          title:'溯源类型',
          align:'center',
          render:(h) => {
            return h('span','生产环节溯源')
          }
        },{
          title:'批次号',
          align:'center',
          key:'lot_num'
        },{
          title:'地点',
          align:'center',
          key:'place'
        },{
          title:'时间',
          align:'center',
          render: (h,param) => {
            timeExchange(param.row.trace_time)
            return h('span',`${year}年${month}月${date}日-${hh}：${mm}：${ss}`)
          }
        },{
          title:'溯源事件',
          align:'center',
          render: (h,param) => {
            var trace_txt = this.transfer_traceEve(param.row.trace_event_id)
            if(trace_txt instanceof Array){
              return h('span',trace_txt[0])
            } else if(typeof trace_txt == 'string'){
              return h('span',trace_txt)
            }
          }
        },{
          title:'溯源事件描述',
          align:'center',
          render: (h,param) => {
            var trace_txt = this.transfer_traceEve(param.row.trace_event_id)
            if(trace_txt instanceof Array){
              return h('span',trace_txt[1])
            } else if(typeof trace_txt == 'string'){
              return h('span',trace_txt)
            }
          }
        }],
        columns_circuEve:[{
          title:'溯源类型',
          align:'center',
          render: (h) => {
            return h('span','流通环节溯源')
          }
        },{
          title:'事件操作员',
          align:'center',
          render:(h,param) => {
            var r = this.procesorList.find(i => {
              return i.id == param.row.operator_id
            })
            if(r){
              return h('span',r.name)
            }
          }
        },{
          title:'地点',
          align:'center',
          key:'place'
        },{
          title:'快递',
          align:'center',
          key:'express'
        },{
          title:'运单号',
          align:'center',
          key:'express_order'
        },{
          title:'时间',
          align:'center',
          render: (h,param) => {
            timeExchange(param.row.trace_time)
            return h('span',`${year}年${month}月${date}日-${hh}：${mm}：${ss}`)
          }
        },{
          title:'溯源事件',
          align:'center',
          render: (h,param) => {
            var trace_txt = this.transfer_traceEve(param.row.trace_event_id)
            if(trace_txt instanceof Array){
              return h('span',trace_txt[0])
            } else if(typeof trace_txt == 'string'){
              return h('span',trace_txt)
            }
          }
        },{
          title:'溯源事件描述',
          align:'center',
          render: (h,param) => {
            var trace_txt = this.transfer_traceEve(param.row.trace_event_id)
            if(trace_txt instanceof Array){
              return h('span',trace_txt[1])
            } else if(typeof trace_txt == 'string'){
              return h('span',trace_txt)
            }
          }
        }]
      }
    },
    watch:{
      queryEveOpetor_re:function(val){
        this.procesorList = val
      },
      queryCode:function(val){
        if(this.sweep_type == 1){
          this.validCount = val.valid_count
          if(typeof val.first_valid_time == 'string'){
            timeExchange(val.first_valid_time)
            this.first_validTime = `${year}年${month}月${date}日-${hh}：${mm}：${ss}`
          } else this.first_validTime = '无'
        } else {
          this.circulEve_list = val.circulate_events || []
          this.prodEve_list = val.production_events || []
        }
        this.queryCodeObj = val
      },
      code:function(){
        this.flag = false
      },
      searchProResult:function(val){
        this.prodList = val
      },
      queryAgency_re:function(val){
        this.agencyList = val
      }
    },
    computed:{
      ...mapGetters([
        'searchProResult',
        'queryAgency_re',
        'queryCode',
        'queryEveOpetor_re'
      ])
    },
    methods: {
      ...mapActions([
        'queryCode_trace',
        'searchPro',
        'queryAgency_',
        'getWechat',
        'queryEventOperator_'
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
            },
            fail: function(res){
              alert(res)
            }
          });
      },
      transfer_prod(num){
        for(var item of this.prodList){
          if(item.id == num){
            return item.name
          }
        }
      },
      transfer_traceEve(num){
        var r = this.trace_events_list.find(i => {
          return i.id == num
        })
        if(r){
          return [r.name,r.event_desc]
        }
        return '无'
      },
      transfer_opType(num){
          switch (num) {
            case 0:
              return '绑码'
              break;
            case 1:
              return '发货'
              break;
            case 2:
              return '收货'
              break;
          }
      },
      confirm() {
        if(this.code && this.code.length==16){
          this.spinShow=true

          this.queryCode_trace({code:this.code.trim(),sweep_type:this.sweep_type}).then(resp => {
            this.spinShow=false
            this.flag = true
            if(resp.error_msg){
              this.$Message.error(resp.error_msg)
              return
            }
            this.trace_events_list = resp.data.trace_events || []
          })
        } else {
          this.$Message.warning('请输入需追踪的防伪码且必须为小码')
        }
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
      //获取产品列表
      this.searchPro({per_page_num: 999999,page_idx: 1})
      //获取代理商列表
      this.queryAgency_({})
      // 获取事件记录员列表
      this.queryEventOperator_()

      if(!this.$store.getters.isPC){
        //获取微信sdk权限
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
    }
  }
</script>

<style scoped>
  .input {
    width: 314px;
    margin-top: 25px;
  }
  .resultShow {
    padding-top: 30px;
  }
  .resultShow p {
    font-size: 15px;
    margin-bottom: 10px;
  }
  @media (max-width: 768px) {
    .header {
      height: auto;
    }
    .input {
      width: 100%;
      margin: 10px 0 12px;
    }
    #btn1{
      width:100%
    }
  }
</style>
