import axios from 'axios'
const qs = require('qs')

export function listSysUser(param) {
  const url = '/apis/api/sysuser/list'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}