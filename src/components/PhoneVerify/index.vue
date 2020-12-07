<template>
  <div>
    <!-- 填写手机 -->
    <el-form ref="form" class="phone-verify" :rules="rules" :model="form">
      <el-form-item :class="showError?'show':'hide'">
        <el-col :span="7">
          <div class="region" @click="regionShow = true">{{ form.phoneRegion }}<i class="el-icon-arrow-down"></i><el-divider direction="vertical"></el-divider></div>
        </el-col>
        <el-col :span="17">
          <el-form-item prop="phone" class="disposePhone">
            <el-input class="underline" v-model="form.phone" :placeholder='$t("registerPhone.font1")'></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item prop="code" :class="showCodeError?'show':'hide'">
        <el-col :span="17">
          <el-input class="underline" v-model="form.code" maxlength="4" :placeholder='$t("registerPhone.font2")'></el-input>
        </el-col>
        <el-col :span="7">
          <div class="get-code" @click="sendMsg" :style="{ color: code.disabled ? '#c6c6c6' : '#4E8CEE' }" v-html="code.text"></div>
        </el-col>
      </el-form-item>
    </el-form>
    <!-- 地区弹窗 -->
    <van-popup
      v-model="regionShow"
      @close="regionClose"
      z-index="9999"
      position="bottom">
      <van-picker
        ref="regionpicker"
        :confirm-button-text='$t("registerPhone.font3")'
        :cancel-button-text='$t("serviceSubscribe.font14")'
        :default-index="pickerIndex"
        show-toolbar
        :columns="phoneRegionList"
        @cancel="regionShow = false"
        @confirm="regionConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import { validPhone } from '@/utils/validate'
import { getCode, verifyCode, phoneVerify } from '@/api/user'
import { updateAccount } from '@/api/membership'
import { Popup, Picker } from 'vant';



export default {
  name: 'PhoneVerify',
  props: {
    email:{
      type: String,
    },
    statementCbox:{
      type: Boolean,
      default: true
    },
  },
  data(){
	  const validatePhone11 = (rule, value, callback) => {
	    if(value === ''){
	      callback(new Error(this.$t("registerPhone.font1")));
	    }else if (!validPhone(value)) {
	      callback(new Error(this.$t(this.$t("registerPhone.font4")[0]+'11'+this.$t("registerPhone.font4")[1])));
	    } else {
	      callback();
	    }
	  };
	  const validatePhone8 = (rule, value, callback) => {
	  	
	    if(value === ''){
	  	  
	      callback(new Error(this.$t("registerPhone.font1")));
	    }else if (!/^\d{8}$/.test(value)) {
	      callback(new Error(this.$t("registerPhone.font4")[0]+'8'+this.$t("registerPhone.font4")[1]));
	    } else {
	      callback();
	    }
	  };
    return {
      pickerIndex: 0,
      regionShow: false,
	  showError:false,
	  showCodeError:false,
      code:{
        sendIng:false,
        disabled:false,
        time:60,
        text:this.$t("registerPhone.font5")
      },
	  validatePhone8:validatePhone8,
	  validatePhone11:validatePhone11,
      form: {
        areaCode:853,
        phoneRegion:this.$t("registerPhone.font9"),
        phoneRegionId:2,
        phone: '',
        code: '',
      },
      rules: {
        phone: [
          { validator: validatePhone8, trigger: 'change' }
        ],
        code: [
          { required: true, message: this.$t("registerPhone.font6"), trigger: 'change'},
          { min: 4, message: this.$t("registerPhone.font7"), trigger: 'change'},
          { max: 4, message: this.$t("registerPhone.font8"), trigger: 'change'},
        ],
      },
      phoneRegionList:[
        {text:this.$t("registerPhone.font9"),id:2,areaCode:853},
        {text:this.$t("registerPhone.font10"),id:3,areaCode:852},
        {text:this.$t("registerPhone.font11"),id:1,areaCode:86},
      ]
    }
  },
  components:{
    [Popup.name]: Popup,
    [Picker.name]: Picker,
  },
  watch:{
	  /*
    'form.phoneRegion'(val){
      if(val == '內地'){
        this.form.areaCode = 86;
        this.rules['phone'][0]['validator'] = validatePhone11;
      }else{
        if(val == '澳門'){
          this.form.areaCode = 853;
        }else if(val == '香港'){
          this.form.areaCode = 852;
        }
        this.rules['phone'][0]['validator'] = validatePhone8;
      }
    }*/
	
	'form.phoneRegionId'(val){
		console.log(val)
		console.log(this.form.phoneRegionId)
	  if(val == 1){
	    this.form.areaCode = 86;
	    this.rules['phone'][0]['validator'] = this.validatePhone11;
	  }else{
	    if(val == 2){
	      this.form.areaCode = 853;
	    }else if(val == 3){
	      this.form.areaCode = 852;
	    }
		
	    this.rules['phone'][0]['validator'] = this.validatePhone8;
	  }
	}
  },
  methods:{
    //发送验证码
    sendMsg() {

      if(this.code.disabled||this.code.sendIng){
        return false;
      }else{
        let that = this;
		this.showError=true;
        this.$refs['form'].clearValidate(['code']);
		console.log('1')
        this.$refs['form'].validateField('phone',async (valid) => {
			console.log('0')
          if(!valid){
			  
            that.code.sendIng=true
            let phoneRes = await phoneVerify(that.form.phone);
            if(phoneRes.code == 200){
				
              let res = await getCode(that.form.phone, that.form.phoneRegionId);
              if(res.code == 200){
                that.$message(that.$t("registerPhone.font12"))
                let code = that.code;
                code.disabled = true;
                code.text =that.$i18n.locale=='ZH'?code.time + that.$t("registerPhone.font13"): that.$t("registerPhone.font14")+'<br/>'+that.$t("registerPhone.font13")+code.time+'s';
                let interval = setInterval(function() {
                  --code.time;
                  code.text = that.$i18n.locale=='ZH'?code.time + that.$t("registerPhone.font13"): that.$t("registerPhone.font14")+'<br/>'+that.$t("registerPhone.font13")+code.time+'s';
                  if(code.time < 1) {
                    code.text = that.$t("registerPhone.font14");
                    code.time = 60;
                    code.disabled = false;
                    clearInterval(interval);
                  }
                }, 1000);
              }
            }
            that.code.sendIng=false

          }
        })
      }
    },
    //打开地区弹窗
    regionClose(){
      this.$refs['regionpicker'].setColumnIndex(0,this.pickerIndex)
    },
    //地区确认
    regionConfirm(data){
      this.form.phoneRegion = data.text;
      this.form.phoneRegionId = data.id;
      this.regionShow = false;
	  
      let index = this.$refs['regionpicker'].getColumnIndex(0);
      this.pickerIndex = index;
	  
	  
    },
    //手机注册提交
    onSubmit(){

		this.showCodeError=true;
		this.showError=true;
      this.$refs['form'].validate(async(valid) => {
        if(valid){

          if(this.statementCbox==false){
            this.$message(this.$t('registerEmail.font10'));
            return false;
          }

          let data = {
            verifyCode : this.form.code,
            phoneNumber : this.form.phone,
            phoneRegionId : this.form.phoneRegionId,
          }
          let res = await verifyCode(data);
          if(res.code == 200){
            this.$router.push({
              path:'/user/register-region',
              query:{
                phone: this.form.phone,
                areaCode: this.form.areaCode,
                phoneRegionId: this.form.phoneRegionId,
                email: this.$route.query.email,
                pass: this.$route.query.pass,
                bindToken: this.$route.query.bindToken,
              }
            });
            this.$message(this.$t("registerPhone.font15"))
          }
        }
      })
    },
    // 修改手机号
    editPhone(){
		this.showCodeError=true;
		this.showError=true;
      this.$refs['form'].validate(async(valid) => {
        if(valid){
          // let data = {
          //   email : this.email || '',
          //   phoneNb : this.form.phone,
          //   code : '',
          // }
          //2020-05-27修改
          let data = {
            email :'',
            phoneNb : this.form.phone,
            areaCode:this.form.areaCode,
            code : this.form.code,
          }
          let res = await updateAccount(data);
          if(res.code == 200){
            this.$emit('emitEditPhone',{
              phone : this.form.phone,
              phoneShow : false,
            });
            this.$message(this.$t("registerPhone.font23"))
          }
        }
      })
    },
  }
}
</script>

<style lang="scss">
  .phone-verify{
    .underline input{
      border-bottom:0;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
    }
    .el-form-item__content{
      font-size: 14px;
      border-bottom: 1px solid #DCDFE6;
    }
    .disposePhone .el-form-item__content{
      border-bottom: 0;
    }
  }

</style>

<style lang="scss" scoped>
// 地区
.region{
  text-align:center;
  font-size:14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
// 获取验证码
.get-code{
  text-align:center;
  line-height: 0.4rem;
}


</style>
