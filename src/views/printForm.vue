<template>
  <div id="">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Heading :c-name="'印刷格式'" />
    <Input ref="test" v-model.number="batchId" placeholder="输入防伪码批次id" style="width: 300px;margin:15px 10px 15px 0"/>
    <Button type="primary" @click.enter="queryPrintStr">查询</Button>
    <!-- 导出-输入url框 -->
    <Modal v-model="urlInputM" title="防伪码地址" @on-ok="export2Excel" @on-cancel="codeUrl=''">
      <div class="modalForm">
        <label>url地址：</label>
        <Input v-model="codeUrl" />
      </div>
    </Modal>
    <!-- <div v-show="batchListShow" style="margin-bottom:25px">
      <p style="font-weight:bold">您将查询下列批次的印刷格式</p>
      <ul class="printList">
        <li v-for="(item,index) in batchGroup.id">
          {{ item }}
          <button @click="clearItem(index)">&times;</button>
        </li>
      </ul>
      <Button type="primary" @click="queryPrintStr">查询</Button>
    </div> -->
    <div class="table-view" v-show="printTable">
      <Button type="primary" v-show="infos.length>0" style="margin-bottom:10px" @click="exportFunc">导出</Button>
      <div class="table-content">
        <Table :row-class-name="rowClassName" :columns="columns" :data="infos"></Table>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import {timeExchange,year,month,date,hh,mm,ss} from '../utils/timeExchange.js'

export default {
  computed:{
    ...mapGetters([
      'printList'
    ]),
      batchListShow(){
        return this.batchGroup.id.length>0
      }
  },
  watch:{
    printList:function(val){
      this.infos = []
      // var indexFlag = 0
      var newObj = {}
      var printForm = ''
      // val.big_codes.forEach((i,index) => {
      //   val.sub_pwds[index].forEach((j,indexJ) => {
      //     if(indexJ<10){
      //          indexFlag = `0${indexJ}`
      //     } else{
      //          indexFlag = `${indexJ}`
      //     }
      //     printForm += `${i},https://${i},${i}${indexFlag},https://${i}${indexFlag},${j}\r\n`
      //
      //   })
      // })
        newObj.id=this.batchId
        newObj.printForm = `${val.big_codes[0]},https://${val.big_codes[0]},${val.big_codes[0]}00,https://${val.big_codes[0]}00,${val.sub_pwds[0][0]}\r\n...\r\n...`
        // newObj.printForm = printForm
        this.infos.push(newObj)

    }
  },
  data(){
    return {
      urlInputM:false,
      codeUrl:'',
      printContent:'大码，大二维码，小码，小码二维码，密码\r\n',
      spinShow: false,
      printTable: false,
      batchId:'',
      batchGroup: {
        id: []
      },
      infosOriginal:{},
      infos:[],
      columns: [{
          title: '批次id',
          align:'center',
          key: 'id'
        },{
          title: '印刷格式',
          align:'center',
          render:(h,param) => {
            var s = (param.row.printForm).split('\r\n')
             var ss =s.map((x) => {
               return h('p',x)
             })
             return h('div',ss)
          }
        }]
    }
  },
  methods: {
    ...mapActions([
      'queryPrint_'
    ]),
    addBatchId() {
      this.batchGroup.id.push(this.batchId)
      this.$set(this.batchGroup,'id',this.batchGroup.id)
      this.$set(this,'batchId','')
    },
    queryPrintStr(){
      this.$set(this,'spinShow',true)
      this.queryPrint_({id:this.batchId}).then((msg) => {
        this.$set(this,'spinShow',false)
        if(msg){
          this.$Message.error(msg)
        }
        this.$set(this,'printTable',true)
      });
    },
    clearItem(index){
      this.batchGroup.id.splice(index,1)
    },
    traversePrintData(){
      var indexFlag = 0
      var newObj = {}
      var printForm = ''
      var val = this.$store.getters.printList

      val.big_codes.forEach((i,index) => {
        val.sub_pwds[index].forEach((j,indexJ) => {
          if(indexJ<10){
               indexFlag = `0${indexJ}`
          } else{
               indexFlag = `${indexJ}`
          }
          this.printContent += `${i},${this.codeUrl}?code=${i},${i}${indexFlag},${this.codeUrl}?code=${i}${indexFlag},${j}\r\n`
        })
      })
    },
    exportFunc(){
      if(!this.$store.getters.isPC){
        this.$Message.warning('导出功能仅能在pc端使用')
        return
      }

      this.urlInputM = true
      this.codeUrl = ''
    },
    export2Excel(){
      this.traversePrintData()
      // var newTxt = ''
      // this.infos.forEach((item) => {
      //   // newTxt = item.printForm.replace(/\n./g, "\r\n")
      //   newTxt=item.printForm.replace(/https:\/\//g, `${this.codeUrl}?code=`)
      //   this.printContent += newTxt
      // })

      timeExchange(new Date())
      var filename = `防伪码_${year}年${month}月${date}日-${hh}:${mm}:${ss}`
      // var url = `data:text/plain;charset=utf-8,${this.printContent}`
      var url = `${this.printContent}`
      var blob = new Blob([url],{type: "text/plain"})
      var ele = document.createElement('a')
      ele.href = URL.createObjectURL(blob)
      ele.setAttribute('download',filename)
      document.body.appendChild(ele)
      ele.click()
      document.body.removeChild(ele)
      this.codeUrl = ''
      this.printContent = '大码，大二维码，小码，小码二维码，密码\r\n'

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
  // mounted() {
  //   alert('download' in document.createElement('a'));
  // }
}
</script>

<style  scoped>
.table-content{
  margin-top: 3%
}
.printList {
  margin-bottom: 10px
}
.printList li {
  margin-top: 15px;
  margin-left: 20px;
  width: 200px;
  font-size: 16px;
}
.printList button {
  background: none;
  border: 0;
  outline: none;
  float: right;
  cursor: pointer;
}
</style>
