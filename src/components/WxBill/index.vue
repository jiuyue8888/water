<template>
	<div>
		<!-- 开启微信账单弹窗 -->
		<el-dialog :title="dialogContent.type == 3 || dialogContent.type == 4 ? $t('wxBill.font1') : 
		(dialogContent.type == 2?$t('billsDetails.font17'):dialogContent.title)" width="80%"
		 custom-class="dialog-common" :visible.sync="WeChatBillShow" :show-close="false" @open="noScroll('add')" @close="closeWeChatBillShow"
		 center>
			<div class="title" v-if="dialogContent.type === 3 || dialogContent.type === 4">
				<p v-if="dialogContent.type === 4">{{$t('wxBill.font4')}}<br/><b style="color:#EE5050">{{$t('wxBill.font05')}}{{ contractNo }}</b><br/>{{$t('wxBill.font04')}}?</p>
				<p v-else>{{$t('wxBill.font34')}}<br/><b style="color:#EE5050">{{$t('wxBill.font05')}}{{ contractNo }}</b>{{$t('wxBill.font04')}}?</p>
			</div>
			<div class="title" v-else-if="dialogContent.type === 2 && dialogContent.cdType === '1' && dialogContent.cdStatus === '1'">
				
				<p>{{$t('wxBill.font24')}}<br/><b style="color:#EE5050">{{$t('wxBill.font05')}}{{ contractNo }}</b><br/>{{$t('wxBill.font204')}}?</p>
				
			</div>
			<div class="title" v-else><p>{{$t('wxBill.font5')}}<br/><b style="color:#EE5050">{{$t('wxBill.font05')}}</b><b style="color:#EE5050">{{contractNo}}</b><br/>{{$t('wxBill.font7')}}
			{{ dialogContent.type === 2?$t('billsDetails.font51'):dialogContent.title }}</p></div>
			<el-card class="box-card" shadow="never" :body-style="{padding:'10px'}">
				<div class="text item" v-html="dialogContent.content">
				</div>
			</el-card>
			<div class="statement">
				<el-checkbox v-model="isAgreeTerms">{{$t('wxBill.font6')}}</el-checkbox>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button round @click="WeChatBillShow = false">{{$t('bills.font15')}}</el-button>
				<el-button round type="primary" :disabled="submitLoadIng" @click="submitWeChatBill(true)">{{$t('wxBill.font07')}}</el-button>
			</span>
		</el-dialog>

		<!-- 终止微信账单弹窗 -->
		<el-dialog 
		:title="$t('wxBill.font8')+' ' + (dialogContent.type === 2?$t('billsDetails.font51'):dialogContent.title)"
		width="80%" custom-class="dialog-common" :visible.sync="stopWeChatBillShow"
		 :show-close="false" @open="noScroll('add')" @close="noScroll('remove')" center>
			<div class="title" v-html="label(contractNo,dialogContent.type === 2?$t('billsDetails.font51'):dialogContent.title)"></div>
			<span slot="footer" class="dialog-footer">
			  <el-button round @click="submitWeChatBill(false)">{{$t('wxBill.font10')}}</el-button>
			  <el-button round type="primary" @click="stopWeChatBillShow = false">{{$t('wxBill.font11')}}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		bindWxBill,
		openAlert,
		cancelAlert
	} from '@/api/bill'
	import {
		getToken
	} from '@/utils/auth'
	export default {
		name: 'WxBill',
		props: {
			contractNo: {
				type: [String, Number],
				required: true
			},
			dialogContent: {
				type: [Object],
				required: true
			}
		},
		data() {
			console.log('dialogContent---',this.dialogContent)
			return {
				WeChatBillShow: false,
				WeChatBillCbox: false,
				stopWeChatBillShow: false,


				isAgreeTerms: false,
				submitLoadIng: false,
			}
		},
		methods: {
			label(a,b){
			  if(window.localStorage.getItem('language')=='EN'){
			    return this.$t('wxBill.font9')+'<br>'+b+' for<br><b style="color:#EE5050">'+this.$t('wxBill.font09')+a+'</b>';
			  }else{
			    return this.$t('wxBill.font5')+'<b style="color:#EE5050">'+this.$t('wxBill.font05')+a+' <br></b>'+this.$t('wxBill.font09')+b;
			  }
			
			},
			//开启微信账单
			async submitWeChatBill(boolean) {

				if (!this.isAgreeTerms && boolean) {
					this.$message(this.$t('wxBill.font12'));
					this.submitLoadIng = false
				} else {
					if (this.submitLoadIng) {
						return false;
					}
					this.submitLoadIng = true
					let res = null;
					if (this.dialogContent.type == 1 || this.dialogContent.type == 3 || this.dialogContent.type == 4) {
						let data = {
							memberNb: sessionStorage.memberNb,
							bodyNb: this.contractNo,
							operate: boolean ? 1 : 0,
							openId: getToken(),
						}
						res = await bindWxBill(data);
						// res = {code:200};
					} else if (this.dialogContent.type == 2) {
						let data = {
							lang: 'zh_TW',
							bodyNb: this.contractNo,
							cdType: 2,
						}
						if (boolean) {
							res = await openAlert(data)
						} else {
							res = await cancelAlert(data)
							this.isAgreeTerms = false
						}
					}

					if (res.code == 200) {
						console.log(boolean)
						if (boolean) {
							if (this.dialogContent.type == 3 || this.dialogContent.type == 4) {
								this.$message(this.$t('wxBill.font13'));
							} else if (this.dialogContent.type == 2) {
								this.$message(this.$t('newFont.font10'));
							} else {
								this.$message(this.dialogContent.title + this.$t('wxBill.font14'));
							}
							this.WeChatBillShow = false;
						} else {
							if (this.dialogContent.type == 2) {
								this.$message(this.$t('newFont.font11'));
							} else {
								this.$message(this.dialogContent.title + this.$t('wxBill.font15'));
							}

							this.stopWeChatBillShow = false;
						}
						
						this.$emit('emitSubmitWeChatBill', boolean);
						//刷新首页微信账单小红点标记状态
						sessionStorage.removeItem("loginState");
						sessionStorage.removeItem("badgeShow");
					}
					this.submitLoadIng = false
				}
			},
			//关闭微信电子账单的弹窗
			closeWeChatBillShow() {
				this.noScroll('remove');
				this.WeChatBillCbox = false;
			},
			//开关微信电子账单服务
			switchChange(state) {
				if (state) {
					this.WeChatBillShow = true;
				} else {
					this.stopWeChatBillShow = true;
				}
			},
			//首页点击进来打开微信账单弹窗
			openBill() {
				this.WeChatBillShow = true;
				this.$router.replace({
					path: '/bills'
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	/*微信账单弹层*/
	.dialog-common {
		.title {
			text-align: center;
			padding: 0 10px;
		}

		.title b {
			color: #EE5050;
		}

		.box-card {
			max-height: 200px;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			margin: 15px 0;
		}

		.statement {
			text-align: center;
		}

		.text {
			font-size: 12px;

			p {
				margin-top: 5px;
			}
		}
	}
</style>
