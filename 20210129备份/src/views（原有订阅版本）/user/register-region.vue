<template>
  <div class="main">

    <!-- 页头 -->
    <div class="header">
      <!-- 返回 -->
      <div class="back" @click="back">
        <i class="el-icon-arrow-left"></i>
      </div>
      <!-- 步骤条 -->
      <el-steps :active="isEmail ? 2 : 1" finish-status="success">
        <el-step ></el-step>
        <el-step ></el-step>
        <el-step v-if="isEmail"></el-step>
      </el-steps>
    </div>

    <!-- 内容 -->
    <div class="body">

      <!-- 标题 -->
      <div class="title">倘若遇上供水突發事件，註冊會員可及時接收供水公告。因此，您可以選擇所需要訂閱的區域 (可多選)</div>

      <!-- 填写地区 -->
      <div class="region">
        <el-checkbox-group v-model="region">
          <div v-for="item in regionList"><el-checkbox :label="item.id" :key="item.id" border>{{item.value=='港珠澳大橋澳門口岸'?'港珠澳大橋澳門口岸管理區':item.value}}</el-checkbox></div>
        </el-checkbox-group>
      </div>

      <!-- 下一步 -->
      <div class="next-step">
        <el-button class="deep-blue" @click="onSubmit">提交</el-button>
      </div>

    </div>

    <!-- 没有订阅地区的弹窗 -->
    <el-dialog
            :center="true"
            :show-close="false"
            title="服務確認"
            custom-class="regionShow"
            :visible.sync="regionShow"
            @open="noScroll('add')"
            @close="noScroll('remove')"
            width="80%">
      <span>如不選擇任何一區域，您將無法收到某個區域的停水通知，但當出現城市級別緊急情況時，我們仍然將發送通知信息給您。</span>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="onRegister">確認註冊</el-button>
        <el-button round type="primary" @click="regionShow = false">重新選擇</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import { userRegister, getAreaList } from '@/api/user'
  import {townList} from '@/api/membership'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'RegisterRegion',
    data(){
      return {
        isEmail:this.$route.query.email ? true : false,
        regionShow:false,
        region:[],
        regionList:[]
      }
    },
    created(){
      this.getRegionList();
      this.noScroll('remove');
    },
    methods:{
      //获取地区列表
      async getRegionList(){
        let res = await getAreaList();
        if(res.code == 200){
          let arr = [];
          res.result.forEach(item => {
            arr.push({id:item.id, value:item.areaName})
          })
          this.regionList = arr;
        }

      },
      //提交
      onSubmit(){
        if(this.region.length === 0){
          this.regionShow = true;
        }else{
          this.onRegister();
        }
      },
      //确认注册
      async onRegister(){
        let phone = this.$route.query.phone,
                email = this.$route.query.email,
                pass = this.$route.query.pass,
                bindToken = this.$route.query.bindToken,
                unbindToken = this.$route.query.unbindToken,
                phoneRegionId = this.$route.query.phoneRegionId,
                areaCode = this.$route.query.areaCode;
        let data = {
          openId : getToken(),
          userPhone : phone,
          phoneRegionId : phoneRegionId,
          addressIdList :this.region,
          // addressIdList :[],// this.region,
          userEmail : email,
          password : pass,
          bindToken : bindToken,
          unbindToken : unbindToken,
          inviteCode :sessionStorage.referrer
        }
        // if(sessionStorage.referrer&&sessionStorage.referrer!='undefined'){
        //   data.inviteCode=sessionStorage.referrer
        // }

        // if(localStorage.getItem('water_85')){
        //   data['source']='water_85'
        // }
        let res = await userRegister(data);
        if(res.code == 200){
          this.$router.push({
            path:'/user/register-succeed',
            query:{
              phone: phone,
              email: email,
              areaCode: areaCode,
              region: this.region,
              regionList: JSON.stringify(this.regionList),
            }
          });
        }
      },
      //返回
      back(){
        this.$router.push('/user/register-phone');
      },
    }
  }
</script>


<style>
  .regionShow .el-dialog__header{
    border-bottom: 1px solid #ddd;
    padding:15px;
  }
  .regionShow .el-dialog__title{
    color:#528EEF;
  }
</style>

<style lang="scss" scoped>
  /*页头*/
  .header{
    background:linear-gradient(90deg,rgba(62,100,171,1) 0%,rgba(17,28,97,1) 100%);
    box-shadow:4px 7px 16px 0px rgba(0, 0, 0, 0.2);
    height: 45px;
    width:100%;
    display:flex;
    justify-content: center;
    align-items: center;
    // 返回
    .back{
      position: absolute;
      left:10px;
      i{
        font-size: 20px;
        color: #fff;
        font-weight: bold;
      }
    }
    // 步骤条
    .el-steps{
      width:50%;
      height: 24px;
    }
  }
  /*内容*/
  .body{
    background:rgba(255,255,255,1);
    border-radius:8px;
    padding:15px;
    width:85%;
    margin: 10px auto;
    box-shadow: 0px 0px 10px #ddd;
    min-height: calc(100vh - 95px);
    display: flex;
    flex-wrap:wrap;
  }
  /*标题*/
  .title{
    font-size: 12px;
    color: #D49135;
    background:rgba(255,245,231,1);
    border-radius:4px;
    padding:0px 12px;
    margin-bottom: 15px;
    display: flex;
    align-items:center;
  }
  /*填写地区*/
  .region{
    width: 100%;
  }
  .region .el-checkbox{
    width: 100%;
    margin-bottom: 10px;
  }
  /*下一步*/
  .next-step{
    align-self:flex-end;
    width: 100%;
  }
  .next-step .el-button{
    width: 100%;
  }

</style>
