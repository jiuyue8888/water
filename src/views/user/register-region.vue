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
      <div class="title">{{$t('newFont.font12')}}</div>

      <!-- 填写地区 -->
      <div class="region">
        <el-checkbox-group v-model="region">
          <div v-for="item in regionList"><el-checkbox :label="item.id" :key="item.id" border>
		  {{item.value==$t('newFont.font7')?$t('newFont.font8'):item.value}}</el-checkbox></div>
        </el-checkbox-group>
      </div>

      <!-- 下一步 -->
      <div class="next-step">
        <el-button class="deep-blue" @click="onSubmit">{{$t('registerPhone.font3')}}</el-button>
      </div>

    </div>

    <!-- 没有订阅地区的弹窗 -->
    <el-dialog
            :center="true"
            :show-close="false"
            :title="$t('newFont.font16')"
            custom-class="regionShow"
            :visible.sync="regionShow"
            @open="noScroll('add')"
            @close="noScroll('remove')"
            width="80%">
      <span>{{$t('newFont.font13')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="onRegister">{{$t('newFont.font14')}}</el-button>
        <el-button round type="primary" @click="regionShow = false">{{$t('newFont.font15')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import { userRegister, getAreaList,signIn } from '@/api/user'
  import {townList,mspReg} from '@/api/membership'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'RegisterRegion',
    data(){
      return {
        isEmail:this.$route.query.email ? true : false,
        regionShow:false,
        region:[],
		lock:true,
        regionList:[]
      }
    },
    async created(){
		
      this.getRegionList();
      this.noScroll('remove');

      this.$share();
	  //signIn
    },
    methods:{
      //获取地区列表
      async getRegionList(){
        let res = await townList();
        if(res.code == 200){
          let arr = [];
          res.data.forEach(item => {
			  if(window.localStorage.getItem('language')=='EN'){
			  	arr.push({id: item.cd, value: item.lbAbb})
			  }else{
			  	arr.push({id: item.cd, value: item.lb})
			  }
          
         })
        this.regionList = arr;
        }

      },
      //提交
      onSubmit(){
		  if(!this.lock){
			  return;
		  }
		  this.lock=false;
		  setTimeout(()=>{
		  		this.lock=true;
		  },1500)
        if(this.region.length === 0){
          this.regionShow = true;
        }else{
          this.onRegister();
        }
      },
      //确认注册
      async onRegister(){
		 
        let phone = this.$route.query.phone?this.$route.query.phone:window.localStorage.getItem('zcphone'),
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
          addressIdList :[],// this.region,
          userEmail : email,
          password : pass,
          bindToken : bindToken,
          unbindToken : unbindToken,
          inviteCode :localStorage.referrer
        }
        // if(sessionStorage.referrer&&sessionStorage.referrer!='undefined'){
        //   data.inviteCode=sessionStorage.referrer
        // }/api/v1/msp/reg
        if(localStorage.getItem('water_85')){
          data['source']='water_85'
        }
        let res = await userRegister(data);
		if(res.code == 200){
			let openId=getToken()
			let res2 = await signIn(openId);
			if(res2.code == 200){
				let res1 = await mspReg({
					subWaterStopType:this.region.length==0?'0':'2',
					townCds:this.region
				});
				if(res1.code==200){
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
			}
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
