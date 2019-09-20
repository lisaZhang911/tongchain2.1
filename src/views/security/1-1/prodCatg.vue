<template>
  <div id="">
    <Heading :c-name="'产品类别'" :btn-add="true" @add="add()"/>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <!-- 添加 -->
    <Modal v-model="addNewCatM" :mask-closable="false" title="新建产品类别" @on-ok="addNewCatg">
      <div class="modalForm">
        <label>产品类别名称</label><input type="text" v-model="categoryName">
      </div>
    </Modal>
    <!-- 编辑 -->
    <Modal v-model="updateCatM" :mask-closable="false" title="更改产品类别" @on-ok="updateCatg">
      <div class="modalForm">
        <label>产品类别名</label><input type="text" v-model="categoryName">
      </div>
    </Modal>
    <!-- 删除 -->
    <Modal v-model="delCatM" :mask-closable="false" title="删除产品类别" @on-ok="delCatg">
      <p>删除产品类别<span style="font-weight:bold">{{categoryName}}</span>将会删除该类别下所有产品，确定删除吗 ？</p>
    </Modal>
    <Table  :row-class-name="rowClassName" :columns="columns" :data="categorys"></Table>
    <button v-show="!$store.getters.isPC" @click="add" type="button" class="mob_addBtn" >新增</button>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import publicFunc from '../../../utils/public.js'

export default {
  data(){
    return {
      spinShow:false,
      currentId:-1,
      addNewCatM:false,
      updateCatM:false,
      delCatM:false,
      categoryName: '',
      total:0,
      categorys:[],
      columns:[
        {
          title:'类别',
          align: 'center',
          key:'name'
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
                    this.updateProCatgM(param.row.id,param.row.name)
                  }
                }
              },'编辑'),
              h('Button',{
                props: {
                  shape: 'circle',
                  size: 'small'
                },
                attrs: {
                  id: 'btn2'
                },
                on: {
                  click: () => {
                    this.deleCatgM(param.row.id,param.row.name)
                  }
                }
              },'删除')])
          }
        }]
     }
  },
  watch:{
    queryProdCateg_re:function(val){
      this.$set(this,'categorys',val)
      this.$set(this,'total',val.length)
    }
  },
  computed:{
    ...mapGetters([
      'queryProdCateg_re'
    ])
  },
  methods: {
    ...mapActions([
      'addProductCateg_',
      'queryProductCateg_',
      'updateProductCateg_',
      'delProductCateg_'
    ]),
    add(){
      this.$set(this,'addNewCatM',true)
    },
    addNewCatg(){
      if(!this.categoryName){
        this.$Message.warning('请填写类目名')
        this.$nextTick(() => {
          this.addNewCatM=true
        })
        return
      }
      this.$set(this,'spinShow',true)
      this.addProductCateg_({name:this.categoryName}).then((msg) => {
        this.$set(this,'spinShow',false)
        this.$set(this,'categoryName','')
        if(msg || msg==undefined){
          this.$Message.error(msg || "添加失败，请再试")
          return
        }
        this.$Message.success('添加成功')
        this.$set(this,'categoryName','')
        this.queryProductCateg_()
      })
    },
    updateProCatgM(id,name){
      this.$set(this,'currentId',id)
      this.$set(this,'categoryName',name)
      this.$set(this,'updateCatM',true)
    },
    updateCatg(){
      this.$set(this,'spinShow',true)
      this.updateProductCateg_({
        name:this.categoryName,
        id:this.currentId}).then((msg) => {
          this.$set(this,'spinShow',false)
          if(msg){
           this.$Message.error(msg)
           return
          }
         this.$Message.success('修改成功')
         this.$set(this,'categoryName','')
         this.queryProductCateg_()
       })
     },
    deleCatgM(id,name){
      this.$set(this,'currentId',id)
      this.$set(this,'categoryName',name)
      this.$set(this,'delCatM',true)
    },
    delCatg(){
      this.$set(this,'spinShow',true)
      this.delProductCateg_({id:this.currentId}).then((msg) => {
        this.$set(this,'spinShow',false)
        if(msg){
          this.$Message.error(msg)
          return
        }
        this.$Message.success('删除成功')
        this.queryProductCateg_()
      })
    },
    columns_mob(){
      this.$set(this.columns[0],'width',100)
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
    this.$set(this,'spinShow',true)
    this.queryProductCateg_().then(() => {
      this.$set(this,'spinShow',false)
    })
    //移动端-表格
    if(!this.$store.getters.isPC){
      this.columns_mob()
    }
  }
}
</script>

<style scoped>
</style>
