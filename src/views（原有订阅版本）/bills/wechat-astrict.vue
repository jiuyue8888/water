<template>
  <div class="content"><div>由於微信限制，請點擊右上方<br/>使用<span>默認瀏覽器</span>打開該頁面</div></div>
</template>

<script>
  import { isWeChat, UrlSearch } from '@/utils'
  export default{
    data(){
      return {

      }
    },
    created(){
      let alipay = UrlSearch().alipay;
      if(!isWeChat()){
        location.href = alipay;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content{
    padding-top: 260px;
    height: calc(100vh - 260px);
    font-size: 18px;
    background-color: #fff;
    text-align: center;
    color: #808080;
    letter-spacing:2px;
    span{
      color:#084BBD;
    }
  }
</style>