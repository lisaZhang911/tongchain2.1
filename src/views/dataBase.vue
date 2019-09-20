<template>
  <div id="">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'数据库配置'" :btn-add="true" @add="add()" />
    <!-- 新增数据库弹框 -->
    <Modal v-model="addModal" title="添加数据库配置" @on-ok="addDataBaseConfig('add_form')">
      <Form ref="add_form" :model="formTem" :rules="ruleValidate">
        <FormItem label="名称" prop="name">
          <Input v-model="formTem.name" class="form_input_wid300"/>
        </FormItem>
        <FormItem label="端口" prop="db_port">
          <Input v-model="formTem.db_port" class="form_input_wid300"/>
        </FormItem>
        <FormItem label="用户数限制" prop="use_limit">
          <Input v-model="formTem.use_limit" class="form_input_wid300"/>
        </FormItem>
        <FormItem label="数据库名称" prop="db_name">
          <Input v-model="formTem.db_name" class="form_input_wid300"/>
        </FormItem>
        <FormItem label="数据库账号" prop="db_user">
          <Input v-model="formTem.db_user" class="form_input_wid300"/>
        </FormItem>
        <FormItem label="数据库密码" prop="db_pwd">
          <Input v-model="formTem.db_pwd" class="form_input_wid300"/>
        </FormItem>
        <FormItem label="数据库域名" prop="db_addr">
          <Input v-model="formTem.db_addr" class="form_input_wid300"/>
        </FormItem>
        <FormItem label="描述" prop="db_desc">
          <Input v-model="formTem.db_desc" class="form_input_wid300"/>
        </FormItem>
      </Form>
    </Modal>
    <!-- 编辑数据库弹框 -->
    <Modal v-model="updateModal" title="修改数据库配置" @on-ok="updateDataBaseConfig">
        <div class="modalForm">
          <label>名称</label><input type="text" v-model="formTem.name">
          <label>端口</label><input type="text" v-model="formTem.db_port">
        </div>
        <div class="modalForm">
          <label>数据库域名</label><input type="text" v-model="formTem.db_addr">
          <label>数据库名称</label><input type="text" v-model="formTem.db_name">
        </div>
        <div class="modalForm">
          <label>数据库账号</label><input type="text" v-model="formTem.db_user">
          <label>限制</label><input type="text" v-model="formTem.use_limit">
        </div>
        <div class="modalForm">
          <label>描述</label><textarea rows="8" cols="70" v-model="formTem.db_desc"></textarea>
        </div>
    </Modal>
    <!-- 删除数据库弹框 -->
    <Modal v-model="delModal" title="删除数据库配置" @on-ok="delDataBaseConfig">
        <p>确认删除名称为<span style="font-weight:bold;font-size:15px">{{currentName}}</span>的数据配置吗？</p>
    </Modal>
    <!-- 移动端-新增/编辑 -->
    <div class="mobForm" v-show="!$store.getters.isPC && db_form">
      <div class="mobForm_title">
        <a @click="goback('db_form')" class="backIcon" style="position:absolute"><Icon type="ios-arrow-back" /></a>
        <h2 class="title">{{head}}</h2>
        <button type="button" @click="addDataBaseConfig">保存</button>
      </div>
      <div class="mobForm_item">
        <span>名称</span><input type="text" v-model="formTem.name">
      </div>
      <div class="mobForm_item">
        <span>端口</span><input type="text" v-model.number="formTem.db_port">
      </div>
      <div class="mobForm_item">
        <span>用户数限制</span><input type="text" v-model.number="formTem.use_limit">
      </div>
      <div class="mobForm_item">
        <span>数据库名称</span><input type="text" v-model="formTem.db_name">
      </div>
      <div class="mobForm_item">
        <span>数据库账号</span><input type="text" v-model="formTem.db_user">
      </div>
      <div class="mobForm_item">
        <span>数据库密码</span><input type="text" v-model="formTem.db_pwd">
      </div>
      <div class="mobForm_item">
        <span>数据库域名</span><input type="text" v-model="formTem.db_addr">
      </div>
      <div class="mobForm_item">
        <span style="display:block">描述</span><textarea name="name" rows="5" v-model="formTem.db_desc"></textarea>
      </div>
    </div>
    <Table @on-row-click="rowData" :row-class-name="rowClassName" :columns="columns" :data="dataBaseList"></Table>
    <button v-show="!$store.getters.isPC" @click="mob_add" type="button" class="mob_addBtn" >新增</button>
  </div>
</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import pathPublic from '../utils/public.js'

export default {
  computed:{
    ...mapGetters([
      'dataBaseList_store'
    ])
  },
  watch:{
    dataBaseList_store:function(val){
      this.$set(this,'dataBaseList',val)
    }
  },
  data(){
    return {
      spinShow:false,
      head:'数据库编辑',
      db_form:false,
      edit:false,
      ruleValidate:{
        name:[
          {required:true, message:'必填', trigger:'blur'}
        ],
        db_port:[
          {required:true, message:'必填', trigger:'blur'}
        ],
        use_limit:[
          {required:true, message:'必填', trigger:'blur'}
        ],
        db_name:[
          {required:true, message:'必填', trigger:'blur'}
        ],
        db_user:[
          {required:true, message:'必填', trigger:'blur'}
        ],
        db_pwd:[
          {required:true, message:'必填', trigger:'blur'}
        ],
        db_addr:[
          {required:true, message:'必填', trigger:'blur'}
        ],
        db_desc:[
          {required:true, message:'必填', trigger:'blur'}
        ]
      },
      columns:[{
          title: 'name',
          key: 'name',
          align: 'center'
        },
        {
          title: '数据库地址',
          key: 'db_addr',
          align: 'center'
        },
        {
          title: '数据库端口',
          key: 'db_port',
          align: 'center'
        },
        {
          title: '数据库名称',
          key: 'db_name',
          align: 'center'
        },
        {
          title: '数据库用户',
          key: 'db_user',
          align: 'center'
        },
        {
          title: '数据库描述',
          key: 'db_desc',
          align: 'center'
        },
        {
          title: '上限',
          key: 'use_limit',
          align: 'center'
        },
        {
          title: '已被使用次数',
          key: 'use_num',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          width:200,
          render: (h, params) => {
            return h('div', [
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
                    this.modifyDataBase(params)
                    if(!this.$store.getters.isPC){
                      this.db_form=true
                      this.head='编辑数据库'
                      return
                    }
                    this.$set(this,'updateModal',true)
                  }
                }
              }, '编辑'),
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
                    this.$set(this,'delModal',true);
                    this.$set(this,'currentName',params.row.name);
                  }
                }
              }, '删除')
            ])
          }
        }],
      addModal: false,
      updateModal: false,
      delModal: false,
      dataBaseList:[],
      currentName: '',
      currentIndex: {
        id: -1
      },
      formTem:{}
    }
  },
  methods: {
    ...mapActions([
      'getDataBaseConfig',
      'add_formTem',
      'updateNewData',
      'delDataBase'
    ]),
    goback(str){
      this.$set(this,str,false)
      this.formTem = {}
    },
    rowData(row,index){
      this.$set(this.currentIndex,'id',index)
    },
    add(){
      this.$set(this,'addModal',true)
    },
    mob_add(){
      this.db_form=true
      this.head='新增数据库'
    },
    updateDataBaseConfig(){
      this.$set(this,'spinShow',true)

      this.updateNewData(this.formTem).then((resp) => {
        this.$set(this,'spinShow',false)
        if(resp.data.error_msg || resp.data.error_msg==undefined){
          this.$Message.error('更新失败')
          return
        }
        this.$Message.success('更新成功');
        this.db_form = false
        this.getDataBaseConfig()
      }).catch(() => {
        this.$set(this,'spinShow',false)
        this.db_form = false
        this.$Message.error('更新失败')
      })
    },
    addDataBaseConfig_func(){
      this.spinShow = true
      this.db_form = false;

      this.add_formTem(this.formTem).then((msg) => {
        this.spinShow = false
        if(msg || msg==undefined){
          this.$Message.warning(msg || '新建失败请再试')
          return
        }
        this.$Message.success('添加成功');
        this.formTem = {}
        this.db_form = false
        this.getDataBaseConfig()
      })
    },
    addDataBaseConfig(name){
      var adVice = this.$store.getters.isPC

      if(adVice){
        pathPublic.validateForm.apply(this,[name,this.addDataBaseConfig_func,this.add])
      } else {
        if(Object.keys(this.formTem).length < 8){
          this.$Message.warning('每一项都必填')
          return
        }
        this.addDataBaseConfig_func()
      }
    },
    delDataBaseConfig(){
      this.delDataBase(this.currentIndex).then(() => {
        this.$Message.success('删除成功')
        this.getDataBaseConfig()
      }).catch(() => {
        this.$Message.error('删除失败')
      })
    },
    modifyDataBase(par){
      var row = par.row;
      this.$set(this.formTem,'db_id',row.db_id)
      this.$set(this.formTem,'name',row.name)
      this.$set(this.formTem,'db_addr',row.db_addr)
      this.$set(this.formTem,'db_port',row.db_port)
      this.$set(this.formTem,'db_name',row.db_name)
      this.$set(this.formTem,'db_user',row.db_user)
      this.$set(this.formTem,'db_desc',row.db_desc)
      this.$set(this.formTem,'use_limit',row.use_limit)
      this.$set(this.formTem,'use_num',row.use_num)
    },
    column_mob(){
      this.$set(this.columns[0],'fixed','left')
      this.$set(this.columns[0],'width',100)
      this.$set(this.columns[1],'width',100)
      this.$set(this.columns[2],'width',80)
      this.$set(this.columns[3],'width',100)
      this.$set(this.columns[4],'width',80)
      this.$set(this.columns[5],'width',80)
      this.$set(this.columns[6],'width',80)
      this.$set(this.columns[7],'width',80)
      this.$set(this.columns[8],'width',170)
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
    this.spinShow=true

    this.getDataBaseConfig().then((msg) => {
      this.spinShow=false
      if(msg || msg==undefined){
        this.$Message.error(msg || '查询失败')
        return
      }
    })
    // 移动端-增加column属性
    if(!this.$store.getters.isPC){
      this.column_mob()
    }
  }
}
</script>

<style scoped>

</style>
