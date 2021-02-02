<template>
  <div class="main">
    <!-- 主体内容 -->
    <div class="body" v-loading="loading" >
      <pdf class="pdf" ref="pdf" :src="src" :style="{'width' : width}"></pdf>
      <ul>
        <li @click="zoomIn"><i class="el-icon-plus"></i></li>
        <li @click="zoomOut"><i class="el-icon-minus"></i></li>
      </ul>
    </div>
    <van-loading color="#1989fa" />

  </div>
</template>

<script>
import { getPdfview} from '@/api/bill'
import pdf from 'vue-pdf'
export default {
  name: 'Pdfview',
  data(){
    return {
      loading: true,
      key : this.$route.query.key,
      src:'',
      width:'100%',
      herderWidth:'100%',
    }
  },
  components:{
    pdf : pdf,
  },
  created(){
    if(process.env.NODE_ENV === 'development'){
      this.getPdf();
    }else{
      this.src = pdf.createLoadingTask(location.protocol+'//'+location.hostname+'/api/v1/bill/pdf?key='+this.key);
      setTimeout(() => {
        this.loading = false;
      },500);
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
      let data = {
        key : this.key//'9B80C5F68F61F098ECAE561A0E294A44',
      }
      let res = await getPdfview(data);
      if(res){
        var binaryData = [];
        binaryData.push(res);
        this.src = window.URL.createObjectURL(new Blob(binaryData));
        this.loading = false;
      }
    },


  }
}
</script>


<style lang="scss" scoped>
  .body{
    overflow: auto;
    ul{
      position: fixed;
      bottom:20px;
      right: 20px;
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
