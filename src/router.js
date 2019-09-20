// import Vue from 'vue'
// import Router from 'vue-router'
import loginStore from './vuex/login/store.js'

// Vue.use(Router)

const routes = [{
  path: '/',
  redirect: '/login'
 },
 {
  path: '/login',
  component: resolve => require(['@/views/login'], resolve),
 },{
  path: '/loginAdmin',
  component: resolve => require(['@/views/loginAdmin'], resolve),
},{
  path: '/homepage',
  component: resolve => require(['@/views/Index'], resolve),
  children: [{
    path: '/welcome',
    component: resolve => require(['@/views/Welcome'], resolve),
    meta: { requiresAuth: true }
  }, {
    path: '/produce/1-1/view_and_add_product',
    component: resolve => require(['@/views/security/1-1/ViewAndAddProduct'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/produce/1-1/prodCatg',
    component: resolve => require(['@/views/security/1-1/prodCatg'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/setting/upEnterpInfo',
    component: resolve => require(['@/views/noAc_upEnterpInfo'], resolve),
    meta: { requiresAuth: true }
  }, {
    path: '/security/1-2/view_and_add_agent',
    component: resolve => require(['@/views/security/1-2/ViewAndAddAgent'], resolve),
    meta: { requiresAuth: true }
  }, {
    path: '/security/1-2/agentCatg',
    component: resolve => require(['@/views/security/1-2/agentCatg'], resolve),
    meta: { requiresAuth: true }
  }, {
    path: '/security/1-3/bindings_anti-counterfeit_source_code',
    component: resolve => require(['@/views/security/1-3/BindingsAntiCounterfeitSourceCode.vue'], resolve),
    meta: { requiresAuth: true }
  }, {
    path: '/security/1-3/product_delivery',
    component: resolve => require(['@/views/security/1-3/ProductDelivery.vue'], resolve),
    meta: { requiresAuth: true }
  }, {
    path: '/security/1-3/product_collection',
    component: resolve => require(['@/views/security/1-3/ProductCollection.vue'], resolve),
    meta: { requiresAuth: true }
  }, {
    path: '/security/1-3/binding_code_and_receipt_and_delivery_record_query',
    component: resolve => require(['@/views/security/BindingCodeAndReceiptAndDeliveryRecordQuery.vue'], resolve),
    meta: { requiresAuth: true }
  }, {
    path: '/trace/1-1/anti-counterfeit_code_label_replacement',
    component: resolve => require(['@/views/security/1-4/AntiCounterfeitCodeLabelReplacement.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/security/1-4/anti-counterfeit_code_label_replacement',
    component: resolve => require(['@/views/security/1-4/AntiCounterfeitCodeLabelReplacement.vue'], resolve),
    meta: { requiresAuth: true }
  }, {
    path: '/trace/1-1/label_replacement_record_query',
    component: resolve => require(['@/views/security/1-4/LabelReplacementRecordQuery.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/security/1-4/label_replacement_record_query',
    component: resolve => require(['@/views/security/1-4/LabelReplacementRecordQuery.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/security/1-3/product_circulation_tracking',
    component: resolve => require(['@/views/security/ProductCirculationTracking.vue'], resolve),
    meta: { requiresAuth: true }
  }, {
    path: '/trace/1-9/product_circulation_tracking',
    component: resolve => require(['@/views/security/ProductCirculationTracking1.vue'], resolve),
    meta: { requiresAuth: true }
  }, {
    path: '/trace/1-8/bind1',
    component: resolve => require(['@/views/security/1-3/BindingsAntiCounterfeitSourceCode1.vue'],resolve),
    meta: { requiresAuth: true }
  }, {
    path: '/setting/password_modification',
    component: resolve => require(['@/views/system/PasswordModification.vue'], resolve),
    meta: { requiresAuth: true }
  }, {
    path: '/trace/1-8/lotNumber',
    component: resolve => require(['@/views/lotNumber.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/setting/dataBase',
    component: resolve => require(['@/views/dataBase.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/setting/workOrder',
    component: resolve => require(['@/views/workOrder/workOrder.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/workOrder_detail',
    component: resolve => require(['@/views/workOrder/order_detail.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/mob_searchPage',
    component: resolve => require(['@/views/publicPage/searchPage.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/enterpManage_p',
    component: resolve => require(['@/views/enterpM_p/enterpManage_p.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/enterpManage_p_detail',
    component: resolve => require(['@/views/enterpM_p/enterpM_p_detail.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/enterpManage_stop',
    component: resolve => require(['@/views/enterpM_p/enterpM_stop.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/enterprise/enterpManage',
    component: resolve => require(['@/views/enterp/enterpManage.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/security/Code_prefix',
    component: resolve => require(['@/views/code_prefix.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/codeSecu/securityCode',
    component: resolve => require(['@/views/code.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/codeSecu/print',
    component: resolve => require(['@/views/printForm.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/trace/1-7/proList',
    component: resolve => require(['@/views/processors/processors.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/trace/1-10/trace_info/:path',
    component: resolve => require(['@/views/trace/trace_info.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/trace/1-6/trace_catalogue',
    component: resolve => require(['@/views/trace/trace_catalogue.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/trace/1-8/trace_circulate',
    component: resolve => require(['@/views/trace/trace_circulation.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/trace/1-8/trace_product',
    component: resolve => require(['@/views/trace/trace_production.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path: '/setting/sysInfo',
    component: resolve => require(['@/views/sys_msg.vue'], resolve),
    meta: { requiresAuth: true }
  },{
    path:'/manager',
    component: resolve => require(['@/views/enterpManager.vue'],resolve),
    meta: { requiresAuth: true }
  }]
}]



const router = new VueRouter({
  routes: routes
})

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth) {
    if(loginStore.state.data_id || localStorage.getItem('data_id')){
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }

})

router.afterEach(route => {
})

export default router
