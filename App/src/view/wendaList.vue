<template>
  <div class="wendaList-wrap">
    <top @hrefTo="this.$Tool.goBack">
      <template slot="title">{{ '真相问答' }}</template>
    </top>
    <div class="mask" v-show="ifLoad">
      <loading-main></loading-main>
    </div>
    <div class="wendaList">
      <div class="wendaList-current">
        <div class="user clearfix">
          <div class="user-bar fl">
            <img :src=" $Tool.headerImgFilter(wenda.imageurl)">
            <span>{{wenda.username}}</span>
          </div>
          <div
            class="user-focus fr"
            :class="focusColor ? 'default-color' : 'active-color'"
            v-if="userId != wenda.userid"
            @click="handleFocus(wenda.userid)"
            >
            {{focusState ? '已关注' : '关注'}}
          </div>
        </div>
        <h2 class="title">{{wenda.title}}</h2>
        <div class="desc" >
          <p class="desc-text">{{wenda.description}}</p>
        </div>

       <!-- <ul class="wendaList-img">
          <li class="item" :class="{bigImg:bigImg}"  v-for="(item,index) in imgArr" v-show="ifImgNull" @click='handlePreview(1)'>
            <img :src="fileRoot + item">
          </li>
        </ul>-->
        <vue-picture-swipe :items="items" :options="{shareEl: false}" v-show="ifImgNull"></vue-picture-swipe>

        <div class="wendaList-tip clearfix">
          <span v-show="questionBool.hasAnswer">{{wendaCount}}条回答</span>
          <span v-show="questionBool.notAnswer">暂无回答</span>
          <span class="point">•</span>
          <span v-show="questionBool.hasCollect">{{collectCount}}人收藏</span>
          <span v-show="questionBool.notCollect">暂无人收藏</span>

          <div class="question-jubao fr" @click="handleReport">
           <i class="iconfont icon-warning-circle"></i>
            举报
          </div>
        </div>
      </div>
      <div class="wendaList-other"
           v-show="hasAnswer"
           v-for="(item,index) in answer"
           @click="goAnswerDetail(wenda,item)"
           v-if="!isBlacklist(item.author)">
        <div class="header">
          <div class="header-user">
            <img :src="$Tool.headerImgFilter(item.imageurl)" class="userPhoto">
            <span class="username">{{ item.username}}</span>
          </div>
        </div>
        <div class="body">
          <div class="body-content">
            <p class="content">{{item.content}}</p>
            <ul class="body-img">
              <li class="body-item" v-for="itemfile in item.answerFile" :key="itemfile.id">
                <img :src="fileRoot + itemfile.url">
              </li>
            </ul>
          </div>
        </div>
        <div class="footer clearfix">
          <div class="fl">

            <span>{{item.answerCommentNum}}评论</span>

            <span>{{item.publishtime}}</span>
          </div>
          <!--  -->
          <!-- v-if="ifDel" -->
          <div class="fr article-remove" @click="$emit('delete',[item.id,$event])" v-if="ifDel">
            <i class="iconfont icon-remove"></i>
          </div>
          <div class="fr article-remove" v-if="userId == item.author" @click.stop="handleCloseAnswer(item.id, index)">
            <i class="iconfont icon-remove"></i>
          </div>

        </div>
      </div>
      <div class="not-wendaList" v-show="notAnswer">
        <i class="iconfont icon-nomsg"></i>
        <span>抢第一个沙发吧...</span>
      </div>
    </div>
    <div class="wendaList-footer">
      <div class="item" @click="handleCollect">
        <i class="iconfont" :class="collectIcon ? 'icon-collected' : 'icon-not-collection'"></i>
        <span>{{collectState?'已收藏':'收藏'}}</span>
      </div>
      <!-- <div class="item" @click="$Tool.goPage({ name:'release',query:{title:'发表问题',sort:3}})">
           <i class="iconfont icon-fabu"></i>
           <span>提问</span>
       </div>-->
      <div class="item" @click="handleShare">
        <i class="iconfont icon-share"></i>
        <span>分享</span>
      </div>
      <div class="item" @click="handleAnswer">
        <i class="iconfont icon-comment"></i>
        <span>回答</span>
      </div>
    </div>
    <!--回答弹出框-->
    <div v-transfer-dom>
      <popup v-model="answerObj.show" height="100%">
        <div class="popup-wrap">
          <div class="popup-header clearfix">
            <div class="header-cancel" @click="handleCancel">取消</div>
            <div class="header-title">回答</div>
            <div class="header-fabu" @click="handlePublish" :class="{fabuColor:fabuColor}">发布</div>
          </div>
          <div class="popup-body">
                    <textarea
                      placeholder="分享你的真实观点和经验"
                      :onpropertychange="onpropertychange"
                      :oninput="oninput"
                      @input="handelInput"
                      v-model="record.content" maxlength="300"></textarea>
            <div class="popup-img clearfix">
              <div class="img fl" v-for="(item, index) in record_file" @click="handlePreview(2)">
                <i class="iconfont icon-remove" @click.stop="handleRemoveImg(index)"></i>
                <img class="previewer-demo-img" :src="fileRoot + item.url">
                <!--v-preview="fileRoot + item.url"-->
              </div>
              <div class="popup-addimg fl" v-show="answerObj.addShow">
                <label for="addImg"></label>
                <i class="iconfont icon-add"></i>
                <input type="file" id="addImg" accept="image/*" multiple @change="handleuploadFile" style="display: none;">
              </div>
            </div>
            <!--  <div class="popup-footer clearfix">
                <div class="keyboard fl" @click="handelBoard">
                   <i class="iconfont icon-jianpan-up"></i>
                 </div>
                <div class="addImg fr">
                    <label for="iconImg"></label>
                    <i class="iconfont icon-album"></i>
                    <input type="file" id="iconImg" accept="image/*" multiple @change="handleuploadFile" style="display: none;">
                </div>
            </div> -->
          </div>
        </div>
      </popup>
    </div>
    <!-- 分享 -->
    <share :content="shareDesc" v-model="shareShow"></share>
    <!-- 图片预览 -->
    <transition enter-active-class="animated fadeIn" leave-active-class=" animated fadeOut">
      <gallary :obj="record_file" v-show="showGallary" @close="handleGallaryClose"></gallary>
    </transition>

    <!--举报-->
    <div v-transfer-dom style="z-index: 988;">
      <popup v-model="reportShow" style="z-index: 999;">
        <div class="report-wrap">
          <div class="report-header">
            <h2>举报(举报热线：18756686768)</h2>
          </div>
          <group>
            <radio :selected-label-style="{color: '#FF9900'}" fill-mode :options="reportList" v-model="reportreasion">
            </radio>
          </group>
          <div class="report-footer" @click="handleSendReport">
            确定
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import config from '@/lib/config/config'
  import listUtil from '@/service/util/listUtil'
  import netUtil from "@/service/util/netUtil"
  import userService from '@/service/userService'
  import wdcollectService from '@/service/wdcollectService'
  import interService from '@/service/interlocutionService'
  import followService from '@/service/followService'
  import messageService from '@/service/messageService'
  import fileService from '@/service/fileService'
  import articleService from '@/service/articleService'
  import articleFileService from '@/service/article_fileService'
  import articleCommentService from '@/service/article_commentService'
  import reportService from '@/service/reportService'
  import gallary from "@/components/Gallary"
  export default {
    components:{
      gallary
    },
    props:{
      whi:{
        type:Number,
      },
      //判断是否为作者详情视图(真:为作者视图；假（空）:为浏览视图)
      detailType:{
        type:String,
        default:"",
      },
      //判断是否显示发布人
      ifPublisher:{
        type:Boolean,
        default:true,
      },
      ifDel:{
        type:Boolean,
        default:false,
      },
    },
    data() {
      return {
        reportreasion:'',//"举报原因"
        reportShow:false,
        reportList:Object.freeze([
          '淫秽色情',
          '违法信息',
          '营销广告',
          '恶意攻击谩骂',
          '拉黑该用户并屏蔽其内容'
        ]),
        ifImgNull:true,
        showGallary:false,
        showGallary:false,
        timer:null,
        userId:localStorage.id,
        focusState:false,
        focusColor:false,
        id:0,   //问题Id
        wenda:{},    //问题对象
        answer:[],   //问题回答对象
        fileRoot:config.fileRoot + '/',   //服务路径
        imgArr:[],  //问题图片
        items:[],
        answerFile:[],    //回答附件图片列表
        bigImg:false,      //判断是否一张图
        wendaCount:0,     //回答数
        collectCount:0,   //问题收藏数
        collectIcon:false,   //监听收藏图标变化
        collectState: false, //收藏文字变化
        publishtime:'',      //回答发布时间
        /*问题的收藏回答状态*/
        questionBool:{
          hasAnswer:false,
          notAnswer:false,
          hasCollect:false,
          notCollect:false
        },
        answerObj:{
          show:false,
          addShow:true
        },
        //textarea高度变化
        onpropertychange:"this.style.height=this.scrollHeight + 'px'",
        oninput:"this.style.height=this.scrollHeight + 'px'",
        fabuColor:false,    //发布按钮颜色
        record:{
          content:'',
          author:1,
          type:1,
          publishtime:'',
          parentid:''
        },
        record_file:[],   //问答附件数组
        page:1,     //回答列表页数
        // 答案发布人name-img
        wendaUser:{
          username:'',
          imageurl:''
        },
        hasAnswer:false , //有回答
        notAnswer:false,  //无回答
        /*加载回答列表*/
        ifNet:false,
        ifLoad: false, //是否加载
        ifLoading:false,
        tip:"正在加载",
        shareShow:false,
        shareDesc:{
          href:'',
          title:'',
          description:'',
          thumbs:[]
        },
      }
    },
    activated() {
      this.$nextTick(()=>{
        this.id = this.$route.query.id;
        this.wenda = JSON.parse(this.$route.query.item);
        this.ifLoad = true;
        if(this.timer){
          clearTimeout(this.timer);
        }
        if(this.timer){
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(()=>{
          this.init();
          if(!localStorage.id || !localStorage.token){
            this.collectIcon = false;
            this.collectState = false;
          }
          this.ifLoad = false;
        },120);
      });
    },
    mounted() {
      window.history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.onBrowserBack);
    },
    destroyed(){
      window.removeEventListener("popstate", this.onBrowserBack);
    },
    methods:{
      //页面初始化渲染
      init() {
        if (!this.id) {
          this.$vux.alert.show({
            content: '获取出错，请返回！',
          });
          this.$Tool.goBack();
          return;
        }
        this.ifLoad = true;
        this.items = [];
        this.imgArr = this.wenda.images.split(',');
        for(let i =0; i<this.imgArr.length;i++){
          let obj = {
            src:this.fileRoot + this.imgArr[i],
            thumbnail:this.fileRoot + this.imgArr[i],
            w: 600,
            h: 450,
          };
          this.items.push(obj);
          let indexOf = this.items[i].src.indexOf('pic');
          if(indexOf == -1){
            this.ifImgNull = false;
          }else{
            this.ifImgNull = true;
          }
        }

        // 获取发布问题人的信息
        userService.getUserById(this.wenda.userid,(data)=>{
          if(data && data.status == "success"){
            this.$set(this.wenda,'username',data.result.user.username);
            this.$set(this.wenda,'imageurl',data.result.user.imageurl);
          }
        });

        // 是否关注发布人
        if(localStorage.getItem('token')) {
          followService.testFollow(this.wenda.userid, (data)=>{
            if(data && data.status == "success") {
              if(data.result == 1) {
                this.focusState = true;
                this.focusColor = true;
              }else{
                this.focusState = false;
                this.focusColor = false;
              }
            }
          });
        }
        // 获取回答列表
        this.page = 1;
        this.answer =[];
        let answerData = interService.getAnswers(this.page, 15, this.id);
        if(answerData && answerData.status == "success") {
          listUtil.appendList(this.answer,answerData.recordPage.list);
          if(answerData.recordPage.list.length){
            this.page++;
          }
          // 循环回答列表
          listUtil.asyncSetListPropty(answerData.recordPage.list,(item)=>{

            // 获取发布回答时间
            item.publishtime = this.$Tool.publishTimeFormat(item.publishtime);
            // 获取发布回答用户信息
            let wendaUserData = userService.getUserById(item.author);
            if(wendaUserData && wendaUserData.status == "success"){
              this.$set(item, "imageurl", wendaUserData.result.user.imageurl);
              this.$set(item, "username", wendaUserData.result.user.username);
            }
            // 获取发布回答的图片
            let answerSrcData = articleFileService.getFileByArticle(item.id);
            if(answerSrcData && answerSrcData.status == "success") {
              this.$set(item,'answerFile',[]);
              item.answerFile = answerSrcData.result.filelist;
            }
            // 获取回答评论数量
            articleCommentService.getArticleCommentCount(item.id,(data)=>{
              if(data && data.status == "success"){
                this.$set(item,'answerCommentNum',0);
                this.answerCommentNum = this.$Tool.numConvertText(data.result.count);
                item.answerCommentNum = this.$Tool.numConvertText(data.result.count);
              }
            });
          });
          if(answerData.recordPage.list == ""){
            this.hasAnswer = false;
            this.notAnswer = true;
          }else{
            this.hasAnswer = true;
            this.notAnswer = false;
          }
        }
        // 获取问题回答数量
        interService.getAnswerCount(this.wenda.id, (data) =>{
          if(data && data.status == "success") {
            this.wendaCount = this.$Tool.numConvertText(data.count);
            if(data.count <= 0) {
              this.questionBool.notAnswer = true;
              this.questionBool.hasAnswer = false;
            }else{
              this.questionBool.notAnswer = false;
              this.questionBool.hasAnswer = true;
            }
          }
        });
        //获取问题的收藏状态
        wdcollectService.testWdCollect(this.id, (data)=>{
          if(data && data.status == "success") {
            if(data.result == 1) {
              this.collectIcon = true;
              this.collectState = true;
            }else{
              this.collectIcon = false;
              this.collectState = false;
            }
          }
        });
        // 获取问题收藏数量
        wdcollectService.getWdCollectCount(this.wenda.id,(data)=>{
          if(data && data.status == "success") {
            this.collectCount = data.count;
            if(data.count <= 0) {
              this.questionBool.notCollect = true;
              this.questionBool.hasCollect = false;
            }else{
              this.questionBool.notCollect = false;
              this.questionBool.hasCollect = true;
            }
          }
        });
        this.ifLoad = false;
      },
      onBrowserBack(){
        if(this.shareShow || this.answerObj.show || this.showGallary || this.reportShow){
          this.shareShow = false;
          this.answerObj.show = false;
          this.showGallary = false;
          this.reportShow = false;
          if(this.showGallary){
            this.answerObj.show = true;
          }
        }
      },
      handlePreview(){
        this.showGallary = true;
      },
      handleGallaryClose(){
        this.showGallary = false;
      },
      // 关注问题发布人
      handleFocus(userId){
        if(!localStorage.id){
          this.$Tool.loginGoBack({
            returnpage:"/wendaList",
            query:{id:this.id},
            name:"wendaList",
            call:()=>{
              this.conFocus(userId);
            }
          });
          return;
        }
        this.conFocus(userId);
      },
      conFocus(userId){
        followService.doFollow(userId, (data) =>{
          if(data && data.status == "success") {
            if(data.result == 1){
              this.$vux.toast.show({
                text:'关注成功'
              });
              this.focusState = true;
              this.focusColor = true;
              messageService.sendMessage(userId, "focus", this.id, 1);
            }else{
              this.$vux.toast.show({
                text:"取消关注"
              });
              this.focusState = false;
              this.focusColor = false;
            }
          }
        });
      },
      // 分享问题
      handleShare(){
        this.shareShow= true;
        let reg = /[^\u4e00-\u9fa5]+/g;
        let tempDesc = this.wenda.description.replace(reg,"");
        this.shareDesc = {
          href:config.share + '/#/detail' + location.href.substring(location.href.indexOf('?')),
          title: this.wenda.title,
          description: tempDesc.substring(0,80),
        }
        if(this.imgArr.length){
          this.shareDesc['thumbs'] = [this.fileRoot + this.imgArr[0]];
        }
        if(!this.shareDesc['thumbs']){
          this.shareDesc['thumbs'] = require('@/assets/images/logo-icon.png');
        }
      },
      // 图片上传
      handleuploadFile(e){
        let file = e.target.files[0];
        if(!file)return;
        this.$vux.loading.show();
        if(!this.$Tool.checkPic(file.name)) {
          this.$vux.alert.show({
            content:"图片格式有误"
          });
        }
        let param = new FormData();
        param.append('file', file, file.name);
        fileService.uploadPic(param,(data)=>{
          let obj = {};
          obj.url = data.result.url;
          obj.filename = data.result.filename;
          obj.type =1;
          this.record_file.push(obj);

        });
        if(this.record_file.length >= 5) {
          this.answerObj.addShow = false;
        }
        this.$vux.loading.hide();
      },
      handleCloseAnswer(id, index){
        let thiz = this;
        this.$vux.confirm.show({
          content:"确定要删除么",
          onConfirm() {
            let data = articleService.deleteArticleById(id);
            if(data && data.status == "success") {
              thiz.answer.splice(index,1);
              thiz.$vux.alert.show({
                content:"删除成功",
              })
              thiz.wendaCount --;
              if(thiz.wendaCount == 0){
                thiz.questionBool.hasAnswer = false;
                thiz.questionBool.notAnswer = true;
                thiz.notAnswer = true;
              }
              setTimeout(()=>{
                thiz.$vux.alert.hide();
              },1000)
            }else{
              thiz.$vux.alert.show({
                content:'删除失败，请重试！',
              })
            }
          }
        })
      },
      //删除上传图片
      handleRemoveImg(item){
        const thiz = this;
        this.$vux.confirm.show({
          content:'确认删除图片?',
          onConfirm () {
            thiz.$vux.loading.show();
            setTimeout(()=>{
              thiz.record_file.splice(item,1);
              thiz.$vux.loading.hide();
              thiz.$vux.toast.show({
                text:'删除成功'
              });
              if(thiz.record_file.length <= 5){
                thiz.answerObj.addShow = true;
              }
            },600);
          }
        });

      },

      // 收藏问题
      handleCollect(){
        if(!localStorage.id) {
          this.$Tool.loginGoBack({
            returnpage: "/wendaList",
            query:{id:this.id,item:JSON.stringify(this.wenda)},
            name:'wendaList',
            call:()=>{
              this.collect();
            }
          });
          return;
        }
        this.collect();
      },
      collect(){
        let data = wdcollectService.wdCollect(this.wenda.id);
        if(data && data.status == "success") {
          if(data.result == 1) {
            messageService.sendMessage(this.wenda.author,"collect",this.id,1);
            this.collectIcon = true;
            this.collectState = true;
            this.collectCount++;
            if(this.collectCount > 0) {
              this.questionBool.hasCollect = true;
              this.questionBool.notCollect = false;
            }
          }else{
            this.collectIcon = false;
            this.collectState = false;
            this.collectCount--;
            if(this.collectCount <= 0) {
              this.questionBool.hasCollect = false;
              this.questionBool.notCollect = true;
            }
          }
        }
      },
      //弹出回答框
      handleAnswer(){
        if(!localStorage.id) {
          this.$Tool.loginGoBack({
            returnpage: "/wendaList",
            query:{id:this.id,item:JSON.stringify(this.wenda)},
            name:'wendaList',
            call:()=>{}
          });
          return;
        }
        this.answerObj.show =true;
      },
      handleReport(){
        if(!localStorage.id) {
          this.$Tool.loginGoBack({
            returnpage: "/wendaList",
            query:{id:this.id,item:JSON.stringify(this.wenda)},
            name:'wendaList',
            call:()=>{}
          });
          return;
        }
        this.reportShow = true;
      },
      handleSendReport(){

        if(!this.reportreasion){return;}
        let reportInfo;
        if(this.reportreasion != "拉黑该用户并屏蔽其内容") {
          reportInfo = {
            itemid: this.id,
            reportuserid:this.wenda.userid,
            reportreasion:this.reportreasion,
            type:2
          };
        }else{
          // 拉黑回答作者
          userService.blacklist(this.wenda.userid,data=>{
            if(data && data.status == "success") {
              let temp = [];
              if (localStorage.blacklist) {
                temp = JSON.parse(localStorage.blacklist);
                temp.push(this.wenda.userid);
              }else{
                temp = [this.wenda.userid];
              }
              this.$store.commit("setBlacklist",temp);
              this.$vux.alert.show({
                content:'已将该用户拉黑并为您屏蔽其相关内容',
              });
            }else{
              this.$vux.alert.show({
                content:'操作失败，请稍后再试！',
              });
            }
          });
        }

        if(this.reportreasion != "拉黑该用户并屏蔽其内容") {
          let res = reportService.doReport(reportInfo);
          if (res && res.status === "success") {
            this.$vux.alert.show({
              content:'感谢您的反馈，我们会着实核查！',
            })
          }else{
            this.$vux.alert.show({
              content:'操作失败，请稍后再试！',
            })
          }
        }
        this.reportShow = false;
        this.reportreasion = "";



      },
      //取消回答框
      handleCancel(){
        this.reportShow = false;
        this.reportreasion = "";
        this.answerObj.show = false;
        this.record.content = "";
        this.record_file = [];
        this.answerObj.addShow = true;
        },

      // 发布回答
      handlePublish(){
        if(!this.$Tool.checkInput(this.record.content)) {
          this.record.content = this.$Tool.replaceNo(this.record.content);
          this.$vux.alert.show({
            content:'内容含有非法字符，已为您删除，请确认'
          });
          return;
        }

        if(!this.record.content){
          this.$vux.toast.text('回答不能为空', 'middle')
          return;
        }
        this.record.author = Number(localStorage.id || 0);
        let pid =this.wenda.id;
        this.record.parentid = pid;
        this.record.state = 3;
        let data = articleService.publishArticle(this.record, this.record_file);
        if(data && data.status == "success") {
          this.$vux.alert.show({
            content:'发布成功'
          });
          this.init();
          this.record_file = [];
          this.record.content ="";
          this.answerObj.addShow=false;
          this.answerObj.addShow = true;
          this.wendaCount++;
          if(this.wendaCount > 0) {
            this.questionBool.hasAnswer = true;
            this.questionBool.notAnswer = false;
          }
          setTimeout(()=>{
            this.$vux.alert.hide();
          },800);
          this.answerObj.show = false;
        }else{
          this.$vux.alert.show({
            content:'发布失败'
          });
        }

      },
      //监听文本框
      handelInput(){
        if(this.record.content.length >= 1){
          this.fabuColor = true;
        }else{
          this.fabuColor = false;
        }
      },
      goAnswerDetail(wenda,item){
        if (!this.$store.state.isScolling) {
          this.$Tool.goPage({
            name:'wendaDetail',
            query:{
              wenda:JSON.stringify(wenda),
              item:JSON.stringify(item),
              detailType:this.detailType
            },
          })
        }
      },

    },
    watch:{
      shareShow:{
        handler(newVal, oldVal) {
          if(newVal.Terms == true) {
            window.history.pushState(null, null, document.URL);
          }
        },
        deep: true
      },
      showGallary:{
        handler(newVal, oldVal) {
          if(newVal.Terms == true) {
            window.history.pushState(null, null, document.URL);
          }
        },
        deep: true
      },
      reportShow:{
        handler(newVal, oldVal) {
          if(newVal.Terms == true) {
            window.history.pushState(null, null, document.URL);
          }
        },
        deep: true
      },
      'answerObj.show':{
        handler(newVal, oldVal) {
          if(newVal.Terms == true) {
            window.history.pushState(null, null, document.URL);
          }
        },
        deep: true
      }
    },
    computed:{
      isBlacklist(){
        return function (item) {
          return this.$store.state.blacklist.includes(item);
        }
      },
    },

  }
</script>

<style lang="less" scoped>
  .mask{
    position: absolute;
    background: #fafafa;
  }
  .wendaList{
    position: relative;
    height: calc(100% - 2.38rem);
    overflow: hidden;
    overflow-y: auto;
    background-color: #f3f4f5;
    .wendaList-current{
      padding: 0 .3rem;
      background-color: #fff;
      margin-bottom: .1rem;
      .user{
        padding-top: .2rem;
        line-height: .75rem;
        font-size: .32rem;
        letter-spacing: .02rem;
        .user-bar{
          img{
            width: .75rem;
            height: .75rem;
            margin-right: .15rem;
            border-radius: 50%;
          }
          span{
            font-weight: 700;
          }
        }
        .user-focus{
          font-weight: 600;
        }
        .default-color{
          color:#999;
        }
        .active-color{
          color: #d96363;
        }
      }
      .title{
        padding: .15rem 0;
        font-size: .38rem;
        line-height: .58rem;
        letter-spacing: .02rem;
        overflow: hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:3;
      }
      .desc{
        position: relative;
        .desc-text{
          width: 100%;
          line-height: .48rem;
          font-size: .34rem;
          /*  overflow: hidden;
            text-overflow:ellipsis;
            display:-webkit-box;
            -webkit-box-orient:vertical;
            -webkit-line-clamp:1;*/
          letter-spacing: .02rem;
          color: #707070;
        }
        /*.open{
          position: absolute;
          top: .08rem;
          right: 0;
          font-size: .34rem;
          color: #406599;
          .iconfont{
            font-size: .28rem;
          }
          }*/
      }
      .wendaList-img{
        width: 100%;
        margin: .2rem 0;
        .item{
          display: inline-block;
          width: 33%;
          height: 1.6rem;
          margin-bottom: .02rem;
          &:last-child{
            margin-right: 0;
          }
          img {
            display: block;
            width: 100%;
            height: 100%;
            padding: .02rem;
            object-fit: cover;
          }
        }
        .bigImg{
          width: 100%;
          height: 4rem;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
      .wendaList-tip{
        line-height: .77rem;
        font-size: .32rem;
        letter-spacing: .02rem;
        color: #707070;
        .question-jubao{
          font-size: .24rem;
          .iconfont{
            font-size: .28rem;
            position: relative;
            left: .06rem;
          }
        }
      }
    }
    .wendaList-other{
      padding: .2rem .3rem .15rem .3rem;
      background-color: #fff;
      border-bottom: .02rem solid @borderColor;
      .header{
        line-height: .72rem;
        .userPhoto{
          width: .72rem;
          height: .72rem;
          margin-right: .2rem;
          border-radius: 50%;
        }
        .username{
          font-size: .3rem;
          color: #000;
        }
        .header-focus{
          font-size: .34rem;
          font-weight: 700;
          letter-spacing: .02rem;
          color: #f85959;
        }
      }
      .body{
        margin: .2rem 0;
        .body-content{
          .content{
            overflow: hidden;
            text-overflow:ellipsis;
            display:-webkit-box;
            -webkit-box-orient:vertical;
            -webkit-line-clamp:6;
            line-height: .5rem;
            font-size: .32rem;
            color: #222;
          }
        }
        .body-img{
          width:100%;
          .body-item{
            display: inline-block;
            width: 32.8%;
            height: 1.6rem;
            margin-bottom: .7%;
            margin-right: .7%;
            &:nth-child(3n){
              margin-right: 0;
            }
            img{
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
              border: .02rem solid @borderColor;
            }
          }
        }
        /*.body-read{
          display: block;
          font-size: .28rem;
          color: #9b9b9b;
          line-height: .5rem;
          }*/
      }
      .footer{
        width: 100%;
        height: .6rem;
        line-height: .6rem;
        font-size: .24rem;
        /*display: flex;*/
        color: #999;
        span{
          color: #999;
          margin-right: .08rem;
        }
        .article-remove{
          width: .45rem;
          height: .35rem;
          line-height: .32rem;
          margin-top: .125rem;
          text-align: center;
          border: .02rem solid @borderColor;
          background-color: #f1f1f1;
          border-radius: .08rem;
          .iconfont{
            font-size: .24rem;
          }
        }

        /*.item{
          flex: 1;
          text-align: center;
          color: #000;
          .iconfont{
            font-size: .4rem;
            font-weight: 500;
          }
          .icon-not-collection{
            color: #000;
          }
          .icon-collected{
            color: #f9c345;
          }
          span{
            color: #f00;
            font-size: .32rem;
            vertical-align: auto;
          }
          }*/
      }
    }
    .not-wendaList{
      width: 100%;
      height: auto;
      padding: .3rem 0;
      text-align: center;
      color: #999;
      i{
        font-size: .8rem;
      }
      span{
        display: block;
        padding: .1rem 0;
        letter-spacing: .03rem;
      }
    }
  }
  .wendaList-footer{
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    background-color: #fff;
    border-top: .02rem solid @borderColor;
    .item{
      flex: 1;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      color: #000 ;
      .iconfont{
        font-size: .42rem;
        vertical-align: top;
      }
      .icon-not-collection{
        color: #000;
      }
      .icon-collected{
        color: #f9c345;
      }
      span {
        font-size: .32rem;
      }
      &:last-child{
        color: #d60139;
      }
    }
  }
  .popup-wrap{
    .popup-header{
      position: relative;
      left: 0;
      top: 0;
      height: .95rem;
      line-height: .95rem;
      padding: 0 .3rem;
      border-bottom: .02rem solid @borderColor;
      div{
        display: inline-block;
        font-size: .3rem;
        text-align: center;
      }
      .header-cancel,.header-fabu{
        width: 1rem;
      }
      .header-fabu{
        color: #c7c7c7;
      }
      .fabuColor{
        color:#2a90d7;
      }
      .header-title{
        width: calc(100% - 2.2rem);
        letter-spacing: .02rem;
        font-size: .32rem;
        color: #e86256;
      }
    }
    .popup-body{
      width: 100%;
      background-color: #fff;
      height: calc(100vh - 2.27rem);
      overflow: hidden;
      overflow-y: auto;
      padding: 0 .3rem;
      textarea{
        padding-top: .3rem;
        min-height: 2.5rem;
        display: block;
        width: 100%;
        font-size: .3rem;
        resize: none;
        overflow-y: hidden;
        background-color: #fff;
      }
      .popup-img{
        padding: .2rem 0;
        .img{
          position: relative;
          margin-right: .12rem;
          margin-bottom: .12rem;
          display: inline-block;
          width: 2.22rem;
          height: 2.22rem;
          &:nth-child(3n){
            margin-right: 0;
          }
          img{
            display: block;
            width: 100%;
            height: 100%;
            border: .02rem solid @borderColor;
            filter: brightness(0.7);
            object-fit: cover;
          }
          .iconfont{
            position: absolute;
            z-index: 6;
            right: .09rem;
            top: .09rem;
            color: #fff;
          }
        }
        .popup-addimg{
          position: relative;
          width: 2.22rem;
          height: 2.22rem;
          text-align: center;
          background-color: #f4f5f6;
          float: left;
          label{
            position:absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            line-height: 1.86rem;
          }
          .iconfont{
            display: inline-block;
            width: 1.2rem;
            height: 1.2rem;
            font-size: 1rem;
            margin-top: .51rem;
            // font-weight: 700;
            color: #dcdcdc;
          }
        }
      }
    }
    .popup-footer{
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: .88rem ;
      line-height: .88rem;
      padding: 0 .3rem;
      border-top: .02rem solid @borderColor;
      background-color: #f4f5f6;
      .addImg{
        position: relative;
        label{
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      }
      .iconfont{
        font-size: .5rem;
        color: #444;
      }
    }
  }
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
      // padding:  0 .56rem;
      line-height: .8rem;
      font-size: .32rem;
      text-align: center;
      // color: #222;
      // border-top: .02rem solid @borderColor;
      background-color: #fff;
    }
  }

  .wendaList-wrap /deep/ .my-gallery{
    figure{
      margin-block-start: 0 !important;
      margin-block-end: 0 !important;
      margin-inline-start: 0 !important;
      margin-inline-end: 0 !important;
      img{
        display: inline-block !important;
        width: 49% !important;
        height: 2.5rem !important;
        margin-bottom: .12rem !important;
        margin-right: 2% !important;
        object-fit: cover !important;
      }
      &:nth-child(2n) img{
        margin-right: 0 !important;
      }
    }
  }
</style>

<style lang="less">
  .vux-popup-dialog{
    background-color: #fff !important;
  }
</style>
