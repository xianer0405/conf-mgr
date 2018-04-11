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

export {types}
