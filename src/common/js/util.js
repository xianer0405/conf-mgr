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

export {types}