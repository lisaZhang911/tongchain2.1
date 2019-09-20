<template>
  <div class="mobile-padding">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading c-name="产品流通情况查询"/>
    <div class="header">
      <div class="subheadings">
        <span class="subheading">追踪查询</span>
      </div>
      <Input class="input" v-model="code" placeholder="请输入要查询的防伪码，仅支持盒码查询，箱码无效" />
      <Button v-show="!$store.getters.isPC" class="btn" id="btn1" shape="circle" @click="scanCode()" >扫码</Button>
    </div>
    <hr v-show="$store.getters.isPC" />
    <Buttons :btnText="'查询'" @confirm="confirm()" />
    <div class="resultShow" v-show="flag">
      <p>防伪码：{{this.code}}</p>
      <p>涉及产品：{{this.prod_txt}}</p>
      <Timeline>
        <TimelineItem v-for="(item,index) in circuleList" :key="index">
            <p class="time">{{item.created_time}}</p>
            <p class="content">
              <span style="font-weight:bold" v-show="item.op_type==0">{{'本帐号'}}</span>
              <span style="font-weight:bold" v-show="item.op_type==2">{{item.agency_txt}}</span>
              {{item.op_type_txt}}
              <span style="font-weight:bold" v-show="item.op_type==1">{{item.agency_txt}}</span>
            </p>
        </TimelineItem>
      </Timeline>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import {timeExchange,year,month,date,hh,mm,ss} from '../../utils/timeExchange.js'
  import wx from 'weixin-jsapi'
  import publicFunc from '../../utils/public.js'

  export default {
    data() {
      return {
        flag:false,
        spinShow:false,
        code:'',
        prod_txt:'',
        prodList:[],
        agencyList:[],
        circuleList:[]
      }
    },
    watch:{
      code:function(){
        this.flag = false
      },
      searchProResult:function(val){
        this.prodList = val
      },
      queryAgency_re:function(val){
        this.agencyList = val
      }
    },
    computed:{
      ...mapGetters([
        'searchProResult',
        'queryAgency_re'
      ]),
      changeTime(){

        return '1'
      },
    },
    methods: {
      ...mapActions([
        'queryOptionCode',
        'searchPro',
        'queryAgency_',
        'getWechat'
      ]),
      scanCode(){
        var _self = this
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
               var code = res.resultStr.split('=')[1]
               alert(code)
               _self.code = code
            },
            fail: function(res){
              alert(res)
            }
          });
      },
      transfer_prod(num){
        for(var item of this.prodList){
          if(item.id == num){
            return item.name
          }
        }
      },
      transfer_agency(num){
        var str = ''
        for(var item of this.agencyList){
          if(item.id == num){
             return item.authorization
          }
        }
        return '本帐号'
      },
      transfer_opType(num){
          switch (num) {
            case 0:
              return '绑码'
              break;
            case 1:
              return '发货至'
              break;
            case 2:
              return '收货'
              break;
            case 3:
              return '取消绑码'
              break;
            case 4:
              return '取消发货'
              break;
          }
      },
      confirm() {
        if(this.code && this.code.length==16){
          this.spinShow=true

          this.queryOptionCode({code:this.code.trim()}).then(resp => {
              this.spinShow=false
              console.log(resp);
              this.flag = true
              if(resp.data.error_msg){
                this.$Message.error(resp.data.error_msg)
                return
              }
              this.circuleList = resp.data.data.infos
              this.prod_txt = this.transfer_prod(this.circuleList[0].product_id)
              if(this.circuleList.length<1) return
              this.circuleList.map(i => {
                timeExchange(i.created_time)
                i.created_time = `${year}年${month}月${date}日-${hh}:${mm}:${ss}`
                i.op_type_txt = this.transfer_opType(i.op_type)
                i.agency_txt = this.transfer_agency(i.agency_id)
              })
            })
        } else { this.$Message.warning('必须为小码') }
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
      //获取产品列表
      this.searchPro({per_page_num: 999999,page_idx: 1})
      //获取代理商列表
      this.queryAgency_({per_page_num: 999999,page_idx: 1})
      if(!this.$store.getters.isPC){
        //获取微信sdk权限
        this.getWechat({url:location.href.split('#')[0]}).then(resp => {
          var respData = resp.data
          wx.config({
            debug: true,
            appId: respData.appid,
            timestamp: respData.time,
            nonceStr: respData.noncestr,
            signature: respData.signature,
            jsApiList: ['scanQRCode']
         });
        })
      }
    }
  }
</script>

<style scoped>
  .input {
    width: 314px;
    margin-top: 25px;
  }
  .resultShow {
    padding-top: 30px;
  }
  .resultShow p {
    font-size: 15px;
    margin-bottom: 10px;
  }
  @media (max-width: 768px) {
    .header {
      height: auto;
    }
    .input {
      width: 100%;
      margin: 10px 0 12px;
    }
    #btn1{
      width:100%
    }
  }
</style>
