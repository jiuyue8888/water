import Vue from 'vue'


import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: localStorage.getItem('language')?localStorage.getItem('language'):navigator.language=='zh-CN'?'ZH':'EN', // 语言标识
  messages: {
    'ZH': require('./language/zh'),
    'EN': require('./language/en')
  }
})
export default i18n
