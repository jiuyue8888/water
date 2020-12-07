<template>

  <div class="main">
      <i class="el-icon-warning" style="color:#10AEFF"></i>
      <h2>{{$t('Page401.font1')}}</h2>
  </div>
</template>

<script>

export default {
  name: 'Page401',
  data() {
    return {
    }
  },
}
</script>

<style>
  .main i{
    color:'#10AEFF';
  }
</style>

<style lang="scss" scoped>
  .main {
    background: #fff;
    text-align: center;
    width: 100%;
    height: calc(100vh - 100px);
    margin: 0 auto;
    padding-top: 100px;
    i{
      font-size: 104px;
    }
    h2{
      margin-top:10px;
    }
  }
</style>
