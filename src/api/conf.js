import axios from 'axios'
import { env } from 'common/js/config'
const qs = require('qs')
const isProd = env === 'prod'
axios.defaults.withCredentials = true

export function createConf(reqParam) {
  const url = isProd ? '../api/confer/start' : '/apis/api/confer/start'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return httpRequest(url, reqParam)
}

export function loadConfs(reqParam) {
  const url = isProd ? '../api/conferRecord/list' : '/apis/api/conferRecord/list'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return httpRequest(url, reqParam)
}

export function queryConfCount(reqParam) {
  const url = isProd ? '../api/conferRecord/queryConfCount' : '/apis/api/conferRecord/queryConfCount'
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
  const url = isProd ? '../api/confer/volume' : '/apis/api/confer/volume'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return httpRequest(url, reqParam)
}

export function deleteMember(reqParam) {
  const url = isProd ? '../api/confer/remove' : '/apis/api/confer/remove'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return httpRequest(url, reqParam)
}

export function addMembers(reqParam) {
  const url = isProd ? '../api/confer/join' : '/apis/api/confer/join'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return httpRequest(url, reqParam)
}

export function endConf(reqParam) {
  const url = isProd ? '../api/confer/end' : '/apis/api/confer/end'
  return httpRequest(url, reqParam)
}

export function loadBroadcastSource(reqParam) {
  const url = isProd ? '../api/confer/getBroadcastSource' : '/apis/api/confer/getBroadcastSource'
  return httpRequest(url, reqParam)
  // return Promise.resolve(vmp)
}

export function setBroadcastSource(reqParam) {
  const url = isProd ? '../api/confer/setBroadcastSource' : '/apis/api/confer/setBroadcastSource'
  return httpRequest(url, reqParam)
}

function httpRequest(url, reqParam) {
  return axios.post(url, qs.stringify(reqParam)).then((res) => {
    return Promise.resolve(res.data)
  })
}