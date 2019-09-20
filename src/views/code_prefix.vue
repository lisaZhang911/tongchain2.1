<template>
  <div id="">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading v-show="$store.getters.isPC" :c-name="'防伪码前缀'"/>
    <!-- 条件筛选 -->
    <div class="searchBox" v-show="$store.getters.isPC">
      <QurBoxTopic
      txt="请输入企业名"
      :finish="showEnterp"
      style="width:198px;float:left"
      :enterpList="enterprisesList"
      @itemValue="itemValue"
      @itemName="getEnterpName"
      @itemId = 'getEnterpId'
      ></QurBoxTopic>
      <Button type="primary" @click="queryCodePre">搜索</Button>
    </div>
    <!-- 移动端筛选 -->
    <div class="mob_searchParam" v-show="!$store.getters.isPC">
      <div class="mob_searchLink">
        <a @click="toSearchPage"><Icon type="ios-search" /> <span>{{enterpName}}</span> </a>
      </div>
    </div>
    <Table :columns="columns" :data="codePrefixInfo"></Table>
  </div>
</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import publicFunc from '../utils/public.js'

export default {
  data(){
    return {
      finish:false,
      showEnterp:false,
      spinShow:false,
      enterpId: 0,
      enterpName: localStorage.getItem('enterpName') || '搜索企业',
      enterprisesList: [],
      codePrefixInfo: [],
      columns: [{
          title: '当前前缀',
          align: 'center',
          key: 'current_prefix',
        },{
          title: '已使用过防伪码前缀',
          align: 'center',
          render:(h,param)=> {
            var preFixArr = param.row.prefixs
            var newArr = preFixArr.map((x) => {
                return h('li',x)
            })
            return h('ul',newArr)
          }
        }],
     }
  },
  computed:{
    ...mapGetters([
      'getAllEnterpList',
      'queryCodePrefix_re'
    ])
  },
  watch:{
    getAllEnterpList:function(val){
      this.$set(this,'enterprisesList',val)
    },
    queryCodePrefix_re:function(val){
      this.$set(this,'codePrefixInfo',[val])
    }
  },
  methods: {
    ...mapActions([
      'queryAllEnter',
      'queryCodePrefix_'
    ]),
    toSearchPage(){
      localStorage.setItem('path',this.$router.currentRoute.fullPath)
      this.$router.replace('/mob_searchPage')
    },
    queryCodePre(){
      this.$set(this,'spinShow',true)
      this.queryCodePrefix_({enterprise_id:this.enterpId}).then((msg) => {
        this.$set(this,'spinShow',false)
        if(msg){
          this.$Message.error(msg)
          return
        }
      })
    },
    itemValue(val){
      if(this.finish){
        this.$set(this,'finish',false)
        return
      }
      this.$set(this,'showEnterp',true)
      publicFunc.debounce(this.queryAllEnter({audit:3,like_name:val}),800)
    },
    getEnterpName(val){
      this.$set(this,'enterpName',val)
    },
    getEnterpId(val){
      this.$set(this,'enterpId',val)
      this.$set(this,'finish',true)
      this.$set(this,'showEnterp',false)
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
  beforeCreate(){
    if(this.$router.currentRoute.fullPath == localStorage.getItem('path')){
      return
    } else {
      localStorage.removeItem('enterpId')
      localStorage.removeItem('enterpName')
    }
  },
  mounted() {
    if(!this.$store.getters.isPC && localStorage.getItem('enterpId')){
      this.$set(this,'spinShow',true)
      this.queryCodePrefix_({enterprise_id:Number(localStorage.getItem('enterpId'))}).then((msg) => {
        this.$set(this,'spinShow',false)
        if(msg){
          this.$Message.error(msg)
          return
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.searchBox {
  overflow: hidden;

  button {
    float: left;
    margin:15px 0 0 10px;
  }
}
.mob_searchParam .mob_searchLink {
  float:none;
  width:100%;
}
</style>
