define(function(require, exports, module) {
	var $ = require('jquery'),
		appUtils = require('appUtils'),
		layerUtils = require('layerUtils'),
		service = require('stockService').getInstance();
	var markets = {'深圳':'sz', '上海':'sh'};
	var pInfo = {sz:'', sh:''};	//个人额度信息 sz:深圳市场额度 sh:上海市场额度
	var sInfo = {sz:[], sh:[]};	//新股信息  sz:深圳市场新股 sh：上海市场新股
	var noPurReason = null;//不能申购的原因

	//页面初始化
	function init() {
		
		$('.container').css({height:($(window).height() - $('.container').offset().top)});
		
		//从万得库中获取新股信息
		queryNewStockList(queryPersonLimit);
		
	}
	
	//绑定页面元素事件
	function bindPageEvent() {	
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});	
		
		//tab切换
		appUtils.bindEvent($('.tab ul li'),function() {
			if(!$(this).hasClass('active')) {
				$(this).addClass('active').siblings().removeClass('active');
				$('.page').addClass('hide');
				$('#tab_page' + $(this).index()).removeClass('hide');
			}
		});
		
		//跟我学打新
		appUtils.bindEvent($('#btnStudy'),function() {
			appUtils.changeURL('./ipoRule.html');
		});
		
		//立即申购
		appUtils.bindEvent($('#btnPurchase'),function() {
			if($(this).hasClass('disabled')) {
				layerUtils.iAlert(noPurReason);
			}else{
				appUtils.changeURL('./purchase.html');
			}
		});
		
		//弹出框
		appUtils.bindEvent($('#tbarPanel'),function() {
			$('#tbarPanel').fadeOut();
		});
		
		//查询
		appUtils.bindEvent($('#btnQuery'),function() {
			$('#tbarPanel').fadeIn();
		});
		
		//我的申购、配号、中签
		appUtils.bindEvent($('#qryMenus a'),function() {
			$('#tbarPanel').hide();
			appUtils.changeURL($(this).attr('data-url'));
		});
		
	}
	
	//万得新股信息
	function queryNewStockList(callback) {
		service.ipoWDNewStockList(function(data) {
			showNewStockList(data.results);
			callback && callback();
		});
	}
	
	//显示新股日历
	function showNewStockList(list) {
		var jjsgList = new Array();	//即将申购列表
		var sgList = new Array();	//今日申购列表
		var phList = new Array();	//今日配号列表
		var zqList = new Array();	//今日中签列表
		var jjssList = new Array();	//即将上市列表
		
		var today = new Date().format('yyyyMMdd');
		if(list && list.length>0){
			list.forEach(function(data){
				if(parseInt(data.issuedate) > parseInt(today)) {//即将申购
					jjsgList.push(data);
				}else if(data.issuedate == today) {//今日申购
					sgList.push(data);
				}else{	//即将上市
					jjssList.push(data);
				}
			});
		}
		
		showJJSGList(jjsgList);
		showSGList(sgList);
		showJJSSList(jjssList);
		
		//点击新股条目
		appUtils.bindEvent($('.list .item'), function(){
			appUtils.changeURL('./newStockInfo.html?stkcode=' + $(this).attr('data-code'));
		});
		
		//今日申购等展开或折叠
		appUtils.bindEvent($('.page .title'), function(){
			$(this).toggleClass('expand');
		});
	}
	//显示即将申购列表
	function showJJSGList(list) {
		var weeks = {'0':'周日','1':'周一','2':'周二','3':'周三','4':'周四','5':'周五','6':'周六'};
		var strHTML = '';
		var dateStr = '';
		list.forEach(function(data){
			if(data.issuedate && data.issuedate.length==8 && dateStr.indexOf(data.issuedate)==-1)
				dateStr += (',' + data.issuedate);
		});
		if(dateStr != '') {
			dateStr.substring(1).split(',').forEach(function(date) {
				var dStr = date.substring(0,4) + '-' + date.substring(4,6) + '-' + date.substring(6,8);
				var cDate = new Date(dStr);
				strHTML += '<div class="panel">'
						+		'<a class="title expand">' + dStr + ' ' + weeks[cDate.getDay()] + '</a>'
						+		'<div class="list">';
					list.forEach(function(data){
						if(data.issuedate == date) {
							strHTML += '<a class="item" data-code="' + data.issuecode + '">'
									+		'<p class="stock ' + markets[data.market] + '">'
									+			'<span class="name">' + data.stkname + '</span><span class="code">' + data.issuecode + '</span>'
									+		'</p>'
									+		'<p class="value">'
									+			'<span>' + formatPrice(data.price) + '</span>'
									+			'<span>' + formatStockNum(data.maxqty/10000, 1) + '<span class="unit">万</span></span>'
									+			'<span>' + formatStockNum(data.issueqtyonline, 0) + '<span class="unit">万</span></span>'
									+		'</p>'
									+		'<p class="key">'
									+			'<span>发行价(元)</span><span>申购上限(股)</span><span>发行量(股)</span>' /*<span>上市日期</span>*/
									+		'</p>'
									+	'</a>';
						}
					});		
				strHTML	+=		'</div>'
						+	'</div>';
			});
		}
		
		if(strHTML != '')
			$('#jjsgList').html(strHTML);			
	}
	
	//显示今日申购列表
	function showSGList(list) {
		var strHTML = '';
		list.forEach(function(data){
			sInfo[markets[data.market]].push(data.issuecode);
			strHTML += '<a class="item" data-code="' + data.issuecode + '">'
					+		'<p class="stock ' + markets[data.market] + '">'
					+			'<span class="name">' + data.stkname + '</span><span class="code">' + data.issuecode + '</span>'
					+		'</p>'
					+		'<p class="value">'
					+			'<span>' + formatPrice(data.price) + '</span>'
					+			'<span>' + formatStockNum(data.maxqty/10000, 2) + '<span class="unit">万</span></span>'
					+			'<span>' + formatStockNum(data.issueqtyonline, 0) + '<span class="unit">万</span></span>'
					//+			'<span>' + formatDate(data.hitdate) + '</span>'
					+		'</p>'
					+		'<p class="key">'
					+			'<span>发行价(元)</span><span>申购上限(股)</span><span>发行量(股)</span>' /*<span>中签日期</span>*/
					+		'</p>'
					+	'</a>';
		});
		
		if(strHTML != '')
			$('#sgList').html(strHTML);	
	}
	//显示即将上市列表
	function showJJSSList(list) {
		var strHTML = '';
		list.reverse().forEach(function(data){
			strHTML += '<a class="item" data-code="' + data.issuecode + '">'
					+		'<p class="stock ' + markets[data.market] + '">'
					+			'<span class="name">' + data.stkname + '</span><span class="code">' + data.issuecode + '</span>'
					+		'</p>'
					+		'<p class="value">'
					+			'<span>' + formatPrice(data.price) + '</span>'
					+			'<span>' + formatStockNum(data.issueqtyonline, 0) + '<span class="unit">万</span></span>'
					+			'<span>' + formatHitPercent(data.hitpercent, 2) + '<span class="unit">%</span></span>'
					+			'<span>' + formatDate(data.launchdate) + '</span>'
					+		'</p>'
					+		'<p class="key">'
					+			'<span>发行价(元)</span><span>发行量(股)</span><span>中签率</span><span>上市日期</span>'
					+		'</p>'
					+	'</a>';
		});
		
		if(strHTML != '')
			$('#jjssList').html(strHTML);	
	}
	//格式化申购价格
	function formatPrice(str) {
		if(str && str!='' && !isNaN(str)) {
			return parseFloat(str);
		}
		return '<span class="week">未公布</span>';
	}
	//格式化股数
	function formatStockNum(str, bit) {
		if(str && str!='' && !isNaN(str)) {
			return parseFloat(str).toFixed(bit);
		}
		return '<span class="week">未公布</span>';
	}
	//格式化日期为 MM-dd形式
	function formatDate(str) {
		if(str && str!='' && !isNaN(str) && str.length==8) {
			return str.substring(4, 6) + '-' + str.substring(6, 8);
		}
		return '<span class="week">未公布</span>';
	}
	//格式化中签率为两位小数
	function formatHitPercent(str, bit) {
		if(str && str!='' && !isNaN(str)) {
			return parseFloat(str).toFixed(bit);
		}
		return '<span class="week">未公布</span>';
	}
	
	//获取个人申购额度
	function queryPersonLimit() {
		//获取个人申购额度
		service.ipoQryPersonLimit(function(oData){
			var szValue = '0', szUnit = '股';//深圳市场
			var shValue = '0', shUnit = '股';//上海市场
			if(oData && oData.results) {
				oData.results.forEach(function(item){
					var value = (parseInt(item.custquota)>=100000? parseInt(item.custquota)/10000 : item.custquota);
					var unit = (parseInt(item.custquota)>=100000? '万股' : '股');
					if(item.market == '0') {//深圳市场额度
						szValue = value;
						szUnit = unit;
					}else{//上海市场额度
						shValue = value;
						shUnit = unit;
					}
				});
			}
			$('#szMarketLimit').html(szValue).next().html(szUnit);
			$('#shMarketLimit').html(shValue).next().html(shUnit);
			pInfo.sz = szValue;
			pInfo.sh = shValue;
			
			//设置按钮状态
			setPurchaseButton();
		});
	}
	
	//设置立即申购按钮状态
	function setPurchaseButton() {
		//判断今日是否发行新股
		if(sInfo.sz.length + sInfo.sh.length == 0) {
			noPurReason = '今日无可申购新股';
		}else{
			var now = new Date().getHours()*60 + new Date().getMinutes();	//当前时间
			//不在申购时间范围 早于9:15||晚于15:00||(有沪市股票&&早于9:30)
			if(now<555 || now>900 || (sInfo.sh.length>0 && now<570)){
				noPurReason = '不在申购时间范围内';
			}else{
				if(!((sInfo.sz.length>0 && parseInt(pInfo.sz)>0) || (sInfo.sh.length>0 && parseInt(pInfo.sh)>0))) {
					noPurReason = '可申购额度不足';
				}
			}
		}
		//设置按钮状态
		if(noPurReason == null){
			$('#btnPurchase').removeClass('disabled');
		}
	}
	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});