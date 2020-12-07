<template>
  <div class="main">
    
    <!-- 页头 -->
    <Header metaTitle="主頁" />

    <!-- 主体内容 -->
    <div class="body">
      <!-- 更新日期 -->
      <div class="date" v-if="list.length !== 0">{{ date }} 更新消息</div>
      <div class="date" v-else>當前還沒有消息</div>
      <!-- 列表 -->
      <div class="list" v-for="(item,index) in list" :key="index">
        <!-- 标题 -->
        <div class="title">
          <h2>● 賬單{{ item.billAmount <= 10 ? '已缴费' : '未繳費' }}</h2>
          <!-- <span>{{ item.date }}</span> -->
        </div>
        <div class="content"><span v-if="item.aliasLb">[{{ item.aliasLb }}]</span>合同號{{ item.warnBodyNb }}，{{ item.acctStatus }}</div>
      </div>
    </div>

  </div>
</template>

<script>
import Header from '@/components/Header' 


export default {
  name: 'Message',
  components:{
    Header : Header,
  },
  data(){
    return {
      date: sessionStorage.remindList ? JSON.parse(sessionStorage.remindList).date : '',
      messageList:sessionStorage.remindList ? JSON.parse(sessionStorage.remindList).uReminds : []
    }
  },
  computed: {
    list(){
      return this.messageList.filter(item => { return item.acctStatus !== '' && item.acctStatus !== null }) 
    }
  }
}
</script>



<style lang="scss" scoped>

/*内容*/
.body{
  // 日期
  .date{
    font-size: 12px;
    color: #D38B1A;
    text-align: center;
    line-height: 28px;
    width:195px;
    height:28px;
    background:rgba(255,241,219,1);
    opacity:0.9;
    border-radius:14px;
    margin:0 auto;
    margin-top: 15px;
  }
  // 列表
  .list{
    width: 85%;
    padding:15px;
    margin:0 auto;
    margin-top: 15px;
    border-radius:8px;
    background:#fff;
    .title{
      display: flex;
      justify-content: space-between;
      align-items:center;
      border-bottom: 1px solid #F8F8F8;
      padding-bottom: 15px;
      margin-bottom: 15px;
      h2{
        font-size: 16px;
        color:#EE4E4E;
      }
      span{
        color: #999999;
        font-size: 12px;
      }
    }
    .content{
      font-size: 14px;
      color: #666666;
    }
  }
}

</style>
