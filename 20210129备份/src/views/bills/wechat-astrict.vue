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
    
	width: 100%;
	box-sizing: border-box;
	padding: 260px 30px;
    height: 100vh;
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
