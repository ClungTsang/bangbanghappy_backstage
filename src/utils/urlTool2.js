import uuid from '@/utils/uuid'
// import { COS_BASE_URL } from '../../config/system.config'
// 去除图片路径中重复的字段
export const formatUrl = arrFile => {
  return JSON.stringify(arrFile.map(item => (item.url.substr(item.url.lastIndexOf('myqcloud.com/') + 13))))
}
// 恢复图片路径中必须的字段 返回一个对象数组
export const restoreFiles = arrFile => {
  if (!arrFile || JSON.parse(arrFile).length == 0) {
    throw new Error('图片损坏：', arrFile)
  }
  const arrUrl = JSON.parse(arrFile).map(item =>
  ({
    uid: uuid(6),
    name: `${uuid(6)}.png`,
    status: 'done',
    url: `https://2021-bangbanghappy-1258039664.cos.ap-guangzhou.myqcloud.com/${item}`
  })
  )
  return arrUrl
}
// 恢复图片路径中必须的字段 返回一个完整的图片路径
export const restoreUrl = arrFile => {
  if (!arrFile || JSON.parse(arrFile).length == 0) {
    throw new Error('图片损坏：', arrFile)
  }
  return `https://2021-bangbanghappy-1258039664.cos.ap-guangzhou.myqcloud.com/${JSON.parse(arrFile)[0]}`
}
