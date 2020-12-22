<template>
  <div class="main">

    <!-- 页头 -->
    <Header :metaTitle='$t("dashboard.font37")' />

    <!-- 主体内容 -->
    <div class="body">
      <!-- 更新日期 -->
      <div class="date" v-if="messageList.length !== 0">{{ date }} {{$t("billsMessage.font1")}}</div>
      <div class="date" v-else>{{$t("billsMessage.font2")}}</div>
      <!-- 列表 -->
      <div class="list" v-for="(item,index) in messageList" :key="index" v-show="item.billAmount > 10">
        <!-- 标题 -->
        <div class="title">
          <h2>● {{ item.billAmount <= 10 ? $t("billsMessage.font3") : $t("billsMessage.font4") }}</h2>
          <!-- <span>{{ item.date }}</span> -->
        </div>
        <div class="content"><span v-if="item.aliasLb">[{{ item.aliasLb }}]</span>
		{{$t("billsMessage.font5")}}{{ item.warnBodyNb }}，{{ item.acctStatus }}</div>
      </div>
    </div>

  </div>
</template>

<script>
import Header from '@/components/Header'
import { getRemind } from '@/api/bill'


export default {
  name: 'Message',
  components:{
    Header : Header,
  },
  data(){
    return {
      date: sessionStorage.remindListDate ? sessionStorage.remindListDate : '',
      messageList:[{
		  billAmount:0,
		  aliasLb:false,
		  warnBodyNb:'',
		  acctStatus:''
	  }]
    }
  },
  computed: {
    	
  },
  async created() {
    this.$share();
    const that = this;
    let res = await getRemind([]);	  	
    if(res.code == 200){	  	  
      sessionStorage.remindList = JSON.stringify(res.result);
      that.messageList = res.result.uReminds;
      
    }
	
  },
  methods:{
	  async changeData(){
		  const that = this;
	  	let res = await getRemind([]);	  	
	  	if(res.code == 200){	  	  
	  	  sessionStorage.remindList = JSON.stringify(res.result);
	  	  this.messageList = res.result.uReminds;
		  //that.list()
	  	}	  	
	  },
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
    
    opacity:0.9;
    border-radius:14px;
    margin:0 auto;
	text-align: center;
    margin-top: 15px;
	span{
		display: inline-block;
		line-height: 28px;
		padding: 0 5px;
		height:28px;
		background:rgba(255,241,219,1);
	}
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
