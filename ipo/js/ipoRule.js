define(function(require, exports, module) {
	var $ = require('jquery'),
		appUtils = require('appUtils'),
		layerUtils = require('layerUtils'),
		service = require('stockService').getInstance();

	//页面初始化
	function init(){
		
	}
	
	//绑定页面元素事件
	function bindPageEvent() {
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});	

	}
	
	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});