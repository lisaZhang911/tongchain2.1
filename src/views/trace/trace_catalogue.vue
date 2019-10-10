<template>
  <div id="">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'溯源事件'" :btn-add="true" @add="add()"/>
    <!-- 移动端-删除图片 -->
    <Modal v-model="delPic" :mask-closable="false" @on-ok="confirmDelPic">
      <p>确定删除图片？</p>
    </Modal>
    <!-- 添加/编辑 -->
    <Modal v-model="addModal" :mask-closable="false" title="新建/更新溯源事件" @on-ok="addTraceCatg('form_add')" @on-cancel="clearObj">
      <Form ref="form_add" :model="traceCatg" :rules="ruleValidate">
        <FormItem label="事件名称" prop="name">
          <Input v-model="traceCatg.name" style="width:200px" :disabled="flag=='edit'"></Input>
        </FormItem>
        <FormItem label="事件类型" prop="type">
          <Select v-model="traceCatg.type" style="width:200px" :disabled="flag=='edit'">
            <Option v-for="i in infoTypeList" :value="i.id" :key="i.id">{{i.label}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div class="modalForm">
        <label>描述</label>
        <textarea v-model="traceCatg.desc" rows="8" cols="70"></textarea>
      </div>
      <div class="demo-upload-list" v-for="item in tempPicArr">
        <img :src="item">
        <div class="demo-upload-list-cover">
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </div>
      <Upload
       style="width:100%"
       type="select"
       accept="image"
       v-show="tempPicArr.length<5"
       :max-size=2048
       :show-upload-list='false'
       :data="multipart_params"
       :before-upload="handleBeforeUpload"
       :on-success="handleSuccess"
       :on-error="handledError"
       :on-exceeded-size="handleMaxSize"
       :action="host">
        <Button icon="ios-cloud-upload-outline">上传图片</Button>
      </Upload>
      <p class="notice">尺寸小于5MB.最多5张</p>
    </Modal>
    <!-- 移动端-添加/编辑 -->
    <FormM v-model="showForm" :head="head" @goback="goback" @ok="addTraceCatg">
      <!-- <div class="mobForm_item">
        <span>描述</span><input type="text" class="textarea_input">
      </div> -->
      <div class="mobForm_item">
        <span>事件名</span><input type="text" v-model="traceCatg.name">
      </div>
      <div class="mobForm_item">
        <label>溯源类型</label>
        <Select v-model="traceCatg.type" style="width:200px">
          <Option v-for="i in infoTypeList" :value="i.id" :key="i.id">{{i.label}}</Option>
        </Select>
      </div>

      <div class="demo-upload-list" v-for="item in tempPicArr">
        <img :src="item">
        <div class="demo-upload-list-cover">
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </div>
      <Upload
       style="width:100%;margin-top:15px;padding-left:10px"
       type="select"
       accept="image"
       :max-size=2048
       v-show="tempPicArr.length<5"
       :show-upload-list='false'
       :data="multipart_params"
       :before-upload="handleBeforeUpload"
       :on-success="handleSuccess"
       :on-error="handledError"
       :on-exceeded-size="handleMaxSize"
       :action="host">
        <Button icon="ios-cloud-upload-outline">上传图片</Button>
      </Upload>
      <p class="notice">尺寸小于5MB,最多5张</p>
    </FormM>
    <!-- 删除 -->
    <Modal v-model="deletModal" :mask-closable="false" title="删除溯源类别" @on-ok="deletTraceCatg">
      <p>确定删除名为 <span style="font-weight:bold;font-size:14px">{{event_name}}</span> 的溯源事件吗？</p>
    </Modal>
    <Table :row-class-name="rowClassName" :columns="columns" :data="traceCatlogList"></Table>
    <button v-show="!$store.getters.isPC" @click="mob_add" type="button" class="mob_addBtn" >新增</button>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import {circulTypeList} from '../../utils/formType.js'
import publicFunc from '../../utils/public.js'

export default {
  data(){
    return {
      old_op:false,
      delPic:false,
      event_name:'',
      picName:'',
      spinShow:false,
      currentId:0,
      tempPicArr:[],
      trashPicArr:[],
      flag:'',
      showForm:false,
      flagMove:'',
      traceCag_form:false,
      traceCag_edit_form:false,
      head:'',
      addModal:false,
      updateModal:false,
      deletModal:false,
      infoType:-1,
      productId:-1,
      host:'',
      key:'',
      ruleValidate:{
        type:[{required:true, type:'number', message:'必填', trigger:'change'},],
        name:[{required:true, type:'string', message:'必填', trigger:'change'}]
      },
      multipart_params:{},
      up_picArr:[],
      traceCatg:{pic:[]},
      traceCatlogList:[],
      productList:[],
      infoTypeList:circulTypeList,
      columns:[
        {
          title:'事件名称',
          align: 'center',
          key:'name'
        },{
           title: '图片',
           align: 'center',
           render: (h, params) => {
             var picArr = params.row.pic[0]
             var host = this.host || 'http://315chain.oss-cn-shanghai.aliyuncs.com'
             return h('img',{attrs:{src:`${host}/${picArr}`,style:"width:204px;height:136px"}})
           }
         },{
          title:'事件类型',
          align: 'center',
          render:(h,param) => {
            return h('span',publicFunc.change_circulType(param.row.type))
          }
        },{
          title:'描述',
          align: 'center',
          key:'desc'
        },{
          title: '操作',
          width:200,
          align: 'center',
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
                      this.updateTraceCatgM(params.row)
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
                      this.flag = 'delete'
                      this.delTraceCatgM(params.row.id)
                      this.event_name = params.row.name
                      this.traceCatg = params.row
                    }
                  }
                }, '删除')
              ])
          }
        }],
    }
  },
  watch:{
    queryTraceCatg_re:function(val){
      if(val){
        this.$set(this,'traceCatlogList',val)
      }
    }
  },
  computed:{
    ...mapGetters([
      'queryTraceCatg_re',
    ]),
  },
  methods: {
    ...mapActions([
      'queryTraceCatg_',
      'updateTraceCatg_',
      'delTraceCatg_',
      'addTraceCatg_',
      'getUploadPic'
    ]),
    goback(){
      this.clearObj()
      this.showForm=false
    },
    add(){
      this.traceCatg = {}
      this.traceCatg.pic = []
      this.$set(this,'addModal',true)
      this.flag='add'
    },
    mob_add(){
      this.showForm=true
      this.head='新增溯源事件'
      this.flag='add'
    },
    clearObj(){
      this.traceCatg = {}
      this.traceCatg.pic = []
      this.tempPicArr = []
      this.trashPicArr = []
    },
    addTraceCatg_func(){
      this.spinShow=true

      this.addTraceCatg_(this.traceCatg).then((msg) => {
        this.spinShow=false
        if(msg){
          this.$Message.error(msg)
          return
        }
        this.$Message.success('添加成功')
        this.clearObj()
        this.showForm=false
        this.queryTraceCatg_()
      })
      this.queryTraceCatg_()
    },
    addTraceCatg(name){
      if(this.traceCatg.pic.length<1){
        this.$Message.warning('请上传图片')

        if(this.$store.getters.isPC){
          this.$nextTick(() => {
            this.add()
          })
        }
        return
      }

      if(this.$store.getters.isPC){
        if(this.flag=='add'){
          publicFunc.validateForm.apply(this,[name,this.addTraceCatg_func,this.add])
        } else {
          publicFunc.validateForm.apply(this,[name,this.updateTraceCatg])
        }
      } else {
        if(!this.traceCatg.type){
          this.$Message.warning('请选择事件类型')
          return
        }
        if(this.flag=="add"){
          this.addTraceCatg_func()
        } else {
          this.updateTraceCatg()
        }
      }
    },
    updateTraceCatgM(obj){
      this.flag='edit'

      for(var i of Object.keys(obj)){
        if(i!='_rowKey' && i!='_index'){
          this.$set(this.traceCatg,i,obj[i])
        }
      }
      obj.pic.forEach((item,index) => {
        this.tempPicArr.push(`${this.host}/${item}`)
      })

      if(this.$store.getters.isPC){
        this.$set(this,'addModal',true)
      } else {
        this.showForm = true
        this.head = '编辑溯源类别'
      }
    },
    updateTraceCatg(){
      if(this.traceCatg.pic.length<1){
        this.$Message.warning('请上传图片')
        return
      }

      this.spinShow = true
      this.updateTraceCatg_(this.traceCatg).then((msg) => {
        this.spinShow = false
        if(msg){
          this.$Message.error(msg)
          return
        }
        this.$Message.success('修改成功')
        this.clearObj()
        this.showForm=false
        this.queryTraceCatg_()
      })
      this.queryTraceCatg_()
    },
    delTraceCatgM(id){
      this.$set(this,'deletModal',true)
      this.$set(this,'currentId',id)
    },
    deletTraceCatg(){
      this.delTraceCatg_({id:this.currentId}).then((msg) => {
        if(msg || msg==undefined){
          this.$Message.error(msg || '删除失败请再试')
          return
        }
        this.$Message.success('删除成功')
        this.clearObj()
        this.queryTraceCatg_()
      })
      this.queryTraceCatg_()
    },
    handleRemove(file){
      this.file = file
      if(!this.$store.getters.isPC){
        if(!this.delPic){
          this.delPic = true
          this.addModal = false
          return
        }
      }
      this.confirmDelPic()
    },
    confirmDelPic(){
      this.flagMove = 'move'
      this.trashPicArr.push(this.file.key)
      this.tempPicArr.splice(this.file.index,1)
      this.traceCatg.pic.splice(this.file.index,1)
      if(this.$store.isPC){
        this.addModal=true
      }
    },
    handleBeforeUpload(file){
      var fileNameStr = ''
      var newPicNameStr = ''

      if(this.tempPicArr.length > 4){
        this.$Message.warning('最多5张图片')
        return
      }
      if(this.trashPicArr.length>0){
          var key = this.trashPicArr.pop()
          this.multipart_params.key = key
      } else {
          newPicNameStr = publicFunc.random_string(10)+publicFunc.get_suffix(file.name)
          this.multipart_params.key=`${this.key}${newPicNameStr}`
        }
    },
    handleSuccess(resp,file,fileL){
      this.tempPicArr.push(`${this.host}/${this.multipart_params.key}?time=${Date.parse(new Date())}`)
      this.traceCatg.pic.push(`${this.multipart_params.key}`)
    },
    handledError(error,file,fileL){
      this.$Message.error(error)
    },
    handleMaxSize (file) {
      this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: file.name + ' 文件太大，不能超过2M'
      });
    },
    columns_mob(){
      this.$set(this.columns[0],'fixed','left')
      this.$set(this.columns[0],'width',100)
      this.$set(this.columns[1],'width',200)
      this.$set(this.columns[2],'width',100)
      this.$set(this.columns[3],'width',200)
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
    var htp = window.location.href.split('//')[0]

    //获取溯源事件列表
    this.queryTraceCatg_()
    //移动端-表格
    if(!this.$store.getters.isPC){
      this.columns_mob()
    }
    // 获取图片上传签名
    this.getUploadPic({}).then(resp => {
      this.host=`${htp}//${resp.data.host.split('//')[1]}`
      this.key=resp.data.dir
      this.multipart_params.policy=resp.data.policy
      this.multipart_params.OSSAccessKeyId=resp.data.accessid
      this.multipart_params.success_action_status=200
      this.multipart_params.signature=resp.data.signature
    })
  }
}
</script>

<style scoped>
.textarea_input{
  display: block;
  height: 50px;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
}
.thumb{
  width: 30%;
  margin-left:15px;
  margin-top:15px
}
.notice{
  margin-bottom: 10px;
  padding-left: 10px
}
</style>
