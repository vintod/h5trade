define(function(require, exports, module) {
	var $ = require('jquery'),
		appUtils = require('appUtils'),
		layerUtils = require('layerUtils'),
		service = require('stockService').getInstance();
	var stocks = {};

	//页面初始化
	function init(){
		$('div.list').css({'height':$(window).height()-$('div.list').offset().top});
		queryDayEntrust();	//查询当日委托
	    
	}
	
	//绑定页面元素事件
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});	
		
		//Tab
		appUtils.bindEvent($('.tab li'),function() {
			appUtils.replaceURL(location.href.replace('cancel_order', $(this).attr('data-url')));
		});	
	}
	
	//查询当日委托单
	function queryDayEntrust() {
		service.queryCancelableList(function(data){
			if(data.error_no == 0) {
				var strHTML = '';
				data.results.sort(function(a, b){
					return parseInt(b.opertime.replace(/:/g,'')) - parseInt(a.opertime.replace(/:/g,''));
				}).forEach(function(item){
					stocks[item.stkcode] = item;
            		strHTML += '<ul class="item" data-stkcode="' + item.stkcode + '">'
							+		'<li class="' + (item.bsflagname.indexOf('买')>-1?'buy':'sell') + '">&nbsp;</li>'
							+		'<li>' + item.stkname + '</li>'
							+		'<li class="red">' + $.format(item.orderprice, 2) + '</li>'
							+		'<li>' + $.format(item.orderqty, 0) + '</li>'
							+		'<li>' + $.format(item.matchqty, 0) + '</li>'
							+		'<li>' + item.orderdate + '&nbsp;' + item.opertime + '</li>'
							+		'<li><span>' + item.orderstatusname + '</span></li>'
							+  '</ul>';
            	});
            	
            	if(strHTML == ''){
            		$('#list .nodata').show();
            	}else{
	            	$(strHTML).appendTo($('#list'));
	            	
	            	//点击事件
					appUtils.bindEvent($('#list .item'), function(){
						var stkcode = $(this).attr('data-stkcode');
						layerUtils.iMenu([{
										   text: '撤单',
									       func: function(){
													var content = '<p style="text-align:left">证券代码：' +stocks[stkcode].stkcode + '</p>'
															    + '<p style="text-align:left">证券名称：' + stocks[stkcode].stkname + '</p>'
															    + '<p style="text-align:left">委托价格：' + $.format(stocks[stkcode].orderprice, 2) + '</p>'
															    + '<p style="text-align:left">委托数量：' + stocks[stkcode].orderqty + '</p>'
													layerUtils.iAlert({
														title: '委托撤单',
														content: content,
														okayText: '撤单',
														okayFunc: function(){
															submit(stocks[stkcode].operdate, stocks[stkcode].ordersno);
														},
														hideCancelButton: false,
														cancelText: '取消',
														popEvent: false
													});
									   	         }
									  }]);
					});
            	}
            }else{
            	layerUtils.iMsg(data.error_info);
            }
		});
	}
	
	//提交撤销委托 operdate：委托日期 ordersno：委托序列号
	function submit(operdate, ordersno){
		service.cancelEntrust(function(data){
			if(data.error_no == 0 && data.results && data.results[0]) {
				layerUtils.iAlert(data.results[0].msgok,'0',function(){
					location.reload();
				});
			}else{
				layerUtils.iAlert(data.error_info);
			}
		}, ordersno, operdate);
	}

	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});