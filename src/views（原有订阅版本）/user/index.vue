<template>
  <div class="main">
    <h1>登錄註冊</h1>
    <div><el-button type="success" @click="register" round>我是首次註冊</el-button></div>
    <div><el-button type="primary" @click="login" round>我已有澳門自來水會員電郵帳號</el-button></div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { wxAuth } from '@/api/user'
import { isRegister } from '@/api/user'


export default {
  name: 'User',
   created(){
    sessionStorage.referrer = this.$route.query.inviteCode;
    if(this.$route.query.inviteCode){
      this.isRegister();
    }
  },
  methods:{
    isRegister(){
      isRegister(getToken()).then(({ code }) => {
        if(code === 200){
          this.$router.push('/')
        }else{
          return false
        }
      })
    },
    //自来水wxb364df0830b4a7dd 查森互动wx745469f34326f4df
    register(){
      if(process.env.NODE_ENV === 'development'){  // 开发环境
        this.$router.push('/user/register-phone')
      }else{ // 生产环境
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?state=register&appid='+this.$config.APPID+'&redirect_uri=https%3a%2f%2f'+location.hostname+'%2fapi%2fv1%2fwxAuth&response_type=code&scope=snsapi_userinfo#wechat_redirect';
      }
    },
    login(){
      if(process.env.NODE_ENV === 'development'){  // 开发环境
        this.$router.push('/user/register-email')
      }else{ // 生产环境
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?state=bind&appid='+this.$config.APPID+'&redirect_uri=https%3a%2f%2f'+location.hostname+'%2fapi%2fv1%2fwxAuth&response_type=code&scope=snsapi_userinfo#wechat_redirect';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .main{
    height:100vh;
    width: 100vw;
    background-image: url('../../assets/images/register-bg.png');
    background-size: 100% 100%;
    color: #fff;
    text-align: center;
    h1{
      font-size: 32px;
      padding-top: 140px;
      padding-bottom: 20px;
      letter-spacing:8px;
      font-weight: lighter;
    }
    .el-button{
      margin-top: 35px;
      width: 80vw;
      height:56px;
      border-radius: 28px;
      font-size: 18px;
    }
  }
</style>
