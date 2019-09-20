import plantformStore from './store.js'

const getAddEnterpResult = () => plantformStore.state.addEnterpResult || {};
const getAllEnterpAvail = () => plantformStore.state.getAllEnterp_avail || [];
const getAllEnterpList = () => plantformStore.state.allEnterpList || [];
const getStopEnterpList = () => plantformStore.state.stop_enterp || [];
const getSearchEnAdminResult = () => plantformStore.state.searchAllEnAdminResult || [];
const getAddDocResult = () => plantformStore.state.addDocuResult || {};
const getDocList = () => plantformStore.state.searchDocListResult || {};
const getDocDetailResult = () => plantformStore.state.docDetailResult || {};
const updateDocResult = () => plantformStore.state.updateDocResult || {};
const delDocResult = () => plantformStore.state.delDocResult || {};
const modifyOrderResult = () => plantformStore.state.modifyOrderResult || {};
const geneSecuResult = () => plantformStore.state.generatSecuCode || {};
const addCodePre_re = () => plantformStore.state.addCodePre_result || {};
const queryCodeList_result  = () => plantformStore.state.queryCodeList_result || {};
const printList = () => plantformStore.state.printList || [];
const clienScan_result = () => plantformStore.state.clienScan_result || {};
const dataBaseList_store = () => plantformStore.state.dataBaseList || [];
const enterpDetail_store = () => plantformStore.state.detailEnterp || {};
const getCodeList = () => plantformStore.state.codeList || [];

export {
  getAllEnterpAvail,
  getStopEnterpList,
  getCodeList,
  enterpDetail_store,
  dataBaseList_store,
  clienScan_result,
  printList,
  queryCodeList_result,
  addCodePre_re,
  getAddEnterpResult,
  getAllEnterpList,
  getSearchEnAdminResult,
  getDelSysInfoResult,
  getAddDocResult,
  getDocList,
  getDocDetailResult,
  updateDocResult,
  delDocResult,
  modifyOrderResult,
  geneSecuResult
}
