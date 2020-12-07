<template>
  <div class="content"><div>{{$t("wechatAstrict.font1")}}</div></div>
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

      this.$share();
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
