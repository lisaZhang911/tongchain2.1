<template>
  <!-- 共用 -->
  <div id="" style="height:100%"  @click="hideNav($event)">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'系统消息'"  :btn-add="userType==5" @add="add()" />
    <!-- 列表查询条件 -->
    <div v-show="userType==5 && $store.getters.isPC" style="overflow:hidden">
      <div class="optionBlock">
        <h3 style="margin:20px 0;font-weight:normal">选择企业</h3>
        <QurBoxTopic
        :finish="showEnterp"
        style="width:100%"
        txt="请输入企业名"
        :enterpList="enterpList"
        @itemValue="itemValue"
        @itemName="getEnterpName"
        @itemId = "getEnterpId"
        ></QurBoxTopic>
      </div>
      <div class="optionBlock">
        <h3 style="margin:20px 0;font-weight:normal">选择批次</h3>
        <Select v-model="batch" style="width:100%;margin:15px 10px">
          <Option v-for="item in batchType" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <Button type="primary" class="searchBtn" @click="queryInfo">搜索</Button>
      <Button type="primary" class="searchBtn" @click="queryInfo('all')">搜索全部</Button>
    </div>
    <!-- 移动端-条件搜索 -->
    <div class="mob_searchParam" v-show="!$store.getters.isPC && userType==5">
      <div class="mob_searchLink">
        <a @click="toSearchPage"><Icon type="ios-search" /> <span>{{enterpName}}</span> </a>
      </div>
      <div class="filterBox" ref="filterBox" v-show="!$store.getters.isPC" :class="arrClass">
        <div class="itemBox">
          <h5>选择批次状态</h5>
          <span class="label" v-for="(i,index) in batchType" @click.stop="mob_filterParam(i.value,index)" :class="{active:active==index}">{{i.label}}</span>
        </div>
        <div class="buttonWrap">
          <Button class="reset" @click.stop="reset_queryParam">重置</Button>
          <Button type="primary" @click.stop="search_filter($event)">筛选</Button>
        </div>
      </div>
      <Icon class="setting"  @click.stop="handdleNav" type="ios-settings" />
    </div>
    <!-- 新增 -->
    <Modal v-model="addSysModal" title="添加系统消息" @on-ok="addNewInfo('add_form')" >
      <Form ref="add_form" :model="addInfo" :rules="ruleValidate">
        <FormItem label="标题" prop="title">
          <Input style="width:200px" v-model="addInfo.title"/>
        </FormItem>
        <!-- <FormItem label="类型" prop="type">
          <Select v-model="addInfo.type" style="width:200px">
            <Option v-for="item in infoType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem> -->
        <FormItem label="内容" prop="content">
          <Input type="textarea" :rows="6" v-model="addInfo.content"/>
        </FormItem>
      </Form>
      <div style="overflow:hidden">
        <div style="margin:20px 5px 10px 15px;float:left">
          <span style="padding-right:10px">发送给所有企业</span><i-switch v-model="allEnterp" @on-change="change"/>
        </div>
        <QurBoxTopic
          v-show="paramAvailModal"
          :finish="showEnterp"
          style="width:198px;float:left"
          txt="请输入企业名"
          :enterpList="enterpList"
          @itemValue="itemValue"
          @itemName="getEnterpName"
          @itemId = 'enterpId_add'
        ></QurBoxTopic>
      </div>
    </Modal>
    <!-- 移动端-新增/详情 -->
    <div class="mobForm" v-show="!$store.getters.isPC && sys_form">
      <div class="mobForm_title">
        <a @click="goback('sys_form')" class="backIcon" style="position:absolute"><Icon type="ios-arrow-back" /></a>
        <h2 class="title">{{head}}</h2>
        <button v-show="addNew" type="button" @click="addNewInfo">保存</button>
      </div>
      <div class="mobForm_item">
        <span>标题</span><input type="text" v-model="addInfo.title" :readonly="!addNew">
      </div>
      <div class="mobForm_item" v-show="addNew">
        <label>信息类型</label>
        <Select v-model="addInfo.type" style="width:200px">
          <Option v-for="item in infoType" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="mobForm_item" v-show="!addNew">
        <span>创建时间</span><input type="text" readonly v-model="addInfo.send_time">
      </div>
      <div class="mobForm_item">
        <span>内容</span><textarea rows="8" cols="50" v-model="addInfo.content" :readonly="!addNew"></textarea>
      </div>
      <div class="mobForm_item" v-show="addNew">
        <div style="margin:20px 5px 10px 15px">
         <span style="padding-right:10px">发送给所有企业</span><i-switch v-model="allEnterp" @on-change="change"/>
        </div>
        <QurBoxTopic
        v-show="paramAvailModal"
        :finish="showEnterp"
        style="width:198px"
        txt="请输入企业名"
        :enterpList="enterpList"
        @itemValue="itemValue"
        @itemName="getEnterpName"
        @itemId = 'enterpId_add'
        ></QurBoxTopic>
      </div>
    </div>
    <!-- 详情弹框 -->
    <Modal v-model="sysInfoModal" title="系统详情">
      <div class="modalForm">
        <label>标题</label><input type="text" v-model="addInfo.title" readonly="readonly">
      </div>
      <div class="modalForm">
        <label>创建时间</label><input type="text" style="width:180px;" v-model="addInfo.send_time" readonly="readonly">
      </div>
      <div class="modalForm">
        <label>内容</label><textarea rows="8" cols="50" style="display:block" type="text" v-model="addInfo.content" readonly="readonly"></textareat>
      </div>
    </Modal>
    <!-- 删除弹框 -->
    <Modal v-model="delSysModal" @on-ok="delSysInfo" title="删除系统信息">
      <p>确定删除标题为 <span style="font-weight:bold;font-size:15px">{{currentName}}</span>的系统信息吗</p>
    </Modal>
    <Table style="margin-bottom:25px" :row-class-name="rowClassName" :columns="columns" :data="sysInfo"></Table>
    <button v-show="!$store.getters.isPC && userType==5" @click="mob_add('add')" class="mob_addBtn">新增</button>
  </div>
</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import { year,month,date,hh,mm,ss,timeExchange } from '../utils/timeExchange.js'
import { batchType,infoType } from '../utils/formType.js'
import publicFunc from '../utils/public.js'
// import {Icon} from 'iview'

export default {
  // components: {
  //   Icon
  // },
  data(){
    return {
      spinShow:false,
      enterpName: localStorage.getItem('enterpName') || '搜索企业',
      userType:localStorage.getItem('user_type'),
      addNew:false,
      sys_form:false,
      head:'',
      active:-1,
      arrClass:[],
      finish:false,
      showEnterp:false,
      paramAvail:true,
      paramAvailModal:true,
      allEnterp:false,
      addSysModal: false,
      sysInfoModal: false,
      delSysModal: false,
      enterpId: 0,
      batch: 1,
      currentId: -1,
      currentName: '',
      enterpList: [{id:-1,name:'没有结果'}],
      batchType: batchType,
      infoType: infoType,
      ruleValidate:{
        title:[
          {required:true, message:'必填', trigger:'blur'}
        ],
        content:[
          {required:true, message:'必填', trigger:'blur'}
        ]
      },
      columns: [{
          title: '标题',
          align: 'center',
          key: 'title'
        },{
          title: '创建时间',
          align: 'center',
          render:(h,param) => {
            timeExchange(param.row.send_time)
            return h('span',`${year}年${month}月${date}日-${hh}:${mm}:${ss}`)
          }
        },{
          title: '操作',
          align: 'center',
          render: (h, params) => {
            var baseBtnArr = [h('Button', {
              props: {
                shape: 'circle',
                size: 'small',
              },
              attrs: {
                id: 'btn1'
              },
              on: {
                click: () => {
                  this.$set(this,'currentId',params.row.id)
                  this.getSysInfoDetail()
                }
              }
            }, '详情')]
            var delBtn = h('Button', {
              props: {
                shape: 'circle',
                size: 'small',
              },
              attrs: {
                id: 'btn2'
              },
              on: {
                click: () => {
                  this.$set(this,'currentId',params.row.id);
                  this.$set(this,'currentName',params.row.title);
                  this.$set(this,'delSysModal',true);
                }
              }
            }, '删除')
            if(this.userType==5){
              baseBtnArr.push(delBtn)
            }
            return h('div',baseBtnArr)
          }
        }
      ],
      infoParam:{},
      sysInfo: [],
      sysInfoDetail: {},
      addInfo:{type:1}
   }
  },
  computed: {
    ...mapGetters([
      'getAllEnterpList',
      'getSearchSysInfoListResult',
      'getSysInfoResult'
    ])
  },
  watch:{
    getAllEnterpList:function(val){
      this.$set(this,'enterpList',val)
    },
    getSearchSysInfoListResult:function(val){
      this.$set(this,'sysInfo',val)
    },
    getSysInfoResult:function(val){
      var tempVal = Object.assign({},val)
      timeExchange(tempVal.send_time)
      tempVal.send_time = `${year}年${month}月${date}日-${hh}：${mm}：${ss}`
      this.$set(this,'addInfo',tempVal)
    }
  },
  methods: {
    ...mapActions([
      'queryAllEnter',
      'search_sysInfoList',
      'add_sysInfo',
      'del_sysInfo',
      'search_sysInfoDetail'
    ]),
    goback(str){
      this.$set(this,str,false)
      this.addInfo = {}
    },
    mob_add(str){
      this.sys_form=true
      if(str == 'add'){
        this.head='新增系统消息'
        this.addNew = true
      } else if(str == 'detail'){
        this.head ='系统消息详情'
        this.addNew = false
      }
    },
    reset_queryParam(){
      this.$set(this,'infoParam',{})
      this.active = -1
    },
    handdleNav(){
      if(!this.arrClass.includes('slide')){
        this.arrClass.splice(0,1,'slide')
      }
    },
    hideNav(eve){
      if(!this.$refs.filterBox.contains(eve.target)){
        this.arrClass.splice(0,1)
      }
    },
    search_filter(){
      this.spinShow=true
      this.arrClass.splice(0,1)
      this.search_sysInfoList(this.infoParam).then(() => {
        this.spinShow=false
      })
    },
    mob_filterParam(val,index){
      this.$set(this,'active',index)
      this.$set(this.infoParam,'batch',Boolean(val))
    },
    toSearchPage(){
      localStorage.setItem('path',this.$router.currentRoute.fullPath)
      this.$router.replace('/mob_searchPage')
    },
    getEnterpName(val){
      //val作为参数，搜索相关企业
    },
    // getEnterpId(val){
    //   this.$set(this,'enterpId',val)
    // },
    enterpId_add(val){
      this.addInfo.enterprise_id=val
      this.enterpId = val
      this.$set(this,'finish',true)
      this.$set(this,'showEnterp',false)
    },
    add(){
      this.$set(this,'addSysModal',true);
    },
    change(status){
      if(status){
        this.addInfo.enterprise_id=-1
      } else {
        if(this.enterpId != 0){
          this.addInfo.enterprise_id = this.enterpId
        }
      }
      this.$set(this,'paramAvailModal',!status)
    },
    getSysInfoDetail(){
      this.$set(this,'spinShow',true)
      this.search_sysInfoDetail({id:this.currentId}).then(() => {
        this.$set(this,'spinShow',false)
        if(this.$store.getters.isPC){
          this.$set(this,'sysInfoModal',true)
          return
        }
        this.sys_form=true
        this.head='消息详情'
        this.addNew=false
      })
    },
    queryInfo(...args){
      this.spinShow = true
      if(args[0] == 'all'){
        this.infoParam = {}
        this.infoParam.batch = true
      } else {
        this.infoParam.batch = Boolean(this.batch)
      }
      this.search_sysInfoList(this.infoParam).then((resp) => {
        this.spinShow = false
        if(resp.data.error_code!=0){
          this.$Message.error(resp.data.error_msg)
        }
      })
    },
    func(){
      this.$set(this,'spinShow',true)
      this.add_sysInfo(this.addInfo).then((resp) => {
        this.sys_form = false
        this.$set(this,'spinShow',false)
        this.$set(this,'addInfo',{})
        if(resp.data.error_code!=0){
          this.$Message.error(resp.data.error_msg)
          return
        }
        this.$Message.success('添加新消息成功')
        this.sys_form = false
        this.queryInfo()
      })
    },
    addNewInfo(name){
      if(this.$store.isPC){
        publicFunc.validateForm.apply(this,[name,this.func,this.add])
      } else {
        this.func()
      }
    },
    delSysInfo(){
      this.$set(this,'spinShow',true)
      this.del_sysInfo({id:this.currentId}).then((resp) => {
        this.$set(this,'spinShow',false)
        if(resp.error_msg == undefined){
          this.$Message.error('删除失败')
          return
        }
        if(resp.error_msg){
          this.$Message.error(resp.error_msg)
          return
        }
        this.$Message.success('删除成功')
        this.search_sysInfoList({batch:Boolean(this.batch)}).then((resp) => {
          this.$set(this,'spinShow',false)
        })
      })
    },
    itemValue(val){
      if(this.finish){
        this.$set(this,'finish',false)
        return
      }
      this.$set(this,'showEnterp',true)
      publicFunc.debounce(() => {
        this.queryAllEnter({audit:4, like_name:val})
      },800)
      // publicFunc.debounce((val) => {
      //   this.queryAllEnter({audit:4,like_name:val})
      // },500)(val)
    },
    getEnterpName(val){
    },
    getEnterpId(val){
      this.infoParam.enterprise_id=val
      this.$set(this,'finish',true)
      this.$set(this,'showEnterp',false)
    },
    column_mob(){
      // this.$set(this.columns[0],'fixed','left')
      this.$set(this.columns[0],'width',90)
      this.$set(this.columns[1],'width',170)
      this.$set(this.columns[2],'width',160)
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
  beforeCreate(){
    if(this.$router.currentRoute.fullPath == localStorage.getItem('path')){
      return
    } else {
      localStorage.removeItem('enterpId')
      localStorage.removeItem('enterpName')
    }
  },
  mounted() {
    this.$set(this,'spinShow',true)
    // 移动端-搜索企业后回到本页
    if(!this.$store.getters.isPC && localStorage.getItem('enterpId')){
      this.infoParam.enterprise_id = Number(localStorage.getItem('enterpId'))
      this.search_sysInfoList(this.infoParam).then((resp) => {
        this.$set(this,'spinShow',false)
      })
    } else {
      this.search_sysInfoList({batch:true}).then((resp) => {
        this.$set(this,'spinShow',false)
      })
    }
    // 移动端-表格列添加属性
    if(!this.$store.getters.isPC){
      this.column_mob()
    }
  }
}
</script>

<style lang='less' scoped>
.optionBlock {
  width:20%;
}
.searchBtn{
  padding: 5px 40px 6px;
  margin-top: 75px;
  margin-left: 20px;
}
</style>
