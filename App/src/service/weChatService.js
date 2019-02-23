import config from '@/lib/config/config'
import commonUtil from '@/service/util/commonUtil'
const controller = config.wxServer + '/zjzx-wx-work/user';
const service = {};

const openid = commonUtil.getParam("openid");
const access_token = commonUtil.getParam("access_token");

service.getSysUser = function (call) {
  let params = {openid, access_token};
  if(call){
    commonUtil.ajax(controller+'/getSysUser', params, call);
    return;
  }
  let wxInfo = commonUtil.ajaxAsync(controller + '/getSysUser', params);
  return wxInfo;
};

export default service;
