<template>
    <div class="main">

        <!-- 页头 -->
        <!--    <div class="header">-->
        <!--      <div class="back" @click="back">-->
        <!--        <i class="el-icon-arrow-left" ></i>-->
        <!--      </div>-->
        <!--    </div>-->

        <Header :metaTitle='$t("dashboard.font37")'/>
        <!-- 内容 -->
        <div class="body">
            <div class="body-title">{{$t("serviceSubscribe.font1")}}</div>

            <el-collapse class="subscribe-div" v-model="subscribeType" accordion>
                <el-collapse-item :title='$t("serviceSubscribe.font2")' class="first" :name="0" :disabled="subscribeType==0">
                    <i class="el-icon-check check"></i>
                </el-collapse-item>

                <el-collapse-item v-show="$config.nbAreaSubStatus" :title='$t("serviceSubscribe.font3")' :name="1" :disabled="subscribeType==1||bodyList.length==0">
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
                            <div class="all-select" v-if="body.length==bodyList.length" @click="bodySelectAll(false)">
                                {{$t("serviceSubscribe.font6")}}
                            </div>
                            <div class="all-select" v-else @click="bodySelectAll(true)">{{$t("serviceSubscribe.font5")}}</div>
                        </template>
                    </div>
                </el-collapse-item>

                <el-collapse-item :title='$t("serviceSubscribe.font4")' :name="2" :disabled="subscribeType==2">
                    <i class="el-icon-check check"></i>
                    <!-- 填写地区 -->
                    <div class="region">
                        <el-checkbox-group v-model="region">
                            <div v-for="item in regionList">
                                <el-checkbox :label="item.id" :key="item.id" border>
                                    <!--{{item.value=='港珠澳大橋澳門口岸'?'港珠澳大橋澳門口岸管理區':item.value}}-->
                                    {{item.value}}
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                        <div class="all-select" v-if="region.length==regionList.length" @click="regionSelectAll(false)">
                             {{$t("serviceSubscribe.font6")}}
                        </div>
                        <div class="all-select" v-else @click="regionSelectAll(true)">{{$t("serviceSubscribe.font5")}}</div>

                    </div>
                </el-collapse-item>
            </el-collapse>


        </div>

        <!-- 下一步 -->
        <div class="next-step">
            <el-button class="deep-blue" :loading="buttonLoading" :disabled="buttondDisabled" round @click="saveClick">
                {{$t("serviceSubscribe.font7")}}
            </el-button>
        </div>


        <!-- 使用服務訂閱 -->
<!--        <el-dialog-->
<!--                title="停水通知訂閱"-->
<!--                width="80%"-->
<!--                custom-class="dialog-common"-->
<!--                :visible.sync="statementShow"-->
<!--                :show-close="false"-->
<!--                @open="noScroll('add')"-->
<!--                @close="noScroll('remove')"-->
<!--                center>-->
<!--            <div class="title">您正在開啟停水通知訂閱服務</br>是否確認開啟</div>-->
<!--            <span slot="footer" class="dialog-footer">-->
<!--        <el-button round @click="statementShow = false">取消</el-button>-->
<!--        <el-button round type="primary" @click="onSubmit">開啟</el-button>-->
<!--        </span>-->
<!--        </el-dialog>-->
        <el-dialog
                :title='$t("serviceSubscribe.font1")'
                width="80%"
                custom-class="dialog-common"
                :visible.sync="statementShow"
                :show-close="false"
                @open="noScroll('add')"
                @close="noScroll('remove')"
                center>
<!--            <div class="title">使用服務訂閱功能前請認真閱讀《訂閱聲明》</div>-->
            <el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">
                <div class="text item" v-html='$t("serviceSubscribe.font12")'/>
            </el-card>
            <div class="statement">
                <el-checkbox v-model="isAgreeTerms">{{$t("serviceSubscribe.font13")}}</el-checkbox>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button round @click="statementShow = false">{{$t("serviceSubscribe.font14")}}</el-button>
                <el-button round type="primary" @click="onSubmit('check')">{{$t("serviceSubscribe.font15")}}</el-button>
            </span>
        </el-dialog>

        <!-- 关闭服務訂閱 -->
        <el-dialog
                :title='$t("serviceSubscribe.font1")'
                width="80%"
                custom-class="dialog-common"
                :visible.sync="closeStatementShow"
                :show-close="false"
                @open="noScroll('add')"
                @close="noScroll('remove')"
                center>
            <div class="title" v-html='$t("serviceSubscribe.font16")'></div>
            <span slot="footer" class="dialog-footer">
        <el-button round   @click="onSubmit">{{$t("serviceSubscribe.font17")}}</el-button>
        <el-button round type="primary"  @click="closeStatementShow = false">{{$t("serviceSubscribe.font18")}}</el-button>
        </span>
        </el-dialog>
<!--        <el-dialog-->
<!--                title="停水通知訂閱"-->
<!--                width="80%"-->
<!--                custom-class="dialog-common"-->
<!--                :visible.sync="closeStatementShow"-->
<!--                :show-close="false"-->
<!--                @open="noScroll('add')"-->
<!--                @close="noScroll('remove')"-->
<!--                center>-->
<!--            <div class="title">關閉服務訂閱功能前請認真閱讀《訂閱聲明》</div>-->
<!--            <el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">-->
<!--                <div class="text item">-->
<!--                    <p>關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務</p>-->
<!--                    <p>關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務</p>-->
<!--                    <p>關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務</p>-->
<!--                    <p>關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務</p>-->
<!--                    <p>關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務</p>-->
<!--                    <p>關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務關閉服務</p>-->
<!--                </div>-->
<!--            </el-card>-->
<!--            <div class="statement">-->
<!--                <el-checkbox v-model="isAgreeTerms">我已清楚并同意以上服務條文</el-checkbox>-->
<!--            </div>-->
<!--            <span slot="footer" class="dialog-footer">-->
<!--                <el-button round @click="closeStatementShow = false">取消</el-button>-->
<!--                <el-button round type="primary" @click="onSubmit('check')">關閉</el-button>-->
<!--            </span>-->
<!--        </el-dialog>-->

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
                closeStatementShow: false,//關閉訂閱

                isAgreeTerms: false,

                buttonLoading: false,

                buttondDisabled: false,


            }
        },
        watch: {
            body(data) {
                this.buttondDisabled = data.length == 0 ? true : false
            },
            region(data) {
                this.buttondDisabled = data.length == 0 ? true : false
            },
            subscribeType: {
                handler(data) {
                    if (data == 1) {
                        this.buttondDisabled = this.body.length == 0 ? true : false
                    } else if (data == 2) {
                        this.buttondDisabled = this.region.length == 0 ? true : false
                    } else {
                        this.buttondDisabled = false
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

            this.$share();

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
                        arr.push({id: item.bodyNb, value:item.aliasLb? item.aliasLb+'('+item.bodyNb+')':item.bodyNb})
                    })
                    this.bodyList = arr;
                }

                this.loading.close()

            },


            saveClick() {
                this.isAgreeTerms=false
                if (this.subscribeType == 1 || this.subscribeType == 2) {
                    if (this.oldSubscribeType == 0) {
                        this.statementShow = true
                    } else {
                        this.onSubmit()
                    }
                } else if (this.subscribeType == 0) {
                    if (this.oldSubscribeType == 1 || this.oldSubscribeType == 2) {
                        this.closeStatementShow = true
                    } else {
                        this.onSubmit()
                    }
                } else {
                    this.onSubmit()
                }
            },

            async onSubmit(type) {
                let data = {
                    subWaterStopType: this.subscribeType.toString()
                }
                if (this.subscribeType == 1) {
                    if (this.body.length == 0) {
                        this.$message(this.$t("serviceSubscribe.font8"));
                        return false;
                    }
                    data['bodyNbs'] = this.body
                } else if (this.subscribeType == 2) {
                    if (this.region.length == 0) {
                       this.$message(this.$t("serviceSubscribe.font9"));
                        return false;
                    }
                    data['townCds'] = this.region
                }
                if (type == 'check' && !this.isAgreeTerms) {
                    this.$message(this.$t("serviceSubscribe.font10"));
                    return false;
                }


                this.buttonLoading = true
                this.statementShow = false
                this.closeStatementShow = false
                let result = await mspReg(data)
                if (result.code == 200) {
                    this.$message(this.$t("serviceSubscribe.font11"));
                    this.getSubscribeType()
                }else {

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
        div {
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

        .is-disabled {
            .el-collapse-item__header {
                position: relative;

                &:after {
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

            .el-collapse-item__header {
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

    .regionModalShow {
        .el-dialog__header {
            padding-top: 50px !important;
            padding-bottom: 5px !important;
        }

        .el-dialog__body {
            padding: 0 20px 20px 20px !important;
        }

        .el-icon-close {
            color: #cccccc;
            font-size: 24px;
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


    /*微信账单弹层*/
    .dialog-common {
        .title {
            text-align: center;
            /*padding: 0 35px;*/
        }

        .title b {
            color: #EE5050;
        }

        .box-card {
            max-height: 200px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            /*margin: 15px 0;*/
            margin-bottom: 15px;
        }

        .statement {
            text-align: center;
        }

        .text {
            font-size: 12px;
        }
    }




</style>
