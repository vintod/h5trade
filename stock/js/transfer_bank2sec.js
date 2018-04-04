define(function(require, exports, module) {
	var $ = require('jquery'),
		service = require("stockService").getInstance(),
		layerUtils = require("layerUtils"),
		appUtils = require('appUtils');
	var moneyTypeDict = {'0':'人民币','1':'港币','2':'美元'};
	var currCardNo = null;	//银行卡号
	var bankAccts = [];		//银行卡
	var bankIconDict = {'0001':'gsyh','0002':'zgyh','0003':'jsyh','0004':'nyyh','0005':'jtyh','0006':'zsyh','0007':'xyyh','0008':'sfyh','0009':'gfyh','0010':'lcyh','1001':'gsyh','1002':'zgyh','1003':'jsyh','1004':'nyyh','1006':'zsyh','1007':'xyyh','1008':'payh','1009':'gfyh','1010':'shyh','1011':'zxyh','1012':'jtyh','1013':'bjyh','1014':'hxyh','1015':'payh','1016':'msyh','1017':'pfyh','1018':'gdyh'};	//银行代码和图片转换

	//页面初始化
	function init(){
		initBankAccts();//初始化银行账号等信息
	}
	
	//绑定页面元素事件
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});
		
		//Tab
		appUtils.bindEvent($('.tab li'),function() {
			appUtils.replaceURL(location.href.replace('transfer_bank2sec', $(this).attr('data-url')));
		});
		
		//选择银行卡
		appUtils.bindEvent($('#btnSelBank'),function() {
			appUtils.replaceURL('./sel_bank.html?url='+escape('./transfer_bank2sec.html') + '&initCardNo=' + currCardNo);
		});
		
		//选择币种
		appUtils.bindEvent($('#selCurrency'),function(){
			$(this).prev().html($(this).find("option:selected").text());
		},'change');
		
		//立即转账
		appUtils.bindEvent($('#btnSubmit'),function(){
			submit();
		});
		
		//输入银行密码
		appUtils.bindEvent($('#inputPwd'),function(){
			var val = $(this).val();
			if(!isNaN(val)) {
				var arr = $('#showPwd span');
				for(var i=0; i<6; i++) {
					if(i < val.length) {
						$(arr[i]).html('●');
					} else {
						$(arr[i]).html('&nbsp;');
					}
				}
			}
			//输入6字符收起小键盘
			if(val.length==6){
				$("#inputPwd").blur();
			}
		},'input');
		
		//取消
		appUtils.bindEvent($('#btnCancel'),function() {
			$('.pop').fadeOut();
		});
		
		//确定
		appUtils.bindEvent($('#btnOkay'),function() {
			if($('#inputPwd').val() == '' || $('#inputPwd').val().length !=6) {
				layerUtils.iMsg('银行密码为6位数字');
				$('#inputPwd').focus();
				return;
			}
			$('.pop').fadeOut();
			//转账
			doBankTrans();
		});
		
		//输入转账金额
		appUtils.bindEvent($('#tranamt'),function() {
			var value = $(this).val();
			if(value != '' && !isNaN(value)) {
				$('p.upper').html($.convertNumToWord(parseFloat(value)));
			}else{
				$('p.upper').html('-');
			}
		}, 'input');
	}
	
	//初始化银行账号
	function initBankAccts() {	
		service.queryBankList(function(data) {
			if(data.error_no == 0) {
				if(data.results && data.results[0]) {
					data.results.forEach(function(item){
						if(bankAccts[item.bankid] && bankAccts[item.bankid]['moneyTypes']) {
							bankAccts[item.bankid]['moneyTypes'].push(item.moneytype);
						}else{
							bankAccts[item.bankid]={};
							bankAccts[item.bankid]['cardNo'] = item.bankid;		//卡号
							bankAccts[item.bankid]['bankCode'] = item.bankcode;	//银行编号
							bankAccts[item.bankid]['bankName'] = item.bankname;	//银行名称
							bankAccts[item.bankid]['moneyTypes'] = [item.moneytype];//支持币种
						}
					});

					//获取银行卡号
					currCardNo = appUtils.getPageParam('cardNo') || data.results[0].bankid;
					
					//设置银行卡图片
					$('#btnSelBank').css({'background':'#fff url(./images/bank/bk_'+bankIconDict[bankAccts[currCardNo].bankCode]+'.gif) no-repeat left center','background-size': 'auto 38px','background-position': '10px 50%'});
					
					//显示银行卡信息
					$('#btnSelBank .bank span').html(bankAccts[currCardNo].bankName);
					//$('#btnSelBank .no span').html(bankAccts[currCardNo].cardNo.slice(-4));

					//初始化币种选择框
					for(var i=0;i<bankAccts[currCardNo].moneyTypes.length;i++) {
						$('<option value="'+bankAccts[currCardNo].moneyTypes[i]+'">'+moneyTypeDict[bankAccts[currCardNo].moneyTypes[i]]+'</option>').appendTo($('#selCurrency'));
					}
					
					//初始化币种
					$('#selCurrency').val(bankAccts[currCardNo].moneyTypes[0]);
					$('#selCurrency').prev().html(moneyTypeDict[bankAccts[currCardNo].moneyTypes[0]]);
					
				}else{
					layerUtils.iMsg('无法获取到银行卡信息');	
				}
				
			}else{
				layerUtils.iMsg(data.error_info);	
			}
		});
	}	
	
	//转入
	function submit() {
		$('#tranamt').blur();
		if(!currCardNo) {
			layerUtils.iMsg('请先选择银行卡');
			return;
		}
		if(!moneyTypeDict[$('#selCurrency').val()]) {
			layerUtils.iMsg('请先选择币种');
			return;
		}
		if(!$('#tranamt').val()) {
			layerUtils.iMsg('请先输入转账金额');
			return;
		}
		var str = "<span class='boxCont'>请确认以下转账信息：<br>" 
				+ "存管银行：" + bankAccts[currCardNo].bankName + "<br>" 
				+ "银行卡号：" + currCardNo.substring(0,4) + '****' + currCardNo.slice(-4) + "<br>" 
 				+ "转账币种：" + moneyTypeDict[$('#selCurrency').val()] + "<br>" 
 				+ "转入金额：" + $("#tranamt").val() + "元<br>" 
 				+ "</span>";
		layerUtils.iAlert(str, null, function(){
			service.queryBankInfo(function(data){
				if(data.error_no == 0){
					if(data.results && data.results.length>0) {
						if(data.results[0].bankpwdflag == '1') {//需要输入密码
							showPwdDiv();
						}else{//直接提交
							doBankTrans();
						}
					}else{
						layerUtils.iMsg('没有获取到' + bankAccts[currCardNo].bankName + '的配置信息');
					}
				}else{
					layerUtils.iMsg(data.error_info);
				}
			},bankAccts[currCardNo].bankCode,$('#selCurrency').val(),'1',true);
		}, '立即转入', function(){
			
		}, '我再改改');
	}
	
	//转账提交
	function doBankTrans(){
		service.bankTrans(function(data) {
			if(data.error_no == 0) {
				$("#tranamt").val('');
				layerUtils.iMsg(data.error_info);
			}else{
				layerUtils.iAlert(data.error_info);
			}
		}, $('#selCurrency').val(), $("#inputPwd").val(), bankAccts[currCardNo].bankCode, $("#inputPwd").val(), '1', $("#tranamt").val());
	}
	
	//显示密码输入框
	function showPwdDiv(){
		$('.pop').fadeIn();
		$('#showPwd span').html('&nbsp;');
		$('#inputPwd').val('').focus();
	}
	
	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});