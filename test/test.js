var str = `const { api, delay, mock } = require('apite')

/**
 * text
 * @desc 这是一个相当可信的东西
 * @param {id:string} {string, 123, required}
 */
api.get('/text', \`Hello apite!\`)

// html
api.get("/html", ctx => {
  ctx.html(\`<h1>Hello html!</h1>\`)
})`;
const url = '/text'

let reg = new RegExp(`\\/\\*+[\\r\\n]*(\\s*\\*\\s*(.*)[\\r\\n]*)*[\\r\\n\\s]+api\\.get\\([\\'\\"]\/text`)
const reg2 = new RegExp('(?:^|\\n|\\r)\\s*\\/\\/(.*(?:\\r|\\n|$))api\\.(get|post|del|all)','g')
var res = str.match(reg)[0]
console.log(res + '')
