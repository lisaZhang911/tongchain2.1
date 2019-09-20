<template>
  <div id="">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'工单详情'" :btnBack="true" @back="back"/>
    <!-- 回复 -->
    <Modal v-model="replayOrderM" title="工单回复"  @on-ok="reply">
      <textarea v-model="replyContent" rows="10"></textarea>
    </Modal>
    <!-- 移动端-回复 -->
    <FormM v-model="showForm_rely" :head="head" @goback="goback" @ok="reply">
      <div class="mobForm_item">
        <span>回复内容</span>
        <textarea v-model="replyContent" rows="5"></textarea>
      </div>
    </FormM>
    <!-- 移动端-更新 -->
    <FormM v-model="showForm_edit" :head="head" @goback="goback" @ok="updateOrder">
      <div class="mobForm_item">
        <span>回复内容</span>
        <textarea v-model="newContent" rows="5"></textarea>
      </div>
    </FormM>
    <!-- 移动端-回复/编辑 -->
    <!-- <div class="mobForm" v-show="!$store.getters.isPC && work_form">
      <div class="mobForm_title">
        <h2 class="title">{{head}}</h2>
        <button v-show="replyD"type="button" @click="reply">保存</button>
        <button v-show="edit"type="button" @click="updateOrder">保存</button>
      </div>
      <div class="mobForm_item" v-show="replyD">
        <span>回复内容</span>
        <textarea v-model="replyContent" rows="5"></textarea>
      </div>
      <div class="mobForm_item" v-show="edit">
        <span>回复内容</span>
        <textarea v-model="newContent" rows="5"></textarea>
      </div>
    </div> -->
    <!-- 更新 -->
    <Modal v-model="updateM" title="工单编辑" @on-ok="updateOrder">
      <textarea v-model="newContent" rows="10"></textarea>
    </Modal>
    <Table :row-class-name="rowClassName" :columns="columns_detail" :data="workOrderDetail"></Table>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import { year,month,date,hh,mm,ss,timeExchange } from '../../utils/timeExchange.js'
import publicFunc from './columnData.js'

export default {
  data(){
    return {
      spinShow:false,
      work_form:false,
      showForm_edit:false,
      showForm_rely:false,
      replyD:false,
      edit:false,
      head:'',
      user_type:localStorage.getItem('user_type'),
      replayOrderM:false,
      replyContent:'',
      updateM:false,
      newContent:'',
      lastItemId:-1,
      detailId:-1,
      workOrderDetail:[],
      columns_detail: [{
        title:'状态',
        align: 'center',
        render: (h,param) => {
          var statusStr = publicFunc.changeStatus(param.row.status)
          return h('span',statusStr)
        }
      },{
        title:'最后更新时间',
        align: 'center',
        render:(h,param) => {
             timeExchange(param.row.last_time)
          return h('span',`${year}年${month}月${date}日-${hh}:${mm}:${ss}`)
        }
      },{
        title:'内容',
        align: 'center',
        key:'content'
      },{
        title:'操作',
        align: 'center',
        render:(h,param) => {
          var index = param.index+1
          if(!(index%2) && this.user_type==4 || index%2 && this.user_type==5){
            return h('Button',{
              props: {
                shape: 'circle',
                size: 'small'
              },
              attrs: {
                id: 'btn1'
              },
              on: {
                click: () => {
                  if(this.lastItemId > param.row.detail_id){
                    this.$Message.warning('不可重复回复')
                    return
                  }
                  if(this.$store.getters.isPC){
                    this.$set(this,'replayOrderM',true)
                    return
                  }
                    this.showForm_rely=true
                    this.head='回复表单'
                }
              }
            },'回复')
          }
          return h('Button', {
            props: {
              shape: 'circle',
              size: 'small'
            },
            attrs: {
              id: 'btn2'
            },
            on: {
              click: () => {
                this.$set(this,'detailId',param.row.detail_id)
                this.$set(this,'newContent',param.row.content)
                if(this.$store.getters.isPC){
                   this.$set(this,'updateM',true)
                  return
                }
                this.showForm_edit=true
                this.head='编辑表单'
              }
            }
          }, '编辑')
        }
      }],
      // columns_detail_mob: [{
      //   title:'状态',
      //   width:80,
      //   render: (h,param) => {
      //     var statusStr = publicFunc.changeStatus(param.row.status)
      //     return h('span',statusStr)
      //   }
      // },{
      //   title:'最后更新时间',
      //   width:100,
      //   render:(h,param) => {
      //     timeExchange(param.row.last_time)
      //     return h('span',`${year}年${month}月${date}日-${hh}:${mm}:${ss}`)
      //   }
      // },{
      //   title:'内容',
      //   width:200,
      //   key:'content'
      // },{
      //   title:'操作',
      //   width:80,
      //   render:(h,param) => {
      //     var index = param.index+1
      //     if(!(index%2) && this.user_type==4 || index%2 && this.user_type==5){
      //       return h('Button',{
      //         props: {
      //           shape: 'circle',
      //           size: 'small'
      //         },
      //         attrs: {
      //           id: 'btn1'
      //         },
      //         on: {
      //           click: () => {
      //             if(this.lastItemId > param.row.detail_id){
      //               this.$Message.warning('不可重复回复')
      //               return
      //             }
      //             if(this.$store.$store.getters.isPC){
      //               this.$set(this,'replayOrderM',true)
      //               return
      //             }
      //             this.work_form=true
      //             this.edit=false
      //             this.replyD=true
      //             this.head='回复表单'
      //           }
      //         }
      //       },'回复')
      //     }
      //     return h('Button', {
      //       props: {
      //         shape: 'circle',
      //         size: 'small'
      //       },
      //       attrs: {
      //         id: 'btn2'
      //       },
      //       on: {
      //         click: () => {
      //           this.$set(this,'detailId',param.row.detail_id)
      //           this.$set(this,'newContent',param.row.content)
      //           this.work_form=true
      //           this.edit=true
      //           this.replyD=false
      //           this.head='编辑表单'
      //         }
      //       }
      //     }, '编辑')
      //   }
      // }]
    }
  },
  methods: {
    ...mapActions([
      'modifyOrder',
      'getOrderDetail',
      'replyOrder_'
    ]),
    getList(){
      var id = this.$router.currentRoute.query.id
      this.$set(this,'spinShow',true)
      this.getOrderDetail({id:Number(id)}).then((detailInfo) => {
       this.$set(this,'spinShow',false)
       this.$set(this,'lastItemId',detailInfo[detailInfo.length-1].detail_id)
       this.$set(this,'workOrderDetail',detailInfo)
     })
    },
    goback(){
      this.showForm_edit = false
      this.showForm_rely = false
      this.replyContent = ''
    },
    back() {
      this.$router.replace('/setting/workOrder')
    },
    reply(){
      if(!this.replyContent){
        this.$Message.warning('请输入回复内容')
        return
      }
      this.$set(this,'spinShow',true)
      this.replyOrder_({
        id:Number(this.$router.currentRoute.query.id),
        content:this.replyContent
      }).then((msg) => {
        this.$set(this,'spinShow',false)
        this.work_form=false
        this.replyContent=false
        if(msg){
          this.$Message.error(msg)
          return
        }
        this.$Message.success('回复成功')
        this.getList()
      })
    },
    updateOrder(){
      this.spinShow=true
      this.modifyOrder({
        detail_id:this.detailId,
        content:this.newContent}).then((msg) => {
          this.spinShow=false
          this.work_form=false
          if(msg || msg==undefined){
            this.$Message.error(msg || '更新失败')
            return
          }
          this.$Message.success('更新成功')
          this.getList()
        })
    },
    column_mob(){
      this.$set(this.columns_detail[0],'fixed','left')
      this.$set(this.columns_detail[0],'width',100)
      this.$set(this.columns_detail[1],'width',170)
      this.$set(this.columns_detail[2],'width',200)
      this.$set(this.columns_detail[3],'width',100)
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
     this.getList()

     //移动端-表格
     if(!this.$store.getters.isPC){
       this.column_mob()
     }
  }
}
</script>

<style>
.backIcon {
  display: block;
  float:none;
}
</style>
