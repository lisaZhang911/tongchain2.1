<template>
  <div @click="hideNav">
    <Heading :c-name="pathName" :btn-add="true" @add="add()"/>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <!-- 移动端-删除图片 -->
    <Modal v-model="delPic" title="删除图片" @on-ok="confirmDelPic" :mask-closable="false">
      <p>确定删除图片？</p>
    </Modal>
    <!-- 添加/编辑 -->
    <Modal v-model="addModal" :mask-closable="false" title="新建/更新溯源信息"  @on-ok="addTraceInfo('form_add')" @on-cancel="clearObj">
      <Form ref="form_add" :model="traceInfoItem" :rules="ruleValidate">
        <FormItem label="溯源名" prop="additional_name">
          <Input v-model="traceInfoItem.additional_name" style="width:55%" :disabled="flag=='edit'"></Input>
        </FormItem>
        <FormItem label="商品" prop="product_id_filter">
          <AutoComplete
           style="width:60%"
           v-model="product_id_filter"
           :disabled="flag=='edit'"
           :data="prod_auto"
           @on-change="getProdId"
           :filter-method="filter_agent"
           placeholder="输入产品名">
          </AutoComplete>
          <!-- <Select v-model="traceInfoItem.product_id" style="width:200px" :disabled="flag=='edit'">
            <Option v-for="i in productList" :value="i.id" :key="i.id">{{i.name}}</Option>
          </Select> -->
        </FormItem>
      </Form>
      <div class="modalForm">
        <label>描述</label>
        <textarea style="display:block" :disabled="flag=='edit'" v-model="traceInfoItem.desc" rows="8" cols="48"></textarea>
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
       :max-size=5120
       :show-upload-list='false'
       v-show="tempPicArr.length<5"
       :data="multipart_params"
       :before-upload="handleBeforeUpload"
       :on-success="handleSuccess"
       :on-error="handledError"
       :on-exceeded-size="handleMaxSize"
       :action="host">
        <Button icon="ios-cloud-upload-outline">上传图片</Button>
      </Upload>
      <p class="notice">尺寸小于5MB.最多5张图片</p>
    </Modal>
    <!-- 移动端-添加/编辑 -->
    <FormM v-model="showForm" :head="head" @goback="goback" @ok="addTraceInfo">
      <div class="mobForm_item">
        <span>信息名</span><input type="text" v-model="traceInfoItem.additional_name" :disabled="flag=='edit'">
      </div>
      <div class="mobForm_item">
        <label>商品</label>
        <AutoComplete
         style="width:70%"
         v-model="product_id_filter"
         :disabled="flag=='edit'"
         :data="prod_auto"
         @on-change="getProdId"
         :filter-method="filter_agent"
         placeholder="输入产品名">
        </AutoComplete>
        <!-- <select class="originalSelect" style="width:200px" v-model="traceInfoItem.product_id">
            <option v-for="i in productList" :value="i.id">{{i.name}}</option>
        </select> -->
      </div>
      <!-- <div class="mobForm_item">
        <span>描述</span>
        <textarea style="display:block" :disabled="flag=='edit'" v-model="traceInfoItem.desc"></textarea>
      </div> -->
      <div class="demo-upload-list" v-for="item in tempPicArr">
        <img :src="item">
        <div class="demo-upload-list-cover">
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </div>
      <Upload
       class="uploadBtn"
       style="width:100%"
       type="select"
       accept="image"
       :show-upload-list='false'
       v-show="tempPicArr.length<5"
       :max-size=2048
       :data="multipart_params"
       :before-upload="handleBeforeUpload"
       :on-success="handleSuccess"
       :on-error="handledError"
       :on-exceeded-size="handleMaxSize"
       :action="host">
        <Button icon="ios-cloud-upload-outline">上传图片</Button>
      </Upload>
      <p class="notice">尺寸小于5MB.最多5张图片</p>
    </FormM>
    <!-- 删除 -->
    <Modal v-model="deletModal" :mask-closable="false" title="删除溯源信息" @on-ok="deletTraceInfo">
      <p>确定删除名为<span style="font-weight:bold;font-size:14px">{{additional_name}}</span>的溯源信息吗？</p>
    </Modal>
    <!-- 查询条件 -->
    <div style="margin:20px 0 10px 0" v-show="$store.getters.isPC">
      <AutoComplete
       style="width:20%"
       v-model="product_id_filter"
       :disabled="flag=='edit'"
       :data="prod_auto"
       @on-change="getProdId"
       :filter-method="filter_agent"
       placeholder="输入产品名">
      </AutoComplete>
      </AutoComplete>
      <!-- <Select v-model="product_id" placeholder="所属产品" style="width:200px">
        <Option v-for="i in productList" :value="i.id" :key="i.id">{{i.name}}</Option>
      </Select> -->
      <Button type="primary" @click="query_TraceInfo">搜索</Button>
      <Button type="primary" @click="query_TraceInfo('all')">搜索全部</Button>
    </div>
    <!-- 移动端条件搜索 -->
    <div class="mob_searchParam" v-show="!$store.getters.isPC">
      <div class="filterBox" ref="filterBox" v-show="!$store.getters.isPC" :class="arrClass">
        <div class="itemBox">
          <h5>所属产品</h5>
          <AutoComplete
           v-model="product_id_filter"
           :disabled="flag=='edit'"
           :data="prod_auto"
           @on-change="getProdId"
           :filter-method="filter_agent"
           placeholder="输入产品名">
          </AutoComplete>
          <!-- <select class="originalSelect" :class="{mob_mt:!$store.getters.isPC}" style="width:200px" v-model="product_id">
              <option v-for="i in productList" :value="i.id">{{i.name}}</option>
          </select> -->
        </div>
        <div class="buttonWrap">
          <Button class="reset" @click.stop="reset_queryParam">重置</Button>
          <Button type="primary" @click.stop="query_TraceInfo">搜索</Button>
        </div>
      </div>
      <Icon class="setting"  @click.stop="handdleNav" type="ios-settings" />
    </div>
    <Table :row-class-name="rowClassName" :columns="columns" :data="traceInfoList"></Table>
    <Page class="page" :total="pageTotal" @on-change="changePage" />
    <button v-show="!$store.getters.isPC" @click="mob_add" type="button" class="mob_addBtn" >新增</button>
  </div>
</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import { infoTypeList } from '../../utils/formType.js'
import publicFunc from '../../utils/public.js'

export default {
  data(){
    return {
      path:0,
      desc_m:'',
      arrClass:[],
      prod_auto:[],
      additional_name:'',
      showForm:false,
      delPic:false,
      file:{},
      flag:'',
      product_id_filter:'',
      flagMove:'',
      picName:'',
      pageTotal:0,
      spinShow:false,
      currentId:0,
      tempPicArr:[],
      trashPicArr:[],
      traceInfo_form:false,
      traceInfo_edit_form:false,
      head:'',
      addModal:false,
      updateModal:false,
      deletModal:false,
      infoType:'',
      product_id:'',
      host:'',
      key:'',
      ruleValidate:{
        additional_name:[
          {required:true,message:'溯源信息名必填'}
        ]
      },
      multipart_params:{},
      traceInfoItem:{pic:[]},
      traceInfoList:[],
      productList:[],
      infoTypeList:infoTypeList,
      columns:[
        {
          title:'溯源名',
          align: 'center',
          key:'additional_name'
        },{
           title: '图片',
           align: 'center',
           render: (h, params) => {
             if(params.row.pic!=null){
               var picArr = params.row.pic[0]
               var host = this.host || 'http://315chain.oss-cn-shanghai.aliyuncs.com'
               if(picArr){
                 return h('img',{attrs:{src:`${host}/${picArr}`,style:"width:204px;height:136px"}})
               }
             }
           }
         },{
          title:'所属产品',
          align: 'center',
          render: (h,param) => {
            if(param.row.product_id<0){
              return
            }
            for(var i of this.productList){
              if(i.id == param.row.product_id){
                return h('span',i.name)
              }
            }
          }
        },{
          title:'描述',
          align: 'center',
          render:(h,param) => {
            return h('p',{domProps: {innerHTML: param.row.desc}})
          }
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
                      this.tempPicArr = []
                      this.updateTraceInfoM(params.row)
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
                      this.delTraceInfoM(params.row.id)
                      this.additional_name = params.row.additional_name
                      this.traceInfoItem = params.row
                    }
                  }
                }, '删除')
              ])
          }
        }
      ]
    }
  },
  watch:{
    desc_m:function(val){
      this.traceInfoItem.desc = val
    },
    searchProResult:function(val){
      if(val){
        this.$set(this,'productList',val)
        this.prod_auto = val.map(i => i.name)
      }
    },
    searchTraceResult:function(val){
      if(val){
        this.$set(this,'traceInfoList',val)
      }
    }
  },
  computed:{
    ...mapGetters([
      'searchProResult',
      'searchTraceResult'
    ]),
    pathName(){
      return this.path==1?'原材料溯源':this.path==2?'质检报告溯源':'生产环境信息溯源'
    }
  },
  methods: {
    ...mapActions([
      'searchTrace',
      'searchPro',
      'mody_traceInfo',
      'del_traceInfo',
      'add_tracePro',
      'getUploadPic',
      'add_tracePro1',
      'add_tracePro2',
      'add_tracePro3'
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
      this.infoType = ''
      this.product_id = ''
    },
    clearObj(){
      this.traceInfoItem = {}
      this.traceInfoItem.pic = []
      this.tempPicArr = []
      this.trashPicArr = []
      this.product_id_filter = ''
    },
    getProdId(val){
      var r = this.productList.find(i => i.name == val)
      if(r){
        this.traceInfoItem.product_id = r.id
      }
    },
    filter_agent(val,option){
      return option.indexOf(val) !== -1
    },
    getTraceInfoList(num,obj){
      var pageObj = {per_page_num:10,page_idx:num}
      var paramObj = Object.assign(pageObj,obj)

      this.searchTrace(paramObj).then((resp) => {
        this.pageTotal = resp.data.page_num*10
        this.$set(this,'spinShow',false)
      })
    },
    changePage(p){
      this.getTraceInfoList(p,{info_type:parseInt(this.path)})
    },
    goback(){
      this.showForm = false
      this.clearObj()
    },
    mob_add(){
      this.showForm = true
      this.head='新增溯源信息'
      this.flag='add'
    },
    query_TraceInfo(...args){
      this.arrClass.splice(0,1)
      this.$set(this,'spinShow',true)
      var newObj = {}

      newObj.info_type=parseInt(this.path)
      if(args[0] == 'all'){
        this.getTraceInfoList(1,newObj)
        this.product_id_filter = ''
        return
      }
      if(this.traceInfoItem.product_id){
        newObj.product_id=this.traceInfoItem.product_id
      }
      this.getTraceInfoList(1,newObj)
    },
    add(){
      this.$set(this,'addModal',true)
      this.clearObj()
      this.flag='add'
    },
    addTraceInfo_func(){
      this.$set(this,'spinShow',true)
      this.traceInfoItem.info_type = parseInt(this.path)

      this.add_tracePro(this.traceInfoItem).then((msg) => {
        this.$set(this,'spinShow',false)
        this.traceInfo_form = false

        if(msg || msg==undefined){
          this.$Message.error(msg || '添加失败请再试')
          return
        }
        this.getTraceInfoList(1,{info_type:parseInt(this.path)})
        this.$Message.success('添加成功')
        this.showForm = false
      })

    },
    addTraceInfo(name){
      var adVice = this.$store.getters.isPC

      if(this.traceInfoItem.pic.length <1){
        this.$Message.warning('请上传图片')

        if(adVice){
          this.$nextTick(() => {
            this.add()
          })
        }
        return
      }

      if(adVice){
        if(this.flag=='add'){
          publicFunc.validateForm.apply(this,[name,this.addTraceInfo_func,this.add])
        } else {
          publicFunc.validateForm.apply(this,[name,this.updateTraceInfo])
        }
      } else {
        if(!this.traceInfoItem.product_id){
          this.$Message.warning('请选择商品')
        } else {
          if(this.flag=='add'){
            this.addTraceInfo_func()
          } else {
            this.updateTraceInfo()
          }
        }
      }
    },
    updateTraceInfoM(obj){
      this.flag='edit'
      for(var i of Object.keys(obj)){
        if(i!='enterprise_id' && i!='_rowKey' && i!='_index'){
          this.$set(this.traceInfoItem,i,obj[i])
        }
      }
      if(obj.pic!=null){
        obj.pic.forEach((item,index) => {
          this.tempPicArr.push(`${this.host}/${item}`)
        })
      }
      if(this.$store.getters.isPC){
        this.$set(this,'addModal',true)
      } else {
        this.head = '编辑溯源信息'
        this.showForm = true
      }
    },
    updateTraceInfo(){
      if(this.traceInfoItem.pic.length<1){
        this.$Message('请上传图片')
        return
      }

      this.spinShow = true
      this.flagMove = ''

      this.mody_traceInfo(this.traceInfoItem).then((msg) => {
        this.spinShow = false
        this.traceInfo_edit_form = false
        if(msg){
          this.$Message.error(msg)
          return
        }

        this.getTraceInfoList(1,{info_type:parseInt(this.path)})
        this.$Message.success('修改成功')
        this.showForm=false
      })
    },
    delTraceInfoM(id){
      this.$set(this,'deletModal',true)
      this.$set(this,'currentId',id)
    },
    deletTraceInfo(){
      this.spinShow = true

      this.del_traceInfo({id:this.currentId}).then(msg => {
        this.spinShow = false

        if(msg || msg==undefined){
          this.$Message.warning(msg || '删除失败请再试')
          return
        }
        this.$Message.success('删除成功')
        this.getTraceInfoList(1,{info_type:parseInt(this.path)})
      })
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
      console.log('url',this.file.url);
      this.trashPicArr.push(this.file.key)
      this.tempPicArr.splice(this.file.index,1)
      this.traceInfoItem.pic.splice(this.file.index,1)
      // this.newPicName.splice(this.file.index,1)
      if(this.$store.getters.isPC){
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
          // this.newPicName = []
          this.multipart_params.key = key
          // this.newPicName.push(key.split('/')[1])
      } else {
          newPicNameStr = publicFunc.random_string(10)+publicFunc.get_suffix(file.name)
          this.multipart_params.key=`${this.key}${newPicNameStr}`
          // this.newPicName.push(newPicNameStr)
        }
    },
    handleSuccess(resp,file,fileL){
      // this.flagMove = ''
      // if(this.flag=='edit'){
      //     var item = this.newPicName[this.newPicName.length-1]
      //     file.url = `${this.host}/${this.key}${item}?time=${Date.parse(new Date())}`
      //     file.index = this.tempPicArr.length
      //     file.key = `${this.key}${item}`
      //     console.log('editSuc1',file);
      //     this.tempPicArr.push(file)
      //     this.traceInfoItem.pic.push(file.url)
      //   return
      // }
      // console.log(file);
      this.tempPicArr.push(`${this.host}/${this.multipart_params.key}?time=${Date.parse(new Date())}`)
      this.traceInfoItem.pic.push(`${this.multipart_params.key}`)
    },
    handledError(error,file,fileL){
      this.$Message.error(error)
    },
    handleMaxSize (file) {
      this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: file.name + '文件过大，不能超过2M'
      });
    },
    rowClassName(row, index) {
      if(index % 2 === 0) {
        return 'row-odd';
      } else if(index % 2 === 1) {
        return 'row-even';
      }
      return '';
    },
    columns_mob(){
      if(this.$store.getters.isPC){
        return
      }
      this.$set(this.columns[0],'fixed','left')
      this.$set(this.columns[0],'width',100)
      this.$set(this.columns[1],'width',180)
      this.$set(this.columns[2],'width',90)
      this.$set(this.columns[3],'width',180)
      this.$set(this.columns[4],'width',170)
    }
  },
  beforeRouteUpdate (to,from,next ){
    this.path = to.params.path
    //获取溯源信息列表
    this.getTraceInfoList(1,{info_type:parseInt(this.path)})
    this.product_id = ''
    next()
  },
  mounted() {
    var htp = window.location.href.split('//')[0]
    this.path = this.$router.currentRoute.params.path
    this.$set(this,'spinShow',true)
    //获取溯源信息列表
    this.getTraceInfoList(1,{info_type:parseInt(this.path)})
    //获取产品列表
    this.searchPro({per_page_num: 999999,page_idx: 1})

    //移动端-表格列
    this.columns_mob()

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
.mob_mt {
  margin-top: 10px;
  margin-right: 5px;
}
.thumb{
  width: 30%;
  margin-left:15px
}
.notice{
  padding: 0 10px;
  margin-bottom: 10px;
}
</style>
