let wxUtil ={
  ajaxSync:function (url, params) {
    let jsondata = null;
    $.ajax({
      url: url,
      type: 'post',
      async: false,
      data: params,
      success: function (data) {
        jsondata = data;
      }
    });
    return jsondata;
  },

  // 获取config
  getWxconfig:function (url, apiArr) {
    let config = wxUtil.ajaxSync("http://wx.zjzx.xyz/zjzx-wx/wx/getJsSDKConfig", {
      url: url
    });
    config.jsApiList = apiArr;
    return config;
  },

  // 微信扫一扫
/*
  initScanCode: function (url, call) {
    let config = wxUtil.getWxconfig(url, ["scanQRCode"]);
    wx.config(config);
    wx.ready(function () {
      wx.scanQRCode({
        needResult: 1,
        scanType: ["qrCode","barCode"],
        success:function (res) {
          call(res);
        }
      });
    });
  },
*/

  // 分享功能
  initShareFriend: function (url,obj,call) {
    let config = wxUtil.getWxconfig(url,["updateAppMessageShareData"]);
    wx.config(config);
    wx.ready(function () {
      wx.updateAppMessageShareData({
        title: obj.title,   //分享标题
        desc: obj.desc,     //分享描述
        link: obj.link,     //分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: obj.imgUrl, //分享图标
        success:function (res) {
          call(res);    //回调，分享成功
        }
      });
    })
  }

};

/*
$(function () {
  let url = location.href;
  if(location.hash.length){
    url = url.substr(0, url.indexOf(location.hash));
  }
  wxUtil.initScanCode(url, function (res) {
    console.log(res);
  });
  wxUtil.initShareFriend(url,function (res) {
    console.log(res)
  })
});*/
export default wxUtil;
