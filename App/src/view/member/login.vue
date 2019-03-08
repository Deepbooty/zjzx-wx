<template>
  <div class="login-wrap">
    <div class="login-header">
      <div class="login-img">
        <img src="@/assets/images/logo-icon.png">
      </div>
      <span>此刻开始直击真相</span>
    </div>
    <div class="login-body">
      <!-- <h3>手机号登录注册</h3>-->
      <div class="login-form">
        <div class="login-item" :class="{loginActive1:tip.active1}">
          <i class="iconfont icon-wode"></i>
          <input
            type="tel"
            class="mobileInput"
            @input="handeleMobile"
            @keydown="show($event)"
            @focus="handleFocus1"
            ref="mobileFocus"
            v-model="mobileDesc"
            maxlength="11"
            placeholder="请输入手机号">
          <span class="login-close" v-show="tip.close1" @click="handleClose(1)">x</span>
          <span class="login-code" @click="handlegetCodeDesc" :class="{codeColor:tip.codeColor}">{{tip.getCodeDesc}}</span>
        </div>
        <span class="login-tip">{{tip.mobileTip}}</span>
        <div class="login-item" :class="{loginActive1:tip.active2}">
          <i class="iconfont icon-yanzhengma"></i>
          <input type="text"
                 class="codeInput"
                 @input="handeleCode"
                 v-model="codeDesc"
                 maxlength="4"
                 ref="codeFocus"
                 placeholder="请输入验证码">
          <span class="login-close login-code-close" v-show="tip.close2" @click="handleClose(2)">x</span>
        </div>
        <span class="login-tip">{{tip.codeTip}}</span>
        <button type="button" class="login-btn" @click="handleLogin" :class="{isOpacity: isOpacity}" :disabled="disabled">探寻真相</button>
      </div>

      <div class="login-desc">
        <check-icon :value.sync="loginStop"></check-icon>
        我已阅读并同意
        <span @click="$Tool.goPage({name:'agreement',query:{title:'用户协议'}})">"用户协议"</span>和
        <span @click="$Tool.goPage({name:'privacy',query:{title:'隐私政策'}})">"隐私政策"</span>
      </div>
    </div>
    <div class="login-footer" v-show="footerShow">
      <div class="login-line">一键登录</div>
      <div class="login-way">
        <ul class="login-way-list">
          <li class="login-icon-item" @click="authLogin(2)"><i class="iconfont icon-qq"></i></li>
          <li class="login-icon-item" @click="authLogin(1)"><i class="iconfont icon-weixin1"></i></li>
          <li class="login-icon-item" @click="authLogin(3)"><i class="iconfont icon-weibo"></i></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import config from '@/lib/config/config'
  import authUtil from '@/service/util/authUtil'
  import userService from '@/service/userService'
  export default{
    data(){
      return{
        docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
        showHeight: document.documentElement.clientHeight,  //实时屏幕高度
        footerShow:true,  //显示或者隐藏footer
        disabled:true,
        tip:{
          mobileTip:'',
          codeTip:'',
          getCodeDesc:'获取验证码',
          active1:false,
          active2:false,
          close1:false,
          close2:false,
          codeColor:false,
          codeTimer:null
        },
        mobileDesc:'',
        codeDesc:'',
        loginStop:false
      }
    },
    mounted(){
      window.onresize = ()=>{
        return(()=>{
          this.showHeight = document.body.clientHeight;
        })()
      }
      try{
        authUtil.init();
      }catch(err){

      }
    },
    watch:{
      showHeight(){
        if(this.docmHeight > this.showHeight){
          this.footerShow=false;
        }else{
          this.footerShow=true;
        }
      }
    },
    computed:{
      // 检测手机号是否错误
      mobileErr(){
        // return !this.$Tool.isPhoneNumber(this.mobileDesc.replace(/\s/g,""));
        return !this.$Tool.isPhoneNumber(this.mobileDesc);
      },
      // 判断用户名和验证码格式是否正确，再决定登录按钮是否亮起
      isOpacity(){
        if(!this.mobileDesc) return;

        if(this.mobileDesc.length != 11 || this.codeDesc.length < 4) {
          this.disabled = true;
          return false;
        }else {
          this.disabled = false;
          return true;
        }

      },
    },
    methods:{
      show(ev){
        if(ev.keyCode == 8) {
        }
      },

      //用户名输入事件
      handeleMobile(){
        // this.mobileDesc = this.$Tool.mobileInput(this.mobileDesc);
        if(this.mobileDesc) {
          this.tip.close1 = true;
          this.tip.active1 = false;
          this.tip.mobileTip = "";
        }else{
          this.tip.close1 = false;
        }
      },

      //验证码输入事件
      handeleCode(){
        this.codeDesc = this.codeDesc.replace(/[^0-9]/g,'');
        if(this.codeDesc) {
          this.tip.close2 = true;
        }else{
          this.tip.close2 = false;
        }
      },

      // 用户名input获取焦点事件
      handleFocus1(){
        if(this.mobileDesc.length > 0){
          this.tip.close1 = true;
        }
      },

      //取消文本内容close
      handleClose(val){
        if(val == 1){
          this.$refs.mobileFocus.focus();
          this.mobileDesc = "";
          this.tip.close1 = false;
          this.disabled = true;
        }else{
          this.$refs.codeFocus.focus();
          this.codeDesc = "";
          this.tip.close2 = false;
          this.disabled = true;
        }
      },

      // 获取验证码
      handlegetCodeDesc(){
        this.$refs.mobileFocus.focus();
        if(this.tip.codeTimer) return;
        if(!this.mobileDesc) {
          this.tip.mobileTip = "手机号有误";
          this.tip.active1 = true;
          return;
        }else {
          this.tip.mobileTip = "";
        }
        if(this.mobileErr){
          this.tip.mobileTip = "手机号有误";
          this.tip.active1 = true;
          this.mobileDesc = "";
          return;
        }
        this.$vux.loading.show({text: 'Loading'});
        userService.getCode(this.$data.mobileDesc,(data)=>{
          this.$refs.codeFocus.focus();
          this.tip.codeColor = true;
          if(data && data.status == "success") {
            this.$vux.loading.hide();
            this.$vux.toast.show({
              text:'发送成功'
            })
            this.tip.getCodeDesc = "60秒后重发";
            let i =60;
            this.tip.codeTimer = setInterval(()=>{
              if(i>0) {
                i--;
                this.tip.getCodeDesc = i + '秒后重发';
                this.tip.close1 = false;
              }else {
                clearInterval(this.tip.codeTimer);
                this.tip.codeTimer = null;
                this.tip.getCodeDesc = "获取验证码";
                this.tip.codeColor = false;
              }
            },1000);
          }
          else if(data && data.status == "error") {
            this.$vux.loading.hide();
            this.tip.mobileTip = data.result.tip;
            this.tip.active1 = true;
            this.mobileDesc = "";
            this.tip.close1 = false;
          }
        });

      },
      //登录
      handleLogin(){
        if(this.isOpacity == true) {
          if(this.loginStop == false){
            this.$vux.toast.show({
              type:"cancel",
              width:'60%',
              text:'尚未同意"用户协议"和"隐私条款"'
            });
            return;
          }
          else{
            this.$vux.loading.show({text: '登录中...',});
            userService.loginByMobile(this.$data.mobileDesc,this.$data.codeDesc,(data)=> {
              if(data && data.status == "error") {
                this.$vux.alert.show({
                  content:data.result.tip
                });
                this.$vux.loading.hide();
                return;
              }
              let url =  this.$route.query.returnpage;
              let name = this.$route.query.name;
              let query = this.$route.query.query;
              let call = this.$route.query.call;
              if(!url){
                this.userInfoStore(data);
                return;
              }else{
                this.userInfoPage(data);
                this.$Tool.goPage({name:name,path:url,query:query});
                if(call){
                  call();
                }

              }
            });
            // this.mobileDesc = "";
            this.codeDesc = "";
          }

        }
      },
      /**
       * 第三方登录
       * @param  {[type]} type [description]
       */
      authLogin(type){
        const _this = this;
        switch (type){
          case 1://微信登录
            authUtil.loginByWx(function(resMap){
              if(resMap.status === "success"){
                _this.$vux.loading.show({text: '登录中...',})
                let params = resMap.result.wx_user;
                /*{
                                "sex":"男",
                                "wx_openid":"oRrdQt6Rx5HoGnbKAgG_Wpl0zK44",
                                "wx_nikname":"董春林",
                                "wx_image":"http://thirdwx.qlogo.cn/mmopen/vi_32/KRO0TRAmL5XvPXia9icPstUkNKMlHSYOdhiahX5UBbNuibOhZGcxZcsRxmQtAAqFX2nLL5cwyc4fkLVJnKibiaN1qzJg/132",
                                "wx_unionid":"oU5YytwqdJBWqmL6dNXsjsYAS_MM"
                            }*/
                userService.loginByWx(params,_this.userInfoStore)
              }

            });
            break;
          case 2://QQ登录
            authUtil.loginByQQ(function(resMap){
              if(resMap.status === "success"){
                _this.$vux.loading.show({text: '登录中...',})
                let params = resMap.result.qq_user;
                userService.loginByQQ(params,_this.userInfoStore)
              } else {
                _this.$vux.alert.show({
                  content: '登录授权失败'
                })
              }
              // console.log("resMap.result" + JSON.stringify(resMap.result));
              /*{
                  "qq_user":{
                      "qq_openid":"F6DC81D7DEA4AA7AC94A2C6E57F96C09",
                      "qq_nikname":"被博士",
                      "qq_image":"http://qzapp.qlogo.cn/qzapp/1104455702/F6DC81D7DEA4AA7AC94A2C6E57F96C09/30",
                      "sex":"男"
                  }
              }*/

            })
            break;
          case 3://新浪登录
            authUtil.loginByXl(function(resMap){
              // console.log(JSON.stringify(resMap.result));
              // {"xl_user":{"sex":"男","xl_nikname":"用户6311798622","xl_image":"http://tvax3.sinaimg.cn/default/images/default_avatar_male_50.gif"}}
              if(resMap.status === "success"){
                _this.$vux.loading.show({text: '登录中...',})
                let params = resMap.result.xl_user;
                userService.loginByXl(params,_this.userInfoStore)
              }

            })
            break;
          default:
            console.log("授权出错")
        }
      },
      /**
       * login callback 存储登录用户信息
       * @param  {[Object]} data [服务器返回的用户信息]
       * {
				"result":{
					"token":"f24235e463ee4d80a40e0effd3179d94",
					"user":{
						"birthday":null,
						"sex":null,
						"updatetime":null,
						"truename":null,
						"qq_image":"http://qzapp.qlogo.cn/qzapp/1104455702/F6DC81D7DEA4AA7AC94A2C6E57F96C09/30",
						"xl_nikname":null,"registertime":null,
						"wx_image":null,
						"introduce":null,
						"city":null,"id":30,
						"username":"被博士",
						"area":null,
						"province":null,
						"imageurl":"http://qzapp.qlogo.cn/qzapp/1104455702/F6DC81D7DEA4AA7AC94A2C6E57F96C09/30",
						"xl_image":null,
						"wx_nikname":null,
						"qq_openid":"F6DC81D7DEA4AA7AC94A2C6E57F96C09",
						"qq_nikname":"被博士",
						"xl_openid":null,
						"logid":84,
						"islock":0,
						"invitecode":"ec5s8bawdm",
						"wx_unionid":null,
						"wx_openid":null,
						"mobile":null
					}
				},
				"status":"success"
			}
       */
      /**
       * login callback 存储登录用户信息
       * @param  {[Object]} data [服务器返回的登录结果]
       */

      userInfoPage(data){
        if(data && data.status === "success") {
          let user = data.result.user,
            obj = {
              token:data.result.token,
              id:user.id,
              logid:user.logid,
              userImg:this.$Tool.headerImgFilter(user.imageurl),
              userName:user.username,
              userMobile:user.mobile,
              inviteCode:user.invitecode
            };
          Object.assign(localStorage,obj);
          location.reload();
        }
        else if(data && data.status == "error") {
          this.tip.codeTip = data.result.tip;
          this.tip.active2 = true;
          this.tip.close2 = false;
          this.codeDesc = "";
          setTimeout(()=>{
            this.$vux.alert.show({
              content: '系统繁忙，请稍后重试！',
            });
          },0)
        }
        this.$vux.loading.hide();
      },
      /**
       * login callback 存储登录用户信息
       * @param  {[Object]} data [服务器返回的登录结果]
       */

      userInfoStore(data){
        if(data && data.status === "success") {
          let user = data.result.user,
            obj = {
              token:data.result.token,
              id:user.id,
              logid:user.logid,
              userImg:this.$Tool.headerImgFilter(user.imageurl),
              userName:user.username,
              userMobile:user.mobile,
              inviteCode:user.invitecode
            };
          Object.assign(localStorage,obj)
          // debugger
          userService.getBlacklist(user.id,data=>{
            if (data && data.status === "success") {
              localStorage.blacklist = JSON.stringify(data.recordList);
              // console.log(JSON.stringify(localStorage.blacklist))
              // debugger
            }
          })
          /*let token = data.result.token,
                      user = data.result.user,
                      id = user.id,
                      logid = user.logid,
                      userImg = this.$Tool.headerImgFilter(user.imageurl),
                      userName = user.username,
                      userMobile = user.mobile;
                  localStorage.inviteCode = user.invitecode;
                  this.$store.dispatch('userLogin',token);
                  this.$store.dispatch('userId',id);
                  this.$store.dispatch('userLogid',logid);
                  this.$store.dispatch('userImg',userImg);
                  this.$store.dispatch('userName',userName);
                  this.$store.dispatch('userMobile',userMobile);*/
          this.$Tool.goPage({name: 'home',replace:true});
          location.reload();
        }
        else if(data && data.status == "error") {
          this.tip.codeTip = data.result.tip;
          this.tip.active2 = true;
          this.tip.close2 = false;
          this.codeDesc = "";
          setTimeout(()=>{
            this.$vux.alert.show({
              content: '系统繁忙，请稍后重试！',
            });
          },0)
          // console.log("error")
        }
        this.$vux.loading.hide();
      }
    },
    beforeRouteEnter(to, from, next){
      !localStorage.id ? next() : GoTruth.$Tool.goPage({name:"home",replace:"replace"})
      // if (!localStorage.id) {
      // 	next();
      // }else{
      // 	GoTruth.$Tool.goPage({name:"member",replace:"replace"})
      // }
    }
  }
</script>

<style lang="less" scoped>
  .login-wrap{
    // margin-top: @topHeigth;
    height: calc(100vh - @topHeigth);
    padding: .3rem .6rem .8rem .6rem;
    overflow: hidden;
    overflow-y: auto;
    background-color: #fff;
    .login-header{
      text-align: center;
      margin-bottom: .44rem;
      .login-img {
        width: 1.1rem;
        height: 1.1rem;
        margin: 0 auto;
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      span{
        display: block;
        padding-top: .3rem;
        font-size: .24rem;
        color: #222;
        font-weight: bold;
        letter-spacing: .02rem;
      }
    }
    .login-body{
      h3{
        font-size: .3rem;
        color: #333;
        letter-spacing: .02rem;
      }
      .login-form{
        margin-top: .6rem;
        .login-item {
          width: 100%;
          height: .88rem;
          position: relative;
          padding: 0 .2rem;
          border-radius: .4rem;
          border: .02rem solid #999;
          background-color: #fff;
          .iconfont {
            display: inline-block;
            width: .4rem;
            height: .84rem;
            line-height: .84rem;
            color: #999;
            font-size: .32rem;
          }
          input {
            position: absolute;
            left: .6rem;
            padding: 0 .2rem;
            height: .84rem;
            line-height: .84rem\9;
          }
          .mobileInput{
            width: calc(100% - 2.6rem);
          }
          .codeInput{
            width: calc(100% - .9rem);
          }
          .login-close{
            width: .28rem;
            height: .28rem;
            position: absolute;
            top: .28rem;
            right: 2.1rem;
            border-radius: 50%;
            text-align: center;
            background-color: #f5f7f9;
            color: #ccc;
          }
          .login-code-close{
            right: .2rem;

          }
          .login-code {
            width: 1.8rem;
            height: .5rem;
            line-height: .5rem;
            text-align: center;
            position: absolute;
            top: .18rem;
            right: .2rem;
            border-left: .02rem solid #ccc;
            color: #666;
          }
          .codeColor{
            color: #999;
          }
        }
        .loginActive1,.loginActive2{
          border-color: @errColor;
        }
        .login-tip{
          display: block;
          font-size: .24rem;
          padding-left: .3rem;
          width: 100%;
          height: .4rem;
          line-height: .4rem;
          opacity: 1;
          color: @errColor;
        }
        .login-btn{
          width: 100%;
          height: .88rem;
          line-height: .88rem;
          text-align: center;
          font-size: .28rem;
          letter-spacing: .04rem;
          border-radius: .4rem;
          opacity: .5;
          background-color: @mainColor;
          color: #fff;
        }
        .isOpacity{
          opacity:1;
        }

      }
    }
    .login-footer{
      width: calc(100% - 1.2rem);
      position: absolute;
      left: 0.6rem;
      bottom: 0.8rem;
      .login-line{
        position: relative;
        height: .28rem;
        line-height: .28rem;
        text-align: center;
        letter-spacing: .02rem;
        color: #999;
        &::after,&::before{
          content:'';
          display: block;
          position: absolute;
          top: .13rem;
          width: 35%;
          background-color: #d8d8d8;
          height: .02rem;
        }
        &::after{right: 0;}
        &::before{left: 0;}
      }
      .login-way{
        margin-top: .4rem;
        margin-bottom: .3rem;
        .login-way-list{
          display: flex;
          justify-content: center;
          .login-icon-item{
            width: .8rem;
            height: .8rem;
            border: .04rem solid @borderColor;
            border-radius: 50%;
            text-align: center;
            margin-right: .8rem;
            &:last-child{
              margin-right: 0;
            }
            &:first-child i{
              line-height: .7rem;
            }
            &:nth-child(2) i{
              line-height: .8rem;
            }
            &:last-child i{
              line-height: .75rem;
            }
            .iconfont{
              font-size: .5rem;
              color: #555;
            }
          }
        }
      }
    }
    .login-desc{
      width: 100%;
      line-height: .46rem;
      font-size: .24rem;
      text-align: center;
      color: #999;
      margin-top: .3rem;
      span{
        letter-spacing: .02rem;
        color: #4190d5;
      }
    }

  }

</style>
<style lang="less">
  .weui-icon{
    position: relative;
    top: -.03rem;
  }
  .weui-icon-circle{
    font-size: .36rem !important;
  }
  .weui-icon-success{
    font-size: .36rem !important;
  }
  .vux-check-icon > .weui-icon-success:before, .vux-check-icon > .weui-icon-success-circle:before {
    color: #ffbe00 !important;
  }
</style>
