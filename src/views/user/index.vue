<template>
  <div class="main">
    <h1>{{$t('user.font1')}}</h1>
    <div><el-button type="success" @click="register" round>{{$t('user.font2')}}</el-button></div>
    <div><el-button type="primary" @click="login" round>{{$t('user.font3')}}</el-button></div>
  <!-- 打开关注公众号弹窗 -->
  <el-dialog
    class="openQrCode"
    :visible.sync="openQrCodeShow"
    :show-close="false"
    :close-on-click-modal="false"
    width="75%"
    @open="noScroll('add')"
    @close="noScroll('remove')"
    center>
    <img  src="@/assets/images/qr-wx.png" />
    <p v-for='item in $t("dashboard.font29")'>{{item}}</p>
  </el-dialog>
  </div>
</template>

<script>
import { getToken,getOpenid } from '@/utils/auth'
import { wxAuth,signIn,wxSubscribe } from '@/api/user'
import { isRegister } from '@/api/user'


export default {
  name: 'User',
  data(){
	  return {
		  openQrCodeShow:false,
		  openId:''
	  }
  },
   async created(){
     let openId=getOpenid()
     // if(openId) {
     //   let resLogin = await signIn(openId);
     // }
	this.openId = openId;
    this.wxSubscribe()
    // localStorage.referrer = this.$route.query.inviteCode;
    if(this.$route.query.inviteCode&&openId){
      this.isRegister();
    }
  },
  methods:{
    isRegister(){
      isRegister(getOpenid()).then(({ code }) => {
        if(code === 200){
          this.$router.push('/')
        }else{
          return false
        }
      })
    },
	//判断是否关注微信公众号
	async wxSubscribe(){
	  let data = {
	    openId: this.openId
	  }
	  let res = await wxSubscribe(data);
	  if(res.result.subscribe == 0){
	    this.openQrCodeShow = true;
	  }
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
	.openQrCode{
	  .el-dialog__header{
	    padding: 0;
	    .el-dialog__headerbtn{
	      right:9px;
	      top: 3px;
	    }
	  }
	  .el-dialog__body{
	    img{
	      width: calc(100% - 16px);
	      border:8px solid #D1DFEE;
	    }
	    text-align: center;
	  }
	}
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
