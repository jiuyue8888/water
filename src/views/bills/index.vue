<template>
  <div class="main">

    <!-- 页头 -->
    <Header :metaTitle='$t("dashboard.font37")' />

    <!-- 主体内容 -->
    <div class="body">
      <!-- 合同消息 -->
      <div class="contract-msg" v-if="contractMsgShow">
        <p>{{$t("bills.font1")}} {{ oreminds.warnBodyNb }} {{ oreminds.acctStatus }}</p>
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
            <span v-if="item.registerState">{{$t("bills.font2")}}</span>
            <span v-else style="color:#F1C06A">{{$t("bills.font3")}}</span>
          </div>
          <!-- 账单状态 -->
          <div class="bill-state">
            <div>
              <span class="text" v-if="item.viewFlag !== '102'"><b>·</b> {{ item.bindOwe ? $t("bills.font4") : $t("bills.font5") }}</span>
              <span class="mop" v-if="item.bindOwe">MOP ${{ item.amount }}</span>


            </div>
            <span class="details">{{$t("bills.font6")}}<i class="el-icon-arrow-right"></i></span>
          </div>
        </div>
        <!-- 微信账单服务 -->
        <div class="wechat-bill" v-if="item.registerState && item.viewFlag !== '102'">
          <span class="text"><b>·</b> {{$t("bills.font7")}}</span>
          <el-switch
            :value="item.wxBindFlag == 'Y' ? true : false"
            @change="switchChange($event,item.bodyNb)"
            active-color="#9DCB44"
            inactive-color="#DCDFE6">
          </el-switch>
        </div>
      </div>
      <div class="list" v-if="billList.length == 0">{{$t("bills.font8")}}</div>
      <!-- 底部操作 -->
      <div class="operation" v-if="btnShow">
        <el-button round class="del" @click="delShow = true">{{$t("bills.font9")}}</el-button>
        <el-button class="deep-blue" round @click="onClickAdd"><b>＋</b> {{$t("bills.font10")}}</el-button>
      </div>
    </div>

    <!-- 新增合同弹窗 -->
    <el-dialog
      :title='$t("bills.font10")'
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
        <el-form-item prop="bodyNb" :label='$t("bills.font1")'>
<!--          <el-input class="underline" v-model.number="form.bodyNb" placeholder="輸入合同號碼"></el-input>-->
          <el-input class="underline" type="number" v-model="form.bodyNb" :placeholder='$t("bills.font12")'></el-input>
        </el-form-item>
<!--        prop="bodyName"-->
        <el-form-item  :label='$t("bills.font13")'>
          <el-input class="underline" maxlength="64" v-model="form.bodyName" :placeholder='$t("bills.font14")'></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round @click="addShow = false">{{$t("bills.font15")}}</el-button>
        <el-button round type="primary" @click="addSubmit" :disabled="isDisabled">{{$t("bills.font16")}}</el-button>
      </span>
    </el-dialog>

    <!-- 证件信息绑定弹窗 -->
    <el-dialog
      :title='$t("bills.font17")'
      width="80%"
      custom-class="dialog-common"
      :visible.sync="papersShow"
      :show-close="false"
      ref="papersShow"
      @open="noScroll('add')"
      @opened="openedAddShow('papersShow')"
      @close="noScroll('remove')"
      center>
      <div class="bills-statement">{{$t("bills.font18")}}</div>
      <!-- 填写证件信息 -->
      <el-form ref="papersForm" :rules="papersRules" :model="papersForm">
        <el-form-item prop="idType" @click="idTypeShow = true">
          <el-input class="underline" v-model="papersForm.idTypeName" :placeholder='$t("bills.font19")' readonly @focus="idTypeShow = true"></el-input>
        </el-form-item>
        <el-form-item prop="idNb">
          <el-input class="underline" @blur="viewDefault" v-model="papersForm.idNb" :placeholder='$t("bills.font25")'></el-input>
        </el-form-item>
        <el-form-item prop="idName">
          <el-input class="underline" @blur="viewDefault" v-model="papersForm.idName" :placeholder='$t("bills.font26")'></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round @click="papersShow = false">{{$t("bills.font15")}}</el-button>
        <el-button round type="primary" @click="papersSubmit">{{$t("bills.font35")}}</el-button>
      </span>
    </el-dialog>

    <!-- 证件类型弹窗 -->
    <van-popup
      v-model="idTypeShow"
      z-index="9999"
      position="bottom">
      <van-picker
        ref="regionpicker"
        :confirm-button-text='$t("bills.font35")'
        show-toolbar
        :columns="idTypeList"
        @cancel="idTypeShow = false"
        @confirm="idTypeConfirm"
      />
    </van-popup>

    <!-- 删除合同弹窗 -->
    <el-dialog
      :title='$t("bills.font9")'
      width="80%"
      top="30px"
      custom-class="dialog-common"
      :visible.sync="delShow"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <div class="bills-statement">{{$t("bills.font28")}}</div>
      <!-- 选择合同 -->
      <div class="bills-region">
        <el-checkbox-group v-model="bodyNbList">
          <div v-for="item in billList"><el-checkbox :label="item.bodyNb" :key="item.bodyNb" border>{{ item.bodyName }}({{ item.bodyNb }})</el-checkbox></div>
        </el-checkbox-group>
      </div>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round @click="delShow = false">{{$t("bills.font15")}}</el-button>
        <el-button round type="primary" @click="delSubmit" :disabled="isDisabled">{{$t("bills.font35")}}</el-button>
      </span>
    </el-dialog>

    <!-- 证件已绑定旧会员 -->
    <el-dialog
      :title='$t("bills.font31")'
      width="80%"
      top="38vh"
      custom-class="dialog-common"
      :visible.sync="papersIsbindShow"
      :show-close="false"
      @open="noScroll('add')"
      @close="noScroll('remove')"
      center>
      <div style="text-align: center;">{{$t("bills.font30")}}</div>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round @click="papersIsbindShow = false">{{$t("bills.font15")}}</el-button>
        <el-button round type="primary" @click="isBinding">{{$t("bills.font32")}}</el-button>
      </span>
    </el-dialog>


    <!-- 添加非登记用户 -->
    <el-dialog
            :title='$t("bills.font33")'
            width="80%"
            custom-class="dialog-common"
            :visible.sync="addNoDJShow"
            :show-close="false"
            :append-to-body="true"
            @open="noScroll('add')"
            @opened="openedAddShow('addShow')"
            @close="closedAddShow"
            center>

      <div style="margin: 15px 0;font-size: 14px;">{{$t("bills.font34")}}</div>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button round type="primary" @click="addNoDJShow=false">{{$t("bills.font35")}}</el-button>
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



export default {
  name: 'Bills',
  data(){
	  let validateIdName = (rule, value, callback) => {
	    //if (!validChinese(value)) {
	     // callback(new Error('請輸入中文'));
	    //} else {
	      callback();
	    //}
	  };
	  
	  let validateIdName2 = (rule, value, callback) => {
	    if (!value) {
	      callback(new Error(this.$t("bills.font25")));
	    }else if (validNumberAndLetter(value)) {
	      callback(new Error(this.$t("memberGiftMyGift.font23")));
	    } else {
	      callback();
	    }
	  };
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
        {text:this.$t("bills.font20"),id:1},
        {text:this.$t("bills.font21"),id:2},
        {text:this.$t("bills.font22"),id:3},
        {text:this.$t("bills.font23"),id:4},
        {text:this.$t("bills.font24"),id:6},
      ],
      rules: {
        bodyNb: [
          { required: true, message: this.$t("otherQuickPayment.font1"), trigger: 'blur' },
          // { type:'number', message: '合同號碼必須為数字', trigger: 'blur' },
        ],
        bodyName: [
          { required: true, message: this.$t("billsDetails.font41"), trigger: 'blur' },
          { max: 20, message: this.$t("billsDetails.font42"), trigger: 'blur' }
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
          { required: true, message: this.$t("bills.font19"), trigger: 'blur' },
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
        title:this.$t("bills.font7"),
        content:this.$t("billsDetails.font48")
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
	  this.changeData();
    this.getBillList();
    this.$share();

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
        text: this.$t("dashboard.font36"),
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
          that.dialogContent.title = this.$t("billsDetails.font46");
          that.dialogContent.type = 1;
        }else if( res.result.cdMailty == 1 && res.result.cdEblsts == 30 ){
          that.dialogContent.title = 'SEPBOX';
          that.dialogContent.type = 3;
        }else if( res.result.cdMailty == 2 && res.result.cdEblsts == 30 ){
          that.dialogContent.title = 'Email';
          that.dialogContent.type = 4;
        }else{
          that.dialogContent.title = this.$t("billsDetails.font46");
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
      this.dialogContent.title = this.$t("billsDetails.font46");
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
            this.$message(this.$t("bills.font36"))
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
	async changeData(){
		
		let res = await getRemind([]);
		this.loading.close();
		if(res.code == 200){
		  
		  sessionStorage.remindList = JSON.stringify(res.result);
		  let oremindsList = sessionStorage.remindList ? JSON.parse(sessionStorage.remindList).oreminds : [];
		  if(oremindsList.length == 0){
		    this.contractMsgShow = false;
		  }else{
		    this.contractMsgShow = true;
		    this.oreminds = oremindsList[0];
		  }
		}
		
	},


    //显示"提示不是登记用户"
    async showNoDeng(newBodyNb){

      this.changeData();
	  let RemindRes = await getRemind([]);

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
            this.$message(this.$t("newFont.font2"))
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
        this.$message(this.$t("newFont.font1"));
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
        this.$message(this.$t("newFont.font3"));
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
.tran{
	transform: scale(0.8);
	transform-origin: 100% 50%;
			width: 6rem;
	    text-align: right;
}
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
    position: absolute;
        font-size: 20px;
        right: 4px;
        top: -8px;
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
        font-size: 12px;
		width: 6rem;
		text-align: right;
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
