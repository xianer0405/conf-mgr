import Vue from 'vue'
import Confer from './confer.vue'
import router from '../router'
// import Modal from 'base/modal/modal'
// import 'nib'

import 'common/stylus/index.styl'
// Vue.component('modal', Modal)

/* eslint-disable no-new */
new Vue({
  el: '#confer',
  router,
  render: h => h(Confer)
})
