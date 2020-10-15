const path = require('path')
const { config } = require('./config')
const { cwd } = require('./util')


async function handleStatic(ctx) {
  if (typeof config.public !== 'string' || ctx.status !== 404) return
  const publicDir = path.isAbsolute(config.public) ? config.public : cwd(config.public)
  const file = path.resolve(publicDir, path.extname(ctx.path) ? '.' + ctx.path : '.' + ctx.path + '/index.html')
  console.log('file', file)
  ctx.sendFile(file)
}


exports.handleStatic = handleStatic