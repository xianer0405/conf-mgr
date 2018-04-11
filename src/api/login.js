import axios from 'axios'
const qs = require('qs')

export function login(loginId, password) {
  const url = '/apis/api/sysuser/login'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  const data = { loginId, password }

  return axios.post(url, qs.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}
