define(function(require, exports, module) {
	var $ = require('jquery'),
		appUtils = require('appUtils'),
		layerUtils = require('layerUtils'),
		service = require('stockService').getInstance();
	var flipsnap = null;
	
	//页面初始化
	function init(){
		
		initFlipsnap();		//初始化左右滑动组件
		initListStyle();	//初始化列表样式
		
		queryAssets(function(){	//查询资产
			queryPosition();	//查询持仓
		});  
	}
	
	//初始化左右滑动组件
	function initFlipsnap() {
    	flipsnap = Flipsnap('.inner');
    	flipsnap.element.addEventListener('fstouchend', function(ev) {
			showPosition(ev.newPoint);
		}, false);
	}
	
	//初始化列表样式
	function initListStyle() {
		$('div.list').css({'height':$(window).height()-$('div.list').offset().top});
	}
	
	//绑定页面元素事件
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});
		
		//Tab
		appUtils.bindEvent($('.tab li'),function() {
			appUtils.replaceURL(location.href.replace('qry_position', $(this).attr('data-url')));
		});
		
		//资产面板的显示与隐藏
		appUtils.bindEvent($('.page'),function() {
			if($('#assets0 .left').is(":hidden")){
				$('.page .left,.page .right').show();
			}else{
				$('.page .left,.page .right').hide();
			}
			initListStyle();//调整列表样式
		});
	
	}
	
	//查询资产
	function queryAssets(callback) {
		service.queryAccoutMoney(function (data) {
            if(data.error_no == 0) {
            	data.results.forEach(function(item){
            		$('#assets' + item.moneytype + ' .marketvalue').html(item.marketvalue);	//总资产
            		$('#assets' + item.moneytype + ' .stkvalue').html(item.stkvalue);		//股票市值
            		$('#assets' + item.moneytype + ' .fundbal').html(item.fundbal);			//资金余额
            		$('#assets' + item.moneytype + ' .fundavl').html(item.fundavl);			//可用
            	});
            	callback && callback();
            }else{
            	layerUtils.iMsg(data.error_info);
            }
        }, '');
	}
	
	//查询持仓
	function queryPosition(callback) {
		service.queryMyStock(function (data) {
            if(data.error_no == 0) {
            	var incomes = [0,0,0];	//累计盈亏
            	var strHTML = '';
            	data.results.forEach(function(item){
            		incomes[item.moneytype] = incomes[item.moneytype] + parseFloat(item.proincome);//累计盈亏
            		// 盈亏率 = 浮动盈亏/(证券数量*成本价格) *100  【后保留两位小数】
					var incomeRate="0.00";
            		if(item.stkqty!="0"){
						incomeRate = (item.proincome/(item.stkqty*item.profitprice)*100).toFixed(2);
            		}

            		strHTML += '<div data-stkcode="' + item.stkcode + '" class="item moneytype' + item.moneytype + '">'
	            					+ '<ul class="' + (item.proincome>=0?'up':'down') + '">'
										+ '<li>'
											+ '<span>' + item.stkname + '</span>'					//股票名称
											+ '<span class="code">(' + item.stkcode + ')</span>'	//股票代码
										+ '</li>'
										+ '<li>'
											+ '<p>' + $.format(item.mktval, 2) + '</p>'				//市值
											+ '<p>'  + $.format(item.lastprice, 2) + '</p>'			//市价
										+ '</li>'
										+ '<li>'
											+ '<p>' + $.format(item.proincome, 2) + '</p>'				//盈亏
											+ '<p>'  + $.format(incomeRate, 2) + '%</p>'			//盈亏率
										+ '</li>'
										+ '<li>'
											+ '<p>' + $.format(item.costprice, 3) + '</p>'			//买入价
											+ '<p>' + $.format(item.profitprice, 3) + '</p>' 		//成本价
										+ '</li>'
										+ '<li>'
											+ '<p>' + $.format(item.stkqty, 0) + '</p>'				//持仓
											+ '<p>' + $.format(item.stkavl, 0) + '</p>'				//可用
										+ '</li>'
									+ '</ul>'
								+ '</div>';
            	});
     			strHTML += '<p class="nodata">没有查询到数据</p>';
            	$('#list').html(strHTML);
            	//默认显示人民币
            	showPosition(0);
            	
            	//设置浮动总盈亏
            	for(var i=0; i<incomes.length; i++){
            		$('#assets'+i+' .income').html(incomes[i].toFixed(2));
            		if(incomes[i]<0)
            			$('#assets'+i+' .left').addClass('down');
            		else
            			$('#assets'+i+' .left').addClass('up');
            	}

				//点击事件
				appUtils.bindEvent($('#list .item'), function(){
					var stkcode = $(this).attr('data-stkcode');
					layerUtils.iMenu([{
										text: '委托买入',
									    func: function(){
									   		      appUtils.replaceURL('./entrust_buy.html?stkcode='+stkcode);
									   	      }
									  },
									  {
									   	 text: '委托卖出',
									   	 func: function(){
									   	 	       appUtils.replaceURL('./entrust_sell.html?stkcode='+stkcode);
									   	 	   }
									  }]);
				});
				
				callback && callback();
            }else{
            	layerUtils.iMsg(data.error_info);
            }
        });
	}
	
	//显示不同币种账户的持仓列表
	function showPosition(moneytype) {
		for(var i=0;i<3;i++){
			if(i==moneytype){
				$('#list .moneytype' + i).css({'display':'block'});
				if($('#list .moneytype' + i).size() == 0){
					$('#list .nodata').show();
				}else{
					$('#list .nodata').hide();
				}
			}else{
				$('#list .moneytype' + i).css({'display':'none'});
			}
		}
	}

	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});