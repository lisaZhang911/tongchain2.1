<template>
  <div>
    <Heading :c-name="'标签更换记录查询'" />
    <div class="table-view">
      <div class="table-content" style="min-width: 760px;">
        <!-- <div class="header" v-show="$store.getters.isPC">
          <div class="subheadings">
            <span class="subheading">查询数量</span>
          </div>
          <Total :length="total" :c-name="'个更换记录'" :e-name="'replacement ' + (total > 1 ? 'records' : 'record')" :size="Math.ceil(total/pageSize)" :s="Math.ceil(total/pageSize) > 1" />
        </div> -->
        <Table :row-class-name="rowClassName" :columns="columns" :data="historyList"></Table>
        <Page class="page" :total="pageTotal" @on-change="pageChange" />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions,mapGetters } from 'vuex'
  import { timeExchange,year,month,date,hh,mm,ss } from '../../../utils/timeExchange.js'

  export default {
    data() {
      return {
        pageTotal: 0,
        curPage: 1,
        pageSize: 6,
        historyList:[],
        columns: [
          {
            title: '原二维码',
            align: 'center',
            key: 'old_code'
          },
          {
            title: '新二维码',
            align: 'center',
            key: 'new_code'
          },{
            title:'旧码所属大码',
            align: 'center',
            key:'orig_root'
          },{
            title:'新码所属大码',
            align: 'center',
            key:'new_root'
          },
          {
            title: '更换时间',
            align: 'center',
            render:(h,param) => {
              timeExchange(param.row.change_time)
              return h('span',`${year}年${month}月${date}日-${hh}:${mm}:${ss}`)
            }
          }
        ]
      }
    },
    watch:{
      searchCode_Result:function(val){
        var tempArr = val.slice(0)
        tempArr.forEach(i => {
          i.change_time = Date.parse(i.change_time)
        })
        tempArr.sort((a,b) => {
          return b.change_time - a.change_time
        })
        console.log(tempArr);
        this.$set(this,'historyList',tempArr)
      }
    },
    computed: {
      ...mapGetters([
        'searchCode_Result'
      ]),
      mock: () => {
        let mock = {}

        mock.total = 7
        mock.data1 = []
        return mock
      }
    },
    mounted() {
       //获取更换记录列表
       this.getRecord(1,{})
      //移动端表格
      if(!this.$store.getters.isPC){
        this.columns_mob()
      }
    },
    methods: {
      ...mapActions([
        'search_codeRecord'
      ]),
      getRecord(p,obj){
        var pageObj = {per_page_num: 30,page_idx: p}
        var paramObj = Object.assign(pageObj,obj)

        this.search_codeRecord(paramObj).then(resp => {
          console.log(resp);
          this.pageTotal = resp.data.page_num
        })
      },
      pageChange(p){
        this.curPage = p
        this.getRecord(p,{})
      },
      columns_mob(){
        this.$set(this.columns[0],'fixed','left')
        this.$set(this.columns[0],'width',145)
        this.$set(this.columns[1],'width',145)
        this.$set(this.columns[2],'width',145)
        this.$set(this.columns[3],'width',145)
        this.$set(this.columns[4],'width',170)
      },
      rowClassName(row, index) {
        if(index % 2 === 0) {
          return 'row-odd';
        } else if(index % 2 === 1) {
          return 'row-even';
        }
        return '';
      }
    }
  }
</script>

<style scoped>

</style>
