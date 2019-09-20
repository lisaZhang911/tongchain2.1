<template>
  <div id="">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'停用企业'" :btnBack="true" @back="back"/>
    <!-- 删除弹框 -->
    <Modal v-model="delEnterpModal" title="删除企业" @on-ok="delEnterpM">
        <p>是否删除<span style="font-weight:bold;font-size:15px">{{currentName}}</span>的记录</p>
    </Modal>
    <!-- 删除二次确认弹框 -->
    <Modal v-model="delEnterpConfirmModal" title="停用企业" @on-ok="delEnterp">
        <p>一旦删除<span style="font-weight:bold;font-size:15px">{{currentName}}</span>数据，将不可回复。仍然确定删除？</p>
    </Modal>

    <Table :row-class-name="rowClassName" :columns="columns_stop" :data="enterpList_stop"></Table>
  </div>
</template>

<script>
import { mapActions,mapGetters } from 'vuex'

export default {
  data(){
    return {
      spinShow:false,
      delEnterpModal:false,
      delEnterpConfirmModal:false,
      currentName:'',
      currentId:-1,
      del_code:'',
      head:'',
      enterpList_stop:[],
      columns_stop:[{
          title: '企业名称',
          align: 'center',
          key: 'name',
        },{
          title: '操作',
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
                      if(!this.$store.getters.isPC){
                        this.head='企业详情'
                      }
                      localStorage.setItem('enterp_id',params.row.id)
                      this.$router.replace('/enterpManage_p_detail?detail_stop')
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {
                    shape: 'circle',
                    size: 'small'
                  },
                  attrs: {
                    id: 'btn3'
                  },
                  on: {
                    click: () => {
                      this.$set(this,'delEnterpModal',true)
                      this.$set(this,'currentName',params.row.name)
                      this.$set(this,'currentId',params.row.id)
                    }
                  }
                }, '删除')
              ])
          }
        }
      ]
    }
  },
  computed:{
    ...mapGetters([
      'getStopEnterpList'
    ])
  },
  watch:{
    getStopEnterpList:function(val){
      this.enterpList_stop=val
    }
  },
  methods:{
    ...mapActions([
      'queryAllEnter',
      'delEnterp_'
    ]),
    back(){
      this.$router.replace('/enterpManage_p')
    },
    delEnterpM(){
      this.spinShow=true
      this.delEnterp_({id:this.currentId}).then((resp) => {
        this.spinShow=false
        if(resp.data.data){
          this.$set(this,'del_code',resp.data.data.del_code)
          this.$set(this,'delEnterpConfirmModal',true)
        }
      })
    },
    delEnterp(){
      this.$set(this,'spinShow',true)
      this.delEnterp_({id:this.currentId,del_code:this.del_code}).then((resp) => {
        this.$set(this,'spinShow',false)
        if(resp.data.error_code!=0){
          this.$Message.error(resp.data.error_msg)
          return
        }
        this.$Message.success('删除成功')
        this.queryAllEnter({audit:4})
      })
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

    this.queryAllEnter({audit:4}).then(() => {
      this.$set(this,'spinShow',false)
    })

  }
}
</script>
<style scoped>
</style>
