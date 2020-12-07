<template>
  <div class="main" id="index">
    <!-- 基本信息 -->
    <div class="basic-Info">
      <div class="top">
        <h1>{{$t("dashboard.font1")}}，{{ userInfo.userName }}</h1>
        <div class="sign">
			<!--  v-if="!signInHide"  -->
          <div class="block" @click="!messageShow && checkIn()"  v-if="false">
            <svg-icon icon-class="sign" />
            <span>{{$t("dashboard.font2")}}</span>
          </div>
		  <div class="langs-box" @click="lanIcon=!lanIcon">
		  <img v-show="$i18n.locale=='EN'" src="https://cmsphoto.wechattips.com/macaowater/language/en2.png"/>
		  <img v-show="$i18n.locale=='ZH'" src="https://cmsphoto.wechattips.com/macaowater/language/zhong2.png"/>
		  </div>
		  <div class="lanIcon animated fadeIn" v-show="lanIcon">
			  <span @click="langChange('EN')" :class="$i18n.locale=='EN'?'curr':''">EN</span>
			  <span @click="langChange('ZH')" :class="$i18n.locale=='ZH'?'curr':''">中文</span></div>
		  <svg-icon @click="helpShow = true" class="question" icon-class="question" />
        </div>
      </div>
      <div class="content" id="content">
        <p @click="openBill(1)"><b>{{ contractNb || '-' }}</b><br/>{{$t("dashboard.font3")}}</p>
        <p @click="openBill(2)"><b>{{ integralNum || '-' }}</b><br/>{{$t("dashboard.font4")}}</p>
        <p @click="openBill(3)"><b>{{ giftNum || 0 }}</b><br/>{{$t("dashboard.font5")}}</p>
      </div>
    </div>
    <!-- 消息 -->
    <div class="message" v-if="messageShow">
      <i class="el-icon-error" @click="messageShow = false"></i>
      <p>{{$t("dashboard.font6")}}</p>
    </div>
    <!-- 账单消息 -->
    <div class="billInfoBody" v-if="billInfoShow">
        <transition name="el-zoom-in-center" v-for="(item,index) in uRemindsList" :key="index">
          <div class="billInfo" v-if="item.billInfoShow">
            <svg-icon icon-class="close" @click="switchBill(index,item.warnBodyNb)" />
            <h2><p>{{ item.aliasLb }}</p><span>● {{ item.billAmount <= 10 ? $t("dashboard.font7") : $t("dashboard.font8") }}</span></h2>
            <div class="number">
              <div class="bodyNb" v-if="item.viewFlag !== '102' || item.payable">{{$t("dashboard.font9")}}：<span>{{ item.warnBodyNb }}</span></div>
<!--              <router-link :to="'/bills/payment/' + item.warnBodyNb"><div class="fees">前往缴费<i class="el-icon-arrow-right"></i></div></router-link>-->
              <div class="fees no-touch" @click="$router.push('/bills/payment/' + item.warnBodyNb)">{{$t("dashboard.font10")}}<i class="el-icon-arrow-right"></i></div>
            </div>
            <p class="money">{{$t("dashboard.font11")}}：<span>MOP ${{ item.billAmount }}</span></p>
            <!-- 切换 -->
            <!-- <div class="switch">
              <span style="background:#314779"></span>
              <span></span>
              <span></span>
            </div> -->
          </div>
        </transition>
    </div>
    <!-- 菜单 -->
    <div class="menu" :style="{'margin-top': menuMarginTop}">
      <h2>{{$t("dashboard.font14")}}</h2>
      <div class="content">
        <p @click="routerHerf('/bills',true)">
          <el-badge is-dot class="item" :hidden="badgeShow">
            <svg-icon icon-class="wechat-bills"/><br/>{{$t("dashboard.font15")}}
          </el-badge>
        </p>
        <p @click="routerHerf('/bills')">
          <el-badge :value="uRemindsList.length" :hidden="uRemindsList.length==0?true:false" class="item">
            <svg-icon icon-class="management-bills"/><br/>{{$t("dashboard.font16")}}
          </el-badge>
        </p>
        <p @click="externalLink('/member/bill-management',true)"><svg-icon icon-class="sms"/><br/>{{$t("dashboard.font17")}}</p>
        <p @click="routerHerf('/other/quick-payment','','nologin')"><svg-icon icon-class="shortcut"/><br/>{{$t("dashboard.font18")}}</p>
        <p @click="exLink('https://www.macaowater.com/about-macao-water/suspension-notice',false,'nologin')">
			<svg-icon icon-class="inform" /><br/>{{$t("dashboard.font19")}}</p>
        <p @click="exLink('https://www.macaowater.com/about-macao-water/daily-water-quality-report',false,'nologin')">
			<svg-icon icon-class="water-quality"/><br/>{{$t("dashboard.font20")}}</p>

        <p @click="exLink('https://www.macaowater.com/customer/tariffs-charge',false,'nologin')">
			<svg-icon icon-class="gas-prices"/><br/>{{$t("dashboard.font21")}}</p>

        <p @click="routerHerf('/other/more?login='+userLoginAuto,'','nologin')"><svg-icon icon-class="more"/><br/>{{$t("dashboard.font22")}}</p>
      </div>
    </div>
    <!-- 会员中心 -->
    <div class="member">
      <h2>{{$t("dashboard.font23")}}</h2>
      <div class="content">
        <p @click="routerHerf('/member/gift')"><svg-icon icon-class="gift"/><br/>{{$t("dashboard.font24")}}</p>
        <p @click="routerHerf('/member/integral')"><svg-icon icon-class="integral"/><br/>{{$t("dashboard.font25")}}</p>
        <p @click="routerHerf('/member/membership')"><svg-icon icon-class="information"/><br/>{{$t("dashboard.font26")}}</p>
      </div>
    </div>
    <!-- 今日水质 -->
    <div class="today">
      <h2>{{$t("dashboard.font27")}}</h2>
      <el-carousel arrow="never" class="todayCarousel" trigger="click" height="60px">
        <el-carousel-item v-for="item in waterQualityList" :key="item.locationId">
<!--          <div class="body" @click="!messageShow && externalLink('https://m.macaowater.com/about-macao-water/daily-water-quality-report',false)">-->
          <div class="body" @click="exLink('https://www.macaowater.com/about-macao-water/daily-water-quality-report',false,'nologin')">
            <h3 class="text">{{ item.location }}</h3>
            <svg-icon class="quality" style="font-size: 65px" icon-class="quality"/>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 广告图 -->
    <div class="swiperbanner">
      <el-carousel arrow="never" class="bannerCarousel" :interval="2500" trigger="click" height="125px">
        <el-carousel-item v-for="(item,index) in bannerList" :key="index">
          <img @click="exLink(item.url,false,'nologin')" :src="item.imgUrl">
        </el-carousel-item>
      </el-carousel>
    </div>
<!--    <div class="banner"></div>-->

    <!-- 使用帮助弹窗 -->
    <el-dialog
      :title='$t("dashboard.font12")'
      width="90%"
      custom-class="dialog-common helpDialog"
      :visible.sync="helpShow"
      top="50px"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <el-card class="box-card" shadow="never" style="max-height: 394px;border: none;" :body-style="{padding:'10px 10px 10px 10px'}">
        <div class="text item">
          <img src="@/assets/images/help.png" style="width:100%">
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="helpShow = false">{{$t("dashboard.font13")}}</el-button>
      </span>
    </el-dialog>

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

    <!-- 签到成功弹窗 -->
    <div class="checkIn" v-if="checkInShow">
      <div class="content">
        <img :src="$t('image.img2')">
        <p><span>+</span><b>5</b> {{$t("dashboard.font31")}}</p>
        <svg-icon icon-class="checkIn-close" @click="checkInShow = false" />
      </div>
    </div>

    <!-- 綁定合同彈窗 -->
    <el-dialog
      :title='$t("dashboard.font35")'
      width="80%"
      top="30px"
      custom-class="dialog-common"
      :visible.sync="bindShow"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <div style="text-align: center;padding: 10px 0">{{$t("dashboard.font32")}}</div>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round @click="bindShow = false">{{$t("dashboard.font33")}}</el-button>
        <el-button round type="primary"><router-link to="/bills">{{$t("dashboard.font34")}}</router-link></el-button>
      </span>
    </el-dialog>


<!--    <transition name="myfade">-->
<!--    <mw-posters v-if="mw85PosterAuto" @close="closemw85Poster"></mw-posters>-->
<!--    </transition>-->

  </div>
</template>

<script>
import { getWxInfo, publicNumInfo, getAccessToken, signIn, wxSubscribe } from '@/api/user'
import { getBillList, getRemind } from '@/api/bill'
import { checkIn } from '@/api/integral'
import { autoJump, waterQuality,getBannerList } from '@/api/others'
import { getToken } from '@/utils/auth'
import { parseTime } from '@/utils'
import Cookies from 'js-cookie'

// import mwPosters from '@/components/mw85/posters'
import md5 from 'js-md5'
export default {
  name: 'Dashboard',
  components:{
    // mwPosters : mwPosters,
  },
  data(){
    return {
      contractNb:Number(sessionStorage.contractNb),
      badgeShow:sessionStorage.badgeShow == 'false' ? false : true,
      giftNum:0,
      integralNum:0,
      idNbShow:false,
      lanIcon:false,
      openId:'',
      openQrCodeShow: false,
      messageShow: false,
      billInfoShow: false,
      helpShow: false,
      checkInShow: false,
      userInfo:{
        userName : sessionStorage.userInfo ? JSON.parse(sessionStorage.userInfo).userName : '',
        userPhone : '',
        avatar: sessionStorage.userInfo ? JSON.parse(sessionStorage.userInfo).avatar : '',
      },
      uRemindsList:[],
      waterQualityList:[],
      // signInHide:Cookies.get('signInHide'),
      signInHide:true,
      bindShow:false,
      loading:'',

      userLoginAuto:true,

      mw85PosterAuto:false,//85周年弹窗

      bannerList:[
        //1
        // {
        //   imgUrl:require('../../assets/images/banner-3.jpg'),
        //   url:'https://wechat.macaowatercloud.com/Game/RecruitInfo?ShareUser=0',
        // },
        // {
        //   imgUrl:require('../../assets/images/banner-1.jpg'),
        //   url:'https://wechat.macaowatercloud.com/Game/XiaoGame',
        // },
        // {
        //   imgUrl:require('../../assets/images/banner-2.jpg'),
        //   url:'https://wechat.macaowatercloud.com/Game/FishIndex',
        // }
              //2
        //3临时
        // {
        //   imgUrl:require('../../assets/banner/banner-1.png'),
        //   url:'https://wechattest.macaowatercloud.com/home',
        // },
        // {
        //   imgUrl:require('../../assets/banner/banner-2.png'),
        //   url:'https://wechattest.macaowatercloud.com/home',
        // },
        // {
        //   imgUrl:require('../../assets/banner/banner-3.png'),
        //   url:'https://wechattest.macaowatercloud.com/home',
        // },
        //正式
        {
          imgUrl:require('../../assets/images/banner-9.png'),
          url:'http://mwregister.wechattips.com',
        },
        {
          imgUrl:require('../../assets/images/banner-4.png'),
          url:'https://wechattest.macaowatercloud.com/home',
        },
        {
          imgUrl:require('../../assets/images/banner-5.png'),
          url:'https://wechattest.macaowatercloud.com/home',
        },


      ],
    }
  },
  computed:{
    //判断菜单块的头部边界距离
    menuMarginTop(){
      if(this.billInfoShow){
        return '100px'
      }else{
        if(this.messageShow){
          return '18px';
        }else{
          return '-38px'
        }
      }
    },

  },
  async created(){
    this.openFullScreen();
    this.openId = getToken();
    // let pass='DgSKK'
    // console.log(pass.toLowerCase());
    // console.log(md5(pass));
    // console.log(md5(pass.toLowerCase()));

    //登录成功后不再请求登录接口
    if(!sessionStorage.loginState){
      this.getWxInfo();
      this.userLogin();

    }else{
      this.wxSubscribe();
      this.getRemind();
      this.getWaterQuality();
    }
	
	



    let bannerList=[]
    let result=await getBannerList()
    if(result.code==200){
      for(let i in result.data){
        bannerList.push({
          imgUrl:result.data[i].url,
          url:result.data[i].targetUrl,
        })
      }
      this.bannerList=bannerList
    }

    this.$share();

  },
  methods:{
	//语言切换
    langChange(type){
		this.lanIcon = false;
		localStorage.setItem('language',type)
		setTimeout(()=>{
			location.reload()
		},500)
      
    },

    closemw85Poster(){
      // let date=new Date()
      // let zhi=date.getMonth()+'-'+date.getDate()
      // localStorage.setItem('showPosterDate',zhi)
      // this.mw85PosterAuto=false
    },
    showmw85Poster(){
      // let date=new Date()
      // let zhi=date.getMonth()+'-'+date.getDate()
      // if(!localStorage.getItem('showPosterDate')||localStorage.getItem('showPosterDate')!=zhi){
      //   this.mw85PosterAuto=true
      // }
    },

    //待开发
    test(){
      this.$message('待開發')
    },
    //全屏加载层
    openFullScreen() {
		console.log('this.$i18n.locale---',this.$i18n.locale)
		//setTimeout(()=>{
			this.loading = this.$loading({
			  lock: true,
			  text: this.$t('dashboard.font36'),
			  spinner: 'el-icon-loading',
			  background: 'rgba(0, 0, 0, 0.7)'
			});
		//},300)
      
    },
    //头部统计跳转
    openBill(type){
      if(type == 1){
        if(this.contractNb == 0){
          this.bindShow = true;
          return false;
        }
        if(this.contractNb){
          this.routerHerf('/bills');
        }
      }else if(type == 2){
        if(this.integralNum){
          this.routerHerf('/member/gift');
        }
      }else if(type == 3){
        this.routerHerf('/member/gift/my-gift');
        // if(this.giftNum){
        //   this.routerHerf('/member/gift/my-gift');
        // }
      }
    },
    //获取今日水质
    async getWaterQuality(){
      let res = await waterQuality();
      if(res.code == 200){
        this.waterQualityList = res.result;
      }
    },
    //路由跳转
    routerHerf(page,boolean,loginType){
      if(this.userLoginAuto==false&&loginType!='nologin'){
        this.$router.push('/user');
        return false;
      }
      this.$router.push({
        path:page,
        query:{
          openBill:boolean
        }
      });
    },
    //外部链接
    async externalLink(url,isToken,isBind,loginType){
      if(this.userLoginAuto==false&&loginType!='nologin'){
        this.$router.push('/user');
        return false;
      }
      if(this.contractNb == 0 && !isBind){
        this.bindShow = true;
        return false;
      }
      if(isToken){
        let data = {
          lang: 'zh_TW',
          url: url
        }
        let res = await autoJump(data);
        if(res.code == 200){
          location.href = res.result.url;
        }
      }else{
        location.href = url;
      }
    },

    async exLink(url,isToken,loginType){
      if(this.userLoginAuto==false&&loginType!='nologin'){
        this.$router.push('/user');
        return false;
      }
      if(isToken){
        let data = {
          lang: 'zh_TW',
          url: url
        }
        let res = await autoJump(data);
        if(res.code == 200){
          location.href = res.result.url;
        }
      }else{
        location.href = url;
      }
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
    //获取微信信息
    async getWxInfo(){
      let res = await getWxInfo(this.openId);
      if(res.code == 200){
        this.userInfo.userName = res.result.wxNickName || '遊客';
        this.userInfo.avatar = res.result.wxHeadImgUrl;
        sessionStorage.userInfo = JSON.stringify({userName:res.result.wxNickName, avatar:res.result.wxHeadImgUrl});
      }
    },
    //用户登录(登录状态)
    async userLogin(){
      let that = this;
      let resLogin = await signIn(this.openId);
      if(resLogin.code == 200){

        this.messageShow = false;
        this.userLoginAuto=true;
        let resUser = await getBillList();//获取用户信息
        if(resUser.code == 200){
          sessionStorage.loginState = true;
          this.contractNb = resUser.result.bodyLinkList.length
          sessionStorage.contractNb = resUser.result.bodyLinkList.length
          sessionStorage.memberNb = resUser.result.memberNb
          // console.log(resUser.result.unBindWxBill && (resUser.result.unBindWxBill.wxBindFlag == 'N' && resUser.result.unBindWxBill.mbRoleCd == '1'))
          if(resUser.result.unBindWxBill && (resUser.result.unBindWxBill.wxBindFlag == 'N' && resUser.result.unBindWxBill.mbRoleCd == '1')){
            this.badgeShow = false;
            sessionStorage.badgeShow = false;
          }else{
            this.badgeShow = true;
            sessionStorage.badgeShow = true;
          }
        }
        this.wxSubscribe();
        this.getRemind();
        this.getWaterQuality();
      }else{
        this.messageShow = true;
        this.userLoginAuto=false;
        this.registerPage();
        this.getWaterQuality();
        this.loading.close();


      }
    },
    //未登录用户点击跳转到注册入口
    registerPage(){
      // let that = this,
      // body = document.querySelector('#index');
      // body.addEventListener('click', function(event) {
      //   event.stopPropagation();
      //   that.$router.push('/user/');
      // });

      let that = this
      let content=document.querySelector('#content');
      content.addEventListener('click', function(event) {
        event.stopPropagation();
        that.$router.push('/user/');
      })

      let block=document.querySelector('.block');
      if(block){
        block.addEventListener('click', function(event) {
          event.stopPropagation();
          that.$router.push('/user/');
        })
      }


      let member=document.querySelector('.member');
      member.addEventListener('click', function(event) {
        event.stopPropagation();
        that.$router.push('/user/');
      })

    },
    //获取账单消息
    async getRemind(){
      let res = await getRemind([]);
      this.loading.close();
      if(res.code == 200){
        this.signInHide=res.result.checkinStatus==1?true:false;
		//自动签到
		
		if(!this.signInHide){
			console.log('checkIn')
			!this.messageShow && checkIn()
		}
        this.giftNum =res.result.orders;
        this.integralNum = res.result.score;
        res.result['date'] = parseTime(new Date(), '{y}/{m}/{d} {h}:{i}');
        sessionStorage.remindList = JSON.stringify(res.result);
        if(res.result.uReminds && res.result.uReminds.length != 0){
          this.billInfoShow = true;
          let uRemindsCk = Cookies.get('uReminds') ? Cookies.get('uReminds').split(',') : [];
          let k = 0;
          res.result.uReminds.forEach(item => {
            if(uRemindsCk.length !== 0){
              item.billInfoShow = true;
              uRemindsCk.forEach(itemTwo => {
                if(item.warnBodyNb == itemTwo){
                  item.billInfoShow = false;
                  k++;
                }
                item.billAmount = this.onbillAmount(item.billAmount);
              });
            }else{
              item.billInfoShow = true;
              item.billAmount = this.onbillAmount(item.billAmount);
            }
          });
          this.uRemindsList = res.result.uReminds.filter(item => {
            return item.billAmount > 10
          });
          if(this.uRemindsList.length === k){
            this.billInfoShow = false;
          }
        }
      }
    },
    //结欠金额处理负数
    onbillAmount(billAmount){
      let billAmountStr = String(billAmount);
      // if(billAmountStr.indexOf('-') !== -1){
      //   return billAmountStr.slice(1);
      // }else{
      //   return billAmountStr;
      // }
      return billAmountStr;
    },
    //点击切换账单
    switchBill(index,warnBodyNb){
      //设置cookie
      let uReminds = Cookies.get('uReminds') ? Cookies.get('uReminds').split(',') : [];
      uReminds.push(warnBodyNb);
      let str = uReminds.join(',');
      Cookies.set('uReminds',str,{expires: this.setCookieExpires()});
      //隐藏账单提示
      this.uRemindsList[index].billInfoShow = false;
      let k = 0;
      this.uRemindsList.forEach(item => {
        if(item.billInfoShow){
          k++
        }
      })
      //全部删除后隐藏
      if(k === 0){
        this.billInfoShow = false;
      }
    },
    //设置cookie有效期至当日凌晨0點
    setCookieExpires(){
      var curDate = new Date();//当前日期
      var curTamp = curDate.getTime();//当前时间戳
      //当日凌晨的时间戳,减去一毫秒是为了防止后续得到的时间不会达到00:00:00的状态
      var curWeeHours = new Date(curDate.toLocaleDateString()).getTime() - 1;
      //当日已经过去的时间（毫秒）
      var passedTamp = curTamp - curWeeHours;
      //当日剩余时间
      var leftTamp = 24 * 60 * 60 * 1000 - passedTamp;
      var leftTime = new Date();
      leftTime.setTime(leftTamp + curTamp);
      return leftTime;
    },
    //签到
    async checkIn(){
      let res = await checkIn();
      if(res.code == 200){
        this.checkInShow = true;
        this.integralNum += 5;
        this.signInHide = true;
        // Cookies.set('signInHide','Y',{expires: this.setCookieExpires()});
      }
    }
  }
}
</script>

<style lang="scss">
/*微信账单右上角的红点*/
.menu .content .el-badge__content.is-fixed{
  position: absolute;
  right: 16px;
  top: 5px;
}
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
//今日水質
.todayCarousel{
  .el-carousel__indicators{
    .el-carousel__button{
      background-color: #314779;
      width:12px;
      height: 4px;
      border-radius: 25px;
    }
  }
  .el-carousel__item .body{
    display: flex;
    justify-content:space-between;
    align-items:center;
    margin-top: -8px;
  }
}

// 帮助弹窗
.helpDialog .el-dialog__body{
  padding: 0 15px 0 15px;
}


//轮播
.bannerCarousel{
  .el-carousel__indicators{
    .el-carousel__button{
      background-color: #314779;
      width:18px;
      height: 4px;
      border-radius: 25px;
    }
  }
}

</style>

<style lang="scss">
/*微信账单右上角的红点*/
.menu .content .el-badge__content.is-fixed{
  position: absolute;
  right: 16px;
  top: 5px;
}
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
//今日水質
.todayCarousel{
  .el-carousel__indicators{
    .el-carousel__button{
      background-color: #314779;
      width:12px;
      height: 4px;
      border-radius: 25px;
    }
  }
  .el-carousel__item .body{
    display: flex;
    justify-content:space-between;
    align-items:center;
    margin-top: -8px;
  }
}

// 帮助弹窗
.helpDialog .el-dialog__body{
  padding: 0 15px 0 15px;
}


//轮播
.bannerCarousel{
  .el-carousel__indicators{
    .el-carousel__button{
      background-color: #314779;
      width:18px;
      height: 4px;
      border-radius: 25px;
    }
  }
}

</style>

<style lang="scss" scoped>
/*基本信息*/
.basic-Info{
  height: 130px;
  background-image: url('../../assets/images/bannerbk.png');
  background-size: 100% 100%;
  box-shadow:0px 16px 24px 0px rgba(50,73,123,0.2);
  padding:20px;
  color: #fff;
  .top{
    display: flex;
    justify-content:space-between;
    h1{
      font-size: 18px;
      font-weight: 500;
    }
    .sign{
		position: relative;
		display: flex;
		align-items: center;
      .block{
        line-height:22px;
        text-align: center;
        color:#9DCB44;
        border:1px solid #9DCB44;
        border-radius:12px;
        /*width:70px;*/
        padding: 0 8px;
        height:22px;
        display: inline-block;
        span{
          font-size: 14px;
        }
        .svg-icon{
          font-size: 15px;
        }
      }
      .langs-box{
        width: 38px;
        height:20px;
        display: inline-flex;
        
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        color: #324E8E;
        font-size: 12px;
        margin: 3px 6px 0;
		img{
			width: 100%;
		}
      }
      .question{
        margin-left: 3px;
        font-size: 20px;
        position: relative;
        top: 2px;
        width: 20px;
        height: 20px;
      }
    }
  }
  .content{
    margin-top:24px;
    display: flex;
    justify-content:space-around;
  }
  .content p{
    b{
      font-size: 24px;
    }
    line-height: 25px;
    font-size: 14px;
    text-align: center;
  }
}
/*消息*/
.message{
  width: calc(86% - 16px);
  min-height:40px;
  margin:0 auto;
  margin-top: -38px;
  background:rgba(255,241,219,1);
  border-radius:8px;
  padding:20px;
  i{
    color:#F33C3C;
    float: right;
    position: relative;
    top: -15px;
    right: -10px;
    font-size: 18px;
  }
  p{
    font-weight:400;
    color:#D99A3B;
    // font-weight: bold;
    line-height:25px;
    font-size: 15px;
  }
}
.lanIcon{
	position: absolute;
	top:30px;
	left: -20px;
	width: 60px;
	height: 80px;
	box-sizing: border-box;
	padding: 10px;
	color: #333;
	text-align: center;
	font-size: 0.3rem;
	background: url('https://cmsphoto.wechattips.com/macaowater/language/menu2.png') no-repeat 0 0;
	background-size: 100%;
	font-size: 14px;
	animation-duration: 0.5s;
	span{
		display: block;
		height: 30px;
		line-height: 30px;
		border-bottom: 1px solid #ddd;
		&:nth-last-child(1){
			border-bottom: none;
		}
	}
	span.curr{
		color: #07C160;
	}
}
/*菜单*/
.menu{
  width: 86%;

  padding:12px;
  margin:0 auto;
  border-radius:8px;
  background:rgba(255,255,255,1);
  color: #434343;
  h2{
    font-size: 16px;
  }
  .content{
    margin-top: 20px;
    display: flex;
    flex-wrap:wrap;
    justify-content:space-around;
    p{
      width: 25%;
      text-align: center;
      margin-bottom: 15px;
      font-size: 14px;
      
    }
    .svg-icon{
      font-size: 32px;
	  margin-bottom: 10px;
    }
    a{
      color:#434343;
    }
  }
}
// 账单消息
.billInfoBody{
  display: flex;
  justify-content:center;
  .billInfo{
    position: absolute;
    left: 0;
    right: 0;
    z-index: 999;
    width: calc(86% - 8px);
    padding:12px 20px 12px 12px;
    margin:0 auto;
    border-radius:8px;
    background:rgba(255,255,255,1);
    color: #434343;
    height:96px;
    margin-top:-38px;
    font-size: 14px;
    .svg-icon{
      color:#F33C3C;
      float: right;
      position: relative;
      top: -18px;
      right: -25px;
      font-size: 18px;
    }
    h2{
      display: flex;
      justify-content:space-between;
      font-size: 16px;
      p{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: calc(100% - 85px);
      }
      span{
        color:#EE4E4E;
        font-size: 14px;
      }
    }
    .number{
		width: 100%;
      display: flex;
      justify-content:space-between;
      align-items:center;
      .bodyNb{
        padding:16px 0 10px 0;
        span{
          color:#333333;
          font-weight: bold;
        }
      }
      .fees{
        color: #4E8CEE;
        border:1px solid rgba(78,140,238,1);
        min-width: 80px;
        height:32px;
        border-radius:16px;
        text-align: center;
        line-height: 32px;
        position: relative;
        top: 18px;
		padding: 0 7px;
      }
    }
    .money{
      span{
        color:#EE4E4E;
        font-weight: bold;
      }
    }
    .switch{
      // width:100%;
      // margin:0 auto;
      text-align: center;
      span{
        display: inline-block;
        width:12px;
        height: 4px;
        background:#E0E0E0;
        border-radius: 25px;
      }
    }
  }
}

/*会员中心*/
.member{
  @extend .menu;
  height:96px;
  margin-top: 18px;
  padding-bottom: 20px;
}
/*今日水质*/
.today{
  @extend .menu;
  height:71px;
  margin-top: 15px;
  .text{
    color: #314779;
    font-size: 14px;
  }
}
/*广告图*/
.swiperbanner{
  width: calc(86% + 24px);
  height:125px;
  margin:15px auto;
  border-radius:8px;

  img{
    width: 100%;
    height: 100%;
    border-radius:8px;
  }
}
.banner{
  width: calc(86% + 24px);
  height:125px;
  margin:15px auto;
  border-radius:8px;
  background-image: url('../../assets/images/activity.png');
  background-size: 100% 100%;
}
//使用帮助弹窗
.dialog-common{
  .box-card{
    max-height: 300px;
    overflow-y: auto;
    margin:15px 0;
    -webkit-overflow-scrolling: touch;
  }
}
//签到成功弹窗
.checkIn{
  position: fixed;
  display: flex;
  justify-content:center;
  z-index:9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  .content{
    img{
      width: 250px;
      height: 200px;
      margin-top: 139px;
    }
    p{
      text-align: center;
      color: #fff;
      font-size: 20px;
      b{
        font-size: 50px;
      }
      span{
        font-size: 40px;
      }
    }
    .svg-icon{
      font-size: 40px;
      width: 250px;
      margin:0 auto;
      margin-top: 30px;
    }
  }
}


.myfade-enter-active, .myfade-leave-active {
  transition: opacity 0.3s;
}

.myfade-enter, .myfade-leave-to
{
  opacity: 0;
}
</style>
