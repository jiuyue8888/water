<template>
  <div class="main">
    <!-- 信息 -->
    <div class="info">
      <!-- 页头 -->
      <Header :metaTitle='$t("dashboard.font37")' />
      <div class="content">
        <div class="integral">{{ integralNum }}<p>{{$t('memberGift.font1')}}</p></div>
        <div class="gift" @click="openMygift">{{ giftNum }}<p>{{$t('memberGift.font2')}}</p></div>
      </div>
      <router-link to="/member/gift/record">
        <div class="detail">{{$t('memberGift.font3')}}<i class="el-icon-arrow-right"></i></div>
      </router-link>
    </div>
    <!-- 消息 -->
    <div v-show="false" class="message">
      <img src="@/assets/images/gift-msg.png">
    </div>
    <!-- 列表 -->
    <div class="list">
      <h2>{{$t('memberGift.font4')}}</h2>
      <ul>
        <li v-for="item in giftList" v-if="item.showH5==1">
<!--        <li v-for="item in giftList">-->
          <el-image @click="giftPreview(item.giftUrl)" :src="item.giftUrl" lazy></el-image>
          <h3>{{ item.giftTitle }}</h3>
          <p>{{ item.giftIntroduction }}</p>
          <el-button @click="exchange(item)" class="deep-blue" size="mini" round
		  :style="item.isConvert==1?'padding:7px 0;':'padding:7px 0;background:#A0A0A0;borderColor:#A0A0A0;'">{{ item.giftPrice }} {{$t('memberGift.font5')}}</el-button>
        </li>
      </ul>
    </div>

    <!-- 兌換確認弹窗 -->
    <el-dialog
      :title='$t("memberGift.font6")'
      width="80%"
      custom-class="dialog-common"
      :visible.sync="exchangeShow"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <div class="title">
        <img :src="form.giftUrl">
        <div style="padding-left: 13px">
          <h3>{{ form.giftTitle }}</h3>
          <p>{{ form.giftIntroduction }}</p>
          <p style="padding-top: 20px"><span>{{ form.giftPrice }}</span> {{$t('memberGift.font1')}}</p>
        </div>
      </div>
      <el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">
<!--        <div class="text item" v-for="item in 20">-->
<!--          兑换须知{{ item }}-->
<!--        </div>-->
        <div style="min-height: 100px;">
          <div class="text item">
            {{ form.remark }}
          </div>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="exchangeShow = false">{{$t('memberGift.font8')}}</el-button>
        <el-button round type="primary" @click="exchangeConfirm">{{lan=='EN'?'Redeem':$t('memberGift.font5')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Header from '@/components/Header'
import { getGiftList, exchangeGift } from '@/api/integral'
import {ImagePreview } from 'vant';
export default {
  name: 'memberGift',
  data(){
    return {
		lan:window.localStorage.getItem('language'),
      exchangeShow: false,
      integralNum: 0,
      giftNum: 0,
      giftList:[],
      form:{}
    }
  },
  components:{
    Header : Header,
  },
  created(){
    this.getGiftList();
      this.$share();
  },
  methods:{
    giftPreview(img){
      ImagePreview([
        img
      ]);
    },
    //获取积分任务数据
    async getGiftList(){
      let res = await getGiftList();
      if(res.code == 200){
        this.giftList = res.result.giftList;
        this.integralNum = res.result.score;
        this.giftNum = res.result.order;
      }
    },
    //积分兑换弹窗
    exchange(data){
		if(data.isConvert==2){
			this.$message(this.$t('newFont.font4'));
			return;
		}
		if(data.isConvert==3){
			this.$message(this.$t('newFont.font5'));
			return;
		}
      this.form = data;
      this.exchangeShow = true;
    },
    //积分兑换确认
    async exchangeConfirm(){
      let data = {
        giftId : this.form.id
      }
      let res = await exchangeGift(data);
      if(res.code == 200){
        this.$message(this.$t('memberGift.font7'));
        this.exchangeShow = false;
        this.integralNum -= this.form.giftPrice;
        this.giftNum++;
      }
    },
    //打开我的礼品
    openMygift(){
      if(this.giftNum){
        this.$router.push('/member/gift/my-gift');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/*头部*/
.header{
  background: transparent !important;
  box-shadow: 0 0 !important;
}
/*信息*/
.info{
  width: 100%;
  height: 164px;
  background-image: url('../../../assets/images/gift-bg.png');
  background-size: 100% 100%;
  .detail{
    width:85px;
    height:22px;
    background:rgba(0,0,0,0.1);
    border-radius:11px;
    color: #F5F5F5;
    text-align: center;
    font-size: 14px;
    position: absolute;
    padding:2px 0;
    right: 10px;
    top: 40px;
  }
  .content{
    margin-top: 12px;
    padding-left: 40px;
    font-size: 30px;
    font-weight: bold;
    color: #fff;
    display: flex;
    p{
      font-size: 16px;
    }
    .integral{
      padding-right: 75px;
      border-right: 2px solid #5869A9;
    }
    .gift{
      padding-left: 59px;
    }
  }
}
/*消息*/
.message{
  width: calc(85% + 30px);
  margin:0 auto;
  margin-top: -27px;
  img{
    width: 100%;
    height: 56px;
  }
}
/*列表*/
.list{
  width: 85%;
  margin:15px auto;
  padding:15px;
  border-radius:8px;
  background:#fff;
  h2{
    font-size: 18px;
  }
  ul{
    display: flex;
    justify-content:space-between;
    flex-wrap: wrap;
    li:nth-child(1),li:nth-child(2),li:nth-child(3){
      margin-top: 20px;
    }
    li{
      margin: 40px 0px 0 0px;
      text-align: center;
      width: 150px;
      .el-image{
        width: 105px;
        height: 105px;
      }
      .el-button{
        width: 120px;
      }
      h3{
        padding: 10px 0 12px 0;
        font-size: 16px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      p{
        padding-bottom: 12px;
        font-size: 15px;
        color: #666;
      }
      .el-button{
        font-size: 15px;
      }
    }
  }
}
/*兑换确认弹层*/
.dialog-common{
  .title{
    display: flex;
    img{
      width:80px;
      height: 80px;
    }
    h3{
      font-size: 16px;
      padding-bottom: 5px;
    }
    p{
      font-size: 12px;
      color: #666;
      span{
        color: #4E8CEF;
        font-size: 16px;
      }
    }
  }
  .box-card{
    max-height: 200px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    margin:15px 0;
  }
  .text{
    font-size: 12px;
    p{
      margin-top: 5px;
    }
  }
}
</style>
