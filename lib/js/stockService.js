/**
 * 交易服务类
 */
define(function(require, exports, module) {
	var appUtils = require('appUtils'),
		global = require('gconfig').global;
	
	function ReqParamVo() {};
	
	ReqParamVo.prototype.setUrl = function(url) {
		this.url = url;
	}
	ReqParamVo.prototype.setReqParam = function(reqParam) {
		this.reqParam = reqParam;
	}
	ReqParamVo.prototype.setIsLastReq = function(isLastReq) {
		this.isLastReq = isLastReq;
	}
	ReqParamVo.prototype.setIsShowWait = function(isShowWait) {
		this.isShowWait = isShowWait;
	}
	ReqParamVo.prototype.setTimeOutFunc = function(timeOutFunc) {
		this.timeOutFunc = timeOutFunc;
	}
	ReqParamVo.prototype.setValue = function(key, value) {
		this[key] = value;
	}
	ReqParamVo.prototype.getValue = function(key) {
		return this[key];
	}
	
	$.getReqParamVo = function(){
		return new ReqParamVo();
	}
	
	function TradeService(){
		this.service = {
			invoke: function (reqParamVo, callBackFunc) {
				appUtils.invokeServer(reqParamVo.getValue('url'), 
									  reqParamVo.getValue('reqParam'),
									  callBackFunc, 
									  reqParamVo.getValue('isLastReq'), 
									  reqParamVo.getValue('isAsync'), 
									  reqParamVo.getValue('isShowWait'),
									  reqParamVo.getValue('isShowOverLay'),
									  reqParamVo.getValue('tipsWords'),
									  reqParamVo.getValue('timeOutFunc'),
									  reqParamVo.getValue('dataType'));
			}
		};
	}
	
	/**
	 * 得到公共参数
	 */
	TradeService.prototype.getCommonTradeParam = function(){
		var userInfo = JSON.parse(appUtils.getLStorageInfo('userinfo'));
		if(!userInfo)
			return {};
		var paraMap = {};
		paraMap['orgid']   = userInfo['orgid'];
		paraMap['issafe']  = userInfo['issafe'];
		paraMap['loginip'] = userInfo['loginip'];
		paraMap['mac'] 	   = userInfo['mac'];
		paraMap['xq_channel'] = appUtils.getSStorageInfo('mobileId')+','+appUtils.getLStorageInfo('mobile')+','+appUtils.getSStorageInfo('macaddr')+','+appUtils.getSStorageInfo('opversion')+','+appUtils.getSStorageInfo('appversion')+','+appUtils.getSStorageInfo('phonetype')+','+appUtils.getSStorageInfo('channel');
		return paraMap;
	};
	
	/**
	 * 得到牛人牛基公共参数
	 */
	TradeService.prototype.getCommonNrnjParam = function(){
		var clientId = '196911218';
		var time = new Date().getTime();
		var sercret = 'a200664b6l3d328ry0c07ef3g08e26se';
		var paraMap = {};
		paraMap['clientId'] = '196911218';
		paraMap['time'] = '1480064907774';
		paraMap['sign'] = 'f3ebcf609116fa7bc2ea316bf3e4ee7b';
		paraMap['nrnj'] = true;
		return paraMap;
	};
	
	/**
	 * 登录
	 */
	TradeService.prototype.userLogin = function(callBackFunc,orgid,inputtype,inputid,trdpwd,ticket,verify){
		var paraMap = {};
		paraMap['funcNo'] = '1000007';//paraMap['funcNo'] = '300100';
		paraMap['orgid'] = orgid;
		paraMap['inputtype'] = inputtype;
		paraMap['inputid'] = inputid;
		paraMap['trdpwd'] = trdpwd;
		paraMap['ticket'] = ticket;
		paraMap['uid'] = '';
		paraMap['vkeys'] = verify;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 验证登录状态
	 */
	TradeService.prototype.validateUserLogin = function(callBackFunc){
		var paraMap = {};
		paraMap['funcNo'] = '-999';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsShowWait(false);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	/**
	 * 短信验证码发送
	 */
	TradeService.prototype.sendMobileCode = function(callBackFunc,mobile_no){
		var paraMap = {};
		paraMap['funcNo'] = '1000004';
		paraMap['mobile_no'] = mobile_no;
		paraMap['op_way'] = '3';// 访问来源（默认PC）0：pc，2：pad，3：手机
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	/**
	 * 短信验证码验证
	 */
	TradeService.prototype.authMobileCode = function(callBackFunc,mobile_no,mobile_code){
		var paraMap = {};
		paraMap['funcNo'] = '1000005';
		paraMap['mobile_no'] = mobile_no;
		paraMap['mobile_code'] = mobile_code;// 访问来源（默认PC）0：pc，2：pad，3：手机
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	/**
	 * 查询资金
	 */
	TradeService.prototype.queryAccoutMoney = function(callBackFunc,moneytype){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300106';
		paraMap['moneytype'] = moneytype;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	
	/**
	 * 查询持仓
	 */
	TradeService.prototype.queryMyStock = function(callBackFunc){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300105';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 委托下单
	 */
	TradeService.prototype.entrust = function(callBackFunc,bsflag,market,secuid,stkcode,price,qty){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300121';
		paraMap['bsflag'] = bsflag;
		paraMap['market'] = market;
		paraMap['secuid'] = secuid;
		paraMap['stkcode'] = stkcode;
		paraMap['price'] = price;
		paraMap['qty'] = qty;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq(true);
		reqParamVo.setIsShowWait(true);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 委托撤单
	 */
	TradeService.prototype.cancelEntrust = function(callBackFunc,ordersno,orderdate){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300123';
		paraMap['ordersno'] = ordersno;
		paraMap['orderdate'] = orderdate;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 当日委托查询
	 */
	TradeService.prototype.queryTodayEntrust = function(callBackFunc, isLastReq){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300108';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setIsLastReq(isLastReq);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 当日成交查询
	 */
	TradeService.prototype.queryTodayTurnover = function(callBackFunc){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300109';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 历史委托查询
	 */
	TradeService.prototype.queryhistoryDelegate = function(callBackFunc,strdate,enddate){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300110';
		paraMap['strdate'] = strdate;
		paraMap['enddate'] = enddate;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 历史成交
	 */
	TradeService.prototype.queryHisDealt = function(callBackFunc,strdate,enddate){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300112';
		paraMap['strdate'] = strdate;
		paraMap['enddate'] = enddate;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 交割单查询
	 */
	TradeService.prototype.queryDeliverySingle = function(callBackFunc,strdate,enddate){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300113';
		paraMap['strdate'] = strdate;
		paraMap['enddate'] = enddate;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	
	/**
	 * 查询银行列表
	 */
	TradeService.prototype.queryBankList = function(callBackFunc){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300124';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 银证转账
	 */
	TradeService.prototype.bankTrans = function(callBackFunc,moneytype,fundpwd,bankcode,bankpwd,banktrantype,tranamt){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300126';
		paraMap['moneytype'] = moneytype;
		paraMap['fundpwd'] = fundpwd;
		paraMap['bankcode'] = bankcode;
		paraMap['bankpwd'] = bankpwd;
		paraMap['banktrantype'] = banktrantype;
		paraMap['tranamt'] = tranamt;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	
	/**
	 * 查询股东代码
	 */
	TradeService.prototype.querySecuid = function(callBackFunc, isLastReq, isShowWait){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300114';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setIsLastReq(isLastReq);
		reqParamVo.setIsShowWait(isShowWait);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 查询银行信息
	 */
	TradeService.prototype.queryBankInfo = function(callBackFunc,bankcode,moneytype,banktrantype,isLastReq){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300125';
		paraMap['bankcode'] = bankcode;
		paraMap['moneytype'] = moneytype;
		paraMap['banktrantype'] = banktrantype;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq(isLastReq);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 银证转帐查询
	 */
	TradeService.prototype.queryBankTransferRecords = function(callBackFunc){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300127';
		paraMap['moneytype'] = '0';
		paraMap['sno']='';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 银行余额查询
	 */
	TradeService.prototype.queryBankBalance = function(callBackFunc,moneytype,fundpwd,bankcode,bankpwd){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300128';
		paraMap['moneytype'] = moneytype;
		paraMap['fundpwd'] = fundpwd;
		paraMap['bankcode'] = bankcode;
		paraMap['bankpwd'] = bankpwd;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	/**
	 * 银行余额查询(及时返回结果)
	 */
	TradeService.prototype.queryAndReturnBankBalance = function(callBackFunc,moneytype,fundpwd,bankcode,bankpwd,isLastReq){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300137';
		paraMap['moneytype'] = moneytype;
		paraMap['fundpwd'] = fundpwd;
		paraMap['bankcode'] = bankcode;
		paraMap['bankpwd'] = bankpwd;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq(isLastReq);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 功能：得到RSA的key
	 * 参数: callBackFunc:回调函数
	 */
	TradeService.prototype.getRsaKey = function(callBackFunc){
		var paraMap = {};
		paraMap['funcNo'] = '1000000';
		paraMap['op_source'] = global.op_source;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
//		reqParamVo.setIsShowWait(false);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 获取实时行情
	 */
	TradeService.prototype.getHqStockList = function(callBackFunc,stocklist,isLastReq,isShowWait){
		var paraMap = {};
		paraMap['funcNo'] = '2000001';
		paraMap['stock_list'] = stocklist;
		paraMap['op_source'] = global.op_source;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq(isLastReq);
		reqParamVo.setIsShowWait(isShowWait);
		this.service.invoke(reqParamVo,callBackFunc,isLastReq,isShowWait);
	};
	
	/**
	 * 当日成交汇总
	 */
	TradeService.prototype.queryTransactionSummary = function(callBackFunc){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300133';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 客户可取资金查询
	 */
	TradeService.prototype.queryDesirableAmount = function(callBackFunc,moneytype){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300134';
		paraMap['moneytype'] = moneytype;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 当日资金流水查询
	 */
	TradeService.prototype.queryDayFundFlow = function(callBackFunc){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300135'; 
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	/**
	 * 历史资金流水（对账）查询
	 */
	TradeService.prototype.queryHisFundFlow = function(callBackFunc,strdate,enddate){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300136';
		paraMap['strdate'] = strdate;
		paraMap['enddate'] = enddate;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 打新：当日新股清单（万得返回）
	 */
	TradeService.prototype.ipoWDNewStockList = function(callBackFunc){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '6000004';
		paraMap['op_source'] = '1';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.mallServer);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 打新：新股详情（万得返回）
	 */
	TradeService.prototype.ipoWDNewStockDetail = function(callBackFunc, stkcode){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '6000004';
		paraMap['stkcode'] = stkcode;
		paraMap['op_source'] = '1';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.mallServer);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 打新：当日新股清单（柜台返回）
	 */
	TradeService.prototype.ipoQryNewStockList = function(callBackFunc, isLastReq){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300300';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setIsLastReq(isLastReq);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 打新：新股客户市值额度查询
	 */
	TradeService.prototype.ipoQryPersonLimit = function(callBackFunc, isLastReq){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300301';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setIsLastReq(isLastReq);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 打新：新股委托业务
	 */
	TradeService.prototype.ipoEntrust = function(callBackFunc, secuid, market, stkcode, price, qty){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300302';
		paraMap['secuid'] = secuid;
		paraMap['market'] = market;
		paraMap['stkcode'] = stkcode;
		paraMap['price'] = price;
		paraMap['qty'] = qty;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 打新：新股配号查询
	 */
	TradeService.prototype.ipoQryNumber = function(callBackFunc, strdate, enddate){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300303';
		paraMap['strdate'] = strdate;
		paraMap['enddate'] = enddate;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 打新：新股中签查询
	 */
	TradeService.prototype.ipoQryAllocation = function(callBackFunc){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300304';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 打新：新股历史中签查询
	 */
	TradeService.prototype.ipoQryHisAllocation = function(callBackFunc, begindate, enddate){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300305';
		paraMap['begindate'] = begindate;
		paraMap['enddate'] = enddate;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 取证券余额及当前最新价等
	 */
	TradeService.prototype.queryBalancePrice = function(callBackFunc, stkcode){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300306';
		paraMap['stkcode'] = stkcode;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 查询当日可撤单委托列表
	 */
	TradeService.prototype.queryCancelableList = function(callBackFunc){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300122';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 修改密码
	 */
	TradeService.prototype.modifyPwd = function(callBackFunc, type, oldpwd, newpwd){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300103';
		paraMap['type'] = type;
		paraMap['oldpwd'] = oldpwd;
		paraMap['newpwd'] = newpwd;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	
	/**
	 * 清除session
	 */
	TradeService.prototype.closeSession = function(){
		var paraMap = {};
		paraMap['funcNo'] = '100222';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo);
	};
	
	/**
	 * 基金收益排行（牛人牛基）
	 * fundType: 基金类型[1001股票型、1002混合型、1003偏债型]
	 * page:页码
	 * ordery：排序字段[retDay日涨跌、ret1m近一月、ret3m近三月、ret6m近六月、retCy今年以来、ret1y近一年、ret3y近三年]
	 * orderType：排序类型[asc顺序、desc倒序]
	 */
	TradeService.prototype.profitList = function(callBackFunc, fundType, page, orderby, orderType){
		var paraMap = this.getCommonNrnjParam();
		var params = {page: page, size: 20, typeIdFirst: fundType};
		if(typeof orderby != 'undefined' && orderby && typeof orderType != 'undefined' && orderType) {
			params.orderby = JSON.stringify([{property: orderby, type: orderType}])
		}
		paraMap['params'] = JSON.stringify(params);
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.nrnjServer+'/fundInfo/find');
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo, callBackFunc);
	};
	
	/**
	 * 牛人榜（牛人牛基）
	 * fundType：擅长类型[1001股票型、1002混合型、1003偏债型]
	 * page:页码
	 */
	TradeService.prototype.managerList = function(callBackFunc, fundType, page){
		var paraMap = this.getCommonNrnjParam();
		var params = {page: page, size: 20, typeId: fundType};
		paraMap['params'] = JSON.stringify(params);
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.nrnjServer+'/fundManager/find');
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo, callBackFunc);
	};
	/**
	 * 基金详情
	 * 历任基金经理列表
	 * code 基金编号 page 页码
	 */
	TradeService.prototype.managersList = function(callBackFunc, code, page){
		var paraMap = this.getCommonNrnjParam();
		var params = {page: page, size: 5, code: code};
		paraMap['params'] = JSON.stringify(params);
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.nrnjServer+'/fundManagerRef/findFm');
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo, callBackFunc);
	}
	/**
	 * 基金经理
	 * 个人信息查询
	 * fmId 经理编号
	 */
	TradeService.prototype.fmdtInfo = function(callBackFunc, fmId){
		var paraMap = this.getCommonNrnjParam();
		var params = {fmId : fmId};
		paraMap['params'] = JSON.stringify(params);
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.nrnjServer+'/fundManager/dtlInfo');
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo, callBackFunc);
	}
	/**
	 * 基金经理
	 * 牛人详情
	 */
	TradeService.prototype.fmdtl = function(callBackFunc, fmId, typeId, userId){
		var paraMap = this.getCommonNrnjParam();
		var params = {fmId : fmId, typeId : typeId, userId : userId, retType:'40'};
		paraMap['params'] = JSON.stringify(params);
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.nrnjServer+'/fundManager/dtl');
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo, callBackFunc);
	}
	/**
	 * 基金经理
	 * 收益指数走势图
	 */
	TradeService.prototype.funNav = function(callBackFunc, fmId, typeId, retType){
		var paraMap = this.getCommonNrnjParam();
		var params = {fmId : fmId, typeId : typeId, retType : retType};
		paraMap['params'] = JSON.stringify(params);
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.nrnjServer+'/fundManager/nav');
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo, callBackFunc);
	}
	TradeService.prototype.funtrend = function(callBackFunc, fmId, typeId, retType){
		var paraMap = this.getCommonNrnjParam();
		var params = {fmId : fmId, typeId : typeId, retType : retType};
		paraMap['params'] = JSON.stringify(params);
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.nrnjServer+'/fundManagerRef/trend');
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo, callBackFunc);
	}
	/**
	 * 基金详情
	 * code 基金编号 userId 用户代码
	 */
	TradeService.prototype.fundInfoDtl = function(callBackFunc,code,userId){
		var paraMap = this.getCommonNrnjParam();
		var params = {code:code,userId:userId,appVersion:'2.0.0'};
		paraMap['params'] = JSON.stringify(params);
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.nrnjServer+'/fundInfo/dtl');
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo, callBackFunc);
	}
	/**
	 * 基金详情
	 * 走势图
	 * code 基金编号 type 收益类型 [10近1月、20近3月、30近6月、40近1年、50今年来、60成立来]
	 */
	TradeService.prototype.funInfoTrend = function(callBackFunc,code,type){
		var paraMap = this.getCommonNrnjParam();
		var params = {code:code,retType:type};
		paraMap['params'] = JSON.stringify(params);
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.nrnjServer+'/fundInfo/trend');
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo, callBackFunc);
	}
	/**
	 * 获取基金净值
	 * code 基金代码 page 页号 size 每页显示条数
	 */
	TradeService.prototype.getfunds = function(callBackFunc, code, page, size){
		var paraMap = this.getCommonNrnjParam();
		var params = {page: page, size: size, code: code};
		paraMap['params'] = JSON.stringify(params);
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.nrnjServer+'/fundNav/find');
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo, callBackFunc);
	}
	
	/**
	 * 获取登录验证码
	 */
	TradeService.prototype.getLoginCode = function(callBackFunc){
		var paraMap = {};
		paraMap['funcNo'] = '1000006';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	/**
	 * 查询客户承受能力匹配信息
	 * custid 客户id tacode 基金公司 ofcode 基金代码 orgid 机构代码
	 */
	TradeService.prototype.getcustirisk = function(callBackFunc,custid,tacode,ofcode,orgid){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '1000008';
		paraMap['custid'] = custid;
		paraMap['tacode'] = tacode;
		paraMap['ofcode'] = ofcode;
		paraMap['orgid'] = orgid;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	};
	/**
	 * 基金持仓详细信息
	 */
	TradeService.prototype.fundPositionDtl = function(callBackFunc,code){
		var paraMap = this.getCommonNrnjParam();
		var params = {code: code};
		paraMap['params'] = JSON.stringify(params);
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.nrnjServer+'/fundPosition/dtl');
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo, callBackFunc);
	}
	/**
	 * 客户风险调查是否已过期
	 * custid 客户编号 orgid 机构编码
	 * 
	 */
	TradeService.prototype.judgeRisk = function(callBackFunc,custid,orgid){
		var paraMap = {};
		paraMap['funcNo'] = '1000024';
		paraMap['custid'] = custid;
		paraMap['orgid'] = orgid;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	}
	/**
	 * 基金帐户信息查询
	 */
	TradeService.prototype.fundUserInfo = function(callBackFunc,fundid,tacode,tacc,transacc,qryflag,count,poststr){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300158';
		paraMap['fundid'] = fundid;
		paraMap['tacode'] = tacode;
		paraMap['tacc'] = tacc;
		paraMap['transacc'] = transacc;
		paraMap['qryflag'] = qryflag;
		paraMap['count'] = count;
		paraMap['poststr'] = poststr;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	}
	/**
	 * 查看风险测评是否过期
	 */
	TradeService.prototype.riskIsOverdue = function(callBackFunc,custid){
		var paraMap = {};
		paraMap['funcNo'] = '2006000';
		paraMap['cust_id'] = custid;
		paraMap['survey_sn'] = '1';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.ecywServer);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	}
	/**
	 * 基金行情信息查询
	 */
	TradeService.prototype.fundMarketInfo = function(callBackFunc,ofcode){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300166';
		paraMap['tacode'] = '0';
		paraMap['ofcode'] = ofcode;
		paraMap['protype'] = '';
		paraMap['qryflag'] = '1';
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	}
	/**
	 * 基金费率
	 */
	TradeService.prototype.fundRateFind = function(callBackFunc,code){
		var paraMap = this.getCommonNrnjParam();
		var params = {code: code};
		paraMap['params'] = JSON.stringify(params);
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.nrnjServer+'/fundRate/find');
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo, callBackFunc);
	}
	/**
	 * 基金认购/申购
	 */
	TradeService.prototype.subscription = function(callBackFunc,custid,fundid,tacode,ofcode,orderamt){
		var paraMap = this.getCommonTradeParam();
		paraMap['funcNo'] = '300159';
		paraMap['custid'] = custid;
		paraMap['fundid'] = fundid;
		paraMap['tacode'] = tacode;
		paraMap['ofcode'] = ofcode;
		paraMap['shareclass'] = '0';
		paraMap['trdid'] = '240022';//240022:申购;240020:认购
		paraMap['orderamt'] = orderamt;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.server);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	}
	/**
	 * 获取风险评测试题
	 */
	TradeService.prototype.getRiskQuestions = function(callBackFunc,survey_sn){
		var paraMap = {};
		paraMap['funcNo'] = '2004001';
		paraMap['survey_sn'] = survey_sn;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.ecywServer);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	}
	/**
	 * 获取客户信息
	 */
	TradeService.prototype.clientInfo = function(callBackFunc,custid){
		var paraMap = {};
		paraMap['funcNo'] = '2004006';
		paraMap['user_code'] = custid;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.ecywServer);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	}
	/**
	 * 风险测评答案提交
	 */
	TradeService.prototype.subRiskQuest = function(callBackFunc,custid,survey_sn,s_col,s_cells){
		var paraMap = {};
		paraMap['funcNo'] = '2004002';
		paraMap['user_code'] = custid;
		paraMap['survey_sn'] = survey_sn;
		paraMap['survey_col'] = s_col;
		paraMap['survey_cells'] = s_cells;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.ecywServer);
		reqParamVo.setReqParam(paraMap);
		this.service.invoke(reqParamVo,callBackFunc);
	}
	/**
	 * 释放操作
	 */
	TradeService.prototype.destroy = function(){
		this.service.destroy();
	};
	
    /**
	 * 实例化对象
	 */
	function getInstance(){
		return new TradeService();
	}
	
	var tradeService = {
		'getInstance' : getInstance
	};
	
	// 暴露对外的接口
	module.exports = tradeService;
});