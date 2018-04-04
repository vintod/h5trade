define(function(require, exports, module) {
	var $ = require('jquery'),
		appUtils = require('appUtils'),
		layerUtils = require('layerUtils'),
		service = require('stockService').getInstance();
		
	//页面初始化
	function init(){
		$('div.list').css({'height':$(window).height()-$('div.list').offset().top});
		
		initDayFundFlowList();//查询当日资金流水
	}
	
	//绑定页面元素事件
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});	
	}
	
	//初始化当日资金流水
	function initDayFundFlowList() {
		$(".list").html('');//查询之前清除内容
		service.queryDayFundFlow(function(data){
			if (data.error_no == 0) {
				var strHTML = '';
				data.results.sort(function(a, b){
					return parseInt(b.ordertime.replace(/:/g,'')) - parseInt(a.ordertime.replace(/:/g,''));
				}).forEach(function(item){
					strHTML += '<ul>'
							 +  	'<li>'
							 +  		'<p>' + item.ordertime.replace(/(.{2})(.{2})/,'$1:$2:') + '</p>'
							 +  		'<p>' + item.digestname + '</p>'
							 +  	'</li>'
							 +  	'<li>'
							 +  		'<p>' + (item.stkname!='' ? item.stkname:'&nbsp;') + '</p>'
							 +  		'<p>' + (item.stkcode!='' ? item.stkcode:'&nbsp;') + '</p>'
							 +  	'</li>'
							 +  	'<li>'
							 +  		'<p>' + $.format(item.matchprice, 2) + '</p>'
							 +  		'<p>' + $.format(item.matchqty, 0) + '</p>'
							 +  	'</li>'
							 +  	'<li>'
							 +  		'<p>' + $.format(item.fundeffect, 2) + '</p>'
							 +  		'<p>' + $.format(item.fundbal, 0) + '</p>'
							 +  	'</li>'
							 +  '</ul>';
				});

				if(strHTML == ''){
					$('<p class="nodata">没有查询到数据</p>').appendTo('#list').show();
				}else{
					$("#list").html(strHTML);
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