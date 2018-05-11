import axios from 'axios'
import { env } from 'common/js/config'
const qs = require('qs')

axios.defaults.withCredentials = true
const isProd = env === 'prod'
export function listSysUser(param) {
  const url = isProd ? '../api/sysuser/list' : '/apis/api/sysuser/list'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function deleteSysUser(param) {
  const url = isProd ? '../api/sysuser/delete' : '/apis/api/sysuser/delete'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function addSysUser(param) {
  const url = isProd ? '../api/sysuser/add' : '/apis/api/sysuser/add'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function updateSysUser(param) {
  const url = isProd ? '../api/sysuser/modify' : '/apis/api/sysuser/modify'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getLoginUser(param) {
  const url = isProd ? '../api/sysuser/getLoginUser' : '/apis/api/sysuser/getLoginUser'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function modifyPassword(param) {
  const url = isProd ? '../api/sysuser/modifyPass' : '/apis/api/sysuser/modifyPass'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}
