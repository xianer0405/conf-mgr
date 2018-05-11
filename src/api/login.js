import axios from 'axios'
import { env } from 'common/js/config'
const qs = require('qs')

const isProd = env === 'prod'
axios.defaults.withCredentials = true

export function login(loginId, password) {
  const url = isProd ? 'api/sysuser/login' : '/apis/api/sysuser/login'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  const data = { loginId, password }

  return axios.post(url, qs.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function logout(param) {
  const url = isProd ? '../api/sysuser/logout' : '/apis/api/sysuser/logout'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}