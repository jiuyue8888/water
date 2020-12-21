<template>
  <div class="main" @click="quickHistoryShow = false">
    <img src="https://cmsphoto.wechattips.com/macaowater/en/logo%402x.png">
    <div>
      <div @click.stop="payment('focus')" class="quickPayment-icon">
        <el-input :placeholder='$t("otherQuickPayment.font1")' v-model="bodyNb" class="input-with-select" @blur="onBlur"  @keyup.enter.native="payment('enter')">
          <el-button slot="append" icon="el-icon-search" @click.stop="payment('click')"></el-button>
        </el-input>
      </div>
      <el-collapse-transition>
        <el-card class="box-card" :body-style="{padding:'13px 20px'}" v-show="quickHistoryShow">
          <div v-for="item in quickHistoryList" class="item" @click="verifyPayment(item)">
            {{ item }}
          </div>
        </el-card>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import { getBillDetails } from '@/api/bill'

export default {
  name: 'quickPayment',
  data(){
    return {
      quickHistoryShow:false,
      bodyNb:'',
      quickHistoryList:localStorage.quickHistoryList ? localStorage.quickHistoryList.split(',') : []
    }
  },
  created(){
    this.$share();
  },
  methods:{
    onBlur(){
      window.scroll(0, 0);
    },
    payment(eventType){
      if(eventType == 'focus'){
        if(this.quickHistoryList.length !== 0){
          this.quickHistoryShow = true;
        }
      }else{
        this.quickHistoryShow = false;
        if(!this.bodyNb){
          this.$message(this.$t("otherQuickPayment.font1"))
          return false;
        }else if(!/^[0-9]+$/.test(this.bodyNb)){
          this.$message(this.$t("otherQuickPayment.font2"))
          return false;
        }
        this.verifyPayment(this.bodyNb);
      }

    },
    async verifyPayment(bodyNb){
      let data = {
        bodyNb : bodyNb
      }
      let res = await getBillDetails(data);
      if(res.code == 200){
        if(!res.result.payFlag && res.result.viewFlag === '102'){
          if(res.result.payRemark !== null && res.result.payRemark !== ''){
            this.$message(res.result.payRemark);
          }
          if(res.result.acctStatus !== null && res.result.acctStatus !== ''){
            this.$message(res.result.acctStatus);
          }
        }else{
          let arr = this.quickHistoryList;
          arr.unshift(this.bodyNb);
          let obj = new Set(arr);//去重
          this.quickHistoryList = Array.from(obj);//转成数组
          if(localStorage.quickHistoryList){
            localStorage.quickHistoryList = this.quickHistoryList.join(',');
          }else{
            localStorage.quickHistoryList = this.bodyNb
          }
          this.$router.push('/bills/payment/'+bodyNb);
        }
      }
    }
  }
}
</script>

<style>
  .quickPayment-icon i{
    color: #4887EA;
    font-size: 20px;
    font-weight: bold;
  }
  .quickPayment-icon .el-input input{
    padding:10px;
  }
</style>

<style lang="scss" scoped>
  .main{
    height:100vh;
    width: 100vw;
    background-image: url('../../assets/images/register-bg.png');
    background-size: 100% 100%;
    color: #fff;
    text-align: center;
    img{
      width: calc(80% - 31px);
      padding: 125px 23px 28px 8px;
    }
    .el-input{
      width: 80%;
      margin-bottom: 1px;
    }
    .box-card{
      max-height: 180px;
      border-radius:8px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      width: 80%;
      margin:0 auto;
      text-align: left;
      .item{
        line-height: 27px;
      }
    }
  }
</style>
