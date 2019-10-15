<template>
  <div @click="hideNav($event)">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'绑码 / 收货 / 发货记录查询'"/>
    <!-- 解除绑定 -->
    <Modal v-model="cancelBindM" title="解除绑定" @on-ok="cancelBind">
      <p>确定要解除<span style="font-weight:bold;color:black"> {{currentCode}} </span>与产品的关系吗?</p>
    </Modal>

    <div class="header" v-show="$store.getters.isPC">
          <!-- 条件搜索 -->
          <div class="searchParam" style="overflow:hidden" v-show="$store.getters.isPC">
            <div class="optionBlock" v-show="user_type!=1">
              <h3 style="margin:20px 0;font-weight:normal">代理商类别</h3>
              <Select v-model="queryOrder.agency_category" class="form_select">
                <Option v-for="item in agentTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </div>
            <div class="optionBlock">
              <h3 style="margin:20px 0;font-weight:normal">代理商名称</h3>
              <Select v-model="queryOrder.agency_id" class="form_select">
                <Option v-for="item in agentList" :value="item.id" :key="item.id">{{ item.authorization }}</Option>
              </Select>
            </div>
            <div class="optionBlock">
              <h3 style="margin:20px 0;font-weight:normal">防伪码类型</h3>
              <Select v-model="queryOrder.code_type" class="form_select">
                <Option v-for="item in codeTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="optionBlock">
              <h3 style="margin:20px 0;font-weight:normal">操作类型</h3>
              <Select v-model="queryOrder.op_type" class="form_select">
                <Option v-for="item in actTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="optionBlock">
              <h3 style="margin:20px 0;font-weight:normal">起止时间</h3>
              <DatePicker v-model="op_date" type="daterange" split-panels class="form_select"></DatePicker>
            </div>
            <Button class="workOrder_searchBtn" type="primary" @click="queryOrderList">搜索</Button>
            <Button class="workOrder_searchBtn" style="margin-left:10px" type="primary" @click="queryOrderList('all')">搜索全部</Button>
          </div>
    </div>
    <!-- 移动端-条件搜索 -->
    <div class="mob_searchParam" v-show="!$store.getters.isPC">
      <div class="filterBox" ref="filterBox" v-show="!$store.getters.isPC" :class="arrClass">
        <div class="itemBox" v-show="user_type!=1">
          <h5>代理商类别</h5>
          <Select v-model="queryOrder.agency_category">
            <Option v-for="item in agentTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <!-- <select class="originalSelect" v-model="queryOrder.agency_category">
              <option v-for="i in agentTypeList" :value="i.id">{{i.name}}</option>
          </select> -->
        </div>
        <div class="itemBox">
          <h5 >代理商名称</h5>
          <Select v-model="queryOrder.agency_id">
            <Option v-for="item in agentList" :value="item.id" :key="item.id">{{ item.authorization }}</Option>
          </Select>
          <!-- <select class="originalSelect" v-model="queryOrder.agency_id">
              <option v-for="i in agentList" :value="i.id">{{i.authorization}}</option>
          </select> -->
        </div>
        <div class="itemBox">
          <h5>防伪码类型</h5>
          <Select v-model="queryOrder.code_type">
            <Option v-for="item in codeTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="itemBox">
          <h5>操作类型</h5>
          <Select v-model="queryOrder.op_type">
            <Option v-for="item in actTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="itemBox" v-show="false">
          <h5>起止时间</h5>
          <Button class="datePicker" type="text" @click="openDatePicker('pickerStart')">{{mob_startTime}}</Button>
          <mt-datetime-picker ref="pickerStart" type="date" v-model="op_date_m" ></mt-datetime-picker>
          <Button style="margin-top:10px" class="datePicker" type="text" @click="openDatePicker('pickerEnd')">{{mob_endTime}}</Button>
          <mt-datetime-picker ref="pickerEnd" type="date" v-model="op_date_mE" ></mt-datetime-picker>
        </div>
        <div class="buttonWrap">
          <Button class="reset" @click.stop="reset_queryParam">重置</Button>
          <Button type="primary" @click.stop="queryOrderList">搜索</Button>
        </div>
      </div>
      <Icon class="setting"  @click.stop="handdleNav" type="ios-settings" />
    </div>
    <Table :row-class-name="rowClassName" :columns="columns" :data="data"></Table>
    <Page class="page" :total="pageTotal" @on-change="pageChange" />
  </div>
</template>

<script>
  import {mapActions,mapGetters} from 'vuex'
  import { year,month,date,hh,mm,ss,timeExchange } from '../../utils/timeExchange.js'

  export default {
    data() {
      return {
        arrClass:[],
        spinShow:false,
        cancelBindM:false,
        currentCode:'',
        currentOpType:-1,
        pageTotal: 0,
        user_type:0,
        options: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now()
          }
        },
        op_date:'',
        op_date_m:'',
        op_date_m_txt:'',
        op_date_mE:'',
        op_date_mE_txt:'',
        queryOrder:{},
        agentType: '',
        agentList:[],
        agentTypeList: [],
        codeType: '',
        codeTypeList: [
          {
            value: 0,
            label: '大码'
          },
          {
            value: 1,
            label: '小码'
          }
        ],
        actType: '',
        actTypeList: [{
            value: 0,
            label: '绑码操作'
          },{
            value: 2,
            label: '收货操作'
          },{
            value: 1,
            label: '发货操作'
          },{
            value:3,
            label: '取消绑码'
          },{
            value:4,
            label: '取消发货'
          }],
        prodList:[],
        current: 1,
        pageSize: 6,
        columns: [{
            title: '序号',
            width:100,
            align: 'center',
            render: (h, params) => {
              let index = params.index + 1
              return h('span', String(index).padStart(2,'0'))
            }
          },
          {
            title: '防伪码',
            align: 'center',
            key: 'code'
          },
          {
            title: '防伪码类型',
            align: 'center',
            render: (h,param) => {
              if(param.row.code_type == 0){
                return h('span','大码')
              } else {
                return h('span','小码')
              }
            }
          },
          {
            title: '绑定产品',
            align: 'center',
            render: (h,param) => {
              var newArr = this.prodList.map((item) => {
                if(item.id == param.row.product_id){
                   return h('span',item.name)
                }
              })
              return h('div',newArr)
            }
          },
          {
            title: '操作类型',
            align: 'center',
            render:(h,param) => {
              let opType = param.row.op_type
              if(opType == 0){
                return h('span','绑码')
              } else if(opType == 1){
                return h('span','发货')
              } else if(opType == 2){
                return h('span','收货')
              } else if(opType == 3){
                return h('span','取消绑码')
              } else {
                return h('span','取消发货')
              }
            }
          },
          {
            title: '发货至代理商',
            align: 'center',
            render: (h,param) => {
              var newArr = this.agentList.map((item) => {
                if(item.id == param.row.agency_id){
                  return h('span',item.authorization)
                }
              })
             return h('div',newArr)
            }
          },
          {
            title: '创建时间',
            align: 'center',
            render: (h,param) => {
              timeExchange(param.row.created_time)
              return h('span',`${year}年${month}月${date}日-${hh}:${mm}:${ss}`)
            }
          },{
            title: '操作',
            align: 'center',
            render: (h,param) => {
              var opType = param.row.op_type
              if(opType ==0 || opType ==1){
                return   h('Button', {
                    props: {shape: 'circle',size: 'small'},
                    attrs: {id: 'btn2'},
                    on: {
                      click: () => {
                        this.currentCode = param.row.code
                        this.currentOpType = param.row.op_type
                        this.cancelBindM = true
                      }
                    }
                  }, '解除绑码/发货')}
           }
          }],
        data: []
      }
    },
    watch:{
      searchAgenTypeResult:function(val){
        this.$set(this,'agentTypeList',val)
      },
      queryAgency_re:function(val){
        if(val){
          this.$set(this,'agentList',val)
        }
      },
      query_optionCodeList:function(val){
        var newVal = val.map(i => {
          i.created_time = Date.parse(i.created_time)
          return i
        })
        newVal.sort((a,b) => {
          return b.created_time - a.created_time
        })
        this.$set(this,'data',newVal)
      },
      searchProResult:function(val){
        this.prodList = val
      }
    },
    computed: {
      ...mapGetters([
        'searchAgenTypeResult',
        'queryAgency_re',
        'query_optionCodeList',
        'searchProResult'
      ]),
      mob_startTime:function(){
        if(this.op_date_m){
          var date = new Date(this.op_date_m)
          this.op_date_m_txt = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
          return  `起：${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`
        } else return '开始时间'
      },
      mob_endTime:function(){
        if(this.op_date_mE){
          var date = new Date(this.op_date_mE)
          this.op_date_mE_txt =  `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
          return  `止：${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`
        } else return '结束时间'
      }
    },
    methods: {
      ...mapActions([
        'searchEnterpAgencyType',
        'queryAgency_',
        'queryOptionCode',
        'searchPro',
        'cancel_bind',
        'cancel_goods'
      ]),
      reset_queryParam(){
        this.queryOrder = {}
      },
      pageChange(p){
        this.getRecord(this.queryOrder,p)
      },
      openDatePicker(str){
        this.$refs[str].open();
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
      changeDate(date){
        var d = new Date(Date.parse(date.toISOString()))
        var year = d.getFullYear()
        var month = d.getMonth()+1
        var day = d.getDate()

        if(month < 10){
          month = `0${month}`
        }
        if(day < 10){
          day = `0${day}`
        }
        return Number(`${year}${month}${day}`)
      },
      cancelBind_code(){
        this.spinShow = true

        this.cancel_bind({code:this.currentCode}).then(resp => {
          this.spinShow = false
          var msg = resp.data.error_msg

          if( msg || msg==undefined ){
            this.$Message.warning(msg || '解绑失败请再试')
            return
          }
          this.$Message.success('解绑成功')
        })
      },
      cancelBind_goods(){
        this.spinShow = true

        this.cancel_goods({code:this.currentCode}).then(resp => {
          this.spinShow = false
          var msg = resp.data.error_msg

          if(msg || msg==undefined){
            this.$Message.warning(msg || '解除发货失败请再试')
            return
          }
          this.$Message.success('解除发货成功')
        })
      },
      cancelBind(){
        if(this.currentOpType == 0){
          this.cancelBind_code()
        } else if(this.currentOpType == 1){
          this.cancelBind_goods()
        }
      },
      getRecord(paramObj,p){
        var pageObj = {per_page_num: 50,page_idx:p}
        if(!this.$store.getters.isPC){
           pageObj.per_page_num = 20
        }
        var newObj = Object.assign(pageObj,paramObj)
        this.spinShow = true
        this.queryOptionCode(newObj).then(resp => {
          this.arrClass.splice(0,1)
          this.spinShow = false
          if(resp){
            this.pageTotal = resp.data.data.page_num*10
          } else {
            this.$Message.warning('查询失败请再试')
          }
        })
      },
      queryOrderList(...args){
          if(args[0] == 'all'){
            this.queryOrder = {}
            this.getRecord(this.queryOrder,1)
            return
          }
          if(this.$store.getters.isPC){
            if(this.op_date[0]){
              this.$set(this.queryOrder,'op_date_min',this.changeDate(this.op_date[0]))
              this.$set(this.queryOrder,'op_date_max',this.changeDate(this.op_date[1]))
            }
          } else {
            if(this.op_date_m_txt && this.op_date_date_mE_txt){
              this.$set(this.queryOrder,'op_date_min',this.op_date_m_txt)
              this.$set(this.queryOrder,'op_date_max',this.op_date_mE_txt)
            }
          }

         this.getRecord(this.queryOrder,1)
      },
      columns_mob(){
        this.$set(this.columns[0],'fixed','left')
        this.$set(this.columns[0],'width',70)
        this.$set(this.columns[1],'width',150)
        this.$set(this.columns[2],'width',80)
        this.$set(this.columns[3],'width',100)
        this.$set(this.columns[4],'width',80)
        this.$set(this.columns[5],'width',130)
        this.$set(this.columns[6],'width',120)
        this.$set(this.columns[7],'width',120)
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
      this.spin = true
      this.user_type = localStorage.getItem('user_type')

      //移动端
      if(!this.$store.getters.isPC){
        this.columns_mob()
      }
      if(this.user_type!=1){
        //获取代理商类目
        this.searchEnterpAgencyType()
      }
      //获取代理商名称
      this.queryAgency_({per_page_num: 999999,page_idx: 1})
      //获取产品
      this.searchPro({per_page_num:999999,page_idx:1})
      //获取码操作记录
      this.getRecord({},1)
    }
  }
</script>

<style scoped>
  .selects {
    margin-left: 85px;
  }

  .select {
    margin: -15px 0 0 15px;
  }
  .form_select {
    width:100%;
    margin: 15px 0
  }
  .ivu-date-picker-rel {
    top: -8px !important;
  }
  .optionBlock {
    width:15%
  }
  .workOrder_searchBtn{
    margin-top: 75px;
    margin-left: 30px;
    padding: 5px 40px 6px
  }
  .datePicker{
    padding: 2px 15px 3px;
    border:1px solid #dcdee2;
    border-radius:30px;
    width:100%;
    text-align: center;
    font-size: 15px;
    background: #fff;
  }
</style>
