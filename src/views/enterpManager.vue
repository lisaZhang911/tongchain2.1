<template>
  <div id="">
    <Heading :c-name="'企业管理员'" :btn-add="true" @add="add()"/>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <!-- 添加 -->
    <Modal v-model="addModal" title="添加企业操作员" @on-ok="addEnterpManager('add_form')">
      <Form ref="add_form" :model="newManager" :rules="ruleValidate">
        <FormItem label="名称" prop="name">
          <Input v-model="newManager.name" class="form_input_wid300"/>
        </FormItem>
        <FormItem label="账号" prop="account">
          <Input v-model="newManager.account" class="form_input_wid300"/>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="newManager.password" class="form_input_wid300"/>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input v-model="newManager.phone" class="form_input_wid300"/>
        </FormItem>
      </Form>
      <div>
        <label>权限</label>
        <CheckboxGroup v-model="newManager.authority">
          <Checkbox v-for="item in authorityArr" :key="item.id" :label="item.id">{{item.name}}</Checkbox>
        </CheckboxGroup>
      </div>
    </Modal>
    <!-- 移动端-新增 -->
    <FormM v-model="showForm_add" :head="head" @goback="goback" @ok="addEnterpManager">
      <div class="mobForm_item">
        <span>名称</span><input type="text" v-model="newManager.name">
      </div>
      <div class="mobForm_item">
        <span>账号</span>  <input type="text" v-model="newManager.account">
      </div>
      <div class="mobForm_item">
        <span>密码</span>  <input type="text" v-model="newManager.password">
      </div>
      <div class="mobForm_item">
        <span>电话</span>  <input type="text" v-model="newManager.phone">
      </div>
      <div class="mobForm_item">
        <label style="display:block">权限</label>
        <CheckboxGroup v-model="newManager.authority">
          <Checkbox v-for="item in authorityArr" :key="item.id" :label="item.id">{{item.name}}</Checkbox>
        </CheckboxGroup>
      </div>
    </FormM>
    <!-- 编辑 -->
    <Modal v-model="updateModal" title="编辑企业管理员" @on-ok="updateManage">
      <div class="modalForm">
        <label>账号</label><input type="text" v-model="managerInfo.account">
      </div>
      <div class="modalForm">
        <label>名称</label><input type="text" v-model="managerInfo.name">
      </div>
      <div class="modalForm">
        <label>电话</label><input type="text" v-model="managerInfo.phone">
      </div>
      <hr style="margin-bottom:15px"/>
      <div class="modalForm">
        <label style="margin-bottom:5px">权限</label>
        <CheckboxGroup v-model="managerInfo.authority">
          <Checkbox v-for="item in authorityArr" :key="item.id" :label="item.id">{{item.name}}</Checkbox>
        </CheckboxGroup>
      </div>
    </Modal>
    <!-- 移动端-编辑 -->
    <FormM v-model="showForm_edit" :head="head" @goback="goback" @ok="updateManage">
      <div class="mobForm_item">
        <span>名称</span><input type="text" v-model="managerInfo.name">
      </div>
      <div class="mobForm_item">
        <span>账号</span>  <input type="text" v-model="managerInfo.account">
      </div>
      <div class="mobForm_item">
        <span>电话</span>  <input type="text" v-model="managerInfo.phone">
      </div>
      <div class="mobForm_item">
        <label style="display:block">权限</label>
        <CheckboxGroup v-model="managerInfo.authority">
          <Checkbox v-for="item in authorityArr" :key="item.id" :label="item.id">{{item.name}}</Checkbox>
        </CheckboxGroup>
      </div>
    </FormM>
    <!-- 删除 -->
    <Modal v-model="deletModal" title="删除企业管理员" @on-ok="delManager">
      <p>确定删除 <span class="delet_notice">{{currentName}}</span>？ </p>
    </Modal>
    <Table :row-class-name="rowClassName" :columns="columns" :data="adminList"></Table>
    <button v-show="!$store.getters.isPC" @click="mob_add" type="button" class="mob_addBtn" >新增</button>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import {year,month,date,hh,mm,ss,timeExchange} from '../utils/timeExchange.js'
import authority from '../utils/authority.js'
import publicFunc from '../utils/public.js'

export default {
  data(){
    return {
      spinShow:false,
      authorityArr:authority,
      emr_form: false,
      emr_form_add:false,
      showForm_add:false,
      showForm_edit:false,
      head:'',
      addModal:false,
      updateModal:false,
      deletModal:false,
      currentName:'',
      currentId:'',
      adminList:[],
      ruleValidate: {
        name:[
          {required:true, message:'必填', trigger:'blur'}
        ],
        account:[
          {required:true, message:'必填', trigger:'blur'}
        ],
        password:[
          {required:true, message:'必填', trigger:'blur'}
        ],
        phone:[
          {required:true, message:'必填', trigger:'blur'},
          {pattern:/^[1][3,4,5,7,8]\d{9}$/, message:'必须为11位手机号码,前后不要有空格',trigger:'blur'}
        ]
      },
      newManager:{
        authority:[]
      },
      managerInfo:{},
      columns:[
        {
          title:'名称',
          align: 'center',
          key:'name'
        },
        {
          title:'账号',
          align: 'center',
          key:'account'
        },{
          title:'电话',
          align: 'center',
          key:'phone'
        },{
          title:'是否有效',
          align: 'center',
          render:(h,param) => {
            if(param.row.valid){
              return h('span','有效')
            } else {
              return h('span','无效')
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
          title:'可用权限',
          align: 'center',
          render:(h,param) =>{
            var authoArr = param.row.authority
            var newAutoArr = authoArr.map((x) => {
              var y = this.exchangeAuthority_str(x)
               return h('span',`${y} / `)
            })
            return h('div',newAutoArr)
          }
        },{
          title:'操作',
          align: 'center',
          render:(h,param) => {
            return h('div',[
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
                    this.updateManagerM(param.row)
                  }
              }},'编辑'),
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
                    this.delManagerM(param.row.id,param.row.name)
                  }
              }},'删除')
            ])
          }
        }]
    }
  },
  watch:{
    getAllEnAdminResult:function(val){
      if(val){
        this.$set(this,'adminList',val)
      }
    }
  },
  computed:{
    ...mapGetters([
      'getAllEnAdminResult'
    ])
  },
  methods: {
    ...mapActions([
      'search_allEnterpAdmin',
      'addEnterpAdmin',
      'update_enterpAdmin',
      'delete_enterpAdmin'
    ]),
    goback(){
     this.showForm_add = this.showForm_edit = false
     this.newManager = {}
   },
    mob_add(){
      this.showForm_add=true
      this.head='新增企业普通管理'
    },
    exchangeAuthority_str(id){
      switch (id){
        case 0:
          return '收货操作';
        case 1:
          return '发货操作'
        case 2:
          return '绑码操作'
        case 3:
          return '换码操作'
        case 4:
          return '流通环节朔源'
        case 5:
          return '生产环节溯源'
        case 6:
          return '产品管理'
        case 7:
          return '生产批次管理'
        case 8:
          return '朔源信息事件类型管理'
        case 9:
          return '企业代理商管理'
        case 10:
          return '事件操作员管理'
        case 11:
          return '记录查询'
      }
    },
    add(){
      this.$set(this,'addModal',true)
    },
    addEnterpManager_func(){
      this.spinShow = true

      this.addEnterpAdmin(this.newManager).then((resp) => {
        this.spinShow = false

        if(!(resp.data) || resp.data.error_msg==undefined){
          this.$Message.error(resp.data.error_msg || '添加失败')
          return
        }
        this.$Message.success('添加成功')
        this.newManager={}
        this.emr_form_add=false
        this.search_allEnterpAdmin().then(() => {
          this.$set(this,'spinShow',false)
        })
      })
    },
    addEnterpManager(name){
      var adVice = this.$store.getters.isPC

      if(adVice){
        publicFunc.validateForm.apply(this,[name,this.addEnterpManager_func,this.add])
      } else {
        if(!this.newManager.name){
          this.$Message.warning('名称必填')
        }else if(!this.newManager.account){
          this.$Message.warning('账号必填')
        }else if(!this.newManager.password){
          this.$Message.warning('密码必填')
        }else if(!this.newManager.phone){
          this.$Message.warning('电话必填')
        } else {
          this.addEnterpManager_func()
        }
      }
    },
    updateManagerM(obj){
      this.$set(this.managerInfo,'name',obj.name)
      this.$set(this.managerInfo,'account',obj.account)
      this.$set(this.managerInfo,'phone',obj.phone)
      this.$set(this.managerInfo,'authority',obj.authority)

      if(this.$store.getters.isPC){
        this.$set(this,'updateModal',true)
      } else {
        this.showForm_edit=true
        this.head='编辑企业普通管理者'
      }
    },
    updateManage(){
      this.spinShow=true
      this.update_enterpAdmin(this.managerInfo).then((msg) => {
        this.spinShow=false
        if(msg){ this.$Message.error(msg); return }
        this.$Message.success('更新成功')
        this.emr_form=false
        this.search_allEnterpAdmin()
      })
    },
    delManagerM(id,name){
      this.$set(this,'deletModal',true)
      this.$set(this,'currentId',id)
      this.$set(this,'currentName',name)
    },
    delManager(){
       this.spinShow=true
       this.delete_enterpAdmin({id:this.currentId}).then((msg) => {
         this.spinShow=false
         if(msg){
           this.$Message(msg)
           return
         }
         this.$Message.success('删除成功')
         this.search_allEnterpAdmin()
       })
    },
    column_mob(){
      if(this.$store.getters.isPC){
        return
      }
      this.$set(this.columns[0],'fixed','left')
      this.$set(this.columns[0],'width',100)
      this.$set(this.columns[1],'width',120)
      this.$set(this.columns[2],'width',110)
      this.$set(this.columns[3],'width',90)
      this.$set(this.columns[4],'width',180)
      this.$set(this.columns[5],'width',200)
      this.$set(this.columns[6],'width',200)
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
   this.search_allEnterpAdmin().then(() => {
     this.$set(this,'spinShow',false)
   })
   //移动端-表格
  this.column_mob()
 }
}
</script>

<style  scoped>
</style>
