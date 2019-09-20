<template>
  <div class="heading" :class="{padding_mob:!$store.getters.isPC}">
    <div class="pc_head"  v-show="$store.getters.isPC">
      <span class="c-back" v-show="btnBack" @click="back()"><Icon type="ios-arrow-back" /></span>
      <span class="c-name">{{ cName }}</span>
      <span class="e-name">{{ eName }}</span>
      <Button class="btnAdd" v-show="btnAdd" type="primary" shape="circle" @click="add()">+ 添加</Button>
    </div>
    <div class="mob_head"  v-show="!$store.getters.isPC">
      <span class="c-back" v-show="btnBack" @click="back()"><Icon type="ios-arrow-back" /></span>
      <span class="c-name">{{ cName }}</span>
      <span class="e-name">{{ eName }}</span>
    </div>
  </div>
</template>

<script>
  import {Icon} from 'iview'
  export default {
    components: {
      Icon
    },
    props: {
      cName: {
        type: String,
        default: ''
      },
      eName: {
        type: String,
        default: ''
      },
      btnAdd: {
        type: Boolean,
        default: false
      },
      btnBack: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      add() {
        this.$emit('add')
      },
      back(){
        this.$emit('back')
      }
    }
  }
</script>

<style lang='less' scoped>
.padding_mob {
  padding: 0 20px;
}
.heading {
  .pc_head {
    height: 60px;
    border-bottom: 1px solid #ADCD00;
  }
  .mob_head {
    padding-top: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ADCD00;
  }
  .c-name {
    color: #00638C;
    font-size: 18px;
  }
  .c-back{
    font-size: 28px;
    cursor: pointer;
  }
  .e-name {
   margin-left: 5px;
   font-size: 13px;
 }
 .btnAdd {
   float: right;
   width: 80px;
   font-weight: bold;
   color: #00638C;
   background: #ADCD00;
   border: 1px solid #ADCD00;
 }
}
</style>
