define(function(require, exports, module) {
	var $ = require('jquery'),
		appUtils = require('appUtils'),
		layerUtils = require('layerUtils'),
		service = require('stockService').getInstance();
		
	//页面初始化
	function init(){

		$('div.list').css({'height':$(window).height()-$('div.list').offset().top});
		
		initdayEnrtustInfo();//初始化当日委托数据
		
	}
	
	//绑定页面元素事件
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});	
	}
	
	//初始化当日委托数据
	function initdayEnrtustInfo() {
		$('.list').html('');//查询之前清除内容
		service.queryTodayEntrust (function(data){
			if (data.error_no == 0) {
				var strHTML = '';
				data.results.sort(function(a, b){
					return parseInt(b.opertime.replace(/:/g,'')) - parseInt(a.opertime.replace(/:/g,''));
				}).forEach(function(item){
					strHTML += '<ul>';
					strHTML += '<li><p>'+(item.stkname!='' && typeof item.stkname !='undefined' ? item.stkname:'--')+'</p><p>'+(item.stkcode!='' ? item.stkcode:'--')+'</p></li>';
					strHTML += '<li><p>'+$.format(item.orderprice, 2)+'</p><p>'+item.opertime+'</p></li>';
					strHTML += '<li><p>'+item.orderqty+'</p><p>'+item.matchqty+'</p></li>';
					strHTML += '<li><p>'+item.bsflagname+'</p><p>'+item.orderstatusname+'</p></li>';
					strHTML += '</ul>';
				});
				if(strHTML == ''){
					$('<p class="nodata">没有查询到数据</p>').appendTo('#list').show();
				}else{
					$('#list').html(strHTML);
				}
			} else {
				layerUtils.iMsg(data.error_info);
			}
		});

	}
	
	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});