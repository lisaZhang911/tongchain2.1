<template>
  <!-- 平台专用 -->
  <div class="enterpMg" @click="hideNav($event)">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'企业管理'" />
    <!-- 条件 -->
    <div class="searchParam" style="overflow:hidden" v-show="$store.getters.isPC">
      <div class="optionBlock">
        <h3>企业名</h3>
        <Input :disabled="searchParam" v-model="like_name" placeholder="输入企业名" style="width:100%;margin-top:15px;height:30px" />
      </div>
      <div class="optionBlock">
        <h3>选择企业状态</h3>
        <Select :disabled="searchParam" v-model="enterpType_h" @on-change="enterQuery" style="width:100%;margin: 15px 0">
           <Option v-for="item in statusSelc" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="optionBlock">
        <h3>按账号搜索企业</h3>
        <Input v-model="enterprise_sa" placeholder="输入账号" style="margin-top:15px;width:100%;height:30px" />
      </div>
      <Button class="searchBtn" type="primary" @click="queryOrderList">搜索</Button>
      <Button style="margin-left:10px" class="searchBtn" type="primary" @click="queryOrderList('all')">搜索全部</Button>
    </div>
    <!-- 移动端-条件 -->
    <div class="mob_searchParam" v-show="!$store.getters.isPC">
      <div class="mob_searchLink">
        <a :disabled="searchParam" @click="toSearchPage"><Icon type="ios-search" /> <span>{{enterpName}}</span> </a>
      </div>
      <div class="filterBox" ref="filterBox" v-show="!$store.getters.isPC" :class="arrClass">
        <div class="itemBox">
          <h5>选择企业状态</h5>
          <Select :disabled="searchParam" v-model="enterpType_h" @on-change="enterQuery" style="width:200px;margin: 15px 0">
             <Option v-for="item in statusSelc" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="itemBox">
          <h5 style="float:left">按账号搜索</h5>
          <Input v-model="enterprise_sa" placeholder="输入完整账号" style="width:200px;float:left"/>
        </div>
        <div class="buttonWrap">
          <Button class="reset" @click.stop="reset_queryParam">重置</Button>
          <Button type="primary" @click.stop="queryOrderList">搜索</Button>
        </div>
      </div>
      <Icon class="setting"  @click.stop="handdleNav" type="ios-settings" />
    </div>
    <!-- 移动端-详情/编辑 -->
    <div class="mobForm" v-show="!$store.getters.isPC && em_form">
      <div class="mobForm_title">
        <a @click="goback('em_form')" class="backIcon" style="position:absolute"><Icon type="ios-arrow-back" /></a>
        <h2 class="title">{{head}}</h2>
        <button type="button" @click="updateEnterp">保存</button>
      </div>
      <div class="mobForm_item">
        <span>名称</span><input type="text" v-model="enterInfoDetail.name" readonly>
      </div>
      <div class="mobForm_item">
        <span>数据库ID</span><input type="text" v-model="enterInfoDetail.db_id" readonly>
      </div>
      <div class="mobForm_item">
        <span>代理商上限</span><input type="text" v-model.number="enterInfoUpdate.agency_limit">
      </div>
      <div class="mobForm_item">
        <span>代理商前缀</span><input type="text" v-model="enterInfoDetail.agency_prefix" readonly>
      </div>
      <div class="mobForm_item">
        <span>处理器上限</span><input type="text" v-model.number="enterInfoUpdate.processor_limit">
      </div>
      <div class="mobForm_item">
        <span>处理器前缀</span><input type="text" v-model="enterInfoDetail.processor_prefix" readonly>
      </div>
      <div class="mobForm_item">
        <span>商品上限</span><input type="text" v-model.number="enterInfoUpdate.product_limit">
      </div>
      <div class="mobForm_item">
        <span>商品上限1</span><input type="text" v-model.number="enterInfoUpdate.production_limit">
      </div>
      <div class="mobForm_item">
        <span>流通上限</span><input type="text" v-model.number="enterInfoUpdate.circulate_limit">
      </div>
      <div class="mobForm_item">
        <span>防伪码地址</span><input type="text" v-model="enterInfoUpdate.sweep_code_address">
      </div>
      <div class="mobForm_item">
        <span>超管名</span><input type="text" v-model="enterInfoDetail.super_admin_name" readonly>
      </div>
      <div class="mobForm_item">
        <span>超管账号</span><input type="text" v-model="enterInfoDetail.super_admin_account" readonly>
      </div>
      <div class="mobForm_item">
        <span>超管密码</span><input type="text" v-model="enterInfoDetail.super_admin_password" readonly>
      </div>
      <div class="mobForm_item">
        <span>超管电话</span><input type="text" v-model="enterInfoDetail.super_admin_phone" readonly>
      </div>
      <div class="mobForm_item">
        <span>普管上限</span><input type="text" v-model.number="enterInfoUpdate.normal_admin_limit">
      </div>
    </div>
    <!-- 详情/编辑弹框 -->
    <!-- <Modal v-model="detailModal" title="企业详情/编辑" @on-ok="updateEnterp">
          <div class="modalForm">
            <label>名称</label><input type="text" v-model="enterInfoDetail.name" readonly="readonly">
            <label>数据库ID</label><input type="text" v-model="enterInfoDetail.db_id" readonly="readonly">
          </div>
          <div class="modalForm">
            <label>代理商上限</label><input type="text" v-model.number="enterInfoUpdate.agency_limit">
            <label>代理商前缀</label><input type="text" v-model="enterInfoDetail.agency_prefix" readonly="readonly">
          </div>
          <div class="modalForm">
            <label>处理器上限</label><input type="text" v-model.number="enterInfoUpdate.processor_limit">
            <label>处理器前缀</label><input type="text" v-model="enterInfoDetail.processor_prefix" readonly="readonly">
          </div>
          <div class="modalForm">
            <label>商品上限</label><input type="text" v-model.number="enterInfoUpdate.product_limit" >
            <label>商品上限1</label><input type="text" v-model.number="enterInfoUpdate.production_limit">
          </div>
          <div class="modalForm">
            <label>流通上限</label><input type="text" v-model.number="enterInfoUpdate.circulate_limit">
            <label>防伪码地址</label><input type="text" v-model="enterInfoUpdate.sweep_code_address">
          </div>
          <div class="modalForm">
            <label>超管名</label><input type="text" v-model="enterInfoDetail.super_admin_name" readonly="readonly">
            <label>超管账号</label><input type="text" v-model="enterInfoDetail.super_admin_account" readonly="readonly">
          </div>
          <div class="modalForm">
            <label>超管密码</label><input type="text" v-model="enterInfoDetail.super_admin_password" readonly="readonly">
            <label>超管电话</label><input type="text" v-model="enterInfoDetail.super_admin_phone" readonly="readonly">
          </div>
          <div class="modalForm">
            <label>普管上限</label><input type="text" v-model.number="enterInfoUpdate.normal_admin_limit">
          </div>
    </Modal> -->
    <!-- 停用弹框 -->
    <Modal v-model="stopModal" title="停用企业" @on-ok="stopEnterp">
        <p>是否停用<span style="font-weight:bold;font-size:15px">{{currentName}}</span>？</p>
    </Modal>
    <!-- 删除弹框 -->
    <Modal v-model="delEnterpModal" title="删除企业" @on-ok="delEnterpM">
        <p>是否删除<span style="font-weight:bold;font-size:15px">{{currentName}}</span>的记录</p>
    </Modal>
    <!-- 删除二次确认弹框 -->
    <Modal v-model="delEnterpConfirmModal" title="停用企业" @on-ok="delEnterp">
        <p>一旦删除<span style="font-weight:bold;font-size:15px">{{currentName}}</span>数据，将不可回复。仍然确定删除？</p>
    </Modal>
    <!-- 审核 -->
    <Modal v-model="checkModal" title="停用企业" @on-ok="delEnterp">
        <p><span style="font-weight:bold;font-size:15px">{{currentName}}</span>通过审核？</p>
    </Modal>
    <!-- 审核有效期 -->
    <Modal v-model="validM" title="审核有效期" @on-ok="checkList">
      <span>有效期/天</span><Input v-model.number="valid" placeholder="有效期" style="width:200px;display:inline-block;margin-left:5px"/>
    </Modal>
    <!-- 审核不通过 -->
    <Modal v-model="noPassM" title="否认审核" @on-ok="noPass">
        <p>不通过审核的原因：</p>
        <div class="modalForm">
          <textarea type="text" v-model="noPassReason" rows="5" cols="50"></textarea>
        </div>
    </Modal>
    <a class="stop_link" @click="goStopPage">查看停用企业<Icon type="ios-arrow-forward" /></a>
    <Table :row-class-name="rowClassName" :columns="columns" :data="enterpList"></Table>
    <!-- <hr v-show="getStopEnterpList" class="underLine"/> -->
    <!-- <h3 v-show="getStopEnterpList" style="font-weight:normal">以下企业被停用</h3> -->
    <!-- <Table v-show="getStopEnterpList" :row-class-name="rowClassName" :columns="columns_stop" :data="enterpList_stop"></Table> -->
  </div>
</template>
<script>
import { mapActions,mapGetters } from 'vuex'
import { enterpTypeChoose } from '../../utils/formType.js'
import pathPublic from '../../utils/public.js'
import { timeExchange,year,month,date,hh,mm,ss } from '../../utils/timeExchange.js'
// import {Icon} from 'iview'

export default {
  // components: {
  //   Icon
  // },
  data(){
    return {
      searchParam:false,
      enterprise_sa:'',
      like_name:'',
      em_form:false,
      head:'',
      enterpName:'搜索企业',
      valid:0,
      validM:false,
      stopModal:false,
      detailModal: false,
      delEnterpModal: false,
      delEnterpConfirmModal:false,
      checkModal:false,
      spinShow: false,
      enterpType_h: -1,
      enterpType: Number(localStorage.getItem('enterp_type')) || 4,
      enterpTypeStr:'',
      currentId: localStorage.getItem('enterpId'),
      currentName: '123',
      currentIndex:-1,
      queryOrder:{},
      del_code:'',
      noPassM:false,
      noPassReason:'',
      statusSelc: enterpTypeChoose,
      arrClass:[],
      enterInfoDetail:{},
      enterInfoUpdate:{},
      enterpList: [],
      enterpList_stop: [],
      columns: [{
          title: '注册账号',
          align: 'center',
          key: 'super_admin',
        },{
          title: '注册日期',
          align: 'center',
          render:(h,params) => {
            timeExchange(params.row.created_time)
            return h('span',`${year}年${month}月${date}日-${hh}:${mm}:${ss}`)
          }
        },{
          title:'认证状态',
          align: 'center',
          render:(h,params) => {
            return h('span',pathPublic.change_enterpType(params.row.audit))
          }
        },{
          title: '操作',
          align: 'center',
          width:200,
          render: (h, params) => {
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
                    if(!this.$store.getters.isPC){
                      this.head='企业详情'
                    }
                    localStorage.setItem('enterp_id',params.row.id)
                    this.$router.replace('/enterpManage_p_detail?detail')
                  //  this.detailEnterp(params.row.id)
                  }
                }
              }, '详情'),
              h('Button', {
                props: {
                  shape: 'circle',
                  size: 'small'
                },
                attrs: {
                  id: 'btn3'
                },
                on: {
                  click: () => {
                    this.$set(this,'delEnterpModal',true)
                    this.$set(this,'currentName',params.row.name)
                    this.$set(this,'currentId',params.row.id)
                  }
                }
              }, '删除')
            ]
            if(this.enterpType == 1){
              btnArr.push(h('Button', {
                props: {
                  shape: 'circle',
                  size: 'small'
                },
                attrs: {
                  id: 'btn1'
                },
                on: {
                  click: () => {
                    this.$set(this,'currentId',params.row.id)
                    this.$set(this,'currentName',params.row.name)
                    this.checkListM()
                  }
                }
              }, '审核'))
            } else if(this.enterpType ==3){
              btnArr.push(
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
                    this.stopModal_(params)
                  }
                }
                }, '停用'),
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
                      localStorage.setItem('enterp_id',params.row.id)
                      this.$router.replace('/enterpManage_p_detail?config')
                    }
                  }
                }, '配置')
              )
            }
            return h('div', btnArr)
          }
        }]
    }
  },
  computed: {
    ...mapGetters([
      'getAllEnterpList',
      // 'getStopEnterpList',
      'enterpDetail_store'
    ])
  },
  watch:{
    enterprise_sa:function(val){
      if(val){
        this.searchParam=true
      } else {
        this.searchParam=false
      }
    },
    enterpDetail_store:function(val){
      this.$set(this,'enterInfoDetail',val)
      var need_keyArr=[
        'normal_admin_limit',
        'agency_limit',
        'processor_limit',
        'product_limit',
        'production_limit',
        'circulate_limit',
        'sweep_code_address'
      ]
      var need_keyStr = need_keyArr.join('')
      for(var i of Object.keys(val)){
        if(need_keyStr.indexOf(i)>-1){
          this.enterInfoUpdate[i]=val[i]
        }
      }
    },
    getAllEnterpList:function(val){
      if(this.searchParam){
        this.enterpType = val[0].audit
      }
      this.$set(this,'enterpList',val)

      if(this.enterpType==0){
        this.columsRemove_loop0(this.columns)
      }

      if(this.enterpType==1){
        if(this.columns[0].title!='企业名称'){
          this.colums_addName()
        }
        if(this.columns[1].title!='提交认证日期'){
          this.columns_addCommit(val)
        }
        this.columsRemove_loop1(this.columns)
      }

      if(this.enterpType==2){
        if(this.columns[0].title!='企业名称'){
          this.colums_addName()
        }
        this.columsRemove_loop2(this.columns)
      }

      if(this.enterpType==3){
        if(this.columns[0].title!='企业名称'){
          this.colums_addName()
        }
        if(this.columns[2].title!='认证日期'){
          this.columns_addVerify(val)
        }
        this.columsRemove_loop3(this.columns)
      }
    },
    // getStopEnterpList:function(val){
    //   this.$set(this,'enterpList_stop',val)
    // }
  },
  methods: {
    ...mapActions([
      'queryAllEnter',
      'stopEnter_',
      'updateEnterp_',
      // 'detailEnterp_',
      'delEnterp_',
      'passCheck',
      'searchOrderList'
    ]),
    goStopPage(){
      this.$router.replace('/enterpManage_stop')
    },
    search_filter(){
      this.queryOrder.like_name=this.like_name
      this.queryOrder.audit=this.enterpType
      this.arrClass.splice(0,1)

      //this.searchOrderList(this.queryOrder)
    },
    hideNav(eve){
      if(!this.$refs.filterBox.contains(eve.target)){
        this.arrClass.splice(0,1)
      }
    },
    // changeStatus(num){
    //   this.enterpType=num
    // },
    toSearchPage(){
      pathPublic.toSearchPage()
    },
    handdleNav(){
      if(!this.arrClass.includes('slide')){
        this.arrClass.splice(0,1,'slide')
      }
    },
    goback(str){
      this.$set(this,str,false)
      this.enterpInfo = {}
    },
    reset_queryParam(){
      this.enterpType = -1
      this.enterprise_sa = ''
    },
    colums_addName(){
      var obj = {
        align: 'center',
        title:'企业名称',
        key:'name'
      }
      if(!this.$store.getters.isPC){
        obj['width']=150
      }
        this.columns.splice(0,0,obj)
        this.columns[this.columns.length-1]['width']=300
    },
    columns_addCommit(data){
      var obj={
        title:'提交认证日期',
        align: 'center',
        render: (h,data)=> {
          if(data.row.updated_time){
            timeExchange(data.row.updated_time)
            return h('span',`${year}年${month}月${date}日-${hh}:${mm}:${ss}`)
          } else {
            return h('span','')
          }
      }
    }
    if(!this.$store.getters.isPC){
      obj['width']=180
    }
      this.columns[this.columns.length-1]['width']=280
      this.columns.splice(1,0,obj)
    },
    columns_addVerify(data){
      var obj = {
        title:'认证日期',
        align: 'center',
        render: (h,data) => {
          if(data.row.audited_time){
            timeExchange(data.row.audited_time)
            return h('span',`${year}年${month}月${date}日-${hh}:${mm}:${ss}`)
          } else {
            return h('span','')
          }
        }
      }
      if(!this.$store.getters.isPC){
        obj['width'] =180
      }
      this.columns[this.columns.length-1]['width']=400
      this.columns.splice(2,0,obj)
    },
    colums_remove(index){
      this.columns.splice(index,1)
    },
    columsRemove_loop0(arr){
      for(var i=0;i<arr.length;i++){
        if(arr[i].title=='企业名称' || arr[i].title=='提交认证日期' || arr[i].title=='认证日期'){
          this.colums_remove(i)
          this.columsRemove_loop0(this.columns)
        }
      }
    },
    columsRemove_loop1(arr){
      for(var i=0;i<arr.length;i++){
        if(arr[i].title=='认证日期'){
          this.colums_remove(i)
          this.columsRemove_loop1(this.columns)
        }
      }
    },
    columsRemove_loop2(arr){
      for(var i=0;i<arr.length;i++){
        if(arr[i].title=='认证日期' || arr[i].title=='提交认证日期'){
          this.colums_remove(i)
          this.columsRemove_loop2(this.columns)
        }
      }
    },
    columsRemove_loop3(arr){
      for(var i=0;i<arr.length;i++){
        if(arr[i].title=='提交认证日期'){
          this.colums_remove(i)
          this.columsRemove_loop3(this.columns)
        }
      }
    },
    queryOrderList(...args){
      this.spinShow = true

      this.queryOrder={}
      this.arrClass.splice(0,1)
      if(this.enterprise_sa){
        this.queryOrder.enterprise_sa = this.enterprise_sa
      } else {
        this.queryOrder.audit=this.enterpType=this.enterpType_h
        this.queryOrder.like_name=this.like_name
      }
      if(args[0]=='all'){
        this.queryOrder.audit = 4
        this.queryOrder.like_name = ''
        this.enterpType_h = -1
      }
      this.queryAllEnter(this.queryOrder).then(() => {
        this.spinShow = false
      })
    },
    enterQuery(value){
      // localStorage.setItem('enterp_type',value)
      // this.enterpType = value
      //
      // var enterpTypeStr = pathPublic.change_enterpType(this.enterpType)
      // this.enterpTypeStr = enterpTypeStr

      // this.queryAllEnter({audit:value,like_name:this.like_name}).then((resp) => {
      //   this.spinShow=false
      //   this.arrClass.splice(0,1)
      // })
    },
    updateEnterp(){
      this.spinShow=true
      this.enterInfoUpdate.id=this.currentId
      this.updateEnterp_(this.enterInfoUpdate).then((msg) => {
        this.spinShow=false
        this.em_form=false
        if(msg || msg==undefined){
          this.$Message.error(msg || '修改失败')
          return
        }
        this.$Message.success('修改成功');
      }).catch(() => {
        this.$Message.error('修改失败')
      })
    },
    stopModal_(param){
      this.$set(this,'stopModal',true);
      this.$set(this,'currentId',param.row.id);
      this.$set(this,'currentName',param.row.name);
      this.$set(this,'currentIndex',param.index);
    },
    stopEnterp(){
      this.stopEnter_({id:this.currentId}).then((resp) => {
        if(resp.data.error_msg){
          this.$Message.error(resp.data.error_msg)
          return
        }
        this.$Message.success(`成功停用${this.currentName}`)
        this.queryAllEnter(
          {audit:this.enterpType}
        ).then(() => {
          this.$set(this,'spinShow',false)
        })
      })
    },
    // detailEnterp(enId){
    //    this.$set(this,'currentId',enId)
    //    this.$set(this,'spinShow',true)
    //    this.em_form=true
    //   this.detailEnterp_({id:enId}).then((msg) => {
    //     this.$set(this,'spinShow',false)
    //     this.em_form=false
    //     if(msg){
    //       this.$Message.error(msg)
    //       return
    //     }
    //     // this.$set(this,'enterInfoDetail',this.enterpDetail_store)
    //     if(this.$store.getters.isPC){
    //       this.$set(this,'detailModal',true)
    //     }
    //   })
    // },
    checkListM(){
      this.$Modal.confirm({
        title: '审核企业',
        closable:true,
        content: `<p><span style="font-weight:bold;font-size:15px">${this.currentName}</span>是否通过审核</p>`,
        okText: '通过',
        onOk: this.passModal,
        cancelText: '不通过',
        onCancel: this.noPassModal
      });
    },
    passModal(){
      this.validM=true
    },
    checkList(){
      this.$set(this,'spinShow',true)
      this.passCheck({id:this.currentId,pass:true,valid_day:this.valid}).then((resp) => {
        this.$set(this,'spinShow',false)
        if(resp.data.error_code!=0){
          this.$Message.error(resp.data.error_msg)
          return
        }
        this.$Message.success('通过审核')
        this.queryAllEnter({audit:this.enterpType}).then(() => {
          this.spinShow = false
        })
      })
    },
    noPassModal(){
      this.noPassM=true
    },
    noPass(){
      this.$set(this,'spinShow',true)
      this.passCheck({id:this.currentId,pass:false,audit_msg:this.noPassReason}).then((resp) => {
        this.$set(this,'spinShow',false)
        if(resp.data.error_code!=0){
          this.$Message.error(resp.data.error_msg)
          return
        }
        this.$Message.success('处理成功')
        this.queryAllEnter({audit:this.enterpType}).then(() => {
          this.spinShow = false
        })
      })
    },
    delEnterpM(){
      this.$set(this,'delEnterpConfirmModal',true)
      this.delEnterp_({id:this.currentId}).then((resp) => {
        if(resp.data.data){
          this.$set(this,'del_code',resp.data.data.del_code)
        }
      })
    },
    delEnterp(){
      this.$set(this,'spinShow',true)
      this.delEnterp_({id:this.currentId,del_code:this.del_code}).then((resp) => {
        this.$set(this,'spinShow',false)
        if(resp.data.error_code!=0){
          this.$Message.error(resp.data.error_msg)
          return
        }
        this.$Message.success('删除成功')
        this.queryAllEnter({audit:this.enterpType}).then(() => {
          this.spinShow = false
        })
      })
    },
    column_mob(){
      this.$set(this.columns[0],'fixed','left')
      this.$set(this.columns[0],'width',100)
      this.$set(this.columns[1],'width',180)
      this.$set(this.columns[2],'width',100)
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
    // if(!localStorage.getItem('enterp_type')){
    //   localStorage.setItem('enterp_type',0)
    // }
    if(localStorage.getItem('enterpName')){
      this.like_name=localStorage.getItem('enterpName')
      this.enterpName=localStorage.getItem('enterpName')
    }
    // 将企业状态改为中文
    // var enterpTypeStr = pathPublic.change_enterpType(localStorage.getItem('enterp_type'))
    // this.enterpTypeStr = enterpTypeStr
    // 初始化获取对应企业列表
    // this.$set(this,'spinShow',true)
    this.queryAllEnter(
      {audit:this.enterpType,like_name:this.like_name}
    ).then(() => {
      this.$set(this,'spinShow',false)
    })
      // 移动端-添加某些属性
    if(!this.$store.getters.isPC){
      this.column_mob()
    }
  }
}
</script>

<style  scoped>
.searchBtn{
  clear:both;
  margin-top:75px;
  margin-left:30px;
  padding:5px 40px 6px;
  font-size:13px
}
.stop_link{
  font-size: 15px;
  display: block;
  margin: 10px 0;
  color: #999
}
.underLine {
  margin:40px 0 30px 0;
  height:1px;
  background:#999;
  border:0
}
.enterpMg .optionBlock {
  float: left;
  margin-right: 10px;
  width:20%;
}
</style>
