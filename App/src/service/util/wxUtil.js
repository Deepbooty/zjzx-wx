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
    config.debug = true;
    config.jsApiList = apiArr;
    return config;
  },


  // 分享
  initShare: function (url,obj) {
    let config = wxUtil.getWxconfig(url,
      [
        "onMenuShareTimeline",  //分享到朋友圈
        "onMenuShareAppMessage",  //分享给朋友
        "onMenuShareQQ",        //分享到QQ
        "onMenuShareWeibo",     //分享到腾讯微博
        "onMenuShareQZone",     //分享到QQ空间
      ]);

    wx.config(config);
    wx.ready(function () {
      // 分享到朋友圈
      wx.onMenuShareTimeline({
        title: obj.title,   //分享标题
        link: obj.link,     //分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: obj.imgUrl, //分享图标
        success: function () {
          alert('分享成功！');
        },
      });

      //分享给朋友
      wx.onMenuShareAppMessage({
        title: obj.title,   //分享标题
        desc: obj.desc,     //分享描述
        link: obj.link,     //分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: obj.imgUrl, //分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success:function () {
          alert('分享成功！');           // 用户点击了分享后执行的回调函数
        }
      });

      //分享到QQ
      wx.onMenuShareQQ({
        title: obj.title,   //分享标题
        desc: obj.desc,     //分享描述
        link: obj.link,     //分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: obj.imgUrl, //分享图标
        success: function () {
          alert('分享成功！');           // 用户点击了分享后执行的回调函数

        },
        cancel: function () {
          alert('分享失败！');           // 用户点击了分享后执行的回调函数
        }
      });

      //分享到腾讯微博
      wx.onMenuShareWeibo({
        title: obj.title,   //分享标题
        desc: obj.desc,     //分享描述
        link: obj.link,     //分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: obj.imgUrl, //分享图标
        success: function () {
          alert('分享成功！');           // 用户点击了分享后执行的回调函数

        },
        cancel: function () {
          alert('分享失败！');           // 用户点击了分享后执行的回调函数

        }
      });

      //分享到QQ空间
      wx.onMenuShareQZone({
        title: obj.title,   //分享标题
        desc: obj.desc,     //分享描述
        link: obj.link,     //分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: obj.imgUrl, //分享图标
        success: function () {
          alert('分享成功！');           // 用户点击了分享后执行的回调函数
        },
        cancel: function () {
          alert('分享失败！');
        }
      });
    });
  },

  getShareUrl: function (url) {
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe0b93ff5c5898740&redirect_uri=http%3a%2f%2fwx.zjzx.xyz%2fzjzx-wx%2fwx%2flogin&response_type=code&scope=snsapi_userinfo&state=${url}#wechat_redirect`;
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
