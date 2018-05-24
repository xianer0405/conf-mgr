import Vue from 'vue'
import Router from 'vue-router'
import ConfForm from 'components/conf-form/conf-form'
import One2one from 'components/one2one/one2one'
import One2many from 'components/one2many/one2many'
import Many2many from 'components/many2many/many2many'
import SystemConfig from 'components/system-config/system-config'
import DeviceList from 'components/device-list/device-list'
import SysuserList from 'components/sysuser-list/sysuser-list'
import AreaConfig from 'components/area-config/area-config'
import NullView from 'base/null-view/null-view'
import Rtmp2third from 'components/rtmp2third/rtmp2third'
import RtmpConfig from 'components/rtmp-config/rtmp-config'

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
      path: '/record/:isThird',
      component: NullView
    },
    {
      path: '/push2third/:isThird',
      component: Rtmp2third
    },
    {
      path: '/link2or1/:isThird',
      component: NullView
    },
    {
      path: '/config',
      component: SystemConfig,
      redirect: '/config/area',
      children: [
        {
          path: '/config/area',
          component: AreaConfig
        },
        {
          path: '/config/sysuser',
          component: SysuserList
        },
        {
          path: '/config/device',
          component: DeviceList
        },
        {
          path: '/config/rtmp',
          component: RtmpConfig
        }
      ]
    }
  ]
})
