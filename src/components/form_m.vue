<template>
  <div  class="form_panel" v-show="showForm_visible">
    <div class="mobForm_title">
      <a @click="goback" class="backIcon" style="position:absolute"><Icon type="ios-arrow-back" /></a>
      <h2 class="title">{{head}}</h2>
    </div>
    <slot></slot>
    <Button type="primary" class="m_form_button" @click="ok">保存</Button>
  </div>
</template>
<script>
export default {
  props: ['head','value'],
  computed:{
    showForm_visible(){
      return this.value
    }
  },
  methods: {
    goback() {
      this.$emit('goback')
    },
    ok(){
      this.$emit('ok')
    }
  }
}
</script>
<style lang="less" scoped>
.form_panel {
  position: fixed;
  z-index: 6;
  width: 100%;
  height: 100%;
  background: #fff;
  top: 0px;
  left:0;
  overflow-y: scroll;

  .title {
    text-align: center;
    font-weight: normal;
    font-size: 15px;
  }
  .mobForm_item {
    font-size: 14px;
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
    }
  }
  .m_form_button{
    display: block;
    font-size: 15px;
    width: 85%;
    margin: 5% auto
  }
}
</style>
