<template>
  <div id="">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'企业实名认证'"/>
    <div class="">
      <div class="modalForm detailPage_item">
        <label>状态</label><input v-model="auditStr" type="text" disabled/>
      </div>
      <div class="modalForm detailPage_item">
        <label>企业名称</label><input v-model="name" type="text" :disabled="audit==1 ||audit==3"/>
      </div>
      <div class="modalForm detailPage_item" :class="{spe_item:$store.getters.isPC}">
        <label>企业所属国家</label><input v-model="country" disabled/>
      </div>
      <div class="modalForm detailPage_item" :class="{spe_item:$store.getters.isPC}">
        <label>企业所属省份</label>
        <Select v-model="province" v-show="$store.getters.isPC" :disabled="audit==1||audit==3" class="select">
            <Option v-for="item in provinceList" :value="item" :key="item">{{ item }}</Option>
        </Select>
        <select v-show="!$store.getters.isPC" class="originalSelect" style="display:block;width:87%" v-model="province">
          <option :readonly="audit==1||audit==3" v-for="i in provinceList" :value="i">{{i}}</option>
        </select>
      </div>
      <div class="modalForm detailPage_item pc_mb" :class="{spe_item:$store.getters.isPC}">
        <label>企业所属市</label>
        <Select v-model="city" v-show="$store.getters.isPC" :disabled="audit==1||audit==3" class="select">
            <Option v-for="item in cityList" :value="item" :key="item">{{ item }}</Option>
        </Select>
        <select v-show="!$store.getters.isPC" class="originalSelect" style="display:block;width:87%" v-model="city">
          <option :readonly="audit==1||audit==3" v-for="i in cityList" :value="i">{{i}}</option>
        </select>
      </div>
      <div class="modalForm detailPage_item address" style="float:none;clear:both">
        <label>企业详细地址</label>
        <input type="text" :class="{mob_txtA_width:!$store.getters.isPC,pc_txtA_width:$store.getters.isPC}" v-model="address" :disabled="audit==1 ||audit==3">
      </div>
      <div class="modalForm detailPage_item">
        <label>统一社会信用代码</label><input v-model="cred_code" :disabled="audit==1||audit==3"/>
      </div>
      <div class="modalForm detailPage_item" >
        <label>联系人</label><input v-model="link_man" :disabled="audit==1 ||audit==3"/>
      </div>
      <div class="modalForm detailPage_item pc_mb">
        <label>联系电话</label><input v-model="phone" :disabled="audit==1 ||audit==3"/>
      </div>
      <div class="modalForm detailPage_item">
        <label>企业认证提交时间</label><input v-model="req_audited_time" disabled/>
      </div>
      <div class="modalForm detailPage_item" style="float:none" v-show="audit==2">
        <label style="display:block">未通过原因</label>
        <textarea rows="8" cols="80" v-model="noPass_res" disabled></textarea>
      </div>
      <div class="modalForm detailPage_item" style="float:none;clear:both" v-for="i in baseInfoImgArr">
        <p>{{i.type}}</p>
        <img class="licenseImg" :src="i.info" >
      </div>
      <Upload
       v-show="audit==0&&upFunc || audit==2&&upFunc"
       :show-upload-list="false"
       style="width:30%"
       type="select"
       accept="image"
       :max-size=2048
       :data="multipart_params"
       :before-upload="handleBeforeUpload"
       :on-success="handleSuccess"
       :on-error="handledError"
       :action="host">
        <Button icon="ios-cloud-upload-outline">上传营业执照</Button>
      </Upload>
      <p v-show="audit==0&&upFunc || audit==2&&upFunc">仅可上传一张图片</p>
    </div>

    <Button v-show="audit==0 || audit==2" class="submitBtn" type="primary" @click="updateEnterpNoAc">确定</Button>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import publicFunc from '../utils/public.js'
import  {timeExchange,year,month,date,hh,mm,ss} from '../utils/timeExchange.js'
import city from '../utils/city.js'
// import {Upload} from 'iview'

export default {
  // components: {
  //   Upload
  // },
  data(){
    return {
      upFunc:true,
      invalid:false,
      provinceList:[],
      cityList:[],
      audit:-1,
      auditStr:'',
      dataId:localStorage.getItem('data_id'),
      spinShow:false,
      name:'',
      imgName:'',
      req_audited_time:'',
      country:'中国',
      province:'',
      city:'',
      address:'',
      cred_code:'',
      link_man:'',
      phone:'',
      noPass_res:'',
      host:'',
      key:'',
      multipart_params:{},
      picName:'',
      infos:[],
      baseInfoImgArr:[]
    }
  },
  watch:{
    audit: function(val){
      this.auditStr = publicFunc.change_enterpType(val)
    },
    province:function(val){
      this.cityList=[]

      city.forEach((curVal) => {
        if(curVal.name==val){
          curVal.city.forEach((curCity) => {
            this.cityList.push(curCity.name)
          })
        }
      })
    },
    enterp_BaseInfo:function(val){
      console.log(val.infos);
      if(val){
        this.audit = val.audit
        this.auditStr = publicFunc.change_enterpType(val.audit)

        this.name = val.name

        if(val.req_audited_time){
          timeExchange(val.req_audited_time)
          this.req_audited_time=`${year}年${month}月${date}日-${hh}:${mm}:${ss}`
        }
        if(val.infos){
          for(var i of val.infos){
            if(i.type==1){
              this.baseInfoImgArr.push(i)
              i.type = publicFunc.change_baseInfo_type(i.type)
              this.picName = i.info.slice(i.info.length-14)
            }
            else {
              this.transeBaseInfo(i.type,i.info)
            }
          }
        }
      }
    }
  },
  computed:{
    ...mapGetters([
      'enterp_BaseInfo'
    ])
  },
  methods: {
    ...mapActions([
      'updateEnterp_noAC',
      'queryEnterBaseInfo',
      'getUploadPic',
      'getPic'
    ]),
    getProvice(){
      city.forEach((curVal) => {
        this.provinceList.push(curVal.name)
      })
    },
    transeBaseInfo(num,val){
      switch (num) {
        case 2:
          this.country=val
          break;
        case 3:
          this.province=val
          break;
        case 4:
          this.city=val
          break;
        case 5:
          this.address=val
          break;
        case 6:
          this.cred_code=val
          break;
        case 7:
          this.link_man=val
          break;
        case 8:
          this.phone=val
          break;
        case 9:
          this.noPass_res=val
          break;
      }
    },
    updateEnterpNoAc(){
      var result = publicFunc.verifyPhone(this.phone.trim())
      if(!result){
        this.$Message.warning("联系电话格式错误")
        return
      }
      this.infos=[]
      if(this.baseInfoImgArr.length>0){
        this.addInfos(1,this.baseInfoImgArr[0].info)
      }
      // if(this.baseInfoImgArr.length>0){
      //   this.addInfos(1,this.baseInfoImgArr[0].info)
      // } else {
      //   this.addInfos(1,`${this.host}/${this.multipart_params.key}`)
      // }
      this.addInfos(2,this.country)
      if(this.province != ''){
        this.addInfos(3,this.province)
      }
      if(this.city !=''){
        this.addInfos(4,this.city)
      }
      if(this.address!=''){
        this.addInfos(5,this.address)
      }
      if(this.cred_code!=''){
        this.addInfos(6,this.cred_code.trim())
      }
      if(this.link_man!=''){
        this.addInfos(7,this.link_man)
      }
      if(this.phone!=''){
        this.addInfos(8,this.phone.trim())
      }
      if(this.infos.length==8){
        this.spinShow=true

        this.updateEnterp_noAC({name:this.name,infos:this.infos}).then((resp) => {
          this.spinShow=false
          if(resp.data.error_msg || resp.data.error_msg==undefined){
            this.$Message.error(resp.data.error_msg || '提交失败')
            return
          }
          this.$Message.success({
            content:'提交成功',
            duration: 5
          })
          this.audit=1
        })
      } else {
        this.$Message.warning("所有信息不得留空")
      }
    },
    addInfos(type,value){
      // if(!value){
      //   this.invalid = true
      //   return
      // }
      // this.invalid = false
      var obj={}
      obj.type=type
      obj.info=value
      this.infos.push(obj)
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
      if(this.picName){
        this.baseInfoImgArr[0]['info']+=`?time=${Date.parse(new Date())}`
      } else {
        var obj ={}
        obj.type="营业执照"
        obj.info=`${this.host}/${this.multipart_params.key}`
        this.$set(this.baseInfoImgArr,'0',obj)
      }
    },
    handledError(error,file,fileL){}
  },
  mounted () {
    this.getProvice()
    var emptyObj = {}
    // this.spinShow=true

    // 获取图片上传签名
      this.getUploadPic(emptyObj).then(resp => {
        this.host=resp.data.host
        this.key=resp.data.dir
        this.multipart_params.policy=resp.data.policy
        this.multipart_params.OSSAccessKeyId=resp.data.accessid
        this.multipart_params.success_action_status=200
        this.multipart_params.signature=resp.data.signature
      })
    // 获取企业基础信息
    this.queryEnterBaseInfo(emptyObj).then((msg) => {
      this.spinShow = false
        if(msg || msg==undefined){
            this.$Message.error(msg)
            return
        }
    })
  },
}
</script>

<style lang='less' scoped>
.modalForm.detailPage_item /deep/ .weui-cells {
  margin-top: 0
}
.modalForm.detailPage_item /deep/ .weui-cell {
  padding: 5px 15px
}
.modalForm.detailPage_item {
  &.address {
    input.mob_txtA_width {
      width: 95%
    }
    input.pc_txtA_width {
      width: 46%
    }
  }
  &.spe_item {
    float:left;
    width:30%;

    input,.select {
      width:64%
    }
  }
  &.pc_mb {
    margin-bottom: 40px;
  }
}
.submitBtn {
  display: block;
  margin-top: 10%;
  width:100px
}
 .licenseImg {
   width:25%
 }

</style>
