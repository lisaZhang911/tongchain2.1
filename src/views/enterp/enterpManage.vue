<template>
  <div id="">
    <!-- 企业专用 -->
    <Heading :c-name="'企业信息'" />
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Table :row-class-name="rowClassName" :columns="columns" :data="enterpList"></Table>
  </div>
</template>
<script>
import { mapActions,mapGetters } from 'vuex'

export default {
  data(){
    return {
      spinShow: false,
      updateModal:false,
      enterInfoUpdate:{
        name:'',
        infos:[]
      },
      imgInfo:{
       type:1,
       info:"ent_13811111111_001.jpg"
      },
      enterpList:[],
      columns: [
        {
          title: '企业名称',
          align: 'center',
          key: 'name',
        },
        {
          title: '是否通过审核',
          align: 'center',
          render:(h,param) => {
            var audit = param.row.audit
            switch(audit){
            case 0:
              return h('span','待提交实名认证资料')
            case 1:
              return h('span','待审核')
            case 2:
              return h('span','审核未通过')
            case 3:
              return h('span','审核通过')
            }
          }
        },
        {
          title: '操作',
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
                    // localStorage.setItem('enterp_id',param.row.id)
                    this.$router.replace('/enterpManage_p_detail?config')
                  }
              }},'详情/编辑'),
            ])
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'enterp_BaseInfo',
      'get_allEnterpPrefix'
    ]),
  },
  watch:{
    enterp_BaseInfo(val){
      this.enterpList.push(val)
    }
  },
  methods: {
    ...mapActions([
      'queryEnterBaseInfo'
    ]),
    columns_mob(){
      if(this.$store.getters.isPC){
        return
      }
      this.$set(this.columns[0],'width',100)
      this.$set(this.columns[1],'width',100)
      this.$set(this.columns[2],'width',100)
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
    var emptyObj = {}
    this.queryEnterBaseInfo(emptyObj)
    //移动端-表格
    // this.columns_mob()
  }
}
</script>
<style  scoped>
</style>
