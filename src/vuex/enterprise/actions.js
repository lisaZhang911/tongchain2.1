import * as enterpriseService from '../../service/enterpriseService.js'

//添加工单
const addOrder = ({ commit }, addOrderInfo) => {
  return new Promise((resolve,reject) => {
    enterpriseService.addOrder(addOrderInfo).then(resp => {
      resolve(resp.data)
    },error => {
      reject(error)
    })
  })
};
//编辑工单
const editOrder = ({ commit }, editInfo) => {
  return new Promise((resolve,reject) => {
    enterpriseService.editOrder(editInfo).then(resp => {
      commit('editOrderResult', resp.data)
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//删除工单
const delOrder = ({ commit }, delInfo) => {
  return new Promise((resolve,reject) => {
    enterpriseService.delOrder(delInfo).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//添加产品
const addPro = ({ commit }, addProInfo) => {
  return new Promise((resolve,reject) => {
    enterpriseService.addPro(addProInfo).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//删除产品
const delPro = ({ commit }, delProId) => {
  return new Promise((resolve,reject) => {
    enterpriseService.delPro(delProId).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//查询企业产品
const searchPro = ({ commit },param) => {
   return new Promise((resolve,reject) => {
      enterpriseService.searchPro(param).then(resp => {
      if(resp.data.error_code==0){
        commit('searchProResult', resp.data.data.products)
      }
      resolve(resp.data)
    },error => {
      reject(error)
    })
  })
};
//更新某产品
const update_product = ({ commit }, updateInfo) => {
  return new Promise((resolve,reject) => {
    enterpriseService.update_product(updateInfo).then(resp => {
      if(resp){
        resolve(resp.data.error_msg)
      }
    },error => {
      reject(error)
    })
  })
};
//添加企业代理商类别
const addAgencyType = ({ commit }, agencyInfo) => {
   return new Promise((resolve,reject) => {
    enterpriseService.addAgencyType(agencyInfo).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//查询企业代理类别
const searchEnterpAgencyType = ({ commit }) => {
  return new Promise((resolve,reject) => {
    enterpriseService.searchEnterpAgencyType().then(resp => {
      if(resp.data){
        commit('searchEnterpAgencyType', resp.data.data.agency_categorys)
      }
      resolve()
    },error => {
      reject(error)
    })
  })
};
//删除某企业代理商类别
const delAgenType = ({ commit }, agencyId) => {
  return new Promise((resolve,reject) => {
    enterpriseService.delAgenType(agencyId).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//查询企业产品溯源信息
const searchTrace = ({ commit }, traceId) => {
  return new Promise((resolve,reject) => {
    enterpriseService.searchTrace(traceId).then(resp => {
      commit('searchTraceResult',resp.data.data.infos)
      resolve(resp.data)
    },error => {
      reject(error)
    })
  })
};
//添加企业溯源产品信息
const add_tracePro = ({ commit }, traceProInfo) => {
  return new Promise((resolve,reject) => {
    enterpriseService.addTracePro(traceProInfo).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};

//更改企业产品溯源信息
const mody_traceInfo = ({ commit }, modyTrace) => {
  return new Promise((resolve,reject) => {
    enterpriseService.mody_traceInfo(modyTrace).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//删除溯源信息
const del_traceInfo = ({commit},id) => {
  return new Promise((resolve,reject) => {
    enterpriseService.del_traceInfo(id).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//添加代理商
const add_agent = ({ commit }, addAgentInfo) => {
  return new Promise((resolve,reject) => {
    enterpriseService.add_agent(addAgentInfo).then(resp => {
        resolve(resp)
    },error => {
      reject(error)
    })
  })
};
//停用代理商
const disabelAgent = ({ commit },id) => {
  return new Promise((resolve,reject) => {
    enterpriseService.disabelAgent(id).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
}
//启用代理商
const startAgent = ({ commit },id) => {
  return new Promise((resolve,reject) => {
    enterpriseService.startAgent(id).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
}
//绑定防伪码
const bind_secuCode = ({ commit }, secuInfo) => {
  return new Promise((resolve,reject) => {
    enterpriseService.bind_secuCode(secuInfo).then(resp => {
      resolve(resp.data)
    },error => {
      reject(error)
    })
  })
};
//产品发货
const deliver_goods = ({ commit }, deliGood) => {
  return new Promise((resolve,reject) => {
    enterpriseService.deliver_goods(deliGood).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//产品收货
const take_good = ({ commit }, takeGood) => {
  return new Promise((resolve,reject) => {
    enterpriseService.take_good(takeGood).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//流通环节溯源
const circul_trace = ({ commit }, traceInfo) => {
  enterpriseService.circul_trace(traceInfo).then(( resp ) => {
    commit('circulTrace_Result', resp.data.data.infos)
  })
};
//删除流通环节溯源
const del_traceCirculate_ = ({commit},id) => {
  return new Promise((resolve,reject) => {
    enterpriseService.del_traceCirculate(id).then(resp => {
      resolve(resp.data.data.error_msg)
    },error => {
      reject(error)
    })
  })
}
//更换防伪码
const change_code = ({ commit }, changeCodeInfo) => {
  return new Promise((resolve,reject) => {
    enterpriseService.change_code(changeCodeInfo).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//查询防伪码更换记录
const search_codeRecord = ({ commit }) => {
  return new Promise((resolve,reject) => {
    enterpriseService.search_codeRecord().then(resp => {
      if(resp.data.data){
        commit('searchCodeRecord_Result', resp.data.data.history)
      }
      resolve(resp.data)
    }, error => {
      reject(error)
    })
  })
};
//添加事件操作权限
const addEventAutoInfo = ({ commit }, eventAutoInfo) => {
    enterpriseService.addEventAuthoInfo(eventAutoInfo).then(resp => {
      commit('addEventAuto_result', resp.data)
    })
};
//删除事件操作权限
const delEventAutoInfo =({ commit }, eventAutoInfo) => {
  enterpriseService.delEventAutoInfo(eventAutoInfo).then(resp => {
    commit('delEventAuto_result', resp.data)
  })
};
//查询可操作事件列表
const queryAvailEvent_ = ({ commit }, availEventAry) => {
  enterpriseService.queryAvailEvent(availEventAry).then(resp => {
    commit('queryEvent_result', resp.data.data.infos)
  })
};
//查询事件操作员列表
const queryEventOperator_ = ({commit}) => {
    enterpriseService.queryEventOperator().then(resp => {
      commit('queryEveOpetor_result', resp.data.data.processors)
    })
};
//编辑事件操作员
const updateProcesor = ({commit},procesorInfo) => {
  return new Promise((resolve,reject) => {
    enterpriseService.updateProcesor(procesorInfo).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//删除事件操作员
const delProcesor_ = ({commit},id) => {
  return new Promise((resolve,reject) => {
    enterpriseService.delProcesor(id).then(resp => {
      resolve(resp.data.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//添加产品分类
const addProductCateg_ = ({ commit },prodCategName) => {
  return new Promise((resolve,reject) => {
    enterpriseService.addProductCateg(prodCategName).then(resp => {
         resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//查询产品分类
const queryProductCateg_ = ({ commit }) => {
   return new Promise((resolve,reject) => {
     enterpriseService.queryProductCateg().then(resp => {
      if(resp.data.error_code==0){
        commit('queryProdCateg_result', resp.data.data.categorys)
      }
        resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//更新企业产品分类
const updateProductCateg_ = ({ commit }, newProdCatg) => {
  return new Promise((resolve,reject) => {
    enterpriseService.updateProductCateg(newProdCatg).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//删除企业产品分类
const delProductCateg_ = ({ commit }, delProdId) => {
  return new Promise((resolve,reject) => {
    enterpriseService.delProductCateg(delProdId).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//添加溯源类别
const addTraceCatg_ = ({ commit }, traceCatg) => {
  return new Promise((resolve,reject) => {
    enterpriseService.addTraceCatg(traceCatg).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//查询溯源类别列表
const queryTraceCatg_ = ({ commit }) => {
  enterpriseService.queryTraceCatg().then(resp => {
    commit('queryTraceCatg_result',resp.data.data.infos)
  })
};
//编辑溯源类别
const updateTraceCatg_ = ({ commit }, newTraceCateg) => {
  return new Promise((resolve,reject) => {
    enterpriseService.updateTraceCatg(newTraceCateg).then(resp => {
      resolve(resp.data.data.error_msg)
      // commit('updateTraceCatg_result', resp.data)
    },error => {
      reject(error)
    })
  })
};
//删除溯源类别
const delTraceCatg_ = ({ commit }, delTraceId) => {
  return new Promise((resolve,reject) => {
    enterpriseService.delTraceCatg(delTraceId).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//添加生产批次
const addLot_ = ({ commit }, prodLot) => {
  return new Promise((resolve,reject) => {
    enterpriseService.addLot(prodLot).then(resp => {
      resolve(resp.data)
      //commit('addLot_result', resp.data)
    },error => {
      reject(error)
    })
  })
};
//查询生产批次列表
const queryLot_ = ({ commit }, queryReq) => {
  return new Promise((resolve,reject) => {
    enterpriseService.queryLot(queryReq).then(resp => {
      if(resp.data.data){
        commit('queryLot_result', resp.data.data.infos)
      }
      resolve(resp.data)
    },error => reject(error))
  })
};
//删除生产批次
const delLot_ = ({ commit },lotId) => {
  return new Promise((resolve,reject) => {
    enterpriseService.delLot(lotId).then(resp => {
      resolve(resp.data)
    },error => {
      reject(error)
    })
  })
};
//企业实名认证
const updateEnterp_noAC = ({ commit },baseInfo) => {
  return new Promise((resolve,reject) => {
    enterpriseService.updateEnterp_noAC(baseInfo).then(resp => {
      resolve(resp)
    },error => {
      reject(error)
    })
  })
};
//设置企业前缀
const setPrefix = ({commit},prefixInfo) => {
  return new Promise((resolve,reject) => {
    enterpriseService.setPrefix(prefixInfo).then(resp => {
        resolve(resp.data.error_msg)
      },error => {
        reject(error)
      })
  })
};
//查询企业所有前缀
const getEnterp_prefix = ({commit}) => {
  enterpriseService.getEnterp_prefix().then(resp => {
    commit('get_allEnterpPrefix',resp.data.data)
  })
};
//查看企业基础信息-企业用户
const queryEnterBaseInfo = ({commit},param) => {
  return new Promise((resolve,reject) => {
    enterpriseService.queryEnterBaseInfo(param).then(resp => {
      commit('enterpBaseInfo',resp.data.data)
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//更新企业基础信息-企业用户
const updateEnterpBaseInfo = ({commit},newInfo) => {
  return new Promise((resolve,reject) => {
    enterpriseService.updateEnterpBaseInfo(newInfo).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
}
//请求添加事件操作员
const reqAddProcesor = ({commit}) => {
  return new Promise((resolve,reject) => {
    enterpriseService.reqAddProcesor().then(resp => {
      if(resp.data.error_msg){
        resolve(resp.data.error_msg)
        return
      }
      // commit('processor_account',resp.data.data.account)
      resolve(resp.data)
    },error => {
      reject(error)
    })
  })
};
//添加事件操作员
const addProcessor_ = ({commit}, newInfo) => {
  return new Promise((resolve,reject) => {
    enterpriseService.addProcessor(newInfo).then(resp => {
      resolve(resp.data)
    },error => {
      reject(error)
    })
  })
};
//更新事件操作权限
const updateEventAuthory = ({commit},param) => {
  return new Promise((resolve,reject) => {
    enterpriseService.updateEventAuthory(param).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//获取绑码/收货/发货列表
const queryOptionCode = ({commit},param) => {
  return new Promise((resolve,reject) => {
    enterpriseService.queryOptionCode(param).then(resp => {
      if(resp.data.data){
        commit('optionCodeList', resp.data.data.infos)
      }
      resolve(resp)
    }, error => {
      reject(error)
    })
  })
}
//查询防伪码/溯源码
const queryCode_trace = ({ commit },param) => {
  return new Promise((resolve,reject) => {
    enterpriseService.queryCode_trace(param).then(resp => {
      console.log(resp);
      commit('code_trace',resp.data.data)
      resolve(resp.data)
    })
  })
}
//老系统-查询溯源
const queryOptionCode_trace = ({commit},param) => {
  return new Promise((resolve,reject) => {
    enterpriseService.queryOptionCode_trace(param).then(resp => {
      console.log(resp);
      if(resp.data.data){
        commit('optionCodeList', resp.data.data.infos)
      }
      resolve(resp.data.error_msg)
    }, error => {
      reject(error)
    })
  })
}
//解除防伪码绑定
const cancel_bind = ({commit},param) => {
  return enterpriseService.cancel_bind(param)
}
//解除发货
const cancel_goods = ({commit},param) => {
  return enterpriseService.cancel_goods(param)
}
//获取微信sdk权限
const getWechat = ({commit},param) => {
  return enterpriseService.getWechat(param)
}
//获取上传图片所需配置
const getUploadPic = ({commit},param) => enterpriseService.getUploadPic(param)


export {
  queryCode_trace,
  queryOptionCode_trace,
  startAgent,
  disabelAgent,
  getWechat,
  cancel_goods,
  cancel_bind,
  queryOptionCode,
  getUploadPic,
  updateEnterpBaseInfo,
  del_traceCirculate_,
  del_traceInfo,
  updateEventAuthory,
  delProcesor_,
  updateProcesor,
  getEnterp_prefix,
  setPrefix,
  queryEnterBaseInfo,
  addProcessor_,
  reqAddProcesor,
  updateEnterp_noAC,
  delLot_,
  queryLot_,
  addLot_,
  delTraceCatg_,
  updateTraceCatg_,
  queryTraceCatg_,
  addTraceCatg_,
  queryEventOperator_,
  addOrder,
  editOrder,
  delOrder,
  addPro,
  delPro,
  searchPro,
  addAgencyType,
  searchEnterpAgencyType,
  delAgenType,
  searchTrace,
  add_tracePro,
  update_product,
  mody_traceInfo,
  add_agent,
  bind_secuCode,
  deliver_goods,
  take_good,
  circul_trace,
  change_code,
  search_codeRecord,
  addEventAutoInfo,
  delEventAutoInfo,
  queryAvailEvent_,
  addProductCateg_,
  queryProductCateg_,
  updateProductCateg_,
  delProductCateg_
}
