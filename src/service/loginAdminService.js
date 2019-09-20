var empObj = {}
const loginUser = (userInfo) => axios.post('/global_service/platform_user_login',JSON.stringify(userInfo));
const logout_ = () => axios.post('/global_service/platform_user_logout', JSON.stringify(empObj));
const registerCode = (phone) => axios.post('/global_service/req_enterprise_regcode',JSON.stringify(phone));
const register = (registerInfo) => axios.post('/global_service/reg_enterprise',JSON.stringify(registerInfo));
const getResetCode = (param) => axios.post('/global_service/req_reset_pwd_code',JSON.stringify(param));
const findPwd = (param) => axios.post('/global_service/reset_pwd',JSON.stringify(param));

export {
  findPwd,
  getResetCode,
  register,
  registerCode,
  loginUser,
  logout_
}
