// 是否为对象
exports.isObj = function (obj) {
  return obj !== null && typeof obj === 'object'
}

// 深度继承
function extend(target = {}, ...args) {
  let i = 0
  const length = args.length
  let options
  let name
  let src
  let copy
  if (!target) {
    target = Array.isArray(args[0]) ? [] : {}
  }
  for (; i < length; i++) {
    options = args[i]
    if (!options) {
      continue
    }
    for (name in options) {
      src = target[name]
      copy = options[name]
      if (src && src === copy) {
        continue
      }
      if (Array.isArray(copy)) {
        target[name] = extend([], copy)
      } else if (exports.isObj(copy)) {
        target[name] = extend(src && exports.isObj(src) ? src : {}, copy)
      } else {
        target[name] = copy
      }
    }
  }
  return target
}
exports.extend = extend
