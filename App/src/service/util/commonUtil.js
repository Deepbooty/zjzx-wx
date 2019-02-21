import netUitl from "./netUtil"
const util ={
	// test: controller+'/test'
}

util.ajaxAsync = function(url,params){
	let res = {};
	/*let res = {}
		net = {};
	try{
		net = netUtil.getNetInfo();					
	}catch(e){

	}
	if (net.network == "未连接网络") {
		res.status = "notnet";
		res.mes = "网络已断开"
		return res;
	}*/

	$.ajax({
		url: url,
		type: 'post',
		dataType: 'json',
		data: params,
		async:false,
		success:function(data){
			res = data;
		}
	})
	
	return res;

}
util.ajax = function(url,params,call){
	// let res = {};
	/*let res = {},
		net = {};
	try{
		net = netUtil.getNetInfo();					
	}catch(e){

	}
	if (net.network == "未连接网络") {
		res.status = "notnet";
		res.mes = "网络已断开"
		if (call) {
			call(res);		
		}
		return;
	}*/
	$.post(url,params,function(data){
		if (call) {
			call(data);		
		}
	},"json");


};
// 获取html中url参数
util.getParam = function (paramName) {
  let paramValue = "";
  let isFound = !1;
  if (window.location.search.indexOf("?") == 0 && window.location.search.indexOf("=") > 1) {
    let arrSource = unescape(window.location.search).substring(1, window.location.search.length).split("&"), i = 0;
    while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0),i++;
  }
  return paramValue == "" && (paramValue = null), paramValue;
};
export default util


