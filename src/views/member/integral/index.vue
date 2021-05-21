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
		<li>
		  <div class="left">
		    <img src="../../../assets/images/icon.png" />
		    <div class="text">
		      <p class="title" v-html="$t('memberIntegral.font20')"></p>
		      <p class="award">{{$t('memberIntegral.font4')}}</p>
		    </div>
		  </div>
		  <el-button @click="showShare(data.wxBillStatus)" :class="data.wxBillStatus == 2?'':'deep-blue'"
		   :type="data.wxBillStatus == 2 ? 'success' : ''" size="mini" round>{{ btnText1(data.wxBillStatus) }}</el-button>
		</li>
		<li>
		  <div class="left">
		    <img src="../../../assets/images/iconnew.png" />
		    <div class="text">
		      <p class="title" v-html="$t('memberIntegral.font21')"></p>
		      <p class="award">{{$t('memberIntegral.font22')}}</p>
		    </div>
		  </div>
		  <el-button @click="dotask(data.userWxBillStatus)" :class="{ 'baby-blue' : data.userWxBillStatus == 2, 'deep-blue' : 
		  data.userWxBillStatus == 0 }" :type="data.userWxBillStatus == 1 ? 'success' : ''" size="mini" round>
		  {{ btnText(data.userWxBillStatus) }}</el-button>
		  
		</li>
      </ul>
    </div>
	<div class="sharepop" v-show="showpop" @click="showpop=false">
		<img src="../../../assets/images/shareen.png" v-if="lan=='EN'">
		<img src="../../../assets/images/sharezh.png" v-else>
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
	  lan:window.localStorage.getItem('language'),
      copyUrlShow: false,
      showpop: false,
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
		localStorage.setItem('userId',res.result.userId)
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
	btnText1(state){
	  if(state == 2){
	    return this.$t('memberIntegral.font11')
	  }else{
		return this.$t('memberIntegral.font10')
	  }
	},
	async dotask(id){
		if(id==0){
			this.$router.push('/bills');
		}
		if(id==1){
			this.getIntegral('userwxbill',1);	
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
		this.scoreTask();
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
	async showShare(state){
		const that = this
		console.log('state11====',state)
		if(state == 1){
			that.showpop=true
			let data = {
			  taskType : 'tuijian',
			  level : 0,
			  url:location.href.split('#')[0]
			}
		  let res = await recommend(data);
		  if(res.code == 200){
			  that.scoreTask();
			  that.shareSet(res,{
			  	title:"澳門自來水·智慧水務",
			  	desc:"點擊進入智慧水務，享受線上快捷繳費，訂閱微信電子賬單，了解最新資訊動態。"
			  },false)
			  
		  }
		}else{
			this.getIntegral('wxbill',2);
		}
		this.scoreTask();
		//else{
		//  that.showpop=true
		//}
	},
	shareSet(res,obj,type){
		const that = this
		wx.config({
		    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: that.$config.APPID, // 必填，公众号的唯一标识
		    timestamp: res.result.timestamp, // 必填，生成签名的时间戳
		    nonceStr: res.result.nonceStr, // 必填，生成签名的随机串
		    signature: res.result.signature,// 必填，签名
		    jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareAppMessage', 'onMenuShareTimeline','hideMenuItems'],
		});
		
		wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
		    wx.updateAppMessageShareData({
		        title: obj.title, // 分享标题
		        desc: obj.desc, // 分享描述
		        link: "https://"+location.hostname+"?redirect=user&inviteCode=" + res.result.inviteCode+"&userId="+localStorage.getItem('userId'), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		        imgUrl: 'http://'+location.hostname+'/' + wxShareImg, // 分享图标
		        success: function (res) {
		          that.maskShow = type;
		          console.log('成功',res);
		          // 设置成功
		        },
		        fail: function(res){
		          console.log('失败',res)
		        }
		    })
		});
		wx.error(function(res){
		  console.log(res,'错误信息')
		});
	},
    //推薦好友註冊
    async onRecommend(state){
      let that = this;
	  console.log('state====',state)
      if(state == 0){
        let data = {
          taskType : 'tuijian',
          level : 0,
          url:location.href.split('#')[0]
        }
        let res = await recommend(data);
        if(res.code == 200){
			that.shareSet(res,{
				title:JSON.parse(sessionStorage.userInfo).userName + that.$t('memberIntegral.font14'),
				desc:that.$t('memberIntegral.font15')
			},true)
			/*
          wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: that.$config.APPID, // 必填，公众号的唯一标识
              timestamp: res.result.timestamp, // 必填，生成签名的时间戳
              nonceStr: res.result.nonceStr, // 必填，生成签名的随机串
              signature: res.result.signature,// 必填，签名
              jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareAppMessage', 'onMenuShareTimeline','hideMenuItems'],
          });
		  
          wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
              wx.updateAppMessageShareData({
                  title: JSON.parse(sessionStorage.userInfo).userName + that.$t('memberIntegral.font14'), // 分享标题
                  desc: that.$t('memberIntegral.font15'), // 分享描述
                  link: "https://"+location.hostname+"?redirect=user&inviteCode=" + res.result.inviteCode, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                  imgUrl: 'http://'+location.hostname+'/' + wxShareImg, // 分享图标
                  success: function (res) {
                    that.maskShow = true;
                    console.log('成功',res);
                    // 设置成功
                  },
                  fail: function(res){
                    console.log('失败',res)
                  }
              })
          });
          wx.error(function(res){
            console.log(res,'错误信息')
          });
		  */
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
.sharepop{
	position: fixed;
	top:0;
	left: 0;
	width: 100%;
	height: 100vh;
	z-index: 999;
	background: rgba(0,0,0,0.8);
	img{
		display: block;
		width: 100%;
		margin: 0 auto;
	}
}
.body{
  margin:15px;
  ul{
    font-size: 16px;
    color: #666;
    li{
      display: flex;
      justify-content: space-between;
      align-items:center;
      width: 100%;
	  box-sizing: border-box;
      height: 100px;
      margin:15px auto;
      padding:15px 11px 15px 10px;
      border-radius:8px;
      background:#fff;
      .left{
        display: flex;
        align-items:center;
		>img{
			width: 40px;
		}
        .text{
          padding-left: 11px;
          line-height: 20px;
		  width: 170px;
          .title{
            font-size: 14px;
            color: #333;
            font-weight: bold;
          }
          .award{
            font-size: 13px;
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
