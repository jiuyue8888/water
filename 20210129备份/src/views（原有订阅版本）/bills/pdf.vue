<template>
  <div class="main">
    <!-- 页头 -->
<!--    <Header metaTitle="賬單詳情" :dataIcon="true" :registerState="registerState" @openDate="openDate" :bodyNb="bodyNb" :style="'width:calc(' + herderWidth + ' - 20px)'" />-->
    <Header metaTitle="賬單詳情" :dataIcon="true" :registerState="registerState" @openDate="openDate" :bodyNb="bodyNb" />
    <!-- 主体内容 -->
    <div class="body" v-loading="loading" >
      <pdf class="pdf" ref="pdf" :src="src" :style="{'width' : width}"></pdf>
      <ul>
        <li @click="zoomIn"><i class="el-icon-plus"></i></li>
        <li @click="zoomOut"><i class="el-icon-minus"></i></li>
      </ul>
    </div>

    <!-- pdf历史账单 -->
    <van-popup
      v-model="dateShow"
      position="bottom">
      <van-picker
        show-toolbar
        confirm-button-text="確認"
        :columns="pdfHistoryList"
        @cancel="dateShow = false"
        @confirm="dateConfirm"
      />
    </van-popup>

  </div>
</template>

<script>
import Header from '@/components/Header'
import { getPdf, getPdfHistoryList } from '@/api/bill'
import pdf from 'vue-pdf'
import { Popup, Picker } from 'vant';

export default {
  name: 'Pdf',
  data(){
    return {
      dateShow:false,
      pdfHistoryList:[],
      loading: true,
      bodyNb : this.$route.query.bodyNb,
      transcNb : this.$route.query.transcNb||'',
      registerState: this.$route.query.registerState,
      src:'',
      width:'100%',
      herderWidth:'100%',
    }
  },
  components:{
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    Header : Header,
    pdf : pdf,
  },
  created(){
    if(process.env.NODE_ENV === 'development'){
      this.getPdf();
    }else{
      let hurl=this.transcNb?location.protocol+'//'+location.hostname+'/api/v1/down/pdfBill?bodyNb='+ this.bodyNb +'&transcNb=' + this.transcNb:location.protocol+'//'+location.hostname+'/api/v1/down/pdfBill?bodyNb='+ this.bodyNb+'&transcNb='
      this.src = pdf.createLoadingTask(hurl);
      setTimeout(() => {
        this.loading = false;
      },500);
    }
    if(this.registerState){
      this.getPdfHistoryList();
    }
  },
  methods:{
    //放大
    zoomIn(){
      let str = Number(this.width.replace("%",""));
      this.width = (str + 10) + '%';
      if(str <= 90){
        this.herderWidth = '100%';
      }else{
        this.herderWidth = (str + 10) + '%';
      }

    },
    //缩小
    zoomOut(){
      let str = Number(this.width.replace("%",""));
      if(!(str <= 30)){
        this.width = (str - 10) + '%';
      }
      if(str <= 100){
        this.herderWidth = '100%';
      }else{
        this.herderWidth = (str - 10) + '%';
      }
    },
    // pdf文件流处理
    async getPdf(){
      let data = this.transcNb?{
        bodyNb : this.bodyNb,
        transcNb : this.transcNb || '',
      }:{
        bodyNb : this.bodyNb,
        transcNb : '',
      }
      let res = await getPdf(data);
      if(res){
        var binaryData = [];
        binaryData.push(res);
        this.src = window.URL.createObjectURL(new Blob(binaryData));
        this.loading = false;
      }
    },
    //获取pdf历史账单
    async getPdfHistoryList(){
      let data = {
        bodyNb : this.bodyNb
      }
      let res = await getPdfHistoryList(data);
      if(res.code == 200){
        let arr = [];
        res.result.forEach(item => {
          arr.push({
            text : item.porderMonth,
            transcNb : item.transcNb,
          })
        })
        this.pdfHistoryList = arr;
      }
    },
    //打开日期
    openDate(){
      this.dateShow = true;
    },
    //确认日期
    dateConfirm(data){
      this.loading = true;
      this.transcNb = data.transcNb;
      this.dateShow = false;
      if(process.env.NODE_ENV === 'development'){
        this.getPdf();
      }else{
        let hurl=this.transcNb?location.protocol+'//'+location.hostname+'/api/v1/down/pdfBill?bodyNb='+ this.bodyNb +'&transcNb=' + this.transcNb:location.protocol+'//'+location.hostname+'/api/v1/down/pdfBill?bodyNb='+ this.bodyNb+'&transcNb='
        this.src = pdf.createLoadingTask(hurl);
        setTimeout(() => {
          this.loading = false;
        },500);
      }
    },
  }
}
</script>


<style lang="scss" scoped>
  .body{
    /*overflow: hidden;*/
    overflow: auto;
    ul{
      position: fixed;
      bottom:0;
      right: 10px;
    }
    ul li{
      box-shadow: 0px 0px 10px #ccc;
      width: 46px;
      height: 24px;
      background: #fff;
      border-radius: 30px;
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items:center;
      color: #000;
    }
    ul li i{
      font-weight: bold;
      font-size: 18px;
    }
  }
</style>
