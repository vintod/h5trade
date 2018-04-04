define(function(require, exports, module) {
	var $ = require('jquery'),
		appUtils = require('appUtils'),
		layerUtils = require('layerUtils'),
		service = require('stockService').getInstance();
	var pwd = {'old':'', 'new':''}; //old：原密码 new：新密码

	//页面初始化
	function init(){
		service.validateUserLogin(function(data){
			if(data.error_no == '-999') {
				$.showLogin();
			}
		});
	}
	
	//绑定页面元素事件
	function bindPageEvent(){	
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});
		
		//选择密码类型
		appUtils.bindEvent($('#selPwdType'),function(){
			$(this).prev().html($(this).find("option:selected").text());
		},'change');
		
		//输入原密码
		$.bindEvent($('#inputOldPwd'), function(){
			showPwd('#inputOldPwd', '#btnOldPwd', 'old', false);
		}, 'input');
		
		//显示隐藏原密码
		appUtils.bindEvent($('#btnOldPwd'),function(){
			$(this).toggleClass('enabled');
			showPwd('#inputOldPwd', '#btnOldPwd', 'old', true);
		});
		
		//显示隐藏新密码
		appUtils.bindEvent($('#btnNewPwd'),function(){
			$(this).toggleClass('enabled');
			showPwd('#inputNewPwd', '#btnNewPwd', 'new', true);
		});
		
		//输入新密码
		$.bindEvent($('#inputNewPwd'), function(){
			showPwd('#inputNewPwd', '#btnNewPwd', 'new', false);
		}, 'input');
		
		//提交
		$.bindEvent($('#btnSubmit'), function(){
			submit();
		});
	}
	
	//设置密码 inputId：输入框Id btnId：小眼睛Id flag：old(老密码) new(新密码) toggle：隐藏-显示 切换
	function showPwd(inputId, btnId, flag, toggle) {
		if(true == toggle) {//切换
			if($(btnId).hasClass('enabled')) {//切换到显示
				$(inputId).val(pwd[flag]);
			}else{//切换到隐藏
				var str  = '';
				for(var i=0; i<pwd[flag].length; i++)
					str += '●';
				$(inputId).val(str);
			}
		}else{//更新
			var value = $(inputId).val();
			if($(btnId).hasClass('enabled')) {
				pwd[flag] = value;
			}else{
				if(value.length > pwd[flag].length) {
					pwd[flag] = pwd[flag] + value.substring(pwd[flag].length);
				}else{
					pwd[flag] = pwd[flag].substring(0, value.length);
				}
				window.setTimeout(function(){
					var str  = '';
					for(var i=0;i<value.length;i++)
						str += '●';
					$(inputId).val(str);
				},100);
			}
		}
	}
	
	//提交
	function submit() {
		if(pwd['old'] == '') {
			layerUtils.iMsg('请先输入原密码');
			return;
		}
		if(pwd['new'] == '' || !/^\d{6}$/.test(pwd['new']) 
			|| '000000,111111,222222,333333,444444,555555,666666,777777,888888,999999,012345,123456,234567,345678,456789,987654,876543,765432,654321,543210'.indexOf(pwd['new'])!=-1) {
			layerUtils.iMsg('新密码须为复杂的6位数字，各数字不能相同、顺序或倒序');
			return;
		}
		service.modifyPwd(function(data){
			if(data.error_no == '0') {
				layerUtils.iAlert({
					title: '恭喜您',
					content: data.results[0].msgok,
					okayText: '退出重新登录',
					okayFunc: function(){
						history.go(-1);
					}
				});
			}else{
				layerUtils.iAlert({
					title: '很遗憾',
					content: data.error_info,
					okayText: '修改并重新提交'
				});
			}
		}, $('#selPwdType').val(), pwd['old'], pwd['new']);
	}

	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});