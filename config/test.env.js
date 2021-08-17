"use strict";
const merge = require("webpack-merge");
const devEnv = require("./dev.env");

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  CONFIG_TEXT: '"测试环境"',
  BACKEND_API_HOST: '"javabangbanghappy.lanfriend.cn"',
  bundleAnalyzerReport: false
});
