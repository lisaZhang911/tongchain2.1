<template>
  <div id="">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'防伪码管理'" :btn-add="true" @add="add()" />
    <!-- 条件 -->
    <div class="" v-show="$store.getters.isPC">
      <DatePicker  type="daterange" placeholder="请选择查询时间范围" @on-change="timeRange" style="width: 200px;margin:10px 0 20px"></DatePicker>
      <Button type="primary"  @click="searchAll">搜索全部</Button>
    </div>
    <!-- 移动端-条件 -->
    <div v-show="!$store.getters.isPC">
      <Button class="datePicker left" type="text" @click="openDatePicker('pickerStart')">{{mob_startTime}}</Button>
      <mt-datetime-picker ref="pickerStart" type="date" v-model="timeRange_mob.start_time" ></mt-datetime-picker>
      <Button class="datePicker right" type="text" @click="openDatePicker('pickerEnd')">{{mob_endTime}}</Button>
      <mt-datetime-picker ref="pickerEnd" type="date" v-model="timeRange_mob.end_time" ></mt-datetime-picker>
      <div class="mob_paramSearch_wrap">
        <Button type="primary" class="btn left" @click="timeRange">搜索</Button>
        <Button type="primary" class="btn right" @click="searchAll">搜索全部</Button>
      </div>
    </div>
    <!-- 新增 -->
    <Modal v-model="addCodeModal" title="生成防伪码" @on-ok="addCode">
      <div class="modalForm" style="overflow:hidden">
        <label style="float:left;margin-top:22px">企业</label>
        <QurBoxTopic
        txt="请输入企业名"
        style="width:198px;float:left"
        :finish="showEnterp"
        :enterpList="enterpList"
        @itemValue="itemValue"
        @itemName="getEnterpName"
        @itemId = 'getEnterpId'></QurBoxTopic>
      </div>
      <div class="modalForm">
        <label>大码</label><input type="text" v-model.number="newCode.big_num">
      </div>
      <div class="modalForm">
        <label>小码</label><input type="text" v-model.number="newCode.sub_num">
      </div>
    </Modal>
    <!-- 移动端-新增 -->
    <FormM v-model="showForm" :head="head" @goback="goback" @ok="addCode">
      <div class="mobForm_item" style="overflow:hidden">
        <span style="float:left;margin-top:20px">企业</span>
        <QurBoxTopic
        txt="请输入企业名"
        style="width:198px;float:left"
        :finish="showEnterp"
        :enterpList="enterpList"
        @itemValue="itemValue"
        @itemName="getEnterpName"
        @itemId = 'getEnterpId'></QurBoxTopic>
      </div>
      <div class="mobForm_item">
        <span>大码</span><input type="text" v-model.number="newCode.big_num">
      </div>
      <div class="mobForm_item">
        <span>小码</span><input type="text" v-model.number="newCode.sub_num">
      </div>
    </FormM>
    <Table v-show="mobShow" :class="{tablePos:!$store.getters.isPC}" :row-class-name="rowClassName" :columns="columns" :data="codeData"></Table>
    <button v-show="!$store.getters.isPC && mobShow" @click="mob_add" type="button" class="mob_addBtn" >新增</button>
  </div>
</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import {timeExchange,year,month,date,hh,mm,ss} from '../utils/timeExchange.js'
import publicFunc from '../utils/public.js'

export default {
  data(){
    return {
      spinShow: false,
      mobShow:true,
      head:'',
      showForm:false,
      code_add:false,
      finish:false,
      showEnterp:false,
      addCodeModal: false,
      currentId:0,
      enterpName: '',
      time_range: {},
      timeRange_mob:{},
      newCode: {},
      enterpList_all:[],
      enterpList: [],
      columns: [{
          title:'批次id',
          align: 'center',
          key:'id'
        },{
          title: '所属企业',
          align: 'center',
          render:(h,param) => {
            var id = param.row.enterprise_id
            for(var i of this.enterpList_all){
              if(id==i.id){
                return h('span',i.name)
              }
            }
          }
        },{
          title: '大码数量/个',
          align: 'center',
          key: 'big_code_num',
        },{
          title: '小码数量/个',
          align: 'center',
          key: 'sub_code_num',
        },{
          title: '创建时间',
          width:200,
          align: 'center',
          render:(h,param) => {
            timeExchange(param.row.created_time)
            return h('span',`${year}年${month}月${date}日-${hh}:${mm}:${ss}`)
          }
        }],
      codeData: []
   }
  },
  watch:{
    getAllEnterpList:function(val){
      this.$set(this,'enterpList',val)
    },
    getCodeList:function(val){
      this.$set(this,'codeData',val)
    }
  },
  computed:{
    ...mapGetters([
      'getAllEnterpList',
      'getCodeList'
    ]),
    mob_startTime:function(){
      if(this.timeRange_mob.start_time){
        var date = new Date(this.timeRange_mob.start_time)
        return  `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`
      } else return '起始时间'
    },
    mob_endTime:function(){
      if(this.timeRange_mob.end_time){
        var date = new Date(this.timeRange_mob.end_time)
        return  `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`
      } else return '终止时间'
    }
  },
  methods: {
    ...mapActions([
      'queryAllEnter',
      'generate_secuCode',
      'queryCodeList_'
    ]),
    goback(){
       this.showForm = false
       this.$set(this,'mobShow',true)
     },
    openDatePicker(str){
      this.$refs[str].open();
    },
    toSearchPage(){
      publicFunc.toSearchPage()
    },
    add(){
        this.$set(this,'addCodeModal',true);
    },
    addCode(){
      var adVice = this.$store.getters.isPC

      if(Object.keys(this.newCode).length<3){
          this.$Message.warning('请填写完所有内容')

          if(adVice){
            this.$nextTick(() => {
              this.$set(this,'addCodeModal',true);
            })
          }
          return
      } else if(this.newCode.big_num<1 || this.newCode.sub_num<1){
            this.$Message.warning('大码和小码数量至少为1')
            return
      }

      this.$set(this,'spinShow',true)
      this.generate_secuCode(this.newCode).then((msg) => {
        this.showForm = false
        this.mobShow = true
        this.$set(this,'spinShow',false)

        if(msg || msg==undefined){
          this.$Message.error(msg || '生成失败请再试')
          return
        }
        this.$Message.success('生成防伪码成功')
        this.newCode = {}
        this.queryCodeList_({})
      })
    },
    mob_add(){
      this.showForm=true
      this.mobShow=false
      this.head='新增防伪码'
    },
    searchAll(){
      this.$set(this,'spinShow',true)
      this.queryCodeList_({}).then((resp) => {
        this.$set(this,'spinShow',false)
      })
    },
    timeRange(val){
      this.$set(this,'spinShow',true)
      if(this.$store.getters.isPC){
        this.time_range.start_time = new Date(`${val[0]} 00:00:00`).toISOString()
        this.time_range.end_time = new Date(`${val[1]} 24:00:00`).toISOString()
      } else {
        this.time_range.start_time = this.timeRange_mob.start_time.toISOString()
        var ms = Date.parse(this.timeRange_mob.end_time)+24*60*60*1000
        var date = new Date(ms)
        this.time_range.end_time = date.toISOString()
      }

      this.queryCodeList_(this.time_range).then((resp) => {
        this.$set(this,'spinShow',false)
      })
    },
    getEnterpName(){},
    itemValue(val){
      if(this.finish){
        this.$set(this,'finish',false)
        return
      }
      this.$set(this,'showEnterp',true)
      publicFunc.debounce(this.queryAllEnter({audit:4,like_name:val}),500)
    },
    getEnterpId(val){
      this.$set(this.newCode,'enterprise_id',val)
      this.$set(this,'finish',true)
      this.$set(this,'showEnterp',false)
    },
    column_mob(){
      this.$set(this.columns[0],'fixed','left')
      this.$set(this.columns[0],'width',100)
      this.$set(this.columns[1],'width',100)
      this.$set(this.columns[2],'width',100)
      this.$set(this.columns[3],'width',100)
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
    this.$set(this,'spinShow',true)
    // 获取所有企业
    this.queryAllEnter({audit:4}).then((enterpList) => {
      this.enterpList_all=enterpList
    })
    // 获取防伪码列表
    this.queryCodeList_({}).then((resp) => {
      this.$set(this,'spinShow',false)
      if(resp.data.error_msg){
        this.$Message.error(resp.data.error_msg)
      }
    })
    // 移动端-调整列属性
    if(!this.$store.getters.isPC){
      this.column_mob()
    }
  }
}
</script>

<style  scoped>
.ivu-col {
  margin-left: 20%
}
.table-view {
  clear: both;
}
.mob_paramSearch_wrap{
  overflow: hidden;
  clear: both;
  width:75%;
  margin: 5% auto;
}
.mob_paramSearch_wrap .btn{
  width:30%
}
.mob_paramSearch_wrap .btn.left{
  float: left;
}
.mob_paramSearch_wrap .btn.right{
  float: right
}
.datePicker.left{float: left}
.datePicker.right{float: right}
.datePicker{
  padding:10px 0;
  margin-bottom: 5%;
  width:30%;
  text-align: center;
  font-size: 15px;
  border-bottom: 1px solid #999;
  margin-top: 15px
}
</style>
