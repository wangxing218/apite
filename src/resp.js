const { config } = require('./config')
/**
 * 统一规范返回json
 * @param {*} { code, msg, result } 
 * @param {*} ext 扩展参数
 */
function info({ code, msg, result }, ext = {}) {
  const res = {
    ...ext,
  }
  res[config.resp.code[0]] = code
  res[config.resp.msg[0]] = msg
  if (result !== undefined) {
    res[config.resp.result[0]] = result
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
    code: config.resp.code[1] || 0,
    msg: config.resp.msg[1] || 'ok',
    result,
  }, ext)
}

/**
 * 成功返回mock
 * @param {*} result 成功结果
 * @param {*} ext 扩展参数
 */
function mock(result, ext) {
  const Mock = require('../lib/mock')
  return ok(Mock.mock(result), ext)
}

/**
 * 
 * @param {*} msg 错误信息
 * @param {*} code 错误码，默认400
 * @param {*} ext 扩展参数
 */
function fail(msg = config.resp.fail[0], code = config.resp.fail[1], ext = {}) {
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
function list(result = [], total = config.resp.total[1], ext = {}) {
  const res = {
    ...ext
  }
  res[config.resp.total[0]] = total
  return ok(result, res)
}

module.exports = {
  ok,
  mock,
  fail,
  list,
  info,
}
