define(function(require, exports, module) {
	var $ = require('jquery'),
		appUtils = require('appUtils'),
		layerUtils = require('layerUtils'),
		enDecryptUtils = require("enDecryptUtils"),
		service = require('stockService').getInstance();
	var loginType = '';		//登录类型 stock:普通柜台 rzrq：信用柜台
	var hisAccts = null;	//本地记录的账号 type:stock rzrq
	var pwdpwd	= '';
	
	//页面初始化
	function init(){
		var lastLoginAcct = appUtils.getLStorageInfo('lastLoginAcct');
		if(lastLoginAcct) {
			$('#acct').val(lastLoginAcct);
		}
	}
	
	//绑定页面元素事件
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});

		//密码输入
		appUtils.bindEvent($('#pwd'), function(){
			var value = $(this).val();
			if(value.length > pwdpwd.length) {
				pwdpwd = pwdpwd + value.substring(pwdpwd.length);
			}else{
				pwdpwd = pwdpwd.substring(0, value.length);
			}
			window.setTimeout(function(){
				var str  = '';
				for(var i=0;i<value.length;i++)
					str += '●';
				$('#pwd').val(str);
			}, 10);
		},'input');
		
		//登录
		appUtils.bindEvent($('#btnLogin'), function(){
			$('#acct').blur();
			$('#pwd').blur();
			login();
		});
	
	}
	
	//普通股票柜台登录
	function login() {
		var acct = $('#acct').val();								//资金账号
		var pwd = pwdpwd;											//交易密码
		var curUUID  = appUtils.getSStorageInfo("mobileId");		//本次页面传进来的设备UUID
		var mobile 	 = appUtils.getLStorageInfo("mobileNo");		//已短信验证的手机号
		var hisUUID  = appUtils.getLStorageInfo("mobileIdHistory");	//已短信验证的设备UUID
		
		if(!acct) {
			layerUtils.iMsg('资金账号为空');
			return;
		}
		if(!pwd) {
			layerUtils.iMsg('交易密码为空');
			return;
		}
		if(!curUUID) {
			layerUtils.iMsg('设备序列号为空');
			return;
		}
		//首次登录须绑定手机号
		if(!mobile || curUUID != hisUUID) {
			layerUtils.iAlert('根据证监会要求，首次交易需要进行短信验证！', null, function(){
				$('#pwd').val('');
				pwdpwd = '';
				appUtils.changeURL('./auth.html');
			}, '立即验证', null, '暂不验证');
			return;
		}
		
		service.getRsaKey(function(data){
			if(data.error_no == 0 && data.results && data.results.length>0){
				var modulus = data.results[0].modulus;							//加密指数
				var publicExponent = data.results[0].publicExponent;			//加密指数
				pwd = enDecryptUtils.rsaEncrypt(modulus, publicExponent, pwd);  //密码加密
				
				service.userLogin(function(data){
					if(data.error_no == 0 && data.results && data.results[0]) {
						//记录登录信息
						appUtils.setSStorageInfo("userinfo",JSON.stringify(data.results[0]));
						appUtils.setSStorageInfo('jsessionid', data.results[0].jsessionid);
						appUtils.setSStorageInfo('clientinfo', data.results[0].clientinfo);
						appUtils.setLStorageInfo('lastLoginAcct', acct);
						
						//登录成功后转跳的页面
						var toURL = appUtils.getPageParam('toURL');
						if(toURL == '') {
							history.go(-1);
						}else{
							appUtils.replaceURL(toURL);
						}
						
					}else{
						layerUtils.iMsg('交易登录失败：' + data.error_info);
					}
				}, '', 'Z', acct, pwd, '');
				
			}else{
				layerUtils.iMsg('获取RSA加密指数失败：' + data.error_info);
			}
		});
	}
	
	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});