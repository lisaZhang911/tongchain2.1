// import axios from 'axios'
import store from './store.js'
import Router from './router.js'

// axios.defaults.baseURL='http://101.132.40.18:8080'
axios.defaults.baseURL='//www.315chain.com/api'
axios.defaults.timeout = 180000

axios.interceptors.request.use(
  config => {
    if(localStorage.getItem('data_id')){
      config.headers.data_id = localStorage.getItem('data_id')
      return config
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  response => {
    if(response.data.error_msg){
      if(response.data.error_code == 1 && response.data.error_msg.indexOf('未登陆') != -1){
        store.commit('clearDataId')
        Router.replace({
          path: '/login'
        })
      }
    }
    return response
  },
  error => {
    if(error.message.includes('timeout')){
      console.log("错误回调", error)
      return Promise.reject(error)
    }
    return error
  }
)
export default axios
