import * as pubOperateService from '../../service/pubOpeService.js'

//查询工单列表
const searchOrderList = ({ commit },queryParam) => {
  return new Promise((resolve,reject) => {
    pubOperateService.searchOrderList(queryParam).then(( resp ) => {
      if(resp.data){
        commit('searchOrderList', resp.data.data.tickets)
      }
      resolve()
    },error => {
      reject(error)
    })
  })
};
//查询工单详情
const getOrderDetail = ({ commit }, orderId) => {
  return new Promise((resolve,reject) => {
    pubOperateService.getOrderDetail(orderId).then(resp => {
      console.log(resp);
      resolve(resp.data.data.Details)
      // commit('orderDetail', resp.data.data.Details)
    },error => {
      reject(error)
    })
  })
};
//回复工单
const replyOrder_ =({commit},replayInfo) => {
  return new Promise((resolve,reject) => {
    pubOperateService.replyOrder(replayInfo).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//查询系统信息列表
const search_sysInfoList = ({ commit }, sysInfo) => {
  return new Promise((resolve,reject) => {
    pubOperateService.searchSysInfo(sysInfo).then(resp => {
     commit('searchSysInfoListResult',resp.data.data.messages)
     resolve(resp)
   },error => {
     reject(error)
   })
 })
};
//查询系统消息详情
const search_sysInfoDetail = ({ commit }, infoId) => {
  return new Promise((resolve,reject) => {
    pubOperateService.searchSysInfoDetail(infoId).then(resp => {
      commit('sysInfoDetailResult', resp.data.data)
      resolve()
    },error => {
      reject(error)
    })
  })
};
//请求添加代理商
const pre_addAgency = ({commit}) => {
  return new Promise((resolve,reject) => {
    pubOperateService.pre_addAgency().then(resp => {
      resolve(resp.data.data)
    },error => {
      reject(error)
    })
  })
};
//查看代理商列表
const queryAgency_ = ({ commit },param) => {
  return new Promise((resolve,reject) => {
    pubOperateService.queryAgency(param).then(resp => {
      commit('queryAgency_result', resp.data.data.agencys)
      resolve(resp.data)
    },error => {
      reject(error)
    })
  })
};
//编辑代理商
const updateAgency_ = ({ commit }, newAgencyInfo) => {
  return new Promise((resolve,reject) => {
    pubOperateService.updateAgency(newAgencyInfo).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//删除代理商
const delAgency_ = ({ commit }, agencyId) => {
  return new Promise((resolve,reject) => {
    pubOperateService.delAgency(agencyId).then(resp => {
      resolve(resp.data.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//添加生产环节溯源事件
const addProdTrace_ = ({ commit }, prodTraceInfo) => {
  return new Promise((resolve,reject) => {
    pubOperateService.addProdTrace(prodTraceInfo).then(resp => {
      resolve(resp.data)
    },error => {
      reject(error)
    })
  })
};
//查询生产环节溯源事件列表
const queryProdTraceList_ = ({ commit },lotNum) => {
  pubOperateService.queryProdTraceList(lotNum).then((resp) => {
    commit('query_ProdTraceList_result', resp.data.data.infos)
  })
};
//删除生产环节溯源事件
const delProdTrace_ = ({ commit },delProdTrace) => {
  return new Promise((resolve,reject) => {
    pubOperateService.delProdTrace(delProdTrace).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//添加流通环节溯源事件
const addCirculateTrace = ({commit},circulateItem) => {
  return new Promise((resolve,reject) => {
    pubOperateService.addCirculateTrace(circulateItem).then(resp => {
      commit('addCirculate_result',resp.data.data.results)
      resolve(resp.data.error_msg)
    },error => reject(error))
  })
};
//查询企业防伪码前缀
const queryCodePrefix_ = ({ commit }, enterprise_id) => {
  return new Promise((resolve,reject) => {
    pubOperateService.queryCodePrefix(enterprise_id).then(resp => {
      if(resp.data.error_code==0){
        commit('queryCodePrefix_result', resp.data.data)
        resolve(resp.data.error_msg)
      }
    },error => {
      reject(error)
    })
  })
};
//修改密码
const modifyPwd = ({commit},newPwd) => {
  return new Promise((resolve,reject) => {
    pubOperateService.modifyPwd(newPwd).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};

export {
  modifyPwd,
  addCirculateTrace,
  replyOrder_,
  pre_addAgency,
  delProdTrace_,
  queryProdTraceList_,
  addProdTrace_,
  searchOrderList,
  getOrderDetail,
  search_sysInfoList,
  search_sysInfoDetail,
  queryAgency_,
  updateAgency_,
  delAgency_,
  queryCodePrefix_
}
