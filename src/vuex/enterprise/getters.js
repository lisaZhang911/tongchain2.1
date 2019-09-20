import enterpStore from './store.js'

const addOrderResult = () => enterpStore.state.addOrderResult || {};
const editOrderResult = () => enterpStore.state.editOrderResult || {};
const searchProResult = () => enterpStore.state.searchProResult || [];
const searchAgenTypeResult = () => enterpStore.state.searchAgencyTypeResult || [];
const delAgenType = () => enterpStore.state.delAgenTypeResult || {};
const searchTraceResult = () => enterpStore.state.searchTraceResult || [];
const addAgent_Result = () => enterpStore.state.addAgentResult || {};
const deliGoodResult = () => enterpStore.state.deliGoodResult || {};
const circuTraceResult = () => enterpStore.state.circulTraceResult || [];
const searchCode_Result = () => enterpStore.state.searchCodeResult || [];
const addEventAuto_re = () => enterpStore.state.addEventAutho_result || {};
const delEventAuto_re = () => enterpStore.state.delEventAuto_result || {};
const queryEvent_re = () => enterpStore.state.queryEvent_result || [];
const queryEveOpetor_re = () => enterpStore.state.queryEveOpetor_result ||[];
const addProdCatg_re = () => enterpStore.state.addProdCatg_result || {};
const queryProdCateg_re = () => enterpStore.state.queryProdCateg_result || [];
const updateProdCatg_re = () => enterpStore.state.updateProdCatg_result || {};
const delProdCatg_re = () => enterpStore.state.delProdCatg_result || {};
const queryTraceCatg_re = () => enterpStore.state.queryTraceCatg_result || [];
const addLot_result = () => enterpStore.state.addLot_result || {};
const queryLot_result = () => enterpStore.state.queryLot_result || [];
const enterp_BaseInfo = () => enterpStore.state.enterpBaseInfo || {}
const get_allEnterpPrefix = () => enterpStore.state.enterpPrefix || {};
const procesor_acount = () => enterpStore.state.processorAcount || '';
const query_optionCodeList = () => enterpStore.state.optionCodeList || []
const queryCode = () => enterpStore.state.queryCode || {}

export {
  queryCode,
  query_optionCodeList,
  procesor_acount,
  get_allEnterpPrefix,
  enterp_BaseInfo,
  queryLot_result,
  addLot_result,
  queryTraceCatg_re,
  queryEveOpetor_re,
  addOrderResult,
  editOrderResult,
  searchProResult,
  searchAgenTypeResult,
  delAgenType,
  searchTraceResult,
  addAgent_Result,
  deliGoodResult,
  circuTraceResult,
  searchCode_Result,
  addEventAuto_re,
  delEventAuto_re,
  queryEvent_re,
  addProdCatg_re,
  queryProdCateg_re,
  updateProdCatg_re,
  delProdCatg_re
}
