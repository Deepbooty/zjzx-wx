<template>
  <div id="app">
    <transition :name="$store.state.transitionName">
      <keep-alive>
        <router-view class="router-view-app"></router-view>
      </keep-alive>
    </transition>
    <lg-preview></lg-preview>
    <!-- 举报框 -->
    <div v-transfer-dom style="z-index: 988;">
      <popup v-model="ifReport" style="z-index: 999;">
        <div class="report-wrap">
          <div class="report-header">
            <h2>举报(举报热线：400-1106768)</h2>
          </div>
          <group>
            <radio :selected-label-style="{color: '#FF9900'}" fill-mode :options="reportList" v-model="reportReasion">
            </radio>
          </group>
          <div class="report-footer" @click="handleDownLoad">
            确定
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import netUtil from "@/service/util/netUtil"
import versionService from "@/service/versionService"
import weChatService from '@/service/weChatService'
export default {
  name: 'App',
  data() {
  	return {
  		transitionName: '',
      mainRoute:["member","questionAnswer","video"],
      first:"",
      report:{
        id:0,
        userName:""
      },
      //举报数组
      reportList:Object.freeze(['淫秽色情','违法信息','营销广告','恶意攻击谩骂','拉黑该用户并屏蔽其内容'
      ]),
      reportReasion:"",
      ifReport:false,
  	}
  },
  created(){
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    window.addEventListener(resizeEvt, subRecalc, false);
    document.addEventListener('DOMContentLoaded', subRecalc, false);
    function subRecalc(){
      var docEl = document.documentElement,
      clientWidth = Math.min( window.innerWidth , docEl.clientWidth );
      docEl.style.fontSize = ( clientWidth / 750 * 100)+"px";
    }
  },
  mounted(){
    this.$nextTick(()=>{
      let data = weChatService.getSysUser();
      if(data && data.status == "success"){
        let wx_user = data.wx_user;
        console.log(data)
        let wxObj = {
          openid: wx_user.openid,
          nickname: wx_user.nickname,
          headimgurl:wx_user.headimgurl,
          country: wx_user.country,
          province:wx_user.province,
          city:wx_user.city,
          sex:wx_user.sex,
        };
        let app_user = data.app_user;
        let appObj = {
          id: app_user.id,
          imageurl: app_user.imageurl,
          integration: app_user.integration,
          username: app_user.username,

        };
        Object.assign(localStorage,wxObj);
        Object.assign(localStorage,appObj);
        console.log(localStorage)
      }
    });
    try{
      let _this = this;
      document.addEventListener('plusready', function() {
        // 判断是否连网
        _this.$store.state.isNetwork = netUtil.getNetInfo().network === "未连接网络";
        //监测物理返回键
        plus.key.addEventListener('backbutton', function() {
          if (_this.mainRoute.includes(_this.$route.name)) {
            _this.$Tool.goPage({name:"home",replace:true,});
          }else if(_this.$route.name == "home") {
            //首次按键，提示‘再按一次退出应用’
            if (!_this.first) {
                _this.first = new Date().getTime();
                _this.$vux.toast.show({
                  type:"text",
                  time:1000,                
                  position:"bottom",
                  text: '再按一次退出直击真相',
                  width:"auto",
                });
                setTimeout(() => {
                    _this.first = null;
                }, 1000);
            } else if (new Date().getTime() - _this.first < 1500) {
                plus.runtime.quit();
            }
          }else{
            _this.$Tool.goBack();
          }
        },false);

        //版本更新检测
        function appUpdate(){
          plus.runtime.getProperty(plus.runtime.appid, function (info) {
            let version = info.version;
            _this.$store.dispatch("setCurrentVersion", version);
            versionService.compareVersion(version,(data)=>{
              if (data && data.status == "success") {
                if (data.result.isnew == 0) {
                  _this.$store.dispatch("setNewVersion",1);
                  _this.$vux.confirm.show({
                    title:"升级提示",
                    content:`发现新版本${data.result.versionnum}`,
                    confirmText:"立即升级",
                    cancelText:"放弃更新",
                    onConfirm () {
                      setTimeout(()=>{
                        _this.$vux.toast.show({
                          type:"text",
                          time:2000,
                          position:"middle",
                          text:"正在后台为您下载...",
                          width:"auto",
                        },1000);                             
                      })
                      let dtask = plus.downloader.createDownload(data.result.newlink, {
                      }, function (down, status) {
                          if (status == 200) {
                              let path = down.filename;//下载apk
                              plus.runtime.install(path); // 自动安装apk文件
                              // _this.$store.dispatch("setNewVersion",0);
                          } else {
                              _this.$vux.alert.show({
                                title:'版本更新失败' + status,
                              });
                          }
                      });
                      dtask.start();
                    }
                  });
                }                  
              }
            });          
         });          
        }
        // 判断系统，非Android不执行检测更新
        if (navigator.userAgent.indexOf('Android') > -1) {         
          appUpdate();
        }
      },false);  
    }catch(e){

    }
  },
  methods:{
    handleDownLoad(){
      this.ifReport = false;
      this.reportReasion = "";

      this.$router.push({ path:'/download'})
    },
  },
  watch: {
  	//监听路由
  	$route(to,from) {
  		// 前进后退转场动画
      if (this.$router['isBack'] == undefined) {
        this.$router['isBack'] = false;return;
      }
      // debugger
      this.$store.state.transitionName = this.$router['isBack'] ? 'slide-right' : 'slide-left';
      this.$router['isBack'] = false;
    },
    "$store.state.reportArticle"(){
      this.$store.state.reportArticle && (this.ifReport = true)
    },
    ifReport(){
      !this.ifReport && (this.$store.state.reportArticle = null);
    }
  },
}
</script>
<style>
  html,body{
    background-color: #f4f5f6;
    width: 100%;
    height: 100%;
  }
  html {overflow-x: hidden;height: 100%;}
  body{
    font-size: .28em;
    line-height: 1;
    -webkit-overflow-scrolling:touch;
  }
  #app,.router-view-app {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .router-view-app {
    position: absolute;
    background: #f4f5f6;
    transition: transform .3s cubic-bezier(.55,0,.1,1);
    /*注：动画时长与其他组件延迟加载时长（450）有关联，需小于，不可随意更改*/
  }
  .slide-left-enter, .slide-right-leave-active {
    transform: translate(100%, 0);
    z-index: 9;
  }

  /*添加vux toast 行高*/
  .weui-toast_text .weui-toast__content{
    line-height: 22px;
  }
  /*video paly UI设置*/
  .vjs-custom-skin > .video-js .vjs-big-play-button{
    width: 1rem;
    height: 1rem !important;
    font-size: .6rem !important;
    border-radius: 50%;
    /*margin: 0 !important;*/
    transform: translate(-50%,-50%);
    line-height: .9rem !important;
    border: 2px solid #eee;
  }
  /*去除音量按钮*/
  .video-js .vjs-volume-panel{
    display: none !important;
  }
  /*视频高度*/
  .video-js{
    height: 4.2rem;
  }
</style>
<style lang="less" scoped>
  .report-wrap{
    padding-top: .2rem;
    background-color: #f8f8f8;
    .report-header{
      text-align: center;
      line-height: .75rem;
      h2{
        font-weight: 500;
        font-size: .32rem;
        letter-spacing: .02rem;
      }
    }
    .report-footer{
      line-height: .8rem;
      font-size: .32rem;
      text-align: center;
      background-color: #fff;
    }
  }
</style>
