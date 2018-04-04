define(function(require, exports, module) {
	var $ = require('jquery'),
		appUtils = require('appUtils'),
		service = require('stockService').getInstance();
			
	//页面初始化
	function init(){
		
	}
	
	//绑定页面元素事件
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});
		
		//Tab
		appUtils.bindEvent($('.tab li'),function() {
			appUtils.replaceURL(location.href.replace('qry_more', $(this).attr('data-url')));
		});	
		
		//菜单
		appUtils.bindEvent($('.group a'),function() {
			appUtils.changeURL($(this).attr('data-url'));
		});	
		
	}

	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});