define(function(require, exports, module) {
	var $ = require('jquery'),
		constants = require("constants"),
		service = require("stockService").getInstance(),
		layerUtils = require("layerUtils"),
		appUtils = require('appUtils');
			
	//页面初始化
	function init(){
		
	    $('div.list').css({'height':$(window).height()-$('div.list').offset().top});
	    
	    queryBankTransferRecords();
	}
	
	//转帐查询
	function queryBankTransferRecords(){
		service.queryBankTransferRecords(function(data){
		  	if(data.error_no == 0){
		  		var bodyHtml = '';
		  		data.results.sort(function(a, b){
					return (parseInt(b.operdate) - parseInt(a.operdate) == 0)?(parseInt(b.opertime) - parseInt(a.opertime)):(parseInt(b.operdate) - parseInt(a.operdate));
				}).forEach(function(item){
					var moneyTypeDict = {'0':'人民币','1':'港币','2':'美元'};
					var status = {'0':'未报','1':'已报','2':'成功','3':'失败','4':'超时','5':'待冲正','6':'已冲正','7':'调整为成功','8':'调整为失败'};
					var type = {'1':'银行转证券','2':'证券转银行','3':'查证券余额','4':'查银行余额','5':'冲银行转证券','6':'冲证券转银行','7':'开户',
								'8':'销户','A':'帐户冻结','B':'帐户解冻','C':'帐户挂失','D':'帐户解挂','E':'换卡','F':'结息','G':'重发','M':'转帐调整',
								'S':'查转帐结果','W':'修改客户资料','X':'存管签约'};
					if('1,2'.indexOf(item.banktranid) != '-1') {
						 bodyHtml += '<ul>'
								  +	 	'<li class="' + (item.banktranid=='1'?'into':'out') + '">&nbsp;</li>'
								  +	 	'<li>' + constants.getBankName(item.bankcode) + '</li>'
								  +	 	'<li>' + moneyTypeDict[item.moneytype] + '</li>'
								  +	 	'<li class="' + (item.banktranid=='1'?'red':'green') + '">' + $.format(item.fundeffect, 2) + '</li>'
								  +	 	'<li>' + $.format(item.fundbal, 2) + '</li>'
								  +	 	'<li>' + item.operdate.replace(/(.{4})(.{2})/,'$1/$2/') + '&nbsp;' + item.opertime.replace(/(.{2})(.{2})/,'$1:$2:') + '</li>'
								  +	 	'<li><span>' + status[item.status] + '</span></li>'
								  +	 '</ul>';
					}
				});
				
				if(bodyHtml == ''){
					$('<p class="nodata">没有查询到数据</p>').appendTo('#list').show();
				}else{
					$("#list").html(bodyHtml);
				}
			}else{
				layerUtils.iMsg(data.error_info);
			}
		});
	}
	
	//绑定页面元素事件
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});

		//Tab
		appUtils.bindEvent($('.tab li'),function() {
			appUtils.replaceURL(location.href.replace('transfer_qryflow', $(this).attr('data-url')));
		});
	}
	
	//处理日期格式
	function d(date){
		return date.substring(0, 4)+'/'+date.substring(4, 6)+'/'+date.substring(6, 8);
	}
	
	//处理时时间格式
	function t(date){
		return date.substring(0, 2)+':'+date.substring(2, 4)+':'+date.substring(4, 6);
	}

	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});