import axios from 'axios'
const qs = require('qs')

export function createConf(confReqParam) {
  const url = '/apis/api/confer/start'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return axios.post(url, qs.stringify(confReqParam)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function loadConf(reqParam) {
  const url = '/apis/api/conferRecord/list'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return axios.post(url, qs.stringify(reqParam)).then((res) => {
    return Promise.resolve(res.data)
  })
}