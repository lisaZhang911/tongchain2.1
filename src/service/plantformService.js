// import Vue from 'vue'
var empObj = {}
const addEnterp = ( addEnterp_info ) => axios.post('/global_service/platform_admin_add_enterprise', JSON.stringify(addEnterp_info));
const queryAllEnter = (parm) => axios.post('/global_service/query_all_enterprise', JSON.stringify(parm));
const addEnterpAdmin = ( addEnterpAdmin ) => axios.post('/global_service/add_enterprise_admin', JSON.stringify(addEnterpAdmin));
const deleteEnterpAdmin = ( deletedEnterpAdminInfo ) => axios.post('/global_service/delete_enterprise_admin', JSON.stringify(deletedEnterpAdminInfo));
const searchAllEnAdmin = () => axios.post('/global_service/query_all_enterprise_admin', JSON.stringify(empObj));
const addSysInfo = (sysInfo) => axios.post('/global_service/add_system_message', JSON.stringify(sysInfo));
const delSysInfo = (infoId) => axios.post('/global_service/delete_system_message', JSON.stringify(infoId));
const addDocument = (docuInfo) => axios.post('/global_service/add_document', JSON.stringify(docuInfo));
const getDocList = () => axios.post('/global_service/query_document_list', JSON.stringify(empObj));
const docDetail =(docuId) => axios.post('/global_service/query_document', JSON.stringify(docuId));
const updateDocum = (newDocInfo) => axios.post('/global_service/update_document', JSON.stringify(newDocInfo));
const delDocum = (delDocum) => axios.post('/global_service/delete_document', JSON.stringify(delDocum));
const modifyOrder = (modifyInfo) => axios.post('/global_service/update_ticket_detail', JSON.stringify(modifyInfo));
const generate_secuCode = (secuCode) => axios.post('/global_service/make_code', JSON.stringify(secuCode));
const queryCodeList = (queryReq) => axios.post('/global_service/query_code_produce_batch_list', JSON.stringify(queryReq));
const queryPrint = (print) => axios.post('/global_service/query_batch_printing_str', JSON.stringify(print));
const scanCode = (scanInfo) => axios.post('/enterprise_service/sweep_code', JSON.stringify(scanInfo));
const getDataBaseConfig = () => axios.post('/global_service/platform_admin_list_enterprise_db',JSON.stringify(empObj));
const add_newDataBase = (newDataInfo) => axios.post('/global_service/platform_admin_add_enterprise_db', JSON.stringify(newDataInfo));
const updateNewData = (updateDataInfo) => axios.post('/global_service/platform_admin_edit_enterprise_db', JSON.stringify(updateDataInfo));
const delDataBase = (id) => axios.post('/global_service/platform_admin_del_enterprise_db', JSON.stringify(id));
const detailEnterp = (id) => axios.post('/global_service/query_enterprise',JSON.stringify(id));
const updateEnterp = (newDataInfo) => axios.post('/global_service/update_enterprise_config_info',JSON.stringify(newDataInfo));
const passCheck = (id) => axios.post('/global_service/platform_admin_audit_enterprise',JSON.stringify(id));
const delEnterp = (id) => axios.post('/global_service/platform_admin_delete_enterprise',JSON.stringify(id));
const updateEnterpAdmin = (adminInfo) => axios.post('/global_service/update_enterprise_admin',JSON.stringify(adminInfo));
const stopEnter = (enterpId) => axios.post('/global_service/ban_enterprise',JSON.stringify(enterpId));

export {
  stopEnter,
  updateEnterpAdmin,
  delEnterp,
  passCheck,
  updateEnterp,
  detailEnterp,
  delDataBase,
  updateNewData,
  add_newDataBase,
  getDataBaseConfig,
  scanCode,
  queryPrint,
  queryCodeList,
  addEnterp,
  queryAllEnter,
  addEnterpAdmin,
  deleteEnterpAdmin,
  searchAllEnAdmin,
  addSysInfo,
  delSysInfo,
  addDocument,
  getDocList,
  docDetail,
  updateDocum,
  delDocum,
  modifyOrder,
  generate_secuCode
}
