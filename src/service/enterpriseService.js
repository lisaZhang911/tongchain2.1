import publicFunc from '../utils/public.js'

var empObj = {}
const queryCode_trace = (param) => axios.post('/enterprise_service/sweep_code',JSON.stringify(param))
const startAgent = (id) => axios.post('/global_service/active_enterprise_agency',JSON.stringify(id))
const disabelAgent = (id) => axios.post('/global_service/disable_enterprise_agency', JSON.stringify(id))
const addOrder = (addOrderInfo) => axios.post('/global_service/create_ticket', JSON.stringify(addOrderInfo));
const delOrder = (delInfo) => axios.post('/global_service/delete_ticket', JSON.stringify(delInfo));
const editOrder = (editInfo) => axios.post('/global_service/editor_ticket', JSON.stringify(editInfo));
const addPro = (addProInfo) => axios.post('/enterprise_service/add_enterprise_product',JSON.stringify(addProInfo));
const delPro = (delProInfo) => axios.post('/enterprise_service/del_enterprise_product', JSON.stringify(delProInfo));
const searchPro = (param) => axios.post('/enterprise_service/query_enterprise_product', JSON.stringify(param));
const addAgencyType = (agencyInfo) => axios.post('/enterprise_service/add_enterprise_agency_category', JSON.stringify(agencyInfo));
const searchEnterpAgencyType = () => axios.post('/enterprise_service/query_enterprise_agency_category',JSON.stringify(empObj));
const delAgenType = (agencyId) => axios.post('/enterprise_service/delete_enterprise_agency_category', JSON.stringify(agencyId));
const searchTrace = (traceId) => axios.post('/enterprise_service/query_product_trace_info', JSON.stringify(traceId));
const addTracePro = (traceProInfo) => axios.post('/enterprise_service/add_product_trace_info', JSON.stringify(traceProInfo));
const update_product = (updateInfo) => axios.post('/enterprise_service/update_enterprise_product', JSON.stringify(updateInfo));
const mody_traceInfo = (modyTraceInfo) => axios.post('/enterprise_service/update_product_trace_info', JSON.stringify(modyTraceInfo));
const add_agent = (addAgentInfo) => axios.post('/global_service/add_enterprise_agency', JSON.stringify(addAgentInfo));
const bind_secuCode = (secuInfo) => axios.post('/enterprise_service/bind_product_code', JSON.stringify(secuInfo));
const deliver_goods = (deliGood) => axios.post('/enterprise_service/deliver_product', JSON.stringify(deliGood));
const take_good = (takeGood) => axios.post('/enterprise_service/take_product', JSON.stringify(takeGood));
const circul_trace = (traceInfo) => axios.post('/enterprise_service/query_circulate_trace_event_list', JSON.stringify(traceInfo));
const change_code = (changeCodeInfo) => axios.post('/enterprise_service/change_sub_code', JSON.stringify(changeCodeInfo));
const search_codeRecord = () => axios.post('/enterprise_service/query_change_sub_code_history',JSON.stringify(empObj));
const addEventAuthoInfo = (eventAutoInfo) => axios.post('/global_service/add_processor_event', JSON.stringify(eventAutoInfo));
const delEventAutoInfo = (eventAutoInfo) => axios.post('/global_service/del_processor_event', JSON.stringify(eventAutoInfo));
const queryAvailEvent = (availEventAry) => axios.post('/enterprise_service/query_processor_event', JSON.stringify(availEventAry));
const queryEventOperator = () => axios.post('/global_service/query_all_enterprise_ep', JSON.stringify(empObj));
const addProductCateg = (prodCategName) => axios.post('/enterprise_service/add_enterprise_product_category', JSON.stringify(prodCategName));
const queryProductCateg = () => axios.post('/enterprise_service/query_enterprise_product_category',JSON.stringify(empObj));
const updateProductCateg = (newProdCatg) => axios.post('/enterprise_service/update_enterprise_product_category', JSON.stringify(newProdCatg));
const delProductCateg = (delProId) => axios.post('/enterprise_service/delete_enterprise_product_category', JSON.stringify(delProId));
const addTraceCatg = (traceCatg) => axios.post('/enterprise_service/add_product_trace_event', JSON.stringify(traceCatg));
const queryTraceCatg = () => axios.post('/enterprise_service/query_product_trace_event',JSON.stringify(empObj));
const updateTraceCatg = (newTraceCateg) => axios.post('/enterprise_service/update_product_trace_event', JSON.stringify(newTraceCateg));
const delTraceCatg = (delTraceId) => axios.post('/enterprise_service/delete_product_trace_event', JSON.stringify(delTraceId));
const addLot = (prodLot) => axios.post('/enterprise_service/add_production_link_lot', JSON.stringify(prodLot));
const queryLot = (queryReq) => axios.post('/enterprise_service/query_production_link_lot', JSON.stringify(queryReq));
const delLot = (lotId) => axios.post('/enterprise_service/del_production_link_lot', JSON.stringify(lotId));
const updateEnterp_noAC = (baseInfo) => axios.post('/global_service/update_enterprise_audit_info',JSON.stringify(baseInfo));
const reqAddProcesor = () => axios.post('/global_service/pre_add_enterprise_ep',JSON.stringify(empObj));
const addProcessor = (newInfo) => axios.post('/global_service/add_enterprise_ep', JSON.stringify(newInfo));
const queryEnterBaseInfo = (param) => axios.post('/global_service/query_enterprise_base_info',JSON.stringify(param));
const setPrefix = (prefixInfo) => axios.post('/global_service/update_enterprise_prefix',JSON.stringify(prefixInfo));
const getEnterp_prefix = () => axios.post('/global_service/query_enterprise_prefix',JSON.stringify(empObj));
const updateProcesor = (procesorInfo) => axios.post('/global_service/update_enterprise_ep',JSON.stringify(procesorInfo));
const delProcesor = (id) => axios.post('/global_service/delete_enterprise_ep',JSON.stringify(id));
const updateEventAuthory = (param) => axios.post('/enterprise_service/update_processor_event',JSON.stringify(param));
const del_traceInfo = (id) => axios.post('/enterprise_service/del_product_trace_info',JSON.stringify(id));
const del_traceCirculate = (id) => axios.post('/enterprise_service/del_circulate_trace_event',JSON.stringify(id));
const updateEnterpBaseInfo = (newInfo) => axios.post('/global_service/update_enterprise_base_info',JSON.stringify(newInfo));
const getUploadPic = (param) => axios.post('/global_service/request_upload_pic',JSON.stringify(param));
const queryOptionCode = (param) =>  axios.post('/enterprise_service/query_code_bind_deliver_take_list',JSON.stringify(param))
const queryOptionCode_trace = (param) => axios.post('/enterprise_service/query_code_bind_deliver_take_list',JSON.stringify(param))
const  cancel_bind = (param) => axios.post('/enterprise_service/unbind_product_code',JSON.stringify(param))
const cancel_goods = (param) => axios.post('/enterprise_service/undeliver_product',JSON.stringify(param))
const getWechat = (param) => axios.get(`//www.315chain.com/apps/wap_afk/wechat_dev/wx.php?url=${param.url}`)

export {
  queryOptionCode_trace,
  queryOptionCode_old,
  addCircuTrace_old,
  addTracePrOld,
  queryLotOld_,
  _old,
  opProcesor_old,
  change_code_old,
  takeGood_old,
  deliver_goods_old,
  bind_secuCode_old,
  opAge_old,
  addTrace_old,
  startAgent,
  disabelAgent,
  addAgen_old,
  updatePro_old,
  addPro_old,
  bind_secuCode_old_trace,
  delPro_old,
  getWechat,
  queryCode_trace,
  cancel_goods,
  cancel_bind,
  queryOptionCode,
  getUploadPic,
  updateEnterpBaseInfo,
  del_traceCirculate,
  del_traceInfo,
  updateEventAuthory,
  delProcesor,
  updateProcesor,
  getEnterp_prefix,
  setPrefix,
  queryEnterBaseInfo,
  addProcessor,
  reqAddProcesor,
  updateEnterp_noAC,
  delLot,
  queryLot,
  addLot,
  delTraceCatg,
  updateTraceCatg,
  queryTraceCatg,
  addTraceCatg,
  addOrder,
  delOrder,
  editOrder,
  addPro,
  delPro,
  searchPro,
  addAgencyType,
  searchEnterpAgencyType,
  delAgenType,
  searchTrace,
  addTracePro,
  update_product,
  mody_traceInfo,
  add_agent,
  bind_secuCode,
  deliver_goods,
  take_good,
  circul_trace,
  change_code,
  search_codeRecord,
  addEventAuthoInfo,
  delEventAutoInfo,
  queryAvailEvent,
  queryEventOperator,
  addProductCateg,
  queryProductCateg,
  updateProductCateg,
  delProductCateg
}
