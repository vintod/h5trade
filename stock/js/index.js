define(function(require, exports, module) {
	var $ = require('jquery'),
		appUtils = require('appUtils'),
		layerUtils = require('layerUtils'),
		service = require('stockService').getInstance();

	//页面初始化
	function init(){
		//layerUtils.iMsg('开始日期不能大于结束日期');
		//layerUtils.iAlert({
		//	title: '恭喜您',
		//	content: "啊啊是非得失",
		//	okayText: '退出重新登录',
		//	okayFunc: function(){
		//		history.go(-1);
		//	}
		//});
		//layerUtils.iLoading(!0, "加载中...");

		//layerUtils.iConfirm();


		layerUtils.iMenu([{
			text: '撤单',
			func: function(){
				var content = '<p style="text-align:left">证券代码：</p>'
					+ '<p style="text-align:left">证券名称：</p>'
					+ '<p style="text-align:left">委托价格：</p>'
				layerUtils.iAlert({
					title: '委托撤单',
					content: "内容内容内容内容内容内容内容内容内容内容",
					okayText: '撤单',
					okayFunc: function(){
						//submit(stocks[stkcode].operdate, stocks[stkcode].ordersno);
					},
					hideCancelButton: false,
					cancelText: '取消',
					popEvent: false
				});
			}
		}]);
		//initLoginStatus();//初始化登录状态
	}
	
	//初始化登录状态
	function initLoginStatus() {
		service.validateUserLogin(function(data){
			if(data.error_no == '-999') {
				$('#btnLogout').fadeOut();
			}else{
				$('#btnLogout').fadeIn();
			}
		});
	}
	
	//绑定页面元素事件
	function bindPageEvent() {
		appUtils.bindEvent($('.menu li'),function() {
			var url = location.pathname.replace('index.html', $(this).attr('data-url'));
			appUtils.changeURL(url);
		});
		
		
		//退出登录
		appUtils.bindEvent($('#btnLogout'),function() {
			hasLogin = false;
			service.closeSession();		//清除服务器session
			appUtils.clearSStorage(['mobileId', 'header', 'tab', 'color', 'channel', 'macaddr', 'opversion', 'appversion', 'phonetype']);
			appUtils.setLStorageInfo('jsessionid', null);
			appUtils.setLStorageInfo('clientinfo', null);
			appUtils.setLStorageInfo('userinfo', null);
			$('#btnLogout').fadeOut();	//显示未登录状态
			layerUtils.iMsg('交易已退出');
		});

	}
	
	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});