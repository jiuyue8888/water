
import {wechatJsdk } from '@/api/others'
import Vue from 'vue'

let wxShareImg="http://cmsphoto.wechattips.com/zhsw-share.png"
const share = async (shareData) => {
  let data = {
    url:location.href.split('#')[0]
  }
  let ressult = await wechatJsdk(data);
  let res= new Promise(function (resolve, reject) {
    if(!navigator.userAgent.toLowerCase().includes("micromessenger")){
      resolve(true);
    }
    if(ressult.code==200){
      var configData=ressult.data
      wx.config({
        debug: false,
        appId: configData.appId,
        timestamp: configData.timestamp,
        nonceStr: configData.nonceStr,
        signature: configData.signature,
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareAppMessage', 'onMenuShareTimeline','hideMenuItems'],
      });
      wx.ready( async function (res) {
        resolve(true);
        let hurl=location.protocol + '//' + location.hostname

        let title="澳門自來水·智慧水務"
        let desc="註冊成為會員，隨時繳費及查詢最新資訊，每日領取會員積分，可獲得豐富禮品！"
        let link=hurl

        wx.onMenuShareAppMessage({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: wxShareImg, // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户点击了分享后执行的回调函数
            console.log("分享了onMenuShareAppMessage");
          }
        });
        wx.onMenuShareTimeline({
          title: title, // 分享标题
          link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: wxShareImg, // 分享图标
          success: function () {
            // 用户点击了分享后执行的回调函数
            console.log("分享了onMenuShareTimeline");
          }
        })

        wx.updateAppMessageShareData({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link:link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: wxShareImg, // 分享图标
          success: function () {
            // 设置成功
            // await toShare();

          }
        })

        wx.updateTimelineShareData({
          title: title, // 分享标题
          link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: wxShareImg, // 分享图标
          success: async function () {

          }
        })


        wx.hideMenuItems({
          menuList: ['menuItem:copyUrl','menuItem:originPage','menuItem:openWithQQBrowser'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        });



      });
      wx.error(function(res){
        reject(res)
      });

    }
  })
  return res
}
export default share;
