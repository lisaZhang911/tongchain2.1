import * as plantformService from '../../service/plantformService.js'

//添加企业
const addEnterp = ({ commit }, addEnterp_info) => {
   plantformService.addEnterp( addEnterp_info ).then(( resp ) => {
     commit('getAddEnterpResult',resp.data)
   })
};
//查询所有企业列表
const queryAllEnter = ({ commit }, parm) => {
  var enterpList_stop = []
  var enterpList_avail = []

  return new Promise((resolve,reject) => {
    plantformService.queryAllEnter(parm).then(resp => {
      var enterpList = resp.data.data.enterprises
      //保留所有
      commit('getAllEnterp',enterpList)

      if(enterpList){
          enterpList.forEach((val) =>{
             if(val.ban){
               // enterpList.splice(index,1)
               enterpList_stop.push(val)
             } else {
               enterpList_avail.push(val)
             }
         })
             //储存停用
         commit('getAllEnterp_stop',enterpList_stop)
           // 储存可用
         commit('getAllEnterp_avail',enterpList)
         resolve(enterpList)
      } else {
         resolve()
      }
         // commit('getAllEnterp',[])
         // resolve(resp.data.error_msg)
    },error => {
      reject(error)
   })
  })
};
//添加企业管理员
const addEnterpAdmin = ({ commit }, addEnterpAdmin) => {
  return new Promise((resolve,reject) => {
    plantformService.addEnterpAdmin( addEnterpAdmin ).then(resp => {
      resolve(resp)
    },error => {
      reject(error)
    })
  })
};
//删除企业管理员
const delete_enterpAdmin= ({ commit }, enterpInfo) => {
  return new Promise((resolve,reject) => {
    plantformService.deleteEnterpAdmin(enterpInfo).then(resp => {
      resolve(resp.data.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//编辑企业管理员
const update_enterpAdmin = ({commit},adminInfo) => {
  return new Promise((resolve,reject) => {
    plantformService.updateEnterpAdmin(adminInfo).then(resp => {
      resolve(resp.data.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//查询所有管理员
const search_allEnterpAdmin = ({ commit }) => {
  return new Promise((resolve,reject) => {
    plantformService.searchAllEnAdmin().then(resp => {
      commit('searchEnAdminResult',resp.data.data.admins)
      resolve()
    },error => {
      reject(error)
    })
  })
};
//添加系统消息
const add_sysInfo = ({ commit }, sysInfo) => {
  console.log('action');
  return plantformService.addSysInfo(sysInfo)
};
//删除系统消息
const del_sysInfo = ({ commit }, infoId) => {
  return new Promise((resolve,reject) => {
    plantformService.delSysInfo(infoId).then(resp => {
      resolve(resp.data);
    },error => {
      reject(error)
    })
  })
};
//添加文档
const add_document = ({ commit }, docuInfo) => {
  plantformService.addDocument(docuInfo).then(( resp ) => {
    commit('addDocuResult', resp.data)
  })
};
//查询文档列表
const docList = ({ commit }) => {
  plantformService.getDocList().then(( resp ) => {
    commit('getDocList', resp.data)
  })
}
//查询文档详情
const docDetail = ({ commit }, docId) => {
  plantformService.docDetail(docId).then(( resp ) => {
    commit('docDetailResult', resp.data)
  })
};
//更新文档
const updateDocum = ({ commit }, newDocInfo) => {
  plantformService.updateDocum(newDocInfo).then(( resp ) => {
    commit('updateDocResult',resp.data)
  })
};
//删除文档
const delDocum = ({ commit }, delDocuId) => {
  plantformService.delDocum(delDocuId).then(( resp ) => {
    commit('delDocuResult', resp.data)
  })
};
//修改工单
const modifyOrder = ({ commit }, modifyInfo) => {
  return new Promise((resolve,reject) => {
    plantformService.modifyOrder(modifyInfo).then(resp => {
      resolve(resp.data.error_msg)
      //commit('modifyOrderResult', resp.data)
    },error => {
      reject(error)
    })
  })
};
//生成防伪码
const generate_secuCode = ({ commit }, secuCode) => {
  return new Promise((resolve,reject) => {
    plantformService.generate_secuCode(secuCode).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//查询防伪码生成列表
const queryCodeList_ = ({ commit }, queryReq) => {
  return new Promise((resolve,reject) => {
    plantformService.queryCodeList(queryReq).then(resp => {
      commit('codeList',resp.data.data.infos)
      resolve(resp)
    },error => {
      reject(error)
    })
  })
};
//查询某批次印刷格式
const queryPrint_ = ({ commit }, print) => {
  return new Promise((resolve,reject) => {
    plantformService.queryPrint(print).then((resp) => {
      commit('print_list', resp.data.data)
      resolve(resp.data.error_msg)
    })
  })
};
//客户端扫码
const scanCode_ = ({ commit }, scanInfo) => {
  plantformService.scanCode(scanInfo).then((resp) => {
    commit('clienScan_result', resp.data)
  })
};
//获取数据库配置
const getDataBaseConfig = ({ commit }) => {
  return new Promise((resolve,reject) => {
    plantformService.getDataBaseConfig().then(resp => {
      commit('dataBaseList',resp.data.data.infos)
      resolve(resp.data.error_msg)
    },error => reject(error))
  })
};
//新增数据库配置
const add_newDataBase = ({ commit }, newDataInfo) => {
  return new Promise((resolve,reject) => {
    plantformService.add_newDataBase(newDataInfo).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject(error)
    })
  })
};
//修改数据库配置
const updateNewData = ({commit}, updateDataInfo) => {
  return new Promise((resolve,reject) => {
    plantformService.updateNewData(updateDataInfo).then(resp => {
      resolve(resp)
    },error => {
      reject(error)
    })
  })
};
//删除数据库配置
const delDataBase = ({commit},id) => {
  return new Promise((resolve,reject) => {
    plantformService.delDataBase(id).then(resp => {
      if(resp.success){
        resolve()
      }
    },error => {
      reject(error)
    })
  })
};
//获取企业详情
const detailEnterp_ = ({commit},id) => {
  return new Promise((resolve,reject) => {
    plantformService.detailEnterp(id).then(resp => {
        if(resp.data.error_code==0){
          commit('enterpDetail',resp.data.data)
          resolve(resp.data.error_msg)
        }
    },error => {
      reject(error)
    })
  })
};
//编辑企业信息
const updateEnterp_ = ({commit},enterpNewInfo) => {
  return new Promise((resolve,reject) => {
    plantformService.updateEnterp(enterpNewInfo).then(resp => {
      resolve(resp.data.error_msg)
    },error => {
      reject()
    })
  })
};
//停用企业
const stopEnter_ = ({commit},enterpId) => {
  return new Promise((resolve,reject) => {
    plantformService.stopEnter(enterpId).then(resp => {
      resolve(resp)
    },error => {
      reject(error)
    })
  })
};
//通过审核
const passCheck = ({commit},id) => {
    return plantformService.passCheck(id)
};
//删除企业
const delEnterp_ =({commit},id) => {
   return plantformService.delEnterp(id)
}

export {
  stopEnter_,
  update_enterpAdmin,
  delEnterp_,
  passCheck,
  detailEnterp_,
  updateEnterp_,
  delDataBase,
  updateNewData,
  add_newDataBase,
  getDataBaseConfig,
  scanCode_,
  queryPrint_,
  queryCodeList_,
  addEnterp,
  queryAllEnter,
  addEnterpAdmin,
  delete_enterpAdmin,
  search_allEnterpAdmin,
  add_sysInfo,
  del_sysInfo,
  add_document,
  docList,
  docDetail,
  updateDocum,
  delDocum,
  modifyOrder,
  generate_secuCode
}
