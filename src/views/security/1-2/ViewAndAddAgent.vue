<template>
  <div @click="hideNav($event)">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'查看 / 添加代理商'" :btn-add="true" @add="add()" />
    <!-- 前缀 -->
    <Modal v-model="setPreM" :mask-closable="false" title="设置代理商账号名前缀" @on-ok="set_prefix">
      <p style="color:red">首次添加代理商，请先设置代理商账号前缀，只能设为英文字符(不区分大小写)，一经设置，将不可更改</p>
      <p style="color:red">建议将前缀设为公司拼音缩写字母。如：成都通链网络科技，可设为“CDTL”</p>
      <div class="modalForm" style="margin-top:25px">
        <label style="width:101px">代理商帐户名前缀</label><input type="text" v-model="set_Prefix">
      </div>
    </Modal>
    <!-- 新建 -->
    <Modal v-model="addModal" :mask-closable="false" title="添加代理商" @on-ok="addAgent('form_add')">
      <p class="mb24">代理商帐户名前缀：{{this.agency_prefix}}</p>
      <div class="modalForm">
        <label>代理商账号</label><input type="text" readonly v-model="newAgentInfo.account">
      </div>
      <div class="modalForm">
        <label>代理商所在省</label>
        <Select v-model="newAgentInfo.location" style="width:74%" @on-change="add_location">
          <Option v-for="item in testPro" :value="item.code" :key="item.name">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="modalForm">
        <label>代理商所在市</label>
        <Select v-model="newAgentInfo.city" style="width:74%">
          <Option v-for="item in testCity" :value="item.code" :key="item.name">{{ item.name }}</Option>
        </Select>
      </div>
      <Form ref="form_add" :model="newAgentInfo" :rules="ruldValid">
        <FormItem class="custom" label="代理商授权名" prop="authorization" style="margin-bottom:0">
          <Input v-model="newAgentInfo.authorization"></Input>
          <p style="color:red">即：代理商姓名或公司名</p>
        </FormItem>
        <FormItem class="custom" label="代理商电话" prop="phone">
          <Input v-model="newAgentInfo.phone"></Input>
          <p style="color:red">初始密码为号码后6位</p>
        </FormItem>
        <FormItem class="custom" label="代理商等级" prop="level">
          <Select v-model="newAgentInfo.level" style="width:74%">
            <Option v-for="item in levelList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem v-show="user_type!=1" class="custom" label="代理商类别" prop="category">
          <Select v-model="newAgentInfo.category" style="width:74%">
            <Option v-for="item in typeList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <!-- 移动端-新增 -->
    <FormM v-model="showForm" :head="head" @goback="goback" @ok="addAgent">
      <div class="mobForm_item">
        <span>授权名</span><input type="text" v-model="newAgentInfo.authorization">
      </div>
      <div class="mobForm_item">
        <span>代理商电话</span>  <input type="text" v-model="newAgentInfo.phone">
      </div>
      <div class="mobForm_item">
        <span>代理商账号</span>  <input type="text" disabled v-model="newAgentInfo.account">
      </div>
      <div class="mobForm_item">
        <label>代理商所在省</label>
        <Select v-model="newAgentInfo.location" style="width:74%" @on-change="add_location">
          <Option v-for="item in testPro" :value="item.code" :key="item.name">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="mobForm_item">
        <label>代理商所在市</label>
        <Select v-model="newAgentInfo.city" style="width:74%">
          <Option v-for="item in testCity" :value="item.code" :key="item.name">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="mobForm_item">
        <label>代理商等级</label>
        <Select v-model="newAgentInfo.level" style="width:200px">
          <Option v-for="item in levelList" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </div>
      <div class="mobForm_item" v-show="user_type!=1">
        <label>代理商类别</label>
        <Select v-model="newAgentInfo.category" style="width:200px">
          <Option v-for="item in typeList" :value="item.id" :key="item.value">{{item.name}}</Option>
        </Select>
      </div>
    </FormM>
    <!-- 删除 -->
    <Modal v-model="delModal" :mask-closable="false" title="删除代理商" @on-ok="delAgent">
      <p>确定删除 <span class="pointLabel">{{currentName}}</span>? </p>
    </Modal>
    <!-- 停用/启用 -->
    <Modal v-model="opModal" :mask-closable="false" :title="dyni_txt+'代理商'" @on-ok="opAgent">
      <p>确定{{dyni_txt}}代理商 <span class="pointLabel">{{currentName}}</span>? </p>
    </Modal>
    <!-- 条件搜索 -->
    <div class="searchParam" style="overflow:hidden" v-show="$store.getters.isPC">
      <div class="optionBlock">
        <h3>选择代理商类别</h3>
        <Select v-model="queryOrder.category" style="width:100%;margin: 15px 0">
          <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="optionBlock">
        <h3>选择代理商等级</h3>
        <Select v-model="queryOrder.level" style="width:100%;margin: 15px 0">
          <Option v-for="item in levelList_originally" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <!-- <div class="optionBlock">
        <h3>代理商直属与否</h3>
        <Select v-model="queryOrder.belong" style="width:100%;margin: 15px 0">
          <Option v-for="item in belongChoice" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div> -->
      <div class="optionBlock">
        <h3>代理商停用与否</h3>
        <Select v-model="queryOrder.active" style="width:100%;margin: 15px 0">
          <Option v-for="item in validChoice" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="optionBlock">
        <h3>所在地</h3>
        <Select v-model="queryOrder.location" style="width:100%;margin: 15px 0">
          <Option v-for="item in testPro" :value="item.code" :key="item.name">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="optionBlock">
        <h3>手机号码</h3>
        <Input v-model="queryOrder.tel" placeholder="按号码搜索" style="width: 100%;margin:15px 0" />
      </div>
      <Button class="workOrder_searchBtn" type="primary" @click="queryAgency">搜索</Button>
      <Button class="workOrder_searchBtn" type="primary" @click="queryAgency('all')">搜索全部</Button>
    </div>
    <!-- 移动端-条件搜索 -->
    <div class="mob_searchParam" v-show="!$store.getters.isPC">
      <div class="filterBox" ref="filterBox" v-show="!$store.getters.isPC" :class="arrClass">
        <div class="itemBox">
          <h5>代理商类别</h5>
          <Select v-model="queryOrder.category">
            <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <!-- <select class="originalSelect" v-model="queryOrder.category">
            <option v-for="i in typeList" :value="i.id">{{i.name}}</option>
          </select> -->
        </div>
        <div class="itemBox">
          <h5>代理商等级</h5>
          <Select v-model="queryOrder.level">
            <Option v-for="item in levelList_originally" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="itemBox">
          <h5>停用与否</h5>
          <Select v-model="queryOrder.active">
            <Option v-for="item in validChoice" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="itemBox">
          <h5>所在地</h5>
          <Select v-model="queryOrder.location" style="width:100%;margin: 15px 0">
            <Option v-for="item in testPro" :value="item.code" :key="item.name">{{ item.name }}</Option>
          </Select>
          <!-- <select class="originalSelect" v-model="queryOrder.location">
            <option v-for="i in testPro" :value="i.value">{{i.name}}</option>
          </select> -->
        </div>
        <div class="itemBox">
          <h5>手机号</h5>
          <Input v-model="queryOrder.tel" placeholder="按号码搜索"/>
        </div>
        <div class="buttonWrap">
          <Button class="reset" @click.stop="reset_queryParam">重置</Button>
          <Button type="primary" @click.stop="queryAgency">搜索</Button>
        </div>
      </div>
      <Icon class="setting"  @click.stop="handdleNav" type="ios-settings" />
    </div>
    <Table :row-class-name="rowClassName" :columns="columns" :data="agentList"></Table>
    <Page class="page" :total="pageTotal" @on-change="pageChange" />
    <button v-show="!$store.getters.isPC" @click="add" type="button" class="mob_addBtn" >新增</button>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import agentType from '../../../utils/agentType.js'
import publicFunc from '../../../utils/public.js'
import {pcaa,pca} from 'area-data'

export default {
    data() {
      return {
        testPro:[],
        testCity:[],
        city1:{},
        city:{},
        showForm:false,
        objOriginal:{},
        valCity:[],
        arrClass:[],
        dyni_txt:'',
        spinShow:false,
        pageTotal:0,
        curPage:1,
        head:'',
        setPreM:false,
        opModal:false,
        agentAdd_form:false,
        agentEdit_form:false,
        addModal:false,
        user_type:localStorage.getItem('user_type'),
        updateModal:false,
        delModal:false,
        currentId:-1,
        currentName:'',
        total:0,
        agency_prefix:'',
        set_Prefix:'',
        ruldValid:{
          authorization: [
            { required: true, message: '授权名不能为空', trigger: 'blur' }
          ],
          phone: [
            {required:true, messsage:'电话不能为空', trigger:'blur'},
            {pattern:/^[1][3,4,5,7,8,9]\d{9}$/, message:'必须为11位手机号码,前后不要有空格',trigger:'blur'}
          ],
          category: [
            {required:true,type:'number',message:'类目不能为空',trigger:'change'}
          ],
          level: [
            {required:true,type:'number',message:'等级不能为空',trigger:'change'}
          ]
        },
        belongChoice:[{
          value:0,
          label:'直属'
        },{
          value:1,
          label:'非直属'
        }],
        validChoice:[{
          value:0,
          label:'停用'
        },{
          value:1,
          label:'非停用'
        }],
        typeList:[],
        agentList: [],
        newAgentInfo:{},
        agentItemInfo:{},
        agentCatList:[],
        queryOrder:{},
        levelList_originally: agentType,
        levelList:[],
        columns: [{
            title: '代理商账号',
            align: 'center',
            key: 'account'
          },{
            title: '授权名',
            align: 'center',
            key: 'authorization'
          },{
            title: '电话',
            align: 'center',
            key: 'phone'
          },{
            title: '类型',
            align: 'center',
            render:(h,param) => {
              for(var i of this.typeList){
                if(i.id==param.row.category){return h('span',i.name)}
              }
            }
          },{
            title: '等级',
            align: 'center',
            render:(h,param) => {
              for(var i of this.levelList_originally){
                if(i.value==param.row.level){return h('span',i.label)}
              }
            }
          },{
            title: '地区',
            align: 'center',
            render:(h,param) => {
              let provinceList = []
              var location = pca['86'][String(param.row.location)]
              var city = pcaa[String(param.row.location)][String(param.row.city)]
              return h('div',`${location}/${city}`)
            }
          },{
            title: '状态',
            align: 'center',
            render:(h,param) => {
              if(param.row.actived){
                return h('span','有效')
              } else return h('span',{attrs:{style:'color:red'}},'停用')
            }
          },{
            title: '是否直属代理商',
            align: 'center',
            render:(h,param) => {
              if(param.row.valid){
                return h('span','是')
              } else return h('span','否')
            }
          },{
            title: '操作',
            align: 'center',
            width: 200,
            render: (h, params) => {
              var baseBtn = [h('Button', {
                  props: {
                  shape: 'circle',
                  size: 'small'
                },
                  attrs: {
                  id: 'btn2'
                },
                  on: {
                  click: () => {
                    this.delAgentM(params.row.id,params.row.account)
                  }
                }
                }, '删除')]
              var disabled_btn = h('Button', {
                props: {
                  shape: 'circle',
                  size: 'small'
                },
                attrs: {
                  id: 'btn4'
                },
                on: {
                  click: () => {
                    var obj ={}
                    this.objOriginal = params.row
                    this.currentName =  params.row.account
                    this.dyni_txt = '停用'
                    this.currentId = params.row.id
                    this.opModal = true
                    }
                  }
                }, '停用')
              var start_btn = h('Button', {
                props: {
                  shape: 'circle',
                  size: 'small'
                },
                attrs: {
                  id: 'btn1'
                },
                on: {
                  click: () => {
                    this.objOriginal = params.row
                    this.dyni_txt = '启用'
                    this.currentName = params.row.account
                    this.currentId = params.row.id
                    this.opModal = true
                  }
                }
              }, '启用')
              if(params.row.actived){
                baseBtn.splice(0,0,disabled_btn)
              } else baseBtn.splice(0,0,start_btn)
              return h('div', baseBtn)
            }
          }]
      }
    },
    watch:{
      valCity:function(val){
        this.newAgentInfo.location = parseInt(Object.keys(val[0])[0])
        this.newAgentInfo.city = parseInt(Object.keys(val[1])[0])
      },
      queryAgency_re:function(val){
        if(val){
          this.$set(this,'agentList',val)
          this.$set(this,'total',val.length)
        }
      },
      searchAgenTypeResult:function(val){
        if(val){
          this.$set(this,'typeList',val)
        }
      },
      get_allEnterpPrefix:function(val){
        this.agency_prefix=val.agency_prefix
      }
    },
    computed: {
      ...mapGetters([
        'queryAgency_re',
        'searchAgenTypeResult',
        'get_allEnterpPrefix'
      ])
    },
    methods: {
      ...mapActions([
        'searchEnterpAgencyType',
        'queryAgency_',
        'updateAgency_',
        'delAgency_',
        'pre_addAgency',
        'add_agent',
        'getEnterp_prefix',
        'setPrefix',
        'disabelAgent',
        'startAgent'
      ]),
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
      reset_queryParam(){
        this.queryOrder = {}
      },
      getAgencyList(pageNum,paramObj){
        var pageInfo = {per_page_num:20,page_idx:pageNum}
        var paramInfo = Object.assign(pageInfo,paramObj)

        this.spinShow = true
        this.queryAgency_(paramInfo).then((resp) => {
          this.spinShow = false

          if(resp.error_msg || resp.error_msg==undefined){
            this.$Message.error(resp.error_msg || '查询失败')
          }
          this.pageTotal = resp.data.page_num*10
          this.$set(this,'spinShow',false)
        })
      },
      pageChange(p){
        this.curPage = p
        this.getAgencyList(p,{})
      },
      goback(){
        this.showForm = false
        this.newAgentInfo = {}
        this.agentItemInfo = {}
        this.newAgentInfo.location = 110000
        // this.$set(this,str,false)
        // if(str == 'agentAdd_form'){
        //   this.newAgentInfo = {}
        //   this.newAgentInfo.location = 110000
        // } else {
        //   this.agentItemInfo = {}
        // }
      },
      add_location(val){
        var obj ={}
        this.testCity = []
        Object.keys(pcaa[val]).forEach(key => {
          obj.code = parseInt(key)
          obj.name = pcaa[val][key]
          this.testCity.push(obj)
          obj = {}
        })
      },


      opAgent(){
        if(this.dyni_txt == '停用'){
          this.disabelAgent({id:this.currentId}).then(msg => {
            if(msg){
              this.$Message.warning(msg)
            } else {
              this.$Message.success('停用成功')
              this.getAgencyList(1,{})
            }
          })
        } else {
          this.startAgent({id:this.currentId}).then(msg => {
            if(msg){
              this.$Message.warning(msg)
            } else {

              this.$Message.success('启用成功')
              this.getAgencyList(1,{})
            }
          })
        }
      },
      queryAgency(...args){
        this.arrClass.splice(0,1)
        if(args[0] == 'all'){
          this.queryOrder = {}
          this.getAgencyList(1,this.queryOrder)
          return
        }
        this.getAgencyList(1,this.queryOrder)
      },
      set_prefix(){
          if(this.set_Prefix){
            this.spinShow = true
            this.setPrefix({prefix:this.set_Prefix,type:0}).then((msg) => {
              this.spinShow = false
              if(msg){
                this.$Message.error(msg || '设置失败')
                return
              }
              this.$Message.success('设置成功')
              this.getEnterp_prefix()
            })
          } else {
            this.$Message.warning('请设置前缀')
            this.$nextTick(() => {
              this.setPreM = true
            })
          }
      },
      preAdd(){
        this.pre_addAgency().then((info) => {
          this.$set(this,'spinShow',false)

          if(info){
            this.$set(this.newAgentInfo,'account',info.account)
            var curLevelList = this.levelList_originally.slice(info.level)
            this.$set(this,'levelList',curLevelList)

            if(this.$store.getters.isPC){
              this.$set(this,'addModal',true)
            } else {
              this.head="新增代理商"
              this.showForm=true
            }
          }
        })
      },
      add() {
        if(this.user_type==1){
          this.preAdd()
          return
        }
        if(this.agency_prefix){
          if(this.typeList.length>0){
            this.$set(this,'spinShow',true)
            this.preAdd()
          } else {
            //去代理商类目
            this.$Message.warning('请先创建代理商类别')
            setTimeout(() => {
              this.$router.replace('/security/1-2/agentCatg')
            },2000)
          }
        } else {
          //弹出前缀框
          this.setPreM=true
        }
      },
      addAgentFun(){
        this.$set(this,'spinShow',true)
        this.add_agent(this.newAgentInfo).then((resp) => {
          this.agentAdd_form = false
          this.spinShow = false
          var msg = resp.data.error_msg

          if(msg || msg==undefined){
            this.$Message.warning(msg || "添加失败请重试")
            return
          }
          this.$set(this,'spinShow',false)
          this.showForm = false
          this.$Message.success('添加成功')
          this.$set(this,'newAgentInfo',{})
          this.newAgentInfo.location = 110000
          this.getAgencyList(this.pageTotal,{})
        })
      },

      addAgent(name){
        // this.newAgentInfo.location = parseInt(this.valCity[0])
        // this.newAgentInfo.city = parseInt(this.valCity[1])
        if(this.$store.getters.isPC){
          publicFunc.validateForm.apply(this,[name,this.addAgentFun,this.add])
        } else {
          if(Object.keys(this.newAgentInfo).length < 6){
            this.$Message.warning('所有项目都必填')
          } else {
            this.addAgentFun()
          }
        }
      },
      updateAgentM(obj){
        var newKeyArr = Object.keys(obj)
        for(var item of newKeyArr){
          if(item=='id' || item=='authorization' || item=='phone' || item=='category' || item=='level' || item=='location'){
            this.agentItemInfo[item]=obj[item]
          }
        }

        this.$set(this,'levelList',this.levelList_originally.slice(obj.level))

        if(this.$store.getters.isPC){
          this.$set(this,'updateModal',true)
        } else {
          this.agentEdit_form=true
          this.head = '编辑代理商'
        }
      },
      updateAgent(){
        this.updateAgency_(this.agentItemInfo).then((msg) => {
          if(msg){
            this.$Message.error(msg)
            return
          }
          this.$Message.success('修改成功')
          this.agentEdit_form = false
          this.getAgencyList(this.curPage,{})
        })
      },
      delAgentM(id,name){
        this.$set(this,'currentId',id)
        this.$set(this,'currentName',name)
        this.delModal = true
      },
      delAgent(){
        this.spinShow = true
        this.delAgency_({id:this.currentId}).then((msg) => {
          this.spinShow = false
          if(msg){
            this.$Message.error(msg)
            return
          }
          this.$Message.success('删除成功')
          this.getAgencyList(this.curPage,{})
        })
      },
      columns_mob(){
        this.$set(this.columns[0],'fixed','left')
        this.$set(this.columns[0],'width',100)
        this.$set(this.columns[1],'width',100)
        this.$set(this.columns[2],'width',100)
        this.$set(this.columns[3],'width',100)
        this.$set(this.columns[4],'width',100)
        this.$set(this.columns[5],'width',100)
        this.$set(this.columns[6],'width',60)
        this.$set(this.columns[7],'width',80)
        this.$set(this.columns[8],'width',180)
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
    beforeMount() {
      var obj ={}
      Object.keys(pca['86']).forEach(key => {
        obj.code = parseInt(key)
        obj.name = pca['86'][key]
        this.testPro.push(obj)
        obj = {}
      })
    },
    mounted() {
      this.$set(this,'spinShow',true)
      if(this.user_type==1){
        this.newAgentInfo.category=0
      }
       //获取代理商列表
      this.getAgencyList(1,{})
      if(this.user_type!=1){
        //获取代理商类目
        this.searchEnterpAgencyType()
        //获取代理商前缀
        this.getEnterp_prefix()
      }

      //移动端-表格
      if(!this.$store.getters.isPC){
        this.columns_mob()
      }
    }
  }
</script>

<style lang="less" scoped>
  .selects {
    margin-left: 125px;
  }

  .select {
    margin: -15px 0 0 15px;
  }
  .workOrder_searchBtn {
    float:right;
    margin-top:75px;
    margin-right:10px;
    padding:5px 40px 6px;
    font-size:13px
  }
  .modalForm label,
  .custom /deep/ .ivu-form-item-label {
    display: inline-block;
    width:95px;
    text-align: right;
    padding-right: 5px;
  }
  .optionBlock {
    width:13%;

    h3{
      margin:20px 0;font-weight:normal
    }
  }
</style>
