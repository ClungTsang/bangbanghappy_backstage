'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CONFIG_TEXT: '"开发环境"',
  BACKEND_API_HOST: '"javabangbanghappy.lanfriend.cn"',
  // BACKEND_API_HOST: '"qvbd8b.natappfree.cc:80"',
  // BACKEND_API_HOST: '"192.168.1.7:8012"',
  HOST: '"127.0.0.1"',
  PORT: '"8081"'
})
