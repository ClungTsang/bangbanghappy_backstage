import Vue from 'vue'
import Febs from './FEBS'
import router from './router'
import Antd from 'ant-design-vue'
import store from './store'
import request from 'utils/request'
import db from 'utils/localstorage'
import AesEncrypt from 'utils/aesEncrypt'
import echarts from 'echarts'
import Config from '../config/system.config'
import VueMeta from 'vue-meta'
import 'ant-design-vue/dist/antd.css'
import 'utils/install'
import AmapVue from '@amap/amap-vue'
AmapVue.config.key = 'e608e577fc5a796b3febab16f5c8caaf'

import { decode } from '@/utils/base64.js'
import { formatUrl, restoreFiles, restoreUrl } from '@/utils/urlTool2'


Vue.use(AmapVue)
Vue.use(Antd)
Vue.use(db)
Vue.use(VueMeta)
Vue.use({
  install(Vue) {
    Vue.prototype.$db = db
  }
})

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$formatUrl = formatUrl
Vue.prototype.$restoreFiles = restoreFiles
Vue.prototype.$restoreUrl = restoreUrl
Vue.prototype.$decode = decode
Vue.prototype.$config = Config
Vue.prototype.$post = request.post
Vue.prototype.$get = request.get
Vue.prototype.$put = request.put
Vue.prototype.$delete = request.delete
Vue.prototype.$export = request.export
Vue.prototype.$download = request.download
Vue.prototype.$upload = request.upload
Vue.prototype.$originalGet = request.originalGet
Vue.prototype.$aesEncrypt = AesEncrypt
Vue.prototype.$bus = new Vue()

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(Febs)
}).$mount('#febs')
