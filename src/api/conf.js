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

export function queryConfCount() {
  const url = '/apis/api/conferRecord/queryConfCount'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return httpRequest(url)
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

export function deleteMember(reqParam) {
  const url = '/apis/api/confer/remove'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return httpRequest(url, reqParam)
}

export function addMembers(reqParam) {
  const url = '/apis/api/confer/join'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return httpRequest(url, reqParam)
}

export function endConf(reqParam) {
  const url = '/apis/api/confer/end'
  return httpRequest(url, reqParam)
}

export function loadVmp(reqParam) {
  // const url = '/apis/api/confer/vmp'
  const vmp = {
    'mode': 1,
    'layout': 35,
    'members': [
      {
        'id': 1,
        'deviceName': '设备1',
        'chnIdx': 1
      },
      {
        'id': 2,
        'deviceName': '设备2',
        'chnIdx': 2
      },
      {
        'id': 4,
        'deviceName': '设备4',
        'chnIdx': 4
      }
    ]
  }
  return Promise.resolve(vmp)
}

function httpRequest(url, reqParam) {
  return axios.post(url, qs.stringify(reqParam)).then((res) => {
    return Promise.resolve(res.data)
  })
}