// import Vue from 'vue'
import App from './App'
import store from './store.js'
import router from './router.js'
import './http.js'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Heading from '@/components/Heading.vue'
import Buttons from '@/components/Buttons.vue'
import QurBoxTopic from '@/components/QueryBox_topic.vue'
import FormM from '@/components/form_m.vue'
Vue.config.productionTip = false
Vue.use(VueQuillEditor)
Vue.component('Heading', Heading)
Vue.component('Buttons', Buttons)
Vue.component('QurBoxTopic', QurBoxTopic)
Vue.component('FormM', FormM)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
