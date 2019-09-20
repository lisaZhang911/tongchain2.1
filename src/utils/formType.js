const orderStatus = [
  {
    label:"平台处理",
    value:1
  },
  {
    label:"企业处理",
    value:2
  },
  {
    label:"正常结束",
    value:3
  },
  {
    label:"强制结束",
    value:4
  }
]

const orderType = [
  {
    label:"平台使用问题",
    value:1
  },
  {
    label:"防伪码标签",
    value:2
  },
  {
    label:"系统bug汇报",
    value:3
  },
  {
    label:"其他问题",
    value:4
  }
]

const newDetail = [
  {
    label:'无更新',
    value:0
  },
  {
    label:'针对平台有更新',
    value:1
  },
  {
    label:'针对企业有更新',
    value:2
  }
]

const batchType = [
  {
    label:'查询同批次',
    value: 1
  },
  {
    label:'查询不同批次',
    value: 0
  }
]

const infoType = [{
    label:'系统消息',
    value:1
  }]

  const enterpTypeChoose = [{
    label: '待提交',
    value: 0
  },{
    label: '待审核',
    value: 1
  },{
    label: '未通过',
    value: 2
  },{
    label: '通过',
    value: 3
  }]

  const infoTypeList = [{
          label:'原材料',
          id:1
        },{
          label:'检验报告',
          id:2
        },{
          label:'生产环节信息',
          id:3
      }]

  const circulTypeList = [{
        label:'流通环节',
        id:1
      },{
        label:'生产环节',
        id:2
      }]

export {
  orderStatus,
  orderType,
  newDetail,
  batchType,
  infoType,
  enterpTypeChoose,
  infoTypeList,
  circulTypeList
}
