const types = {
  Array: 'Array',
  Number: 'Number',
  Null: 'null',
  Undefined: 'Undefined',
  Object: 'Object',
  Function: 'function',
  String: 'String',
  Boolean: 'Boolean'
}

export function type(obj) {
  return Object.prototype.toString.apply(obj).slice(8, -1)
}

export function isArray(obj) {
  return Object.prototype.toString.apply(obj).slice(8, -1) === types.Array
}

export function isNumber(obj) {
  return Object.prototype.toString.apply(obj).slice(8, -1) === types.Number
}

export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)// 获取url中"?"符后的字符串并正则匹配
  console.log(r)
  var context = ''
  if (r !== null) {
    context = r[2]
  }
  reg = null
  r = null
  return context == null || context === '' || context === 'undefined' ? '' : context
}

export function pathConvert(isProd, imagePath) {
  console.log(imagePath)
  if (!imagePath) {
    return false
  }
  if (isProd) {
    let domain = window.location.protocol + '//' + window.location.host
    let pathname = window.location.pathname
    pathname = pathname.slice(1)
    let projectName = pathname.slice(0, pathname.indexOf('/'))
    let content = imagePath.slice(imagePath.indexOf('attachment'))
    let path = `${domain}/${projectName}/${content}?_=${Date.now()}`
    console.log(path)
    return path
  } else {
    let domain = window.location.protocol + '//' + window.location.host
    let pathname = window.location.pathname
    pathname = pathname.slice(1)
    let projectName = pathname.slice(0, pathname.indexOf('/'))
    let content = imagePath.slice(imagePath.indexOf('attachment'))
    let path = `${domain}/${projectName}/${content}?_=${Date.now()}`
    console.log(path)
    return imagePath
  }
}

export {types}