import Vue from 'vue'
import en from './language/en.js';
import zh from './language/zh.js';

import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: localStorage.getItem('language')?localStorage.getItem('language'):navigator.language=='zh-CN'?'ZH':'EN', // 语言标识
  messages: {
    'ZH': zh,
    'EN': en
  }
})
export default i18n
