'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CONFIG_TEXT: '"开发环境"',
  BACKEND_API_HOST: '"javabangbanghappy.lanfriend.cn"',
  // BACKEND_API_HOST: '"197744f7be01.ngrok.io:80"',
  // BACKEND_API_HOST: '"192.168.199.217:8080"',
  HOST: '"127.0.0.1"',
  PORT: '"8081"'
})
