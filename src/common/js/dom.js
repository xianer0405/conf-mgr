export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let classArr = el.className.split(' ')
  classArr.push(className)
  el.className = classArr.join(' ')
}

export function removeClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let classArr = el.className.split(' ')
  const fIndex = classArr.findIndex((val) => {
    return val === className
  })
  classArr.splice(fIndex, 1)
  el.className = classArr.join(' ')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function findBySelector(className) {
  let eles = document.querySelectorAll(className)
  return eles
}

export function dataAttr(el, name, val) {
  let prefix = 'data-'
  let key = prefix + name
  if (val) {
    return el.setAttribute(key, val)
  } else {
    return el.getAttribute(key)
  }
}