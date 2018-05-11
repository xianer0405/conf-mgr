import axios from 'axios'
import { fileUpload } from 'common/js/ajaxfileupload'
import { env } from 'common/js/config'
const qs = require('qs')
const isProd = env === 'prod'

axios.defaults.withCredentials = true

export function searchDevice(param) {
  const url = isProd ? '../api/device/search' : '/apis/api/device/search'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function listDevices(param) {
  const url = isProd ? '../api/device/list' : '/apis/api/device/list'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function loadDevices(param) {
  const url = isProd ? '../api/device/listByIds' : '/apis/api/device/listByIds'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function loadDevicesVolumeState(param) {
  const url = isProd ? '../api/device/volumeState' : '/apis/api/device/volumeState'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function listDevice(param) {
  const url = isProd ? '../api/device/list' : '/apis/api/device/list'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function deleteDevice(param) {
  const url = isProd ? '../api/device/delete' : '/apis/api/device/delete'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function uploadDeviceImage(fileIds, data) {
  const url = isProd ? '../api/device/uploadImage' : '/apis/api/device/uploadImage'
  return fileUpload(url, fileIds, data)
}

export function addDevice(param) {
  const url = isProd ? '../api/device/add' : '/apis/api/device/add'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function updateDevice(param) {
  const url = isProd ? '../api/device/modify' : '/apis/api/device/modify'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function setMediaParameter(param) {
  const url = isProd ? '../api/device/setMediaParameter' : '/apis/api/device/setMediaParameter'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getMediaParameters(param) {
  const url = isProd ? '../api/device/getMediaParameters' : '/apis/api/device/getMediaParameters'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function setEncodeConfig(param) {
  const url = isProd ? '../api/device/setEncodeConfig' : '/apis/api/device/setEncodeConfig'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getEncodeConfigs(param) {
  const url = isProd ? '../api/device/getEncodeConfigs' : '/apis/api/device/getEncodeConfigs'
  return axios.post(url, qs.stringify(param)).then((res) => {
    return Promise.resolve(res.data)
  })
}
