<template>
  <div class="main">
    <!-- 页头 -->
    <Header metaTitle="主頁" />

    <!-- 主体内容 -->
    <div class="body">
      <ul>
        <li>
          <span class="key">姓名：</span>
          <span class="value">{{ memberInfo.name }}</span>
        </li>
        <li>
          <span class="key">證件類型：</span>
          <span class="value">{{ memberInfo.idType }}</span>
        </li>
        <li>
          <span class="key">證件號碼：</span>
          <span class="value">{{ memberInfo.idNb }}</span>
        </li>
        <li>
          <span class="key">手機號碼：</span>
          <span class="value">{{ memberInfo.phone }}</span>
          <span class="operate" @click="phoneShow = true">修改</span>
        </li>
        <li>
          <span class="key">郵箱地址：</span>
          <span class="value">{{ memberInfo.email }}</span>
          <span class="operate" @click="openEmailActivate">{{ emailBtnText }}</span>
        </li>
      </ul>

      <p>選擇需要訂閱供水公告的區域（可多選）</p>
      <!-- 填写地区 -->
      <div class="regionCbox">
        <el-checkbox-group v-model="memberInfo.region">
          <div v-for="item in regionList"><el-checkbox :label="item.id" :key="item.id" border>{{item.value=='港珠澳大橋澳門口岸'?'港珠澳大橋澳門口岸管理區':item.value}}</el-checkbox></div>
        </el-checkbox-group>
      </div>

      <div class="statement">澳門自來水承諾遵守第8/2005號法律《個人資料保護法》的有關規定。因此,我們十分重視對電子服務使用者私隱的保護,相關會員信息將經過加密處理,我們建議您先細閱<span @click="statementShow = true">《收集個人資料聲明》</span><span @click="electronicShow=true">《電子服務及免責條款》</span></div>
      <el-button class="deep-blue" round @click="onSubmit">保存</el-button>
    </div>

    <!-- 个人资料声明弹窗 -->
    <el-dialog
      title="收集個人資料聲明"
      width="80%"
      custom-class="statementShow"
      :visible.sync="statementShow"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">
        <div class="text item">
          <!-- <p>(更新日期：25-10-2018)</p> -->
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
        <el-button round type="primary" @click="statementShow = false">關閉</el-button>
      </span>
    </el-dialog>

    <!-- 電子服務及免責條款弹窗 -->
    <el-dialog
            title="電子服務及免責條款"
            width="80%"
            custom-class="statementShow"
            :visible.sync="electronicShow"
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
          <el-button round type="primary" @click="electronicShow = false">關閉</el-button>
        </span>
    </el-dialog>

    <!-- 邮箱激活弹窗 -->
    <el-dialog
      :title="emailTitle"
      width="80%"
      custom-class="dialog-common"
      :visible.sync="emailActivateShow"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <!-- 填写邮箱 -->
      <el-form ref="form" :rules="rules" :model="form">
        <el-form-item prop="email">
          <el-input class="underline" v-model="form.email" :placeholder="emailBtnText == '激活' ? '請輸入郵箱地址' : '請輸入新的郵箱地址'"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round @click="emailActivateShow = false">取消</el-button>
        <el-button round type="primary" @click="emailActivate">確認{{ emailBtnText }}</el-button>
      </span>
    </el-dialog>

    <!-- 修改手机号弹窗 -->
    <el-dialog
      title="修改手機號碼"
      width="85%"
      custom-class="dialog-common"
      :visible.sync="phoneShow"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <!-- 填写手机 -->
      <phone-verify ref="phoneVerify" :email="memberInfo.email" @emitEditPhone="emitEditPhone" />
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round @click="phoneShow = false">取消</el-button>
        <el-button round type="primary" @click="editPhone">確認修改</el-button>
      </span>
    </el-dialog>


    <!-- 提示郵箱新增成 -->
    <el-dialog
            title="系統提示"
            width="80%"
            custom-class="dialog-common"
            :visible.sync="addEmailShow"
            :show-close="false"
            :append-to-body="true"
            @open="noScroll('add')"
            @opened="openedAddShow('addShow')"
            @close="closedAddShow"
            center>

      <div style="margin: 15px 0;font-size: 14px;">郵箱新增成功，請至您的郵箱中點擊激活鏈接以激活帳號。</div>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round type="primary" @click="addEmailShow=false">確定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { validEmail } from '@/utils/validate'
import { getAreaList } from '@/api/user'
import { getBillList } from '@/api/bill'
import { updateAccount, saveAreaList } from '@/api/membership'
import phoneVerify from '@/components/PhoneVerify';
import Header from '@/components/Header'

const validateEmail = (rule, value, callback) => {
  if(value === ''){
    callback(new Error('請輸入郵箱'));
  }else if (!validEmail(value)) {
    callback(new Error('請輸入正確的郵箱'));
  } else {
    callback();
  }
};


export default {
  name: 'memberMembership',
  data(){
    return {
      regionList:[],
      statementShow:false,
      electronicShow:false,
      phoneShow:false,
      emailActivateShow:false,
      emailTitle:'',
      memberInfo:{
        name:'',
        email:'',
        phone:'',
        idType:'',
        idNb:'',
        region:[],
      },
      form: {
        email: '',
      },
      rules: {
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
      },
      addEmailShow:false,
    }
  },
  components:{
    phoneVerify : phoneVerify,
    Header : Header,
  },
  created(){
    this.noScroll('remove');
    this.getRegionList();
    this.getUserInfo();
  },
  computed:{
    emailBtnText(){
      return this.memberInfo.email ? '修改' : '激活';
    }
  },
  methods:{

    //关闭新增弹窗
    closedAddShow(){
      this.noScroll('remove')
      this.$refs['form'].resetFields();
    },
    //开启新增弹窗
    openedAddShow(ref){
      let refName = this.$refs[ref],
              input = refName.$el.querySelectorAll('input');
      //解决移动端弹出框点击输入框后背景层会移动
      for(let i=0;i<input.length;i++){
        input[i].onblur = function(){
          window.scroll(0,0);
        };
      }
    },


    //返回
    back(){
      this.$router.push('/');
    },
    //获取地区列表
    async getRegionList(){
      let res = await getAreaList();
      if(res.code == 200){
        let arr = [];
        res.result.forEach(item => {
          arr.push({id:item.id, value:item.areaName})
        })
        this.regionList = arr;
      }
    },
    //获取用户信息
    async getUserInfo(){
      let res = await getBillList('menu');
      if(res.code == 200){
        this.memberInfo.name = res.result.userName
        this.memberInfo.email = res.result.userEmail
        this.memberInfo.phone = res.result.userPhone
        this.memberInfo.idType = res.result.idType
        this.memberInfo.idNb = res.result.idNb
        this.memberInfo.region = res.result.addressList || []
      }
    },
    // 打开邮箱激活
    openEmailActivate(e){
      if(this.emailBtnText == '激活'){
        this.emailTitle = '激活郵箱';
      }else if(this.emailBtnText == '修改'){
        this.emailTitle = '修改郵箱地址';
      }
      this.emailActivateShow = true;
    },
    // 邮箱激活提交
    emailActivate() {
      this.$refs['form'].validate(async(valid) => {
        if(valid){
          // let data = {
          //   email:this.form.email,
          //   phoneNb:this.memberInfo.phone,
          //   code:'',
          // }
          //2020-05-27修改
          let data = {
            email:this.form.email,
            areaCode:'',
            phoneNb:'',
            code:'',
          }
          let res = await updateAccount(data);
          if(res.code == 200){
            this.memberInfo.email = data.email;
            this.emailActivateShow = false;
            this.addEmailShow=true;

          }
        }
      })
    },
    //修改手机号码
    editPhone(){
      this.$refs['phoneVerify'].editPhone();
    },
    //关闭手机号弹窗
    emitEditPhone(obj){
      this.phoneShow = obj.phoneShow;
      this.memberInfo.phone = obj.phone;
    },
    //保存
    async onSubmit(){
      let res = await saveAreaList(this.memberInfo.region);
      if(res.code == 200){
        this.$message('保存成功')
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
</style>

<style lang="scss" scoped>
/*内容*/
.body{
  width: 85%;
  padding:15px;
  margin:15px auto;
  /*font-size: 16px;*/
  font-size:0.4266666666666667rem;
  border-radius:8px;
  background:#fff;
  color: #666;
  ul li{
    border-bottom: 1px solid #E6E6E6;
    padding-bottom: 16px;
    margin-bottom: 16px;
    display: flex;
    align-items:center;
    justify-content: space-between;
    .key{
      /*width: 85px;*/
      /*display:inline-block;*/
    }
    .value{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      width: 150px;
      display: inline-block;
    }
    .operate{
      float: right;
      color: #4E8CEE;
    }
  }
  p{
    margin-bottom: 10px;
  }
  .statement{
    margin-bottom: 10px;
    font-size: 12px;
    span{
      color: #245DC4;
    }
  }
  .el-button{
    width: 100%;
  }
}
/*填写地区*/
.regionCbox{
  width: 100%;
}
.regionCbox .el-checkbox{
  width: 100%;
  margin-bottom: 10px;
}
/*个人资料声明弹窗*/
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
