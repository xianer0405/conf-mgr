import { env } from 'common/js/config'
import {fileUpload} from 'common/js/ajaxfileupload'

const isProd = env === 'prod'

export function uploadLoginLogo(fileIds, data) {
  const url = isProd ? '../api/area/loginLogo' : '/apis/api/area/loginLogo'
  return fileUpload(url, fileIds, data)
}
