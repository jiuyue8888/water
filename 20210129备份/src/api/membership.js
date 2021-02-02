import request from '@/utils/request'

//更新会员资料
export function updateAccount(data) {
  return request({
    url: 'updateAccount',
    method: 'get',
    params: data
  })
}

//保存订阅地区
export function saveAreaList(areaList) {
  return request({
    url: 'saveAreaList?areaList=' + areaList,
    method: 'get',
  })
}



//獲取用戶訂閱類型
export function getMspList() {
  return request({
    url: '/msp/getMspList',
    method: 'get',
  })
}

//獲取用戶綁定的和同號
export function getBodyNbs() {
  return request({
    url: '/msp/getBodyNbs',
    method: 'get',
  })
}
//獲取停水區域集合
export function townList() {
  return request({
    url: '/msp/townList',
    method: 'get',
  })
}

//修改訂閱
export function mspReg(data) {
  return request({
    url: '/msp/reg',
    method: 'post',
    data
  })
}
