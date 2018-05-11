import Vue from 'vue'
import VueBus from 'vue-bus'

import Confer from './confer.vue'
import router from '../router'

import 'common/stylus/index.styl'

Vue.use(VueBus)
/* eslint-disable no-new */
new Vue({
  el: '#confer',
  router,
  render: h => h(Confer)
})
