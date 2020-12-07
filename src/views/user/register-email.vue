<template>
  <div class="main">

    <!-- 页头 -->
    <div class="header">
      <!-- 返回 -->
      <div class="back" @click="back">
        <i class="el-icon-arrow-left"></i>
      </div>
      <!-- 步骤条 -->
      <el-steps :active="0" finish-status="success">
        <el-step ></el-step>
        <el-step ></el-step>
        <el-step ></el-step>
      </el-steps>
    </div>

    <!-- 内容 -->
    <div class="body">
      <!-- 标题 -->
      <div class="title">{{$t('registerPhone.font16')}}<span @click="lockStatement">{{$i18n.locale=='ZH'?'《':'"'}}{{$t('registerPhone.font17')}}{{$i18n.locale=='ZH'?'》':'"'}}</span><span @click="electronicShow=true">{{$i18n.locale=='ZH'?'《':'"'}}{{$t('registerPhone.font19')}}{{$i18n.locale=='ZH'?'》':'"'}}</span></div>
      
      <!-- 填写邮箱 -->
      <el-form ref="form" :rules="rules" :model="form" label-width="82px">
        <el-form-item :label='$t("registerEmail.font1")' prop="email">
          <el-input class="underline" v-model="form.email" :placeholder='$t("registerEmail.font3")'></el-input>
        </el-form-item>
        <el-form-item :label='$t("registerEmail.font2")' prop="pass">
          <el-input class="underline" type="password" v-model="form.pass" :placeholder='$t("registerEmail.font4")'></el-input>
        </el-form-item>
      </el-form>

      <!-- 忘记密码 -->
      <el-button type="text" class="forget-pass" @click="forgetPass">{{$t("registerEmail.font5")}}</el-button>

      <!-- 下一步 -->
      <div class="next-step">
        <div class="statement"><el-checkbox v-model="statementCbox">{{$t("registerEmail.font6")}}</el-checkbox>
      		<span class="text" @click="lockStatement">{{$i18n.locale=='ZH'?'《':'"'}}{{$t('registerPhone.font17')}}{{$i18n.locale=='ZH'?'》':'"'}}</span><br><span class="text" @click="electronicShow=true">{{$i18n.locale=='ZH'?'《':'"'}}{{$t('registerPhone.font19')}}{{$i18n.locale=='ZH'?'》':'"'}}</span></div>
        <el-button class="deep-blue" round @click="onSubmit">{{$t('registerPhone.font21')}}</el-button>
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
          <div class="text item" v-html='$t("registerPhone.font18")'></div>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button round type="primary" @click="statementShow = false">{{this.$t('dashboard.font13')}}</el-button>
        </span>
      </el-dialog>


      <!-- 電子服務及免責條款弹窗 -->
      <el-dialog
              :title='$t("registerPhone.font19")'
              width="80%"
              custom-class="statementShow"
              :visible.sync="electronicShow"
              :show-close="false"
              @open="noScroll('add')"
              @close="noScroll('remove')"
              center>
       <el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">
         <div class="text item" v-html='$t("registerPhone.font20")'>
       
         </div>
       </el-card>
       <span slot="footer" class="dialog-footer">
         <el-button round type="primary" @click="electronicShow = false">{{this.$t('dashboard.font13')}}</el-button>
       </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>

import { validEmail } from '@/utils/validate'
import md5 from 'js-md5'
import { verifyEmailApi } from '@/api/user'
import { setToken,getToken } from '@/utils/auth'


var validateEmail = (rule, value, callback) => {
  if(value === ''){
    callback(new Error(this.$t('registerEmail.font7')));
  }else if (!validEmail(value)) {
    callback(new Error(this.$t('registerEmail.font8')));
  } else {
    callback();
  }
};

const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error(this.$t('registerEmail.font9')))
  } else {
    callback()
  }
}

export default {
  name: 'RegisterPhone',
  data(){
    return {
      statementCbox: false,
      statementShow: false,
      electronicShow:false,//电子条款是否显示
      form: {
        email: '',
        pass: '',
      },
      rules: {
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePassword, trigger: 'blur'}
        ]
      },


    }
  },
  created(){
    //更新openId
    if(!getToken()){
      setToken(this.$route.query.openId);
    }

    this.$share();
  },
  mounted () {
    //解决安卓手机点击输入框底部按钮被置顶的问题
    const that = this;
    var originalHeight=document.documentElement.clientHeight ||document.body.clientHeight;
    let btn = document.querySelector('.next-step');
    window.onresize = () => {
      var resizeHeight=document.documentElement.clientHeight || document.body.clientHeight;
      if(resizeHeight-0<originalHeight-0){//当软键盘弹起，在此处操作
       btn.style.display = 'none';
      }else{//当软键盘收起，在此处操作
       btn.style.display = 'block';
      }
    }
  },
  methods:{
    //测试
    test(val){
      console.log('测试')
    },
    //提交
    onSubmit(){
      let unbindToken = this.$route.query.unbindToken;
      this.$refs['form'].validate(async(valid) => {
        if(valid){
          if(!this.statementCbox){
            this.$message(this.$t('registerEmail.font10'));
          }else{
            let data = {
              email : this.form.email,
              password : 'sz' + md5(this.form.pass.toLowerCase()) + 'sw',
              unbindToken: unbindToken || '',
            }
            let res = await verifyEmailApi(data);
            if(res.code == 200){
              let path = null;
              if(unbindToken){
                path = '/user/register-region';
              }else{
                path = '/user/register-phone';
              }
              this.$router.push({
                path:path,
                query:{
                  email: this.form.email,
                  pass: data.password,
                  bindToken: res.result.bindToken,
                  unbindToken: this.$route.query.unbindToken,
                }
              });
              this.$message(this.$t('registerEmail.font11'))
            }
          }
        }

      })
    },
    //返回
    back(){
      this.$router.push('/user');
    },
    //查看声明
    lockStatement(){
      this.statementShow = true;
    },
    //忘记密码
    forgetPass(){
      // window.location.href = 'https://www.macaowater.com/forgot-password';
      this.$router.push('/user/forgot-password');
    }
  }
}
</script>

<style>
  /*声明*/
  .statement .el-checkbox{
    margin-right: 0;
  }
  .statementShow .el-dialog__body{
    padding:0 20px;
  }
  .statementShow .el-dialog__title{
    color:#528EEF;
  }
  .el-form .el-form-item__label{
    text-align: left;
    border-bottom: 1px solid #DCDFE6;
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
  height: calc(100vh - 95px);
}
/*标题*/
.title{
  font-size: 12px;
  color: #D49135;
  background:rgba(255,245,231,1);
  border-radius:4px;
  padding:15px 12px;
  margin-bottom: 15px;
  span{
    color:#4E8CEE;
  }
}
/*声明*/
.statement{
  text-align:center;
  margin-bottom: 10px;
  .text{
    color: #235EC6;
    font-size: 14px;

  }
}
/*下一步*/
.next-step{
  position: absolute;
  bottom: 20px;
  width: 85%;
  .el-button{
    width: 100%;
  }
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
// 忘记密码
.forget-pass{
  float: right;
  position: relative;
  top: -15px;
}
</style>
