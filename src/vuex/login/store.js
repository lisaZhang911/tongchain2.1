import * as login_operation_actions from './actions.js'
import * as login_operation_getter from './getters.js'

export default {
  state: {
    adminLoginState: {},
    enterpLoginState: {},
    agentLoginResult: {},
    data_id:'',
  },
  mutations: {
    // change_adminLoginState(state,loginResp){
    //   state.adminLoginState = loginResp
    // },
    // change_enterpLoginState(state,enterpLoginResp){
    //   state.enterpLoginState = enterpLoginResp
    // },
    login_user(state, val){
      state.agentLoginResult = val
    },
    setDataId_cookie(state,dataId){
      state.data_id = dataId
    },
    clearDataId(state){
      state.data_id = '';
      localStorage.clear();
      // console.log(localStorage.getItem('isPC'));
      //console.log(localStorage.getItem('data_id'));
    },
  },
  actions: {
    login_user: login_operation_actions.login_user,
    logout_: login_operation_actions.logout_,
    registerCode_enterp: login_operation_actions.registerCode_enterp,
    register_enterp: login_operation_actions.register_enterp,
    getResetCode: login_operation_actions.getResetCode,
    findPwd: login_operation_actions.findPwd
  },
  getters: {
    loginAdmin_getter: login_operation_getter.login_admin_getter,
    loginEnterpAdmin_getter: login_operation_getter.loginEnterp_admin,
    loginAgent_Result: login_operation_getter.loginAgent_Result,
    getDataId: login_operation_getter.getDataId,
  }
}
