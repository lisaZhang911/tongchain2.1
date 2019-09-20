// import Vue from 'vue'
// import Vuex from 'vuex'

// import { getMock } from '@/api/mock'

// Vue.use(Vuex)
import login_store from './vuex/login/store.js'
import enterprise_store from './vuex/enterprise/store.js'
import plantform_store from './vuex/plantform/store.js'
import publicOper_store from './vuex/publicOperation/store.js'

var client = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
export default new Vuex.Store({
  state: {
    // mock: null,
    isPC: client?false:true
  },
  getters: {
    // mock: state => state.mock,
    isPC: state => state.isPC
  },
  mutations: {
    // SET_MOCK: (state, mock) => state.mock = mock,
    SET_IS_PC: (state, isPC) => {
      // console.log(isPC);
      // localStorage.setItem('isPC',isPC)
      state.isPC = isPC
    }
  },
  actions: {
    // setMock: ({
    //   commit,
    //   state
    // }) => {
    //   getMock().then(response => {
    //     // console.log(response)
    //     commit('SET_MOCK', state.mock || response.data)
    //   }, exception => {
    //     // console.log(exception)
    //   })
    // }
  },
  modules: {
    login_store,
    enterprise_store,
    plantform_store,
    publicOper_store
  }
})
