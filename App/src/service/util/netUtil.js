var sysUtil = {};

/**
 * 获取系统信息
 */
// {"name":"Android","version":"8.0.0","language":"zh_CN","vendor":"Google","network":"WiFi网络"}
sysUtil.getNetInfo = function(){
		    
	    var resMap = {};
	    //系统名称
	    resMap.name = plus.os.name;
	    //版本
	    resMap.version = plus.os.version;
	    //语言
	    resMap.language = plus.os.language;
	    //厂商
	    resMap.vendor = plus.os.vendor;
	    var types = {};
	    types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
	    types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
	    types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
	    types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
	    types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
	    types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
	    types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
	    resMap.network = types[plus.networkinfo.getCurrentType()];
	    return resMap;
				 
}
export default sysUtil
