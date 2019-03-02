import config from '@/lib/config/config'
import commonUtil from '@/service/util/commonUtil'
const controller =config.successServer+'/zjzx-article/wdcollect';
const service ={};
const token = localStorage.getItem('token');
const userid = localStorage.getItem('id');
// 收藏问题
service.wdCollect = function (wdid) {
  let params = {userid, token, wdid};
  let resData = commonUtil.ajaxAsync(controller+'/wdCollect',params);
  return resData;
};

//获取用户收藏问题的数量
service.getUserWdCollectCount = function (call) {
  let params = {userid};
  commonUtil.ajax(controller+'/getUserWdCollectCount',params,call);
};

//获取收藏问题的数量
service.getWdCollectCount = function (wdid,call) {
  let params = {wdid};
  commonUtil.ajax(controller+'/getWdCollectCount',params,call);
};

//删除收藏问题
service.deleteWdCollect = function(ids){
  let params = {token, userid, "ids[]":ids};
  let resData = commonUtil.ajaxAsync(controller+'/deleteWdCollect',params);
  return resData;
};

//判断用户是否收藏问答
service.testWdCollect = function(wdid,call){
  let params = {userid, wdid};
  commonUtil.ajax(controller+'/testWdCollect',params,call);
};

export default service;
