<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
	(function() {
		if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
			handleFontSize();
		} else {
			if (document.addEventListener) {
				document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
			} else if (document.attachEvent) {
				//IE浏览器，非W3C规范
				document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
			}
		}

		function handleFontSize() {
			// 设置网页字体为默认大小
			WeixinJSBridge.invoke('setFontSizeCallback', {
				'fontSize': 0
			});
			// 重写设置网页字体大小的事件
			WeixinJSBridge.on('menu:setfont', function() {
				WeixinJSBridge.invoke('setFontSizeCallback', {
					'fontSize': 0
				});
			});
		}
	})();
	import {
		getLangState
	} from '@/api/others'

	export default {
		name: 'App',
		async created() {

			let result = await getLangState();
			this.$config.memAreaSubStatus = result.data.memAreaSubStatus == 1;

			this.$config.areaSubStatus = result.data.areaSubStatus == 1;
			this.$config.nbAreaSubStatus = result.data.nbAreaSubStatus == 1;
			if(localStorage.getItem('language')){
				this.$i18n.locale = localStorage.getItem('language')
			}else{
				if (result.data.langStatus == '1') {
					this.$config.langStatus = true;
					this.$i18n.locale = 'EN'
					//localStorage.removeItem('language')
					localStorage.setItem('language','EN')
				} else {
					this.$config.langStatus = false
					this.$i18n.locale = 'ZH'
					localStorage.setItem('language','ZH')
				}
			}
			
		}
	}
</script>
<style lang="scss">
	@import './animate.min.css';
	.el-dialog{
	  position: fixed !important;
	  left: 0;
	  right: 0;
	}
	.el-checkbox{
		display: flex!important;
		align-items: center;
	}
	.el-checkbox__label{
	  white-space: normal;
	  width: 100%;
	  text-align: left;
	}
	.el-popup-parent--hidden{
	  min-height: 100%;
	}
	body{
	  font-family:Arial,'Times New Roman';
	  
	}
	*{
		word-break: break-word;
		
	}
	span{
		word-break: initial;
	}
	.hide .el-form-item__error{
		display: none;
	}
	.show .el-form-item__error{
		display: block;
	}
	.underline input,
	.el-form-item__label{
		line-height: 20px!important;
		border-bottom: none!important;
		padding: 0!important;
	}
	.el-form-item__content{
		width: calc(100% - 10px);
		display: flex;
		align-items: center;
		margin-left: 10px!important;
	}
	.el-form-item{
		display: flex;
		align-items: center;
	}
	.el-form-item{
		border-bottom: 1px solid #DCDFE6;
	}
</style>
