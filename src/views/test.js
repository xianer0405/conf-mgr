import Vue from 'vue'
import Test from './test.vue'
import router from '../router'

/* eslint-disable no-new */
new Vue({
  el: '#test',
  router,
  render: h => h(Test)
})
