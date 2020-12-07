import request from '@/utils/request'

//获取短信验证码
export function getCode(phone,areaCode) {
  return request({
    url: 'getCode/' + areaCode + '/' + phone,
    method: 'get',
  })
}

//验证短信码验证码
export function verifyCode(data) {
  return request({
    url: 'verification',
    method: 'post',
    data
  })
}

//用户注册
export function userRegister(data) {
  return request({
    url: 'signup',
    method: 'post',
    data
  })
}

//手机号校验
export function phoneVerify(phone) {
  return request({
    url: 'isOnly/' + phone,
    method: 'get',
  })
}


//判断是否关注微信公众号
export function wxSubscribe(data) {
  return request({
    url: 'wxSubscribe',
    method: 'post',
    data
  })
}


//获取地区列表
export function getAreaList() {
  return request({
    url: 'getAreaList',
    method: 'get',
  })
}

//用户登录
export function signIn(openId) {
  return request({
    url: 'signIn',
    method: 'get',
    params: { openId }
  })
}


//获取微信信息
export function getWxInfo(openId) {
  return request({
    url: 'getUserWxInfo',
    method: 'get',
    params: { openId }
  })
}

//旧会员的邮箱验证
export function verifyEmailApi(data) {
  return request({
    url: 'verifyAccount',
    method: 'get',
    params: data
  })
}

// 判斷用戶是否已經註冊
export function isRegister(openId) {
  return request({
    url: 'openIdExist',
    method: 'get',
    params: { openId }
  })
}

//獲取邮箱验证碼
export function getEmailCode(data) {
  return request({
    url: 'member/vldCode',
    method: 'post',
    data: {lbEmail:data}
  })
}
//校验邮箱验证碼
export function checkEmailCode(data) {
  return request({
    url: 'member/checkCode',
    method: 'post',
    data
  })
}

//重置密碼
export function resetPwd(data) {
  return request({
    url: 'member/resetPwd',
    method: 'post',
    data
  })
}
