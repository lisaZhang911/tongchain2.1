import adminLoginStore from './store.js'

const login_admin_getter = () => adminLoginStore.state.adminLoginState || {};
const loginEnterp_admin = () => adminLoginStore.state.enterpLoginState || {};
const loginAgent_Result = () => adminLoginStore.state.agentLoginResult || {};
const getDataId = () => adminLoginStore.state.data_id;

export {
  login_admin_getter,
  loginEnterp_admin,
  loginAgent_Result,
  getDataId
}
