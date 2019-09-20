<template>
  <div id="">
    <Heading :c-name="'溯源事件记录员'"  :btn-add="true" @add="add()"/>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <!-- 前缀 -->
    <Modal v-model="setPreM" :mask-closable="false" title="设置事件操作员前缀" @on-ok="set_prefix">
      <p style="color:red">首次使用需先设置事件代理员前缀</p>
      <p style="color:red">一旦设置成功则不可更改，请谨慎设置</p>
      <div class="modalForm" style="margin-top:25px">
        <label>事件操作员前缀</label><input type="text" v-model="set_Prefix">
      </div>
    </Modal>
    <!-- 添加 -->
    <Modal v-model="addProcesorModal" :mask-closable="false" title="添加事件操作员" @on-ok="addProcessor('add_form')">
        <p>事件操作员前缀：{{procesor_prefix}}</p>
        <div class="modalForm">
          <label>名字</label><input type="text" v-model="newProcessorInfo.name">
        </div>
        <div class="modalForm">
          <label>帐户</label><input type="text" v-model="newProcessorInfo.account" readonly="readonly">
        </div>
        <Form ref="add_form" :model="newProcessorInfo" :rules="ruleValidate">
          <FormItem label="电话" prop="phone">
            <Input v-model="newProcessorInfo.phone" style="width:200px"></Input>
          </FormItem>
        </Form>
    </Modal>
    <!-- 移动端-添加 -->
    <FormM  v-model="showForm" :head="head" @goback="goback" @ok="addProcessor">
      <div class="mobForm_item">
        <span>事件操作员前缀</span><input style="width:50%" type="text" disabled :value="procesor_prefix">
      </div>
      <div class="mobForm_item">
        <span>名称</span><input type="text" v-model="newProcessorInfo.name">
      </div>
      <div class="mobForm_item">
        <span>账号</span> <input type="text" v-model="newProcessorInfo.account" readonly="readonly">
      </div>
      <div class="mobForm_item">
        <span>电话</span> <input type="text" v-model="newProcessorInfo.phone">
      </div>
    </FormM>
    <!-- 移动端-编辑 -->
    <FormM v-model="showForm_up" :head="head" @goback="goback" @ok="updateProcer">
      <div class="mobForm_item">
        <span>名称</span><input type="text" v-model="updateProcessorInfo.name">
      </div>
      <div class="mobForm_item">
        <span>账号</span> <input type="text" v-model="updateProcessorInfo.account">
      </div>
      <div class="mobForm_item">
        <span>电话</span> <input type="text" v-model="updateProcessorInfo.phone">
      </div>
    </FormM>
    <!-- 编辑人员 -->
    <Modal v-model="updateProcesorModal" :mask-closable="false" title="编辑事件操作员" @on-ok="updateProcer">
        <div class="modalForm">
          <label>帐户</label><input type="text" disabled v-model="updateProcessorInfo.account">
        </div>
        <div class="modalForm">
          <label>名字</label><input type="text" disabled v-model="updateProcessorInfo.name">
        </div>
        <div class="modalForm">
          <label>电话</label><input type="text" v-model="updateProcessorInfo.phone">
        </div>
    </Modal>
    <!-- 删除 -->
    <Modal v-model="delModal" :mask-closable="false" title="删除事件操作员" @on-ok="delProcesor">
      <p>确定删除事件操作员<span style="font-weight:bold">{{this.currentName}}</span>？</p>
    </Modal>
    <!-- 编辑权限 -->
    <Modal v-model="updateProcesAutoModal" :mask-closable="false" title="设置事件操作员权限" @on-ok="updateProcesor_authory">
      <CheckboxGroup v-model="traceId">
        <Checkbox v-for="item in traceCatg" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
      </CheckboxGroup>
    </Modal>
    <Table  @on-row-click ="rowInfo" :row-class-name="rowClassName" :columns="columns" :data="processorList"></Table>
    <button v-show="!$store.getters.isPC" @click="add" type="button" class="mob_addBtn" >新增</button>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import {year,month,date,hh,mm,ss,timeExchange} from '../../utils/timeExchange.js'
import publicFunc from '../../utils/public.js'

export default {
  data(){
    return {
      processor_id:-1,
      setAuthory:false,
      stopBtn:true,
      currentName:'',
      spinShow:false,
      processor_edit_form:false,
      head:'',
      showForm:false,
      showForm_up:false,
      setPreM:false,
      addProcesorModal: false,
      updateProcesorModal: false,
      updateProcesAutoModal: false,
      delModal: false,
      set_Prefix:'',
      procesor_prefix:'',
      traceId:[],
      ruleValidate:{
        phone:[
          {required:true, message:'必填', trigger:'blur'},
          {pattern:/^[1][3,4,5,7,8,9]\d{9}$/, message:'必须为11位手机号,前后不能有空格', trigger:'blur'}
        ]
      },
      newProcessorInfo: {},
      authory:[],
      traceCatg:[],
      updateProcessorInfo:{},
      processorList:[],
      processorList_s:[],
      columns:[{
          title:'名字',
          align: 'center',
          key:'name'
        },{
          title:'帐户',
          align: 'center',
          key:'account'
        },{
          title:'电话',
          align: 'center',
          key:'phone'
        },{
          title:'可操作事件',
          align: 'center',
          render:(h,param) =>{
              var authoArr = param.row.event_id
              if(authoArr instanceof Array){
                  var newAutoArr = authoArr.map((x) => {
                    for(var i of this.traceCatg){
                      if(i.id==x){
                        return h('span',`${i.name} / `)
                      }
                    }
                  })
                return h('div',newAutoArr)
              }
            }
        },{
          title:'创建时间',
          align: 'center',
          render:(h,param) => {
            timeExchange(param.row.created_time)
            return h('span',`${year}年${month}月${date}日-${hh}:${mm}:${ss}`)
          }
        },{
          title:'操作',
          align: 'center',
          render:(h,param) => {
            var baseBtn = [
              h('Button',{
                props: {
                  shape: 'circle',
                  size: 'small'
                },
                attrs: {
                  id: 'btn1'
                },
                on: {
                  click: () => {
                    this.pre_updateProcessor(param.row)
                    this.newProcessorInfo = param.row
                  }
                }
              },'编辑'),
              h('Button',{
                props: {
                  shape: 'circle',
                  size: 'small'
                },
                attrs: {
                  id: 'btn2'
                },
                on: {
                  click: () => {
                    this.delProcesorM(param.row)
                    this.newProcessorInfo = param.row
                  }
                }
              },'删除'),
              h('Button',{
                props: {
                  shape: 'circle',
                  size: 'small'
                },
                attrs: {
                  id: 'btn2'
                },
                on: {
                  click: () => {
                    this.traceId = param.row.event_id
                    var loc = 0
                    this.traceId.forEach((i,index) => {
                      loc = this.traceCatg.findIndex(val => {
                        return val.id == i
                      })
                      if(loc == -1){
                        this.traceId.splice(index,1)
                      }
                    })

                    this.$set(this,'updateProcesAutoModal',true)
                    this.newProcessorInfo = param.row
                    this.processor_id = param.row.id
                    if(this.newProcessorInfo.event_id.length>0){
                      this.newProcessorInfo.event_txt = ''
                      this.newProcessorInfo.event_id.forEach(i => {
                        var r = this.traceCatg.find(j => j.id == i)
                        if(r){ this.newProcessorInfo.event_txt += `${r.name}|` }
                      })
                    }
                  }
                }
              },'设置权限')
            ]
            return h('div',baseBtn)
          }
        }]
    }
  },
  computed:{
    ...mapGetters([
      'queryEveOpetor_re',
      'queryTraceCatg_re',
      'get_allEnterpPrefix',
      'queryEvent_re'
    ])
  },
  watch:{
    queryEvent_re:function(val){
      var obj ={}
      for(var erI of this.processorList_s){
        obj = val.find(eventI => {
          return eventI.processor_id == erI.id
        })
        if(obj){
          erI.event_id = obj.event_id
        } else {
          erI.event_id = []
        }
      }
      this.processorList = this.processorList_s
    },
    queryEveOpetor_re:function(val){
      var tmpArr = []
      val.forEach(item => {
        tmpArr.push(item.id)
      })
      this.queryAvailEvent_({processor_id:tmpArr})
      this.$set(this,'processorList_s',val)
      // this.$set(this,'processorList',val)
    },
    queryTraceCatg_re:function(val){
      this.$set(this,'traceCatg',val)
    },
    get_allEnterpPrefix:function(val){
      this.procesor_prefix = val.processor_prefix
    }
  },
  methods: {
    ...mapActions([
      'queryTraceCatg_',
      'queryEventOperator_',
      'reqAddProcesor',
      'addProcessor_',
      'updateProcesor',
      'delProcesor_',
      'updateEventAuthory',
      'getEnterp_prefix',
      'setPrefix',
      'queryAvailEvent_'
    ]),
    goback(){
      this.showForm = false
      this.showForm_up = false
    },
    set_prefix(){
        this.setPrefix({prefix:this.set_Prefix,type:1}).then((msg) => {
          if(msg){
            this.$Message.error(msg || '设置失败')
            return
          }
          this.$Message.success('设置成功')
          this.addProcesorModal = true
          this.getEnterp_prefix()
        })
    },
    add(){
      this.newProcessorInfo = {}
      if(!this.procesor_prefix){
        this.setPreM=true
        return
      }
      this.reqAddProcesor().then((resp) => {
        if(resp.error_msg){
          this.$Message.error(resp.error_msg)
          return
        }
        this.$set(this.newProcessorInfo,'account',resp.data.account)
        if(this.$store.getters.isPC){
          this.$set(this,'addProcesorModal',true)
        } else {
          this.showForm=true
          this.head='新增事件管理员'
        }
      })
    },
    openModal(){
      this.$set(this,'addProcesorModal',true)
    },
    addProcessorFun(){
      this.spinShow = true

      this.addProcessor_(this.newProcessorInfo).then(resp => {
        this.spinShow = false
        if(resp.error_msg){
          this.$Message.error(resp.error_msg)
          return
        }
        this.processor_id = resp.data.id
        console.log(this.processor_id);

        this.$Message.success('新建成功')
        this.queryEventOperator_()
        // this.newProcessorInfo = {}
        this.updateProcesAutoModal = true
        this.showForm = false
      })
    },
    addProcessor(name){
      var adVice = this.$store.getters.isPC

      if(this.adVice){
        publicFunc.validateForm.apply(this,[name,this.addProcessorFun,this.openModal])
      } else {
        if(!this.newProcessorInfo.phone){
          this.$Message.warning('请填写电话')
          return
        }
        this.addProcessorFun()
      }
    },
    pre_updateProcessor(obj){
     var nameArr =  Object.keys(obj)
     for(var item of nameArr){
       if(item =='name' || item=='account' || item=='phone'){
         this.updateProcessorInfo[item]=obj[item]
       }
     }
     if(this.$store.getters.isPC){
       this.$set(this,'updateProcesorModal',true);
     } else {
       this.showForm_up=true
       this.head='编辑事件管理员信息'
     }

    },
    updateProcer(){
      this.updateProcesor(this.updateProcessorInfo).then((msg) => {
        if(msg || msg==undefined){
          this.$Message.error(msg || '请再试')
          return
        }
        this.$Message.success('修改成功')
        this.queryEventOperator_()
        this.showForm_up=false
      })
    },
    delProcesorM(){
      this.$set(this,'delModal',true)
    },
    delProcesor(){
      this.delProcesor_({id:this.processor_id}).then((msg) => {
        if(msg){
          this.$Message.error(msg)
          return
        }
        this.$Message.success('删除成功')
        this.queryEventOperator_()
      })
    },
    updateProcesor_authory(){
      this.updateEventAuthory({
        processor_id:this.processor_id,
        event_id:this.traceId
      }).then((msg) => {
        if(msg || msg==undefined){
          this.$Message.error(msg || '更新权限成功')
          return
        }
        this.$Message.success('更新事件操作权限成功')
        this.queryEventOperator_()
        this.traceId = []
      })
    },
    column_mob(){
      this.$set(this.columns[0],'fixed','left')
      this.$set(this.columns[0],'width',100)
      this.$set(this.columns[1],'width',100)
      this.$set(this.columns[2],'width',110)
      this.$set(this.columns[3],'width',160)
      this.$set(this.columns[4],'width',130)
      this.$set(this.columns[5],'width',240)
    },
    rowInfo(row){
      this.$set(this,'processor_id',row.id)
      this.$set(this,'currentName',row.name)
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
    this.queryEventOperator_()
    this.queryTraceCatg_()
    this.getEnterp_prefix()

    //移动端-表格
    if(!this.$store.getters.isPC){
      this.column_mob()
    }
  }
}
</script>

<style scoped>
</style>
