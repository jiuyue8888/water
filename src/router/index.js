import Vue from 'vue'
import Router from 'vue-router'
import {isWeChat, UrlSearch} from '@/utils'
import {setToken, getToken,getOpenid} from '@/utils/auth'

Vue.use(Router)


//不需要验证权限页面
export const constantRoutes = [
    {
        path: '/',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {title: '智慧水務'}
    },
    {
        path: '/user',
        component: () => import('@/views/user/index'),
        name: 'User',
        meta: {title: '註冊入口'}
    },
    {
        path: '/user/register-email',
        component: () => import('@/views/user/register-email'),
        name: 'RegisterEmail',
        meta: {title: '註冊-驗證郵箱'}
    },
    {
        path: '/user/register-phone',
        component: () => import('@/views/user/register-phone'),
        name: 'RegisterPhone',
        meta: {title: '註冊-驗證手機號'}
    },
    {
        path: '/user/register-region',
        component: () => import('@/views/user/register-region'),
        name: 'RegisterRegion',
        meta: {title: '註冊-填寫地區'}
    },
    {
        path: '/user/register-succeed',
        component: () => import('@/views/user/register-succeed'),
        name: 'RegisterSucceed',
        meta: {title: '註冊成功'}
    },
    {
        path: '/user/service-subscribe',
        component: () => import('@/views/user/service-subscribe'),
        name: 'serviceSubscribe',
        meta: {title: '計劃性停水通知訂閱'}
    },
    {
        path: '/user/forgot-password',
        component: () => import('@/views/user/forgot-password'),
        name: 'forgotPassword',
        meta: {title: '忘記密碼'}
    },
    {
        path: '/bills',
        component: () => import('@/views/bills/index'),
        name: 'Bills',
        meta: {title: '管理賬單'}
    },
    {
        path: '/bills/details',
        component: () => import('@/views/bills/details'),
        name: 'Details',
        meta: {title: '賬單詳情'}
    },
    {
        path: '/bills/message',
        component: () => import('@/views/bills/message'),
        name: 'Message',
        meta: {title: '消息通知'}
    },
    {
        path: '/bills/payment/:bodyNb',
        component: () => import('@/views/bills/payment'),
        name: 'Payment',
        meta: {title: '賬單繳費'}
    },
    {
        path: '/bills/pdf',
        component: () => import('@/views/bills/pdf'),
        name: 'Pdf',
        meta: {title: 'PDF賬單'}
    },
    {
        path: '/wechat-astrict',
        component: () => import('@/views/bills/wechat-astrict'),
        name: 'wechatAstrict',
        meta: {title: '智慧水務'}
    },
    {
        path: '/member/membership',
        component: () => import('@/views/member/membership/index'),
        name: 'memberMembership',
        meta: {title: '會員資料'}
    },
    {
        path: '/member/integral',
        component: () => import('@/views/member/integral/index'),
        name: 'memberIntegral',
        meta: {title: '積分任務'}
    },
    {
        path: '/member/gift',
        component: () => import('@/views/member/gift/index'),
        name: 'memberGift',
        meta: {title: '積分兌換'}
    },
    {
        path: '/member/gift/record',
        component: () => import('@/views/member/gift/record'),
        name: 'memberGiftRecord',
        meta: {title: '積分詳情'}
    },
    {
        path: '/member/gift/my-gift',
        component: () => import('@/views/member/gift/my-gift'),
        name: 'memberGiftMygift',
        meta: {title: '我的禮品'}
    },
    {
        path: '/other/quick-payment',
        component: () => import('@/views/other/quick-payment'),
        name: 'quickPayment',
        meta: {title: '快捷繳費'}
    },
    {
        path: '/other/more',
        component: () => import('@/views/other/more'),
        name: 'more',
        meta: {title: '更多功能'}
    },
    {
        path: '/401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        hidden: true
    },

    {
        path: '/pdfview',
        component: () => import('@/views/pdfview/pdfview'),
        name: '賬單詳情',
        hidden: true
    },
    {
        path: '/error',
        component: () => import('@/views/error-page/maintenance'),
        name: '賬單詳情',
        hidden: true
    }
]

const createRouter = () => new Router({
    scrollBehavior: () => ({y: 0}),//切换路由后页面滚动到顶部
    routes: constantRoutes
})


const router = createRouter()

router.beforeEach((to, from, next) => {
    // console.log(to);
    //解除禁止页面滚动
    Vue.prototype.noScroll('remove')

    if (to.meta.title) {
        document.title = '澳門自來水·' + to.meta.title
    }

    //这些页面不需要验证微信端
    if (to.path == '/401' || to.path == '/wechat-astrict') {
        next()
    } else {

        let isWeChatBoolean = null;
        if (process.env.NODE_ENV === 'development') {
            isWeChatBoolean = false;
        } else {
            isWeChatBoolean = !isWeChat()
        }

        //判断是否再微信客户端打开
        if (isWeChatBoolean) {
            next('401')
        } else {
            if (to.path == '/') {
                // console.log(UrlSearch(),'redirect')
                //此参考为微信分享,重定向到注册页面

                if (UrlSearch().redirect == 'user') {
                    localStorage.setItem('referrer',UrlSearch().inviteCode)
                }

                // console.log(getToken(),'cookie')
                //判断cookie中是否有openId
                if ((getToken() && getToken() !== 'undefined')) {
                    next()
                } else {
                    let openId = null;
                    if (process.env.NODE_ENV === 'development') {  // 开发环境
                        // openId = 'osT1v1PnTpk15OpEPKt694zGZ3R8';//aping
                        // openId = 'osT1v1KbCeaqkp-yiTEimQmDT1Jc';//世豪
                        // openId = 'osT1v1PMo2GIDi8d7xU_QwN77lc8';//田鹏
                        // openId = 'osT1v1AuVD3H7ZR_HBTgVOpjEqHE';//
                        // openId = 'osT1v1J_XknrluRFyNIvEMiqdqHY';//kiki1
                        // openId = 'osT1v1J5wycnzelvxyWyUL-I14aw';//kiki2
                        // openId = 'osT1v1MdPd5T96hedR4gFotaFI3c';//刘杨
                        // openId = 'osT1v1MEYKtqCpt_tNj05dk7ndXM';//熊总
                        // openId = 'osT1v1InCXcpvRDENGmKrPzOD4HE';//余枫
                        openId = 'osT1v1JC54LQUZNwRBzaBhvYL5wU';//my
                        // openId='osT1v1P86Nsv8BnUkHpY1KmyI9Ws'
                        // openId = 'olGwuv5TzXRP1iieGEDYKAH7pOOo' //osT1v1MdPd5T96hedR4gFotaFI3c 'osT1v1JC54LQUZNwRBzaBhvYL5wU'//'olGwuv5TzXRP1iieGEDYKAH7pOOo';
                    } else { // 生产环境
                        openId = UrlSearch().openId;
                    }
                    // console.log(openId,'openId')
                    //判断首页url是否携带openId
                    if (openId) {
                        setToken(openId);


                        if(localStorage.getItem('referrer')){
                            if (localStorage.getItem('referrer')) {
                                next('/user?inviteCode=' + localStorage.getItem('referrer'))
                            }
                        }else {
                            next()
                        }

                    } else {
                        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?state=wx_info&appid='+Vue.prototype.$config.APPID+'&redirect_uri=https%3a%2f%2f' + location.hostname + '%2fapi%2fv1%2fwxAuth&response_type=code&scope=snsapi_userinfo#wechat_redirect'

                        // if((getOpenid() && getOpenid() !== 'undefined')){
                        //     // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb364df0830b4a7dd&redirect_uri=http%3a%2f%2f'+location.hostname+'%2fapi%2fv1%2fwxfb&response_type=code&scope=snsapi_base#wechat_redirect';
                        //     window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?state=wx_info&appid='+Vue.prototype.$config.APPID+'&redirect_uri=https%3a%2f%2f' + location.hostname + '%2fapi%2fv1%2fwxAuth&response_type=code&scope=snsapi_userinfo#wechat_redirect'
                        //
                        // }else {
                        //     if(localStorage.getItem('referrer')||localStorage.getItem('water_85')){
                        //         if (localStorage.getItem('referrer')) {
                        //             next('/user?inviteCode=' + localStorage.getItem('referrer'))
                        //         }
                        //         if (localStorage.getItem('water_85')) {
                        //             next('/user')
                        //         }
                        //     }else {
                        //
                        //         window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?state=wx_info&appid='+Vue.prototype.$config.APPID+'&redirect_uri=https%3a%2f%2f' + location.hostname + '%2fapi%2fv1%2fwxAuth&response_type=code&scope=snsapi_userinfo#wechat_redirect'
                        //
                        //         // next()
                        //     }
                        // }
                    }
                }
            }else if(to.path == '/member/integral'){
                let openId = null;
                if (process.env.NODE_ENV === 'development') {  // 开发环境
                    openId = 'osT1v1JC54LQUZNwRBzaBhvYL5wU'// 'olGwuv5TzXRP1iieGEDYKAH7pOOo';
                } else { // 生产环境
                    openId = to.query.openId;
                }
                if (openId) {
                    setToken(openId);
                    next()
                } else {
                    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?state=score&appid='+Vue.prototype.$config.APPID+'&redirect_uri=https%3a%2f%2f'+ location.hostname +'%2fapi%2fv1%2fwxAuth&response_type=code&scope=snsapi_base#wechat_redirect'


                }
            }
            else {
                next()
            }
        }

    }

})


router.afterEach((to, from, next) => {
    setTimeout(() => {
        var _hmt = _hmt || [];
        (function () {
            //每次执行前，先移除上次插入的代码
            document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove();

            var hm = document.createElement("script");
            hm.id = "baidu_tj"
            hm.src = "https://hm.baidu.com/hm.js?565f08b7f44aac1f067d9dbb3a5c5bcc";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);

        })();
    }, 0);
});


export default router

