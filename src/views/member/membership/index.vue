<template>
  <div class="main">
    <!-- 页头 -->
    <Header :metaTitle='$t("dashboard.font37")' />

    <!-- 主体内容 -->
    <div class="body">
      <ul>
        <li>
          <span class="key">{{$t("memberMembership.font1")}}：</span>
          <span class="value spanwidth">{{ memberInfo.name }}</span>
        </li>
        <li>
          <span class="key">{{$t("memberMembership.font2")}}：</span>
          <span class="value spanwidth">{{ memberInfo.idType }}</span>
        </li>
        <li>
          <span class="key">{{$t("memberMembership.font3")}}：</span>
          <span class="value spanwidth">{{ memberInfo.idNb }}</span>
        </li>
        <li>
          <span class="key">{{$t("memberMembership.font4")}}：</span>
          <span class="value">{{ memberInfo.phone }}</span>
          <span class="operate" @click="phoneShow = true">{{$t("memberMembership.font5")}}</span>
        </li>
        <li>
          <span class="key">{{$t("memberMembership.font6")}}：</span>
          <span class="value">{{ memberInfo.email }}</span>
          <span class="operate" @click="openEmailActivate">{{ emailBtnText }}</span>
        </li>
      </ul>

<div v-show="$config.memAreaSubStatus">
        <p>{{$t("newFont.font6")}}</p>

        <div class="regionCbox">
          <el-checkbox-group v-model="memberInfo.region">
            <div v-for="item in regionList">
              <el-checkbox :label="item.id" :key="item.id" border>{{item.value==$t("newFont.font7")?$t("newFont.font8")
                :item.value}}</el-checkbox></div>
          </el-checkbox-group>
        </div>
      </div>

<!--      <p>選擇需要訂閱供水公告的區域（可多選）</p>-->
<!--      &lt;!&ndash; 填写地区 &ndash;&gt;-->
<!--      <div class="regionCbox">-->
<!--        <el-checkbox-group v-model="memberInfo.region">-->
<!--          <div v-for="item in regionList"><el-checkbox :label="item.id" :key="item.id" border>
{{item.value=='港珠澳大橋澳門口岸'?'港珠澳大橋澳門口岸管理區':item.value}}</el-checkbox></div>-->
<!--        </el-checkbox-group>-->
<!--      </div>-->

<div class="statement">{{$t("memberMembership.font7")}}
	  <span @click="statementShow = true;">《{{$t("memberMembership.font9")}}》</span>
	  <span @click="electronicShow=true">《{{$t("registerPhone.font19")}}》</span></div>
      <el-button class="deep-blue" round @click="onSubmit">{{$t("memberMembership.font8")}}</el-button>
    </div>
  

    <!-- 个人资料声明弹窗 -->
    <el-dialog
      :title='$t("registerPhone.font17")'
      width="80%"
      custom-class="statementShow"
      :visible.sync="statementShow"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">
        <div class="text item" v-html='$t("registerPhone.font18")'>
          
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button round type="primary" @click="statementShow = false">{{$t("dashboard.font13")}}</el-button>
      </span>
    </el-dialog>


    <!-- 電子服務及免責條款弹窗 -->
    <el-dialog
            :title='$t("billsPayment.font11")'
            width="80%"
            custom-class="statementShow"
            :visible.sync="electronicShow"
            :show-close="false"
            @open="noScroll('add')"
            @close="noScroll('remove')"
            center>
      <el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">
        <div class="text item" v-html='$t("billsPayment.font19")'>
      			
       
      		 </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
          <el-button round type="primary" @click="electronicShow = false">{{$t("dashboard.font13")}}</el-button>
        </span>
    </el-dialog>


    <!-- 邮箱激活弹窗 -->
    <el-dialog
      :title="emailTitle"
      width="80%"
      custom-class="dialog-common"
      :visible.sync="emailActivateShow"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <!-- 填写邮箱 -->
      <el-form ref="form" :rules="rules" :model="form">
        <el-form-item prop="email">
          <el-input class="underline" v-model="form.email" :placeholder='emailBtnText == $t("memberMembership.font11") ? 
      		  $t("forgotPassword.font17") : $t("registerEmail.font3")'></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round @click="emailActivateShow = false">{{$t("serviceSubscribe.font14")}}</el-button>
        <el-button round type="primary" @click="emailActivate">{{$t("billsPdf.font2")}} {{ emailBtnText }}</el-button>
      </span>
    </el-dialog>

    <!-- 修改手机号弹窗 -->
    <el-dialog
      :title="$t('memberMembership.font4')"
      width="85%"
      custom-class="dialog-common"
      :visible.sync="phoneShow"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <!-- 填写手机 -->
      <phone-verify ref="phoneVerify" :email="memberInfo.email" @emitEditPhone="emitEditPhone" />
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round @click="phoneShow = false">{{$t("serviceSubscribe.font14")}}</el-button>
        <el-button round type="primary" @click="editPhone">{{$t("billsPdf.font2")}}</el-button>
      </span>
    </el-dialog>


    <!-- 提示郵箱新增成 -->
    <el-dialog
            :title='$t("bills.font33")'
            width="80%"
            custom-class="dialog-common"
            :visible.sync="addEmailShow"
            :show-close="false"
            :append-to-body="true"
            @open="noScroll('add')"
            @opened="openedAddShow('addShow')"
            @close="closedAddShow"
            center>

      <div style="margin: 15px 0;font-size: 14px;">{{$t("memberMembership.font13")}}</div>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round type="primary" @click="addEmailShow=false">{{$t("billsPdf.font2")}}</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { validEmail } from '@/utils/validate'
import { getAreaList } from '@/api/user'
import { getBillList } from '@/api/bill'
import { updateAccount, saveAreaList } from '@/api/membership'
import phoneVerify from '@/components/PhoneVerify';
import Header from '@/components/Header'




export default {
  name: 'memberMembership',
  data(){
	  const validateEmail = (rule, value, callback) => {
	    if(value === ''){
	      callback(new Error(this.$t('registerEmail.font7')));
	    }else if (!validEmail(value)) {
	      callback(new Error(this.$t('registerEmail.font8')));
	    } else {
	      callback();
	    }
	  };
    return {
      regionList:[],
      statementShow:false,
      electronicShow:false,//电子条款是否显示
      phoneShow:false,
      emailActivateShow:false,
      emailTitle:'',
      memberInfo:{
        name:'',
        email:'',
        phone:'',
        idType:'',
        idNb:'',
        region:[],
      },
      form: {
        email: '',
      },
      rules: {
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
      },
      addEmailShow:false,
    }
  },
  components:{
    phoneVerify : phoneVerify,
    Header : Header,
  },
  created(){
    this.noScroll('remove');
    this.getRegionList();
    this.getUserInfo();
    this.$share();
  },
  computed:{
    emailBtnText(){
      return this.memberInfo.email ? this.$t('memberMembership.font5') : this.$t('memberMembership.font011');
    }
  },
  methods:{

    //关闭新增弹窗
    closedAddShow(){
      this.noScroll('remove')
      this.$refs['form'].resetFields();
    },
    //开启新增弹窗
    openedAddShow(ref){
      let refName = this.$refs[ref],
              input = refName.$el.querySelectorAll('input');
      //解决移动端弹出框点击输入框后背景层会移动
      for(let i=0;i<input.length;i++){
        input[i].onblur = function(){
          window.scroll(0,0);
        };
      }
    },


    //返回
    back(){
      this.$router.push('/');
    },
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
    //获取用户信息
    async getUserInfo(){
      let res = await getBillList('menu');
      if(res.code == 200){
        this.memberInfo.name = res.result.userName
        this.memberInfo.email = res.result.userEmail
        this.memberInfo.phone = res.result.userPhone
        this.memberInfo.idType = res.result.idType
        this.memberInfo.idNb = res.result.idNb
        this.memberInfo.region = res.result.addressList || []
      }
    },
    // 打开邮箱激活
    openEmailActivate(e){
      if(this.emailBtnText == this.$t('memberMembership.font011')){
        this.emailTitle = this.$t('memberMembership.font11');
      }else if(this.emailBtnText == this.$t('memberMembership.font5')){
        this.emailTitle = this.$t('memberMembership.font12');
      }
      this.emailActivateShow = true;
    },
    // 邮箱激活提交
    emailActivate() {
      this.$refs['form'].validate(async(valid) => {
        if(valid){
          // let data = {
          //   email:this.form.email,
          //   phoneNb:this.memberInfo.phone,
          //   code:'',
          // }
          //2020-05-27修改
          let data = {
            email:this.form.email,
            areaCode:'',
            phoneNb:'',
            code:'',
          }
          let res = await updateAccount(data);
          if(res.code == 200){
            this.memberInfo.email = data.email;
            this.emailActivateShow = false;
            this.addEmailShow=true;

          }
        }
      })
    },
    //修改手机号码
    editPhone(){
      this.$refs['phoneVerify'].editPhone();
    },
    //关闭手机号弹窗
    emitEditPhone(obj){
      this.phoneShow = obj.phoneShow;
      this.memberInfo.phone = obj.phone;
    },
    //保存
    async onSubmit(){
      let res = await saveAreaList(this.memberInfo.region);
      if(res.code == 200){
        this.$message(this.$t('serviceSubscribe.font11'))
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
  .el-form-item__content {
      line-height: 40px;
      position: relative;
      display: flex;
      align-items: center;
      font-size: 14px;
  }
</style>

<style lang="scss" scoped>
/*内容*/
.body{
  width: 85%;
  padding:15px;
  margin:15px auto;
  /*font-size: 16px;*/
  font-size:0.4266666666666667rem;
  border-radius:8px;
  background:#fff;
  color: #666;
  ul li{
    border-bottom: 1px solid #E6E6E6;
    padding-bottom: 16px;
    margin-bottom: 16px;
    display: flex;
    align-items:center;
    justify-content: space-between;
    .key{
      /*width: 85px;*/
      /*display:inline-block;*/
    }
    .value{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      width: 150px;
      display: inline-block;
    }
	.spanwidth{
		width: 210px;
	}
    .operate{
      float: right;
      color: #4E8CEE;
    }
  }
  p{
    margin-bottom: 10px;
  }
  .statement{
    margin-bottom: 10px;
    font-size: 12px;
    span{
      color: #245DC4;
    }
  }
  .el-button{
    width: 100%;
  }
}
/*填写地区*/
.regionCbox{
  width: 100%;
}
.regionCbox .el-checkbox{
  width: 100%;
  margin-bottom: 10px;
}
/*个人资料声明弹窗*/
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
