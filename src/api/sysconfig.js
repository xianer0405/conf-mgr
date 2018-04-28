import axios from 'axios'
import { fileUpload } from 'common/js/ajaxfileupload'

export function listSysConfig() {
  const url = '/apis/api/sysconfig/list'
  // 参数必须通过qs.stringify()转化后才能被后台识别
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function uploadLogoImage(fileIds, data) {
  const url = '/apis/api/sysconfig/uploadLogoImage'
  return fileUpload(url, fileIds, data)
}