// 注释解析
function parseDoc(docStr = '') {
  var matches = {
    name: '',
    description: '',
    params: [],
    text: [],
    sort: null,
  }
  var sortMatch = docStr.match(/\s+\*\s+@sort\s+(\d+)/i)
  var nameMatch = docStr.match(/\s+\*\s+@name\s+(.*)/i)
  var descMatch = docStr.match(/\s+\*\s+@(description|desc)\s+(.*)/i)
  var textMatch = docStr.match(/\s+\*\s+[^@](.*)/gi)
  var paramsMatch = docStr.match(/\s+\*\s+@param\s+(.*)/gi)

  matches.sort = sortMatch && sortMatch[1] ? Number(sortMatch[1]) : 0
  matches.name = nameMatch && nameMatch[1] ? nameMatch[1] : ''
  matches.description = descMatch && descMatch[2] ? descMatch[2] : ''
  if (textMatch) {
    textMatch.forEach(item => {
      matches.text.push(item.replace(/^\s*[\r|\n]\s+\*\s+/i, ''))
    })
  }
  if (paramsMatch) {
    paramsMatch.forEach(item => {
      const itemMatch = item.match(/\*\s+@param\s+(.*)/i)
      if (!itemMatch || !itemMatch[1]) return
      matches.params.push(parseParam(itemMatch[1]))
    })
  }
  const res = {
    name: '',
    description: '',
    params: matches.params,
    sort: matches.sort,
  }
  res.name = matches.name || matches.text[0] || ''
  if(!matches.name && matches.text.length){
    matches.text.shift()
  }
  res.description = matches.description || matches.text.join('\n')
  return res
}

// 解析入参
function parseParam(paramStr) {
  const res = {
    type: '*',
    name: '',
    desc: '',
    required: false,
    default: ''
  }
  const typeReg = paramStr.match(/{(.*?)}/i)
  const hasType = !!(typeReg && typeReg[1])
  const nameReg = hasType ? paramStr.match(/}\s*(\[(.*?)\]|[^\s]+)/i) : paramStr.match(/(\[(.*?)\]|[\w\-]+)/i)
  const descReg = paramStr.split(/\s+/)
  descReg.shift()
  if (hasType) {
    res.type = typeReg[1]
    descReg.shift()
  }

  // 可选参数有默认值
  if (nameReg && nameReg[2]) {
    res.required = false
    if (nameReg.indexOf('=') < 1) {
      res.name = nameReg[2].trim()
    }
    const nameArr = nameReg[2].split('=')
    res.name = nameArr.shift().trim()
    res.default = nameArr.join('=').trim()
  } // 必填
  else if (nameReg && nameReg[1]) {
    res.name = nameReg[1]
    res.required = true
  }
  if (descReg && descReg[0] === '-') descReg.shift()
  res.desc = descReg.join(' ')
  return res
}

module.exports = {
  parseDoc,
  parseParam,
}