import pubOperateStore from './store.js'

const getOrderWorkList = () => pubOperateStore.state.workOrderList || [];
const orderDetail = () => pubOperateStore.state.orderDetail || {};
const getSearchSysInfoListResult = () => pubOperateStore.state.searchSysInfoListResult || [];
const getSysInfoResult = () => pubOperateStore.state.sysInfoResult || {};
const queryAgency_re = () => pubOperateStore.state.queryAgency_result || [];
const query_ProdTraceList_re = () => pubOperateStore.state.query_ProdTraceList_result || [];
const queryCodePrefix_re = () => pubOperateStore.state.queryCodePrefix_result || {};
const addCirculate_result = () => pubOperateStore.state.addCirculate_result || [];

export {
  addCirculate_result,
  queryCodePrefix_re,
  query_ProdTraceList_re,
  getOrderWorkList,
  orderDetail,
  getSearchSysInfoListResult,
  getSysInfoResult,
  queryAgency_re,
}
