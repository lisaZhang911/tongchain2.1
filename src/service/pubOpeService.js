// import Vue from 'vue'
var empObj = {}
const searchOrderList = (queryParam) => axios.post('/global_service/query_ticket_list', JSON.stringify(queryParam));
const getOrderDetail = (orderId) => axios.post('/global_service/query_ticket', JSON.stringify(orderId));
const searchSysInfo = (sysInfo) => axios.post('/global_service/query_system_message_list', JSON.stringify(sysInfo));
const searchSysInfoDetail = (infoId) => axios.post('/global_service/query_system_message', JSON.stringify(infoId));
const queryAgency = (param) => axios.post('/global_service/query_enterprise_agency',JSON.stringify(param));
const updateAgency = (newAgencyInfo) => axios.post('/global_service/update_enterprise_agency', JSON.stringify(newAgencyInfo));
const delAgency = (agencyId) => axios.post('/global_service/delete_enterprise_agency', JSON.stringify(agencyId));
const addProdTrace = (prodTraceInfo) => axios.post('/enterprise_service/add_production_trace_event', JSON.stringify(prodTraceInfo));
const queryProdTraceList = (lotNum) => axios.post('/enterprise_service/query_production_trace_event_list',JSON.stringify(lotNum));
const delProdTrace = (delTraceId) => axios.post('/enterprise_service/del_production_trace_event', JSON.stringify(delTraceId));
const queryCodePrefix = (enterprise_id) => axios.post('/global_service/query_code_prefix', JSON.stringify(enterprise_id));
const pre_addAgency = () => axios.post('/global_service/pre_add_enterprise_agency',JSON.stringify(empObj))
const replyOrder = (replayInfo) => axios.post('/global_service/reply_ticket',JSON.stringify(replayInfo));
const addCirculateTrace = (circulateItem) => axios.post('/enterprise_service/add_circulate_trace_event',JSON.stringify(circulateItem));
const modifyPwd = (newPwd) => axios.post('/global_service/change_enterprise_admin_password',JSON.stringify(newPwd))

export {
  modifyPwd,
  addCirculateTrace,
  replyOrder,
  pre_addAgency,
  queryCodePrefix,
  delProdTrace,
  queryProdTraceList,
  addProdTrace,
  searchOrderList,
  getOrderDetail,
  searchSysInfo,
  searchSysInfoDetail,
  queryAgency,
  updateAgency,
  delAgency
}
