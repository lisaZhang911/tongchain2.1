<template>
  <div class="searchPage">
    <div class="searchBox">
      <a @click="goback()" class="backIcon"><Icon type="ios-arrow-back" /></a>
      <input type="text" v-model="enterpName" placeholder="搜索企业">
      <button type="button" @click="searchEnterp">搜索</button>
    </div>
    <div class="emptyMessage" v-show="empty">没有搜索到相关企业</div>
    <ul>
      <li v-for="i in enterpList" :key="i.id" :value="i.id" @click="searchEnterp_item(i.id,i.name)">{{i.name}}</li>
    </ul>
  </div>
</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import pathPublic from '../../utils/public.js'

export default {
  data(){
    return {
      empty:false,
      enterpName:'',
      enterpList:[]
    }
  },
  watch:{
    getAllEnterpList:function(val){
      if(val==false){
        this.$set(this,'empty',true)
        this.$set(this,'enterpList',[])
      } else {
        this.$set(this,'empty',false)
        this.$set(this,'enterpList',val)
      }
    }
  },
  computed:{
    ...mapGetters([
      'getAllEnterpList'
    ])
  },
  methods: {
    ...mapActions([
      'queryAllEnter'
    ]),
    goback() {
      pathPublic.goback()
    },
    searchEnterp(){
      const msg = this.$Message.loading({
          content: '搜索中',
          duration: 0
      });
      this.queryAllEnter({
        audit:4,
        like_name: this.enterpName
      }).then(() => {
        setTimeout(msg,100)
      })
    },
    searchEnterp_item(id,name){
      localStorage.setItem('enterpName',name)
      localStorage.setItem('enterpId',id)
      this.$router.replace(localStorage.getItem('path'))
    }
  }
}
</script>

<style lang='less' scoped>
.searchPage{
  min-height: 100%;
  background: #fff;
  padding: 10px;

  .emptyMessage {
    font-size:15px;
    color: #999;
    text-align: center;
    padding: 10px 0;
  }
  .searchBox{
    padding-top:10px;
    display: flex;
    align-items:Center;

    input {
      width:70%;
      margin-left: 3%;
      height:30px;
      border:1px solid #dfdfdf;
      border-radius: 4px;
      text-indent: 5px;
      outline: none;
      font-size: 14px;
    }
    button {
      margin-left: 3%;
      border: none;
      background: transparent;
      font-size: 16px;
      color: #333;
    }
  }
  ul {
    padding:0 10px;
    background: #fff;
    margin-top: 3%;
    font-size: 14px;

    li {
      padding:10px 0;
      border-bottom: 1px solid #ececec
    }
  }
}
</style>
