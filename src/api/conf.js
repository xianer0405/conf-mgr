import axios from 'axios'
const qs = require('qs')

export function createConf(reqParam) {
  const url = '/apis/api/confer/start'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return httpRequest(url, reqParam)
}

export function loadConfs(reqParam) {
  const url = '/apis/api/conferRecord/list'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return httpRequest(url, reqParam)
}

/*
  private int confKey ;
  private int deviceId ;
  private int volume = 0 ;
  private int type ;// 1: input or 2:output
  private boolean mute ;//静音 or 哑音
*/
export function volumeMute(reqParam) {
  const url = '/apis/api/confer/volume'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return httpRequest(url, reqParam)
}

function httpRequest(url, reqParam) {
  return axios.post(url, qs.stringify(reqParam)).then((res) => {
    return Promise.resolve(res.data)
  })
}