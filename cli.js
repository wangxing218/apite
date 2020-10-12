#!/usr/bin/env node
'use strict';

const server = require('./src/server')
const { parseCMD } = require('./src/util')

const cmdConfig = parseCMD()

server.run(cmdConfig)
