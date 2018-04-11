import Vue from 'vue'
import Router from 'vue-router'
import ConfForm from 'components/conf-form/conf-form'
import One2one from 'components/one2one/one2one'
import One2many from 'components/one2many/one2many'
import Many2many from 'components/many2many/many2many'
import DeviceList from 'components/device-list/device-list'
import SysuserList from 'components/sysuser-list/sysuser-list'
import AreaConfig from 'components/area-config/area-config'
import NullView from 'base/null-view/null-view'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/create'
    },
    {
      path: '/create',
      component: ConfForm
    },
    {
      path: '/one2one',
      component: One2one
    },
    {
      path: '/one2many',
      component: One2many
    },
    {
      path: '/many2many',
      component: Many2many
    },
    {
      path: '/record',
      component: NullView
    },
    {
      path: '/push2third',
      component: NullView
    },
    {
      path: '/link2or1',
      component: NullView
    },
    {
      path: '/config',
      component: AreaConfig,
      children: [
        {
          path: 'sysuser',
          component: SysuserList
        },
        {
          path: 'device',
          component: DeviceList
        }
      ]
    }
  ]
})
