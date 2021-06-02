import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.scss' // 全局样式
import './icons' // 图标
import VConsole from 'vconsole' //微信浏览器调试工具
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.use(ElementUI);

import 'lib-flexible'
import i18n from './utils/i18n/index'

// new VConsole() // 初始化
// if(process.env.NODE_ENV !== 'production'){  // 生产环境
//   new VConsole() // 初始化
// }

import share from '@/utils/share'
Vue.prototype.$share = share

//解决移动端弹出框背景层滑动问题
Vue.prototype.noScroll = function (type) {
  if(type == 'add'){//开启弹窗
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }else{//关闭弹窗
    // window.scroll(0,0);
    document.body.style.position = 'static';
  }
}


import {Message } from 'element-ui'
Vue.prototype.$message = function (text) {
  Message({
    message: text,
    offset:150
  })
}

const projectModel='formal';//正式：formal，测试：test，

Vue.prototype.$config = {
  projectModel:projectModel,

  APPID:projectModel=='formal'?'wxb364df0830b4a7dd':'wx745469f34326f4df',
}

if(Vue.prototype.$config.APPID== 'wx745469f34326f4df'&&process.env.NODE_ENV == 'production'){  // 生产环境
  new VConsole() // 初始化
}

const BrowserLogger = require('alife-logger');
const __bl = BrowserLogger.singleton({pid:"hn0fyffmyw@d13a2df94cb9d09",appType:"web",imgUrl:"https://arms-retcode.aliyuncs.com/r.png?",sendResource:true,enableLinkTrace:true,behavior:true});

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
