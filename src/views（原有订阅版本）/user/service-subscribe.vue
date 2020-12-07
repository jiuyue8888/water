<template>
    <div class="main">

        <!-- 页头 -->
        <!--    <div class="header">-->
        <!--      <div class="back" @click="back">-->
        <!--        <i class="el-icon-arrow-left" ></i>-->
        <!--      </div>-->
        <!--    </div>-->

        <Header metaTitle="主頁"/>
        <!-- 内容 -->
        <div class="body">
            <div class="body-title">停水區域訂閱</div>

            <el-collapse class="subscribe-div" v-model="subscribeType" accordion>
                <el-collapse-item title="關閉" class="first" :name="0" :disabled="subscribeType==0">
                    <i class="el-icon-check check"></i>
                </el-collapse-item>

                <el-collapse-item title="根據合同號推送" :name="1" :disabled="subscribeType==1||bodyList.length==0">
                    <i class="el-icon-check check"></i>
                    <!-- 填写地区 -->
                    <div class="region">
                        <el-checkbox-group v-model="body">
                            <div v-for="item in bodyList">
                                <el-checkbox :label="item.id" :key="item.id" border>
                                    {{item.value}}
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                        <template v-if="bodyList.length!=0">
                            <div class="all-select" v-if="body.length==bodyList.length" @click="bodySelectAll(false)">取消全選
                            </div>
                            <div class="all-select" v-else @click="bodySelectAll(true)">全選</div>
                        </template>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="區域訂閱" :name="2" :disabled="subscribeType==2">
                    <i class="el-icon-check check"></i>
                    <!-- 填写地区 -->
                    <div class="region">
                        <el-checkbox-group v-model="region">
                            <div v-for="item in regionList">
                                <el-checkbox :label="item.id" :key="item.id" border>
                                    {{item.value=='港珠澳大橋澳門口岸'?'港珠澳大橋澳門口岸管理區':item.value}}
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                        <div class="all-select" v-if="region.length==regionList.length" @click="regionSelectAll(false)">
                            取消全選
                        </div>
                        <div class="all-select" v-else @click="regionSelectAll(true)">全選</div>

                    </div>
                </el-collapse-item>
            </el-collapse>



        </div>

        <!-- 下一步 -->
        <div class="next-step">
            <el-button class="deep-blue" :loading="buttonLoading" :disabled="buttondDisabled" round @click="saveClick">保存設置</el-button>
        </div>
        <!-- 使用服務訂閱 -->
        <el-dialog
                title="使用服務訂閱功能前請認真閱讀《訂閱聲明》"
                width="80%"
                custom-class="regionModalShow"
                :visible.sync="statementShow"
                :show-close="false"
                @open="noScroll('add')"
                @close="noScroll('remove')"
                center>
            <i class="el-icon-close"  @click="statementShow = false"></i>
            <el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">
                <div class="text item">
                    <p>訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明</p>
                    <p>訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明</p>
                    <p>訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明</p>
                    <p>訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明</p>
                    <p>訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明</p>
                    <p>訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明</p>
                    <p>訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明</p>
                    <p>訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明</p>
                    <p>訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明</p>
                    <p>訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明訂閱聲明</p>

                </div>
            </el-card>
            <div class="term-tip">點擊確定即代表您已閱讀並同意以上所有條款。</div>
            <div slot="footer" class="dialog-footer">
                <el-button round @click="statementShow = false">取消</el-button>
                <el-button round type="primary" @click="onSubmit">確定</el-button>
           </div>
        </el-dialog>

        <!-- 关闭服務訂閱 -->
        <el-dialog
                title="關閉服務訂閱功能前請認真閱讀《訂閱聲明》"
                width="80%"
                custom-class="regionModalShow"
                :visible.sync="closeStatementShow"
                :show-close="false"
                @open="noScroll('add')"
                @close="noScroll('remove')"
                center>
            <i class="el-icon-close"  @click="closeStatementShow = false"></i>
            <el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">
                <div class="text item">
                    <p>關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務</p>
                    <p>關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務</p>
                    <p>關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務</p>
                    <p>關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務</p>
                    <p>關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務</p>
                    <p>關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務</p>

                </div>
            </el-card>
            <div class="term-tip">點擊確定即代表您已閱讀並同意以上所有條款。</div>
            <div slot="footer" class="dialog-footer">
                <el-button round @click="closeStatementShow = false">取消</el-button>
                <el-button round type="primary" @click="onSubmit">確定</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>

    import {userRegister, getAreaList} from '@/api/user'
    import {getToken} from '@/utils/auth'
    import Header from '@/components/Header'

    import {getMspList, getBodyNbs, townList, mspReg} from '@/api/membership'


    export default {
        name: 'RegisterRegion',
        components: {
            Header: Header
        },
        data() {
            return {
                isEmail: this.$route.query.email ? true : false,
                regionShow: false,
                region: [],
                regionList: [],
                body: [],
                bodyList: [],
                subscribeType: -1,
                oldSubscribeType: -2,

                statementShow: false, //開啟訂閱
                closeStatementShow:false,//關閉訂閱

                buttonLoading: false,

                buttondDisabled:false,


            }
        },
        watch: {
            body(data) {
                this.buttondDisabled=data.length==0?true:false
            },
            region(data) {
                this.buttondDisabled=data.length==0?true:false
            },
            subscribeType: {
                handler(data) {
                    if(data==1){
                        this.buttondDisabled=this.body.length==0?true:false
                    }else if(data==2){
                        this.buttondDisabled=this.region.length==0?true:false
                    }else {
                        this.buttondDisabled=false
                    }
                },
                immediate: true
            },
        },
        async created() {
            // this.getRegionList();

            this.loading = this.$loading({
                lock: true,
                text: '加載數據中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            this.getSubscribeType()

        },
        methods: {
            bodySelectAll(auto) {
                let body = []
                if (auto == true) {
                    for (let i in this.bodyList) {
                        body.push(this.bodyList[i].id)
                    }
                }
                this.body = body
            },
            regionSelectAll(auto) {
                let region = []
                if (auto == true) {
                    for (let i in this.regionList) {
                        region.push(this.regionList[i].id)
                    }
                }
                this.region = region
            },

            async getSubscribeType() {
                let result = await getMspList()
                let subscribeType = Number(result.data.subWaterStopType)
                this.subscribeType = subscribeType
                this.oldSubscribeType = Number(result.data.subWaterStopType)
                if (subscribeType == 1) {
                    let body = []
                    result.data.result.forEach(item => {
                        body.push(Number(item.bodyNb))
                    })
                    this.body = body
                } else if (subscribeType == 2) {
                    let region = []
                    result.data.result.forEach(item => {
                        region.push(item.townCd)
                    })
                    this.region = region
                }

                let townResult = await townList()
                if (townResult.code == 200) {
                    let arr = [];
                    townResult.data.forEach(item => {
                        arr.push({id: item.cd, value: item.lb})
                    })
                    this.regionList = arr;
                }

                let bodyResult = await getBodyNbs()
                if (bodyResult.code == 200) {
                    let arr = [];
                    bodyResult.data.forEach(item => {
                        arr.push({id: item, value: item})
                    })
                    this.bodyList = arr;
                }

                this.loading.close()

            },



            saveClick() {
                if (this.subscribeType == 1 || this.subscribeType == 2) {
                    if (this.oldSubscribeType == 0) {
                        this.statementShow = true
                    } else {
                        this.onSubmit()
                    }
                }else if(this.subscribeType == 0){
                    if(this.oldSubscribeType == 1||this.oldSubscribeType == 2){
                        this.closeStatementShow = true
                    }else {
                        this.onSubmit()
                    }
                }else {
                    this.onSubmit()
                }
            },

            async onSubmit() {
                let data = {
                    subWaterStopType: this.subscribeType.toString()
                }
                if (this.subscribeType == 1) {
                    if (this.body.length == 0) {
                        this.$message('請選擇合同號');
                        return false;
                    }
                    data['bodyNbs'] = this.body
                } else if (this.subscribeType == 2) {
                    if (this.region.length == 0) {
                        this.$message('請選擇區域');
                        return false;
                    }
                    data['townCds'] = this.region
                }
                this.buttonLoading = true
                this.statementShow=false
                this.closeStatementShow=false
                let result = await mspReg(data)
                if (result.code == 200) {
                    this.$message('保存成功');
                    this.getSubscribeType()
                }

                this.buttonLoading = false
            },


            //获取地区列表
            async getRegionList() {
                let res = await getAreaList();
                if (res.code == 200) {
                    let arr = [];
                    res.result.forEach(item => {
                        arr.push({id: item.id, value: item.areaName})
                    })
                    this.regionList = arr;
                }
            },
            //提交
            // onSubmit(){
            //   if(this.region.length === 0){
            //     this.regionShow = true;
            //   }else{
            //     this.onRegister();
            //   }
            // },
            //确认注册
            async onRegister() {
                let phone = this.$route.query.phone,
                    email = this.$route.query.email,
                    pass = this.$route.query.pass,
                    bindToken = this.$route.query.bindToken,
                    unbindToken = this.$route.query.unbindToken,
                    phoneRegionId = this.$route.query.phoneRegionId,
                    areaCode = this.$route.query.areaCode;
                let data = {
                    openId: getToken(),
                    userPhone: phone,
                    phoneRegionId: phoneRegionId,
                    addressIdList: this.region,
                    userEmail: email,
                    password: pass,
                    bindToken: bindToken,
                    unbindToken: unbindToken,
                    inviteCode: sessionStorage.referrer
                }
                // if(sessionStorage.referrer&&sessionStorage.referrer!='undefined'){
                //   data.inviteCode=sessionStorage.referrer
                // }
                let res = await userRegister(data);
                if (res.code == 200) {
                    this.$router.push({
                        path: '/user/register-succeed',
                        query: {
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
            back() {
                this.$router.push('/user/register-phone');
            },
        }
    }
</script>


<style lang="scss">
    .regionShow .el-dialog__header {
        border-bottom: 1px solid #ddd;
        padding: 15px;
    }

    .regionShow .el-dialog__title {
        color: #528EEF;
    }


    .subscribe-div .el-icon-arrow-right {
        display: none;
    }

    .subscribe-div {
        div{
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        .el-collapse-item {
            position: relative;

            .el-collapse-item__header {
                font-size: 16px;
                color: #434343;
            }
        }

        .first {
            .el-collapse-item__content {
                padding-bottom: 0;
            }

            .el-collapse-item__wrap {
                border-bottom: none;
            }

            .el-collapse-item__header.is-active {
                border-bottom: 1px solid #EBEEF5;
            }
        }

        .check {
            position: absolute;
            top: 10px;
            right: 0;
            display: none;
            font-size: 26px;
            color: #56A0F6;
            font-weight: bold;
        }

        .is-disabled{
            .el-collapse-item__header{
                position: relative;
                &:after{
                    content: '';
                    display: block;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                }
            }

            .el-collapse-item__header{
                color: #cccccc;
            }
        }
        .is-active {
            color: #56A0F6 !important;

            .check {
                display: block;
            }
        }

        .el-checkbox-group {
            div {
                &:last-child {
                    .el-checkbox {
                        margin-bottom: 0;
                    }
                }
            }
        }
    }


    .el-icon-loading {
        color: #ffffff;
    }

    .regionModalShow{
        .el-dialog__header{
            padding-top: 50px!important;
            padding-bottom: 5px !important;
        }
        .el-dialog__body{
            padding:0 20px 20px 20px !important;
        }
        .el-icon-close{
            color: #cccccc;
            font-size:24px;
            font-weight: bold;
            position: absolute;
            right: 10px;
            top: 10px;
        }
    }

</style>

<style lang="scss" scoped>
    /*页头*/
    /*.header{*/
    /*  background:linear-gradient(90deg,rgba(62,100,171,1) 0%,rgba(17,28,97,1) 100%);*/
    /*  box-shadow:4px 7px 16px 0px rgba(0, 0, 0, 0.2);*/
    /*  height: 45px;*/
    /*  width:100%;*/
    /*  display:flex;*/
    /*  justify-content: center;*/
    /*  align-items: center;*/
    /*  .back{*/
    /*    position: absolute;*/
    /*    left:10px;*/
    /*    i{*/
    /*      font-size: 20px;*/
    /*      color: #fff;*/
    /*      font-weight: bold;*/
    /*    }*/
    /*  }*/
    /*}*/
    /*内容*/
    .body {
        background: rgba(255, 255, 255, 1);
        border-radius: 8px;
        padding: 15px;
        width: 85%;
        margin: 10px auto;
        box-shadow: 0px 0px 10px #ddd;
        /*height: calc(100vh - 95px);*/
        height: calc(100vh - 165px);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }


    .body-title {
        font-size: 18px;
        color: #161616;
        font-weight: bold;
        line-height: 2em;
        height: 2em;
    }

    /*填写地区*/
    .region {
        width: 100%;
    }

    .region .el-checkbox {
        width: 100%;
        margin-bottom: 10px;
    }

    .next-step {
        position: fixed;
        bottom: 20px;
        width: 85%;
        z-index: 99;
        left: 0;
        right: 0;
        margin: 0 auto;
        .el-button {
            width: 100%;
        }
    }

    .all-select {
        font-size: 16px;
        color: #5B9BF4;
        margin-left: auto;
        width: 30%;
        text-align: right;
        padding: 10px 0;
    }




    /*个人资料声明弹窗*/
    .regionModalShow {
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

        .term-tip{
            color:rgba(22,22,22,1);
            opacity: 0.4;
            text-align: center;
        }
    }



</style>
