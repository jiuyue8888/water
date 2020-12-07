<template>
  <div class="main">
    <!-- 页头 -->
    <Header metaTitle="" :bodyNb="orderInfo.bodyNb" />

    <!-- 主体内容 -->
    <div class="body">
      <div class="acctStatus-msg" v-if="isAcctStatus">
        <p>{{ orderInfo.acctStatus }}</p>
        <!-- <p>
          合同號 122948 已逾期，將被停止供水服務，<br/>請盡快到本公司客戶服務中心繳費。
        </p> -->
      </div>
      <div class="payRemark-msg" v-if="isPayRemark">
        <p>{{ orderInfo.payRemark }}</p>
      </div>


      <h2>繳費單據</h2>
      <ul>
        <li>
          <span class="key">合同號碼</span>
          <span>{{ orderInfo.bodyNb }}</span>
        </li>
        <li>
          <span class="key">發單月份</span>
          <span>{{ orderInfo.issuanceData }}</span>
        </li>
        <li>
          <span class="key">最後繳費日期</span>
          <span>{{ orderInfo.deadline }}</span>
        </li>
        <li>
          <span class="key">避免截水最後繳費日期</span>
          <span>{{ orderInfo.avoidDeadline }}</span>
        </li>
        <li>
          <span class="key">供水地址</span>
          <span style="max-width:70%">{{ orderInfo.address }}</span>
        </li>
        <li>
          <span class="key">應付金額</span>
          <span class="value">MOP $ {{ orderInfo.amountPay }}</span>
        </li>
      </ul>
      <h2 class="paymentMethod">選擇支付方式<span v-if="orderInfo.paymentMethod == '8'">每次使用需輸入銀行卡資料</span></h2>
      <div class="clause">
        <p>繳費前請先詳閱所有細則及提示</p>
        <p>
          <span @click="eServicesClause = true">《電子服務及免責條款》</span>
          
          <span @click="privacyClause = true">《隱私條款》</span>
        </p>
      </div>
      <div class="icon" @click="switchIcon">
        <svg-icon :class="{gray:!orderInfo.payFlag}" icon-class="may" data-id="20" />
        <svg-icon :class="{gray:!orderInfo.showPaymentQrcode}" icon-class="qrcode" data-id="1" />
        <svg-icon :class="{gray:!orderInfo.payFlag}" icon-class="visa" data-id="8" />
        <svg-icon :class="{gray:!orderInfo.payFlag}" icon-class="alipay" data-id="21" />
      </div>
      <div class="explain">關於信用卡在線支付的說明：<br/>接受全球發行的所有VISA/MasterCard  信用卡，非澳門幣信用卡匯率以銀行結算為準</div>
      <div class="consent"></div>
      <el-checkbox class="cbox" :disabled="!orderInfo.payFlag && !orderInfo.showPaymentQrcode" v-model="clauseCbox">本人已閱讀并同意及接受上述條款及細則</el-checkbox>
      <el-button class="deep-blue" round @click="onSubmit" :disabled="!orderInfo.payFlag && !orderInfo.showPaymentQrcode">前往支付</el-button>
    </div>

    <!-- 打开缴费码弹层 -->
    <el-dialog
            title="請調亮手機屏幕便於掃碼"
            :visible.sync="openQrCodeShow"
            width="80%"
            class="openQrCodeShow"
            @open="noScroll('add')"
            @close="noScroll('remove')"
            center>
      <img style="width: calc(100% - 16px);border:8px solid #D1DFEE;" :src="openQrCodeImg" />
    </el-dialog>

    <!-- 電子服務及負責條款 -->
    <el-dialog
            title="電子服務及免責條款"
            width="80%"
            custom-class="statementShow"
            :visible.sync="eServicesClause"
            :show-close="false"
            @open="noScroll('add')"
            @close="noScroll('remove')"
            center>
      <el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">
        <div class="text item">
          <p><b>1.責任聲明</b></p>
          <p>閣下一經使用本服務，即表示同意接受以下服務條款。</p>
          <p><b>2.服務範圍</b></p>
          <p>本服務條款適用於澳門自來水股份有限公司（以下簡稱”澳門自來水”）網站、手機應用程式及微信公眾號所提供之電子服務（以下簡稱”本服務”）的使用，並構成用戶與澳門自來水之間的協議，以及澳門自來水與用戶之間法律關係的依據。</p>
          <p>用戶：指接納本服務條款並使用本服務之個人或實體。</p>
          <p><b>3.服務</b></p>
          <p>所有服務及其內容均由澳門自來水提供或擁有，因此，澳門自來水毋須對此資訊引致的任何損失，錯誤付款及錯誤使用等問題負責。目前為用戶提供的電子服務包括：賬單服務、電子申請表單、電子繳費服務、會員服務及資訊交流。會員服務：澳門自來水提供予用戶管理供水賬戶及辦理網上申請的便利服務（須先完成會員登記）。</p>
          <p>聲明：本服務由澳門自來水股份有限公司提供。</p>
          <p> ·澳門自來水股份有限公司為本澳註冊公司，商業登記編號為215 (SO)。</p>
          <p> ·澳門郵政儲金局為提供信用卡網上繳付水費服務的供應商。</p>
          <p> ·澳門通股份有限公司為澳門錢包及支付寶網上繳付水費服務的供應商。</p>
          <p>個人及非商業用途限制：除非特別指明，本服務僅供個人及非商業用途使用。</p>
          <p><b>4.責任限制</b></p>
          <p>一般事項 </p>
          <p>任何依執行本協議或因違反任何本協議之義務或權利所提起之索償，應以澳門特別行政區之法律為準據法。其他索償，包含但不限於違返消費者保護法、不正當競爭法及侵權行為，應以澳門特別行政區之法律為準據法。因本服務之使用所衍生或相關之一切爭議，閣下必須同意接受澳門特別行政區法院之專屬管轄，並以其為審判地點。不同意本使用條款所有規定者，澳門自來水將不授權其使用。閣下同意本協議或使用本服務，不代表閣下和澳門自來水之間有合資、合夥、聘僱或代理人關係。因閣下對本服務之使用或行為所產生或衍生，而由第三者提出之任何索償、要求或賠償請求，包括合理律師費，閣下同意賠償，並使澳門自來水、其母公司、子公司、分支機構、領導及員工，免受損害。閣下明確同意並許可，澳門自來水可在不經閣下事先同意，披露閣下的個人資料或閣下對本服務之使用，包括其內容，但披露僅限於澳門自來水基於誠信認為該行動有助達成以下目的：(1)符合法律要求或遵守法律程序；(2)保護並捍衛澳門自來水或其合作公司之權利或財產；(3)執行本服務條款；或(4)保護其成員或他人之利益。澳門自來水對本協議之履行受到現行法律及法定程序所規範，本協議任何內容均不妨礙澳門自來水因應政府、法院及司法機關的要求，而披露閣下使用本服務、或使用時提供資料予澳門自來水或由其所收集的資料。若本協議任何部分，包含但不限於上述免責聲明及責任限制，被判定為無效或無法遵照法律執行，則該無效或無法執行之條款將被視為由最符合原條款立意、有效且可執行之條款取代，而本協議之其餘條款仍繼續有效。除非特別指明，否則本協議構成用戶及澳門自來水之間有關本服務之完整協議，而其效力將超越澳門自來水先前或現在與用戶就使用本服務所進行之電子文書、口頭通知或書面內容。本協議及任何電子形式通知的印刷版，在任何根據或有關本協議之司法或行政程序上均被視為有效，其效力及情況相同於本協議最初以印刷形式製作及保存之其他商業文件及紀錄。</p>
          <p>若因系統故障或任何原故(包括但不限於銀行過數所引致的延誤)以致未能在最後截水日期完成繳費[註1]，所遭受的損失或過期引致之款項，澳門自來水將不會負上任何責任；澳門自來水有權追討閣下帳單的費用，包括因過期而引致的任何款項。</p>
          <p>[註1: 在有關款項實際支付至澳門自來水股份有限公司的帳戶時，方視為完成繳費。]</p>
          <p>如對本網頁所顯示電子繳費資料的準確性有任何差異或爭議，用戶須直接致電服務熱線28220088。</p>
          <p>本服務恕不對用戶或任何人士承擔任何法律責任，不論其是否屬於侵權行為、合約性的、違反法例的或屬於其他方式上的有關責任（包含但不限於疏忽、違約、誹謗或侵犯有關知識產權法律的責任），亦不論其是否屬於下列性質：</p>
          <p>任何衍生性、直接或間接損失（包含但不限於收益或利潤之損失），或因使用本服務或與其有關之資料而引致用戶或其他人士承擔的責任，或用戶要求其他人士對他人承擔的責任。此聲明受澳門特別行政區法律管轄，所有內容均適用於法律允許範圍。</p>
          <p>閣下不得修改、複製、散播、傳遞、展示、執行、重製、發行、授權、創作衍生著作、移轉或銷售從本網站/服務取得之任何資料、軟體、產品或服務。未經澳門自來水事先書面表示同意，閣下不得對本網站/服務進行“超級搜尋”（Meta-search）、傳送或使他人傳送任何自動查詢至本網站/服務，或以任何商業方式使用本網站/服務。“自動查詢”包含但不限於使用軟體傳送查詢至任何服務網站/服務以判斷該網站於任何服務網站/服務之“排名”。</p>

          <p><b>5.協議之修改及終止</b></p>
          <p>5.1條款之修改</p>
          <p>澳門自來水保留權利修改所有條款、條件及須知，包含但不限於使用本服務之收費。用戶須定期查閱本服務條款及指定網站的附加條款。用戶繼續使用本服務，即表示閣下接受了用戶協議中所有條款、條件及須知。</p>
          <p>5.2 非法或禁止之使用</p>
          <p>使用本系統服務時，閣下已保證不會利用本服務從事任何非法或為本條款、條件及須知所禁止之活動。閣下不得用任何方式令本系統/服務蒙受損害、癱瘓、負荷過度或削弱本系統/服務（或任何與本系統/服務連結之網絡）或干擾他人使用及享用本系統/服務。閣下不得以駭客行為、破解密碼或其他方式，試圖以未獲授權的方式存取任何本系統/服務、其他帳號、電腦系統或任何與本系統/服務連結之網絡。非本系統/服務有意所提供之任何資料或資訊，閣下不得以任何方式取得或試圖取得。</p>
          <p>5.3 本服務或夥伴保留隨時取消顯示電子帳單的權利。</p>
          <p>5.4 本條款備有中、英及葡文版本，如中、英及葡文版本之解釋發生任何不一致或衝突，則以中文版本為準。 </p>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button round type="primary" @click="eServicesClause = false">關閉</el-button>
      </span>
    </el-dialog>

    <!-- 信用卡繳費細則及規 -->
    <el-dialog
            title="網上繳費細則規章"
            width="80%"
            custom-class="statementShow"
            :visible.sync="CreditCardClause"
            :show-close="false"
            @open="noScroll('add')"
            @close="noScroll('remove')"
            center>
      <el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">
        <div class="text item">
          <p><b>網上繳費細則規章</b></p>
          <p>使用說明：</p>
          <p>- 本系統只接受繳交水費單的款項；</p>
          <p>- 本系統只接受使用VISA信用卡、MasterCard 信用卡，澳門錢包和支付寶；</p>
          <p>-本系統信用卡使用Verified by Visa及 MasterCard SecureCode 驗證；</p>
          <p>- 本系統使用澳門幣結算；</p>
          <p>- 每次網上繳費交易服務只適用於清繳澳門幣十元或以上及一千元或以下的水費單。</p>
          <p>- 此項服務只適用於繳交所有未到最後避免截水日期之水費單。若水費單已經過最後避免截水日期，用戶必須親臨澳門自來水股份有限公司櫃台繳付。</p>
          <p>- 本系統為繳交水費單的另一途徑，若因系統故障或任何原故(包括但不限於銀行過數所引致的延誤)以致未能在最後截水日期完成繳費[註1]，所遭受的損失或過期引致之款項，澳門自來水股份有限公司將不會負上任何責任；</p>
          <p>- 如對本系統所顯示之繳費資料存有疑問，繳交前請致電客戶服務熱線28220088。</p>
          <p>[註1: 在有關款項實際支付至澳門自來水股份有限公司的帳戶時，方視為完成繳費。]</p>
          <p>本條款備有中、英及葡文版本，如中、英及葡文版本之解釋發生任何不一致或衝突，則以中文版本為準。</p>
          <p>退款手續：</p>
          <p>如遇上系統故障或其他特別情況而引致閣下重覆繳付有關的水費款項，請携帶網上付款資料盡快親臨本公司櫃台辦理。</p>
          <p>聯絡方法：</p>
          <p><b>地址:澳門青洲大馬路718號</b></p>
          <p><b>電話:(853) 28220088</b></p>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button round type="primary" @click="CreditCardClause = false">關閉</el-button>
      </span>
    </el-dialog>

    <!-- 隱私條款 -->
    <el-dialog
            title="隱私條款"
            width="80%"
            custom-class="statementShow"
            :visible.sync="privacyClause"
            :show-close="false"
            @open="noScroll('add')"
            @close="noScroll('remove')"
            center>
      <el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">
        <div class="text item">
          <p>澳門自來水承諾遵守第8/2005號法律《個人資料保護法》的有關規定。</p>
          <p>澳門自來水了解您對個人私隱保安之關注。因此，我們十分重視對本公司所提供的電子服務使用者私隱的保護，使您可安心使用本電子服務。</p>
          <p>當您使用本電子服務時，表示您同意並接受本聲明，故您應先詳閱有關條款。</p>
          <p><b>1、個人資料收集目的</b></p>
          <p>我們只收集與業務相關的個人資料，以便向您提供有關服務。澳門自來水不會向與本公司沒有關係的任何人披露您的個人資料，除非先獲得您同意或按照法律或有關的合法規定。</p>
          <p><b>2、個人資料的保安</b></p>
          <p>本公司所提供的電子服務使用SSL通訊加密協定傳送使用者登記的資料，以保障其個人資料在網絡傳送過程中免於受到未經授權或意外的取用。</p>
          <p>您在使用我們的服務時，系統會自動記錄以下的技術資料：使用者的IP地址、使用者開始瀏覽的日期和時間；收集該等資料只作為資訊保安及內部紀錄的用途。</p>
          <p>但請注意，在網絡上傳送資料時，會存在未經許可或授權而被他人閱讀和使用的風險，故使用者向本公司提供任何資料（包括個人資料）時，亦會存在上述風險。倘使用者對有關風險感到不安，您可透過其他方式或渠道使用相關的電子服務。</p>
          <p><b>3、查閱權及更正權</b></p>
          <p>按第8/2005號法律《個人資料保護法》的規定，您有權查閱及更正您的有關個人資料。請致電客户熱線 (853) 2822 0088 或親臨我們的客戶服務中心查詢。</p>
          <p><b>4、個人資料保存時間</b></p>
          <p>澳門自來水對個人資料的保存時間不會超過資料用途所需的時間，並按有關的法例法規處理。</p>
          <p><b>5、本聲明的更新</b></p>
          <p>澳門自來水可不時修訂本聲明內容， 我們鼓勵您不時瀏覽本聲明，以確保您得悉最新版本。</p>
          <p></p>
          <p><b>6、聯絡方法</b></p>
          <p>如對本電子服務的收集個人資料聲明有任何疑問或意見，歡迎發電郵至 privacy@macaowater.com 或致函以下地址與澳門自來水個人資料保護主任聯絡:</p>
          <p><b>澳門青洲大馬路718號</b></p>
          <p><b>澳門自來水股份有限公司</b></p>
          <p><b>個人資料保護主任</b></p>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button round type="primary" @click="privacyClause = false">關閉</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import phoneVerify from '@/components/PhoneVerify';
  import Header from '@/components/Header'
  import { getBillDetails, paymentSubmit, openQrCode } from '@/api/bill'
  import { isWeChat } from '@/utils'

  export default {
    name: 'Payment',
    data(){
      return {
        openQrCodeShow:false,
        openQrCodeImg:'',
        orderInfo:{
          bodyNb:this.$route.params.bodyNb,
          issuanceData:'',
          deadline:'',
          avoidDeadline:'',
          address:'',
          amountPay:'',
          paymentMethod : '',
          orderToken:'',
          showPaymentQrcode: '',
          payRemark: '',
          acctStatus: '',
          payFlag: ''
        },
        clauseCbox:false,
        eServicesClause:false,
        CreditCardClause:false,
        privacyClause:false,
        isAcctStatus: false,
        isPayRemark: false
      }
    },
    components:{
      Header : Header,
    },
    created(){
      this.getBillDetails()
      this.$share();
    },
    methods:{
      // 获取账单详情
      async getBillDetails(){
        let data = {
          bodyNb : this.orderInfo.bodyNb
        }
        let res = await getBillDetails(data);
        if(res.code == 200){
          this.orderInfo.issuanceData = res.result.porderMonth
          this.orderInfo.deadline = res.result.bodyDueDate
          this.orderInfo.avoidDeadline = res.result.cutOffDate
          this.orderInfo.address = res.result.address
          this.orderInfo.amountPay = res.result.transAmt
          this.orderInfo.orderToken = res.result.orderToken
          this.orderInfo.showPaymentQrcode = res.result.showPaymentQrcode
          this.orderInfo.payRemark = res.result.payRemark
          this.orderInfo.acctStatus = res.result.acctStatus
          this.orderInfo.payFlag = res.result.payFlag

          // if(!res.result.showPaymentQrcode || !res.result.payFlag){
          //
          // }

          this.isShowNotice(res.result.payRemark, res.result.acctStatus)

          // if(!res.result.payFlag){  // 若不被除二维码以外的方式支付
          //   this.isShowNotice(res.result.payRemark, res.result.acctStatus)
          // }
        }
      },
      // 是否显示公告
      isShowNotice(payRemark, acctStatus){
        if(payRemark !== null && payRemark !== ''){
          this.isPayRemark = true;
        }else{
          this.isPayRemark = false;
        }
        if(acctStatus !== null && acctStatus !== ''){
          this.isAcctStatus = true;
        }else{
          this.isAcctStatus = false;
        }
      },
      //前往支付
      async onSubmit(){
        if(!this.clauseCbox){
          this.$message('請先閱讀并同意條款')
          return false;
        }else if(!this.orderInfo.paymentMethod){
          this.$message('請先選擇支付方式')
          return false;
        }
        if(this.orderInfo.paymentMethod === '1'){  // 繳費碼
          let data = { bodyNb: this.orderInfo.bodyNb }
          let res = await openQrCode(data);
          let img = 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
          this.openQrCodeShow = true;
          this.openQrCodeImg = img;
        }else{  // 其他方式
          let data = {
            orderToken: this.orderInfo.orderToken,
            idType: this.orderInfo.paymentMethod,
          }

          let res = await paymentSubmit(data);
          if(res.code == 200){
            if(this.orderInfo.paymentMethod == '21' && isWeChat()){//解決微信拦截支付宝的方案
              location.href = location.origin + '?alipay='+ res.result +'#/wechat-astrict';
            }else{
              location.href = res.result;
            }
          }
        }
      },
      //切換支付方式
      async switchIcon(e){
        let that = e.target;
        let allChild = that.parentNode.parentNode.children;
        if(that.nodeName.toLowerCase() == 'use'){
          for(let i=0;i<allChild.length;i++){
            allChild[i].classList.remove('select');
          }
          if(that.parentNode.className.animVal.includes('gray')){
            return false;
          }else{
            that.parentNode.classList.add('select');
            this.orderInfo.paymentMethod = that.parentNode.dataset.id;

            //直接显示缴费码
            if(that.parentNode.dataset.id==1){
              let data = { bodyNb: this.orderInfo.bodyNb }
              let res = await openQrCode(data);
              let img = 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.openQrCodeShow = true;
              this.openQrCodeImg = img;
            }

          }
        }
      },
    }
  }
</script>

<style lang="scss">
  // 个人资料声明弹窗
  .statementShow{
    .el-dialog__body{
      padding:0 20px;
    }
    .el-dialog__title{
      color:#528EEF;
    }
    .el-dialog__body{
      padding:0 20px;
    }
    .el-dialog__title{
      color:#528EEF;
    }
  }
  // 打开缴费码弹层
  .openQrCodeShow .el-dialog{
    border-radius: 10px;
  }
  //是否同意
  .cbox{
    margin:18px 0;
  }
  .cbox .el-checkbox__label{
    font-size: 12px;
  }

  .deep-blue.is-disabled{
    background: #cccccc !important;
    border-color: #cccccc !important;

  }
</style>


<style lang="scss" scoped>
  /*内容*/
  .body{
    width: 85%;
    padding:15px;
    margin:15px auto;
    font-size: 16px;
    border-radius:8px;
    background:#fff;
    color: #666;
    .acctStatus-msg{
      line-height: 23px;
      width: 85%;
      padding:15px;
      margin:0 auto;
      margin-bottom: 15px;
      font-size: 14px;
      border-radius:8px;
      background:#EE4E4E;
      color: #fff;
      min-height: 46px;
    }
    .payRemark-msg{
      line-height: 23px;
      width: 85%;
      padding:15px;
      margin:0 auto;
      margin-bottom: 15px;
      font-size: 14px;
      border-radius:8px;
      background:rgba(255,245,231,1);
      color: #D49135;
      min-height: 46px;
    }
    h2{
      font-size: 16px;
      color: #333333;
    }
    ul{
      padding:23px 0 12px 0;
      li{
        display: flex;
        justify-content:space-between;
        border-bottom: 1px dashed #E8E8E8;
        padding-bottom: 15px;
        margin-bottom: 15px;
        font-size: 14px;
        .key{
          color: #37548F;
        }
        .value{
          color: #EE4E4E;
          font-weight: bold;
        }
      }
    }
    .paymentMethod{
      display: flex;
      justify-content:space-between;
      align-items:center;
      span{
        font-size: 12px;
        color:#F1C06A;
      }
    }
    .clause{
      margin: 10px 0;
      background-color: #FFF5E7;
      padding:10px;
      font-size: 12px;
      span{
        color: #37548F;
      }
    }
    .icon{
      margin-bottom:10px;
      display: flex;
      justify-content:space-around;
      .svg-icon{
        border:2px solid #ACC0D7;
        border-radius: 8px;
        font-size: 60px;
      }
      .select{
        border:2px solid #416CC4;
      }
      .gray {
        filter: grayscale(100%);
      }
    }
    .explain{
      font-size: 12px;
    }
    .el-button{
      width: 100%;
    }
  }
  /*声明弹窗*/
  .statementShow {
    .box-card{
      max-height: 200px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      margin:15px 0;
      .text p{
        font-size: 12px;
        padding-bottom: 5px;
      }
    }
  }
</style>
