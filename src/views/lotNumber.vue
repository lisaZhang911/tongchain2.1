<template>
  <div id=""  ref="top">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'生产环节溯源/批次'" :btn-add="true" @add="add()"/>
    <!-- 新增 -->
    <Modal v-model="addModal" title="创建产品批次" @on-ok="addLot('add_form')">
      <Form ref="add_form" :model="lotItem" :rules="ruleValidate">
        <FormItem label="批次名称" prop="name">
          <Input v-model="lotItem.name" style="width:180px"></Input>
        </FormItem>
        <FormItem label="产品" prop="product_id">
          <AutoComplete
            v-model="prodAuto"
            :data="prod_auto"
            :filter-method="filter_auto"
            @on-change="getProdId"
            placeholder="查询产品"
            style="width:200px">
          </AutoComplete>
          <!-- <Select v-show="$store.getters.isPC" v-model="lotItem.product_id" style="width:200px">
            <Option v-for="i in prodList" :key="i.id" :value="i.id">{{i.name}}</Option>
          </Select>
          <select v-show="!$store.getters.isPC" class="originalSelect" v-model="lotItem.product_id">
            <option v-for="i in prodList" :value="i.id">{{i.name}}</option>
          </select> -->
        </FormItem>
      </Form>
    </Modal>
    <!-- 新增生产环节溯源事件 -->
    <Modal v-model="addModal_trace" title="创建生产环节溯源事件" @on-ok="add_prodTrace('add_form_trace')">
      <Form ref="add_form_trace" :model="prodTraceItem" :rules="ruleValidate_trace">
        <FormItem label="溯源事件" prop="trace_event_id">
          <Select v-show="$store.getters.isPC" v-model="prodTraceItem.trace_event_id" style="width:70%">
            <Option v-for="i in traceCatg_prod" :key="i.id" :value="i.id">{{i.name}}</Option>
          </Select>
          <!-- <select v-show="!$store.getters.isPC" style="width:70%" class="originalSelect" v-model="prodTraceItem.trace_event_id">
            <option v-for="i in traceCatg_prod" :value="i.id">{{i.name}}</option>
          </select> -->
        </FormItem>
        <FormItem label="批次编号" prop="lot_num">
          <Input v-model="prodTraceItem.lot_num" style="width:70%" disabled></Input>
        </FormItem>
      </Form>
      <div class="modalForm">
        <label>批次名</label><input type="text" style="width:70%" v-model="lot_num_name" disabled>
      </div>
      <div class="modalForm">
        <label>地点</label><input type="text" style="width:70%" v-model="prodTraceItem.place">
      </div>
    </Modal>
    <!-- 删除 -->
    <Modal v-model="deletModal" title="删除产品批次" @on-ok="delLot">
      <p>确定删除批次名称为 <span style="font-weight:bold">{{currentName}}</span>的批次？</p>
    </Modal>
    <!-- 条件 -->
    <div style="margin:20px 0 10px" >
      <!-- 移动端 -->
      <div :class="{ceiling:ceiling_class}" v-show="false">
        <!-- <Button class="datePicker" type="text" @click="openDatePicker('pickerStart')">起始时间{{mob_startTime}}</Button> -->
        <!-- <mt-datetime-picker ref="pickerStart" type="date" v-model="start_time" ></mt-datetime-picker> -->
        <!-- <Button class="datePicker" type="text" @click="openDatePicker('pickerEnd')">终止时间{{mob_endTime}}</Button> -->
        <!-- <mt-datetime-picker ref="pickerEnd" type="date" v-model="end_time" ></mt-datetime-picker> -->
        <Input class="searchInput" :search="true" enter-button="搜索" @on-search="query_lot" v-model="queryParam.name" placeholder="输入相关批次名称"/>
        <Button :class="{mob_btn:!$store.getters.isPC}" type="primary" @click="query_lot('all')">重置搜索</Button>
      </div>
      <Input  v-show="$store.getters.isPC" :class="{pc_input:$store.getters.isPC}" v-model="queryParam.name" placeholder="输入相关批次名称"/>

      <!-- pc端 -->
      <DatePicker
      v-show="$store.getters.isPC"
      @on-change="getDate"
      type="daterange"
      placement="bottom-end"
      placeholder="选择创建时间范围"
      style="width: 200px;margin-left:10px"></DatePicker>
      <Button v-show="$store.getters.isPC"  type="primary" @click="query_lot">搜索</Button>
      <Button v-show="$store.getters.isPC"  type="primary" @click="query_lot('all')">搜索全部</Button>
    </div>

    <Table :row-class-name="rowClassName" :columns="columns" :data="lotList"></Table>
    <Page class="page" :total="pageTotal" @on-change="pageChange" />
    <button v-show="!$store.getters.isPC" @click="add" type="button" class="mob_addBtn" >新增</button>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import {year,month,date,hh,mm,ss,timeExchange} from '../utils/timeExchange.js'

export default {
  data(){
    return {
      prodAuto:'',
      lot_number:'',
      addModal_trace:false,
      pageTotal:0,
      lot_num_name:'',
      prodTraceItem:{},
      value11:'',
      ceiling_class:false,
      spinShow:false,
      traceCatg_prod:[],
      prodList:[],
      time:'',
      addModal:false,
      deletModal:false,
      currentId:-1,
      currentName:'',
      lotItem:{},
      start_time:'',
      end_time:'',
      queryParam:{
        name:''
      },
      lotList:[],
      prod_auto:[],
      ruleValidate_trace:{
        trace_event_id:[
          {required:true, type:'number', message:'必填', trigger:'change'}
        ],
        lot_num:[
          {required:true, message:'必填', trigger:'blur'}
        ]
      },
      ruleValidate:{
        name:[
          {required:true, message:'必填', trigger:'blur'}
        ]
      },
      columns:[
        {
          title:'序号',
          render:(h,param) => {
            return h('span',param.index+1)
          }
        },{
          title:'批次名称',
          align:'center',
          key:'name'
        },{
          title:'批次号',
          align:'center',
          key:'lot_number'
        },{
          title:'商品',
          align:'center',
          render:(h,param) => {
            var id = param.row.product_id
            if(typeof id == 'string'){
              return h('span',id)
            }
            for(var i of this.prodList){
              if(id==i.id){
                return h('span',i.name)
              }
            }
          }
        },{
          title:'已绑定防伪码数(大码/小码)',
          align:'center',
          key:'already_bind'
        },{
          title:'操作',
          width:250,
          align:'center',
          render:(h,param) => {
            return h('div',[
              h('Button', {
                  props: {
                    shape: 'circle',
                    size: 'small'
                  },
                  attrs: {
                    id: 'btn1'
                  },
                  on: {
                    click: () => {
                      this.$router.replace('/trace/1-8/trace_product?lot_num='+param.row.lot_number+'&lot_name='+param.row.name)
                    }
                  }
                }, '生产环节溯源'),
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
                        this.delLotM(param.row)
                      }
                    }
                  }, '删除')])
          }
        }
      ]
    }
  },
  computed:{
    ...mapGetters([
      'queryLot_result',
      'searchProResult',
      'queryTraceCatg_re',
      'query_ProdTraceList_re'
    ]),
    mob_startTime:function(){
      if(this.start_time){
        var date = new Date(this.start_time)
        this.queryParam.start_time = new Date(this.start_time).toISOString()
        return  `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`
      }
    },
    mob_endTime:function(){
      if(this.end_time){
        var ms = Date.parse(this.end_time)+24*60*60*1000
        var date = new Date(ms)
        this.queryParam.end_time = date.toISOString()
        return  `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`
      }
    }
  },
  watch:{
    query_ProdTraceList_re:function(val){
      console.log(val);
      console.log('lotlist',this.lotList);
    },
    queryTraceCatg_re:function(val){
      val.forEach(i => {
        if(i.type == 2){
          this.traceCatg_prod.push(i)
        }
      })
    },
    queryLot_result:function(val){
      if(val){
        this.$set(this,'lotList',val)
      }
    },
    searchProResult:function(val){
      if(val){
        this.$set(this,'prodList',val)
        var arr = val.map(i => i.name)
        this.prod_auto = arr
      }
    }
  },
  methods: {
    ...mapActions([
      'queryLot_',
      'delLot_',
      'searchPro',
      'addLot_',
      'queryTraceCatg_',
      'addProdTrace_',
      'opLot'
    ]),
    scrol(e){
      this.$refs['top']
      if(this.$refs['top'].scrollTop>100){
        this.ceiling_class = true
      } else this.ceiling_class = false
    },
    getProdId(val){
      var re = this.prodList.find(i => {
        return i.name == val
      })
      if(re){
        this.lotItem.product_id = re.id
      }
    },
    filter_auto(val,option){
      return option.indexOf(val) !== -1
    },
    add_prodTrace(name){
      this.$refs[name].validate((valid) => {
        if(!valid){
          this.$nextTick(() => {
            this.addModal=true
          })
        } else {
          this.spinShow = true
          this.lot_num_name = this.prodTraceItem.lot_num.trim()
          this.addProdTrace_(this.prodTraceItem).then((data) => {
            this.spinShow = false
            var msg = data.error_msg

            if(msg || msg == undefined){
              this.$Message.error(msg ||'添加失败，请再试')
              return
            }
            this.$Message.success('添加成功')
            this.prodTraceItem = {}
            // this.code = this.prodTraceItem.lot_num.trim()
            // this.query_trace()
          })
        }
      })
    },
    openDatePicker(str){
      this.$refs[str].open();
    },
    getLotList(pageIndex,flag){
      if(flag=='all'){
        this.queryParam = {}
      }
      var newQueryParam = Object.assign({per_page_num: 50,page_idx: pageIndex},this.queryParam)
      // var newQueryParam = Object.assign(this.queryParam)
      this.spinShow=true

      this.queryLot_(newQueryParam).then((msg) => {
        var msgTxt = msg.error_msg
        this.spinShow=false

        if(msgTxt || msgTxt==undefined){
          this.$Message.error(msgTxt||'查询失败')
          return
        }
        this.pageTotal = msg.data.page_num*10
      }).catch((error) => {
        this.$Message.error(error)
      })
    },
    pageChange(p){
      this.getLotList(p)
    },
    query_lot(...args){
      this.getLotList(1,args[0])
    },
    add(){
      this.lotItem = {}
      this.prodAuto = ''
      if(this.prodList.length<1){
        this.$Message.info({content:'需先新建产品',duration:3})
        this.$router.replace('/produce/1-1/view_and_add_product')
        return
      }
      this.$set(this,'addModal',true)
    },
    add_prodTrace_page(){
      // this.lot_num_name = this.lotItem.name
      this.prodTraceItem.lot_num = this.lot_number
      if(this.traceCatg_prod.length<1){
        this.$Message.info({content:'需创建溯源事件',duration:3})
        setTimeout(() => {
          this.$router.replace('/trace/1-6/trace_catalogue')
        },5000)
        return
      }
      this.addModal_trace = true
      // this.queryParam.name = this.lotItem.name
      // this.getLotList(1)
      // this.lotItem = {}
    },
    addLot(name){
      this.$refs[name].validate((valid) => {
        if(!valid){
          this.$nextTick(() => {
            this.addModal=true
          })
        } else {
          this.$set(this,'spinShow',true)

          this.addLot_(this.lotItem).then((resp) => {
            console.log(resp);
            var msgTxt = resp.error_msg
            this.$set(this,'spinShow',false)

            if(msgTxt || msgTxt==undefined){
              this.$Message.error(msgTxt || '新建批次失败' )
              return
            }
            this.lot_number = resp.data.lot_number
            console.log(resp);
            this.queryLot_({ per_page_num:999999,page_idx: 1})
            this.$Message.success('新建批次成功' )
            this.lot_num_name = this.lotItem.name
            this.add_prodTrace_page()
          })
        }
      })
    },
    delLotM(row){
      this.$set(this,'currentId',row.lot_number)
      this.$set(this,'currentName',row.name)
      this.$set(this,'deletModal',true)
    },
    delLot(){
      this.$set(this,'spinShow',true)
      this.delLot_({lot_num:this.currentId}).then((msg) => {
        this.$set(this,'spinShow',false)
        if(msg.error_msg || !msg){
          this.$Message.error(msg.error_msg || '删除失败')
          return
        }
        this.$Message.success('删除成功')
        this.queryLot_({per_page_num:999999,page_idx: 1})
      })
    },
    getDate(val,str){
       if(this.$store.getters.isPC){
         //this.queryParam.start_time=`${val[0]}T00:00:00Z`
         this.queryParam.start_time=new Date(`${val[0]} 00:00:00`).toISOString()
         // this.queryParam.end_time=`${val[1]}T23:59:59Z`
         this.queryParam.end_time=new Date(`${val[1]} 23:59:59`).toISOString()
       } else {

       }
    },
    column_mob(){
      if(this.$store.getters.isPC){
        return
      }
      this.$set(this.columns[0],'fixed','left')
      this.$set(this.columns[0],'width',80)
      this.$set(this.columns[1],'width',100)
      this.$set(this.columns[2],'width',150)
      this.$set(this.columns[3],'width',120)
      this.$set(this.columns[4],'width',100)
      this.$set(this.columns[5],'width',200)
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
    //获取溯源事件
    this.queryTraceCatg_({})
    //获取产品列表
    this.searchPro({per_page_num:999999,page_idx:1})
    //获取批次列表-新系统
    if(this.$store.getters.isPC){
      this.queryLot_({per_page_num:50,page_idx: 1})
    } {
      this.queryLot_({per_page_num:20,page_idx: 1})
    }
    //移动端调整列名
    this.column_mob()
  }
}
</script>

<style>
.searchInput .ivu-input{
  border-radius: 0
}
.pc_input{
  width:200px;
}
.ceiling{
  position: fixed;
  width: 100%;
  top:0;
  left: 0;
  background: #fff;
  z-index: 4
}
.mob_input{
  margin-top: 10px;
  display: block;
  width:85%;
  margin: 3% auto;
}
.mob_btn{
  font-size: 14px;
  width: 70%;
  margin: 5% auto;
  display: block;
}
.datePicker{
  padding:10px 0;
  width:100%;
  text-align: center;
  font-size: 15px;
  background: #fff;
  margin-top: 15px
}
</style>
