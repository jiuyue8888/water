<template>
  <div class="main">
    
    <!-- 页头 -->
    <Header metaTitle="積分兌換" />

    <div class="title">
      <p>當前總積分：</p>  
      <p class="integral">{{ total }}<span> 積分</span></p>
    </div>

    <!-- 列表 -->
    <ul class="list">
      <li v-for="item in recordList">
        <span class="left">{{ item.project }}<p>{{ item.createTime }}</p></span>
        <span class="right"><span :style=" item.scoreChange.indexOf('-') == '-1' ? 'color:#3D62A9' : 'color:#F1C06A' ">{{ item.scoreChange }}</span></span>
      </li>
    </ul>

  </div>
</template>

<script>
import { getIntegralRecord } from '@/api/integral' 
import Header from '@/components/Header' 


export default {
  name: 'memberGiftRecord',
  data(){
    return {
      total : 0,
      recordList:[]
    }
  },
  components:{
    Header : Header,
  },
  created(){
    this.getIntegralRecord();
  },
  methods:{
    async getIntegralRecord(){
      let res = await getIntegralRecord();
      if(res.code == 200){
        this.total = res.result.totalScore;
        this.recordList = res.result.details;
      }
    }
  }
}
</script>



<style lang="scss" scoped>
// 标题
.title{
  display: flex;
  justify-content:space-between;
  background-color: #fff;
  width: calc(100% - 50px);
  height: 60px;
  line-height: 60px;
  padding:0 25px;
  .integral{
    color: #3D62AA;
    font-size: 24px;
    font-weight: bold;
    span{
      font-weight: lighter;
      font-size: 14px;
      color: #666;
    }
  }
}

// 列表
.list li{
  width: 85%;
  padding:15px;
  margin:0 auto;
  margin-top: 15px;
  border-radius:8px;
  background:#fff;
  display: flex;
  justify-content:space-between;
  align-items:center;
  font-size: 14px;
  .left{
    p{
      font-size: 12px;
      color: #999;
      padding-top: 10px;
    }
  }
  .right{
    display: flex;
    align-items:center;
    span{
      padding-left: 5px;
      font-size: 24px;
    }
  }
}

</style>
