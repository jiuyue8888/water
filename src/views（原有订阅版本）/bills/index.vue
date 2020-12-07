<template>
  <div class="main">

    <!-- 页头 -->
    <Header metaTitle="主頁" />

    <!-- 主体内容 -->
    <div class="body">
      <!-- 合同消息 -->
      <div class="contract-msg" v-if="contractMsgShow">
        <p>合同號 {{ oreminds.warnBodyNb }} {{ oreminds.acctStatus }}</p>
        <!-- 合同號 122948 已逾期，將被停止供水服務，<br/>請盡快到本公司客戶服務中心繳費。 -->
        <svg-icon class="svg-close" icon-class="close" @click="contractMsgShow = false" />
      </div>
      <!-- 列表 -->
      <div class="list" v-for="(item,index) in billList" :key="index">
        <div @click="toDetail(item)">
          <!-- 标题 -->
          <div class="title">
            <h2 v-if="item.bodyName"><p>{{ item.bodyName }}</p> ({{ item.bodyNb }})</h2>
            <h2 v-else>{{ item.bodyNb }}</h2>
            <span v-if="item.registerState">登記用户</span>
            <span v-else style="color:#F1C06A">非登記用戶</span>
          </div>
          <!-- 账单状态 -->
          <div class="bill-state">
            <div>
              <span class="text" v-if="item.viewFlag !== '102'"><b>·</b> 賬單{{ item.bindOwe ? '結欠：' : '已繳清' }}</span>
              <span class="mop" v-if="item.bindOwe">MOP ${{ item.amount }}</span>
            </div>
            <span class="details">詳情<i class="el-icon-arrow-right"></i></span>
          </div>
        </div>
        <!-- 微信账单服务 -->
        <div class="wechat-bill" v-if="item.registerState && item.viewFlag !== '102'">
          <span class="text"><b>·</b> 微信賬單服務</span>
          <el-switch
            :value="item.wxBindFlag == 'Y' ? true : false"
            @change="switchChange($event,item.bodyNb)"
            active-color="#9DCB44"
            inactive-color="#DCDFE6">
          </el-switch>
        </div>
      </div>
      <div class="list" v-if="billList.length == 0">暫無合同</div>
      <!-- 底部操作 -->
      <div class="operation" v-if="btnShow">
        <el-button round class="del" @click="delShow = true">刪除合同</el-button>
        <el-button class="deep-blue" round @click="onClickAdd"><b>＋</b> 新增合同連結</el-button>
      </div>
    </div>

    <!-- 新增合同弹窗 -->
    <el-dialog
      title="新增合同連結"
      width="80%"
      custom-class="dialog-common"
      :visible.sync="addShow"
      :show-close="false"
      :append-to-body="true"
      ref="addShow"
      @open="noScroll('add')"
      @opened="openedAddShow('addShow')"
      @close="closedAddShow"
      center>
      <!-- 填写合同信息 -->
      <el-form ref="form" class="bills-verify" :rules="rules" :model="form" label-width="95px">
        <el-form-item prop="bodyNb" label="合同號碼：">
<!--          <el-input class="underline" v-model.number="form.bodyNb" placeholder="輸入合同號碼"></el-input>-->
          <el-input class="underline" type="number" v-model="form.bodyNb" placeholder="輸入合同號碼"></el-input>
        </el-form-item>
<!--        prop="bodyName"-->
        <el-form-item  label="賬單別稱：">
          <el-input class="underline" maxlength="64" v-model="form.bodyName" placeholder="別稱最多支持20個字符"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round @click="addShow = false">取消</el-button>
        <el-button round type="primary" @click="addSubmit" :disabled="isDisabled">新增</el-button>
      </span>
    </el-dialog>

    <!-- 证件信息绑定弹窗 -->
    <el-dialog
      title="身份確認"
      width="80%"
      custom-class="dialog-common"
      :visible.sync="papersShow"
      :show-close="false"
      ref="papersShow"
      @open="noScroll('add')"
      @opened="openedAddShow('papersShow')"
      @close="noScroll('remove')"
      center>
      <div class="bills-statement">為保證您的合同安全，請完成身份信息填寫，登記用戶核對成功后，可查看歷史賬單及更多信息</div>
      <!-- 填写证件信息 -->
      <el-form ref="papersForm" :rules="papersRules" :model="papersForm">
        <el-form-item prop="idType" @click="idTypeShow = true">
          <el-input class="underline" v-model="papersForm.idTypeName" placeholder="點擊選擇證件類型" readonly @focus="idTypeShow = true"></el-input>
        </el-form-item>
        <el-form-item prop="idNb">
          <el-input class="underline" @blur="viewDefault" v-model="papersForm.idNb" placeholder="請輸入證件號碼"></el-input>
        </el-form-item>
        <el-form-item prop="idName">
          <el-input class="underline" @blur="viewDefault" v-model="papersForm.idName" placeholder="請輸入證件姓名"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round @click="papersShow = false">取消</el-button>
        <el-button round type="primary" @click="papersSubmit">確認提交</el-button>
      </span>
    </el-dialog>

    <!-- 证件类型弹窗 -->
    <van-popup
      v-model="idTypeShow"
      z-index="9999"
      position="bottom">
      <van-picker
        ref="regionpicker"
        confirm-button-text="確認"
        show-toolbar
        :columns="idTypeList"
        @cancel="idTypeShow = false"
        @confirm="idTypeConfirm"
      />
    </van-popup>

    <!-- 删除合同弹窗 -->
    <el-dialog
      title="刪除合同"
      width="80%"
      top="30px"
      custom-class="dialog-common"
      :visible.sync="delShow"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <div class="bills-statement">刪除合同號將無法及時收到水費賬單，請謹慎操作。</div>
      <!-- 选择合同 -->
      <div class="bills-region">
        <el-checkbox-group v-model="bodyNbList">
          <div v-for="item in billList"><el-checkbox :label="item.bodyNb" :key="item.bodyNb" border>{{ item.bodyName }}({{ item.bodyNb }})</el-checkbox></div>
        </el-checkbox-group>
      </div>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round @click="delShow = false">取消</el-button>
        <el-button round type="primary" @click="delSubmit" :disabled="isDisabled">確認刪除</el-button>
      </span>
    </el-dialog>

    <!-- 证件已绑定旧会员 -->
    <el-dialog
      title="提示"
      width="80%"
      top="38vh"
      custom-class="dialog-common"
      :visible.sync="papersIsbindShow"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <div style="text-align: center;">該身份信息已綁定其他會員</div>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round @click="papersIsbindShow = false">取消</el-button>
        <el-button round type="primary" @click="isBinding">前往登錄</el-button>
      </span>
    </el-dialog>


    <!-- 添加非登记用户 -->
    <el-dialog
            title="系統提示"
            width="80%"
            custom-class="dialog-common"
            :visible.sync="addNoDJShow"
            :show-close="false"
            :append-to-body="true"
            @open="noScroll('add')"
            @opened="openedAddShow('addShow')"
            @close="closedAddShow"
            center>

      <div style="margin: 15px 0;font-size: 14px;">你新增的合同為"非登記用戶"，只能查閱及享用此合同有限的資料及功能。</div>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round type="primary" @click="addNoDJShow=false">確定</el-button>
      </span>
    </el-dialog>




    <!-- 微信账单弹层 -->
    <wx-bill :contractNo="contractNo" :dialogContent="dialogContent" ref="wxBill" @emitSubmitWeChatBill="emitSubmitWeChatBill" />

  </div>
</template>

<script>
import { getBillList, addContract, papersAdd, delContract, getRemind, lookEbillState } from '@/api/bill'
import WxBill from '@/components/WxBill'
import Header from '@/components/Header'
import { validChinese,validNumberAndLetter } from '@/utils/validate'
import { Popup, Picker } from 'vant';

let validateIdName = (rule, value, callback) => {
  if (!validChinese(value)) {
    callback(new Error('請輸入中文'));
  } else {
    callback();
  }
};

let validateIdName2 = (rule, value, callback) => {
  if (!value) {
    callback(new Error('請輸入證件號碼'));
  }else if (validNumberAndLetter(value)) {
    callback(new Error('請輸入正確的證件號碼'));
  } else {
    callback();
  }
};

export default {
  name: 'Bills',
  data(){
    return {
      memberNb:sessionStorage.memberNb,
      contractNo:'',
      idNb:'',
      btnShow: false,
      billList:[],
      papersShow:false,
      papersIsbindShow:false,
      addShow:false,
      delShow:false,
      addNoDJShow:false,
      form:{
        bodyNb:null,
        bodyName:'',
      },
      idTypeShow:false,
      idTypeList:[
        {text:'澳門身份證',id:1},
        {text:'香港身份證',id:2},
        {text:'內地身份證',id:3},
        {text:'護照',id:4},
        {text:'其他',id:6},
      ],
      rules: {
        bodyNb: [
          { required: true, message: '請輸入合同號碼', trigger: 'blur' },
          // { type:'number', message: '合同號碼必須為数字', trigger: 'blur' },
        ],
        bodyName: [
          { required: true, message: '請輸入賬單別稱', trigger: 'blur' },
          { max: 20, message: '別稱最多支持20個字符', trigger: 'blur' }
        ],
      },
      papersForm:{
        idTypeName:'',
        idType:'',
        idNb:'',
        idName:'',
      },
      papersRules:{
        idType: [
          { required: true, message: '請選擇證件類型', trigger: 'blur' },
        ],
        idNb: [
          { validator: validateIdName2, trigger: 'blur' },
        ],
        idName: [
          { validator: validateIdName, trigger: 'blur' },
        ],
      },
      contractMsgShow: false,
      bodyNbList:[],
      oreminds:'',
      unbindToken:'',
      dialogContent:{
        type:1,
        title:'微信電子賬單服務',
        content:'申請條款及細則：<p>1、「電子賬單」服務申請人（以下簡稱“用戶”）必須為澳門自來水股份有限公司（以下簡稱“澳門自來水”）的登記用戶。</p><p>2、用戶可選擇經微信、一般電子郵箱或澳門郵政安全電子郵箱接收「電子賬單」服務。</p><p>3、用戶如選擇經一般電子郵箱接收電子賬單，服務登記後，用戶指定的電子郵箱將會收到啟用服務電郵，須經用戶確認後才正式啟動服務。</p><p>4、「電子賬單」服務生效後，澳門自來水將以發送賬單電子檔取代郵寄紙質賬單。</p><p>5、倘「電子賬單」服務生效時間與澳門自來水發單期間相近，則當期賬單將可能保留以原方式發送。</p><p>6、用戶有責任在指定的“最後繳費日期”或之前繳付賬單，根據供水合同條款，用戶須承擔逾期繳費之一切後果。</p><p>7、用戶可隨時透過登入澳門自來水官方網站/手機應用程式/微信號或致電客戶熱線查閱賬單的應付金額。</p><p>8、用戶須向澳門自來水提供正確、完整及最新的登記資料。</p><p>9、當澳門自來水發現用戶並非合約持有人，澳門自來水保留暫停或終止用戶「電子賬單」服務的權利，恕不另行通知。</p><p>10、澳門自來水保留隨時更改和修改本條款及細則的權利，恕不另行通知。</p><p>11、澳門自來水透過此服務所收集的個人資料會用作處理申請及方便日後通訊的用途。申請人有權依法申請查閱、更正或更新其存於澳門自來水的個人資料。詳情請致電客戶熱線(853)2822 0088或親臨澳門自來水客戶服務中心查詢。</p><p>12、微信、互聯網及電話申請僅適用於個人名義之用戶。</p>',
      },
      isDisabled:false,

      loading: ''
    }
  },
  components:{
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    WxBill : WxBill,
    Header : Header,
  },
  created(){
    this.getBillList();
  },
  methods:{
    idTypeNameInput(){



    },
    viewDefault() {
      setTimeout(function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 0)
    },

    //返回
    back(){
      this.$router.push('/');
    },
    //获取账单列表
    async getBillList(){
      this.loading = this.$loading({
        lock: true,
        text: '加載數據中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let uRemindsList = sessionStorage.remindList ? JSON.parse(sessionStorage.remindList).uReminds : [];
      let oremindsList = sessionStorage.remindList ? JSON.parse(sessionStorage.remindList).oreminds : [];
      if(oremindsList.length == 0){
        this.contractMsgShow = false;
      }else{
        this.contractMsgShow = true;
        this.oreminds = oremindsList[0];
      }
      let res = await getBillList();
      if(res.code == 200){
        this.loading.close();
        let arr = [];
        let length = uRemindsList.length;
        res.result.bodyLinkList.forEach((item,index) => {
          // registerState：登记用户=true,非登记用户=false
          if(uRemindsList.length != 0){
            let i = 1;
            uRemindsList.forEach((itemTwo,indexTwo) => {
              if (item.bodyNb == itemTwo.warnBodyNb) {
                arr.push({
                  bodyNb:item.bodyNb,
                  bodyName:item.aliasLb,
                  wxBindFlag:item.wxBindFlag,
                  registerState:item.mbRoleCd == '1' ? true : false,
                  bindOwe:itemTwo.billAmount <= 10 ? false : true,
                  amount:itemTwo.billAmount,
                  payable: item.payable,
                  viewFlag: item.viewFlag,
                  acctStatus: item.acctStatus
                })
              } else {
                if (i++ == length) {
                  arr.push({
                    bodyNb:item.bodyNb,
                    bodyName:item.aliasLb,
                    wxBindFlag:item.wxBindFlag,
                    registerState:item.mbRoleCd == '1' ? true : false,
                    bindOwe:false,
                    amount:'',
                    payable: item.payable,
                    viewFlag: item.viewFlag,
                    acctStatus: item.acctStatus
                  })
                }
              }
            })
          } else {
            arr.push({
              bodyNb:item.bodyNb,
              bodyName:item.aliasLb,
              wxBindFlag:item.wxBindFlag,
              registerState:item.mbRoleCd == '1' ? true : false,
              bindOwe:false,
              amount:'',
              payable: item.payable,
              viewFlag: item.viewFlag,
              acctStatus: item.acctStatus
            })
          }
        });
        // this.billList = billList;
        this.billList = arr;
        this.idNb = res.result.idNb;
        this.btnShow = true;
        //微信账单弹窗
        if(this.$route.query.openBill){
          if(res.result.unBindWxBill && res.result.unBindWxBill.wxBindFlag == 'N'&& res.result.unBindWxBill.mbRoleCd == '1'){
            await this.lookEbillState(res.result.unBindWxBill.bodyNb);
            this.contractNo = res.result.unBindWxBill.bodyNb;
            this.$refs['wxBill'].openBill();
          }
        }
      }
    },


    //new=判断是否显示账单弹窗
    async chackShowWxBill(bodyLinkList){
      for(var i in bodyLinkList){
        if(bodyLinkList[i].mbRoleCd=='1'&&bodyLinkList[i].wxBindFlag=='Y'){
          await this.lookEbillState(bodyLinkList[i].bodyNb);
          this.contractNo = bodyLinkList[i].bodyNb;
          this.$refs['wxBill'].openBill();
          break;
        }
      }
    },


    //查询ebill申请状态
    async lookEbillState(bodyNb){
      let data = {
        bodyNb: bodyNb,
        lang: 'zh_TW',
      }
      let that = this;
      let res = await lookEbillState(data);
      // let res = {"msg":"调用成功","result":{"cdMailty":"2","cdEblsts":"30"},"code":200}
      if(res.code == 200){
        if(!res.result){
          that.dialogContent.title = '微信電子賬單服務';
          that.dialogContent.type = 1;
        }else if( res.result.cdMailty == 1 && res.result.cdEblsts == 30 ){
          that.dialogContent.title = 'SEPBOX';
          that.dialogContent.type = 3;
        }else if( res.result.cdMailty == 2 && res.result.cdEblsts == 30 ){
          that.dialogContent.title = 'Email';
          that.dialogContent.type = 4;
        }else{
          that.dialogContent.title = '微信電子賬單服務';
          that.dialogContent.type = 1;
        }
      }
    },
    //开关微信电子账单服务
    async switchChange(state,bodyNb){
      //开启微信电子账单服务
      if(state == true){
        await this.lookEbillState(bodyNb);
      }
      this.contractNo = bodyNb;
      this.$refs['wxBill'].switchChange(state)
    },
    //改变微信账单状态
    emitSubmitWeChatBill(boolean){
      this.dialogContent.title = '微信電子賬單服務';
      this.dialogContent.type = 1;
      this.billList.forEach(item => {
        if(item.bodyNb == this.contractNo){
          item.wxBindFlag = boolean ? 'Y' : 'N';
        }
      })
    },
    //点击新增
    onClickAdd(){
      if(this.idNb){
        this.addShow = true;
      }else{
        this.papersShow = true;
      }
    },
    //新增提交
    addSubmit(){
      this.$refs['form'].validate(async(valid) => {
        if(valid){
          this.isDisabled = true;
          let data = {
            memberNb:sessionStorage.memberNb,
            bodyNb:this.form.bodyNb,
            aliasLb:this.form.bodyName,
            excludable:false,
          }
          let res = await addContract(data);
          if(res.code == 200){
            // this.billList.push({
            //   bodyNb:data.bodyNb,
            //   bodyName:data.aliasLb,
            //   registerState:res.result.mbRoleCd == 1 ? true : false,
            //   bindOwe:res.result.latestBalAmt == 0 ? false : true,
            //   amount:res.result.latestBalAmt,
            // })
            this.addShow = false;
            this.$message('新增成功')
            sessionStorage.contractNb++;//更新首页的合同数量

            if(res.result.mbRoleCd=='2'){
              this.addNoDJShow=true
            }
            this.showNoDeng(data.bodyNb);
          }
          this.isDisabled = false;
        }
      })
    },

    //显示"提示不是登记用户"
    async showNoDeng(newBodyNb){

      let RemindRes = await getRemind([]);
      // if(RemindRes.code != 200){return false;}
      sessionStorage.remindList = JSON.stringify(RemindRes.result);

      let uRemindsList =RemindRes.result.uReminds || [];
      let oremindsList = RemindRes.result.oreminds || [];
      if(oremindsList.length == 0){
        this.contractMsgShow = false;
      }else{
        this.contractMsgShow = true;
        this.oreminds = oremindsList[0];
      }
      let res = await getBillList();
      if(res.code==200){
        let arr = [];
        let length = uRemindsList.length;
        res.result.bodyLinkList.forEach((item,index) => {
          // registerState：登记用户=true,非登记用户=false

          // if(item.bodyNb==newBodyNb&&item.mbRoleCd!='1'){
          //   this.addNoDJShow=true
          // }

          if(uRemindsList.length != 0){
            let i = 1;
            uRemindsList.forEach((itemTwo,indexTwo) => {
              if (item.bodyNb == itemTwo.warnBodyNb) {
                arr.push({
                  bodyNb:item.bodyNb,
                  bodyName:item.aliasLb,
                  wxBindFlag:item.wxBindFlag,
                  registerState:item.mbRoleCd == '1' ? true : false,
                  bindOwe:itemTwo.billAmount <= 10 ? false : true,
                  amount:itemTwo.billAmount,
                  payable: item.payable,
                  viewFlag: item.viewFlag,
                  acctStatus: item.acctStatus
                })
              } else {
                if (i++ == length) {
                  arr.push({
                    bodyNb:item.bodyNb,
                    bodyName:item.aliasLb,
                    wxBindFlag:item.wxBindFlag,
                    registerState:item.mbRoleCd == '1' ? true : false,
                    bindOwe:false,
                    amount:'',
                    payable: item.payable,
                    viewFlag: item.viewFlag,
                    acctStatus: item.acctStatus
                  })
                }
              }
            })
          } else {
            arr.push({
              bodyNb:item.bodyNb,
              bodyName:item.aliasLb,
              wxBindFlag:item.wxBindFlag,
              registerState:item.mbRoleCd == '1' ? true : false,
              bindOwe:false,
              amount:'',
              payable: item.payable,
              viewFlag: item.viewFlag,
              acctStatus: item.acctStatus
            })
          }
        });
        this.billList = arr;
        this.btnShow = true;
      }


    },




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
    //证件信息提交
    papersSubmit(){
      // var Regx = /^[A-Za-z0-9]*$/;
      // if (!Regx.test(this.papersForm.idNb)) {
      //   this.$message('請輸入正確的身份證號碼')
      //   return false;
      // }
      this.$refs['papersForm'].validate(async(valid) => {
        if(valid){
          let data = {
            memberNb:sessionStorage.memberNb,
            idNb:this.papersForm.idNb,
            idType:this.papersForm.idType,
            userName:this.papersForm.idName,
          }
          let res = await papersAdd(data);
          if(res.code == 200){
            if(res.result){
              if(res.result.unbindToken){
                this.unbindToken = res.result.unbindToken;
                this.papersIsbindShow = true;
                return false;
              }
            }
            this.papersShow = false;
            this.idNb = data.idNb;
            this.$message('證件綁定成功')
          }
        }
      })
    },
    //身份信息已绑定旧会员
    isBinding() {
      this.$router.push({path:'/user/register-email',query:{
        unbindToken : this.unbindToken
      }});
    },
    //删除提交
    async delSubmit(){
      if(this.bodyNbList.length == 0){
        this.$message('至少選擇一個');
        return false;
      }
      let data = {
        memberNb:sessionStorage.memberNb,
        bodyNbList:this.bodyNbList,
      }
      this.isDisabled = true;
      let res = await delContract(data);
      if(res.code == 200){
        for (let i = this.billList.length - 1; i >= 0; i--) {
          for(let k=0;k<this.bodyNbList.length;k++){
            if(this.billList[i]['bodyNb'] == this.bodyNbList[k]){
              this.billList.splice(i,1);
              break;
            }
          }
        }
        this.bodyNbList.splice(0);
        sessionStorage.contractNb--;
        this.delShow = false;
        this.$message('删除合同成功')
      }
      this.isDisabled = false;
    },
    //证件类型
    idTypeConfirm(data){
      this.$refs['papersForm'].clearValidate(['idType'])
      this.papersForm.idType = data.id;
      this.papersForm.idTypeName = data.text;
      this.idTypeShow = false;
    },
    // 跳轉詳情
    toDetail(item){
      if(!item.payable && item.viewFlag === '102'){
        this.$message(item.acctStatus)
      }else{
        this.$router.push({
          name: 'Details',
          params: item
        })
      }
    }
  }
}
</script>


<style lang="scss">
  /*证件声明*/
  .bills-statement{
    background-color: #FFF1DB;
    border-radius:4px;
    color:#D38B1A;
    font-size: 12px;
    padding:10px;
    margin-bottom: 10px;
  }
  /*选择合同*/
  .bills-region{
    width: 100%;
    max-height: 300px;
    overflow: auto;
  }
  .bills-region .el-checkbox{
    width: 100%;
    margin-bottom: 10px;
  }
  //解决新增合同的下划线没对齐
  .bills-verify{
    .underline input{
      border-bottom:0;
    }
    .el-form-item{
      font-size: 14px;
      border-bottom: 1px solid #DCDFE6;
    }
    .el-form-item__label{
      border-bottom: 0;
    }
  }
</style>

<style lang="scss" scoped>

/*内容*/
.body{
  position: relative;
  min-height: calc(100vh - 60px);
  padding-bottom: 104px;
  box-sizing: border-box;
  @mixin justify{
    display: flex;
    justify-content: space-between;
    align-items:center;
  }
  /*合同消息*/
  .contract-msg{
    line-height: 23px;
    width: 85%;
    padding:15px;
    margin:0 auto;
    margin-top: 15px;
    font-size: 14px;
    border-radius:8px;
    background:#EE4E4E;
    color: #fff;
    min-height: 46px;
  }
  .svg-close{
    float: right;
    color: #EE4E4E;
    font-size: 20px;
    margin-top: -65px;
    margin-right: -20px;
  }
  // 列表
  .list{
    @extend .contract-msg;
    background:#fff;
    color: #000;
    .title{
      @include justify;
      h2{
        font-size: 16px;
        width: calc(100% - 85px);
        display: flex;
        p{
          max-width: calc(100% - 90px);
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      span{
        color: #AFC6F2;
        font-size: 14px;
      }
    }
    .bill-state{
      @include justify;
      padding-top: 15px;
      .mop{
        color:#EE4E4E;
        font-weight: bold;
      }
      .details{
        color: #383838;
        i{
          font-size: 18px;
          position: relative;
          top:2px;
        }
      }
    }
    .wechat-bill{
      @include justify;
      padding-top: 10px;
      margin-top: 10px;
      border-top:1px solid #EAEAEA;
    }
    .text{
      color: #6B6B6B;
      b{
        color: #999999;
        padding-right: 3px;
      }
    }
  }
  // 底部操作
  .operation{
    position: absolute;
    bottom:0;
    margin:32px 15px;
    width: calc(100% - 30px);
    @include justify;
    .del{
      color: #EE4E4E;
      border:1px solid #EE4E4E;
    }
  }
}

</style>
