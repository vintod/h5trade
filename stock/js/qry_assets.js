define(function(require, exports, module) {
	var $ = require('jquery'),
		appUtils = require('appUtils'),
		layerUtils = require('layerUtils'),
		service = require('stockService').getInstance();
	var assetsObj = {};//资产对象rmb usd hk

	
	//页面初始化
	function init(){
		queryAssets();	//查询资产
	}
	
	//绑定页面元素事件
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});
		
		//Tab
		appUtils.bindEvent($('.tab li'),function() {
			appUtils.replaceURL(location.href.replace('qry_assets', $(this).attr('data-url')));
		});
		
		//币种选择
		appUtils.bindEvent($('.subtab li'),function() {
			if(!$(this).hasClass('active')) {
				$(this).addClass('active').siblings('li').removeClass('active');
				$('.subtab .arrow').css({'left':$(this).offset().left + $(this).width()/2 - 5});
				showAssets($(this).attr('data-flag'));
			}
		});
	}
	
	//查询资产
	function queryAssets() {
		service.queryAccoutMoney(function (data) {
            if(data.error_no == 0) {
            	data.results.forEach(function(item){
            		if(item.moneytype == 0){
            			assetsObj['rmb'] = item;
            		}else if(item.moneytype == 1) {
            			assetsObj['hk'] = item;
            		}else if(item.moneytype == 2) {
            			assetsObj['usd'] = item;
            		}
            	});
            	//展示人民币资产
            	showAssets('rmb');
            }else{
            	layerUtils.iMsg(data.error_info);
            }
        }, '');
	}
	//展示资产 type=rmb usd hk
	function showAssets(type) {
		if(!assetsObj[type]){
			assetsObj[type] = {marketvalue:0.00,fundavl:0.00,fundbal:0.00,stkvalue:0.00};
		}
		$('.assets .total').html($.format(assetsObj[type]['marketvalue'], 2));			//总资产
		//$('.assets .useable .v').html($.format(assetsObj[type]['fundavl'], 2));			//可用
		//$('.assets .drawable .v').html($.format(assetsObj[type]['fundbal'], 2));		//余额
		$('.assets .values').html($.format(assetsObj[type]['stkvalue'], 2));			//股票市值
		$('.assets .balance').html($.format(assetsObj[type]['fundbal'], 2));			//余额
		$('.assets .freeze').html($.format(assetsObj[type]['fundavl'], 2));				//可用								//冻结
	}

	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});