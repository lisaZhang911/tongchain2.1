<template>
  <div id="">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'代理商类别'" :btn-add="true" @add="add()"  />
    <!-- 添加  -->
    <Modal v-model="addModal" :mask-closable="false" title="添加代理商类别" @on-ok="addAgentCat">
      <div class="modalForm">
        <label>代理商类别编码</label><input type="text" v-model="agentCatInfo.code" >
        <p style="color:red">类别编码必须为英文字符，区分大小写。如：按商品品类划分代理商，食品类(编码：SP)与化妆品类(编码：HZP)</p>
      </div>
      <div class="modalForm">
        <label>代理商类别名称</label><input type="text" v-model="agentCatInfo.name">
      </div>
    </Modal>
    <!-- 删除 -->
    <Modal v-model="delModal" :mask-closable="false" title="删除代理商类别" @on-ok="delAgentCat">
      <p>确定删除<span style="font-weight:bold">{{this.currentName}}</span>？</p>
    </Modal>
      <Table :row-class-name="rowClassName" :columns="columns" :data="agentList"></Table>
      <button v-show="!$store.getters.isPC" @click="add" type="button" class="mob_addBtn" >新增</button>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'

export default {
  data(){
    return {
      objOriginal:{},
      spinShow:false,
      total:0,
      addModal:false,
      delModal:false,
      currentName:'',
      currentId:-1,
      agentList:[],
      agentCatInfo:{},
      columns:[{
          title:'代理商类别编码',
          align: 'center',
          key: 'code'
        },{
          title:'代理商名称',
          align: 'center',
          key:'name'
        },{
          title:'操作',
          align: 'center',
          width: 300,
          render:(h,param) => {
            return h('div',[
              h('Button', {
                props: {
                  shape: 'circle',
                  size: 'small'
                },
                attrs: {
                  id: 'btn2'
                },
                on: {
                  click: () => {
                    this.delAgentCatM(param.row)
                  }
                }
              }, '删除')
            ])
          }
        }]
    }
  },
  watch:{
    searchAgenTypeResult:function(val){
      this.$set(this,'agentList',val)
      this.$set(this,'total',val.length)
    }
  },
  computed:{
    ...mapGetters([
      'searchAgenTypeResult'
    ])
  },
  methods: {
    ...mapActions([
      'searchEnterpAgencyType',
      'addAgencyType',
      'delAgenType',
    ]),
    add(){
      this.agentCatInfo = {}
      this.$set(this,'addModal',true)
    },
    send_obj(op,objOriginal){
      var obj ={}
      obj.op = op
      obj.typname = objOriginal.name
      obj.typcode = objOriginal.code
      return obj
    },
    addAgentCat(){
      if(Object.keys(this.agentCatInfo).length<2){
        this.$Message.warning('请完整填写所有条目')
        this.$nextTick(() => {
          this.add()
        })
        return
      }

      this.$set(this,'spinShow',true)
      this.addAgencyType(this.agentCatInfo).then((msg) => {
        this.$set(this,'spinShow',false)
        if(msg || msg==undefined){
          this.$Message.error(msg || '添加失败')
          return
        }
        this.$Message.success('添加成功')
        this.searchEnterpAgencyType()
        this.agentCatInfo={}
      })
    },
    delAgentCatM(row){
      this.$set(this,'currentName',row.name);
      this.$set(this,'currentId',row.id);
      this.objOriginal = row
      this.$set(this,'delModal',true);
    },
    delAgentCat(){
      this.$set(this,'spinShow',true)
      this.delAgenType({ID:this.currentId}).then((msg) => {
        this.$set(this,'spinShow',false)
        if(msg || msg==undefined){
          this.$Message.error(msg || '删除失败')
          return
        }
        this.$Message.success('删除成功')
        this.searchEnterpAgencyType()
      })
    },
    columns_mob(){
      this.$set(this.columns[0],'width',100)
      this.$set(this.columns[1],'width',100)
      this.$set(this.columns[2],'width',150)
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
  mounted(){
    this.$set(this,'spinShow',true)
    this.searchEnterpAgencyType().then(() => {
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
