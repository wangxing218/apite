#!/usr/bin/env node
'use strict';

const app = require('./src/app')
const { parseCMD } = require('./src/util')

const cmdConfig = parseCMD()

app.run(cmdConfig)
