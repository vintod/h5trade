define(function(require, exports, module) {
		var $ = require('jquery'),
		appUtils = require('appUtils'),
		layerUtils = require('layerUtils'),
		service = require('stockService').getInstance();
		
	//页面初始化
	function init(){

		$('div.list').css({'height':$(window).height()-$('div.list').offset().top});
		
		initdayDealInfo();//初始化当日委托数据
	    
	}
	
	//绑定页面元素事件
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});	
	}
	
	//初始化当日委托数据
	function initdayDealInfo() {
		$('.list').html('');//查询之前清除内容
		service.queryTodayTurnover (function(data){
			if (data.error_no == 0) {
				var strHTML = '';
				data.results.sort(function(a, b){
					return parseInt(b.matchtime.replace(/:/g,'')) - parseInt(a.matchtime.replace(/:/g,''));
				}).forEach(function(item){
					strHTML += '<ul>'
							 +  	'<li>'
							 +  		'<p>'+item.trddate+'</p>'
							 +  		'<p>'+item.matchtime+'</p>'
							 +  	'</li>'
							 +  	'<li>'
							 +  		'<p>'+(item.stkname!='' && typeof item.stkname !='undefined' ? item.stkname:'--')+'</p>'
							 +  		'<p>'+(item.stkcode!='' ? item.stkcode:'--')+'</p>'
							 +  	'</li>'
							 +  	'<li>'
							 +  		'<p>'+$.format(item.orderprice, 2)+'</p>'
							 +  		'<p>'+item.matchqty+'</p>'
							 +  	'</li>'
							 + 		'<li>'
							 +  		'<p>'+item.bsflagname +'</p>'
							 +  		'<p>'+$.format(item.matchamt, 2)+'</p>'
							 +  	'</li>'
							 +  '</ul>';
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