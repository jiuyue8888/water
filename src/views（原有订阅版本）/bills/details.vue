<template>
  <div class="main">
    <!-- 页头 -->
    <Header metaTitle="管理賬單" :bodyNb="bodyNb" />
    <!-- 主体内容 -->
    <div class="body">
      <!-- 账单AMR -->
      <div class="amr" v-if="billDetails.registerState && amrShow">
        <div class="title">本週用水</div>
<!--        <p class="calc" :style="this.chartDataText.calcWeek > 0 ? 'color:#FD5252' : 'color:#A6F60D;'">{{ this.chartDataText.calcText }}{{ formatNumberRgx(Math.abs(this.chartDataText.calcWeek)) }}L</p>-->
        <div class="charts">
          <el-row>
            <el-col :span="16">
              <ul>
                <el-row :gutter="20">
                  <el-col :span="12"><li><span style="color: #E3EFCB">●</span> {{ formatNumberRgx(this.chartDataText.thisWeek) }}L<p>本週用量</p></li></el-col>
                  <el-col :span="12"><li><span style="color: #9DCB44">●</span> {{ formatNumberRgx(this.chartDataText.lastWeek) }}L<p>上週用量</p></li></el-col>
                  <el-col :span="12"><li>{{ formatNumberRgx(this.chartDataText.monthWeek) }}L<p>月用水量</p></li></el-col>
                </el-row>
              </ul>
            </el-col>
            <el-col :span="8">
              <div class="right"><ve-pie :legend-visible="false" :data="chartData" :settings="chartSettings" :colors="colors" height="130px"></ve-pie></div>
            </el-col>
          </el-row>
        </div>
        <div class="title" style="padding-top: 10px;">節水排行榜</div>

<!--        <p class="calc" :style="this.chartDataText.calcWeek > 0 ? 'color:#FD5252' : 'color:#A6F60D;'">-->
<!--          {{ this.chartDataText.calcText }}-->
<!--          {{ formatNumberRgx(Math.abs(this.chartDataText.calcWeek)) }}L</p>-->

        <div class="rank-div">
          <el-row>
            <el-col :span="8">
              <div class="table-state">
                <div style="color: #EA3323;" v-if="amrNumber<20">加油</div>
                <div style="color: #EA983E;" v-else-if="amrNumber<40">一般</div>
                <div style="color: #FDF151;" v-else-if="amrNumber<60">好</div>
                <div style="color: #99C355;" v-else-if="amrNumber<80">非常好</div>
                <div style="color: #4AA35A;" v-else>極好</div>
              </div>
              <div class="calc-div">
                <div class="num"><span style="color: #9DCB44">●</span>{{ formatNumberRgx(Math.abs(this.chartDataText.calcWeek)) }}L</div>
                <div class="p">{{ this.chartDataText.calcText }}</div>
              </div>
            </el-col>
            <el-col :span="16">
               <div class="table-box">
                 <div class="needle" :style="'transform: rotate('+needleRotate+'deg)'">
                   <img src="../../assets/images/table-2.png">
                 </div>

               </div>
            </el-col>
          </el-row>
        </div>



        <p class="more">{{ this.chartDataText.updateDate }}<span @click="warningShow = !warningShow">更多數據 <i :class="warningShow == true ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></span></p>
      </div>
      <!-- 警告推送 -->
      <el-collapse-transition v-if="billDetails.registerState && warningShow">
        <div class="warning">
          <div class="title">近七日用水量比較</div>
          <div class="average">平均用水量：{{ formatNumberRgx(average) }}L</div>
          <div class="charts">
            <ve-histogram :data="histogramData" :legend-visible="false" :extend="chartExtend" height="220px" width="100vw" style="top:-50px;left: -50px"></ve-histogram>
          </div>
          <div class="rule-tip">*相關訊息僅供參考，一切仍以水費單為準</div>
          <div class="switch">
            用水提示推送
            <div class="right">
              <i class="el-icon-warning-outline"></i>
              <span class="text">提示訊息推送</span>
              <el-switch
                :value="warningSwitch"
                @change="switchChange($event,2)"
                active-color="#9DCB44"
                inactive-color="#DCDFE6">
              </el-switch>
            </div>
          </div>
          <div class="tab">
            <!-- <span style="float: right;font-size: 14px;margin-top: 20px;">僅提供近一年漏水記錄</span> -->
            <el-tabs v-model="tabName">
              <el-tab-pane label="僅提供近一年記錄" name="first">
                <el-timeline>
                  <el-timeline-item
                    v-for="(activity, index) in activities"
                    :key="index"
                    :timestamp="activity.timestamp"
                    color="#fff"
                    placement="top">
                     {{activity.content}}
                  </el-timeline-item>
                </el-timeline>
              </el-tab-pane>
              <!-- <el-tab-pane label="2018" name="second">2018</el-tab-pane> -->
              <!-- <el-tab-pane label="2017" name="third">2017</el-tab-pane> -->
            </el-tabs>
          </div>
        </div>
      </el-collapse-transition>
      <!-- 账单信息 -->
      <div class="info">
        <div class="center">
          <div class="title"><div class="over-hidden"><p>{{ billDetails.bodyName || billDetails.bodyNb }}</p><span class="yellow" v-if="!billDetails.registerState">(非登記用戶)</span></div><span class="red">● {{ billDetails.amount <= 10 ? '已缴费' : '未繳費' }}</span></div>
          <div style="border-bottom: 1px solid rgba(92,141,230,0.4);">最後繳費日期：<span>{{ billDetails.deadline }}</span></div>
          <div style="border-bottom: 1px solid rgba(92,141,230,0.4);">避免截水最後繳費日期：<span>{{ billDetails.avoidDeadline }}</span></div>
          <div>結欠金額：<span>MOP <span class="red">${{ billDetails.amount }}</span></span></div>
        </div>
      </div>
      <!-- 账单服务 -->
      <div class="serve">
        <el-collapse v-model="activeNames" @change="collapseChange" ref="collapse">
          <el-collapse-item title="賬單服務" name="1">
            <ul>
              <li v-if="billDetails.registerState">
                <div><svg-icon icon-class="wechat"></svg-icon>微信賬單服務<div class="brandNew">全新服務</div></div>
                <el-switch
                  :value="billDetails.wxBindFlag == 'Y' ? true : false"
                  @change="switchChange($event,1)"
                  active-color="#9DCB44"
                  inactive-color="#DCDFE6">
                </el-switch>
              </li>
              <li @click="editShow = true">
                <div><svg-icon icon-class="edit"></svg-icon>修改賬單別稱</div>
                <i class="el-icon-arrow-right"></i>
              </li>
              <li v-if="billDetails.registerState" @click="externalLink('/member/bill-management',true)">
                <div><svg-icon icon-class="note"></svg-icon>短信提示服務</div>
                <i class="el-icon-arrow-right"></i>
              </li>
              <li v-if="billDetails.registerState && amrShow">
                <div><svg-icon icon-class="warning"></svg-icon>用水提示信息推送</div>
                <el-switch
                  :value="warningSwitch"
                  @change="switchChange($event,2)"
                  active-color="#9DCB44"
                  inactive-color="#DCDFE6">
                </el-switch>
              </li>
            </ul>
          </el-collapse-item>
          <el-collapse-item title="繳付賬單" name="2">
            <ul>
              <li @click="openPayment">
                <div><svg-icon icon-class="money"></svg-icon>前往繳費</div>
                <div class="payment">支付寶、銀行卡、Mpay<i class="el-icon-arrow-right"></i></div>
              </li>
              <!-- <li @click="openQrCode">
                <div><svg-icon icon-class="qr-code"></svg-icon>打開繳費碼</div>
                <div class="payment">便利店支付<i class="el-icon-arrow-right"></i></div>
              </li> -->
            </ul>
          </el-collapse-item>
          <el-collapse-item title="查看賬單" name="3">
            <ul v-if="billDetails.registerState">
<!--              <router-link v-for="(item, index) in pdfHistoryList" :key="index" :to="{path:'/bills/pdf', query: { bodyNb: bodyNb, transcNb: item.transcNb, registerState: billDetails.registerState }}">-->
                <li class="no-touch" v-for="(item, index) in pdfHistoryList" @click="$router.push({path:'/bills/pdf', query: { bodyNb: bodyNb, transcNb: item.transcNb, registerState: billDetails.registerState }})">
                  <div>{{ item.porderMonth }}<!-- <div class="brandNew" style="color: #9DCB44;border:1px solid #9DCB44;">當期賬單</div> --></div>
                  <div>MOP ${{ item.bodyAmt }}<i class="el-icon-arrow-right"></i></div>
                </li>
<!--              </router-link>-->
            </ul>
            <ul v-else>
<!--              <router-link :to="{ path: '/bills/pdf', query: { bodyNb: bodyNb, transcNb: billDetails.transcNb, registerState: billDetails.registerState } }">-->
                <li class="no-touch" @click="$router.push({path: '/bills/pdf', query: { bodyNb: bodyNb, transcNb: billDetails.transcNb, registerState: billDetails.registerState }})">
                  <div>{{ billDetails.porderMonth }}
                    <div class="brandNew" style="color: #9DCB44;border:1px solid #9DCB44;">當期賬單</div>
                  </div>
                  <div>MOP ${{ billDetails.amount }}<i class="el-icon-arrow-right"></i></div>
                </li>
<!--              </router-link>-->
            </ul>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <!-- 修改合同弹窗 -->
    <el-dialog
      title="修改合同別稱"
      width="80%"
      custom-class="dialog-common"
      :visible.sync="editShow"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <!-- 填写合同信息 -->
      <el-form  class="contractForm" ref="form" :rules="rules" :model="form" label-width="95px">
        <el-form-item label="合同編號：" class="onUnderline">
          <el-input readonly class="underline" v-model="bodyNb"></el-input>
        </el-form-item>
        <el-form-item label="賬單別稱：" class="onUnderline">
          <el-input readonly class="underline" v-model="billDetails.bodyName"></el-input>
        </el-form-item>
<!--        prop="bodyName"-->
        <el-form-item label="新的別稱：" class="new-alias">
          <el-input class="underline" maxlength="64" v-model="form.bodyName" placeholder="請輸入需要更改的別稱"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round @click="editShow = false">取消</el-button>
        <el-button round type="primary" @click="editSubmit">確認變更</el-button>
      </span>
    </el-dialog>

    <!-- 微信账单弹层/警告弹窗/服务渠道弹窗 -->
    <wx-bill :contractNo="bodyNb" :dialogContent="dialogContent" ref="wxBill" @emitSubmitWeChatBill="emitSubmitWeChatBill" />

  </div>
</template>

<script>
import { editContract,newEditContract, getBillDetails, getPdfHistoryList, getWater, getWaterSeven,  getAlertList, getAlertState, lookEbillState,amiRank } from '@/api/bill'
import { autoJump } from '@/api/others'
import WxBill from '@/components/WxBill'
import Header from '@/components/Header'
import {getToken } from '@/utils/auth'
import VePie from 'v-charts/lib/pie.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import { parseTime } from '@/utils'

export default {
  name: 'Details',
  data(){
    this.colors = ['#E3EFCB','#9DCB44','#FD5252'];
    this.chartSettings = {
      radius: 45,
      label: {
        normal: {
          show: false,
        },
        emphasis: {
          show: false,
        }
      },
      offsetY:65,
    }
    this.chartExtend = {
      itemStyle:{
        color:'#9DCB44',
      },
      series: {
        barWidth: 16
      },
      xAxis:{
       axisLabel:{
        color: '#fff'
       },
       axisTick:{
        show:true,
        inside:true
       },
       axisLine:{
        show:true,
        lineStyle:{
          color:'#fff'
        }
       }
      },
      yAxis:{
        show:false
      }
    }
    return {
      memberNb:sessionStorage.memberNb,
      bodyNb:'',
      activeNames:['1','2','3'],
      editShow:false,
      billDetails:{
        bodyName: '',
        wxBindFlag: '',
        registerState: '',
        amount:'',
        deadline:'',
        avoidDeadline:'',
        transcNb: '',
        porderMonth: '',
        payFlag:'', //是否可以缴费
        payRemark:'',//备注
        acctStatus: ''
      },
      form:{
        bodyName:'',
      },
      rules: {
        bodyName: [
          { required: true, message: '請輸入賬單別稱', trigger: 'blur' },
          { max: 20, message: '別稱最多支持20個字符', trigger: 'blur' }
        ],
      },
      //AMR和警告推送的测试数据
      chartData: {
        columns: ['text', 'value'],
        rows: []
      },
      chartDataText:{
        thisWeek : 0,
        lastWeek : 0,
        calcWeek : 0,
        monthWeek : 0,
        calcText : '',
        updateDate:'',
      },
      histogramData:  {
        columns: ['text', '用水量'],
        rows: []
      },
      average:0,
      warningShow:false,
      warningSwitch:false,
      dialogContent:{
        type:'',
        title:'',
        content:'',
        cdType: '',
        cdStatus: ''
      },
      tabName:'first',
      activities: [],
      alertYearNum:null,
      pdfHistoryList:[],
      amrShow:false,
      amrNumber:0,
      needleRotate:0,


      cdType: '',
      cdStatus: ''
    }
  },
  watch:{
    amrNumber(data){
      this.needleRotate=data/100*180
    },
  },


  components:{
    WxBill : WxBill,
    Header : Header,
    VePie : VePie,
    VeHistogram : VeHistogram,
  },
  async created(){
    await this.getBillDetails();
    this.getPdfHistoryList();
    this.getWater();
    this.getAlertState();
    this.getAlertList();
    this.getWaterSeven();
  },
  methods:{
    test(){
      this.$message('待開發')
    },


    //转换为千分符
    formatNumberRgx(num) {
      var parts = num.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    },

    /**
     * 获取账单详情
     * 注意:params需要提供合同号、合同别名、是否登记用户、微信账单订阅，因为后端接口不提供
     */
    async getBillDetails(){
      let billDetails = Object.keys(this.$route.params).length ? this.$route.params : JSON.parse(sessionStorage.billDetails);
       console.log('111',billDetails)
	  this.bodyNb = billDetails.bodyNb;
      let data = {
        bodyNb : billDetails.bodyNb
      }
      let res = await getBillDetails(data);
      if(res.code == 200){
        let bodyAmt = String(res.result.bodyAmt);
        // if(bodyAmt.indexOf('-') !== -1){
        //   bodyAmt = bodyAmt.slice(1);
        // }else{
        //   bodyAmt = bodyAmt;
        // }
        billDetails.amount = bodyAmt;
        billDetails.acctNb = res.result.acctNb;
        billDetails.deadline = res.result.bodyDueDate;
        billDetails.avoidDeadline = res.result.cutOffDate;
        billDetails.payFlag = res.result.payFlag;
        billDetails.payRemark = res.result.payRemark;
        billDetails.acctStatus = res.result.acctStatus;
        billDetails.transcNb = res.result.transcNb;
        billDetails.porderMonth = res.result.porderMonth;
        sessionStorage.billDetails = JSON.stringify(billDetails);
        this.billDetails = billDetails;
      }
    },
    //获取用水量
    async getWater(){
      let data = {
        lang : 'zh_TW',
        bodyNb : this.billDetails.bodyNb,
        acctNb : this.billDetails.acctNb,
      }
      let res = await getWater(data);
      if(res.code == 200){
        if(!res.result){
          this.amrShow = false;
        }else{
          this.amrShow = true;

          let resAmr=await amiRank(this.billDetails.bodyNb)
          if(resAmr.code==200){
            // this.amrNumber=100-resAmr.data.nbPercent
            this.amrNumber=resAmr.data.nbPercent
          }

        }
        if(res.result !== null){
          let num = res.result.thisWeekConsumption - res.result.lastWeekConsumption;
          let numTwo = Math.abs(num);
          let arr = [
            {text : '本週用量', value : res.result.thisWeekConsumption},
            {text : '上週用量', value : res.result.lastWeekConsumption},
            {text : '', value : numTwo},
          ];
          this.chartDataText.thisWeek = res.result.thisWeekConsumption;
          this.chartDataText.lastWeek = res.result.lastWeekConsumption;
          this.chartDataText.calcWeek = num;
          this.chartDataText.monthWeek = res.result.thisMonthConsumption;
          this.chartDataText.updateDate = parseTime(res.result.lastReadingDt,'數據於{d}日{h}:{i}更新');
          if(num > 0){
            this.colors[2] = '#FD5252';
            arr[2].text = '較上週增加';
            this.chartDataText.calcText = '較上週增加';
          }else{
            this.colors[2] = '#fff';
            arr[2].text = '較上週節省';
            this.chartDataText.calcText = '較上週節省';
          }
          this.chartData.rows = arr;
        }
      }
    },
     //获取警告推送列表
    async getAlertList(){
      let data = {
        lang : 'zh_TW',
        bodyNb : this.billDetails.bodyNb,
        acctNb : this.billDetails.acctNb,
        orderBy : 'desc',
        allData : 1,
      }
      let res = await getAlertList(data);
      if(res.code == 200 && res.result !== null){
        let arr = [];
        res.result.forEach(item => {
          arr.push({
            'timestamp' : parseTime(item.dhHappened,'{y}-{m}-{d}'),
            'content' : item.desc
          })
        })
        this.alertYearNum = parseTime(res.result[0].dhHappened,'{y}')
        this.activities = arr;
      }
    },
    //获取7日用水量
    async getWaterSeven(){
      let calcTime = new Date().getTime() - 24*60*60*2000;
      let time = parseTime(calcTime,'{y}-{m}-{d}');
      let data = {
        lang : 'zh_TW',
        bodyNb : this.billDetails.bodyNb,
        acctNb : this.billDetails.acctNb,
        bodyNbList : [this.billDetails.bodyNb],
        date : time,
      }
      let res = await getWaterSeven(data);
      if(res.code == 200 && res.result !== null){
        let arr = [];
        let average = 0;
        let DaysList = res.result.last14Dayslist[0].list.slice(0,7);
        DaysList.forEach(item => {
          arr.push({
            'text' : parseTime(item.dtReading,'{m}/{d}'),
            '用水量' : item.consumption
          })
          average += item.consumption;
        })
        this.average = parseFloat(average / 7).toFixed(2);
        this.histogramData.rows = arr.reverse();
      }
    },
    //获取pdf历史账单
    async getPdfHistoryList(){
      if(this.billDetails.registerState){
        let data = {
          bodyNb : this.bodyNb
        }
        let res = await getPdfHistoryList(data);
        if(res.code == 200){
          this.pdfHistoryList = res.result;
        }
      }
    },
    //面板折叠
    collapseChange(){
    },
    //获取警告推送状态
    async getAlertState(){
      let data = {
        lang : 'zh_TW',
        bodyNb : this.billDetails.bodyNb,
      }
      let res = await getAlertState(data);
      if(res.result){
        this.cdType = res.result.cdType;
        this.cdStatus = res.result.cdStatus;
        if(res.result.cdType === '2' && res.result.cdStatus === '1') {
          this.warningSwitch = true;
        } else {
          this.warningSwitch = false;
        }
      } else {
        this.warningSwitch = false;
      }
    },
    //查询ebill申请状态
    async lookEbillState(){
      let data = {
        bodyNb: this.billDetails.bodyNb,
        lang: 'zh_TW',
      }
      let res = await lookEbillState(data);
      // let res = {"msg":"调用成功","result":{"cdMailty":"2","cdEblsts":"30"},"code":200}
      if(res.code == 200){
        if(!res.result){
          return 1;
        }else if( res.result.cdMailty == 1 && res.result.cdEblsts == 30 ){
          return 3;
        }else if( res.result.cdMailty == 2 && res.result.cdEblsts == 30 ){
          return 4;
        }else{
          return 1;
        }
      }
    },
    /**
     * 开关服务
     * @param  {[Boolean]} state [true:开启,false:终止]
     * @param  {[Number]} type  [1:微信账单,2:警告推送,3:已开启SEPBOX,4:已开启Email]
     */
    async switchChange(state,type){

      //开启微信电子账单服务
      if(type == 1 && state == true){
        await this.lookEbillState().then(res => {
          type = res;
        });
      }

      let content = '申請條款及細則：<p>1、「電子賬單」服務申請人（以下簡稱“用戶”）必須為澳門自來水股份有限公司（以下簡稱“澳門自來水”）的登記用戶。</p><p>2、用戶可選擇經微信、一般電子郵箱或澳門郵政安全電子郵箱接收「電子賬單」服務。</p><p>3、用戶如選擇經一般電子郵箱接收電子賬單，服務登記後，用戶指定的電子郵箱將會收到啟用服務電郵，須經用戶確認後才正式啟動服務。</p><p>4、「電子賬單」服務生效後，澳門自來水將以發送賬單電子檔取代郵寄紙質賬單。</p><p>5、倘「電子賬單」服務生效時間與澳門自來水發單期間相近，則當期賬單將可能保留以原方式發送。</p><p>6、用戶有責任在指定的“最後繳費日期”或之前繳付賬單，根據供水合同條款，用戶須承擔逾期繳費之一切後果。</p><p>7、用戶可隨時透過登入澳門自來水官方網站/手機應用程式/微信號或致電客戶熱線查閱賬單的應付金額。</p><p>8、用戶須向澳門自來水提供正確、完整及最新的登記資料。</p><p>9、當澳門自來水發現用戶並非合約持有人，澳門自來水保留暫停或終止用戶「電子賬單」服務的權利，恕不另行通知。</p><p>10、澳門自來水保留隨時更改和修改本條款及細則的權利，恕不另行通知。</p><p>11、澳門自來水透過此服務所收集的個人資料會用作處理申請及方便日後通訊的用途。申請人有權依法申請查閱、更正或更新其存於澳門自來水的個人資料。詳情請致電客戶熱線(853)2822 0088或親臨澳門自來水客戶服務中心查詢。</p><p>12、微信、互聯網及電話申請僅適用於個人名義之用戶。</p>';
      if(type == 1){
        this.dialogContent.title = '微信電子賬單服務';
        this.dialogContent.content = content;
      }else if(type == 2){
        if (this.cdType === '1' && this.cdStatus === '1') {
          this.dialogContent.title = '修改用水警告服務渠道';
          this.dialogContent.cdType = '1';
          this.dialogContent.cdStatus = '1';
        } else {
          this.dialogContent.title = '警告信息推送';
        }
        this.dialogContent.content = '申請條款及細則：<p>1、「智能水錶提示」服務申請人（以下簡稱“用戶”）必須為澳門自來水股份有限公司（以下簡稱”澳門自來水”）的登記用戶。</p><p>2、「智能水錶提示」服務僅適用於已安裝智能水錶的用戶。</p><p>3、用戶可選擇經微信或一般電子郵箱接收「智能水錶提示」服務。微信服務僅適用於個人用戶。</p><p>4、用戶如選擇經一般電子郵箱接收提示，服務登記後，用戶指定的電子郵箱將會收到啟用驗證碼，須經用戶輸入驗證碼後才正式啟動服務。</p><p>5、「智能水錶提示」服務生效後，當智能水錶偵測到用水異常時，系統會向用戶發出用水異常提醒。</p><p>6、「智能水錶提示」服務不影響用戶對內部供水設備之檢查、保養及維修責任。</p><p>7、「智能水錶提示」服務提供之資訊僅供參考。</p><p>8、澳門自來水承諾盡力避免因傳送錯誤造成損失或損害，但對上述錯誤所引致的損害，澳門自來水恕不負責。</p><p>9、用戶可隨時透過登入澳門自來水官方網站/微信號或現場視察水錶，以獲取用水量資訊。</p><p>10、如有關水錶位置及環境不適宜進行安裝智能水錶，澳門自來水有權拒絕提供「智能水錶提示」服務。</p><p>11、用戶須向澳門自來水提供正確、完整及最新的登記資料。</p><p>12、當發現服務申請人並非屬用戶合同第二條規定之合法佔用之權利人，澳門自來水保留暫停或終止用戶「智能水錶提示」服務的權利，恕不另行通知。</p><p>13、澳門自來水保留隨時更改和修改本條款及細則的權利，恕不另行通知。</p><p>14、澳門自來水透過此服務所收集的個人資料會用作處理申請及方便日後通訊的用途。申請人有權依法申請查閱、更正或更新其存於澳門自來水的個人資料。詳情請致電客戶熱線(853)2822 0088或親臨澳門自來水客戶服務中心查詢。</p>';
      }else if(type == 3){
        this.dialogContent.title = 'SEPBOX';
        this.dialogContent.content = content;
      }else if(type == 4){
        this.dialogContent.title = 'Email';
        this.dialogContent.content = content;
      }
      this.dialogContent.type = type;
      this.$refs['wxBill'].switchChange(state)
    },
    //改变微信账单状态
    emitSubmitWeChatBill(boolean){
      if(this.dialogContent.type == 2){
        this.warningSwitch = boolean;
      }else{
        this.billDetails.wxBindFlag = boolean ? 'Y' : 'N';
        sessionStorage.billDetails = JSON.stringify(this.billDetails);
      }
    },
    //修改提交
    editSubmit(){
      let openId=getToken()
      this.$refs['form'].validate(async(valid) => {
        if(valid){
          // let data = {
          //   memberNb:sessionStorage.memberNb,
          //   bodyNb:this.bodyNb,
          //   aliasLb:this.form.bodyName,
          // }
          // let res = await editContract(data);
          let data = {
            memberNb:sessionStorage.memberNb,
            bodyNb:this.bodyNb,
            openId:openId,
            aliasLb:this.form.bodyName,
          }
          let res = await newEditContract(data);

          if(res.code == 200){
            this.editShow = false;
            this.billDetails.bodyName = data.aliasLb;
            sessionStorage.billDetails = JSON.stringify(this.billDetails);
            this.$message('修改成功')
          }
        }
      })
    },
    //前往支付
    openPayment(){
      this.$router.push('/bills/payment/' + this.bodyNb)
    },
    //外部链接
    async externalLink(url,isToken){
      if(isToken){
        let data = {
          lang: 'zh_TW',
          url: url
        }
        let res = await autoJump(data);
        if(res.code == 200){
          location.href = res.result.url;
        }
      }else{
        location.href = url;
      }
    },
  }
}
</script>

<style lang="scss">
  .serve {
    .el-collapse-item__content{
      padding-bottom: 0;
    }
    .el-collapse .el-collapse-item .el-collapse-item__header{
      // border-bottom: 1px dashed #EBEEF5;
      font-size: 16px;
    }
    .el-collapse .is-active .el-collapse-item__wrap{
      border-bottom: 0;
    }
    .el-collapse .el-collapse-item:nth-child(3) .el-collapse-item__header{
      border-bottom: 0;
    }
    .el-collapse-item__header{
      font-weight: bold;
      i{
        font-weight: bold;
      }
    }
  }
  .contractForm{
    .el-form-item{
      margin-bottom: 0;
    }
    .onUnderline{
      .el-form-item__label{
        border-bottom: 0;
      }
      .underline input{
        font-weight: bold;
        border-bottom: 0;
      }
    }
  }
  .tab{
    .el-timeline-item__wrapper{
      display: flex;
      .el-timeline-item__timestamp.is-top{
        min-width:80px;
        padding-top: 2px;
      }
    }
    .el-tabs__nav {
      .el-tabs__item{
        color:#fff;
        line-height: 53px;
      }
      .el-tabs__active-bar{
        background-color: #fff;
        height:0;
      }
    }
    .el-tabs__nav-wrap::after{
      height: 0;
    }
    .el-tabs__content{
      max-height: 130px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 0 8px;
      .el-timeline-item{
        padding: 0 0 10px 0;
        font-size: 12px;
        .el-timeline-item__node--normal{
          left: 0px;
          width: 10px;
          height: 10px;
        }
        .el-timeline-item__timestamp{
          color:#fff;
        }
        .el-timeline-item__content{
          color:#fff;
        }
      }
      .el-timeline-item__content{
        padding-left: 10px;
      }
    }
    .el-tabs__content::-webkit-scrollbar { -webkit-appearance: none;}
    .el-tabs__content::-webkit-scrollbar:vertical { width: 3px;}
    .el-tabs__content::-webkit-scrollbar-thumb { border-radius: 8px; background-color: #fff;}
  }

  //修改合同别名
  .contractForm{
    .new-alias input,.new-alias .el-form-item__label{
      border-bottom:0;
    }
    .new-alias{
      border-bottom: 1px solid #DCDFE6;
    }
  }

</style>

<style lang="scss" scoped>
/*内容*/
.body{
  @mixin container{
    width: 85%;
    padding:0 15px;
    margin:0 auto;
    margin-top: 15px;
    font-size: 14px;
    border-radius:8px;
    color: #fff;
  }
  @mixin justify{
    display: flex;
    justify-content: space-between;
    align-items:center;
  }
  //账单AMR
  .amr{
    @include container;
    background-image: url('../../assets/images/amr-bg.png');
    background-size: 100% 100%;
    /*height: 218px;*/
    height: 340px;
    font-size: 16px;
    padding: 15px;
    border-radius:0;
    .calc{
      font-size: 14px;
      padding:10px 0 20px 0;
    }
    .charts{
      ul li{
        padding-bottom: 24px;
        p{
          font-size: 12px;
          color:#C7D8FA;
        }
      }
      .right{
        position: relative;
        top: -30px;
        left:8px;
      }
    }
    .more{
      font-size: 12px;
      color:#F5F8FF;
      @include justify;
    }
  }
  // 警告推送
  .warning{
    @include container;
    background:linear-gradient(124.2deg,rgba(61,98,167,1) 0%,rgba(49,71,122,1) 100%);
    padding: 15px;
    margin-top: 0px;
    font-size: 16px;
    height:467px;
    border-radius:0 0 8px 8px;
    position: relative;
    top: -8px;
    box-shadow: 0px 10px 15px #2F497E inset;
    .average{
      text-align: center;
      font-size: 14px;
      padding:20px 0;
    }
    .charts{
      height:126px;
    }
    .switch{
      @include justify;
      border-top: 1px solid #3E60A3;
      margin-top: 10px;
      padding-top: 20px;
      .right{
        display: flex;
        align-items:center;
        .text{
          padding: 0 10px 0 4px;
          font-size: 14px;
        }
      }
    }
  }
  //账单信息
  .info{
    @include container;
    background:linear-gradient(124.2deg,rgba(61,98,167,1) 0%,rgba(49,71,122,1) 100%);
    height: 180px;
    line-height: 42px;
    display: flex;
    align-items:center;
    .center{
      width: 100%;
      div{
        display: flex;
        justify-content: space-between;
      }
      .title{
        font-size: 16px;
        span{
          font-size: 14px;
        }
      }
      .over-hidden{
        width: calc(100% - 70px);
        justify-content: flex-start;
        p{
          width: calc(100% - 90px);
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .red{
        color: #FD5252;
      }
      .yellow{
        padding-left: 5px;
        color:#F1C06A;
      }
    }
  }
  //账单服务
  .serve{
    @include container;
    background:#fff;
    margin-top: 0;
    margin-bottom: 15px;
    .el-collapse-item{
      ul{
        padding:0 5px;
        li{
          color:#666;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          align-items:center;
          border-bottom: 1px dashed #EBEEF5;
          padding-bottom: 8px;
          margin-bottom: 10px;
          .svg-icon{
            padding-right: 5px;
            font-size: 16px;
          }
          .brandNew{
            margin-left: 5px;
            font-size: 12px;
            line-height: 18px;
            text-align: center;
            color: #FD5252;
            border:1px solid rgba(253,82,82,1);
            display: inline-block;
            width:60px;
            height:18px;
            border-radius:9px;
          }
          .payment{
            color:#999;
            font-size: 12px;
          }
          i{
            font-size: 14px;
            padding-left: 5px;
          }
        }
      }
    }
  }
}


.charts{
  margin-top: 10px;
}
  .rule-tip{
    text-align: center;
    font-size: 12px;
    color: #ffffff;
  }

  .rank-div{
    margin-bottom: 30px;
    .table-state{
      margin-top: 10px;
      font-size: 16px;
    }
    .table-box{
      width: 200px;
      height: 91px;
      background: url("../../assets/images/table-1.png") no-repeat;
      background-size: 100%;
      margin-left: auto;
      position: relative;
      .needle{
        width: 77px;
        height: 23px;
        position: absolute;
        left: 56.5px;
        bottom: -10px;
        transition: transform 0.5s;
        -webkit-transition: transform 0.5s;
        img{
          width: 100%;
          height: 100%;
          transform: translateX(-32.5px);
          -webkit-transform: translateX(-32.5px);
        }
      }

    }
  }


  .calc-div{
    margin-top: 20px;
    .num{
      color: #ffffff;
      font-size: 16px;
    }
    .p{
      color: #ffffff;
      font-size: 14px;
      opacity: 0.6;
    }
  }
</style>
