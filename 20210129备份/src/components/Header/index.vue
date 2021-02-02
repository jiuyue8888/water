<template>
	<!-- 页头 -->
	<div class="header">
		<!-- 返回 -->
		<div class="back" @click="back">
			<i class="el-icon-arrow-left"></i>
			<span>{{ metaTitle }}</span>
		</div>
		<div class="title">{{ bodyNb }}</div>
		
		<div style="display: flex;align-items: center;position: relative;">
		<div class="langs-box" @click="lanIcon=!lanIcon">
			<img v-show="$i18n.locale=='EN'" src="https://cmsphoto.wechattips.com/macaowater/language/en2.png" />
			<img v-show="$i18n.locale=='ZH'" src="https://cmsphoto.wechattips.com/macaowater/language/zhong2.png" />
		</div>
		<div class="lanIcon animated fadeIn" v-show="lanIcon">
			<span @click="langChange('EN')" :class="$i18n.locale=='EN'?'curr':''">EN</span>
			<span @click="langChange('ZH')" :class="$i18n.locale=='ZH'?'curr':''">中文</span></div>
		
			<svg-icon v-if="dataIcon && registerState" @click="openDate" style="font-size: 19px;top: -1px;right:4px;position: relative;"
			 icon-class="date" />
			<router-link to="/bills/message">
				<svg-icon icon-class="message" />
			</router-link>
			<router-link to="/bills">
				<svg-icon icon-class="query-payment" />
			</router-link>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Header',
		props: {
			metaTitle: {
				type: String,
				required: true
			},
			bodyNb: {
				type: [String, Number],
			},
			dataIcon: {
				type: Boolean,
				default: false,
			},
			registerState: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
lanIcon:false,
			}
		},
		mounted() {
			//解决支付页面合同号居中
			if (this.$route.name == 'Payment') {
				let bodyNb = document.querySelector('.title');
				bodyNb.style.marginLeft = '40px';
			}
		},
		methods: {
			//语言切换
			langChange(type){
				//this.$i18n.locale = type
				this.lanIcon = false;
				localStorage.setItem('language',type)
				setTimeout(()=>{
					location.reload()
				},500)
			  
			  
			},
			test() {
				this.$message('待開發');
			},
			//返回
			back() {

				if (this.metaTitle == '主頁') {
					this.$router.push('/');
				} else {
					this.$router.go(-1);
				}
			},
			//打开日期
			openDate() {
				this.$emit('openDate');
			}
		}
	}
</script>

<style lang="scss" scoped>
	/*页头*/
	.header {
		background: linear-gradient(90deg, rgba(62, 100, 171, 1) 0%, rgba(17, 28, 97, 1) 100%);
		box-shadow: 4px 7px 16px 0px rgba(0, 0, 0, 0.2);
		height: 45px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;

		// 返回
		.back {
			font-size: 16px;

			i {
				font-size: 20px;
				color: #fff;
				font-weight: bold;
			}

			span {
				position: relative;
				top: -2px;
				color: #fff;
			}
		}

		.title {
			color: #fff;
			font-size: 14px;
			// text-align: center;
		}

		.svg-icon {
			margin-left: 10px;
			font-size: 20px;
		}
	}

	.langs-box {
		width: 38px;
		height: 20px;
		display: inline-flex;

		border-radius: 50%;
		align-items: center;
		justify-content: center;
		color: #324E8E;
		font-size: 12px;
		margin: 3px 6px 0;

		img {
			width: 100%;
		}
	}

	.lanIcon {
		position: absolute;
		top: 30px;
		left: -20px;
		width: 60px;
		height: 80px;
		z-index: 9;
		box-sizing: border-box;
		padding: 10px;
		color: #333;
		text-align: center;
		font-size: 0.3rem;
		background: url('https://cmsphoto.wechattips.com/macaowater/language/menu2.png') no-repeat 0 0;
		background-size: 100%;
		font-size: 14px;
		animation-duration: 0.5s;
		span {
			display: block;
			height: 30px;
			line-height: 30px;
			border-bottom: 1px solid #ddd;

			&:nth-last-child(1) {
				border-bottom: none;
			}
		}

		span.curr {
			color: #07C160;
		}
	}
</style>
