import request from '@/utils/request'

//订阅微信电子账单
export function bindWxBill(data) {
  return request({
    url: 'bindWxBill',
    method: 'post',
    data
  })
}

//获取账单列表
export function getBillList() {
  return request({
    url: 'getMemberInfo',
    method: 'get',
  })
}

//获取账单提示
export function getRemind(bodyNbs) {
  return request({
    url: 'getRemind',
    method: 'get',
    params:{ bodyNbs : '' }
  })
}

//新增合同
export function addContract(data) {
  return request({
    url: 'bindOrder',
    method: 'post',
    data
  })
}

//新增合同
export function delContract(data) {
  return request({
    url: 'delOrders',
    method: 'post',
    data
  })
}

//修改合同
export function editContract(data) {
  return request({
    url: 'orderEdit',
    method: 'post',
    data
  })
}
//修改合同-----2020-07-27新加
export function newEditContract(data) {
  return request({
    url: 'newOrderEdit',
    method: 'post',
    data
  })
}


//证件类型添加
export function papersAdd(data) {
  return request({
    url: 'cardBind',
    method: 'post',
    data
  })
}

//账单详情
export function getBillDetails(data) {
  return request({
    url: 'getOrderDetail',
    method: 'get',
    params:data
  })
}

//支付提交
export function paymentSubmit(data) {
  return request({
    url: 'pay/commit',
    method: 'post',
    data
  })
}

//打开缴费码
export function openQrCode(data) {
  return request({
    url: 'down/qrcode',
    method: 'get',
    params:data,
    responseType: 'arraybuffer'
  })
}

//打开Pdf
export function getPdf(data) {
  return request({
    url: 'down/pdfBill',
    method: 'get',
    params: data,
    responseType: 'arraybuffer'
  })
}

//获取pdf历史账单
export function getPdfHistoryList(data) {
  return request({
    url: 'orderHistory',
    method: 'get',
    params:data,
  })
}

//获取用水量
export function getWater(data) {
  return request({
    url: '/ami/dashboard',
    method: 'post',
    data,
  })
}

//获取近7日用水量
export function getWaterSeven(data) {
  return request({
    url: '/ami/activities',
    method: 'post',
    data,
  })
}

//获取警告列表
export function getAlertList(data) {
  return request({
    url: '/ami/alarmHistory',
    method: 'post',
    data,
  })
}

//开启警告推送
export function openAlert(data) {
  return request({
    url: '/ami/reg',
    method: 'post',
    data,
  })
}

//关闭警告推送
export function cancelAlert(data) {
  return request({
    url: '/ami/cancel',
    method: 'post',
    data,
  })
}

//获取警告推送状态
export function getAlertState(data) {
  return request({
    url: '/ami/regList',
    method: 'post',
    data,
  })
}

//查询ebill申请状态
export function lookEbillState(data) {
  return request({
    url: 'ebillCheck',
    method: 'get',
    params:data,
  })
}

//打开Pdf
export function getPdfview(data) {
  return request({
    url: 'bill/pdf',
    method: 'get',
    params: data,
    responseType: 'arraybuffer'
  })
}


//查詢ami 水評分
export function amiRank(bodyNb) {
  return request({
    url: 'ami/rank',
    method: 'get',
    params: {bodyNb}
  })
}
