import request from '@/utils/request'

//外链跳转
export function autoJump(data) {
  return request({
    url: 'autoJump',
    method: 'get',
    params: data
  })
}

//今日水质分析报告
export function waterQuality() {
  return request({
    url: 'getWDAnalysis',
    method: 'get',
  })
}

//首页banner
export function getBannerList() {
  return request({
    url: 'banner/list',
    method: 'get',
  })
}

//分享签名
export function wechatJsdk(data) {
  return request({
    url: 'wx/jsdk',
    method: 'post',
    data:data
  })
}

//获取是否显示英文版，订阅合同号的状态
export function getLangState() {
  return request({
    url: 'sys/config/query',
    method: 'get'
  })
}

export function signInh() {
  return request({
    url: 'signIn',
    method: 'get'    
  })
}