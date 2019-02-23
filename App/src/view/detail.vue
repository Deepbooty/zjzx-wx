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
          <img :src="$Tool.headerImgFilter(artUser.imageurl)" alt="" class="uphoto uphoto-big">
          <div class="article-time-name bfc-d">
            <div class="uname">
              {{ artUser.username}}
            </div>
            <div class="ts utime">
              <time v-text="$Tool.publishTimeFormat(article.publishtime)"></time>
              <!-- <span>{{ article.classify }}</span> -->
            </div>
          </div>
          <button type="button" class="focus bfc-p fr" @click="handleDownLoad">关注</button>
        </div>
        <div class="content">
          <div class="article-content" v-if='article.content'>
            <p v-html="article.content"></p>
            <div v-if="1 === article.type" class="phone-img clearfix">
              <vue-picture-swipe :items="items" :options="{shareEl: false}"></vue-picture-swipe>

            </div>
            <p style="font-size: .24rem; color: #888;">免责声明：直击真相爱心平台，仅为有正能量和社会价值的信息提供其发布与展示，如有侵权，请及时联系我们删除，谢谢您的支持！举报热线：18756686768</p>
          </div>

          <a :href="article.sourceurl" class="see-text" v-if="sourceShow">查看原文</a>
        </div>
        <multIT v-for="(item,index) in aboutArticle" :article="item" :key="index" :ifSingle="true">
        </multIT>
        <!-- <div class="keywords">
                    <label>关键词：</label>
                    <span v-for="item in article.keywords">{{ item }}</span>
                </div> -->
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
        <li class="item"  @click="handleDownLoad">
          {{$Tool.numConvertText(likeNum)}}
          <like :likeStatus="likeStatus"></like>
        </li>
        <li class="item" @click="handleReport">
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
            <li class="hot-item clearfix" v-for="(item,index) in commentList">
              <div class="hot-userphoto fl">
                <img :src="$Tool.headerImgFilter(item.imageurl)">
              </div>
              <div class="hot-wrap fl">
                <div class="hot-header clearfix">
                  <h5 class="fl">{{item.username}}</h5>
                  <p class="hot-fabulous fr" @click.stop="handleDownLoad">
                    <var class="hot-count">{{item.likeNum}}</var>
                    <like :likeStatus="index==curLike?ifLike:0"></like>
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
                  <span class="hot-report fr"  v-if="item.douserid == userId">删除</span>
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
    <div class="article-tabBar">
      <div class="tabBar clearfix">
        <div class="article-input fl" @click="handleDownLoad">
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
          <div class="item"  @click="handleShare" style="display: none;">
            <i class="iconfont icon-share"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="pop-mask" v-show="popMask" @click="handleCancel">
    </div>
    <!-- 举报框 -->
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
          <div class="report-footer" @click="handleDownLoad">
            确定
          </div>
        </div>
      </popup>
    </div>
    <!-- 分享 -->
    <share :content="shareDesc" v-model="shareShow"></share>
  </div>
</template>

<script>
  import config from '@/lib/config/config'
  import like from '@/components/common/like'
  import gallary from "@/components/Gallary"
  // import memberList from '@/components/common/memberList'
  import netUtil from "@/service/util/netUtil"
  import listUtil from '@/service/util/listUtil'
  import userService from '@/service/userService'
  import followService from '@/service/followService'
  import praiseService from '@/service/praiseService'
  import reportService from '@/service/reportService'
  import articleService from '@/service/articleService'
  import readHistoryService from '@/service/readHistoryService'
  import articleFileService from '@/service/article_fileService'
  import articleCommentService from '@/service/article_commentService'
  import articleCollectService from '@/service/articleCollectService'
  import messageService from '@/service/messageService'
  import transmitService from '@/service/transmitService'
  import collapseTransition from "@/assets/js/elTransition"
  const downloadUrl = "https://mobile.baidu.com/item?docid=25512436&f0=search_searchContent%400_appBaseNormal%400";
  export default {
    components:{
      like,
      collapseTransition,
      memberList:() => import ('@/components/common/memberList'),
    },
    data(){
      return {
        isActive:false,
        toggleText:'展开',
        badgeShow:false,
        sourceShow:false,
        reportShow:false,
        popMask:false,
        noComment:false,
        hasComment:false,
        noReply:false,
        hasReply:false,
        collectIcon:false,
        shareShow:false,
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
        commentCon:'',
        //三级回复@的用户名
        commentConAdd:'',
        //底部评论框状态切换
        ifCommentSwitch:false,
        //评论回复显隐切换
        ifReply:false,
        //回复评论的id
        replyCommentId:Number,
        //回复评论人的id
        replyUserId:Number,
        //回复评论人的关注状态
        //评论类型：1评论，2回复
        commentType:1,
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
        //举报显隐
        ifReport:false,
        //举报数组
        reportList:Object.freeze(['淫秽色情','违法信息','营销广告','恶意攻击谩骂','拉黑该用户并屏蔽其内容'
        ]),
        //显影分享
        ifShare:false,
        //评论加载分页
        pageNum1:1,
        //回复加载分页
        pageNum2:1,
        audioSrc:[],
        index:0,
        articleImg:[],
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
        reportreasion:'',//"举报原因"
        reportType:0,//举报类型 1:文章，2:评论
        shareDesc:{
          href:'',
          title:'',
          content:'',
          thumbs:[]
        },
        aboutArticle:[],
      }
    },
    mounted(){

      this.id = this.$route.query.id;
      this.detailType = this.$route.query.detailType || 0;
      if(!localStorage.id || !localStorage.token){
        this.collectIcon = false;
        this.ifLike = false;
        this.likeStatus = false;
      }

      window.history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.onBrowserBack, false);
    },
    destroyed(){
      window.removeEventListener("popstate", this.onBrowserBack, false);
    },
    methods:{
      init(){
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
          if(this.article.sourceurl == null) {
            this.sourceShow = false;
          }else{
            this.sourceShow = true;
          }
        } else {
          this.proFail1 = true;
        }

        //获取发布人信息
        let resUserInfo = userService.getUserById(this.article.author);
        if (resUserInfo && resUserInfo.status == "success") {
          this.artUser = resUserInfo.result.user;
        }

        // 文章附件 图片
        if (this.article.type != 3) {
          articleFileService.getFileByArticle(this.article.id,(data)=>{
            if (data && data.status == "success") {
              if (this.article.type == 1) {
                let arr = data.result.filelist;
                this.items = [];
                for(let i = 0; i < arr.length; i++) {
                  let obj = {
                    src:this.fileRoot + arr[i].url,
                    thumbnail:this.fileRoot + arr[i].url,
                    w: 600,
                    h: 460,
                  };
                  this.items.push(obj);
                }
              }else if(this.article.type == 2){
                let temp = data.result.filelist[0];
                if (temp) {
                  this.playerOptions.sources[0].src = this.fileRoot + temp.url;
                  this.playerOptions.poster = this.fileRoot + temp.thumbnail;
                }else{
                  this.playerOptions.sources[0].src = '';
                  this.playerOptions.poster = '';
                }
              }
            }
          });
        }
        //获取文章点赞量
        praiseService.getPraiseCount(this.id,1,(data)=>{
          if (data && data.status == "success") {
            this.likeNum = data.result.count;;
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

        //评论滚动近底部，自动加载 一屏1080
        this.loadComment();
        this.ifLoad = false;
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
      },

      // 跳转下载页面
      handleDownLoad(){
        window.location.href = downloadUrl;
      },
      onBrowserBack(){
        if(this.reportShow || this.popMask || this.shareShow){
          this.reportShow = false;
          this.popMask = false;
          this.shareShow = false;
        }
      },


      // 爱心提示展开收起
      handleToggle(){
        this.isActive = !this.isActive;
        if(this.isActive){
          this.toggleText="收起";
          this.arrowIcon = true;
        }else{
          this.toggleText = "展开"
          this.arrowIcon = false;
        }
      },
      // 取消评论框
      handleCancel(){
        this.popMask = false;
        this.shareShow = false;
        this.reportShow = false;
      },


      // 分享
      handleShare(){
        this.shareShow= true;
        //分享内容对象
        let reg = /[^\u4e00-\u9fa5]+/g;
        let tempContent = this.article.content.replace(reg,"");
        this.shareDesc = {
          href:config.share + '/#/detail' + location.href.substring(location.href.indexOf('?')),
          title: this.article.title,
          content: tempContent.substring(0,80)
        };
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
      },


      // 点击消息滚动
      handleComment(){
        let dis = $(".detail").scrollTop() + $(".article-change").offset().top -100;
        $(".detail").animate({scrollTop:dis},100);
      },

      /**
       * 举报
       * @param  Number type 举报类型 1:文章，2:评论
       * @return {[type]}      [description]
       */
      handleReport(){
        this.reportShow = true;
        this.popMask = true;
      },


      /*----------------加载-函数---------------------*/
      // 加载评论
      loadComment(){
        // 获取文章一级评论列表
        this.ifLoadMore = true;
        let resArticleCommentList = articleCommentService.getArticleCommentPage(this.id, this.pageNum1, 10);
        if(resArticleCommentList && resArticleCommentList.status == "success") {
          if(this.pageNum1 == 1) {
            this.commentList = [];
          }
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
            this.pageNum1 ++;
          }
        } else {
          this.proFail2 = true;
        }
      },

      // 页面加载后渲染函数
      loadScroll(){
        if (!this.lock && ($(".detail").scrollTop() + $(".detail").height()) > $(".detail")[0].scrollHeight-10) {
          this.loadComment();
        }
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
                //_this.onPlayerPlay();//无效
              }
            })
          }
        }
      },
      pause(){
        this.$refs.videoPlayer.player.pause();
      },
    },
    watch:{
      id(){
        // debugger
        this.ifLoad = true;
        setTimeout(()=>{
          this.pageNum1 = 1;
          this.init();
          if (true) {}
          // this.ifLoad = false;
        },delay)
        //注：延迟时长必须在动画大于切换动画（300）
      },
      reportShow:{
        handler(newVal, oldVal) {
          if(newVal.Terms == true) {
            window.history.pushState(null, null, document.URL);
          }
        },
        deep: true
      },
      popMask:{
        handler(newVal, oldVal) {
          if(newVal.Terms == true) {
            window.history.pushState(null, null, document.URL);
          }
        },
        deep: true
      },
      shareShow:{
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
      $route(to,from) {
        // debugger
        if (to.query.id) {
          this.id = to.query.id;
          this.detailType = this.$route.query.detailType || 0;
          if(!localStorage.id || !localStorage.token){
            this.collectIcon = false;
            this.ifLike = false;
            this.likeStatus = false;
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .mask{
    position: absolute;
    background: linear-gradient(transparent 3%,#fafafa 3%);
    z-index: 999;
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
          width: 1.16rem;
          height: .56rem;
          line-height: .56rem;
          margin-top: .1rem;
          text-align: center;
          color: #fff;
          border-radius: .1rem;
          background-color: @mainColor;
          border: .02rem solid transparent;
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
  .article-menu{
    line-height: .8rem;
    background-color: #fff;
    border-bottom: .02rem solid @borderColor;
    display: flex;
    li{
      flex: 1;
      text-align: center;
    }
    .current{
      border-bottom: .04rem solid #f85959;
      color: #f85959;
    }
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
    transition: opacity 400ms

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
  .vux-popup-show{
    /*z-index: 999 !important;*/
  }
</style>
