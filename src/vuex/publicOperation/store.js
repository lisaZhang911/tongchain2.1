import * as pubOperateAction from './actions.js'
import * as pubOperateGetter from './getters.js'

export default {
  state: {
    searchSysInfoListResult: {},
    sysInfoResult: {},
    workOrderList: {},
    orderDetail: {},
    queryAgency_result: {},
    query_ProdTraceList_result: [],
    queryCodePrefix_result: {},
    addCirculate_result:[]
  },
  mutations: {
    addCirculate_result:function(state,val){
      state.addCirculate_result=val
    },
    searchSysInfoListResult:function(state,val){
      state.searchSysInfoListResult = val
    },
    sysInfoDetailResult:function(state,val){
      state.sysInfoResult = val
    },
    searchOrderList:function(state,val){
      state.workOrderList = val
    },
    orderDetail:function(state,val){
      state.orderDetail = val
    },
    queryAgency_result: function(state,val){
      state.queryAgency_result = val
    },
    query_ProdTraceList_result: function(state,val){
      state.query_ProdTraceList_result = val
    },
    queryCodePrefix_result: function(state,val){
      state.queryCodePrefix_result = val
    },
  },
  actions: {
    replyOrder_:pubOperateAction.replyOrder_,
    modifyPwd: pubOperateAction.modifyPwd,
    search_sysInfoList: pubOperateAction.search_sysInfoList,
    search_sysInfoDetail: pubOperateAction.search_sysInfoDetail,
    searchOrderList: pubOperateAction.searchOrderList,
    getOrderDetail: pubOperateAction.getOrderDetail,
    queryAgency_: pubOperateAction.queryAgency_,
    updateAgency_: pubOperateAction.updateAgency_,
    delAgency_: pubOperateAction.delAgency_,
    addProdTrace_: pubOperateAction.addProdTrace_,
    queryProdTraceList_: pubOperateAction.queryProdTraceList_,
    delProdTrace_: pubOperateAction.delProdTrace_,
    queryCodePrefix_: pubOperateAction.queryCodePrefix_,
    pre_addAgency: pubOperateAction.pre_addAgency,
    addCirculateTrace: pubOperateAction.addCirculateTrace
  },
  getters: {
    addCirculate_result: pubOperateGetter.addCirculate_result,
    getSearchSysInfoListResult: pubOperateGetter.getSearchSysInfoListResult,
    getSysInfoResult: pubOperateGetter.getSysInfoResult,
    getOrderWorkList: pubOperateGetter.getOrderWorkList,
    orderDetail: pubOperateGetter.orderDetail,
    queryAgency_re: pubOperateGetter.queryAgency_re,
    query_ProdTraceList_re: pubOperateGetter.query_ProdTraceList_re,
    queryCodePrefix_re: pubOperateGetter.queryCodePrefix_re,
  }
}
