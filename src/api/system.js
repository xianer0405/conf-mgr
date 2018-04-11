import {fileUpload} from 'common/js/ajaxfileupload'

export function uploadLoginLogo(fileIds, data) {
  const url = '/apis/api/area/loginLogo'
  return fileUpload(url, fileIds, data)
}
