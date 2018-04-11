import Vue from 'vue'
import Confer from './confer.vue'
import router from '../router'
// import 'nib'

import 'common/stylus/index.styl'

/* eslint-disable no-new */
new Vue({
  el: '#confer',
  router,
  render: h => h(Confer)
})
