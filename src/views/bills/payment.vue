<template>
  <div class="main">
    <!-- 页头 -->
    <Header metaTitle="" :bodyNb="orderInfo.bodyNb" />

    <!-- 主体内容 -->
    <div class="body">
      <div class="acctStatus-msg" v-if="isAcctStatus">
        <p>{{ orderInfo.acctStatus }}</p>
        <!-- <p>
          合同號 122948 已逾期，將被停止供水服務，<br/>請盡快到本公司客戶服務中心繳費。
        </p> -->
      </div>
      <div class="payRemark-msg" v-if="isPayRemark">
        <p>{{ orderInfo.payRemark }}</p>
      </div>


      <h2>{{$t("billsPayment.font1")}}</h2>
      <ul>
        <li>
          <span class="key">{{$t("billsPayment.font2")}}</span>
          <span>{{ orderInfo.bodyNb }}</span>
        </li>
        <li>
          <span class="key">{{$t("billsPayment.font3")}}</span>
          <span>{{ orderInfo.issuanceData }}</span>
        </li>
        <li>
          <span class="key">{{$t("billsPayment.font4")}}</span>
          <span>{{ orderInfo.deadline }}</span>
        </li>
        <li>
          <span class="key">{{$t("billsPayment.font5")}}</span>
          <span>{{ orderInfo.avoidDeadline }}</span>
        </li>
        <li>
          <span class="key">{{$t("billsPayment.font6")}}</span>
          <span style="max-width:70%">{{ orderInfo.address }}</span>
        </li>
        <li>
          <span class="key">{{$t("billsPayment.font7")}}</span>
          <span class="value">MOP $ {{ orderInfo.amountPay }}</span>
        </li>
      </ul>
      <h2 class="paymentMethod">{{$t("billsPayment.font8")}}<span v-if="orderInfo.paymentMethod == '8'">{{$t("billsPayment.font9")}}</span></h2>
      <div class="clause">
        <p>{{$t("billsPayment.font10")}}</p>
        <p>
          <span @click="eServicesClause = true">《{{$t("billsPayment.font11")}}》</span>       
          <span @click="privacyClause = true">《{{$t("billsPayment.font13")}}》</span>
        </p>
      </div>
      <div class="icon" @click="switchIcon">
        <svg-icon :class="{gray:!orderInfo.payFlag}" icon-class="may" data-id="20" />
		<img src="https://cmsphoto.wechattips.com/macaowater/en/pay%20code%402x.png" class="newIcon">
        <!--<svg-icon :class="{gray:!orderInfo.showPaymentQrcode}" icon-class="qrcode" data-id="1" />-->
        <svg-icon :class="{gray:!orderInfo.payFlag}" icon-class="visa" data-id="8" />
        <svg-icon :class="{gray:!orderInfo.payFlag}" icon-class="alipay" data-id="21" />
      </div>
      <div class="explain">{{$t("billsPayment.font14")}}</div>
      <div class="consent"></div>
      <el-checkbox class="cbox" :disabled="!orderInfo.payFlag && !orderInfo.showPaymentQrcode" v-model="clauseCbox">{{$t("billsPayment.font15")}}</el-checkbox>
      <el-button class="deep-blue" round @click="onSubmit" :disabled="!orderInfo.payFlag && !orderInfo.showPaymentQrcode">{{$t("billsPayment.font16")}}</el-button>
    </div>

    <!-- 打开缴费码弹层 -->
    <el-dialog
      :title='$t("billsPayment.font17")'
      :visible.sync="openQrCodeShow"
      width="80%"
      class="openQrCodeShow"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <img style="width: calc(100% - 16px);border:8px solid #D1DFEE;" :src="openQrCodeImg" />
    </el-dialog>

    <!-- 電子服務及負責條款 -->
    <el-dialog
      :title='$t("billsPayment.font18")'
      width="80%"
      custom-class="statementShow"
      :visible.sync="eServicesClause"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">
        <div class="text item" v-html='$t("billsPayment.font19")'></div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button round type="primary" @click="eServicesClause = false">{{$t("dashboard.font13")}}</el-button>
      </span>
    </el-dialog>

    <!-- 信用卡繳費細則及規 -->
    <el-dialog
      :title='$t("billsPayment.font12")'
      width="80%"
      custom-class="statementShow"
      :visible.sync="CreditCardClause"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">
        <div class="text item" v-html='$t("billsPayment.font20")'>
          
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button round type="primary" @click="CreditCardClause = false">{{$t("dashboard.font13")}}</el-button>
      </span>
    </el-dialog>

    <!-- 隱私條款 -->
    <el-dialog
      :title='$t("billsPayment.font21")'
      width="80%"
      custom-class="statementShow"
      :visible.sync="privacyClause"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">
        <div class="text item" v-html='$t("registerPhone.font18")'>
         
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button round type="primary" @click="privacyClause = false">{{$t("dashboard.font13")}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import phoneVerify from '@/components/PhoneVerify';
import Header from '@/components/Header'
import { getBillDetails, paymentSubmit, openQrCode } from '@/api/bill'
import { isWeChat } from '@/utils'

export default {
  name: 'Payment',
  data(){
    return {
      openQrCodeShow:false,
      openQrCodeImg:'',
      orderInfo:{
        bodyNb:this.$route.params.bodyNb,
        issuanceData:'',
        deadline:'',
        avoidDeadline:'',
        address:'',
        amountPay:'',
        paymentMethod : '',
        orderToken:'',
        showPaymentQrcode: '',
        payRemark: '',
        acctStatus: '',
        payFlag: ''
      },
      clauseCbox:false,
      eServicesClause:false,
      CreditCardClause:false,
      privacyClause:false,
      isAcctStatus: false,
      isPayRemark: false
    }
  },
  components:{
    Header : Header,
  },
  created(){
    this.getBillDetails()
    this.$share();
  },
  methods:{
    // 获取账单详情
    async getBillDetails(){
      let data = {
        bodyNb : this.orderInfo.bodyNb
      }
      let res = await getBillDetails(data);
      if(res.code == 200){
        this.orderInfo.issuanceData = res.result.porderMonth
        this.orderInfo.deadline = res.result.bodyDueDate
        this.orderInfo.avoidDeadline = res.result.cutOffDate
        this.orderInfo.address = res.result.address
        this.orderInfo.amountPay = res.result.transAmt
        this.orderInfo.orderToken = res.result.orderToken
        this.orderInfo.showPaymentQrcode = res.result.showPaymentQrcode
        this.orderInfo.payRemark = res.result.payRemark
        this.orderInfo.acctStatus = res.result.acctStatus
        this.orderInfo.payFlag = res.result.payFlag

        // if(!res.result.showPaymentQrcode || !res.result.payFlag){
        //
        // }

        this.isShowNotice(res.result.payRemark, res.result.acctStatus)

        // if(!res.result.payFlag){  // 若不被除二维码以外的方式支付
        //   this.isShowNotice(res.result.payRemark, res.result.acctStatus)
        // }
      }
    },
    // 是否显示公告
    isShowNotice(payRemark, acctStatus){
      if(payRemark !== null && payRemark !== ''){
        this.isPayRemark = true;
      }else{
        this.isPayRemark = false;
      }
      if(acctStatus !== null && acctStatus !== ''){
        this.isAcctStatus = true;
      }else{
        this.isAcctStatus = false;
      }
    },
    //前往支付
    async onSubmit(){
      
	  if(!this.clauseCbox){
	    this.$message(this.$t("billsPayment.font23"))
	    return false;
	  }else if(!this.orderInfo.paymentMethod){
	    this.$message(this.$t("billsPayment.font24"))
	    return false;
	  }
      if(this.orderInfo.paymentMethod === '1'){  // 繳費碼
        let data = { bodyNb: this.orderInfo.bodyNb }
        let res = await openQrCode(data);
        let img = 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        this.openQrCodeShow = true;
        this.openQrCodeImg = img;
      }else{  // 其他方式
        let data = {
          orderToken: this.orderInfo.orderToken,
          idType: this.orderInfo.paymentMethod,
        }

        let res = await paymentSubmit(data);
        if(res.code == 200){
          if(this.orderInfo.paymentMethod == '21' && isWeChat()){//解決微信拦截支付宝的方案
            location.href = location.origin + '?alipay='+ res.result +'#/wechat-astrict';
          }else{
            location.href = res.result;
          }
        }
      }
    },
    //切換支付方式
    async switchIcon(e){
      let that = e.target;
      let allChild = that.parentNode.parentNode.children;
      if(that.nodeName.toLowerCase() == 'use'){
        for(let i=0;i<allChild.length;i++){
          allChild[i].classList.remove('select');
        }
        if(that.parentNode.className.animVal.includes('gray')){
          return false;
        }else{
          that.parentNode.classList.add('select');
          this.orderInfo.paymentMethod = that.parentNode.dataset.id;

          //直接显示缴费码
          if(that.parentNode.dataset.id==1){
            let data = { bodyNb: this.orderInfo.bodyNb }
            let res = await openQrCode(data);
            let img = 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
            this.openQrCodeShow = true;
            this.openQrCodeImg = img;
          }

        }
      }
    },
  }
}
</script>

<style lang="scss">
  // 个人资料声明弹窗
  .statementShow{
    .el-dialog__body{
      padding:0 20px;
    }
    .el-dialog__title{
      color:#528EEF;
    }
    .el-dialog__body{
      padding:0 20px;
    }
    .el-dialog__title{
      color:#528EEF;
    }
  }
  // 打开缴费码弹层
  .openQrCodeShow .el-dialog{
    border-radius: 10px;
  }
  .newIcon{
	  display: block;
	  width: 60px;
	  height: 60px;
	      border: 2px solid rgb(172, 192, 215);
	      border-radius: 8px;
	      
  }
  //是否同意
  .cbox{
    margin:18px 0;
  }
  .cbox .el-checkbox__label{
    font-size: 12px;
  }

  .deep-blue.is-disabled{
    background: #cccccc !important;
    border-color: #cccccc !important;

  }
</style>


<style lang="scss" scoped>
/*内容*/
.body{
  width: 85%;
  padding:15px;
  margin:15px auto;
  font-size: 16px;
  border-radius:8px;
  background:#fff;
  color: #666;
  .acctStatus-msg{
    line-height: 23px;
    width: 85%;
    padding:15px;
    margin:0 auto;
    margin-bottom: 15px;
    font-size: 14px;
    border-radius:8px;
    background:#EE4E4E;
    color: #fff;
    min-height: 46px;
  }
  .payRemark-msg{
    line-height: 23px;
    width: 85%;
    padding:15px;
    margin:0 auto;
    margin-bottom: 15px;
    font-size: 14px;
    border-radius:8px;
    background:rgba(255,245,231,1);
    color: #D49135;
    min-height: 46px;
  }
  h2{
    font-size: 16px;
    color: #333333;
  }
  ul{
    padding:23px 0 12px 0;
    li{
      display: flex;
      justify-content:space-between;
      border-bottom: 1px dashed #E8E8E8;
      padding-bottom: 15px;
      margin-bottom: 15px;
      font-size: 14px;
	  span{
		  min-width: 100px;
		  text-align: right;
	  }
      .key{
        color: #37548F;
		text-align: left;
      }
      .value{
        color: #EE4E4E;
        font-weight: bold;
      }
    }
  }
  .paymentMethod{
    display: flex;
    justify-content:space-between;
    align-items:center;
    span{
      font-size: 12px;
      color:#F1C06A;
    }
  }
  .clause{
    margin: 10px 0;
    background-color: #FFF5E7;
    padding:10px;
    font-size: 12px;
    span{
      color: #37548F;
    }
  }
  .icon{
    margin-bottom:10px;
    display: flex;
    justify-content:space-around;
    .svg-icon{
      border:2px solid #ACC0D7;
      border-radius: 8px;
      font-size: 60px;
    }
    .select{
      border:2px solid #416CC4;
    }
    .gray {
      filter: grayscale(100%);
    }
  }
  .explain{
    font-size: 12px;
  }
  .el-button{
    width: 100%;
  }
}
/*声明弹窗*/
.statementShow {
  .box-card{
    max-height: 200px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    margin:15px 0;
    .text p{
      font-size: 12px;
      padding-bottom: 5px;
    }
  }
}
</style>
