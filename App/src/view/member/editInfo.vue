<template>
  <div class="editInfo-wrap">
    <!-- 用户资料编辑 -->
    <ul class="editInfo-list">
      <li class="editInfo-item clearfix">
        <input type="file" id="uphoto" name="file" accept="image/*" class="uploadInput"  @change="uploadAvatar">
        <span class="editInfo-tit fl">头像</span>
        <i class="iconfont icon-arrow-right fr"></i>
        <div class="editInfo-box editInfo-img fr">
          <img :src="imgurl" ref='refAlt'>
        </div>
      </li>
      <li class="editInfo-item clearfix" @click="userNameFn">
        <span class="editInfo-tit fl">用户名</span>
        <i class="iconfont icon-arrow-right fr"></i>
        <div class="editInfo-desc editInfo-username fr">
          <span class="desc">{{user.username}}</span>
        </div>
      </li>
      <li class="editInfo-item clearfix" @click="userIntroduceFn">
        <span class="editInfo-tit fl">个人介绍</span>
        <i class="iconfont icon-arrow-right fr"></i>
        <div class="editInfo-desc editInfo-suggest fr">
          <span class="desc">{{user.introduce}}</span>
        </div>
      </li>
    </ul>
    <ul class="editInfo-list" style="margin-bottom: 0;">
      <li class="editInfo-item clearfix" @click="userBirthFn">
        <span class="editInfo-tit fl">生日</span>
        <i class="iconfont icon-arrow-right fr"></i>
        <div class="editInfo-desc editInfo-birth fr">
          <span class="desc">{{user.birthday}}</span>
        </div>
      </li>
      <li class="editInfo-item clearfix" @click="userSexFn">
        <span class="editInfo-tit fl">性别</span>
        <i class="iconfont icon-arrow-right fr"></i>
        <div class="editInfo-desc editInfo-sex fr">
          <span class="desc">{{user.sex}}</span>
        </div>
      </li>
      <router-link :to="{path:'province',query:{title:'选择地区'}}" class="editInfo-item clearfix" tag="li">
        <span class="editInfo-tit fl">地区</span>
        <i class="iconfont icon-arrow-right fr"></i>
        <div class="editInfo-desc editInfo-area fr">
          <span class="desc">{{address}}</span>
        </div>
      </router-link>
      <li class="editInfo-item clearfix" @click="userMobileFn">
        <span class="editInfo-tit fl">手机号</span>
        <i class="iconfont icon-arrow-right fr"></i>
        <div class="editInfo-desc editInfo-tel fr">
          <span class="desc">{{$Tool.mobileInput(user.mobile)}}</span>
        </div>
      </li>
    </ul>

    <!-- 手机设置 -->
    <div class="editInfo-setup">
      <!-- <span class="editInfo-setup-tip">开启后可以让你的好友找到你</span>
            <group>
                            <x-switch title="允许将我推荐给好友" v-model="value1"></x-switch>
                          </group>
                          <span class="editInfo-setup-tip">开启后,可以向你推荐好友</span>
            <group>
                            <x-switch title="允许将我推荐可能认识的人" v-model="value2"></x-switch>
                          </group>
                          <span class="editInfo-setup-tip">开启后,分享到微信QQ等平台的页面会展示你的头像</span>
            <group>
                            <x-switch title="分享页显示我的头像" v-model="value3"></x-switch>
                          </group> -->
      <span class="editInfo-setup-tip">社交平台账号绑定</span>
      <group>
        <x-switch title="微信" :prevent-default="true" v-model="isWechat" :disabled="isWechat" @on-click="authLogin('wechat')"></x-switch>
        <x-switch title="新浪微博" :prevent-default="true" v-model="isSina" :disabled="isSina" @on-click="authLogin('sina')"></x-switch>
        <!-- <x-switch title="腾讯QQ" :prevent-default="true" v-model="isQQ" :disabled="isQQ" @on-click="authLogin('qq')"></x-switch> -->
      </group>
    </div>
    <!-- 用户名弹框 -->
    <div v-transfer-dom class="transdom">
      <popup v-model="popList.show">
        <div class="popup-wrap">
          <div class="popup-area">
						<textarea  :placeholder="popList.placeholder"
                       v-focus autofocus
                       :maxlength="popList.length"
                       v-model.trim="popList.desc"
                       @input="handleDesc"
            >
						</textarea>
            <span class="popup-num">{{this.popList.length - this.popList.desc.length}}</span>
          </div>
          <div class="popup-tip clearfix">
            <span class="popup-tip-desc fl">{{popList.tip}}</span>
            <button class="popup-btn fr" :class="{btnActive:popList.btnToggle}" @click="handleSubmitOne" v-show="popList.showOne">确定</button>
            <button class="popup-btn fr" :class="{btnActive:popList.btnToggle}" @click="handleSubmitTwo" v-show="popList.showTwo">确定</button>
          </div>
        </div>
      </popup>
    </div>
    <!-- 性别弹框 -->
    <div v-transfer-dom class="transdom">
      <popup v-model="showSex">
        <div class="popup-sex">
          <ul class="popup-sex-list">
            <li v-for="(item,index) in sexList" @click="handleSex(item)">{{item}}</li>
          </ul>
          <button type="button" class="popup-sex-btn" @click="handleSexCancel">取消</button>
        </div>
      </popup>
    </div>
    <!-- 绑定手机号选项 -->
    <div v-transfer-dom>
      <confirm
        v-model="showMobile"
        show-input
        hide-on-blur
        title="绑定手机号"
        :input-attrs="{type:'number'}"
        @on-confirm="handleCheckMobile"
        confirm-text="获取验证码">
      </confirm>

    </div>

    <!-- 绑定手机号验证码选项 -->
    <div v-transfer-dom>
      <confirm
        v-model="showCode"
        show-input hide-on-blur
        title="输入验证码"
        @on-confirm="handleCheckCode"
        :input-attrs="{type:'number'}">
      </confirm>
    </div>
    <!-- 公共alert -->
    <alert v-model="showAlert" hide-on-blur :content="alertDesc"></alert>
    <!-- 图片裁剪 -->
    <div class="vueCropper mask" v-if="ifCropper">
      <vueCropper
        ref="cropper"
        :img="photOption.img"
        :outputSize="photOption.outputSize"
        :outputType="photOption.outputType"
        :info="false"
        :full="photOption.full"
        :canMove="photOption.canMove"
        :canMoveBox="photOption.canMoveBox"
        :fixedBox="photOption.fixedBox"
        :original="photOption.original"
        :autoCropWidth="photOption.autoCropWidth"
        :autoCropHeight="photOption.autoCropHeight"
        :autoCrop="photOption.autoCrop"
        :fixed="photOption.fixed"
        :fixedNumber="photOption.fixedNumber"
        :centerBox="photOption.centerBox"
      >
      </vueCropper>
      <ul class="bf ac">
        <li class="operate-li" @click="photoConfirm">
          确定
        </li>
        <li class="operate-li" @click="photoCancle">
          取消
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import config from '@/lib/config/config'
  import authUtil from '@/service/util/authUtil'
  import {VueCropper} from 'vue-cropper'
  import { XSwitch, XButton,Loading,} from 'vux'
  import fileService from '@/service/fileService'
  import userService from '@/service/userService'
  import provinceService from '@/service/provinceService'
  export default {
    directives:{
      focus: {
        inserted: function (el) {
          el.focus()
        }
      }
    },
    components:{
      XSwitch,
      XButton,
      Loading,
      VueCropper,
      // VueCropper:() => import('vue-cropper')
    },
    data(){
      return {
        value1:false,
        value2:false,
        value3:false,
        isWechat:false,
        isSina:false,
        isQQ:false,
        showAlert:false,
        ifCropper:false,
        upFile:{
          name:"",
          name2:"",
        },
        uploadImgName:"",
        address:'',
        photOption: {
          img: '',//裁切图片的地址
          outputSize: 0.6,//裁剪生成图片的质量 0.1-1
          full: false,//是否输出原图比例的截图
          outputType: 'png',//裁剪生成图片的格式
          canMove: true,//图片是否允许滚轮缩放
          fixedBox: true,//固定截图框大小 不允许改变
          original: false,//上传图片按照原始比例渲染
          canMoveBox: true,//截图框能否拖动
          canMove:true,// 上传图片是否可以移动
          autoCropWidth: 300,//截图框大小
          autoCropHeight: 300,//截图框大小
          autoCrop:true,//是否默认生成截图框
          // 开启宽度和高度比例
          fixed: true,
          fixedNumber: [1, 1],
          centerBox:true,
        },
        user:{
          username:'',
          introduce:'',
          birthday:'',
          sex:'',
          province:'',
          city:'',
          mobile:0,
          /*wx_unionid:'',
          qq_unionid:'',
          xl_openid:''*/
        },
        imgurl:"",
        userId:localStorage.id,
        popList:{
          show:false,
          desc:'',
          placeholder:'',
          length:Number,
          tip:'',
          btnToggle:false,
          oldDesc:'',
          showOne:false,
          showTwo:false
        },
        showSex:false,
        sexList:Object.freeze(['男','女','保密']),
        showMobile:false,
        showCode:false,
        showAlert:false,
        alertDesc:'',
        inputMobile:'',
        inputCode:'',
      }
    },

    activated(){
      setTimeout(() => {
        this.init();
      },delay)
    },
    mounted() {
      window.history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.onBrowserBack, false);
      try{
        authUtil.init();
      }catch(err){
        
      }
    },
    destroyed(){
      window.removeEventListener("popstate", this.onBrowserBack, false);
    },
    watch:{
      "popList.show":{
        handler(newVal, oldVal) {
          if(newVal.Terms == true) {
            window.history.pushState(null, null, document.URL);
          }
        },
        deep: true
      },
      showSex:{
        handler(newVal, oldVal) {
          if(newVal.Terms == true) {
            window.history.pushState(null, null, document.URL);
          }
        },
        deep: true
      },
      ifCropper:{
        handler(newVal, oldVal) {
          if(newVal.Terms == true) {
            window.history.pushState(null, null, document.URL);
          }
        },
        deep: true
      },
    },
    methods: {

      init(){
        if (!localStorage.id) {return;}
        let data = userService.getCurentUser();
        if(data && data.status == 'success') {
          this.user = data.result.user;
        }
        /*if(localStorage.id && localStorage.id == this.userId){
          this.imgurl = localStorage.userImg;
          this.user.username = localStorage.userName;
        }*/
        let res = userService.getUserById(this.userId);
        if(res && res.status == "success") {
          this.imgurl = this.$Tool.headerImgFilter(res.result.user.imageurl);
          this.user.username = res.result.user.username;
        }

        //判断用户头像
        // let tempImg = this.user.imageurl;
        // if(tempImg != null) {
        // 	let reg = /^http/i;
        // 	//判断是否为第三方源头像
        // 	if (!reg.test(tempImg)) {
        // 		if (tempImg) {
        // 			this.imgurl = config.fileRoot + '/' + tempImg;
        // 		}
        // 	}
        // 	this.imgurl = config.fileRoot +'/'+ this.user.imageurl;
        // 	this.$store.dispatch('userImg',this.imgurl);
        // }
        //个人介绍
        if(this.user.introduce == null) {
          this.user.introduce = "这个人很懒、暂无个性签名"
        }
        //判断性别
        if(this.user.sex == null) {
          this.user.sex='保密'
        }

        //判断生日
        if(this.user.birthday == null) {
          this.user.birthday = '待完善';
        }
        //判断地区
        if(this.user.province == null&&!localStorage.choiceAddress) {
          this.address = '待完善'
        }else if (localStorage.choiceAddress) {
          let temp = JSON.parse(localStorage.choiceAddress);
          this.user.province = temp.province;
          this.user.city = temp.city;
          if (this.user.province = this.user.city) {
            this.address = this.user.province;
            if(this.address){
              this.$vux.toast.show({
                text: '修改成功'
              });
            }
          } else {
            this.address = this.user.province + this.user.city;
          }
          userService.updateUser(this.user);
          localStorage.removeItem("choiceAddress");
        } else {
          if (this.user.province = this.user.city) {
            this.address = this.user.province;
          } else {
            this.address = this.user.province + this.user.city;
          }
        }
        // 判断手机号
        !this.user.mobile && (this.user.mobile='未绑定')
        // 判断绑定wechat
        this.user.wx_unionid && (this.isWechat = true)
        // 判断绑定qq
        this.user.qq_unionid && (this.isQQ = true)
        // 判断绑定sina
        this.user.xl_openid && (this.isSina = true)
      },
      onBrowserBack(){
        if(this.popList.show || this.showSex || this.showMobile || this.showCode || this.ifCropper){
          this.popList.show = false;
          this.showSex = false;
          this.showMobile = false;
          this.showCode = false;
          this.ifCropper = false;
        }
      },


      //上传头像
      commitUpload(){
        this.$vux.loading.show({
          text: 'Loading'
        });
        let param = new FormData();
        param.append('file',this.upFile,this.upFile.name); //通过append向form对象添加数据
        fileService.uploadHeadImage(param,(data)=>{
          if (data && data.status == "success") {
            let src = data.result.url;
            this.user.imageurl = src;
            let res = userService.updateUser(this.user);
            if(res && res.status == "success"){
              this.imgurl = config.fileRoot +'/'+ src;

              this.$vux.loading.hide();
              this.$store.dispatch('userImg',this.imgurl);
              this.$vux.toast.show({
                text: '头像上传成功'
              });
            }
          } else {
            this.$vux.loading.hide();
            this.showAlert=true;
            this.alertDesc="请求失败，请稍后再试";
            setTimeout(()=>{
              this.showAlert=false;
            },1000)
          }
        })
      },
      uploadAvatar(e){
        // debugger
        let file = e.target.files[0];
        // console.log(file)
        if (!file) {return;}
        if (!this.$Tool.checkPic(file.name)) {
          this.$vux.alert.show({
            content:'格式错误，仅限jpg、png、jpeg、gif格式',
          })
          return;
        }
        if (!FileReader) {
          alert("错误提示：版本太低不支持")
          return;
        }
        this.ifCropper = true;
        this.$vux.loading.show({
          text: 'Loading'
        });
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (e) => {
          let data;
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          this.photOption.img = data;
          this.uploadImgName = file.name;
        }
        fileReader.onerror = ()=>{
          this.$vux.loading.hide();
          this.$vux.alert.show({
            content:'文件读取失败，请重试',
          })
        }
        this.$vux.loading.hide()

        //取消两次选择同一个文件是不能触发onchange事件问题
        e.target.value = "";
      },

      //头像裁剪
      photoConfirm(){
        // 获取截图的blob数据
        this.$refs.cropper.getCropBlob((data) => {
          this.upFile = data;
          this.photOption.img = ''
          this.$set(this.upFile,"name",this.uploadImgName);
          this.commitUpload();
          this.ifCropper = false;

        });
      },
      photoCancle(){
        this.photOption.img = ''
        this.ifCropper = false;
      },

      //用户名
      userNameFn(){
        this.popList.showOne = true;
        this.popList.showTwo = false;
        this.popList.show = true;
        this.popList.desc = this.user.username;
        this.popList.placeholder = "请输入用户名";
        this.popList.length = 20;
        this.popList.tip = "支持中、英文，数字";
        if(this.popList.desc.length > 0) {
          this.popList.btnToggle = true;
        }
      },
      handleSubmitOne(){
        let temp = this.popList.desc;
        if (temp === "") {return;}
        if (!this.$Tool.checkInput(temp) || temp.match(/直击真相/g)) {
          temp = this.$Tool.replaceNo(temp);
          temp = temp.replace(/直击真相/g,"");
          this.$vux.alert.show({
            content:'内容不合法，已为您删除，请确认！',
          })
          return;
        }
        let res = userService.testUserName(temp);
        if (res && res.status === "success") {
          if (res.exist === "1") {
            this.$vux.alert.show({
              content:'用户名已存在，请重新输入',
            })
            this.popList.desc = "";
            return;
          }
        }
        this.user.username = temp;
        this.descfunc((data)=>{
          if(data && data.status == "success") {
            this.$store.dispatch('userName',temp);
          }
        });
      },

      // 个人介绍
      userIntroduceFn(){
        this.popList.showOne = false;
        this.popList.showTwo = true;
        this.popList.show = true;
        this.popList.desc = this.user.introduce;
        this.popList.placeholder = "请输入个性签名";
        this.popList.length = 40;
        this.popList.tip = "";
        if(this.popList.desc.length > 0) {
          this.popList.btnToggle = true;
        }
      },

      handleSubmitTwo(){
        let temp = this.popList.desc;
        if (temp === "") {return;}
        if ( !this.$Tool.checkInput(temp) || temp.match(/直击真相/g)) {
          temp = this.$Tool.replaceNo(temp);
          temp = temp.replace(/直击真相/g,"");
          this.$vux.alert.show({
            content:'内容不合法，已为您删除，请确认！',
          })
          return;
        }
        this.user.introduce = temp;
        this.descfunc(()=>{});
      },
      //限制文字字数
      handleDesc(){
        let temp = this.popList;
        let descNum = temp.length - temp.desc.length;
        if(descNum >= temp.length) {
          temp.btnToggle = false;
        }else{
          temp.btnToggle = true;
        }
      },

      // 生日
      userBirthFn(){
        let thiz = this;
        let date = new Date();
        this.$vux.datetime.show({
          confirmText:'完成',
          cancelText:'取消',
          startDate:'1900-01-01',
          endDate: date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
          value:thiz.user.birthday,
          onConfirm(val){
            thiz.user.birthday = val;
            let data = userService.updateUser(thiz.user);
            if(data.status == 'success') {
              thiz.$vux.toast.show({
                text: '修改成功'
              });
            }
          }
        })
      },

      // 性别选择
      userSexFn(){
        this.showSex = true;
      },
      handleSex(item){
        this.user.sex = item;
        let data = userService.updateUser(this.user);
        this.showSex = false;
        if(data.status == "success") {
          this.$vux.toast.show({
            text: '修改成功'
          });
        }
      },
      handleSexCancel(){
        this.showSex = false;
      },

      // 手机号绑定
      userMobileFn(){
        this.showMobile = true;
      },
      handleCheckMobile(val){
        if (val == this.user.mobile) {
          this.$vux.toast.show({
            text: '号码重复绑定',
            type:'cancel'
          })
          return;
        }else if(val.length == 11) {
          let res = userService.testMobile(val);
          if (res && res.status === "success") {
            if (res.exist === "1") {
              this.$vux.alert.show({
                content:'改号码已被绑定！',
              })
              return;
            }
          }
          userService.getCode(val,(data)=>{
            if(data.status == "success") {
              this.inputMobile = val;
              // this.inputCode = data.result.code;
              this.showAlert = true;
              this.alertDesc="发送成功";
              setTimeout(()=>{
                this.showAlert = false;
                this.showCode = true;
              },1000);
            }else{
              this.showAlert = true;
              this.alertDesc = "发送失败";
            }
          })
        }else {
          this.showAlert = true;
          this.alertDesc = "号码有误";
        }
      },
      handleCheckCode(val){
        let res = userService.testCode(this.inputMobile,val);
        if (res && res.result) {
          this.user.mobile = parseInt(this.inputMobile);
          let data = userService.updateUser(this.user);
          if(data && data.status == "success"){
            this.$store.dispatch('userMobile',this.user.mobile);
          }
        }else {
          this.showAlert = true;
          this.alertDesc = "验证码错误";
          setTimeout(()=>{
            this.showAlert = false;
            this.showCode = true;
          },1000);
        }
      },
      //函数
      descfunc(callback){
        let data = userService.updateUser(this.user);
        this.popList.show = false;
        if(data.status == "success") {
          this.$vux.toast.show({
            text: '修改成功'
          });
        }
        callback (data);
      },
      // 授权绑定第三方账号
      authLogin(type){
        const _this = this;
        switch (type){
          case "wechat":
          authUtil.loginByWx(function(resMap){
            if(resMap.status === "success"){
              let params = resMap.result.wx_user;
              /*{
                "sex":"男",
                "wx_openid":"oRrdQt6Rx5HoGnbKAgG_Wpl0zK44",
                "wx_nikname":"董春林",
                "wx_image":"http://thirdwx.qlogo.cn/mmopen/vi_32/KRO0TRAmL5XvPXia9icPstUkNKMlHSYOdhiahX5UBbNuibOhZGcxZcsRxmQtAAqFX2nLL5cwyc4fkLVJnKibiaN1qzJg/132",
                "wx_unionid":"oU5YytwqdJBWqmL6dNXsjsYAS_MM"
              }*/
              _this.user.wx_openid = params.wx_openid;
              _this.user.wx_nikname = params.wx_nikname;
              _this.user.wx_image = params.wx_image;
              _this.user.wx_unionid = params.wx_unionid;
              userService.updateUser(_this.user);
              _this.isWechat = true;
            }
          })
          break;
          case "qq":
          authUtil.loginByQQ(function(resMap){
            if(resMap.status === "success"){
              let params = resMap.result.qq_user;
              /*{
                "qq_openid":"F6DC81D7DEA4AA7AC94A2C6E57F96C09",
                "qq_nikname":"被博士",
                "qq_image":"http://qzapp.qlogo.cn/qzapp/1104455702/F6DC81D7DEA4AA7AC94A2C6E57F96C09/30",
                "sex":"男"
              }*/
              _this.user.qq_openid = params.qq_openid;
              _this.user.qq_nikname = params.qq_nikname;
              _this.user.qq_image = params.qq_image;
              _this.user.qq_unionid = params.qq_unionid;
              userService.updateUser(_this.user);
              _this.isQQ = true;
            }
          })
          break;
          case "sina":
          authUtil.loginByXl(function(resMap){
            if(resMap.status === "success"){
              let params = resMap.result.xl_user;
              /*{"xl_user":{"sex":"男","xl_nikname":"用户6311798622","xl_image":"http://tvax3.sinaimg.cn/default/images/default_avatar_male_50.gif"}}*/
              _this.user.xl_openid = params.xl_openid;
              _this.user.xl_nikname = params.xl_nikname;
              _this.user.xl_image = params.xl_image;
              userService.updateUser(_this.user);
              _this.isSina = true;
            }
          })
          break;
          default:
          console.log("授权出错")
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      if (!localStorage.id ) {
        GoTruth.$Tool.loginPrompt();
      }else{
        next();
      }
    }
  }

</script>

<style lang="less" scoped>
  .mask{
    z-index:999;
  }
  .editInfo-wrap{
    // margin-top: @topHeigth + .18rem;
    height: calc( 100vh - .87rem);

    overflow: hidden;
    overflow-y: auto;
    padding-bottom: .18rem;
    .editInfo-list {
      margin-top: .2rem;
      padding: 0 .26rem;
      border-top: .02rem solid @borderColor;
      border-bottom: .02rem solid @borderColor;
      background-color: #fff;
      margin-bottom: .18rem;
      .editInfo-item {
        height: .9rem;
        line-height: .9rem;
        border-bottom: .02rem solid @borderColor;
        position: relative;
        .uploadInput {
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 999;
          width: 100%;
          height: 100%;
        }
        .editInfo-tit {
          font-size: .32rem;
        }
        .editInfo-img {
          width: .7rem;
          height: .7rem;
          border-radius: 50%;
          border: .02rem solid @borderColor;
          margin-top: .1rem;
          margin-right: .1rem;
          img{
            display: block;
            border-radius: 50%;
          }
        }
        .editInfo-desc{
          color: #999;
          font-size: .28rem;
          margin-right: .1rem;
        }
        .editInfo-username{
          width: 3.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: right;
        }
        .editInfo-suggest {
          width: 3.6rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: right;
        }
        .iconfont{
          font-size: .5rem;
          color: #999;
        }
      }
      .editInfo-item:last-child{
        border-bottom: none;
      }
    }
    .editInfo-setup{
      // padding: 0 .26rem;
      .editInfo-setup-tip{
        display: block;
        padding: 0 .26rem;
        margin: .15rem 0;
        font-size: .24rem;
        color: #999;
      }


    }
  }
  .operate-li{
    display: inline-block;
    width: 20%;
    color: #fff;
    text-align: center;
    line-height: .72rem;
    background: rgba(139, 139, 139, 0.99);
    border-radius: .2rem;
    margin: 0 14%;
  }


  .popup-wrap {
    padding: .26rem;
    width: 100%;
    background-color: #f4f5f6;
    .popup-area {
      width: 100%;
      height: 1.82rem;
      position: relative;
      margin-bottom: .14rem;
      textarea{
        width: 100%;
        height: 100%;
        background-color: #fff;
        border: .02rem solid @borderColor;
        border-radius: .2rem;
        padding: .13rem .18rem;
        font-size: .28rem;
        resize:  none;
      }
      textarea::-webkit-input-placeholder{color:#999;}
      textarea:-moz-placeholder{color:#999;}
      textarea::-moz-placeholder{color:#999;}
      textarea:-ms-input-placeholder{color:#999;}
      .popup-num{
        position: absolute;
        bottom: .13rem;
        right: .18rem;
        font-size: .24rem;
        color: #999;
      }
    }
    .popup-tip {
      height: .52rem;
      line-height: .52rem;
      .popup-tip-desc {
        font-size: .28rem;
        color: #999;
      }
      .popup-btn{
        width: 1.04rem;
        height: 100%;
        text-align: center;
        background-color: #cacaca;
        border-radius: .1rem;
        color: #fff;
        pointer-events: none;
      }
      .btnActive{
        background-color: @mainColor;
        pointer-events: auto ;
      }
    }
  }
  .vux-popup-dialog{
    background-color: transparent;
    .popup-sex{
      padding: .3rem;
      .popup-sex-list{
        background-color: #fff;
        border-radius: .2rem;
        overflow: hidden;
        margin-bottom: .25rem;
        li{
          width: 100%;
          height: 1rem;
          line-height: 1rem;
          text-align: center;
          box-shadow: inset 0 -1px 0 0 #ebebeb;
          font-size: .36rem;
          color: #008CFF;
        }
      }
      .popup-sex-btn{
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        background-color: #fff;
        font-size: .36rem;
        border-radius: .2rem;
        color: #6b6b6b;
      }

    }
  }
</style>
<style>

  /*vuecropper 样式修改*/
  .cropper-modal{
    background: rgb(66, 66, 66);
  }
  .vue-cropper{
    background-image: none !important;
  }
  .vux-no-group-title {
    margin-top: 0 !important;
  }
  .weui-label{
    font-size: .32rem;
  }
</style>
