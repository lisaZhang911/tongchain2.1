import router from '../router.js'
let timer
export default {
  savePath: (path) => {
    localStorage.setItem('path',path)
  },
  goback: () => {
    router.replace(localStorage.getItem('path'))
  },
  toSearchPage: () => {
    localStorage.setItem('path',router.currentRoute.fullPath)
    router.replace('/mob_searchPage')
  },
  change_enterpType: function(num){
    switch (num) {
      case 0:
        return '等待提交'
        break;
      case 1:
        return '等待审核'
        break;
      case 2:
        return '审核未通过'
        break;
      case 3:
        return '审核通过'
        break;
    }
  },
  change_traceType: function(num){
    switch (num) {
      case 1:
        return '原材料'
        break;
      case 2:
        return '检验报告'
        break;
      case 3:
        return '生产环节信息'
        break;
    }
  },
  change_circulType: function(num){
      switch (num) {
        case 1:
          return '流通环节'
          break;
        case 2:
          return '生产环节'
          break;
      }
  },
  change_baseInfo_type:function(num){
    switch(num){
      case 1:
        return '营业执照图片'
        break;
      case 101:
        return '企业logo'
        break;
      case 2:
        return '所属国家'
        break;
      case 3:
        return '所属省份'
        break;
      case 4:
        return '所属市'
        break;
      case 5:
        return '详细地址'
        break;
      case 6:
        return '社会信用代码'
        break;
      case 7:
        return '联系人'
        break;
      case 8:
        return '联系电话'
        break;
      case 9:
        return '未通过审核原因'
        break;
    }
  },
 //  debounce:function(func, delay) {
 //    return function (...args) {
 //      if (timer) {
 //        clearTimeout(timer)
 //      }
 //      timer = setTimeout(() => {
 //        func.apply(this, args)
 //      }, delay)
 //   }
 // },
 debounce:function(func,delay){
   if(timer){
     clearTimeout(timer)
   }
   timer = setTimeout(func,delay)
},
  validateForm:function(name,func,formFunc){
      this.$refs[name].validate((valid) => {
        if(!valid){
          this.$Message.warning('请填写所有必填项')
          this.$nextTick(() => {
            formFunc()
          })
        } else {
          func()
        }
      })
  },
  verifyPwd:function(str){
    var pattern = /^(?![^a-zA-Z]+$)(?!\D+$)/
    var result = pattern.test(str)
    return result
  },
  verifyPhone:function(str){
    var pattern =/^[1][3,4,5,7,8,9]\d{9}$/
    var result = pattern.test(str)
    return result
  },
  verifyCode: function(str){
    var pattern = /^(A\d{15}\b)|(A\d{13}\b)$/
    var result = pattern.test(str)
    return result
  },
  verifyOldCode:function(str){
    var pattern = /^(\b\d{16}\b)|(\b\d{14}\b)$/
    var result = pattern.test(str)
    return result
  },
  get_suffix(filename) {
      var pos = filename.lastIndexOf('.')
      var suffix = ''
      if (pos != -1) {
          suffix = filename.substring(pos)
      }
      return suffix;
  },
  random_string(len) {
  　　len = len || 32;
  　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  　　var maxPos = chars.length;
  　　var pwd = '';
  　　for (var i = 0; i < len; i++) {
      　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
  }
}
