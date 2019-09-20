import * as loginAdminService from '../../service/loginAdminService.js'

//登录
const login_user = ({ commit }, userInfo) => {
  return new Promise((resolve,reject) => {
    loginAdminService.loginUser(userInfo).then(resp => {
      if(resp.data.error_code==0){
        localStorage.setItem("data_id",resp.headers.data_id)
        localStorage.setItem("user_type",resp.data.data.user_type)
        localStorage.setItem('user_name',userInfo.account)
        if(resp.data.data.authority){
          localStorage.setItem("authory",JSON.stringify(resp.data.data.authority))
        }
        commit('setDataId_cookie',resp.headers.data_id)
        localStorage.setItem("password",userInfo.password)
      }
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//退出
const logout_ = ({ commit } ) => {
  return new Promise((resolve,reject) => {
    loginAdminService.logout_().then(resp => {
      commit('clearDataId')
      resolve()
    },error => {
      reject(error)
    })
  })
};
//请求企业注册码
const registerCode_enterp = ({commit},phone) => {
  return new Promise((resolve,reject) => {
    loginAdminService.registerCode(phone).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//获取重置码
const getResetCode = ({commit},param) => {
  return new Promise((resolve,reject) => {
    loginAdminService.getResetCode(param).then(resp => {
      resolve(resp.data.error_msg)
    },error => reject(error))
  })
}
//重置密码
const findPwd = ({commit},param) => {
  return new Promise((resolve,reject) => {
    loginAdminService.findPwd(param).then(resp => {
      resolve(resp.data.error_msg)
    },error => reject(error))
  })
}
//企业注册
const register_enterp = ({commit},registerInfo) => {
  return new Promise((resolve,reject) => {
    loginAdminService.register(registerInfo).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};

export {
  findPwd,
  getResetCode,
  register_enterp,
  registerCode_enterp,
  login_user,
  logout_
}
