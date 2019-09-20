<template>
    <div class="workOrder" @click="hideNav($event)">
      <!-- 企业/平台共用页面 -->
      <Spin size="large" fix v-if="spinShow"></Spin>
      <Heading :c-name="'工单管理'" :btn-add="true" @add="add()"/></Heading>
      <!-- 添加-企业专用 -->
      <Modal v-model="addOrderModal" title="添加工单" @on-ok="addWorkOrder('add_form')">
        <Form ref="add_form" :model="orderInfo" :rules="ruleValidate">
          <FormItem label="标题" prop="title">
            <Input v-model="orderInfo.title" style="width:200px"></Input>
          </FormItem>
          <FormItem label="类型" prop="type">
            <Select v-model="orderInfo.type" style="width:170px">
              <Option v-for="item in orderType" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="内容" prop="content">
            <Input v-model="orderInfo.content" type="textarea" :rows="6" />
          </FormItem>
        </Form>
      </Modal>
      <!-- 删除 -->
      <Modal v-model="delOrderModal" title="删除" @on-ok="delOrder_">
        <p>是否删除该条工单</p>
      </Modal>
      <!-- 条件搜索 -->
      <div class="searchParam" style="overflow:hidden" v-show="$store.getters.isPC">
        <div class="optionBlock" v-show="userType==5">
          <h3 style="margin:20px 0;font-weight:normal">选择企业</h3>
          <QurBoxTopic
          txt="请输入企业名"
          :finish="showEnterp"
          style="width:100%;"
          :enterpList="enterpList"
          @itemValue="itemValue"
          @itemName="getEnterpName"
          @itemId = 'getEnterpId'
          ></QurBoxTopic>
        </div>
        <div class="optionBlock">
          <h3 style="margin:20px 0;font-weight:normal">选择工单状态</h3>
          <Select v-model="queryOrder.status" style="width:100%;margin: 15px 0">
            <Option v-for="item in orderStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="optionBlock">
          <h3 style="margin:20px 0;font-weight:normal">选择工单类型</h3>
          <Select v-model="queryOrder.type" style="width:100%;margin: 15px 0">
            <Option v-for="item in orderType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="optionBlock">
          <h3 style="margin:20px 0;font-weight:normal">更新状态</h3>
          <Select v-model="queryOrder.new_detail" style="width:100%;margin: 15px 0">
            <Option v-for="item in newDetail" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <Button class="workOrder_searchBtn" type="primary" @click="queryOrderList">搜索</Button>
        <Button class="workOrder_searchBtn" style="margin-left:10px" type="primary" @click="queryOrderList('all')">搜索全部</Button>
      </div>
      <!-- 移动端条件搜索 -->
      <div class="mob_searchParam" v-show="!$store.getters.isPC">
        <div class="mob_searchLink" v-show="userType==5">
          <a @click="toSearchPage"><Icon type="ios-search" /> <span>{{enterpName}}</span> </a>
        </div>
        <div class="filterBox" ref="filterBox" v-show="!$store.getters.isPC" :class="arrClass">
          <div class="itemBox">
            <h5>选择工单状态</h5>
            <Select v-model="queryOrder.status">
              <Option v-for="item in orderStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="itemBox">
            <h5>选择工单类型</h5>
            <Select v-model="queryOrder.type">
              <Option v-for="item in orderType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="itemBox">
            <h5>更新状态</h5>
            <Select v-model="queryOrder.new_detail">
              <Option v-for="item in newDetail" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="buttonWrap">
            <Button class="reset" @click.stop="reset_queryParam">重置</Button>
            <Button type="primary" @click.stop="queryOrderList">搜索</Button>
          </div>
        </div>
        <Icon class="setting"  @click.stop="handdleNav" type="ios-settings" />
      </div>
      <!-- 移动端-添加 -->
      <FormM v-model="showForm" :head="head" @goback="goback" @ok="addWorkOrder">
        <div class="mobForm_item">
          <span>标题</span><input type="text" v-model="orderInfo.title">
        </div>
        <div class="mobForm_item">
          <label>类型</label>
          <Select v-model="orderInfo.type" style="width:170px">
            <Option v-for="item in orderType" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </div>
        <div class="mobForm_item">
          <span>内容</span>
          <textarea rows="10" cols="41" v-model="orderInfo.content"></textarea>
        </div>
      </FormM>
      <Table class="tableShow" :class="{tablePos:!$store.getters.isPC}" :row-class-name="rowClassName" :columns="columns" :data="orderList"></Table>
      <button v-show="!$store.getters.isPC && userType!=5" @click="mob_add" type="button" class="mob_addBtn" >新增</button>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { year,month,date,hh,mm,ss,timeExchange } from '../../utils/timeExchange.js'
import { orderStatus,orderType,newDetail } from '../../utils/formType.js'
import publicFunc from './columnData.js'
import pathPublic from '../../utils/public.js'

export default {
  data(){
    return {
      spinShow:false,
      worder_form:false,
      head:'',
      showForm:false,
      active_status:-1,
      active_type:-1,
      active_newDetail:-1,
      finish:false,
      showEnterp:false,
      replayM:false,
      userType: localStorage.getItem('user_type'),
      enterpName: localStorage.getItem('enterpName') || '搜索企业',
      currentId: 0,
      orderInfo:{},
      queryOrder:{},
      txtContent: '',
      orderStatus: orderStatus,
      orderType: orderType,
      newDetail: newDetail,
      addOrderModal: false,
      // modifyContentModal: false,
      delOrderModal: false,
      enterpList: [{id:-1,name:'没有结果'}],
      enterpList_all: [],
      ruleValidate: {
        title:[
          {required:true, message:'必填', trigger:'blur'}
        ],
        type:[
          {required:true, type:'number', message:'必选', trigger:'change'}
        ],
        content:[
          {required:true, message:'必填', trigger:'blur'}
        ]
      },
      columns: [
        {
          title: '标题',
          key: 'title',
          align: 'center',
        },
        {
          title: '状态',
          align: 'center',
          render: (h,param) => {
            var statusStr = publicFunc.changeStatus(param.row.status)
            return h('span',statusStr)
          }
        },
        {
          title: '工单类型',
          align: 'center',
          render: (h,param) => {
            var typeStr = publicFunc.changeType(param.row.type)
            return h('span',typeStr)
          }
        },
        {
          title: '针对特定人群更新状态',
          align: 'center',
          render:(h,param) => {
            var newDetailStr = publicFunc.changeNewDetail(param.row.new_detail)
            return h('span',newDetailStr)
          }
        },
        {
          title: '创建时间',
          align: 'center',
          render:(h,param) => {
            timeExchange(param.row.created_time)
            return h('span',`${year}年${month}月${date}日-${hh}:${mm}:${ss}`)
          }
        },
        {
          title: '更新时间',
          align: 'center',
          render:(h,param) => {
            if(param.row.updated_time){
              timeExchange(param.row.updated_time)
              return h('span',`${year}年${month}月${date}日-${hh}:${mm}:${ss}`)
            }
           return h('span','--/--')
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, param) => {
            var btnArr = [
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
                    this.detailOrderM(param.row.id)
                  }
                }
              }, '详情')
            ]
            if(localStorage.getItem('user_type') == 5){
              btnArr.push(h('Button', {
                  props: {
                    shape: 'circle',
                    size: 'small'
                  },
                  attrs: {
                    id: 'btn3'
                  },
                  on: {
                    click: () => {
                      this.delOrderM(param.row.id)
                    }
                  }
                }, '删除'))
            }
            return h('div', btnArr)
          }
        }
      ],
      orderList: [],
      workOrderDetail: [],
      arrClass:[]
    }
  },
  computed:{
    ...mapGetters([
      'getOrderWorkList',
      'getAllEnterpList'
    ])
  },
  watch:{
    getOrderWorkList:function(val){
      this.$set(this,'orderList',val)
    },
    getAllEnterpList:function(val){
      this.$set(this,'enterpList',val)
    }
  },
  methods: {
    ...mapActions([
      'searchOrderList',
      'modifyOrder',
      'addOrder',
      'delOrder',
      'queryAllEnter'
    ]),
    goback(){
      this.orderInfo = {}
      this.showForm = false
    },
    changeEnterpName(dataList){
      var obj = {
        title:'企业',
        align: 'center',
        width:170,
        render:(h,dataList) => {
          for(var i of this.enterpList_all){
            if(i.id==dataList.row.enterprise_id){
              return h('span',i.name)
            }
          }
        }
      }
      this.columns.splice(0,0,obj)
      // this.columnsMob.splice(0,0,obj)
    },
    reset_queryParam(){
      this.$set(this,'queryOrder',{})
    },
    mob_add(){
      this.showForm=true
      this.head='新建工单'
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
    itemValue(val){
      if(this.finish){
        this.$set(this,'finish',false)
        return
      }
      this.$set(this,'showEnterp',true)

    pathPublic.debounce(()=>{
      this.queryAllEnter({audit:4,like_name:val})
    },500)
      // pathPublic.debounce((val) => {
      //   this.queryAllEnter({audit:4,like_name:val})
      // },500)(val)
    },
    getEnterpName(val){
    },
    getEnterpId(val){
      this.queryOrder.enterprise_id=val
      this.$set(this,'finish',true)
      this.$set(this,'showEnterp',false)
    },
    add(){
      if(localStorage.getItem('user_type') == 4 || localStorage.getItem('user_type') == 3){
        this.$set(this,'addOrderModal',true)
      } else this.$Message.info('该功能仅企业管理员可用');
    },
    addWorkOrderFunc(){
      this.$set(this,'spinShow',true)
      this.addOrder(this.orderInfo).then((resp) => {
        this.$set(this,'spinShow',false)
        if(resp.error_msg || !resp){
          this.$Message.error(resp.error_msg || '添加失败')
          return
        }
        this.$Message.success('添加成功')
        this.showForm = false
        this.orderInfo = {}
        this.searchOrderList({})
      })
    },
    addWorkOrder(name){
      var adVice = this.$store.getters.isPC

      if(adVice){
        pathPublic.validateForm.apply(this,[name,this.addWorkOrderFunc,this.add])
      } else {
        if(Object.keys(this.orderInfo).length<3){
          this.$Message.warning('请填写所有数据')
          return
        }
        this.addWorkOrderFunc()
      }
    },
    // search_filter(){
    //   this.arrClass.splice(0,1)
    //   this.searchOrderList(this.queryOrder)
    // },
    queryOrderList(...args){
      this.arrClass.splice(0,1)
      if(args[0]=='all'){
        this.queryOrder = {}
      }
      this.spinShow=true
      this.searchOrderList(this.queryOrder).then(() => {
        this.spinShow=false
      })
    },
    detailOrderM(id){
      this.$router.replace(`/workOrder_detail?id=${id}`)
    },
    toSearchPage(){
      pathPublic.toSearchPage()
    },
    delOrderM(id){
      this.$set(this,'delOrderModal',true)
      this.$set(this,'currentId',id)
    },
    delOrder_(){
      this.delOrder({id:this.currentId}).then((msg) => {
        if(msg || msg==undefined){
          this.$Message.error(msg || '删除失败')
          return
        }
        this.$Message.success('删除成功')
        this.searchOrderList({})
      })
    },
    columns_mob(){
      this.$set(this.columns[0],'fixed','left')
      this.$set(this.columns[0],'width',100)
      this.$set(this.columns[1],'width',100)
      this.$set(this.columns[2],'width',100)
      this.$set(this.columns[3],'width',100)
      this.$set(this.columns[4],'width',170)
      this.$set(this.columns[5],'width',170)
      this.$set(this.columns[6],'width',170)
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
    //移动端-根据企业名查工单-从搜索页跳转回来使用
    if(!this.$store.getters.isPC && localStorage.getItem('enterpId')){
      this.$set(this.queryOrder,'enterprise_id',Number(localStorage.getItem('enterpId')))
      this.searchOrderList(this.queryOrder).then(() => {
        this.$set(this,'spinShow',false)
      })
      return
    }
    //获取工单列表
    this.searchOrderList({}).then(() => {
      this.$set(this,'spinShow',false)
    })
    //平台-获取所有企业列表/增加企业名称列
    if(localStorage.getItem('user_type')==5){
      this.queryAllEnter({audit:4}).then((dataList) => {
        this.enterpList_all=dataList
      })
      this.changeEnterpName(this.orderList)
    }
    //移动端表格
    if(!this.$store.getters.isPC){
      this.columns_mob()
    }
  },
  destroyed() {
    localStorage.removeItem('enterpName')
    localStorage.removeItem('enterpId')
  }
}
</script>

<style lang='less' scoped>
.workOrder{
  min-height: 100%;

  .optionBlock {
    width:17%
  }
  .workOrder_searchBtn {
    clear:both;
    margin-top:75px;
    margin-left:30px;
    padding:5px 40px 6px;
    font-size:13px
  }
}
.tableShow{
  margin-top: 40px
}
@media (max-width: 768px){
  .tableShow{
    margin-top: 0
  }
}
</style>
