<template>
  <div id="">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading style="margin-bottom:20px" :c-name="'生产环节溯源/事件'" :btnBack="true" @back="back" :btn-add="true" @add="add()"/>
    <!-- 新增 -->
    <Modal v-model="addModal" :mask-closable="false" title="创建/修改生产环节溯源事件" @on-ok="add_prodTrace('add_form')">
      <Form ref="add_form" :model="prodTraceItem" :rules="ruleValidate">
        <FormItem label="溯源事件" prop="trace_event_id">
          <Select v-show="$store.getters.isPC" v-model="prodTraceItem.trace_event_id" style="width:70%">
            <Option v-for="i in traceCatg_prod" :key="i.id" :value="i.id">{{i.name}}</Option>
          </Select>
          <!-- <select v-show="!$store.getters.isPC" class="originalSelect" v-model="prodTraceItem.trace_event_id">
            <option v-for="i in traceCatg_prod" :value="i.id">{{i.name}}</option>
          </select> -->
        </FormItem>
        <FormItem label="批次编号" prop="lot_num">
          <Input v-model="prodTraceItem.lot_num" style="width:70%" disabled></Input>
        </FormItem>
      </Form>
      <div class="modalForm">
        <label>批次名</label><input type="text" v-model="lot_name" disabled>
      </div>
      <div class="modalForm">
        <label>地点</label><input type="text" v-model="prodTraceItem.place">
      </div>
    </Modal>
    <!-- 移动端-新增 -->
    <div class="mobForm" v-show="!$store.getters.isPC && traceProd_form">
      <div class="mobForm_title">
        <a @click="goback('traceProd_form')" class="backIcon" style="position:absolute"><Icon type="ios-arrow-back" /></a>
        <h2 class="title">{{head}}</h2>
        <button type="button" @click="add_prodTrace">保存</button>
      </div>
      <div class="mobForm_item">
        <label>溯源事件</label>
        <!-- <select style="width:300px" v-show="!$store.getters.isPC" class="originalSelect" v-model="prodTraceItem.trace_event_id">
          <option v-for="i in traceCatg_prod" :value="i.id">{{i.name}}</option>
        </select> -->
        <Select v-model="prodTraceItem.trace_event_id" style="width:300px">
          <Option v-for="i in traceCatg_prod" :key="i.id" :value="i.id">{{i.name}}</Option>
        </Select>
      </div>
      <div class="mobForm_item">
        <span>批次名</span> <input style="width:300px" v-model="lot_name" disabled>
      </div>
      <div class="mobForm_item">
        <span>批次编号</span> <input v-model="prodTraceItem.lot_num" disabled>
      </div>
      <div class="mobForm_item">
        <span>地点</span>  <input type="text" v-model="prodTraceItem.place">
      </div>
    </div>
    <!-- 删除 -->
    <Modal v-model="deletModal" :mask-closable="false" title="删除生产环节溯源事件" @on-ok="del_traceCirculate">
      <p>确定删除批次编号为 <span style="font-weight:bold">{{currentLotNum}}</span>的溯源事件？</p>
    </Modal>
    <Table style="margin-top:10px" :row-class-name="rowClassName" :columns="columns" :data="traceCircul_Event_List"></Table>
    <button v-show="!$store.getters.isPC" @click="mob_add" type="button" class="mob_addBtn" >新增</button>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import {year,month,date,hh,mm,ss,timeExchange} from '../../utils/timeExchange.js'
import publicFunc from '../../utils/public.js'

export default {
  data(){
    return {
      lot_num:'',
      lot_name:'',
      spinShow:false,
      addModal:false,
      deletModal:false,
      currentId:-1,
      traceProd_form:false,
      head:'',
      currentLotNum:'',
      prodTraceItem:{},
      prodList:[],
      traceCatg_prod:[],
      traceCircul_Event_List:[],
      add_traceCircul_info:[],
      ruleValidate:{
        trace_event_id:[
          {required:true, type:'number', message:'必填', trigger:'change'}
        ],
        lot_num:[
          {required:true, message:'必填', trigger:'blur'}
        ]
      },
      columns:[{
        title:'溯源事件类别',
        align: 'center',
        render: (h,param) => {
          var newArr = this.traceCatg_prod.map((item) => {
            if(item.id == param.row.trace_event_id){
              return h('span',item.name)
            }
          })
          return h('div',newArr)
        }
      },{
        title:'批次名',
        align:'center',
        key:'name'
      },
        {
          title:'批次编号',
          align: 'center',
          key:'lot_num'
        },{
          title:'地点',
          align: 'center',
          key:'place'
        },{
          title:'创建时间',
          align: 'center',
          render:(h,param) => {
            timeExchange(param.row.created_time)
            return h('span',`${year}年${month}月${date}日-${hh}:${mm}:${ss}`)
          }
        }
      ]
    }
  },
  computed:{
    ...mapGetters([
      'queryTraceCatg_re',
      'query_ProdTraceList_re',
      'searchProResult',
    ])
  },
  watch:{
    searchProResult:function(val){
      this.prodList = val
    },
    queryTraceCatg_re:function(val){
      val.forEach(i => {
        if(i.type == 2){
          this.traceCatg_prod.push(i)
        }
      })
    },
    query_ProdTraceList_re:function(val){
      var tempVal = [...val]
      if(tempVal.length>0){
        tempVal.forEach(i => i.name = this.lot_name)
      }
      this.$set(this,'traceCircul_Event_List',tempVal)
    }
  },
  methods: {
    ...mapActions([
      'addProdTrace_',
      'queryTraceCatg_',
      'queryProdTraceList_',
      'delProdTrace_'
    ]),
    back() {
      this.$router.replace('/trace/1-8/lotNumber')
    },
    goback(str){
      this.$set(this,str,false)
      this.prodTraceItem = {}
    },
    mob_add(){
      this.prodTraceItem.lot_num = this.lot_num
      this.traceProd_form=true
      this.head='新增生产环节溯源'
    },
    add(){
      this.addModal = true
    },
    add_prodTrace_func(){
      this.spinShow = true
      this.addProdTrace_(this.prodTraceItem).then((data) => {
        this.spinShow = false
        var msg = data.error_msg

        if(msg || msg == undefined){
          this.$Message.error(msg)
          return
        }
        this.$Message.success('添加成功')
        this.prodTraceItem = {}
        this.traceProd_form = false
        this.queryProdTraceList_({lot_num:this.lot_num})
      })
    },
    add_prodTrace(name){
      if(this.$store.getters.isPC){
        publicFunc.validateForm.apply(this,[name,this.add_prodTrace_func,this.add])
      } else {
        this.add_prodTrace_func()
      }
    },
    delTrace_circulateM(row){
      this.$set(this,'currentId',row.id)
      this.$set(this,'currentLotNum',row.lot_num)
      this.$set(this,'deletModal',true)
    },
    del_traceCirculate(){
      this.delProdTrace_(
        {id:this.currentId,lot_num:this.currentLotNum}
      ).then((msg) => {
        if(msg){
          this.$Message.error(msg)
          return
        }
        this.$Message.success('删除成功')
        this.queryProdTraceList_({lot_num:this.currentLotNum})
      })
    },
    column_mob(){
      if(this.$store.getters.isPC){
        return
      }
      this.$set(this.columns[0],'fixed','left')
      this.$set(this.columns[0],'width',80)
      this.$set(this.columns[1],'width',100)
      this.$set(this.columns[2],'width',150)
      this.$set(this.columns[3],'width',80)
      this.$set(this.columns[4],'width',180)
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
    this.lot_num = this.prodTraceItem.lot_num = this.$router.currentRoute.query.lot_num
    this.lot_name = this.$router.currentRoute.query.lot_name

    //获取对应批次的溯源事件
    this.queryProdTraceList_({lot_num:this.lot_num})
    //获取溯源事件列表
    this.queryTraceCatg_({})
    //移动端-表格
    this.column_mob()
  }
}
</script>

<style scoped>

</style>
