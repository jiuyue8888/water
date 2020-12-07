import Cookies from 'js-cookie'

const TokenKey = 'openId'
const newTokenKey='newOpenId'

// export function getToken() {
//   return Cookies.get(TokenKey)
// }
//
// export function setToken(token) {
//   console.log("setToken:"+token);
//   return Cookies.set(TokenKey, token)
// }
//
// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}


export function setToken(token) {
  localStorage.setItem(newTokenKey, token)
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}


// export function setOpenid(token) {
//   return localStorage.setItem(newTokenKey, token)
// }

export function getOpenid() {
  return localStorage.getItem(newTokenKey)
}
