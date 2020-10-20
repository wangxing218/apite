#!/usr/bin/env node
'use strict';

const fs = require('fs')
const path = require('path')
const cluster = require('cluster')
const { spawn } = require('child_process')
let app = require('./src/app')
let { config } = require('./src/config')
let util = require('./src/util')

// 显示版本号
const args = process.argv
const action = args[2] ? args[2].toLowerCase() : ''
if (action === '-v') {
  const version = require('./package.json').version
  console.log('v' + version)
  return
}

// 初始化
if (action === 'init') {
  console.log('Apite project initializing...')
  cmd('npm', ['init', '-y']).then(() => {
    const pkgFile = cwd('package.json')
    const pgk = require(pkgFile)
    pgk.scripts = pgk.scripts || {}
    pgk.scripts['apite'] = 'apite --dir=api'
    fs.writeFileSync(pkgFile, JSON.stringify(pgk, null, 2))
  }).then(() => {
    return cmd('npm', ['install', '-S', 'apite'], true)
  }).then(() => {
    const apiDir = cwd('api')
    const exists = fs.existsSync(apiDir)
    if (!exists) {
      fs.mkdirSync(apiDir)
    }
    fs.copyFileSync(util.moduleDir('web-src/api/index.js'), util.cwd('api/index.js'))
    console.log('Initialized Success! \nPlease run: \x1B[32mnpm run apite\x1B[39m')
  })
  return
}

// 执行命令
function cmd(path, args = [], out = false) {
  const cmdStr = path === 'npm' && process.platform === 'win32' ? 'npm.cmd' : 'npm'
  return new Promise((resolve, reject) => {
    const child = spawn(cmdStr, args)
    child.stdout.on('data', data => {
      out && console.log(data.toString())
    }).on('end', () => {
      resolve()
    })
      .on('error', err => {
        console.error(err)
        reject(err)
      })
  })
}

// 判断当前项目是否安装 apite
try {
  const apiteIndex = require.resolve('apite', {
    paths: [util.cwd()]
  })
  // 使用全局apite
  if (process.env.USE_GLOBAL_APITE && cluster.isWorker) {
    runApp()
    return
  } else {
    // 使用局部apite
    runLocalApp(path.dirname(apiteIndex))
  }
} catch (error) {
  // 没有安装,设置NODE_PATH, 定位到全局路径
  process.env.NODE_PATH = path.dirname(__dirname)
  process.env.USE_GLOBAL_APITE = true
  if (cluster.isMaster) {
    cluster.fork(process.env)
  }
}


function runApp() {
  // 命令行参数
  let cmdConfig = util.parseCMD(config) || {}
  app.run(cmdConfig)
}

// runLocalApp
function runLocalApp(modPath) {
  const localRequire = (relPath) => {
    return require(path.resolve(modPath, relPath))
  }
  // 引入局部
  util = localRequire('./src/util')
  app = localRequire('./src/app')
  config = localRequire('./src/config').config
  runApp()
}









