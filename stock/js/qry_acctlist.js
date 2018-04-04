define(function(require, exports, module) {
	var $ = require('jquery'),
		appUtils = require('appUtils'),
		layerUtils = require('layerUtils'),
		service = require('stockService').getInstance();
	var markets = {'0':'深A', '1':'沪A', '2':'深B', '3':'沪B', '5':'沪港通', '6':'三板A', '7':'三板B', 'A':'非交易所债券', 'J':'开放式基金',};
	var status = {'0':'正常', '1':'销户', '2':'冻结'};	
		
	//页面初始化
	function init(){

		$('div.list').css({'height':$(window).height()-$('div.list').offset().top});

		queryAcctList();//查询股东资料
	}
	
	//绑定页面元素事件
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});	
	}
	
	//查询股东资料
	function queryAcctList() {
		service.querySecuid(function(data){
			if(data.error_no == 0) {
				var strHTML = '';
				data.results.sort(function(a, b){
					return parseInt(a.opendate) - parseInt(b.opendate);
				}).forEach(function(item){
					strHTML += '<ul class="item">'
									+ '<li>'
										+ '<p>' + item.opendate.replace(/(.{4})(.{2})/,'$1-$2-') + '</p>'
									+ '</li>'
									+ '<li>'
										+ '<p>' + item.secuid + (item.secuseq==0?'(主)':'(副)') + '</p>'
									+ '</li>'
									+ '<li>'
										+ '<p>' + markets[item.market] + '</p>'
									+ '</li>'
									+ '<li>'
										+ '<p>' + status[item.status] + '</p>'
									+ '</li>'
								+ '</ul>';
				});
				if(strHTML == '') {
					$('<p class="nodata">没有查询到数据</p>').appendTo('#list').show();
				}else{
					$('#list').html(strHTML);
				}
			}else{
				layerUtils.iMsg(data.error_info);
			}
		});
	}

	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});