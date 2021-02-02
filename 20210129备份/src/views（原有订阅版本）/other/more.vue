<template>
    <div class="main">

        <!--    <van-sticky class="more-head" :z-index="99999">-->
        <!-- 页头 -->
        <div class="more-head">
            <Header metaTitle="主頁"/>
            <div class="banner">
                <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                    <van-swipe-item v-for="(item,index) in bannerList" :key="index">
                        <img :src="item.imgUrl" @click="bannerLink(item.url)">
                    </van-swipe-item>
                </van-swipe>
            </div>

            <!-- 导航 -->
            <div class="nav">
                <ul>
                    <li v-for="(item,index) in navList"
                        :class="{'active':navIndex==index}"
                        @click="navClick(index)"
                    >{{item}}</li>
                </ul>
            </div>
        </div>

        <!--    </van-sticky>-->


        <div class="menu-info">
            <van-swipe class="menu-info-swipe"  ref="menuInfoSwipe"
                       @change="menuInfoChange"
                       :loop="false"
                       :show-indicators="false">
                <van-swipe-item>
                    <div class="info">
                        <h2 class="info-title">賬單服務</h2>
                        <div class="ul">
                            <div class="li" @click="routerHerf('/bills',true)">
                                <svg-icon icon-class="wechat-bills"/>
                                <div class="name">微信電子賬單</div>
                            </div>
                            <div class="li" @click="externalLink('/member/bill-management',true)">
                                <svg-icon icon-class="sms"/>
                                <div class="name">短信提示服務</div>
                            </div>
                            <div class="li" @click="externalLink('/customer/change-mailingaddress',true)">
                                <svg-icon icon-class="management-bills"/>
                                <div class="name">更改寄單地址</div>
                            </div>
                            <div class="li" @click="externalLink('/member/bill-management',true)">
                                <svg-icon icon-class="shortcut"/>
                                <div class="name">更改賬單語言</div>
                            </div>
                            <div class="li" @click="externalLink('/customer/water-charges',true,true,'nologin','https://www.macaowater.com/customer/water-charges')">
                                <svg-icon icon-class="inform"/>
                                <div class="name">模擬計算水價</div>
                            </div>
                        </div>

                    </div>

                </van-swipe-item>
                <van-swipe-item>
                    <div class="info">
                        <h2 class="info-title">服務申請</h2>
                        <div class="ul">
                            <div class="li" @click="externalLink('/customer/new-meter-installation',true)">
                                <svg-icon icon-class="inform"/>
                                <div class="name">首次安裝水錶</div>
                            </div>
                            <div class="li" @click="externalLink('/member/change-consumership',true)">
                                <svg-icon icon-class="water-quality"/>
                                <div class="name">更改登記名稱</div>
                            </div>
                            <div class="li" @click="externalLink('/member/termination-water-supply',true)">
                                <svg-icon icon-class="gas-prices"/>
                                <div class="name">終止供水服務</div>
                            </div>

                            <div class="li" @click="externalLink('/member/guarantee-deposit-refund',true)">
                                <svg-icon icon-class="integral"/>
                                <div class="name">發還按金</div>
                            </div>
                            <div class="li" @click="externalLink('/member/meter-testing',true)">
                                <svg-icon icon-class="more"/>
                                <div class="name">申請測試水錶</div>
                            </div>
                            <div class="li" @click="externalLink('/customer/application-status',true,true,'nologin','https://www.macaowater.com/customer/application-status')">
                                <svg-icon icon-class="information"/>
                                <div class="name">網上服務申請</div>
                            </div>
                            <div class="li" @click="externalLink('/customer/application-enquiry',true,true,'nologin','https://www.macaowater.com/customer/application-enquiry')">
                                <svg-icon icon-class="management-bills"/>
                                <div class="name">新供水查詢</div>
                            </div>
                        </div>
                    </div>
                </van-swipe-item>

                <van-swipe-item>
                    <div class="info">
                        <h2 class="info-title">水錶服務</h2>
                        <div class="ul">
                            <div class="li" @click="externalLink('/customer/submit-self-reading',true)">
                                <svg-icon icon-class="inform"/>
                                <div class="name">報讀水錶</div>
                            </div>
                            <div class="li" @click="externalLink('/customer/meter-reading-appointment',true)">
                                <svg-icon icon-class="water-quality"/>
                                <div class="name">預約抄錶</div>
                            </div>
                            <div class="li" @click="externalLink('/member/cut-off-reading',true)">
                                <svg-icon icon-class="gas-prices"/>
                                <div class="name">抄錶截數</div>
                            </div>
                        </div>
                    </div>
                </van-swipe-item>
                <van-swipe-item>
                    <div class="info">
                        <h2 class="info-title">事故爆料</h2>
                        <div class="ul">
                            <div class="li" @click="externalLink('/customer/incident-report',true,true,'nologin','https://www.macaowater.com/customer/incident-report')">
                                <svg-icon icon-class="management-bills"/>
                                <div class="name">事故爆料</div>
                            </div>
                        </div>
                    </div>
                </van-swipe-item>
                <van-swipe-item>
                    <div class="info">
                        <h2 class="info-title">更多資訊</h2>
                        <div class="ul">
                            <div class="li" @click="externalLink('https://3gimg.qq.com/lightmap/v1/marker/index.html?marker=coord%3A22.20829%2C113.54529%3Btitle%3A%E6%BE%B3%E9%97%A8%E8%87%AA%E6%9D%A5%E6%B0%B4%E5%AE%A2%E6%88%B7%E6%9C%8D%E5%8A%A1%E4%B8%AD%E5%BF%83%3Baddr%3A%E6%BE%B3%E9%97%A8%E7%89%B9%E5%88%AB%E8%A1%8C%E6%94%BF%E5%8C%BA%E6%BE%B3%E9%97%A8%E5%8D%8A%E5%B2%9B%E9%9D%92%E6%B4%B2%E5%A4%A7%E9%A9%AC%E8%B7%AF718%E5%8F%B7%3Buid%3A17043893137222964157&key=TKUBZ-D24AF-GJ4JY-JDVM2-IBYKK-KEBCU&referer=pcmap&ch=uri-api&ADTAG=uri-api.pcmap',false,true,'nologin')">
                                <svg-icon icon-class="inform"/>
                                <div class="name">客服中心地址</div>
                            </div>
                            <div class="li"
                                 @click="externalLink($config.projectModel=='formal'?'https://www.macaowater.com/about-macao-water/suspension-notice':'https://wechattest.macaowatercloud.com/about-macao-water/suspension-notice',false,true,'nologin')"
                            >
                                <svg-icon icon-class="water-quality"/>
                                <div class="name">停水通知</div>
                            </div>
                            <div class="li"
                                 @click="externalLink($config.projectModel=='formal'?'https://www.macaowater.com/customer/tariffs-charge':'https://wechattest.macaowatercloud.com/customer/tariffs-charge',false,true,'nologin')"
                            >
                                <svg-icon icon-class="gas-prices"/>
                                <div class="name">水費價格</div>
                            </div>
                            <div class="li"
                                 @click="exLink($config.projectModel=='formal'?'https://www.macaowater.com/about-macao-water/daily-water-quality-report':'https://wechattest.macaowatercloud.com/about-macao-water/daily-water-quality-report',false,'nologin')"
                            >
                                <svg-icon icon-class="water-quality"/>
                                <div class="name">每日水質</div>
                            </div>
                        </div>
                    </div>
                </van-swipe-item>

            </van-swipe>
        </div>



        <!-- 綁定合同彈窗 -->
        <el-dialog
                title="綁定合同"
                width="80%"
                top="30px"
                custom-class="dialog-common"
                :visible.sync="bindShow"
                :show-close="false"
                @open="noScroll('add')"
                @close="noScroll('remove')"
                center>
            <div style="text-align: center;padding: 10px 0">綁定合同才可以進行操作</div>
            <!-- 底部 -->
            <span slot="footer" class="dialog-footer">
        <el-button round @click="bindShow = false">取消</el-button>
        <el-button round type="primary"><router-link to="/bills">去綁定</router-link></el-button>
      </span>
        </el-dialog>

    </div>
</template>
<script>
    import Header from '@/components/Header'
    import {autoJump} from '@/api/others'
    import {Sticky, Swipe, SwipeItem} from 'vant'

    export default {
        name: 'more',
        data() {
            return {
                anchorLocation: {
                    billingService: '',
                    serviceApplication: '',
                    waterService: '',
                    disclose: '',
                    more: '',
                },
                bindShow: false,
                userLoginAuto: false,


                navList:['賬單服務','服務申請','水錶服務','事故爆料','更多資訊'],
                navIndex:0,
                bannerList: [
                    {
                        imgUrl: require('../../assets/images/banner-9.png'),
                        url: 'http://mwregister.wechattips.com',
                    },
                    // {
                    //     imgUrl: require('../../assets/images/banner-4.png'),
                    //     url: 'https://wechattest.macaowatercloud.com/home',
                    // },
                    // {
                    //     imgUrl: require('../../assets/images/banner-5.png'),
                    //     url: 'https://wechattest.macaowatercloud.com/home',
                    // },
                ],

            }
        },
        components: {
            [Sticky.name]: Sticky,
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            Header: Header,
        },
        created() {
            this.userLoginAuto = this.$route.query.login == 'true' ? true : false
            this.$share();
        },
        destroyed() {

        },
        mounted() {

        },
        methods: {
            navClick(index){
                this.navIndex=index
                this.$refs.menuInfoSwipe.swipeTo(index)
            },
            menuInfoChange(index){
                this.navIndex=index
            },

            //路由跳转
            routerHerf(page, boolean, loginType) {
                if (this.userLoginAuto == false && loginType != 'nologin') {
                    this.$router.push('/user/');
                    return false;
                }
                this.$router.push({
                    path: page,
                    query: {
                        openBill: boolean
                    }
                });
            },

            bannerLink(url){
                location.href = url;
            },

            //外部链接
            async externalLink(url, isToken, isBind, loginType, httpUrl) {
                if (this.userLoginAuto == false && loginType != 'nologin') {
                    this.$router.push('/user/');
                    return false;
                }
                if (sessionStorage.contractNb == 0 && !isBind) {
                    this.bindShow = true;
                    return false;
                }
                if (isToken) {
                    if (this.userLoginAuto == false && loginType == 'nologin' && httpUrl) {
                        location.href = httpUrl;
                        return false;
                    }
                    let data = {
                        lang: 'zh_TW',
                        url: url
                    }
                    let res = await autoJump(data);
                    if (res.code == 200) {
                        location.href = res.result.url;
                    }
                } else {
                    location.href = url;
                }
            },
            async exLink(url, isToken, loginType) {
                if (this.userLoginAuto == false && loginType != 'nologin') {
                    this.$router.push('/user/');
                    return false;
                }
                if (isToken) {
                    let data = {
                        lang: 'zh_TW',
                        url: url
                    }
                    let res = await autoJump(data);
                    if (res.code == 200) {
                        location.href = res.result.url;
                    }
                } else {
                    location.href = url;
                }
            },
        }
    }
</script>

<style lang="scss">
    #billingService:billingService {
        margin-top: 100px;
    }

    .head-sticky {
        .van-sticky--fixed {
            background: #f5f5f5;
        }
    }

</style>


<style lang="scss" scoped>
    //暗锚点
    .anchor {
        position: relative;
        top: -40px;
        display: block;
        height: 0;
        overflow: hidden;
    }

    // 标题
    .nav ul {
        display: flex;
        // justify-content:space-between;
        background-color: #fff;
        width: calc(100% - 30px);
        height:  1.1733333333333333rem;
        line-height:  1.1733333333333333rem;
        padding: 0 15px;
        font-size: 0.37333333333333335rem;
        justify-content: space-between;
        display: flex;
        li.active {
            color: #364973;
            border-bottom: 2px solid #364973;
        }
        li:nth-child(5) {
            margin-right: 0;
        }
    }

    /*菜单*/
    .menu {
        width: 86%;
        padding: 12px;
        margin: 0 auto;
        margin-top: 18px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 1);
        color: #434343;

        h2 {
            font-size: 16px;
        }

        .content {
            display: flex;
            flex-wrap: wrap;

            p {
                width: 25%;
                text-align: center;
                margin-top: 15px;
                font-size: 12px;
                line-height: 27px;
            }

            .svg-icon {
                font-size: 32px;
            }

            a {
                color: #434343;
            }
        }
    }

    /*2020-07-02*/
    .more-head {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
    }
    .banner {
        width: calc(86% + 24px);
        height: 3.28rem;
        margin: 0.4rem auto;
        border-radius: 8px;
        background-size: 100% 100%;
        .my-swipe {
            width: 100%;
            height: 100%;
            img {
                width: 100%;
                height: 100%;
                border-radius: 8px;
            }
        }
    }

    .menu-info {
        width: 100%;
        height: calc(100% - 6.55333rem);
        position: fixed;
        left: 0;
        bottom: 0;
        /*z-index: 1000;*/
        .menu-info-swipe {
            width: 100%;
            height: 100%;
            .info {
                position: absolute;
                left: 0;
                top: 0;
                width: calc(86% + 24px);
                right: 0;
                margin: 0 auto;
                height: 100%;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                .info-title {
                    font-size:  0.4266666666666667rem;
                    color: #434343;
                    padding-top:0.4266666666666667rem;
                }
                .ul {
                    display: flex;
                    flex-wrap: wrap;
                    padding-bottom: 30px;
                }
                .li {
                    width: 47%;
                    height: 2.92rem;
                    background: rgba(255, 255, 255, 1);
                    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);
                    opacity: 1;
                    border-radius: 8px;
                    box-sizing: border-box;
                    padding:0.5066666666666667rem  0.3066666666666667rem;
                    padding-bottom: 0;
                    margin-right: 6%;
                    margin-top: 6%;
                    &:nth-of-type(2n) {
                        margin-right: 0;
                    }
                    .svg-icon {
                        font-size: 0.9066666666666666rem;
                    }
                    .name {
                        font-size: 0.4rem;
                        margin-top: 0.4rem;
                        color: #000000;
                    }
                }
            }
        }
    }

</style>
