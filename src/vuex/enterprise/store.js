import * as enterpriseOprationAction from './actions.js'
import * as enterpreiseOprationGetter from './getters.js'

export default {
  state: {
    editOrderResult:{},
    searchProResult:[],
    searchAgencyTypeResult:[],
    searchTraceResult:[],
    circulTraceResult:[],
    changeCodeResult: {},
    searchCodeResult: {},
    addEventAutho_result: {},
    delEventAtuo_result: {},
    queryEvent_result: {},
    queryEveOpetor_result: [],
    addProdCatg_result: {},
    queryProdCateg_result: [],
    updateProdCatg_result: {},
    delProdCatg_result: {},
    queryTraceCatg_result: [],
    addLot_result: {},
    queryLot_result: [],
    enterpBaseInfo: {},
    enterpPrefix: {},
    processorAcount:'',
    optionCodeList: [],
    queryCode:{}
  },
  mutations:{
    code_trace:function(state,val){
      state.queryCode = val
    },
    processor_account:function(state,val){
      state.processorAcount = val
    },
    editOrderResult:function(state,val){
      state.editOrderResult = val
    },
    searchProResult:function(state,val){
      state.searchProResult = val
    },
    searchEnterpAgencyType:function(state,val){
      state.searchAgencyTypeResult = val
    },
    searchTraceResult:function(state,val){
      state.searchTraceResult = val
    },
    circulTrace_Result: function(state,val){
      state.circulTraceResult = val
    },
    searchCodeRecord_Result: function(state,val){
      state.searchCodeResult = val
    },
    optionCodeList(state,val){
      state.optionCodeList =val
    },
    addEventAuto_result(state,val){
      state.addEventAutho_result = val
    },
    delEventAuto_result(state,val){
      state.delEventAtuo_result = val
    },
    queryEvent_result(state,val){
      state.queryEvent_result = val
    },
    queryEveOpetor_result(state,val){
      state.queryEveOpetor_result = val
    },
    addProdCatg_result(state,val){
      state.addProdCatg_result = val
    },
    queryProdCateg_result(state,val){
      state.queryProdCateg_result = val
    },
    updateProdCatg_result(state,val){
      state.updateProdCatg_result = val
    },
    delProdCatg_result(state,val){
      state.delProdCatg_result = val
    },
    queryTraceCatg_result(state,val){
      state.queryTraceCatg_result = val
    },
    addLot_result(state,val){
      state.addLot_result = val
    },
    queryLot_result(state,val){
      state.queryLot_result = val
    },
    enterpBaseInfo(state,val){
      state.enterpBaseInfo = val
    },
    get_allEnterpPrefix(state,val){
      state.enterpPrefix=val
    }
  },
  actions:{
    queryCode_trace:enterpriseOprationAction.queryCode_trace,
    queryOptionCode_trace:enterpriseOprationAction.queryOptionCode_trace,
    startAgent: enterpriseOprationAction.startAgent,
    disabelAgent: enterpriseOprationAction.disabelAgent,
    getWechat: enterpriseOprationAction.getWechat,
    cancel_goods: enterpriseOprationAction.cancel_goods,
    cancel_bind: enterpriseOprationAction.cancel_bind,
    queryOptionCode: enterpriseOprationAction.queryOptionCode,
    getUploadPic:enterpriseOprationAction.getUploadPic,
    updateEnterpBaseInfo:enterpriseOprationAction.updateEnterpBaseInfo,
    del_traceCirculate_:enterpriseOprationAction.del_traceCirculate_,
    delProcesor_:enterpriseOprationAction.delProcesor_,
    updateProcesor: enterpriseOprationAction.updateProcesor,
    queryEnterBaseInfo: enterpriseOprationAction.queryEnterBaseInfo,
    reqAddProcesor: enterpriseOprationAction.reqAddProcesor,
    addProcessor_: enterpriseOprationAction.addProcessor_,
    updateEnterp_noAC: enterpriseOprationAction.updateEnterp_noAC,
    queryEventOperator_: enterpriseOprationAction.queryEventOperator_,
    addOrder: enterpriseOprationAction.addOrder,
    editOrder: enterpriseOprationAction.editOrder,
    delOrder: enterpriseOprationAction.delOrder,
    delPro: enterpriseOprationAction.delPro,
    searchPro:enterpriseOprationAction.searchPro,
    addAgencyType:enterpriseOprationAction.addAgencyType,
    searchEnterpAgencyType:enterpriseOprationAction.searchEnterpAgencyType,
    delAgenType:enterpriseOprationAction.delAgenType,
    searchTrace:enterpriseOprationAction.searchTrace,
    addPro:enterpriseOprationAction.addPro,
    add_tracePro:enterpriseOprationAction.add_tracePro,
    update_product:enterpriseOprationAction.update_product,
    mody_traceInfo: enterpriseOprationAction.mody_traceInfo,
    add_agent: enterpriseOprationAction.add_agent,
    bind_secuCode: enterpriseOprationAction.bind_secuCode,
    deliver_goods: enterpriseOprationAction.deliver_goods,
    take_good: enterpriseOprationAction.take_good,
    circul_trace: enterpriseOprationAction.circul_trace,
    change_code: enterpriseOprationAction.change_code,
    search_codeRecord: enterpriseOprationAction.search_codeRecord,
    addEventAutoInfo: enterpriseOprationAction.addEventAutoInfo,
    delEventAutoInfo: enterpriseOprationAction.delEventAutoInfo,
    queryAvailEvent_: enterpriseOprationAction.queryAvailEvent_,
    addProductCateg_: enterpriseOprationAction.addProductCateg_,
    queryProductCateg_: enterpriseOprationAction.queryProductCateg_,
    updateProductCateg_: enterpriseOprationAction.updateProductCateg_,
    delProductCateg_: enterpriseOprationAction.delProductCateg_,
    addTraceCatg_: enterpriseOprationAction.addTraceCatg_,
    queryTraceCatg_: enterpriseOprationAction.queryTraceCatg_,
    updateTraceCatg_: enterpriseOprationAction.updateTraceCatg_,
    delTraceCatg_: enterpriseOprationAction.delTraceCatg_,
    addLot_: enterpriseOprationAction.addLot_,
    queryLot_: enterpriseOprationAction.queryLot_,
    delLot_: enterpriseOprationAction.delLot_,
    setPrefix: enterpriseOprationAction.setPrefix,
    getEnterp_prefix: enterpriseOprationAction.getEnterp_prefix,
    updateEventAuthory: enterpriseOprationAction.updateEventAuthory,
    del_traceInfo: enterpriseOprationAction.del_traceInfo
  },
  getters: {
    queryCode: enterpreiseOprationGetter.queryCode,
    query_optionCodeList: enterpreiseOprationGetter.query_optionCodeList,
    queryProdCateg_re: enterpreiseOprationGetter.queryProdCateg_re,
    procesor_acount: enterpreiseOprationGetter.procesor_acount,
    get_allEnterpPrefix: enterpreiseOprationGetter.get_allEnterpPrefix,
    enterp_BaseInfo: enterpreiseOprationGetter.enterp_BaseInfo,
    queryEveOpetor_re: enterpreiseOprationGetter.queryEveOpetor_re,
    editOrderResult: enterpreiseOprationGetter.editOrderResult,
    searchProResult: enterpreiseOprationGetter.searchProResult,
    searchAgenTypeResult: enterpreiseOprationGetter.searchAgenTypeResult,
    searchTraceResult: enterpreiseOprationGetter.searchTraceResult,
    circuTraceResult: enterpreiseOprationGetter.circuTraceResult,
    searchCode_Result: enterpreiseOprationGetter.searchCode_Result,
    addEventAuto_re: enterpreiseOprationGetter.addEventAuto_re,
    delEventAuto_re: enterpreiseOprationGetter.delEventAuto_re,
    queryEvent_re: enterpreiseOprationGetter.queryEvent_re,
    addProdCatg_re: enterpreiseOprationGetter.addProdCatg_re,
    queryProdCateg_re: enterpreiseOprationGetter.queryProdCateg_re,
    updateProdCatg_re: enterpreiseOprationGetter.updateProdCatg_re,
    delProdCatg_re: enterpreiseOprationGetter.delProdCatg_re,
    queryTraceCatg_re: enterpreiseOprationGetter.queryTraceCatg_re,
    addLot_result: enterpreiseOprationGetter.addLot_result,
    queryLot_result: enterpreiseOprationGetter.queryLot_result,
  }
}
