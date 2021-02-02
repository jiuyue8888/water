import request from '@/utils/request'

//签到
export function checkIn() {
  return request({
    url: 'score/checkIn',
    method: 'get',
  })
}

//积分任务
export function scoreTask() {
  return request({
    url: 'score/scoreTask',
    method: 'get',
  })
}


//推荐好友
export function recommend(data) {
  return request({
    url: 'score/doTask/'+ data.taskType + '/' + data.level,
    method: 'post',
    data:{
      url:data.url
    }
  })
}

//获取礼品列表
export function getGiftList() {
  return request({
    url: 'score/gift',
    method: 'get',
  })
}

//兑换礼品
export function exchangeGift(data) {
  return request({
    url: 'score/buy',
    method: 'get',
    params:data
  })
}

//获取我的礼品
export function getMygift(data) {
  return request({
    url: 'score/myGift',
    method: 'get',
    params:data
  })
}



//查询泰丰领券状态
export function getTaiFengVouchersStatus(orderId) {
  return request({
    url: 'score/refreshOrder/'+orderId,
    method: 'get',
  })
}




//获取积分记录
export function getIntegralRecord() {
  return request({
    url: 'score/detail',
    method: 'get',
  })
}


//确认核销码
export function confirmVerification(data) {
  return request({
    url: 'score/writeOff',
    method: 'post',
    data
  })
}

//确认核销码
export function type(data) {
  return request({
    url: 'dict/query/type/1',
    method: 'post',
    data
  })
}
