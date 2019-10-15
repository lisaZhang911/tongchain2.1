<template>
  <div @click="hideNav($event)">
    <Heading :c-name="'查看 / 添加产品'" :btn-add="true" @add="add" />
    <Spin size="large" fix v-if="spinShow"></Spin>
    <!-- 移动端-删除图片 -->
    <Modal v-model="delPic" @on-ok="confirmDelPic" :mask-closable="false">
      <p>确定删除图片？</p>
    </Modal>
    <!-- 添加/编辑 -->
    <Modal v-model="addModal" :mask-closable="false" :title="pcModal_title" @on-ok="addProd('form_add')" @on-cancel="clearProdObj">
      <Form ref="form_add" :model="prodInfo" :rules="ruleValidate">
        <FormItem label="产品名称" prop="name" class="custom">
          <Input v-model="prodInfo.name"></Input>
        </FormItem>
        <FormItem label="产品类别" prop="category" class="custom">
          <Select v-model="prodInfo.category">
            <Option v-for="item in produceCatgList" :key="item.id" :value="item.name">{{item.name}}</Option>
          </Select>
          <!-- <select v-show="!$store.getters.isPC" class="originalSelect" v-model="prodInfo.category">
            <option v-for="i in produceCatgList" :value="i.name">{{i.name}}</option>
          </select> -->
        </FormItem>
      </Form>
      <div class="modalForm">
        <label>产品装箱规格(件/箱)</label><input type="text" v-model.number="prodInfo.spec">
      </div>
      <div class="modalForm">
        <label>产品价格(元)</label><input type="text" v-model.number="prodInfo.price">
        <p style="font-size:12px;color:red">价格为0时，扫码后的产品页将不显示产品价格</p>
      </div>
      <div class="modalForm">
        <label>产品描述</label>
        <quill-editor v-model="prodInfo.description" :options="editorOption"></quill-editor>
      </div>
      <div class="demo-upload-list" v-for="item in tempPicArr">
        <img :src="item">
        <div class="demo-upload-list-cover">
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)" />
        </div>
      </div>
      <Upload
        ref="upload"
        style="width:100%"
        type="select"
        accept="image"
        v-show="tempPicArr.length<5"
        :max-size=5120
        :data="multipart_params"
        :show-upload-list="false"
        :before-upload="handleBeforeUpload"
        :on-success="handleSuccess"
        :on-error="handledError"
        :on-exceeded-size="handleMaxSize"
        :action="host">
        <Button icon="ios-cloud-upload-outline">上传图片</Button>
       </Upload>
       <p class="notice">尺寸不超过2MB，最多可上传5张</p>
       <p class="notice">建议长宽比例为16:9或16:10</p>
     </Modal>
    <!-- 删除 -->
    <Modal v-model="delModal" title="删除产品" @on-ok="delProd" :mask-closable="false">
      <p>确定删除 <span style="font-weight:bold">{{currentName}}</span> ？</p>
    </Modal>
    <!-- 搜索条件 -->
    <div style="margin-bottom:10px" v-show="$store.getters.isPC">
      <h3 style="margin:20px 0;font-weight:normal">选择产品类别</h3>
      <Select v-model="prodCatg" style="width:20%">
        <Option v-for="item in produceCatgList" :key="item.id" :value="item.name">{{item.name}}</Option>
      </Select>
      <Button type="primary" @click="queryProd">搜索</Button>
      <Button type="primary" @click="queryProd('all')">搜索全部</Button>
    </div>
    <!-- 移动端-搜索条件 -->
    <div class="mob_searchParam" v-show="!$store.getters.isPC">
      <div class="filterBox" ref="filterBox" v-show="!$store.getters.isPC" :class="arrClass">
        <div class="itemBox">
          <h5>选择产品类别</h5>
          <select class="originalSelect" v-model="prodCatg">
            <option v-for="i in produceCatgList" :value="i.name">{{i.name}}</option>
          </select>
        </div>
        <div class="buttonWrap">
          <Button class="reset" @click.stop="reset_queryParam">重置</Button>
          <Button type="primary" @click.stop="queryProd">搜索</Button>
        </div>
      </div>
      <Icon class="setting"  @click.stop="handdleNav" type="ios-settings" />
    </div>
    <!-- 移动端-新增/编辑 -->
    <FormM v-model="showForm" :head="head" @goback="goback" @ok="addProd">
      <div class="mobForm_item">
        <span>产品名称</span>
        <input type="text" v-model="prodInfo.name">
      </div>
      <div class="mobForm_item">
        <label>产品类别</label>
        <Select v-model="prodInfo.category" style="width:70%">
          <Option v-for="item in produceCatgList" :key="item.id" :value="item.name">{{item.name}}</Option>
        </Select>
      </div>
      <div class="mobForm_item">
        <span>装箱规格(件/箱)</span>
        <input type="text" style="width:60%" v-model.number="prodInfo.spec">
      </div>
      <div class="mobForm_item">
        <span>产品价格(元)</span>
        <input type="text" v-model.number="prodInfo.price">
      </div>
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
       :max-size=5120
       :data="multipart_params"
       :before-upload="handleBeforeUpload"
       :on-success="handleSuccess"
       :on-error="handledError"
       :on-exceeded-size="handleMaxSize"
       :action="host">
        <Button icon="ios-cloud-upload-outline">上传图片</Button>
      </Upload>
      <p class="notice">尺寸小于5MB.最多5张图片</p>
      <!-- <div class="mobForm_item">
        <span>产品描述</span>
        <quill-editor style="width:98%" v-model="description_mob" :options="editorOption"></quill-editor>
      </div> -->
    </FormM>
    <Table @on-row-click="singleInfo" :row-class-name="rowClassName" :columns="columns" :data="data"></Table>
    <Page class="page" :total="pageTotal" @on-change="changePage" />
    <button v-show="!$store.getters.isPC" @click="mob_add" type="button" class="mob_addBtn" >新增</button>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import publicFunc from '../../../utils/public.js'
import { quillEditor } from 'vue-quill-editor'

export default {
    data() {
      return {
        arrClass:[],
        delPic:false,
        file:{},
        flag:'',
        description_mob:'',
        spinShow:false,
        pageTotal:0,
        productLimit:0,
        curPage:1,
        tempPicArr:[],
        trashPicArr:[],
        prod_form:false,
        punit:'',
        showForm:false,
        head:'',
        pcModal_title:'',
        addNew:false,
        edit:false,
        currentId:'',
        currentName:'',
        addModal:false,
        updateModal:false,
        delModal:false,
        prodCatg:'',
        host:'//315chain.oss-cn-shanghai.aliyuncs.com',
        key:'',
        ruleValidate:{
          name: [
            { required: true, message: '产品名不能为空', trigger: 'blur' }
          ],
          category: [
            {required:true,type:'string',message:'类目不能为空',trigger:'change'}
          ]
        },
        editorOption:{
          modules:{
            toolbar:[
              ['bold', 'italic', 'underline', 'strike']        // toggled buttons
            ]
          }
        },
        multipart_params:{},
        prodInfo:{pic:[]},
        produceCatgList:[],
        data: [],
        imgName: '',
        visible: false,
        columns: [{
          title: '名称',
          align: 'center',
          key: 'name'
        },{
           title: '缩略图',
           align: 'center',
           render: (h, params) => {
             var picArr = params.row.pic[0]
             var host = this.host || 'http://315chain.oss-cn-shanghai.aliyuncs.com'
             return h('img',{attrs:{src:`${picArr}`,style:"width:204px;height:136px"}})
           }
         },{
          title: '价格',
          align: 'center',
          render:(h,param) => {
            return h('span',param.row.price/100)
          }
        },{
          title:'装箱规格(件/箱)',
          align: 'center',
          key: 'spec'
        },{
          title: '类别',
          align: 'center',
          key: 'category'
        },{
          title: '操作',
          align: 'center',
          width: 280,
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
                      this.updateProdM(params.row)
                      this.flag = 'edit'
                      if(!this.$store.getters.isPC){
                        this.description_mob = params.row.description
                        this.showForm = true
                        this.head = '编辑产品'
                        this.flag = 'edit'
                      } else {
                        this.pcModal_title = '编辑产品'
                        this.addModal = true
                      }
                    }
                  }
                }, '编辑'),
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
                      this.updateProdM(params.row)
                      this.flag = 'clone'
                      if(!this.$store.getters.isPC){
                        this.description_mob = params.row.description
                        this.showForm = true
                        this.head = '克隆产品'
                      } else {
                        this.pcModal_title = '克隆产品'
                        this.addModal = true
                      }
                    }
                  }
                },'克隆'),
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
                      this.delProdM(params.row.id,params.row.name)
                    }
                  }
                }, '删除')
              ])
            }
          }],
        total: 0,
        current: 1,
        pageSize: 6
      }
    },
    computed: {
      ...mapGetters([
        'searchProResult',
        'queryProdCateg_re',
        'enterp_BaseInfo'
      ])
    },
    watch: {
      searchProResult:function(val){
        this.$set(this,'data',val)
      },
      queryProdCateg_re:function(val){
        this.$set(this,'produceCatgList',val)
      },
      enterp_BaseInfo:function(val){
        this.productLimit = val.product_limit
      }
    },
    methods: {
      ...mapActions([
        'searchPro',
        'addPro',
        'update_product',
        'delPro',
        'queryProductCateg_',
        'getUploadPic',
        'queryEnterBaseInfo',
      ]),
      clearProdObj(){
        this.prodInfo = {}
        this.punit = ''
        this.prodInfo.pic = []
        this.tempPicArr = []
        this.trashPicArr = []
      },
      hideNav(eve){
        if(!this.$refs.filterBox.contains(eve.target)){
          this.arrClass.splice(0,1)
        }
      },
      handdleNav(){
        if(!this.arrClass.includes('slide')){
          this.arrClass.splice(0,0,'slide')
        }
      },

      reset_queryParam(){
        this.$set(this,'prodCatg','')
      },
      getProdList(pageNum,obj){
        var pageObj = {per_page_num:20,page_idx:pageNum}
        var newObj = Object.assign(pageObj,obj)

        this.spinShow = true

        this.searchPro(newObj).then((msg) => {
          var msgTxt = msg.error_msg
          this.spinShow = false

          if(msgTxt){
            this.$Message.warning(msgTxt)
            return
          }
          this.pageTotal=msg.data.page_num*10
        }).catch((error) => {
          this.$Message.error(error)
        })
      },
      changePage(p){
        this.getProdList(p)
        this.curPage = p
      },
      goback(){
        this.clearProdObj()
        this.showForm = false
      },
      add() {
        if(this.produceCatgList.length==0){
           this.$Message.warning('请先创建产品类目')
           setTimeout(() => {
             this.$router.replace('/produce/1-1/prodCatg')
           },2000)
        } else {
          if(this.data.length>=this.productLimit){
            this.$Message.warning('可添加产品数量已达上限')
            return
          }
           this.pcModal_title = '添加产品'
           this.flag = 'add'
           this.$set(this,'addModal',true)
        }
      },
      mob_add(){
        this.showForm = true
        this.head = '新建产品'
        this.flag = 'add'
      },
      addProdFunc(){
        //新建-判断是否有图片
        if(this.tempPicArr.length==0){
          this.$Message.warning('请上传图片')
          if(this.$store.getters.isPC){
            this.$nextTick(() => {
              this.addModal = true
            })
          }
          return
        }

        if(this.prodInfo.price){
          this.$set(this.prodInfo,'price',parseInt(this.prodInfo.price*100))
        }

        this.$set(this,'spinShow',true)
        if(!this.$store.getters.isPC){
          this.$set(this.prodInfo,'description',this.description_mob)
        }
        this.addPro(this.prodInfo).then((msg) => {
          this.$set(this,'spinShow',false)
          this.showForm = false

          if(msg || msg==undefined){
            this.$Message.warning(msg || '添加失败，请再试')
            return
          }
          this.$Message.success('添加成功')
          this.clearProdObj()
          this.requestPro()
        }).catch(() => {
          this.$set(this,'spinShow',false)
        })
      },

      addProd(name){
        if(this.$store.getters.isPC){
          if(this.flag=='add' || this.flag=='clone'){
            publicFunc.validateForm.apply(this,[name,this.addProdFunc,this.add])
          } else {
            publicFunc.validateForm.apply(this,[name,this.updateProd])
          }
        } else {
          if(this.flag=='add' || this.flag=='clone'){
            this.addProdFunc()
          } else {
            this.updateProd()
          }
        }
      },
      queryProd(...args){
        this.arrClass.splice(0,1)
        if(args[0]=='all'){
          this.getProdList(1,{})
          return
        }
        this.getProdList(1,{category:this.prodCatg})
      },
      updateProdM(obj){
        this.prodInfo = {}
        this.prodInfo.pic = []
        //过滤行对象中不需要的字段
        for(var i in obj){
          if(!(i=='uid') && !(i=='_index') && !(i=='_rowKey')){
            this.$set(this.prodInfo,i,obj[i])
          }
        }
        //换算价格
        this.$set(this.prodInfo,'price',obj.price/100)
        //处理图片
        this.tempPicArr = []
        obj.pic.forEach(item => {
          var emptyObj = {}
          this.tempPicArr.push(`${this.host}/${item}`)
        })
      },
      updateProd(){
        if(this.prodInfo.pic.length<1){
          this.$Message.warning('请上传图片')
          return
        }

        this.spinShow=true
        this.$set(this,'spinShow',true)
        this.$set(this.prodInfo,'price',this.prodInfo.price*100)
        if(!this.$store.getters.isPC){
          this.$set(this.prodInfo,'description',this.description_mob)
        }
        this.update_product(this.prodInfo).then((msg) => {
          this.$set(this,'spinShow',false)
          this.showForm = false
          this.getProdList(this.curPage)

          if(msg || msg==undefined){
            this.$Message.error(msg || '更新失败请再试')
            return
          }

          this.$Message.success('更新成功')
          this.clearProdObj()
        }).catch(() => {
          this.$set(this,'spinShow',false)
          this.$Message.error('更新失败')
        })
      },

      delProdM(id,name){
        this.$set(this,'delModal',true)
        this.$set(this,'currentId',id)
        this.$set(this,'currentName',name)
      },
      delProd(){
        this.spinShow=true
        this.delPro({id:this.currentId}).then((msg) => {
          this.spinShow=false
          if(msg){
            this.$Message.error(msg)
            return
          }

          this.$Message.success('删除成功')
          this.getProdList(this.curPage)
        })
      },
    singleInfo(row){
      this.$set(this,'currentId',row.id)
      this.$set(this,'currentName',row.name)
    },
    requestPro(){
      this.spinShow=true
      this.getProdList(1,{})
    },
    columns_mob(){
      this.$set(this.columns[0],'fixed','left')
      this.$set(this.columns[0],'width',100)
      this.$set(this.columns[1],'width',200)
      this.$set(this.columns[2],'width',80)
      this.$set(this.columns[3],'width',100)
      this.$set(this.columns[4],'width',90)
      this.$set(this.columns[5],'width',240)
    },
    handleRemove(file){
      this.file = file
      if(!this.$store.getters.isPC){
        if(!this.delPic){
          this.delPic = true
          this.addModal = false
        }
      }
      this.confirmDelPic()
    },
    confirmDelPic(){
      this.trashPicArr.push(this.file.key)
      this.tempPicArr.splice(this.file.index,1)
      this.prodInfo.pic.splice(this.file.index,1)
      this.addModal=true
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
    handleSuccess(res,file,fileList){
      this.tempPicArr.push(`${this.host}/${this.multipart_params.key}?time=${Date.parse(new Date())}`)
      this.prodInfo.pic.push(`${this.host.split(':')[1]}/${this.multipart_params.key}`)
    },
    handleMaxSize (file) {
      this.$Notice.warning({
          title: '超出最大尺寸',
          desc: file.name + ' 图片不可超过5M.'
      });
    },
    handledError(error,file,fileL){
      this.$Message.error(error)
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
  mounted(){
    var htp = window.location.href.split('//')[0]
      //获取商品
      this.getProdList(1,{})
      //获取目录
     this.queryProductCateg_().catch((error) => {
       this.$Message.error(error)
     })
     //获取企业基本信息
     this.queryEnterBaseInfo({})
     // 获取图片上传签名
    this.getUploadPic({}).then(resp => {
      this.host=`${htp}//${resp.data.host.split('//')[1]}`
      this.key=resp.data.dir
      this.multipart_params.policy=resp.data.policy
      this.multipart_params.OSSAccessKeyId=resp.data.accessid
      this.multipart_params.success_action_status=200
      this.multipart_params.signature=resp.data.signature
   })

     //移动端-设置表格
     if(!this.$store.getters.isPC){
       this.columns_mob()
     }
    }
  }
</script>

<style scoped>
.thumb{
  margin:10px 0 0 10px;
  width: 30%
}
.notice{
  padding-left: 10px;
  margin-top: 10px;
}
.modalForm {
  margin-bottom: 24px
}
.modalForm div:nth-of-type(2n){
  margin-left:0
}
.custom >>> .ivu-form-item-label,
.modalForm label{
  width:113px;
  text-align: left;
}
/* .custom >>> .ivu-input{width:50%} */

@media(max-width:768px) {
  .custom >>> .ivu-input{width:100%}
}
</style>
