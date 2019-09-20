let strDate = Date()
let objDate = new Date()
let time = Date().split(' ')[4]
export default {
  year: () => {
    return strDate.split(' ')[3]
  },
  month: () => {
    return objDate.getMonth() + 1
  },
  eMonth: () => {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][objDate.getMonth()]
  },
  day: () => {
    return strDate.split(' ')[2]
  },
  week: () => {
    return '日一二三四五六'.charAt(objDate.getDay())
  },
  eWeek: () => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][(objDate.getDay())]
  },
  hour: () => {
    return time.split(':')[0]
  },
  min: () => {
    return time.split(':')[1]
  },
  sec: () => {
    return time.split(':')[2]
  }
}