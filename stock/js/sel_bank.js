define(function(require, exports, module) {
	var $ = require('jquery'),
		service = require("stockService").getInstance(),
		layerUtils = require("layerUtils"),
		appUtils = require('appUtils');
	var bankAccts = [];//银行卡[{bankName:'',bankCode:'',cardNo:''}]
	var bankIconDict = {'0001':'gsyh','0002':'zgyh','0003':'jsyh','0004':'nyyh','0005':'jtyh','0006':'zsyh','0007':'xyyh','0008':'sfyh','0009':'gfyh','0010':'lcyh','1001':'gsyh','1002':'zgyh','1003':'jsyh','1004':'nyyh','1006':'zsyh','1007':'xyyh','1008':'payh','1009':'gfyh','1010':'shyh','1011':'zxyh','1012':'jtyh','1013':'bjyh','1014':'hxyh','1015':'payh','1016':'msyh','1017':'pfyh','1018':'gdyh'};	//银行代码和图片转换
	
	//页面初始化
	function init(){
		//初始化银行账号
		initBankAccts();
	}
	
	//绑定页面元素事件
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			var toURL = appUtils.getPageParam('url');
			if(toURL == '') {
				history.go(-1);
			}else{
				appUtils.replaceURL(toURL + '?cardNo='+$('#list a.active').attr('data-cardno'));
			}
		});
	}
	
	//初始化银行账号
	function initBankAccts() {	
		service.queryBankList(function(data) {
			if(data.error_no == 0) {
				data.results.forEach(function(item){
						if(!bankAccts[item.bankid]) {
							bankAccts[item.bankid]={};
							bankAccts[item.bankid]['cardNo'] = item.bankid;		//卡号
							bankAccts[item.bankid]['bankCode'] = item.bankcode;	//银行编号
							bankAccts[item.bankid]['bankName'] = item.bankname;	//银行名称
						}
				});
				
				//默认选择卡号
				var initCardNo = appUtils.getPageParam('initCardNo');
				
				for(i in bankAccts) {
					var item = bankAccts[i];
					var css = (initCardNo == item.cardNo)?'active':'';
					var style = 'background: #fff url(./images/bank/bk_' + bankIconDict[item.bankCode] + '.gif) no-repeat left center;background-size: auto 38px;background-position: 10px 50%;';
					var strHTML = '<a data-cardno="' + item.cardNo + '" class="card ' + css + '" style="' + style + '">'
									+ '<p class="bank">' + item.bankName + '</p>'
									//+ '<p class="no">尾号<span class="orange">&nbsp;' + item.cardNo.slice(-4) + '&nbsp;</span>储蓄卡</p>'
								+ '</a>';
					$(strHTML).appendTo($('#list'));
				}
				
				//绑定事件
				appUtils.bindEvent($('#list a.card'),function() {
					selBankAcct($(this));//选择银行卡
				});
				
			}else{
				layerUtils.iMsg(data.error_info);	
			}
		});
	}
	
	//选择银行卡
	function selBankAcct($this) {
		var toUrl = appUtils.getPageParam('url');
		if(toUrl)
			appUtils.replaceURL(toUrl + '?cardNo='+$this.attr('data-cardno'));
		else
			history.go(-1);
	}

	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});