import {isArray} from './util'

export function fileUpload(url, fileIds, data) {
  const promise = new Promise((resolve, reject) => {
    var formData = getFormData(fileIds, data)
    const handler = function () {
      if (this.readyState !== 4) {
        return
      }
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = handler
    xhr.open('POST', url, true)
    xhr.responseType = 'json'
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.send(formData)
  })
  return promise
}

function getFormData(fileIds, data) {
  var files = []
  if (isArray(fileIds)) {
    fileIds.forEach(function (id) {
      var file = document.getElementById(id).files[0]
      files.push(file)
    })
  } else {
    var file = document.getElementById(fileIds).files[0]
    files.push(file)
  }
  var formData = new FormData()
  for (let k in data) {
    formData.append(k, data[k])
  }
  if (files.length > 1) {
    files.forEach(function (file, index) {
      formData.append('file[]', files[index])
    })
  } else {
    formData.append('file', files[0])
  }
  return formData
}
