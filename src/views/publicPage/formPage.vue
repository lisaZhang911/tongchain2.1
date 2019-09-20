<template>
  <div class="" style="height:100%">
    <div class="" v-show="db_edit">
      <div class="mobForm_title">
        <a @click="goback" class="backIcon"><Icon type="ios-arrow-back" /></a>
        <h2 class="title">{{head}}</h2>
      </div>
    </div>
    <div class="" v-show="db_add">
      <div class="mobForm_title">
        <a @click="goback" class="backIcon"><Icon type="ios-arrow-back" /></a>
        <h2 class="title">{{head}}</h2>
      </div>
      <div class="mobForm_item">
        <span>名称</span><input type="text">
      </div>
      <div class="mobForm_item">
        <span>端口</span><input type="text">
      </div>
      <div class="mobForm_item">
        <span>用户数限制</span><input type="text">
      </div>
      <div class="mobForm_item">
        <span>数据库名称</span><input type="text">
      </div>
      <div class="mobForm_item">
        <span>数据库账号</span><input type="text">
      </div>
      <div class="mobForm_item">
        <span>数据库密码</span><input type="text">
      </div>
      <div class="mobForm_item">
        <span>数据库域名</span><input type="text">
      </div>
      <div class="mobForm_item">
        <span style="display:block">描述</span><textarea name="name" rows="8" cols="50"></textarea>
      </div>
      <button type="button">保存</button>
    </div>
  </div>
</template>

<script>
import pathPublic from '../../utils/public.js'

export default {
  data(){
    return {
      head:'',
      db_add:false,
      db_edit:false,
    }
  },
  methods:{
    goback(){
      pathPublic.goback()
    }
  },
  mounted() {
    var currentPath = this.$router.currentRoute.fullPath
    var param = currentPath.split('?')[1]
    if(param == 'db_edit'){
      this.db_edit = true
      this.head = '编辑数据库'
    } else if(param == 'db_add'){
      this.db_add = true
      this.head = '新增数据库'

    }
  }
}
</script>

<style lang='less' scoped>
.title {
  text-align: center;
  font-weight: normal;
}
.mobForm_title {
  padding: 7px 0;
}
.mobForm_item {
  background: #fff;
  padding: 15px 7px;
  border-bottom: 1px solid #ececec;

  span {
    margin-right: 13px;
  }
  input {
    font-size: 13px;
    border: 0;
    width:70%;
    outline: none;
  }
}
</style>
