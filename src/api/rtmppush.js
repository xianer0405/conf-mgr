import axios from 'axios'
import { env } from 'common/js/config'
const qs = require('qs')
const isProd = env === 'prod'

export function loadRtmpList() {
  const url = isProd ? '../api/rtmp/list' : '/apis/api/rtmp/list'
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function rtmpOper(param) {
  const url = isProd ? '../api/rtmp/rtmpOper' : '/apis/api/rtmp/rtmpOper'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}