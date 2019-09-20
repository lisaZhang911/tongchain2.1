<template>
  <div id="">
    <!-- 企业/平台公用页面 -->
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'企业详情/配置'" :btnBack="true" @back="back"/>
    <!-- 某企业信息-平台 -->
    <div v-show="user_type==5">
      <div class="modalForm detailPage_item" >
        <label>信息更新时间</label><input type="text" v-model="enterInfoDetail.updated_time" disabled>
      </div>
      <div class="modalForm detailPage_item">
        <label>处理器前缀</label><input type="text" v-model="enterInfoDetail.processor_prefix" disabled>
      </div>
      <div class="modalForm detailPage_item">
        <label>代理商前缀</label><input type="text" v-model="enterInfoDetail.agency_prefix" disabled>
      </div>
      <div class="modalForm detailPage_item">
        <label>超管账号</label><input type="text" v-model="enterInfoDetail.super_admin_account" disabled>
      </div>
      <div class="modalForm detailPage_item">
        <label>超管电话</label><input type="text" v-model="enterInfoDetail.super_admin_phone" disabled>
      </div>
      <div class="modalForm detailPage_item">
        <label>创建时间</label><input type="text" v-model="enterInfoDetail.created_time" disabled>
      </div>
      <div class="modalForm detailPage_item">
        <label>被停用时间</label><input type="text" v-model="enterInfoDetail.banned_time" disabled>
      </div>
      <div class="modalForm detailPage_item">
        <label>审核时间</label><input type="text" v-model="enterInfoDetail.audited_time" disabled>
      </div>
      <div class="modalForm detailPage_item">
        <label>提交审核时间</label><input type="text" v-model="enterInfoDetail.req_audited_time" disabled>
      </div>
      <div class="modalForm detailPage_item">
        <label>代理商上限</label><input type="text" v-model.number="enterInfoDetail.agency_limit" :disabled="!configBtn">
      </div>
      <div class="modalForm detailPage_item">
        <label>处理器上限</label><input type="text" v-model.number="enterInfoDetail.processor_limit" :disabled="!configBtn">
      </div>
      <div class="modalForm detailPage_item">
        <label>商品上限</label><input type="text" v-model.number="enterInfoDetail.product_limit" :disabled="!configBtn">
      </div>
      <div class="modalForm detailPage_item">
        <label>商品上限1</label><input type="text" v-model.number="enterInfoDetail.production_limit" :disabled="!configBtn">
      </div>
      <div class="modalForm detailPage_item">
        <label>企业状态</label><input type="text" v-model="enterInfoDetail.audit" disabled>
      </div>
      <div class="modalForm detailPage_item">
        <label>防伪码地址</label><input type="text" v-model="enterInfoDetail.sweep_code_address" :disabled="!configBtn">
      </div>
      <div class="modalForm detailPage_item">
        <label>流通上限</label><input type="text" v-model.number="enterInfoDetail.circulate_limit" :disabled="!configBtn">
      </div>
      <div class="modalForm detailPage_item">
        <label>普管上限</label><input type="text" v-model.number="enterInfoDetail.normal_admin_limit" :disabled="!configBtn">
      </div>
    </div>
    <!-- 企业基础信息 -->
    <div class="modalForm detailPage_item">
      <label>名称</label><input type="text" v-model="name" disabled>
    </div>
    <div class="modalForm detailPage_item">
      <label>企业网站</label><input v-model="website" :disabled="user_type==5"/>
    </div>
    <div class="modalForm detailPage_item">
        <label>企业邮箱</label><input v-model="email" :disabled="user_type==5"/>
    </div>
    <div class="modalForm detailPage_item">
      <label>联系电话</label><input v-model="phone" :disabled="user_type==5"/>
    </div>
    <div class="modalForm detailPage_item">
      <label>企业QQ</label><input v-model="qq" :disabled="user_type==5"/>
    </div>
    <div class="modalForm detailPage_item">
      <label>企业微信</label><input v-model="wechat" :disabled="user_type==5"/>
    </div>
    <div class="modalForm detailPage_item">
      <label>企业公众号</label><input v-model="wechatOff" :disabled="user_type==5"/>
    </div>
    <div class="modalForm detailPage_item" style="float:none;padding-top:20px">
      <label style="display:block">企业简介</label>
      <textarea v-model="introd" rows="8" cols="80" :disabled="user_type==5"></textarea>
    </div>
    <div class="modalForm detailPage_item" style="width:30%;float:left;margin-right:10px" v-for="i in baseInfoImgArr">
        <p>{{i.type}}</p>
        <img class="licesenImg" :src="i.info" >
    </div>
     <Upload
      v-show="configBtn || user_type!=5"
      :show-upload-list="false"
      style="width:30%"
      type="select"
      accept="image"
      :max-size=5120
      :data="multipart_params"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :action="host">
       <Button icon="ios-cloud-upload-outline">上传企业logo</Button>
     </Upload>

    <Button v-show="configBtn" @click="updateEnterp" type="primary" :class="{mobBtn:!$store.getters.isPC}">更新配置</Button>
  </div>
</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import  {timeExchange,year,month,date,hh,mm,ss} from '../../utils/timeExchange.js'
import publicFunc from '../../utils/public.js'

export default {
  data(){
    return {
      picName:'',
      user_type:localStorage.getItem('user_type'),
      spinShow:false,
      configBtn:true,
      name:'',
      audit:'',
      req_audited_time:'',
      website:'',
      email:'',
      phone:'',
      qq:'',
      wechat:'',
      wechatOff:'',
      introd:'',
      enterInfoDetail:{},
      updateEnterpInfo:{},
      host:'',
      key:'',
      multipart_params:{},
      infos:[],
      baseInfo:{},
      baseInfoArr:[],
      baseInfoImgArr:[]
    }
  },
  computed: {
    ...mapGetters([
      'enterp_BaseInfo',
      'enterpDetail_store'
    ])
  },
  watch:{
    website(val){
      publicFunc.debounce(() => {
          this.filter(102)
          this.addInfos(102,this.website)
      },800)
    },
    email(val){
      publicFunc.debounce(() => {
        this.filter(103)
         this.addInfos(103,this.email)
      },800)
    },
    phone(val){
      publicFunc.debounce(() => {
        this.filter(104)
        this.addInfos(104,this.phone.trim())
      },800)
    },
    qq(val){
      publicFunc.debounce(() => {
        this.filter(105)
        this.addInfos(105,this.qq)
      },800)
    },
    wechat(val){
      publicFunc.debounce(() => {
        this.filter(106)
        this.addInfos(106,this.wechat)
      },800)
    },
    wechatOff(val){
      publicFunc.debounce(() => {
        this.filter(107)
        this.addInfos(107,this.wechatOff)
      },800)
    },
    introd(val){
      publicFunc.debounce(() => {
        this.filter(108)
        this.addInfos(108,this.introd)
      },800)
    },
    baseInfoArr(val){
      val.forEach((curVal) => {
        this.transeBaseInfo(curVal.type,curVal.info)
      })
    },
    // 基础信息
    enterp_BaseInfo(val){
      this.baseInfoImgArr=[]
      this.name=val.name
      this.audit=publicFunc.change_enterpType(val.audit)

      if(val.req_audited_time){
        timeExchange(val.req_audited_time)
        this.req_audited_time=`${year}年${month}月${date}日-${hh}:${mm}:${ss}`
      }

      if(val.infos){
        for(var i of val.infos){
          if(i.type==101 || i.type==1){
            i.type = publicFunc.change_baseInfo_type(i.type)
            this.baseInfoImgArr.push(i)
            if(i.type=='企业logo'){
              this.picName = i.info.slice(i.info.length-14)
            }
          } else {
            this.baseInfoArr.push(i)
          }
        }
      }
    },
    // 某企业信息-平台
    enterpDetail_store(val){
      // 储备修改需要的参数
      if(val){
        var objKeys = [
          'normal_admin_limit',
          'agency_limit',
          'processor_limit',
          'product_limit',
          'production_limit',
          'sweep_code_address',
          'circulate_limit'
        ]
        var objKeysStr = objKeys.join('')
        for(var i of Object.keys(val)){
          if(objKeysStr.indexOf(i)>-1){
            this.updateEnterpInfo[i]=val[i]
          }
        }
        this.updateEnterpInfo.id=Number(localStorage.getItem('enterp_id'))
        if(val.updated_time){
          timeExchange(val.updated_time)
          val.updated_time = `${year}年${month}月${date}日-${hh}:${mm}:${ss}`
        }
        if(val.created_time){
          timeExchange(val.created_time)
          val.created_time=`${year}年${month}月${date}日-${hh}:${mm}:${ss}`
        }
        if(val.banned_time){
          timeExchange(val.banned_time)
          val.banned_time=`${year}年${month}月${date}日-${hh}:${mm}:${ss}`
        }
        if(val.audited_time){
          timeExchange(val.audited_time)
          val.audited_time=`${year}年${month}月${date}日-${hh}:${mm}:${ss}`
        }
        if(val.req_audited_time){
          timeExchange(val.req_audited_time)
          val.req_audited_time=`${year}年${month}月${date}日-${hh}:${mm}:${ss}`
        }
        val.audit = publicFunc.change_enterpType(val.audit)
        this.enterInfoDetail=val
      }
    }
  },
  methods:{
    ...mapActions([
      'queryEnterBaseInfo',
      'detailEnterp_',
      'updateEnterp_',
      'updateEnterpBaseInfo',
      'getUploadPic'
    ]),
    filter(type){
      var index = this.infos.findIndex((item) => {
        return item.type == type
      })
      if(index>-1){
        this.infos.splice(index,1)
      }
    },
    addInfos(type,value){
      var obj={}
      obj.type=type
      obj.info=value
      this.infos.push(obj)
    },
    transeBaseInfo(num,val){
      switch (num) {
        case 102:
          this.website=val
          break;
        case 103:
          this.email=val
          break;
        case 104:
          this.phone=val
          break;
        case 105:
          this.qq=val
          break;
        case 106:
          this.wechat=val
          break;
        case 107:
          this.wechatOff=val
          break;
        case 108:
          this.introd=val
          break;
      }
    },
    back(){
      if(this.user_type==5){
        var currentPath = this.$router.currentRoute.fullPath

        if(currentPath.split('?')[1]=='detail_stop'){
          this.$router.replace('/enterpManage_stop')
          return
        }
        this.$router.replace('/enterpManage_p')
      } else {
        this.$router.replace('/enterprise/enterpManage')
      }
    },
    init(){
      this.spinShow = true
      var obj={}
      var id = Number(localStorage.getItem('enterp_id'))
      // 基础信息
      if(id){
        obj.id=id
      }
      this.queryEnterBaseInfo(obj).then((msg) => {
        this.spinShow = false
        if(msg || msg==undefined){
          this.$Message.error(msg)
          return
        }
      })
      //某企业信息
      if(localStorage.getItem('user_type')==5){
        this.detailEnterp_({id:id}).then((msg) => {
          this.$set(this,'spinShow',false)
          if(msg){
            this.$Message.error(msg)
            return
          }
        })
      }
    },
    updateEnterp(){
      this.spinShow=true
      if(this.user_type==5){
        this.updateEnterp_(this.enterInfoDetail).then((msg) => {
          this.spinShow=false
          if(msg || msg==undefined){
            this.$Message.error(msg || '修改配置失败')
            return
          }
          this.$Message.success('修改配置成功');
          this.init()
        }).catch(() => {
          this.$Message.error('修改配置失败')
        })
      } else {
        this.baseInfo.infos=this.infos

        this.updateEnterpBaseInfo(this.baseInfo).then((msg) => {
          // this.spinShow=false
          if(msg || msg ==undefined){
            this.$Message.error(msg || '更新企业信息失败')
            return
          }
          this.$Message.success('更新企业信息成功')
          this.init()
        })
      }
    },
    handleBeforeUpload(file){
      if(this.picName){
        this.multipart_params.key=`${this.key}${this.picName}`
        return
      }
      var newPicName = publicFunc.random_string(10)+publicFunc.get_suffix(file.name)
      this.multipart_params.key=`${this.key}${newPicName}`
    },
    handleSuccess(resp,file,fileL){
      for(var curVal of this.baseInfoImgArr){
        if(curVal.type=='企业logo'){
          curVal.info+=`?time=${Date.parse(new Date())}`
          return
        }
      }
      this.baseInfoImgArr.push({type:'企业logo',info:`${this.host}/${this.multipart_params.key}`})
      this.addInfos(101,`${this.host}/${this.multipart_params.key}`)
    },
  },
  mounted(){
    var routParam = this.$router.currentRoute.fullPath.split('?')[1]
    if(routParam.indexOf('detail')>-1){
      this.configBtn = false
    }
    // 获取图片上传签名
    var emptyObj = {}
    this.getUploadPic(emptyObj).then(resp => {
      this.host=resp.data.host
      this.key=resp.data.dir
      this.multipart_params.policy=resp.data.policy
      this.multipart_params.OSSAccessKeyId=resp.data.accessid
      this.multipart_params.success_action_status=200
      this.multipart_params.signature=resp.data.signature
    })
    this.init()
  }
}
</script>
<style lang="less" scoped>
  button {
    width: 150px;
    margin-top: 5%;
    margin-bottom: 10%;
}
  .mobBtn {
    display: block;
    width: 80%;
    margin: 10% auto 5%;
    float: none;
    font-size: 15px
  }
  img {
    width: 100%
  }
  .licesenImg {
    width:60%
  }
  ul {
    overflow: hidden;

    li {
      float: left;
      width: 30%;
      margin-right: 3%;

      p {
        font-size: 14px;
        margin-bottom: 10px;
        text-align: center;
      }
    }
  }
</style>
