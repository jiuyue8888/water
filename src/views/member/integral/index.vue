<template>
  <div class="main">
    <!-- 页头 -->
    <Header :metaTitle='$t("dashboard.font37")'/>

    <!-- 主体内容 -->
    <div class="body">
      <ul>
        <li>
          <div class="left">
            <svg-icon icon-class="firstbindi"></svg-icon>
            <div class="text">
              <p class="title">{{$t('memberIntegral.font1')}}</p>
              <p class="award">{{$t('memberIntegral.font2')}}</p>
            </div>
          </div>
          <el-button @click="onFirstbindi(data.bodynbStatus)" :class="{ 'baby-blue' : data.bodynbStatus == 2, 'deep-blue' : data.bodynbStatus == 0 }" :type="data.bodynbStatus == 1 ? 'success' : ''" size="mini" round>{{ btnText(data.bodynbStatus) }}</el-button>
        </li>
        <li>
          <div class="left">
            <svg-icon icon-class="register-member"></svg-icon>
            <div class="text">
              <p class="title">{{$t('memberIntegral.font3')}}</p>
              <p class="award">{{$t('memberIntegral.font4')}}</p>
            </div>
          </div>
          <el-button @click="onRegisterMember(data.registerStatus)" :class="{ 'baby-blue' : data.registerStatus == 2, 'deep-blue' : data.registerStatus == 0 }" :type="data.registerStatus == 1 ? 'success' : ''" size="mini" round>{{ btnText(data.registerStatus) }}</el-button>
        </li>
        <li>
          <div class="left">
            <svg-icon icon-class="recommend"></svg-icon>
            <div class="text">
              <p class="title">{{$t('memberIntegral.font5')}}</p>
              <p class="award">{{$t('memberIntegral.font6')}}</p>
            </div>
          </div>
          <el-button @click="onRecommend(data.recommendStatus)" :class="{ 'baby-blue' : data.recommendStatus == 2, 'deep-blue' : data.recommendStatus == 0 }" :type="data.recommendStatus == 1 ? 'success' : ''" size="mini" round>{{ btnText(data.recommendStatus) }}</el-button>
        </li>
      </ul>
    </div>

    <!-- 复制链接弹窗 -->
    <el-dialog
      :title='$t("memberIntegral.font16")'
      :visible.sync="copyUrlShow"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      width="80%">
      <span style="color: #409EFF">{{ url }}</span>
      <p style="margin-top: 15px;font-size: 12px;">{{$t('memberIntegral.font7')}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="copyUrlShow = false">{{$t('memberIntegral.font17')}}</el-button>
        <el-button size="mini" type="primary" v-clipboard:copy="url" v-clipboard:success="onSuccess" v-clipboard:error="onError">{{$t('memberIntegral.font8')}}</el-button>
      </span>
    </el-dialog>

    <div class="mask" v-if="maskShow" @click="maskShow=false"><p>{{$t('memberIntegral.font9')}}<i class="el-icon-top"></i></p></div>

  </div>
</template>

<script>
import Header from '@/components/Header'
import { scoreTask, recommend } from '@/api/integral'
// import wx from 'weixin-js-sdk';
import wxShareImg from '@/assets/images/logo.png';

import {signIn } from '@/api/user'
import {getToken} from '@/utils/auth'
// import { getBillList } from '@/api/bill'
export default {
  name: 'memberIntegral',
  data(){
    return {
      url: '',
      copyUrlShow: false,
      data:{},
      maskShow: false,
    }
  },
  components:{
    Header : Header,
  },
  async created(){
    let openId=getToken()
    if(openId){
      let resLogin = await signIn(openId);
    }
    this.scoreTask();

    this.$share();
  },
  methods:{
    //获取积分任务数据
    async scoreTask(){
      let res = await scoreTask();
      if(res.code == 200){
        this.data = res.result;
      }
    },
    //按钮文本
    btnText(state){
      if(state == 0){
        return this.$t('memberIntegral.font10')
      }else if(state == 1){
        return this.$t('memberIntegral.font11')
      }else if(state == 2){
        return this.$t('memberIntegral.font12')
      }
    },
    //发起领积分接口
    async getIntegral(type, state){
      let data = {
        taskType : type,
        level : state,
      }
      console.log(data);
      let res = await recommend(data);
      if(res.code == 200){
        this.$message(this.$t('memberIntegral.font13'));
        if(type == 'contract'){
          this.data.bodynbStatus = 2;
        }else if(type == 'register'){
          this.data.registerStatus = 2;
        }
      }
    },
    //首次綁定合同號
    onFirstbindi(state){
      if(state == 0){
        this.$router.push('/bills');
      }else if(state == 1){
        this.getIntegral('contract',1);
      }else if(state == 2){
        return false
      }
    },
    //註冊會員
    onRegisterMember(state){
      if(state == 0){
        this.$router.push('/user');
      }else if(state == 1){
        this.getIntegral('register',1);
      }else if(state == 2){
        return false
      }
    },
    //推薦好友註冊
    async onRecommend(state){
      let that = this;
      if(state == 0){
        let data = {
          taskType : 'tuijian',
          level : 0,
          url:location.href.split('#')[0]
        }
        let res = await recommend(data);
        if(res.code == 200){
          wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: that.$config.APPID, // 必填，公众号的唯一标识
              timestamp: res.result.timestamp, // 必填，生成签名的时间戳
              nonceStr: res.result.nonceStr, // 必填，生成签名的随机串
              signature: res.result.signature,// 必填，签名
              jsApiList: ['updateAppMessageShareData'] // 必填，需要使用的JS接口列表
          });
          wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
              wx.updateAppMessageShareData({
                  title: JSON.parse(sessionStorage.userInfo).userName + this.$t('memberIntegral.font14'), // 分享标题
                  desc: this.$t('memberIntegral.font15'), // 分享描述
                  link: "https://"+location.hostname+"?redirect=user&inviteCode=" + res.result.inviteCode, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                  imgUrl: 'http://'+location.hostname+'/' + wxShareImg, // 分享图标
                  success: function (res) {
                    that.maskShow = true;
                    console.log(res,'成功');
                    // 设置成功
                  },
                  fail: function(res){
                    console.log(res,'失败')
                  }
              })
          });
          wx.error(function(res){
            console.log(res,'错误信息')
          });
          // this.url = res.result.url;
          // this.copyUrlShow = true;
        }
      }else if(state == 1){
        return this.$t('memberIntegral.font11')
      }else if(state == 2){
        return false
      }
    },
    //复制成功回调
    onSuccess(e){
      this.copyUrlShow = false
      this.$message(this.$t('memberIntegral.font18'))
    },
    //复制失败回调
    onError(e){
      this.$message(this.$t('memberIntegral.font19'))
    },
  }
}
</script>

<style lang="scss" scoped>
/*内容*/
.body{
  margin:15px;
  ul{
    font-size: 16px;
    color: #666;
    li{
      display: flex;
      justify-content: space-between;
      align-items:center;
      width: 85%;
      height: 68px;
      margin:15px auto;
      padding:15px 21px 15px 30px;
      border-radius:8px;
      background:#fff;
      .left{
        display: flex;
        align-items:center;
        .text{
          padding-left: 11px;
          line-height: 25px;
          .title{
            font-size: 18px;
            color: #333;
            font-weight: bold;
          }
          .award{
            font-size: 14px;
            color: #9DCB44;
          }
        }
      }
      .svg-icon{
        font-size: 40px;
      }
    }
  }
}
.mask{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  p{
    position: absolute;
    top: 5px;
    right: 10px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    i{
      margin-left: 20px;
      font-size:30px;
    }
  }
}
</style>
