<template>
  <div>
    <top>
      <template slot="title">{{ '文章详情' }}</template>
    </top>
    <template v-if="2 === article.type">
      <i class="iconfont icon-arrow-left" @click="this.$Tool.goBack">
      </i>
      <video-player class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions"
                    @play="onPlayerPlay()">
      </video-player>
    </template>
    <div class="mask" v-show="ifLoad">
      <loading-main></loading-main>
    </div>
    <div class="detail" @scroll="loadScroll" :style="{paddingTop:[(2 === article.type)?'3rem':0]}">
      <section class="content-wrap" v-if="!proFail1">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="publisher bfc-o">
          <router-link :to="{name:'publishedArticle',query:{userId:article.author}}">
            <img :src="$Tool.headerImgFilter(artUser.imageurl)" alt="" class="uphoto uphoto-big">
            <div class="article-time-name bfc-d">
              <div class="uname">
                {{ artUser.username}}
              </div>
              <div class="ts utime">
                <time v-text="$Tool.publishTimeFormat(article.publishtime)"></time>
              </div>
            </div>
          </router-link>
          <button type="button" class="focus bfc-p fr" v-if="userId != article.author" @click="handleDownLoad">{{focusState?'已关注':'关注'}}</button>
        </div>

          <div class="content showContent">
            <div class="article-content" v-if='article.content'>
              <p v-html="article.content"></p>
              <div v-if="1 === article.type" class="phone-img clearfix">
                <vue-picture-swipe :items="items" :options="{shareEl: false}"></vue-picture-swipe>
              </div>
              <p style="font-size: .24rem; color: #888;">免责声明：直击真相爱心平台，仅为有正能量和社会价值的信息提供其发布与展示，如有侵权，请及时联系我们删除，谢谢您的支持！举报热线：400-1106768</p>
            </div>
            <a :href="article.sourceurl" class="see-text" v-if="sourceShow">查看原文</a>
          </div>
        <multIT v-for="(item,index) in aboutArticle" :article="item" :key="index" :ifSingle="true">
        </multIT>
        <div class="love-tip">
          <p class="red">爱心提示：</p>
          <p> 诈骗在中国已涉及到各行各业，高超的诈骗手段让人防不胜防！</p>
        </div>
        <collapse-transition>
          <div class="love-tip" v-show="isActive">
            <p>全国每年累计被诈骗金额超过3000亿，许多人被骗得倾家荡产，甚至家破人亡！有毒有害食品层出不穷，假冒伪劣产品泛滥成灾，严重伤害了国人的身体健康，拐卖妇女儿童屡禁不止。</p>
            <p>我们对此深恶痛绝，鉴于此，遂开创了这个平台！</p>
            <p>
              我们希望你能通过直击真相的平台了解到有关方面的知识和技能，懂得如何更好地保护自己和家人，并能够把这个平台推荐和分享给您身边的亲朋好友，让他们尽早的远离欺骗和伤害。
            </p>
            <p>我们相信，你的一次举手之劳，可能就会挽救一个家庭甚至一个美丽的生命！</p>
            <p class="red">直击真相App：多一个人看到，就少一个人受骗！</p>
          </div>
        </collapse-transition>
        <div class="love-toggle" @click="handleToggle">
          {{toggleText}}
        </div>
      </section>
      <prompt-blank v-if="proFail1" :mes="failMes1"></prompt-blank>
      <ul class="article-change clearfix">
        <li class="item" :class="{'likeActive':likeStatus}" @click="handleDownLoad">
          {{$Tool.numConvertText(likeNum)}}
          <like :likeStatus="likeStatus"></like>
        </li>
        <li class="item" @click="handleDownLoad">
          <span>举报</span>
          <i class="iconfont icon-warning-circle"></i>
        </li>
      </ul>
      <div>
      </div>

      <div class="hot-comment">
        <div class="hot-title">热门评论</div>
        <div class="hot-content">
          <ul class="hot-list">
            <li class="hot-item clearfix" v-for="(item,index) in commentList"  v-if="!isBlacklist(item.douserid)">
              <div class="hot-userphoto fl" @click="goPerson(item.douserid)">
                <img :src="$Tool.headerImgFilter(item.imageurl)">
              </div>
              <div class="hot-wrap fl">
                <div class="hot-header clearfix">
                  <h5 class="fl" @click="goPerson(item.douserid)">{{item.username}}</h5>
                  <p class="hot-fabulous fr" :class="{'likeActive':item.ifLike}" @click="handleDownLoad">
                    <var class="hot-count">{{item.likeNum}}</var>
                    <like :likeStatus="item.ifLike" :key='index'></like>
                  </p>
                </div>
                <div class="hot-body clearfix">
                  <p class="hot-text">
                    {{item.content}}
                  </p>
                </div>
                <div class="hot-footer clearfix">
                  <div class="fl">
                    <span class="hot-time">{{$Tool.publishTimeFormat(item.commenttime)}}</span>
                    <span class="hot-point">•</span>
                    <span class="hot-reply" @click="handleDownLoad">
                      <var>{{item.replyCount}}</var>回复
                    </span>
                  </div>
                  <!-- <span class="hot-report fr">举报</span> -->
                  <span class="hot-report fr"  v-if="item.douserid == userId" @click.stop="handleDelete(item.id, index, 1)" >删除</span>
                </div>
              </div>
            </li>
          </ul>
          <prompt-blank v-if="proFail2" :mes="failMes2"></prompt-blank>
          <load-more :show-loading="false" :tip="loadText" v-show="ifLoadMore"></load-more>
        </div>
      </div>
    </div>
    <!-- 伪评论框 -->
    <div class="article-tabBar" v-show="inputToggle">
      <div class="tabBar clearfix">
        <div class="article-input fl" @click="handleOpenInput">
          <i class="iconfont icon-comment"></i>
          <span>写评论...</span>
          <i class="iconfont icon-biaoqing"></i>
        </div>
        <div class="article-icon fr">
          <div class="item msg-item" @click="handleComment">
            <i class="iconfont icon-xiaoxi1"></i>
            <span class="badge" v-show="badgeShow">{{commentNum}}</span>
          </div>
          <div class="item" @click="handleDownLoad">
            <i class="iconfont" :class="collectIcon ? 'icon-collected' : 'icon-not-collection'"></i>
          </div>
          <!--  <div class="item"  @click="handleShare">
              <i class="iconfont icon-share"></i>
            </div>-->
        </div>
      </div>
    </div>
    <div class="pop-mask" v-show="popMask" @click="handleCancel">
    </div>
    <!--评论框-->
    <div v-transfer-dom class="transdom">
      <popup v-model="popList.show" style="z-index: 588;">
        <div class="popup-wrap">
          <div class="popup-area">
            <textarea
              :placeholder="popList.placeholder"
              v-model.trim="popList.desc"
              @input="handleDesc"
              autofocus
              ref="popFocus" maxlength="300">
              </textarea>
          </div>
          <div class="popup-btn clearfix">
            <button type="button" class="popup-cancel fl" @click="handleCancel">取消</button>
            <button type="button" class="popup-send fr" :class="{popupActive:popList.popupActive}" @click="handleDownLoad">发布</button>
          </div>
        </div>
      </popup>
    </div>
    <!-- 分享 -->
    <!--<share :content="shareDesc" v-model="shareShow"></share>-->
  </div>
</template>
<script>
  import config from '@/lib/config/config'
  import like from '@/components/common/like'
  import netUtil from "@/service/util/netUtil"
  import listUtil from '@/service/util/listUtil'
  import wxUtil from '@/service/util/wxUtil'
  import userService from '@/service/userService'
  import followService from '@/service/followService'
  import praiseService from '@/service/praiseService'
  import articleService from '@/service/articleService'
  import readHistoryService from '@/service/readHistoryService'
  import articleFileService from '@/service/article_fileService'
  import articleCommentService from '@/service/article_commentService'
  import articleCollectService from '@/service/articleCollectService'
  import collapseTransition from "@/assets/js/elTransition"
  export default {
    components:{
      like,
      collapseTransition
    },
    data(){
      return {
        isActive:false,
        toggleText:'展开',
        badgeShow:false,
        sourceShow:false,
        reportToggle:true,
        popMask:false,
        noZan:false,
        hasZan:false,
        noReply:false,
        hasReply:false,
        collectIcon:false,
        collectToggle:{
          notcollect:true,
          collected:false
        },
        shareShow:false,
        inputToggle:true,
        popList:{
          show:false,
          desc:'',
          placeholder:'请文明发言，遵守评论规则...',
          popupActive:false
        },
        ifLoadMore:false,
        userId:localStorage.id,
        id:0,//文章id =>article.id
        detailType:0,
        fileRoot:config.fileRoot+'/',
        focusState:false,
        article:{
          id:0,
          title:"",
          content:"",
          author:0,
          type:2,
          sourceurl:'',
          publishtime:"发布时间",
          publisharea:"发布地区",
        },
        artUser:{
          username:'',
          imageurl:'',
        },
        ArticleFile:[],
        items:[],
        commentList:[],
        replyList:[],
        proFail1:false,
        proFail2:false,
        failMes1:"获取内容失败",
        failMes2:"获取评论失败",
        //点赞
        curLike:Number,
        //点赞动画
        ifLike:false,
        //评论删除
        ifDeleteCom:false,
        //是否收藏
        // ifCollect:false,
        //文章点赞量
        likeNum:0,
        //评论总量
        commentNum:0,
        //点赞状态
        likeStatus:false,
        //显影分享
        ifShare:false,
        //评论加载分页
        pageNumComment:1,
        index:0,
        iconShow:false,
        icon:'icon-touting',
        tag:false,
        //是否加载
        ifLoad:false,
        //加载锁
        lock:false,
        //load文字提示
        loadText:"正在加载",
        // 视频
        playerOptions : {
          // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          // autoplay: false, //如果true,浏览器准备好时开始回放。
          // muted: false, // 默认情况下将会消除任何音频。
          // loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.jsplayer将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [
            {
              type: "video/mp4",
              src: "" //url地址
            }
          ],
          poster: "", //你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: false,
            durationDisplay: false,
            remainingTimeDisplay: false,
            fullscreenToggle: true //全屏按钮
          }
        },
        shareDesc:{
          href:'',
          title:'',
          content:'',
          thumbs:[]
        },
        aboutArticle:[],
        scrollTop:0,
        shareObj:{
          title:"",
          desc:"",
          link:"",
          imgUrl:[],
          type:"",
          dataUrl:""
        }
      }
    },
    mounted(){
      this.id = this.$route.query.id;
      this.detailType = this.$route.query.detailType || 0;
      if(!localStorage.id || !localStorage.token){
        this.focusState = false;
        this.collectIcon = false;
        this.ifLike = false;
        this.likeStatus = false;
      }
    },

    methods:{

      init(){
        if (!this.id) {
          this.$vux.alert.show({
            content: '获取出错，请返回！',
          });
          this.$Tool.goBack();
          return;
        }
        // this.ifLoad = true;
        //获取文章信息
        let resArticleDetail = articleService.getArticleById(this.id);
        if (resArticleDetail&&resArticleDetail.status == "success") {
          if (!resArticleDetail.record) {
            this.$vux.confirm.show({
              content:'找不到该记录或已删除',
              showCancelButton:false,
              onConfirm () {
                GoTruth.ifLoad = false
                // FIXME:顶部返回待完善，正常应该是返回上级页面,不应直接返回首页
                // TODO:顶部返回完善后使用 GoTruth.$router.back()
                GoTruth.$Tool.goPage({name:'home'});
              }
            })
            return
          }
          this.article = resArticleDetail.record;
          if(!this.article.content){
            this.iconShow = false;
          }else{
            this.iconShow = true;
          }
          if(this.article.sourceurl == null) {
            this.sourceShow = false;
          }else{
            this.sourceShow = true;
          }
        } else {
          this.proFail1 = true;
        }
        //添加阅读记录
        readHistoryService.addReadHistory(this.id,(data)=>{});
        // if (resAddReadHistory && resAddReadHistory.status == "success") {
        // }

        //获取发布人信息
        let resUserInfo = userService.getUserById(this.article.author);
        if (resUserInfo && resUserInfo.status == "success") {
          this.artUser = resUserInfo.result.user;
        }
        // 是否关注发布人
        if (localStorage.getItem('token')) {
          followService.testFollow(this.article.author,(data)=>{
            if (data && data.status == "success") {
              if (data.result == 1) {
                this.focusState = true;
              } else {
                this.focusState = false;
              }
            }
          });
        }
        let fileData = articleFileService.getFileByArticle(this.article.id);
        if (fileData && fileData.status == "success") {
          if (this.article.type == 1) {
            let arr = fileData.result.filelist;
            let items = [];
            for(let i = 0; i < arr.length; i++) {
              let obj = {
                src:this.fileRoot + arr[i].url,
                thumbnail:this.fileRoot + arr[i].url,
                w: 600,
                h: 420,
              };
              items.push(obj);
              this.items = items;
            }

          }else if(this.article.type == 2){
            let temp = fileData.result.filelist[0];
            if (temp) {
              this.playerOptions.sources[0].src = this.fileRoot + temp.url;
              this.playerOptions.poster = this.fileRoot + temp.thumbnail;
            }else{
              this.playerOptions.sources[0].src = '';
              this.playerOptions.poster = '';
            }
          }
        }

        //获取文章点赞量
        praiseService.getPraiseCount(this.id,1,(data)=>{
          if (data && data.status == "success") {
            this.likeNum = data.result.count;;
          }
        });
        //用户是否给文章点赞
        praiseService.testPraise(this.id,1,(data)=>{
          if (data && data.status == "success") {
            if (data.result == 1) {
              this.likeStatus = true;
            } else {
              this.likeStatus = false;
            }
          }
        });
        //获取评论数量
        articleCommentService.getArticleCommentCount(this.id,(data)=>{
          // console.log(data)
          if (data.status == "success") {
            this.commentNum = this.$Tool.numConvertText(data.result.count);
            if(this.commentNum == 0) {
              this.badgeShow = false;
            }else{
              this.badgeShow = true;
            }
          }
        });

        //是否收藏
        articleCollectService.testCollect(this.id,(data)=>{
          if (data && data.status == "success") {
            if (data.result == 1 ) {
              this.collectIcon = true;
            } else {
              this.collectIcon = false;
            }
          }
        });
        //评论滚动近底部，自动加载 一屏1080
        this.loadComment();
        // 获取文章相关推荐
        if (this.article.type != 2) {
          articleService.getTjwz(this.article.classify,data=>{
            if (data && data.status == "success") {
              // console.log(data)
              this.aboutArticle = data.recordList;
            }
          })
        }else{
          // 获取视频相关推荐
          articleService.getTjsp(this.article.classify,data=>{
            if (data && data.status == "success") {
              this.aboutArticle = data.recordList;
            }
          })
        }
        this.ifLoad = false;

        // 分享
        // 分享内容对象
        let reg = /[^\u4e00-\u9fa5]+/g;
        let tempContent = this.article.content.replace(reg,"");
        let url = window.location.href;
        if(window.location.hash.length){
          url = url.substr(0, url.indexOf(location.hash));
        }

        let link = `http://wx.zjzx.xyz/pages/index.html#/detail?id=${encodeURIComponent(this.article.id)}&detailType=false`;
        this.shareObj = {
          title: this.article.title,
          desc: tempContent.substring(0, 80),
          link:link
        };
        if(this.article.type == 1){
          this.shareObj.imgUrl = this.items[0].src;
        }else if(this.article.type == 2){
          this.shareObj.imgUrl = this.playerOptions.poster;
        }else{
          this.shareObj.imgUrl = this.$Tool.extractImg(this.article.content,1)[0];
        }
        if(!this.shareObj.imgUrl){
          this.shareObj.imgUrl = "http://www.zjzx.xyz/img/index-logo.481a2ae3.png";
        }


        wxUtil.initShare(url,this.shareObj,()=>{});
      },

      // 爱心提示展开收起
      handleToggle(){
        this.isActive = !this.isActive;
        if(this.isActive){
          this.toggleText="收起";
        }else{
          this.toggleText = "展开";
        }
      },
      // 打开评论框
      handleOpenInput(){
        this.textShow();
        this.popList.placeholder = "请文明发言，遵守评论规则...";
      },
      // 取消评论框
      handleCancel(){
        this.popList.desc = "";
        this.popList.show = false;
        this.popMask = false;
        this.shareShow = false;
      },

      // 评论框input事件
      handleDesc(){
        if(this.popList.desc) {
          this.popList.popupActive = true;
        }else{
          this.popList.popupActive = false;
        }
      },
      goPerson(userId){
        this.$Tool.goPage({name:'publishedArticle',query:{userId}})
      },

      // 进入下载页
      handleDownLoad(){
        this.popList.show = false;
        this.popList.desc = "";
        window.location.href="download.html"
      },
      // 删除评论
      handleDelete(itemid, index, type){
        const thiz = this;
        let deleteData = articleCommentService.deleteArticleConmon(itemid);
        this.$vux.confirm.show({
          content:'确认删除评论？',
          onConfirm(){
            thiz.$vux.loading.show();
            if(deleteData && deleteData.status == "success") {
              setTimeout(()=>{
                if(type == 1) {
                  thiz.commentList.splice(index,1);
                  thiz.commentNum --;
                  thiz.$vux.loading.hide();
                  thiz.$vux.toast.show({
                    text:'删除成功'
                  });
                  if(thiz.commentList.length <= 0) {
                    thiz.proFail2 = true;
                    thiz.ifLoadMore = false;
                    thiz.badgeShow = false;
                  }
                }
              },500);
            }
          }
        })
      },

      // 分享
      /*    handleShare(){
            this.shareShow= true;
            //分享内容对象
            let reg = /[^\u4e00-\u9fa5]+/g;
            let tempContent = this.article.content.replace(reg,"");
            this.shareDesc = {
              href:config.share + '/#/detail' + location.href.substring(location.href.indexOf('?')),
              title: this.article.title,
              content: tempContent.substring(0,80)
            };
            console.log(this.shareDesc)
            if (this.article.type == 3) {
              let temp = this.$Tool.extractImg(this.article.content,1);
              this.shareDesc['thumbs'] = temp[0];
            }else if(this.ArticleFile.length) {
              this.shareDesc['thumbs'] = [this.fileRoot + this.ArticleFile[0]['url']];
            }else{
              this.shareDesc['thumbs'] = [this.fileRoot + this.playerOptions.poster];
            }
            if (!this.shareDesc['thumbs']) {
              this.shareDesc['thumbs'] = require('@/assets/images/logo-icon.png');
            }
          },*/
      //二级三级回复

      // 点击消息滚动
      handleComment(){
        let dis = $(".detail").scrollTop() + $(".article-change").offset().top -100;
        $(".detail").animate({scrollTop:dis},100);
      },


      /**
       * 提交举报
       * @return {[type]}      [description]
       */

      /*----------------加载-函数---------------------*/
      // 加载评论
      loadComment(){
        // 获取文章一级评论列表
        this.ifLoadMore = true;
        let resArticleCommentList = articleCommentService.getArticleCommentPage(this.id, this.pageNumComment, 10);
        if(this.pageNumComment == 1) {
          this.commentList = [];
        }
        if(resArticleCommentList && resArticleCommentList.status == "success") {
          listUtil.appendList(this.commentList,resArticleCommentList.list.list);
          listUtil.asyncSetListPropty(resArticleCommentList.list.list,(item)=>{
            // 获取文章一级评论人信息
            let resUserInfo = userService.getUserById(item.douserid);
            if (resUserInfo && resUserInfo.status == "success") {
              this.$set(item, "imageurl", resUserInfo.result.user.imageurl);
              this.$set(item, "username", resUserInfo.result.user.username);
            }
            // 获取文章一级评论回复数量
            let resGetReplyCount = articleCommentService.getReplyCount(item.id);
            if(resGetReplyCount && resGetReplyCount.status == "success") {
              this.$set(item, 'replyCount', resGetReplyCount.result.count);
            }
            // 获取文章一级评论点赞数
            let resGetPraiseCount = praiseService.getPraiseCount(item.id,2);
            if(resGetPraiseCount && resGetPraiseCount.status == "success") {
              this.$set(item,"likeNum",resGetPraiseCount.result.count);
            }

            //用户是否给文章一级评论点赞
            let resTestPraise = praiseService.testPraise(item.id,2)
            if (resTestPraise && resTestPraise.status == "success") {
              if (resTestPraise.result == 1) {
                this.$set(item,"ifLike",true);
              } else {
                this.$set(item,"ifLike",false);
              }
            }
          });
          if (this.commentList.length == 0) {
            this.lock = true;
            this.proFail2 = true;
            this.failMes2 = "暂无评论，来抢第一个沙发吧";
            this.ifLoadMore = false;
          } else if (this.commentList.length < 10 || this.commentNum == this.commentList.length ) {
            this.lock = true;
            this.ifLoadMore = true;
            this.proFail2 = false;
            this.loadText = "已加载全部";
          } else {
            this.pageNumComment ++;
          }
        } else {
          this.proFail2 = true;
        }
      },
      // 页面加载后渲染函数
      loadScroll(e){
        this.scrollTop = $(e.target).scrollTop();
        if (!this.lock && ($(".detail").scrollTop() + $(".detail").innerHeight()) > $(".detail")[0].scrollHeight - 10) {
          this.loadComment();
        }
      },
      textShow(){
        this.popList.show = true;
        this.$refs.popFocus.focus();
      },
      onPlayerPlay(){
        if (!this.$store.state.notWifi) {
          let _this = this,
            net = {};
          try{
            net = netUtil.getNetInfo();
          }catch(e){
          }
          if (net.network !="WiFi网络") {
            this.pause();
            this.$vux.confirm.show({
              title:"温馨提示",
              content:"当前处于非WIFI网络下，是否继续播放",
              onConfirm(){
                _this.$store.state.notWifi = true;
              }
            })
          }
        }
      },
      pause(){
        this.$refs.videoPlayer.player.pause();
      },
    },

    computed:{
      // 判断是否黑名单
      isBlacklist(){
        return function (item) {
          return this.$store.state.blacklist.includes(item);
        }
      }
    },
    beforeRouteLeave(to, from , next){
      if(this.popList.show == true || this.popMask == true || this.shareShow == true){
        this.popList.show =false;
        this.popMask = false;
        this.shareShow =false;
        next(false);
      } else{

        next()
      }
    },
    watch:{
      id(){
        this.proFail1 = false;
        this.ifLoad = true;
        $(".detail").scrollTop(0);
        setTimeout(()=>{
          this.pageNumComment = 1;
          this.init();
          // this.ifLoad = false;

        },delay);

        //注：延迟时长必须在动画大于切换动画（300）
      },
      $route(to,from) {
        if (to.query.id) {
          this.id = to.query.id;
          $(".detail").scrollTop(this.scrollTop)
          this.detailType = this.$route.query.detailType || 0;
          if(!localStorage.id || !localStorage.token){
            this.focusState = false;
            this.collectIcon = false;
            this.likeStatus = false;
          }
          this.ifLike = false;
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  .mask{
    position: absolute;
    /*background: linear-gradient(transparent 3%,#fafafa 3%);*/
    z-index: 999;
    background-color: #fafafa;
  }
  .detail{
    position: relative;
    height: calc(100% - 1.5rem);
    overflow: hidden;
    overflow-y: auto;
    padding: 0 .3rem .88rem .3rem;
    background-color: #fff;
    .content-wrap{
      .article-title{
        padding-top: .4rem;
        // padding-bottom: .2rem;
        font-size: .42rem;
        line-height: .58rem;
        letter-spacing: .02rem;
        overflow: hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:3;
      }
      .publisher{
        padding: .45rem 0;
        .uphoto{
          width: .8rem;
          height: .8rem;
          border-radius: 50%;
          margin-right: .2rem;
        }
        .article-time-name{
          width: calc(100% - 2.78rem);
          margin-right: .22rem;
          .uname{
            padding-top: .1rem;
            font-size: .28rem;
          }
          .utime{
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: .24rem;
            padding-top: .2rem;
            color: #999;

          }
        }
        .focus{
          padding: .1rem .2rem;
          margin-top: .1rem;
          vertical-align: middle;
          text-align: center;
          color: #fff;
          border-radius: .1rem;
          background-color: @mainColor;
        }
        .btnActive{
          background-color: #fafafa;
          border: .02rem solid #bbb;
          color: #bbb;
        }
      }
      .content{

        // padding-bottom: .45rem;
        .article-content{
          // padding-bottom: .4rem;
          line-height: .5rem;
          p{
            font-size: .34rem;
            line-height: .5rem !important;
            margin-bottom: .3rem !important;
          }
          img{
            display: inline-block;
            width: 100%;
            margin-bottom: .4rem !important;
            border-radius: .08rem;
            padding: .04rem;
            border: .02rem solid @borderColor;
            text-align: center;
          }
        }
        // .phone-content{
        // padding-bottom: .4rem;
        .phone-img{
          width: 100%;
          .tel-img{
            display: inline-block;
            width: 49.5%;
            height: 2.4rem;
            margin-right: .8%;
            margin-bottom: .8%;
            &:nth-child(2n){
              margin-right: 0;
            }
            img{
              display: block;
              width: 100%;
              height: 100%;
              padding: 0;
              border: .02rem solid @borderColor;
              -o-object-fit: cover;
              object-fit: cover;
            }
          }
        }
        // }
        .see-text{
          letter-spacing: .02rem;
          line-height: .5rem;
          color: #999;
        }

      }
      .hideContent{
        background-color: #fff;
        padding-bottom: 0;    /* 方便渐变层遮挡 */
        position: relative;    /* 用于子元素定位 */
        margin-bottom: .5rem;
        .summary{
          overflow: hidden;    /* 隐藏溢出内容 */
          text-overflow: clip;    /* 修剪文本 */
          display: -webkit-box;    /* 弹性布局 */
          -webkit-box-orient: vertical;    /* 从上向下垂直排列子元素 */
          -webkit-line-clamp: 4;    /* 限制文本仅显示前三行 */
          p{
            line-height: .8rem;

          }

        }
        .showBtn{
          width: 100%;    /* 与背景宽度一致 */
          height: 2rem;
          position: absolute;    /* 相对父元素定位 */
          top: 1rem;    /* 刚好遮挡在最后两行 */
          left: 0;
          z-index: 0;    /* 正序堆叠，覆盖在p元素上方 */
          text-align: center;
          background: linear-gradient(rgba(233,236,239,.5), white);
          .openBtn{
            width: 100%;
            padding: .2rem 0;
            position: absolute;
            bottom: 1.2rem;
            text-align: center;
            .iconfont{
              display: inline-block;
              font-size: .35rem;
              color: #fa6304;
            }
          }

          .download-btn{
            position: absolute;
            left: 0;
            bottom: .6rem;
            width: 100%;
            height: .65rem;
            line-height: .65rem;
            text-align: center;
            border-radius: .4rem;
            letter-spacing: .02rem;
            background: linear-gradient(to bottom left, #ffb037,#ff9237,#ff6c37);
            color: #fff;
          }
        }
      }
      .keywords{
        margin: .6rem 0;
        label{
          color: #1674e9;
        }
        span{
          font-size: .24rem;
          padding: .13rem .22rem;
          margin-right: .2rem;
          border-radius: .25rem;
          color: #999;
          background-color: #f5f7f9;
        }
      }
    }
  }
  .article-change{
    border-bottom:.02rem solid @borderColor;
    padding-bottom: .56rem;
    display: flex;
    justify-content: center;
    .item{
      width: 1.84rem;
      height: .64rem;
      line-height: .64rem;
      margin-right: .5rem;
      border: .02rem solid #d9d9d9;
      border-radius: .3rem;
      text-align: center;
      &:last-child{
        margin-right: 0;
      }
      .iconfont{
        font-size: .32rem;
        // color: #222;
        padding-right: .03rem;
      }
      span{
        vertical-align: top;
        font-size: .24rem;
        color: #222;
      }
    }
  }
  .likeActive{
    color: #f40;
  }
  .hot-comment{
    padding-top: .56rem;
    .hot-title{
      position: relative;
      text-indent: .2rem;
      font-size: .3rem;
      font-weight: 700;
      letter-spacing: .02rem;
      &:before{
        position: absolute;
        content:'';
        display: block;
        width: .08rem;
        height: .3rem;
        background-color: #129aee;
      }
    }
    .hot-content{
      padding-top: .56rem;
      .hot-item{
        margin-bottom: .5rem;
        .hot-userphoto{
          width: .66rem;
          height: .66rem;
          margin-right: .25rem;
          border-radius: 50%;
          img{
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }
      .hot-wrap{
        width: calc(100% - .91rem);
        .hot-header{
          height: .66rem;
          line-height: .66rem;
          font-size: .24rem;
          h5{
            color: #3e609e;
          }
          .iconfont{
            font-size: .4rem;
            color: #999;
          }
          .hot-count{
            color: #999;
            vertical-align: top;
          }
        }
        .hot-body{
          position: relative;
          padding-top: .1rem;
          .hot-text{
            line-height: .45rem;
            // overflow:hidden;
            // text-overflow:ellipsis;
            // display:-webkit-box;
            // -webkit-box-orient:vertical;
            // -webkit-line-clamp:4;
          }
          .hot-open{
            position: absolute;
            right: 0;
            background-color: #fff;
            bottom: -.08rem;
            line-height: .5rem;
            font-size: .24rem;
            color: #1674e9;
          }
        }
        .hot-footer{
          line-height: .4rem;
          font-size: .24rem;
          padding: .2rem 0;
          .hot-time{
            color: #999;
          }
          .hot-point{
            padding: 0 .08rem;
            color: #999;
          }
          .hot-reply{
            padding: .1rem .2rem;
            border-radius: .3rem;
            color: #666;
            background-color: #f1f1f1;
            var{
              margin-right: .04rem;
            }
          }
          .hot-report{
            color: #999;
          }
        }
      }
    }
  }
  .article-tabBar {
    width: 100%;
    height: .88rem;
    position: fixed;
    z-index: 566;
    left: 0;
    bottom: 0;
    padding: 0 .3rem;
    background-color: #fafafa;
    border-top: .02rem solid #d8d8d8;
    .article-input {
      width: 3rem;
      height: .56rem;
      position: relative;
      line-height: .56rem;
      margin-top: .16rem;
      padding-left: .26rem;
      padding-right: .13rem;
      border: .02rem solid @borderColor;
      border-radius: .3rem;
      background-color: #f3f4f5;
      .icon-comment{
        padding-right: .14rem;
        color: #222;
      }
      span{
        font-size: .24rem;
        color: #222;
      }
      .icon-biaoqing{
        position: absolute;
        right: .13rem;
        font-size: .36rem;
        color: #9fa7b3;
      }
    }
    .article-icon{
      display: flex;
      line-height: .88rem;
      .item{
        margin-right: .56rem;
        &:last-child{
          margin-right: 0;
        }
        .iconfont{
          font-size: .4rem;
        }
        .icon-collected{
          color: #f9c345;
        }
        .icon-not-collection{
          color: #000;
        }
      }
      .msg-item {
        position: relative;
        .iconfont{
          position: absolute;
          left: -.56rem;
        }
        .badge{
          display: inline-block;
          position: absolute;
          top: .12rem;
          left: -.42rem;
          line-height: .3rem;
          padding: 0.02rem .1rem;
          border-radius: .18rem;
          font-size: .2rem;
          background-color: @mainColor;
          transform: scale(.6);
          color: #fff;
        }
      }

    }
  }
  .popup-wrap {
    width: 100%;
    padding: .2rem;
    background-color: #f4f4f4;
    .popup-area{
      width: 100%;
      height: 1.8rem;
      margin-bottom: .2rem;
      textarea{
        width: 100%;
        height: 100%;
        background-color: #fff;
        border: .02rem solid @borderColor;
        border-radius: .2rem;
        padding: .13rem .18rem;
        font-size: .28rem;
        resize:  none;
        &::-webkit-input-placeholder{color:#999;}
        &:-moz-placeholder{color:#999;}
        &::-moz-placeholder{color:#999;}
        &:-ms-input-placeholder{color:#999;}
      }
    }
    .popup-btn{
      button{
        width: 1.2rem;
        height: .6rem;
        border: .02rem solid transparent;
        border-radius: .2rem;
      }
      .popup-cancel{
        border-color: #dadada;
        background-color: #f4f4f4;
        color: #808080;
      }
      .popup-send{
        background-color: #dadada;
        color: #fff;
      }
      .popupActive{
        background-color: #f85959;
      }
    }
  }
  .reply-wrap{
    height: 100vh;
    border-radius: .3rem .3rem 0 0;
    background-color: #fff;
    .reply-header{
      position: relative;
      left: 0;
      top: 0;
      height: .89rem;
      line-height: .89rem;
      padding: 0 .36rem;
      text-align: center;
      border-bottom: .02rem solid @borderColor;
      .iconfont {
        position: absolute;
        left: .36rem;
        font-size: .45rem;
        font-weight: 700;
      }
      span{
        letter-spacing: .02rem;
        font-size: .32rem;
      }
    }
    .reply-body{
      width: 100%;
      height: calc(100vh - 1.5rem);
      overflow-y: auto;
      // overflow: auto;
      // padding: .32rem .3rem;
      padding: .32rem .3rem 1rem .3rem;
      .reply-container{
        width: 100%;
        &:first-child{
          border-bottom: .02rem solid @borderColor;
          padding-bottom: 10px;
        }
        .reply-box{
          margin-bottom: .5rem;
        }
        .reply-img{
          width: .64rem;
          height: .64rem;
          border-radius: 50%;
          margin-right: .25rem;
          img{
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .reply-content{
          width: calc(100% - .89rem);
          .header{
            .header-desc{
              display: inline-block;
              font-size: .24rem;
              h4{
                font-weight: normal;
                color: #406599;
                // padding-bottom: .13rem;
                line-height: .5rem;
              }
              span{
                color: #979fac;
              }
            }
            // .reply-fabulous{
            //  color: #979fac;
            //  span{
            //    font-size: .24rem;
            //    margin-right: -.1rem;
            //  }
            //  .iconfont{
            //    font-size: .36rem;
            //  }
            //  .icon-weizan{
            //    color: #979fac;
            //  }
            // }
            .header-focus{
              font-weight: 700;
              font-size: .24rem;
              line-height: .5rem;
              color: #f96565;
            }
          }
          .reply-desc{
            margin: .26rem 0;
            p{
              line-height: .45rem;
            }
          }
          .reply-time-report{
            font-size: .24rem;
            color: #979fac;
          }
          .reply-time-delete{
            font-size: .24rem;
            .reply-point{
              color: #666;
              padding: 0 .15rem;
            }
          }
          .reply-footer{
            // padding: .26rem 0;
            height: 1rem;
            line-height: 1rem;
            .reply-footer-wrap{
              .reply-list{
                max-width: 1.68rem;
                height: .48rem;
                margin-top: .26rem;
                margin-right: .18rem;
                overflow: hidden;
                .reply-item{
                  float: left;
                  width: .48rem;
                  height: .48rem;
                  margin-right: .08rem;
                  border-radius: 50%;
                  img{
                    display: block;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                  }
                }
              }
              .reply-footer-desc{
                font-size: .24rem;
                color: #222;
                .iconfont{
                  font-size: .3rem;
                }
              }
            }

          }

        }
      }
      .reply-discuss{
        line-height: .8rem;
      }
      .isDiscuss{
        line-height: .8rem;
        padding-left: .89rem;
      }
    }
  }
  .reply-fabulous{
    // color: #979fac;

    span{
      font-size: .24rem;
      margin-right: -.1rem;
    }
    .iconfont{
      font-size: .36rem;
    }
    .icon-weizan{
      color: #979fac;
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
  .vux-popup-dialog{
    background-color: transparent;
  }
  .pop-mask{
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 502;
    tap-highlight-color: rgba(0, 0, 0, 0);
    transition: opacity 400ms;

  }
  .video-js .vjs-big-play-button{
    width: 2em;
    height: 2em !important;
    font-size: 2.8em;
    border-radius: 50%;
    margin: 0 !important;
    transform: translate(-50%,-50%);
  }
  .lg-preview-title{
    display: none !important;
  }
  .love-tip{
    p{
      line-height: .6rem;
      text-indent: 2em;
      color:#f36767;
    }
    .red{
      color:#f00;
      font-weight: 600;
    }
  }
  .love-toggle{
    line-height: 30px;
    background: linear-gradient(#f7ba15,#f89a1e);
    color: #fff;
    border-radius: 50px;
    margin: 10px;
    letter-spacing: .04rem;
    font-size: .32rem;
    text-align: center;
  }

  .video-player{
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .icon-arrow-left{
    color: #f1f1f1;
    font-size: .42rem;
    position: absolute;
    top: 22px;
    z-index: 2;
    width: 40px;
    line-height: 30px;
    text-align: center;
  }
  .phone-img /deep/ .my-gallery{
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

<style scoped>
  .article-content >>> p{
    line-height: .5rem !important;
    margin-bottom: .3rem !important;
  }
  .article-content >>> p img{
    display: inline-block;
    width: 100%;
    border-radius: .08rem;
    padding: .04rem;
    border: .02rem solid #e8e8e8;
    text-align: center;
  }
  .hideContent >>> p img{
    display: none;
  }
</style>
