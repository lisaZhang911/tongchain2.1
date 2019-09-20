var obj = {
  changeStatus:function(statusNum){
    switch (statusNum) {
      case 1:
        return '平台处理中'
        break;
      case 2:
        return '企业处理中'
        break;
      case 3:
        return '正常结束'
        break;
      case 4:
        return '强制结束'
        break;
    }
  },
  changeType:function(statusNum){
    switch (statusNum) {
      case 1:
        return '平台使用问题'
        break;
      case 2:
        return '需要生成防伪码标签'
        break;
      case 3:
        return '系统bug汇报'
        break;
      case 4:
        return '其他问题'
        break;
    }
  },
  changeNewDetail:function(statusNum){
    switch (statusNum) {
      case 0:
        return '无更新'
        break;
      case 1:
        return '针对平台有更新'
        break;
      case 2:
        return '针对企业有更新'
        break;
    }
  }
}

export default obj
