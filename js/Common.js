// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

var db = new Dexie("ReportDB");

db.version(1).stores({
	report: "++id, *code1, code2, code3, code4, colour, jobNo, lb, zg, proNum, carNo, proSta, proCount, remark, createDate, srialNum",
	user: "++id,userid,name,dptid,dpt",
	wkp: "++id,wkpid,txt,dptid,dpt",
	mcn: "++id,mcnid,txt"
});
db.open();
$.ajaxSetup({
	username: "zhangyaof",
	password: "zzz4602219"
});

String.prototype.format = function() {
	if(arguments.length == 0) return this;
	for(var s = this, i = 0; i < arguments.length; i++)
		s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
	return s;
};

var refreshAll = function() {
//	var url = 'http://192.168.50.66/api/BaseInfo';
		var url = 'http://www.winnitex.com/net/PlantJobOrderScanAPI/api/BaseInfo';
	//					var url = "	http://localhost:55860/api/BaseInfo;

	$.getJSON(url, function(data) {
		db.user.clear();
		db.user.bulkAdd(data.ListUsers);
		db.wkp.clear();
		db.wkp.bulkAdd(data.ListWkp);
		db.mcn.clear();
		db.mcn.bulkAdd(data.ListMcn);
	}).fail(function(jqXHR, textStatus, errorThrown) {
		myApp.alert("数据更新失败，请链接Winnitex再重试!" + jqXHR.responseText || textStatus);
	});

}

var minute = 1000 * 60;
var hour = minute * 60;
var day = hour * 24;
var month = day * 30;

function getDateDiff(dateTimeStamp) {
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if(diffValue < 0) {
		return "";
		//若日期不符则弹出窗口告之
		//alert("结束日期不能小于开始日期！");
	}
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	if(monthC >= 1) {
		result = parseInt(monthC) + "个月前";
	} else if(weekC >= 1) {
		result = parseInt(weekC) + "周前";
	} else if(dayC >= 1) {
		result = parseInt(dayC) + "天前";
	} else if(hourC >= 1) {
		result = parseInt(hourC) + "个小时前";
	} else if(minC >= 1) {
		result = parseInt(minC) + "分钟前";
	} else
		result = "刚刚提交";
	return result;
}