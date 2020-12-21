<template>
    <div class="main">

        <!-- 页头 -->
        <div class="header">
            <!-- 返回 -->
            <div class="back" @click="back">
                <i class="el-icon-arrow-left"></i>
            </div>
            <!-- 步骤条 -->
            <el-steps :active="stepsIndex" finish-status="success" v-if="stepsIndex==0||stepsIndex==1||stepsIndex==2">
                <el-step></el-step>
                <el-step></el-step>
                <el-step></el-step>
            </el-steps>
        </div>

        <!-- 内容 -->
        <div class="body">

            <template v-if="stepsIndex==0">
                <!-- 标题 -->
                <div class="title">{{$t('registerPhone.font16')}}
                <span @click="lockStatement">{{$i18n.locale=='ZH'?'《':'《'}}{{$t('registerPhone.font17')}}{{$i18n.locale=='ZH'?'》':'》'}}</span>
                <span @click="electronicShow=true">{{$i18n.locale=='ZH'?'《':'《'}}{{$t('registerPhone.font19')}}{{$i18n.locale=='ZH'?'》':'》'}}</span>
                </div>

                <!-- 填写邮箱 -->
                <el-form ref="form" :rules="rules" :model="form" label-width="160px">
                    <el-form-item :label='$t("forgotPassword.font16")' prop="email">
                        <el-input class="underline" v-model="form.email" :placeholder='$t("forgotPassword.font17")'></el-input>
                    </el-form-item>
                </el-form>
                <!-- 下一步 -->
                <div class="next-step">
                    <div class="statement"><el-checkbox v-model="statementCbox">{{$t("registerEmail.font6")}}</el-checkbox>
                	<span class="text" @click="lockStatement">{{$i18n.locale=='ZH'?'《':'《'}}{{$t('registerPhone.font17')}}{{$i18n.locale=='ZH'?'》':'》'}}</span><br>
                	<span class="text" @click="electronicShow=true">{{$i18n.locale=='ZH'?'《':'《'}}{{$t('registerPhone.font19')}}{{$i18n.locale=='ZH'?'》':'》'}}</span></div>
                    <el-button class="deep-blue" round @click="onSubmitSendCode">{{$t("forgotPassword.font1")}}</el-button>
                </div>
            </template>

            <!--设置完成-->
            <template v-if="stepsIndex==-1">
                <div class="title">
                    {{$t("forgotPassword.font2")[0]}} <span> {{form.email}} </span> {{$t("forgotPassword.font2")[1]}}
                </div>
                <div class="next-step">
                    <el-button class="baby-brown" round @click="$router.push('/user')">{{$t("forgotPassword.font3")}}</el-button>
                    <el-button class="deep-blue" style="margin-left: 0;margin-top: 15px" round @click="stepsIndex=0">{{$t("forgotPassword.font4")}}</el-button>
                </div>
            </template>


            <template v-if="stepsIndex==1">
                <!-- 标题 -->
                <div class="title">
                    {{$t("forgotPassword.font5")[0]}} <span> {{form.email}} </span>  {{$t("forgotPassword.font5")[1]}}
                </div>
                <!-- 填写驗證碼 -->
                <el-form ref="form" class="code-form" :rules="rules" :model="form" label-width="82px">
                    <el-form-item :label='$t("forgotPassword.font6")' prop="code" style="border-bottom: 1px solid #DCDFE6;">
                        <el-col :span="14">
                            <el-input class="underline" v-model="form.code" :placeholder='$t("forgotPassword.font7")'></el-input>
                        </el-col>
                        <el-col :span="10">
                            <div class="get-code"  @click="sendMsg" :style="{ color: code.disabled ? '#c6c6c6' : '#4E8CEE' }">{{ code.text }}</div>
                        </el-col>
                    </el-form-item>
                </el-form>
                <div class="next-step">
                    <el-button class="deep-blue" round @click="onSubmitValidationCode">{{$t("registerPhone.font21")}}</el-button>
                </div>
            </template>

<!--            填写密码-->
            <template v-if="stepsIndex==2">
                <div class="title">
                    {{$t("forgotPassword.font8")[0]}} <span> {{form.email}} </span> {{$t("forgotPassword.font8")[1]}}
                </div>
                <el-form ref="form" :rules="rules" :model="form" label-width="105px">
                    <el-form-item :label='$t("forgotPassword.font9")' prop="password1">
                        <el-input class="underline" type="password" v-model="form.password1" :placeholder='$t("forgotPassword.font11")'></el-input>
                    </el-form-item>
                    <el-form-item :label='$t("forgotPassword.font10")' prop="password2">
                        <el-input class="underline" type="password" v-model="form.password2" :placeholder='$t("forgotPassword.font12")'></el-input>
                    </el-form-item>
                </el-form>
                <!-- 下一步 -->
                <div class="next-step">
                    <el-button class="deep-blue" round @click="onSubmitResetPwd">{{$t("registerPhone.font21")}}</el-button>
                </div>
            </template>

            <!--设置完成-->
            <template v-if="stepsIndex==3">
                <div class="title">
                    {{$t("forgotPassword.font13")[0]}}  <span> {{form.email}} </span> {{$t("forgotPassword.font13")[1]}}
                </div>
                <div class="next-step">
                    <el-button class="deep-blue" round @click="$router.back()">{{$t("forgotPassword.font14")}}</el-button>
                </div>
            </template>

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

    import {validEmail} from '@/utils/validate'
    import md5 from 'js-md5'
    import {verifyEmailApi,getEmailCode,checkEmailCode,resetPwd} from '@/api/user'
    import {setToken, getToken} from '@/utils/auth'


    
	export default {
        name: 'RegisterPhone',
        data() {
			var validateEmail = (rule, value, callback) => {
			    if (value === '') {
			        callback(new Error(this.$t("registerEmail.font7")));
			    } else if (!validEmail(value)) {
			        callback(new Error(this.$t("registerEmail.font8")));
			    } else {
			        callback();
			    }
			};
			
			const validateEmailCode = (rule, value, callback) => {
			    if (value==='') {
			        callback(new Error(this.$t("forgotPassword.font7")))
			    } else {
			        callback()
			    }
			}
			const validatePasswordA = (rule, value, callback) => {
			    if (value==='') {
			        callback(new Error(this.$t("forgotPassword.font9")))
			    }else if(value.length < 6){
			        callback(new Error(this.$t("forgotPassword.font18")))
			    }else {
			        callback()
			    }
			}
			const validatePasswordB = (rule, value, callback) => {
			    if (value==='') {
			        callback(new Error(this.$t("forgotPassword.font12")))
			    }else if(value.length < 6){
			        callback(new Error(this.$t("forgotPassword.font18")))
			    } else {
			        callback()
			    }
			}
			
            return {
                statementCbox: false,
                statementShow: false,
                electronicShow:false,//电子条款是否显示
                form: {
                    memberNb:'',
                    email: '',
                    code: '',
                    password1:'',
                    password2:''
                },
                code:{
                    sendIng:false,
                    disabled:false,
                    time:60,
                    text:this.$t("forgotPassword.font1")
                },
                rules: {
                    email: [
                        {validator: validateEmail, trigger: 'blur'}
                    ],
                    code: [
                        {validator: validateEmailCode, trigger: 'blur'}
                    ],
                    password1: [
                        {validator: validatePasswordA, trigger: 'blur'}
                    ],
                    password2: [
                        {validator: validatePasswordB, trigger: 'blur'}
                    ]
                },

                stepsIndex:0,

            }
        },
        created() {
            //更新openId
            if (!getToken()) {
                setToken(this.$route.query.openId);
            }

            this.$share();
        },
        mounted() {
            //解决安卓手机点击输入框底部按钮被置顶的问题
            const that = this;
            var originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
            let btn = document.querySelector('.next-step');
            window.onresize = () => {
                var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
                if (resizeHeight - 0 < originalHeight - 0) {//当软键盘弹起，在此处操作
                    btn.style.display = 'none';
                } else {//当软键盘收起，在此处操作
                    btn.style.display = 'block';
                }
            }
        },
        methods: {
            onSubmitSendCode() {
                let that=this
                that.$refs['form'].validate(async (valid) => {
                    if (valid) {
                        if (!that.statementCbox) {
                            that.$message(this.$t('registerEmail.font10'));
                        } else {
                            that.sendMsg();
                        }
                    }
                })
            },
            //重新发送验证码
            async sendMsg() {
                let that = this;
                if(that.code.disabled||that.code.sendIng){
                    return false;
                }else{
                    that.code.sendIng=true
                    let phoneRes = await getEmailCode(that.form.email);
                    if(phoneRes.code == 200){
                        that.$message(this.$t("registerPhone.font12"))
                        that.form.memberNb=phoneRes.data.memberNb
                        let code = that.code;
                        code.disabled = true;
                        code.text =window.localStorage.getItem('language')=='ZH'?code.time + that.$t("registerPhone.font13"): that.$t("registerPhone.font13")+code.time+'s';
                        let interval = setInterval(function() {
                            --code.time;
                            code.text =window.localStorage.getItem('language')=='ZH'?code.time + that.$t("registerPhone.font13"): that.$t("registerPhone.font13")+code.time+'s';
                            if(code.time < 1) {
                                code.text = that.$t("registerPhone.font14");
                                code.time = 60;
                                code.disabled = false;
                                clearInterval(interval);
                            }
                        }, 1000);
                        this.stepsIndex=1
                    }else if(phoneRes.code == 201){
                        this.stepsIndex=-1
                    }
                    that.code.sendIng=false
                }
            },

            //繳驗驗證碼
            onSubmitValidationCode(){
                let that=this
                that.$refs['form'].validate(async (valid) => {
                    if (valid) {
                        let data={
                            lbEmail:that.form.email,  // 郵箱
                            code:that.form.code // 驗證碼
                        }
                        let result = await checkEmailCode(data);
                        if(result.code==200){
                            that.stepsIndex=2
                        }else {
                            that.$message(this.$t("forgotPassword.font19"))
                        }
                    }

                })
            },

            //重置密碼
            onSubmitResetPwd(){
                let that=this
                that.$refs['form'].validate(async (valid) => {
                    if (valid) {
                        if(that.form.password1!=that.form.password2){
                            that.$message(this.$t("forgotPassword.font15"));
                        }else {
                            let data={
                                // newPassword:that.form.password1,
                                // confirmNewPassword:that.form.password2,
                                newPassword : 'sz' + md5(that.form.password1.toLowerCase()) + 'sw',
                                confirmNewPassword : 'sz' + md5(that.form.password2.toLowerCase()) + 'sw',
                                memberNb:that.form.memberNb,



                            }
                            let result = await resetPwd(data);
                            if(result.code==200){
                                that.stepsIndex=3
                            }else {
                                that.$message(this.$t("forgotPassword.font15"))
                            }
                        }
                    }
                })
            },






            //测试
            test(val) {
                console.log('测试')
            },
            //提交
            onSubmit() {
                let unbindToken = this.$route.query.unbindToken;
                this.$refs['form'].validate(async (valid) => {
                    if (valid) {
                        if (!this.statementCbox) {
                            this.$message(this.$t('registerEmail.font10'));
                        } else {
                            let data = {
                                email: this.form.email,
                                password: 'sz' + md5(this.form.pass.toLowerCase()) + 'sw',
                                unbindToken: unbindToken || '',
                            }
                            let res = await verifyEmailApi(data);
                            if (res.code == 200) {
                                let path = null;
                                if (unbindToken) {
                                    path = '/user/register-region';
                                } else {
                                    path = '/user/register-phone';
                                }
                                this.$router.push({
                                    path: path,
                                    query: {
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
            back() {
                this.$router.back()
            },
            //查看声明
            lockStatement() {
                this.statementShow = true;
            },
            //忘记密码
            forgetPass() {
                window.location.href = 'https://www.macaowater.com/forgot-password';
            }
        }
    }
</script>

<style>
    /*声明*/
    .statement .el-checkbox {
        margin-right: 0;
    }

    .statementShow .el-dialog__body {
        padding: 0 20px;
    }

    .statementShow .el-dialog__title {
        color: #528EEF;
    }

    .el-form .el-form-item__label {
        text-align: left;
        border-bottom: 1px solid #DCDFE6;
    }

    .code-form .el-form-item__label {
        border-bottom: 0 !important;
    }
    .code-form .el-input .el-input__inner {
        border-bottom: 0 !important;
    }

</style>

<style lang="scss" scoped>
    /*页头*/
    .header {
        background: linear-gradient(90deg, rgba(62, 100, 171, 1) 0%, rgba(17, 28, 97, 1) 100%);
        box-shadow: 4px 7px 16px 0px rgba(0, 0, 0, 0.2);
        height: 45px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        // 返回
        .back {
            position: absolute;
            left: 10px;

            i {
                font-size: 20px;
                color: #fff;
                font-weight: bold;
            }
        }

        // 步骤条
        .el-steps {
            width: 50%;
            height: 24px;
        }
    }

    /*内容*/
    .body {
        background: rgba(255, 255, 255, 1);
        border-radius: 8px;
        padding: 15px;
        width: 85%;
        margin: 10px auto;
        box-shadow: 0px 0px 10px #ddd;
        height: calc(100vh - 95px);
    }

    /*标题*/
    .title {
        font-size: 12px;
        color: #D49135;
        background: rgba(255, 245, 231, 1);
        border-radius: 4px;
        padding: 15px 12px;
        margin-bottom: 15px;

        span {
            color: #4E8CEE;
        }
    }

    /*声明*/
    .statement {
        text-align: center;
        margin-bottom: 10px;

        .text {
            color: #235EC6;
            font-size: 14px;

        }
    }

    /*下一步*/
    .next-step {
        position: absolute;
        bottom: 20px;
        width: 85%;

        .el-button {
            width: 100%;
        }
    }

    /*个人资料声明弹窗*/
    .statementShow {
        .box-card {
            max-height: 200px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            margin: 15px 0;

            .text p {
                font-size: 12px;
                padding-bottom: 5px;
            }
        }
    }



    /*.get-code{*/
    /*    width: 100%;*/
    /*    background:rgba(189,193,209,1);*/
    /*    opacity:1;*/
    /*    border-radius:4px;*/
    /*    font-size: 14px;*/
    /*    color: #ffffff;*/
    /*    text-align: center;*/
    /*}*/

    .get-code{
        text-align:center;
    }
</style>
