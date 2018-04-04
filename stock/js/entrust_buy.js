define(function(require, exports, module) {
	var $ = require('jquery'),
		appUtils = require('appUtils'),
		layerUtils = require('layerUtils'),
		service = require('stockService').getInstance();
	var szflag = [{id:'0B', name:'限价委托'},{id:'0a', name:'对方最优价格'},{id:'0b', name:'本方最优价格'},{id:'0c', name:'即时成交剩余撤销'},{id:'0d', name:'五档即成剩撤'},{id:'0e', name:'全额成交或撤销'}];
	var shflag = [{id:'0B', name:'限价委托'},{id:'0d', name:'五档即成剩撤'},{id:'0q', name:'五档即成转限价'}];
	var bsflagDict = {'0': szflag, '2': szflag, '6': szflag, '7': szflag, '1': shflag, '3': shflag};
	var hqMarketDict = {'0':'SZ','2':'SZ', '1':'SH', '3':'SH'};
	var stkInfo = {};		//当前证券信息
	var timer = null;		//定时任务
		
	//页面初始化
	function init(){
		
		var stkcode = appUtils.getPageParam("stkcode");
		if(stkcode && stkcode.length==6) {
			//初始化证券信息
			initStockInfo(stkcode);
		}
		
		var h = $(window).height()-$('#stkList').offset().top;
		if(h>60) {
			$('#stkList').css('height', $(window).height()-$('#stkList').offset().top);
			initPosition();//初始化持仓列表
		}else{
			$('#stkListTitle').hide();
		}
	}
	
	//绑定页面元素事件
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});
		
		//Tab
		appUtils.bindEvent($('.tab li'),function() {
			var url = location.href.replace('entrust_buy', $(this).attr('data-url')).replace(/stkcode=[^&]*/g, '')
				    + (location.href.indexOf('?') == -1?'?':'')
			        + (/^\d{6}$/.test(stkInfo.stkcode)?'&stkcode='+stkInfo.stkcode:'');
			url = url.replace('&&','&').replace('?&','?');
			appUtils.replaceURL(url);
		});	
		
		//输入股票代码
		appUtils.bindEvent($('#stkcode'),function() {
			$(this).val($(this).val().substring(0,6));
		}, 'focus');
		
		//输入股票代码
		appUtils.bindEvent($('#stkcode'),function() {
			if($(this).val().length==6) {
				$(this).blur();
				initStockInfo($(this).val());
			}else{
				resetStockInfo();
			}
		}, 'input');
		
		//清除股票代码
		appUtils.bindEvent($('#clear'),function() {
			$('#stkcode').val('');
			resetStockInfo();
		});
		
		//选择委托方式
		appUtils.bindEvent($('#selWTFS'),function() {
			$(this).prev().html($(this).find('option:selected').text());
			stkInfo.bsflag = $(this).val();
			if(stkInfo.bsflag == '0B') {
				$('#price').attr('disabled', false).attr('placeholder', '委托价格');
			}else{
				$('#price').val('').attr('disabled', true).attr('placeholder', '市价委托');
			}
			showAmount();
		}, 'change');
		
		//五档行情
		appUtils.bindEvent($('#wudang a'),function() {
			var p = $(this).find('span:nth-child(2)').html();
			if(!isNaN(p) && $('#price').attr('disabled') != 'disabled') {
				$('#price').val(p).flash();
				showAmount();
			}
		});
		
		//价格
		appUtils.bindEvent($('#price'),function() {
			var v = $(this).val();
			if(v != '') {
				if(!isNaN(v)) {
					showAmount();
				}else{
					$(this).val('');
					layerUtils.iMsg('委托价格必须为数字');
				}
			}
		}, 'blur');
		
		//数量
		appUtils.bindEvent($('#qty'),function() {
			var v = $(this).val();
			if(v != '') {
				if(!isNaN(v) && parseInt(v)%100==0) {
					showAmount();
				}else{
					$(this).val('');
					layerUtils.iMsg('委托数量必须为100的倍数');
				}
			}
		}, 'blur');
		
		//加减操作
		appUtils.bindEvent($('.opt'),function() {
			var field = $(this).attr('data-field');			//字段：#price或#qty
			var type  = $(this).attr('data-type');			//类型：+或-
			var step  = $.format($(this).attr('data-step'));  //间隔：0.01或100
			var bit   = $.format($(this).attr('data-bit'));   //小数位：2或0
			var v     = $.format($(field).val());
			if($(field).attr('disabled')=='disabled')
				return;
			if(parseFloat(v)<=0 && type=='-') 
				return;
			v = (type=='+'?(v+step):(v-step));
			$(field).val($.format(v, bit)).flash();
			showAmount();
		});
		
		//选择仓位
		appUtils.bindEvent($('#selRate .pos'),function() {
			$('#qty').val(calcNum(stkInfo.fundavl, $('#price').val(), $(this).attr('data-rate'))).flash();
			showAmount();
		});
		
		//提交
		appUtils.bindEvent($('#btnSubmit'),function() {
			$('#stkcode').blur();
			$('#price').blur();
			$('#qty').blur();
			var order = {
				bsflag	: stkInfo.bsflag,					//委托标志
				market	: stkInfo.market,					//市场
				secuid	: stkInfo.secuid,					//股东帐号
				stkcode : stkInfo.stkcode,					//证券代码
				stkname : stkInfo.stkname,					//证券名称
				price	: (stkInfo.bsflag=='0B'?$.format($('#price').val(), 2):'1.00'),	//委托价格
				qty		: $.format($('#qty').val(), 0)		//委托数量
			};
			if(validateOrder(order)) {
				confirmOrder(order);
			}
		});
		
	}
	
	//加载证券信息
	function initStockInfo(stkcode) {
		//取证券余额及当前最新价等信息
		service.queryBalancePrice(function(data){
			if(data) {
				if(data.error_no == '0') {
					if(data.results && data.results.length>0) {
						stkInfo = data.results[0];
						$('#stkcode').val(stkInfo.stkcode+'(' + stkInfo.stkname + ')');//证券代码
						$('#secuid').html(stkInfo.secuid);				 			   //股东账号
						$('#upprice').html($.format(stkInfo.upprice, 2));			   //涨停价
						$('#downprice').html($.format(stkInfo.downprice, 2));		   //跌停价
						$('#price').val($.format(stkInfo.lastprice, 2));			   //最新价格
						$('#bsflag').html('限价委托');	 						       //委托方式
						stkInfo.bsflag = '0B';									       //委托方式
						
						//委托方式
						var strHTML = '';
						bsflagDict[stkInfo.market].forEach(function(item){
							strHTML += '<option value="' + item.id + '">' + item.name + '</option>';
						});
						$('#selWTFS').html(strHTML);
						
						showAmount();
						
						//查询五档行情
						queryStockMarket();
						
					}else{
						layerUtils.iMsg('未能获取到代码为(' + stkcode + ')的证券信息');
					}
				}else{
					layerUtils.iMsg(data.error_info);
				}
			}else{
				layerUtils.iMsg('获取账户信息时，没有返回内容');
			}
		}, stkcode);
	}
	
	//重置证券信息
	function resetStockInfo() {
		//清除定时任务
		if(timer != null) {
			window.clearTimeout(timer);
			timer = null;
		}
		stkInfo = {};
		$('#secuid').html('股东账号');
		$('#bsflag').html('委托方式');
		$('#downprice').html('-.--');
		$('#upprice').html('-.--');
		$('#amount').html('-.--');
		$('#balance').html('-.--');
		$('#price').val('').attr('disabled', false).attr('placeholder', '委托价格');
		$('#qty').val('').attr('placeholder','可买：0');
		$('#wudang a').removeClass('down');
		$('#wudang a span:nth-child(2)').html('-.--');
		$('#wudang a span:nth-child(3)').html('--');
	}
	
	//获取五档行情
	function queryStockMarket() {
		console.log('===' + new Date() + '：查五档行情(' + stkInfo.stkcode + ')===');
		service.getHqStockList(function(data){
			if(data && data.results && data.results.length>0) {
				var info = data.results[0];
				var yPrice = $.format(info['yesterday'], 2);//昨日收盘价
				var buyTotalVol = 0;					  //买盘总量
				var sellTotalVol = 0;				      //卖盘总量
				for(var i=1; i<6; i++) {
					//买盘
					var buyPrice = $.format(info['buyprice'+i], 2);
					var buyVol = $.format(info['buyvol'+i], 0);
					buyPrice>0 && $('#wudang .buy a:nth-child(' + i + ') span:nth-child(2)').html(buyPrice);
					buyVol>0 && $('#wudang .buy a:nth-child(' + i + ') span:nth-child(3)').html(buyVol);
					if(buyPrice > 0 && parseFloat(buyPrice) < parseFloat(yPrice)) {
						$('#wudang .buy a:nth-child(' + i + ')').addClass('down');
					}else{
						$('#wudang .buy a:nth-child(' + i + ')').removeClass('down');
					}
					buyTotalVol += buyVol;
					
					//卖盘
					var sellPrice = $.format(info['sellprice'+(6-i)], 2);
					var sellVol = $.format(info['sellvol'+(6-i)], 0);
					sellPrice>0 && $('#wudang .sell a:nth-child(' + i + ') span:nth-child(2)').html(sellPrice);
					sellVol>0 && $('#wudang .sell a:nth-child(' + i + ') span:nth-child(3)').html(sellVol);
					if(sellPrice > 0 && parseFloat(sellPrice) < parseFloat(yPrice)) {
						$('#wudang .sell a:nth-child(' + i + ')').addClass('down');
					}else{
						$('#wudang .sell a:nth-child(' + i + ')').removeClass('down');
					}
					sellTotalVol += sellVol;
				}
				var perBuyVol = buyTotalVol/(buyTotalVol+sellTotalVol);//买盘委比
				$('.split-buy').css('width',perBuyVol*100+'%');
				$('.split-sell').css('width',(1-perBuyVol)*100+'%');
			}
			
			//定时任务
			if(appUtils.isTradeTime()) {
				if(timer != null) {
					window.clearTimeout(timer);
					timer = null;
				}
				timer = window.setTimeout(queryStockMarket, 5000);
			}
			
		}, (hqMarketDict[stkInfo.market]+':'+stkInfo.stkcode), true, false);
	}
	
	//初始化持仓
	function initPosition() {
		service.queryMyStock(function(data){
			var strHTML = '';
			if(data && data.results) {
				data.results.forEach(function(item){
					//console.log(item.market+'='+item.stkcode+'='+item.stkname);
					strHTML += '<ul class="item ' + (parseFloat(item.proincome)>=0?'red':'blue') + '" data-stkcode="' + item.stkcode + '">'
							+		'<li>' + item.stkname + '<span class="code">(' + item.stkcode + ')</span></li>'
							+		'<li>' + $.format(item.mktval, 2) + '</li>'			//市值
							+		'<li>' + $.format(item.proincome, 2) + '</li>'			//盈亏
							+		'<li>' + $.format(item.costprice, 2) + '</li>'		//卖出价
							+		'<li>' + $.format(item.stkqty, 0) + '</li>'			//持仓
							+		'<li>' + $.format(item.lastprice, 2) + '</li>'		//市价
							+		'<li>' + (item.stkqty*item.profitprice==0?'0.00':$.format(item.proincome/(item.stkqty*item.profitprice)*100, 2)) + '%</li>' //盈亏率
							+		'<li>' + $.format(item.profitprice, 2) + '</li>'	//成本价
							+		'<li>' + $.format(item.stkavl, 0) + '</li>'			//可用
							+	'</ul>';
				});
			}
			$('#stkList').html(strHTML);
			
			//点击持仓列表
			appUtils.bindEvent($('#stkList .item'),function() {
				resetStockInfo();
				initStockInfo($(this).attr('data-stkcode'));
			});
		});
	}
	
	//计算最大可买数量：市价委托时，价格以涨停价为准
	function calcNum(bal, price, rate) {
		if(stkInfo.bsflag != '0B') {
			price = stkInfo.upprice;
		}
		return !isNaN(bal)&&!isNaN(price)&&!isNaN(rate)&&price!=0?parseInt(bal*rate*0.01/price)*100:0;
	}
	
	//展示订单金额及剩余金额
	function showAmount() {
		var price 	= $.format($('#price').val(), 2);		//委托价格
		var num 	= $.format($('#qty').val(), 0);	 		//委托数量
		var amount  = $.format(price*num, 2);	 	 		//订单金额
		var balance = $.format(parseFloat(stkInfo.fundavl)-parseFloat(amount), 2);	//剩余资金
		$('#amount').html(amount);
		$('#balance').html(balance);
		$('#qty').attr('placeholder', '可买：'+calcNum(stkInfo.fundavl, price, 1));
	}
	
	//验证委托单
	function validateOrder(order) {
		if(!order.stkcode) {
			layerUtils.iMsg('证券代码为空');
			return false;
		}
		
		if(order.stkcode.length != 6) {
			layerUtils.iMsg('证券代码(' + order.stkcode + ')有误');
			return false;
		}
		
		if(!order.secuid || order.secuid == '') {
			layerUtils.iMsg('股东账号不能为空');
			return false;
		}
		
		if(!order.bsflag || order.bsflag == '') {
			layerUtils.iMsg('委托类型不能为空');
			return false;
		}
		
		if(order.bsflag == '0B' && (parseFloat(order.price) > parseFloat(stkInfo.upprice) || parseFloat(order.price) < parseFloat(stkInfo.downprice))) {
			layerUtils.iMsg('委托价格(' + order.price + ')须在涨停价和跌停价[' + stkInfo.downprice + ',' + stkInfo.upprice + ']之间');
			return false;
		}
		
		var maxNum = calcNum(stkInfo.fundavl, order.price, 1);//可买数量
		if(parseInt(order.qty) <= 0 || parseInt(order.qty) > parseInt(maxNum)) {
			layerUtils.iMsg('委托数量(' + order.qty + ')必须大于0并小于可买数量(' + maxNum + ')');
			return false;
		}
		
		return true;
	}
				
	//确认委托单
	function confirmOrder(order) {
		var content = '<p style="text-align:left">股东账号：' + order.secuid + '</p>'
				    + '<p style="text-align:left">证券代码：' + order.stkcode + '</p>'
				    + '<p style="text-align:left">证券名称：' + order.stkname + '</p>'
				    + (order.bsflag=='0B'?'<p style="text-align:left">委托价格：<span class="red bold">' + order.price + '</span></p>':'')
				    + '<p style="text-align:left">委托数量：<span class="red bold">' + order.qty + '</span></p>';
		
		layerUtils.iAlert({
			title: '委托买入',
			content: content,
			okayText: '买入',
			okayFunc: function(){
				submitOrder(order);
			},
			hideCancelButton: false,
			cancelText: '取消',
			popEvent: false
		});
	}
	
	//提交委托单
	function submitOrder(order) {
		service.entrust(function(data){
			if(data) {
				if(data.error_no == '0') {
					layerUtils.iAlert({
						title: '恭喜您',
						content: data.error_info,
						okayText: '查看下单记录',
						okayFunc: function(){
							appUtils.changeURL('./day_entrust.html');
						},
						hideCancelButton: false,
						cancelText: '继续下单',
						popEvent: false
					});
				}else{
					layerUtils.iAlert({
						title: '很遗憾',
						content: data.error_info,
						okayText: '继续下单',
						popEvent: false
					});
				}
			}
		}, order.bsflag, order.market, order.secuid, order.stkcode, order.price, order.qty);
	}
	
	jQuery.fn.flash = function() {
		$this = this;
		$this.addClass('bgchange');
		window.setTimeout(function(){
			$this.removeClass('bgchange');
		}, 300);
	}
	
	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});