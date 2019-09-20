import Vue from 'vue'
import * as plantformOprationAction from './actions.js'
import * as plantformOprationGetter from './getters.js'

var tempArr=[]

export default {
  state: {
    addEnterpResult:{},
    allEnterpList:[],
    stop_enterp:[],
    avail_enterp:[],
    searchAllEnAdminResult:{},
    addDocuResult: {},
    searchDocListResult: {},
    docDetailResult: {},
    updateDocResult: {},
    delDocResult: {},
    modifyOrderResult:{},
    generatSecuCode: {},
    clienScan_result: {},
    dataBaseList: [],
    detailEnterp: {},
    printList: [],
    codeList:[]
  },
  mutations: {
    enterpDetail:function(state,val){
      state.detailEnterp = val
    },
    getAddEnterpResult:function(state,val){
      state.addEnterpResult = val
    },
    getAllEnterp:function(state,val){
      state.allEnterpList = val
      // if(val){
      //   (function loop(arr){
      //     for(var index=0;index<arr.length;index++){
      //       if(arr[index].ban==true){
      //         tempArr.push(...arr.splice(index,1))
      //         loop(val)
      //       }
      //     }
      //   })(val)
      // }
      // state.allEnterpList = val
      // state.stop_enterp=tempArr
      // tempArr=[]
    },
    getAllEnterp_stop:function(state,val){
      state.stop_enterp = val
    },
    getAllEnterp_avail:function(state,val){
      state.avail_enterp = val
    },
    print_list:function(state,val){
      state.printList = val
    },
    searchEnAdminResult:function(state,val){
      state.searchAllEnAdminResult = val
    },
    addDocuResult:function(state,val){
      state.addDocuResult = val
    },
    getDocList:function(state,val){
      state.searchDocListResult = val
    },
    docDetailResult:function(state,val){
      state.docDetailResult = val
    },
    updateDocResult:function(state,val){
      state.updateDocResult = val
    },
    delDocuResult:function(state,val){
      state.delDocResult = val
    },
    modifyOrderResult:function(state,val){
      state.modifyOrderResult = val
    },
    clienScan_result: function(state,val){
      state.clienScan_result = val
    },
    dataBaseList: function(state,val){
      state.dataBaseList = val
    },
    codeList:function(state,val){
      state.codeList = val
    }
  },
  actions: {
    stopEnter_:plantformOprationAction.stopEnter_,
    addEnterp: plantformOprationAction.addEnterp,
    queryAllEnter: plantformOprationAction.queryAllEnter,
    addEnterpAdmin: plantformOprationAction.addEnterpAdmin,
    delete_enterpAdmin: plantformOprationAction.delete_enterpAdmin,
    search_allEnterpAdmin: plantformOprationAction.search_allEnterpAdmin,
    add_sysInfo: plantformOprationAction.add_sysInfo,
    del_sysInfo: plantformOprationAction.del_sysInfo,
    add_document: plantformOprationAction.add_document,
    docList : plantformOprationAction.docList,
    docDetail: plantformOprationAction.docDetail,
    updateDocum: plantformOprationAction.updateDocum,
    delDocum: plantformOprationAction.delDocum,
    modifyOrder: plantformOprationAction.modifyOrder,
    generate_secuCode: plantformOprationAction.generate_secuCode,
    queryCodeList_: plantformOprationAction.queryCodeList_,
    queryPrint_: plantformOprationAction.queryPrint_,
    scanCode_: plantformOprationAction.scanCode_,
    getDataBaseConfig: plantformOprationAction.getDataBaseConfig,
    add_newDataBase: plantformOprationAction.add_newDataBase,
    updateNewData: plantformOprationAction.updateNewData,
    delDataBase: plantformOprationAction.delDataBase,
    updateEnterp_: plantformOprationAction.updateEnterp_,
    detailEnterp_: plantformOprationAction.detailEnterp_,
    passCheck: plantformOprationAction.passCheck,
    delEnterp_: plantformOprationAction.delEnterp_,
    update_enterpAdmin: plantformOprationAction.update_enterpAdmin
  },
  getters: {
    getAllEnterpAvail: plantformOprationGetter.getAllEnterpAvail,
    getStopEnterpList: plantformOprationGetter.getStopEnterpList,
    getCodeList: plantformOprationGetter.getCodeList,
    getAddEnterpResult: plantformOprationGetter.getAddEnterpResult,
    getAllEnterpList: plantformOprationGetter.getAllEnterpList,
    getAllEnAdminResult: plantformOprationGetter.getSearchEnAdminResult,
    getAddDocResult: plantformOprationGetter.getAddDocResult,
    getDocListResult: plantformOprationGetter.getDocList,
    getDocDetailResult: plantformOprationGetter.getDocDetailResult,
    updateDocResult: plantformOprationGetter.updateDocResult,
    delDocResult: plantformOprationGetter.delDocResult,
    modifyOrderResult: plantformOprationGetter.modifyOrderResult,
    geneSecuCodeResult: plantformOprationGetter.geneSecuResult,
    addCodePre_re: plantformOprationGetter.addCodePre_re,
    printList: plantformOprationGetter.printList,
    clienScan_result: plantformOprationGetter.clienScan_result,
    dataBaseList_store: plantformOprationGetter.dataBaseList_store,
    enterpDetail_store: plantformOprationGetter.enterpDetail_store
  }
}
