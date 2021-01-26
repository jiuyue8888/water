<template>
  <div class="main">
    <!-- 页头 -->
    <div class="header">
      <!-- 返回 -->
      <div class="back" @click="back">
        <i class="el-icon-arrow-left"></i>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="body">
      <div class="title">
        <p><i class="el-icon-success"></i> {{ isEmail ? $t("registerSucceed.font1") : $t("registerSucceed.font2") }}</p>
      </div>
      <!-- 声明 -->
      <!-- <div class="statement">紅包獎勵已存入會員中心，請前往查看</div> -->
      <!-- 內容 -->
      <div class="content">
        <ul>
          <li>
            <div class="info">
              <span class="left">{{$t("registerSucceed.font3")}}</span>
              <span class="right">{{ form.areaCode?'+'+form.areaCode:'' }} {{ form.phone }}</span>
            </div>
          </li>
          <li><hr style="border-top:1px solid #F1F7FB" /></li>
          <li v-if="isEmail">
            <div class="info">
              <span class="left">{{$t("registerSucceed.font4")}}</span>
              <span class="right">{{ form.email }}</span>
            </div>
          </li>
          <li v-if="isEmail"><hr style="border-top:1px solid #F1F7FB" /></li>
		  
		  
          <li v-show="filterRegion.length>0">
            <p>{{$t("registerSucceed.font5")}}</p>
          </li>
		  
          <li v-show="filterRegion.length>0">
            <div class="subscription">
              <el-row :gutter="20">
                <el-col :span="8" v-for="item in filterRegion" :key="item.value">
                  <el-button size="small">
                    <div>{{item.value==$t("newFont.font7")?$t("newFont.font8"):item.value}}</div>
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </li>
        </ul>
      </div>
      <!-- 底部操作 -->
      <div class="next-step-flex">
        <div class="next-step">
          <el-button @click="pagePush('/')" round class="baby-blue">{{$t("registerSucceed.font6")}}</el-button>
          <el-button @click="pagePush('/bills')" round class="deep-blue">{{$t("registerSucceed.font7")}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { validEmail, validPhone } from '@/utils/validate'
  import {signIn } from '@/api/user'
  import {getToken } from '@/utils/auth'
  import { getBillList } from '@/api/bill'
  import {mspReg,getMspList,townList} from '@/api/membership'

  export default {
    name: 'RegisterSucceed',
    data(){
      return {
        isEmail:this.$route.query.email ? true : false,
        form: {
          phone: this.$route.query.phone||'',
          email: this.$route.query.email||'',
          areaCode: this.$route.query.areaCode||'',
          region: this.$route.query.region||[],
          regionList: this.$route.query.regionList||[],
        },
        filterRegion:[],
        memberInfo:{}
      }
    },
    async created(){
      let openId=getToken()
      if(openId){
        let resLogin = await signIn(openId);

        


        let resUser = await getBillList();//获取用户信息
        if(resUser.code == 200){
          sessionStorage.loginState = true;
          sessionStorage.contractNb = resUser.result.bodyLinkList.length
          sessionStorage.memberNb = resUser.result.memberNb

          this.memberInfo=resUser.result

          if(resUser.result.unBindWxBill && (resUser.result.unBindWxBill.wxBindFlag == 'N' && resUser.result.unBindWxBill.mbRoleCd == '1')){
            sessionStorage.badgeShow = false;
          }else{
            sessionStorage.badgeShow = true;
          }
        }
		
		
		
		
		
		
	 }
      //this.onFilterRegion();
console.log(this.$route.query.regionList)
if(this.$route.query.regionList&&JSON.parse(this.$route.query.regionList).length==0){
	this.showArea();
}else{
	this.onFilterRegion();
}
      this.$share();
      
    },
    methods:{
		async showArea(){
			let list = await getMspList()
			let res = await townList();
			let arr=[]
			const that = this;
			
			
			if(list.code == 200&&list.data.subWaterStopType==2&&res.code == 200){
				let region=list.data.result
				if(region.length!=0){
				  let data={
				    subWaterStopType:region.length==0?'0':'2',
				    townCds:region
				  }
				  //await mspReg(data)
				}
				res.data.forEach(item => {
					list.data.result.map(obj=>{
						if(obj.townCd==item.cd){
							if(window.localStorage.getItem('language')=='EN'){
								
								arr.push({id: item.cd, value: item.lbAbb})
							}else{
								
								arr.push({id: item.cd, value: item.lb})
							}
						}
					})
							  
				 
				})
				console.log('地区接口数据---',arr)
				that.filterRegion = arr;
				
			}
		},
      //过滤地区
      onFilterRegion(){
        this.form = this.$route.query;
        if(this.memberInfo.userPhone){
          this.form.phone=this.memberInfo.userPhone
        }
        let regionList = JSON.parse(this.form.regionList),
                arr = [];
        regionList.forEach(allItem => {
          this.form.region.forEach(regionItem => {
            if(regionItem == allItem.id){
              arr.push(allItem);
            }
          })
        })
		
        this.filterRegion = arr;
      },
      //返回
      back(){
        this.$router.push('/user/register-region');
      },
      //跳转
      pagePush(url){
        this.$router.push(url);
      },

    }
  }
</script>

<style>

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
  }
  /*内容*/
  .body{
    background:rgba(255,255,255,1);
    border-radius:10px;
    padding:15px;
    width:85%;
    margin: 10px auto;
    box-shadow: 0px 0px 10px #ddd;
    height: calc(100vh - 95px);
  }
  /*标题*/
  .title{
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    color: #235EC6;
    margin: 20px 0;
  }
  /*声明*/
  .statement{
    font-size: 15px;
    margin:15px 0;
  }
  /*內容*/
  .content{
    padding: 10px;
  }
  .content ul li{
    margin-bottom: 15px;
  }
  .content .info{
    display: flex;
    justify-content:space-between;
  }
  .content .info .left{
    color: #4F7BCE;
  }
  .content .info .right{
    color: #000;
  }
  .content .subscription .el-button{
    background-color: #E2EAF5;
    border:1px solid #E2EAF5;
    width: 26vw;
    color: #4F7BCE;
    margin-bottom: 10px;
    white-space:inherit;
    div{
      display:-webkit-box;
      -webkit-box-orient: vertical;
      overflow:hidden;
      -webkit-line-clamp:1;
    }
  }
  /*底部操作*/
  .next-step-flex{
    display: flex;
    justify-content:space-around;
  }
  .next-step-flex .next-step{
    position: absolute;
    bottom: 20px;
  }
  .next-step-flex .next-step .el-button{
    width: 40vw;
  }
</style>
