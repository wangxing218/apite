/**
 * 统一规范返回json
 * @param {*} { code, msg, result } 
 * @param {*} ext 扩展参数
 */
function info({code, msg , result }, ext = {}) {
  const res = {
    ...ext,
    code,
    msg,
  }
  if (result !== undefined) {
    res.result = result
  }
  return res
}

/**
 * 成功返回
 * @param {*} result 成功结果
 * @param {*} ext 扩展参数
 */
function ok(result, ext) {
  return info({
    code: 0,
    msg: 'ok',
    result,
  }, ext)
}

/**
 * 成功返回mock
 * @param {*} result 成功结果
 * @param {*} ext 扩展参数
 */
function mock(result, ext){
  const Mock = require('../lib/mock')
  return ok(Mock.mock(result), ext)
}

/**
 * 
 * @param {*} msg 错误信息
 * @param {*} code 错误码，默认400
 * @param {*} ext 扩展参数
 */
function fail(msg = 'fail', code = 400, ext = {}) {
  return info({
    code,
    msg,
  }, ext)
}

/**
 * 
 * @param {*} data 列表数据 
 * @param {*} total 总数
 * @param {*} ext 扩展
 */
function list(result = [], total = 0, ext = {}) {
  return ok(result, {
    total
  })
}

module.exports = {
  ok,
  mock,
  fail,
  list,
  info,
}
