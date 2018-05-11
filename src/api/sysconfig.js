import axios from 'axios'
import { fileUpload } from 'common/js/ajaxfileupload'
import { env } from 'common/js/config'

axios.defaults.withCredentials = true
const isProd = env === 'prod'
export function listSysConfig() {
  const url = isProd ? '../api/sysconfig/list' : '/apis/api/sysconfig/list'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function uploadLogoImage(fileIds, data) {
  const url = isProd ? '../api/sysconfig/uploadLogoImage' : '/apis/api/sysconfig/uploadLogoImage'
  return fileUpload(url, fileIds, data)
}

export function loadMainLogo() {
  const url = isProd ? '../api/sysconfig/mainLogo' : '/apis/api/sysconfig/mainLogo'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function loadLoginLogo() {
  const url = isProd ? 'api/sysconfig/loginLogo' : '/apis/api/sysconfig/loginLogo'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  })
}