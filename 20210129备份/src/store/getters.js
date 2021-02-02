const getters = {
  openId: state => state.user.openId,
  loginState: state => state.user.loginState,
  userinfo: state => state.user.userinfo,
}
export default getters
