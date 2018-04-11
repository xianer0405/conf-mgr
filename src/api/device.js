import axios from 'axios'
const qs = require('qs')

export function searchDevice(param) {
  const url = '/apis/api/device/search'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}