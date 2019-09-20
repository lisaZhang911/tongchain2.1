<template>
  <div class="mobile-padding">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'绑定溯源码'" />
    <div class="header">
      <div class="code">
        <div class="subheading" :class="{mb40:$store.getters.isPC}">选择待绑码产品</div>
        <AutoComplete
          :data="prod_auto"
          :filter-method="filter_auto"
          @on-change="getProdId"
          placeholder="查询产品"
          style="width:100%">
        </AutoComplete>
        <!-- <Select v-model="bindParam.product_id" v-show="$store.getters.isPC">
          <Option v-for="i in prodList" :value="i.id" :key="i.id">{{i.name}}</Option>
        </Select>
        <select v-show="!$store.getters.isPC" class="originalSelect" style="width:100%" v-model="bindParam.product_id">
            <option v-for="i in prodList" :value="i.id">{{i.name}}</option>
        </select> -->
      </div>
      <div class="code">
        <div class="subheading" :class="{mb40:$store.getters.isPC}">选择批次</div>
        <AutoComplete
          :data="lot_auto"
          :filter-method="filter_auto"
          @on-change="getLotId"
          placeholder="查询批次"
          style="width:100%">
        </AutoComplete>
        <!-- <Select v-model="bindParam.lot_id" v-show="$store.getters.isPC">
          <Option v-for="i in lotList" :value="i.id" :key="i.id">{{i.name}}</Option>
        </Select> -->
      </div>
      <div class="code">
        <div class="subheading" :class="{mt25:!$store.getters.isPC}">防伪溯源码</div>
        <div class="tip">不可添加与已添加码同属的箱码或盒码.最多10个码</div>
        <Input
          class="input"
          v-model="code"
          placeholder="此处可填箱码与盒码，箱码将一次性绑定其下所有盒码" />
      </div>
      <div class="btns" :class="{ml15:$store.getters.isPC}">
        <Button v-show="!$store.getters.isPC" style="margin-right:0" class="btn" id="btn1" shape="circle" @click="scanCode()" :disabled="data1.length >= 10">扫码</Button>
        <Button v-show="$store.getters.isPC" style="margin-right:0" class="btn" id="btn1" shape="circle" @click="add()" :disabled="data1.length >= 10">添加</Button>
        <Button v-show="$store.getters.isPC" style="margin-right:0" class="btn" id="btn2" shape="circle" @click="empty()">清空</Button>
      </div>
    </div>
    <Table :class="{mob_table:!$store.getters.isPC}" class="table1" :row-class-name="rowClassName" :columns="columns1" :data="data1"></Table>
    <Buttons :class="{mob_btn:!$store.getters.isPC}" :btnText="'确认绑定'" @confirm="submit()" :disabled="data1.length === 0" />

    <Table class="table2" v-show="resultArr.length>0" :row-class-name="rowClassName" :columns="columns2" :data="resultArr"></Table>
  </div>
</template>

<script>
import wx from 'weixin-jsapi'
import {mapActions,mapGetters} from 'vuex'
import publicFunc from '../../../utils/public.js'

  export default {
    data() {
      return {
        code:'',
        contrastCodeArr_big:[],
        contrastCodeArr_sub:[],
        index:0,
        totalIndex:0,
        start_time:'',
        end_time:'',
        resultArr:[],
        spinShow:false,
        lotName:'',
        lotNumber:'',
        queryParam:{
          name:'',
          start_time:'',
          end_time:''
        },
        bindParam:{},
        lotList:[],
        prodList:[],
        prod_auto:[],
        lot_auto:[],
        product: '',
        current: 1,
        pageSize: 10,
        columns1: [{
          title: '商品名',
          align: 'center',
          render:(h,param) => {
            var id = param.row.product_id
            for(var i of this.prodList){
              if(id==i.id){
                return h('span',i.name)
              }
            }
          }
        },{
          title: '批次名',
          align:'center',
          render:(h,param) => {
            var r = this.lotList.find(i => {
              return i.id == param.row.lot_id
            })
            if(r){
              return h('span',r.name)
            }
          }
        },{
          title: '批次号',
          align:'center',
          render:(h,param) => {
            var r = this.lotList.find(i => {
              return i.id == param.row.lot_id
            })
            if(r){
              return h('span',r.lot_number)
            }
          }
        },{
          title: '溯源码',
          align: 'center',
          key: 'code'
        },{
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
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        columns2: [{
            title: '产品名称',
            align:'center',
            render:(h,param) => {
              var id = param.row.product_id
              for(var i of this.prodList){
                if(id==i.id){
                  return h('span',i.name)
                }
              }
            }
          },{
            title: '批次名',
            align:'center',
            render:(h,param) => {
              var r = this.lotList.find(i => {
                return i.id == param.row.lot_id
              })
              if(r){
                return h('span',r.name)
              }
            }
          },{
            title: '批次号',
            align:'center',
            render:(h,param) => {
              var r = this.lotList.find(i => {
                return i.id == param.row.lot_id
              })
              if(r){
                return h('span',r.lot_number)
              }
            }
          },{
            title: '溯源码',
            align:'center',
            key: 'code'
          },{
            title: '绑定结果',
            align:'center',
            render:(h,param) => {
              if((typeof param.row.result) == 'boolean'){
                return h('span','成功')
              } else {
                return h('span',param.row.result)
              }
            }
          }],
        data1: []
      }
    },
    watch:{
      data1:function(val){
        this.contrastCodeArr_sub = []
        val.forEach(item => {
          this.contrastCodeArr_sub.push(item.code)
        })
      },
      queryLot_result:function(val){
        if(val instanceof Array){
          this.$set(this,'lotList',val)
          var arr = val.map(i => i.name)
          this.lot_auto = arr
        }
      },
      searchProResult:function(val){
        if(val instanceof Array){
          this.$set(this,'prodList',val)
          var arr = val.map(i => i.name)
          this.prod_auto = arr
        }
      }
    },
    computed: {
      ...mapGetters([
        'queryLot_result',
        'searchProResult'
      ]),
    },
    methods: {
      ...mapActions([
        'queryLot_',
        'searchPro',
        'bind_secuCode',
        'getWechat',
        'queryLot_'
      ]),
      query_lot(){
        this.queryLot_(this.queryParam)
      },
      getDate(val,str){
        if(this.$store.getters.isPC){
          this.queryParam.start_time=new Date(`${val[0]} 00:00:00`).toISOString()
          this.queryParam.end_time=new Date(`${val[1]} 23:59:59`).toISOString()
        } else {
          if(str=='start'){
           this.queryParam.start_time = new Date(`${val} 00:00:00`).toISOString()
          }
          if(str == 'end'){
            this.queryParam.end_time = new Date(`${val} 23:59:59`).toISOString()
          }
        }
      },
      filter_auto(val,option){
        return option.indexOf(val) !== -1;
      },
      getProdId(val){
        var re = this.prodList.find(i => {
          return i.name == val
        })
        if(re){
          this.bindParam.product_id = re.id
        }
      },
      getLotId(val){
        var re = this.lotList.find(i => {
          return i.name == val
        })
        if(re){
          this.bindParam.lot_id = re.id
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
            },
            fail: function(res){
              _self.$Message.error('扫码失败')
            }
          });
      },
      addFunc(){
        var newObj = {}
        for(var i of Object.keys(this.bindParam)){
          newObj[i] = this.bindParam[i]
        }
        newObj.code = this.code.trim()
        this.data1.push(newObj)
        // this.code = ''
        // this.$set(this,'bindParam',{})
      },
      add() {
        var code = this.code.trim()
        //检测是否有空以及格式是否正确
        if(!publicFunc.verifyCode(code) || this.bindParam.product_id==undefined ){
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

        this.addFunc()
        // this.$parent.$emit('varHeight')
      },
      empty() {
        this.data1 = []
        this.$parent.$emit('varHeight')
      },
      bindFunc(index){
          this.spinShow = true

          this.bind_secuCode({infos:[this.data1[index]]}).then(resp => {
            this.spinShow = false

            if(resp.data){
              var newObj = Object.assign(this.data1[index],{result:resp.data.success})
              this.resultArr.push(newObj)
            } else {
              var newObj = Object.assign(this.data1[index],{result:resp.error_msg})
              this.resultArr.push(newObj)
            }

            this.$set(this,'index',this.index+1)

            if(this.index < this.totalIndex){
              this.bindFunc(this.index)
            } else {
              this.data1 = []
            }
          })
      },
      submit() {
        this.totalIndex = this.data1.length
        this.index = 0
        this.resultArr = []

        if(!this.data1){
          this.$Message.warning('无数据可绑定')
          return
        }
        this.bindFunc(this.index)
      },
      columns_mob(){
        this.$set(this.columns1[0],'width',100)
        this.$set(this.columns1[1],'width',100)
        this.$set(this.columns1[2],'width',120)
        this.$set(this.columns2[2],'width',120)
        this.$set(this.columns1[3],'width',120)
        this.$set(this.columns2[3],'width',120)
        this.$set(this.columns1[4],'width',80)
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
      // console.log(this.$router.currentRoute);
      //获取批次列表-新系统
      this.queryLot_({per_page_num: 999999,page_idx: 1})
      //获取产品
      this.searchPro({per_page_num: 999999,page_idx: 1})
      //获取微信sdk权限
      if(!this.$store.getters.isPC){
        console.log(location.href);
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
      if(!this.$store.getters.isPC){
        this.columns_mob()
      }
    }
  }
</script>

<style scoped>
  .mob_btn {
    margin-bottom: 20px;
  }
  .product {
    float:right
  }

  .product {
    width: 20%;
  }
  .mt25{
    margin-top: 25px
  }
  .mb40{
    margin-bottom: 40px
  }
  .ml15{
    margin-left: 15px
  }
  .product .subheading {
    margin-bottom: 40px;
  }
  .code{
    width:25%;
    display: inline-block;
  }
  .code .tip {
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
    .header {
      height: auto;
    }
    .code{
      margin-bottom: 10px
    }
    .product,
    .product .select,
    .code,
    .code .input,
    .btns,
    .btns .btn {
      width: 100% !important;
    }
    .product .select {
      margin: 10px 0 24px;
    }
    .product .subheading {
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
      margin-top: 50px;
    }
  }
</style>
