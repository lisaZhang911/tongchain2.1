<template>
  <div id="massQueryBox" :class="{border:$store.getters.isPC}">
    <input v-model="value" :placeholder="txt" :disabled="disabled"/>
    <ul v-show="finish">
      <li v-for="item in enterpList" @click="chooseItem(item.id,item.name)">{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['txt','enterpList','finish','disabled'],
  data(){
    return {
      value:'',
    }
  },
  watch: {
    value(val){
      this.$emit('itemValue',val)
    }
  },
  methods: {
    chooseItem(id,name){
      this.$set(this,'value',name)
      this.$emit('itemId',id)
      this.$emit('itemName',name)
    },
  }
}
</script>

<style scoped>
#massQueryBox ul {
  position: absolute;
  z-index: 2;
  width:40%;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0,0,0,.2);
}
#massQueryBox li {
  padding: 5px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#massQueryBox li:hover {
  background: #f3f3f3
}
#massQueryBox input {
  width: 100%;
  height: 31px;
  margin-top: 16px;
  padding-left: 8px;
  border-radius: 20px;
  border: 1px solid #dcdee2;
  outline: none;
}
#massQueryBox.border {
  margin-bottom: 15px;
}
#massQueryBox.border input {
  margin-top: 15px;
  border: 1px solid #dcdee2;
  margin-bottom: 5px;
  height: 30px;
  padding: 0 8px;
}
</style>
