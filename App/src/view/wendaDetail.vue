<template>
  <div>
    <top>
      <template slot="title">{{'问答详情'}}</template>
    </top>
    <div class="mask" v-show="ifLoad">
      <loading-main></loading-main>
    </div>
    <!--回答内容-->
    <div class="answer-detail" @scroll="loadScroll">
      <div class="answer-wrap">
        <div class="answer-header">
          <h1 class="question-title">{{qtitle}}</h1>
          <div class="answer-count">
            <span>{{answerCount}}条回答 <i class="iconfont icon-arrow-right"></i></span>
          </div>
        </div>
        <!--回答人的信息-->
        <div class="answer-info clearfix">
          <router-link class="answer-user fl" :to="{name:'publishedArticle',query:{userId:answer.author}}" tag="div">
            <img :src="$Tool.headerImgFilter(answerUser.imageurl)">
            <span>{{ answerUser.username}}</span>
          </router-link>
          <div class="answer-focus fr" v-if="userId != answer.author" @click="handleDownLoad">
            {{answerFocusState ? '已关注' : '关注'}}
          </div>
        </div>
        <!--问答内容-->
        <div class="answer-content" v-if="!proFail1">
          <p class="content-text">
            {{answer.content}}
          </p>
          <vue-picture-swipe :items="items" :options="{shareEl: false}"></vue-picture-swipe>

          <div class="content-time clearfix">
            <span class=" fl">创建时间 {{publishtime}}</span>
            <div class="jubao fr" @click="handleDownLoad">
              <i class="iconfont icon-warning-circle"></i>
              举报
            </div>
          </div>

        </div>
        <!--问答未获取到内容-->
        <prompt-blank v-if="proFail1" :mes="failMes1"></prompt-blank>
        <!--问答评论-->
        <div class="answer-comment">
          <div class="header clearfix">
            <span class="fl" v-if="ifComment">评论 {{answerCommentNum}}</span>
            <span class="fl" v-else style="color: #406599; font-weight: 700;">抢鲜评论</span>
            <span class="fr" v-show="answerZanBool.hasZan">赞 {{answerZanNum}}</span>
            <span class="fr" v-show="answerZanBool.notZan">抢鲜点赞</span>
          </div>
          <div class="body" v-for="(item, index) in commentList" v-if="!isBlacklist(item.douserid)">
            <div class="comment-item clearfix">
              <img :src="$Tool.headerImgFilter(item.imageurl)" class="comment-userPhoto fl" @click="goPerson(item.douserid)">
              <div class="comment-wrap fl">
                <div class="comment-header clearfix">
                  <span class="username fl" @click="goPerson(item.douserid)">{{item.username}}</span>
                  <div class="comment-zan fr" :class="{'likeActive': item.ifLike}" @click="handleDownLoad">
                    <like :likeStatus="item.ifLike" :key='index'></like>
                    <span class="zan-count">{{item.likeNum}}</span>
                  </div>
                </div>
                <div class="comment-body">
                  <p class="comment-content">{{item.content}}</p>
                </div>
                <div class="comment-footer clearfix">
                  <div class="footer-left fl">
                    <span class="comment-time">{{$Tool.publishTimeFormat(item.commenttime)}}</span>
                    <span class="comment-point">•</span>
                    <span class="comment-reply" @click="handleDownLoad">
                      <var>{{item.replyCount}}</var>回复
                    </span>
                  </div>
                  <span class="footer-right fr" v-if="item.douserid == userId" v-show="deleteShow" @click="handleDeleteComment(item.id,index,1)">删除</span>
                </div>
              </div>
            </div>
          </div>
          <prompt-blank v-if="proFail2" :mes="failMes2"></prompt-blank>
          <load-more :show-loading="false" :tip="loadText" v-show="ifLoadMore"></load-more>
        </div>
      </div>
    </div>
    <!--伪评论框-->
    <div class="answer-tabBar clearfix">
      <div class="answer-input fl" @click="handleOpenInput">
        <i class="iconfont icon-comment"></i>
        <span>写评论...</span>
      </div>
      <div class="answer-icon fr">
        <div class="item-icon msg-icon" @click="handleToComment">
          <i class="iconfont icon-xiaoxi1"></i>
          <span class="answer-badge" v-show="badgeShow">{{answerCommentNum}}</span>
        </div>
        <div class="item-icon" @click="handleDownLoad">
          <i class="iconfont" :class="collectIcon ? 'icon-collected' : 'icon-not-collection'"></i>
        </div>
        <div class="item-icon" @click="handleDownLoad">
          <i class="iconfont" :class="zanIcon ? 'icon-yizan' : 'icon-weizan'"></i>
        </div>
        <div class="item-icon" @click="handleAnswerShare">
          <i class="iconfont icon-share"></i>
        </div>
      </div>
    </div>
    <!--创建遮罩层-->
    <div class="pop-mask" v-show="popMask" @click="handleCancelInput"></div>
    <!--评论弹出框-->
    <div v-transfer-dom class="answer-transfer">
      <popup v-model="answerPopObj.show" style="z-index: 588;">
        <div class="popup-wrap">
          <div class="popup-area">
            <textarea
              :placeholder="answerPopObj.placeholder"
              v-model.trim="answerPopObj.desc"
              @input="handleDescInput"
              ref="answerPopFocus" maxlength="300"></textarea>
          </div>
          <div class="popup-btn clearfix">
            <button type="button" class="popup-cancel fl" @click="handleCancelInput">取消</button>
            <button type="button" class="popup-send fr" :class="{active:answerPopObj.active}" @click="handleSendDownLoad">发布</button>
          </div>
        </div>
      </popup>
    </div>
    <!--分享弹出框-->
    <share :content="shareDesc" v-model="shareShow"></share>
  </div>
</template>

<script>
  import config from '@/lib/config/config'
  import like from '@/components/common/like'
  import interService from '@/service/interlocutionService'
  import userService from '@/service/userService'
  import followService from '@/service/followService'
  import wxUtil from '@/service/util/wxUtil'
  import articleFileService from '@/service/article_fileService'
  import articleService from '@/service/articleService'
  import articleCommentService from '@/service/article_commentService'
  import praiseService from '@/service/praiseService'
  import articleCollectService from '@/service/articleCollectService'
  import listUtil from '@/service/util/listUtil'
  export default {
    name: "wendaDetail",
    components:{
      like,
    },
    data(){
      return{
        aid:null, //回答id
        qid:null, //问题
        detailType: 0,//视图类型
        userId:localStorage.id,    //当前登录用户
        loadLock: false,  //加载锁
        fileRoot:config.fileRoot + '/',   //服务路径
        wenda:{}, //问题的对象
        answer:{},  //回答对象
        /* 回答人的姓名-头像*/
        qtitle:"",  //问题标题
        answerUser:{
          username:'',
          imageurl:''
        },
        popMask: false, //创建的遮罩层是否显示
        answerCount:0,    //回答数
        answerFocusState: false,  //回答人关注状态
        commentFocusState: false,    //评论人关注状态
        answerFile:[],  //回答内容中图片数组
        items:[],
        publishtime:'',   //回答时间
        answerCommentNum: 0,  //回答评论总数
        ifComment:false,    //是否有评论
        answerZanNum: 0,    //回答点赞总数
        deleteShow:false,
        /*回答的点赞状态*/
        answerZanBool:{
          notZan:false,
          hasZan:false,
        },
        // 评论框对象
        answerPopObj:{
          show:false,
          desc:'',
          placeholder:'请文明发言，遵守评论规则...',
          active:false
        },
        /*类型：评论(1) | 回复(1)*/
        commentPage:1,  //加载评论分页
        proFail1:false,
        proFail2:false,
        failMes1:"获取内容失败",
        failMes2:"获取评论失败",
        loadText:'正在加载...',
        ifLoadMore: false, //评论是否加载更多,
        ifLoad: false,  //回答内容是否加载
        commentList:[],   //评论列表数组
        likeNum: 0,   //问答点赞数
        ifLike: false,  //点赞动画
        commentIndex: -1,   //指定评论数组中某条评论的索引值 //展开评论回复是顶部当前索引使用
        replyCommentId:Number,    //回复评论的Id
        replyUserId:Number,     //回复评论人的id
        likeStatus: false,    //点赞状态
        zanIcon: false,   //伪评论框回答点赞状态
        collectIcon:false,   //监听收藏图标变化
        curLike:Number,   //点赞数字变化
        badgeShow: false, //伪评论框消息是否显示badge
        /*回答分享对象*/
        shareObj:{
          title:"",
          desc:"",
          link:"",
          imgUrl:[],
          type:"",
          dataUrl:""
        },
        shareShow:false,  //分享框是否显示
        replyList: [],  //回复列表
        noZan:false,  //评论有赞状态
        hasZan: false,  //评论无赞状态
        noComment:  false,  //抢鲜评论
        hasComment: false,  //有评论
        scrollTop:0
      }
    },
    activated(){
      $(".answer-detail").scrollTop(this.scrollTop);
      this.qid = this.$route.query.qid;
      this.aid = this.$route.query.aid;
      this.detailType = this.$route.query.detailType || 0;
      if(!localStorage.id || !localStorage.token){
        this.answerFocusState=false;
        this.collectIcon = false;
        this.zanIcon = false;
        this.deleteShow = false;
      }else{
        this.deleteShow = true;
      }

    },
    watch:{
      aid(){
        this.proFail1 = false;
        this.ifLoad = true;
        $(".answer-detail").scrollTop(0)
        setTimeout(()=>{
          this.commentPage = 1
          this.init();
        },delay)
      }
    },
    computed:{
      // 判断是否黑名单
      isBlacklist(){
        return function (item) {
          return this.$store.state.blacklist.includes(item);
        }
      }
    },
    methods:{
      // 页面初始渲染
      init(){
        if(!this.aid){
          this.$vux.alert.show({
            content: '获取出错，请返回！',
          });
          this.$Tool.goBack();
          return;
        }
        // 获取问题标题
        let questionData = interService.getQuestionById(this.qid);
        if(questionData && questionData.status == "success"){
          this.qtitle = questionData.record.title;
        }

        // 获取问题回答数量
        interService.getAnswerCount(this.qid, (data) =>{
          if(data && data.status == "success"){
            this.answerCount = this.$Tool.numConvertText(data.count);
          }
        });

        // 获取回答详情
        let answerData = articleService.getArticleById(this.aid);
        if(answerData && answerData.status == "success"){
          this.answer = answerData.record;
        }
        // 获取回答人信息
        let answerInfo = userService.getUserById(this.answer.author);
        if(answerInfo && answerInfo.status == "success"){
          this.answerUser = answerInfo.result.user;
        }
        // 获取发布回答时间
        this.publishtime = this.$Tool.publishTimeFormat(this.answer.publishtime);
        // 获取关注的状态
        if(localStorage.getItem('token')) {
          followService.testFollow(this.answer.author, (data)=>{
            if(data && data.status == "success") {
              if(data.result == 1) {
                this.answerFocusState =true;
              }else{
                this.answerFocusState = false;
              }
            }
          })
        }
        // 获取回答内容中图片
        let answerSrcData = articleFileService.getFileByArticle(this.aid);
        if(answerSrcData && answerSrcData.status == "success") {
          let arr = answerSrcData.result.filelist;
          this.items = [];
          for(let i =0; i < arr.length; i++){
            let obj = {
              src:this.fileRoot + arr[i].url,
              thumbnail:this.fileRoot + arr[i].url,
              w: 600,
              h: 450,
            };
            this.items.push(obj);
          }

        }

        // 获取评论回答总数
        articleCommentService.getArticleCommentCount(this.aid, (data)=>{
          if(data && data.status == "success") {
            this.answerCommentNum = this.$Tool.numConvertText(data.result.count);
          }
        });
        // 获取回答的收藏状态
        articleCollectService.testCollect(this.aid, (data)=>{
          if(data && data.status == "success") {
            if(data.result == 1) {
              this.collectIcon = true;
            }else{
              this.collectIcon = false;
            }
          }
        });
        // 获取回答点赞状态
        praiseService.testPraise(this.aid, 1, (data)=>{
          if(data && data.status == "success") {
            if (data.result == 1){
              this.zanIcon = true;
            }else{
              this.zanIcon = false;
            }
          }
        });
        // 获取回答点赞总数
        praiseService.getPraiseCount(this.aid,1,(data)=>{
          if(data && data.status == "success") {
            this.answerZanNum = this.$Tool.numConvertText(data.result.count);
          }
        });
        //评论滚动近底部，自动加载 一屏1080
        this.loadComment();
        this.ifLoad = false;
        // 微信分享
        let reg = /[^\u4e00-\u9fa5]+/g;
        let tempContent = this.answer.content.replace(reg,"");
        let url = window.location.href;
        if(window.location.hash.length){
          url = url.substr(0, url.indexOf(location.hash));
        }

        let link = `http://wx.zjzx.xyz/pages/index.html#/wendaDetail?qid=${encodeURI(this.qid)}&aid=${encodeURI(this.aid)}&detailType=`;
        this.shareObj = {
          title: this.qtitle,
          desc: tempContent.substring(0 ,80),
          link: link
        };
        if(this.items.length){
          this.shareObj.imgUrl = this.items[0].src;
        }
        if(!this.shareObj.imgUrl){
          this.shareObj.imgUrl = "http://www.zjzx.xyz/img/index-logo.481a2ae3.png";
        }
        wxUtil.initShare(url,this.shareObj,()=>{});

      },
      // 打开评论框
      handleOpenInput(){
        this.inputShow();
        this.answerPopObj.placeholder = "请文明发言，遵守评论规则...";
      },
      // 取消评论框
      handleCancelInput(){
        this.answerPopObj.desc = "";
        this.answerPopObj.show = false;
        this.popMask = false;
        this.shareShow = false;
      },
      // 进入下载页
      handleDownLoad(){
         window.location.href="download.html";
      },
      handleSendDownLoad(){
        if(!this.answerPopObj.desc){
          return;
        }else{
          this.answerPopObj.show = false;
          this.answerPopObj.desc = "";
           window.location.href="download.html"
        }
      },

      // 评论框输入事件
      handleDescInput(){
        if(this.answerPopObj.desc) {
          this.answerPopObj.active = true;
        }else{
          this.answerPopObj.active = false;
        }
      },
      //删除评论
      handleDeleteComment(itemid, index, type){
        let thiz = this;
        this.$vux.confirm.show({
          content: "确认删除评论?",
          onConfirm(){
            thiz.$vux.loading.show();
            let deleteData = articleCommentService.deleteArticleConmon(itemid);
            if(deleteData && deleteData.status == "success") {
              setTimeout(()=>{
                if(type == 1) {
                  thiz.commentList.splice(index, 1);
                  thiz.answerCommentNum --;
                  thiz.$vux.loading.hide();
                  thiz.$vux.toast.show({
                    text:'删除成功'
                  });
                  if(thiz.commentList.length == 0) {
                    thiz.proFail2 = true;
                    thiz.ifLoadMore = false;
                    thiz.ifComment = false;
                    thiz.badgeShow = false;
                  }

                }else{
                  thiz.replyList.splice(index,1);
                  thiz.commentList[thiz.commentIndex].replyCount --;
                  thiz.$vux.loading.hide();
                  thiz.$vux.toast.show({
                    text:'删除成功'
                  });
                  let resReplyList = articleCommentService.getReplyList(thiz.replyCommentId,1,10);
                  if(resReplyList.recordPage.list.length <= 0){
                    thiz.noComment = true;
                    thiz.hasComment = false;
                  }else{
                    thiz.hasComment = true;
                    thiz.noComment = false;
                  }
                }
              },500);
            }
          }
        });
      },
      //消息图标滚动
      handleToComment(){
        let dis = $(".answer-detail").scrollTop() + $(".content-time").offset().top -100;
        $(".answer-detail").animate({scrollTop:dis},100);
      },

      //回答分享
      handleAnswerShare(){
        this.shareShow = true;
        let reg = /[^\u4e00-\u9fa5]+/g;
        let tempContent = this.answer.content.replace(reg,"");
        this.shareDesc = {
          href:config.share + '/#/wendaDetail' + location.href.substring(location.href.indexOf('?')),
          title: this.qtitle,
          content: tempContent.substring(0,80)
        };
        let temp = this.$Tool.extractImg(this.answer.content,1);
        this.shareDesc['thumbs'] = temp[0];
        if(this.items.length) {
          this.shareDesc['thumbs'] = [this.fileRoot + this.items[0]['url']];
        }
        if (!this.shareDesc['thumbs']) {
          this.shareDesc['thumbs'] = require('@/assets/images/logo-icon.png');
        }
      },
      goPerson(userId){
        this.$Tool.goPage({name:'publishedArticle',query:{userId}});
      },
      /*评论框  显示---获取焦点*/
      inputShow(){
        this.answerPopObj.show = true;
        this.$refs.answerPopFocus.focus();
      },
      //加载评论
      loadComment(){
        // 获取回答一级评论列表
        this.ifLoadMore = true;
        if(this.commentPage == 1) {
          this.commentList = [];
        }
        let answerCommentList = articleCommentService.getArticleCommentPage(this.answer.id,this.commentPage,10);
        if(answerCommentList && answerCommentList.status == "success") {
          listUtil.appendList(this.commentList, answerCommentList.list.list);
          listUtil.asyncSetListPropty(answerCommentList.list.list,(item) =>{
            // 获取问答一级评论人信息
            let answerUserInfo = userService.getUserById(item.douserid);
            if(answerUserInfo && answerUserInfo.status == "success") {
              this.$set(item, "imageurl", answerUserInfo.result.user.imageurl);
              this.$set(item, "username", answerUserInfo.result.user.username);
            }

            // 获取问答一级评论回复数量
            let answerReplyCount = articleCommentService.getReplyCount(item.id);
            if(answerReplyCount && answerReplyCount.status == "success") {
              this.$set(item, 'replyCount', answerReplyCount.result.count);
            }

            // 获取问答一级评论点赞数量
            let answerZanCount = praiseService.getPraiseCount(item.id, 2);
            if(answerZanCount && answerZanCount.status == "success") {
              this.$set(item,"likeNum",answerZanCount.result.count);
              if(answerZanCount.result.count == 0) {
                this.hasZan = true;
                this.noZan = false;
              }else{
                this.hasZan = false;
                this.noZan = true;
              }
            }

            // 获取用户是否给问答一级评论点赞的状态
            let answerTestZan = praiseService.testPraise(item.id, 2);
            if(answerTestZan && answerTestZan.status == "success") {
              if(answerTestZan.result == 1) {
                this.$set(item, "ifLike", true);
              }else {
                this.$set(item, "ifLike", false);
              }
            }
          });

          if(this.commentList.length == 0) {
            this.loadLock = true;
            this.proFail2 = true;
            this.failMes2 = "暂无评论，来抢第一个沙发吧";
            this.ifLoadMore = false;
          }else if(this.commentList.length < 10 || this.answerCommentNum.length) {
            this.loadLock = true;
            this.ifLoadMore = true;
            this.proFail2 = false;
            this.loadText = "已加载全部";
          }else{
            this.commentPage ++;
          }
        }else{
          this.proFail2 = true;
        }

      },


      // 页面加载渲染函数
      loadScroll(e){
         this.scrollTop = $(e.target).scrollTop();
        let detailParent = $(".answer-detail").scrollTop() + $(".answer-detail").innerHeight();
        let detailChild = $(".answer-detail")[0].scrollHeight - 10;
        if(!this.loadLock && detailParent > detailChild) {
          this.loadComment();
        }
      },

    },
    beforeRouteLeave(to, from, next) {
      if(this.answerPopObj.show == true || this.shareShow == true ||  this.popMask == true){
        this.answerPopObj.show = false;
        this.shareShow = false;
        this.popMask = false;
        next(false);
      }else{
        next();
      }
    }
  }
</script>

<style lang="less" scoped>
  /*加载遮层罩*/
  .mask{
    position: absolute;
    background-color: #fafafa;
  }
  /*回答内容*/
  .answer-detail{
    position: relative;
    height: calc(100% - 1.5rem);
    overflow: hidden;
    overflow-y: auto;
    padding: 0 .3rem .88rem .3rem;
    background-color: #fff;
    .answer-wrap{
      .answer-header{
        padding-top: .4rem;
        color: #222;
        .question-title{
          font-size: .4rem;
          line-height: .58rem;
          letter-spacing: .02rem;
          overflow: hidden;
          text-overflow:ellipsis;
          display:-webkit-box;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:3;
        }
        .answer-count{
          line-height: .8rem;
        }
      }
      .answer-info{
        margin: .3rem 0;
        height: .8rem;
        .answer-user{
          display: flex;
          line-height: .8rem;
          img{
            display: block;
            width: .72rem;
            height: .72rem;
            margin-top: .04rem;
            margin-right: .23rem;
            border-radius: 50%;
          }
        }
        .answer-focus{
          width: 1.16rem;
          height: .56rem;
          line-height: .56rem;
          text-align: center;
          border-radius: .1rem;
          margin-top: .12rem;
          letter-spacing: .04rem;
          background-color: #f85959;
          color: #fff;
        }
      }
      .answer-content{
        padding-bottom: .5rem;
        background-color: #fff;
        .content-text{
          line-height: .65rem;
          font-size: .34rem;
        }
        .content-time{
          line-height: .5rem;
          font-size: .32rem;
          color: #999;
          .jubao{
            font-size: .28rem;
            .iconfont{
              font-size: .3rem;
            }
          }
        }
      }
      .answer-comment{
        background-color: #fff;
        .header{
          height: .88rem;
          line-height: .88rem;
          font-size: .3rem;
          border-bottom: .02rem solid @borderColor;
        }
        .body{
          padding-top: .26rem;
          background-color: #fff;
          .comment-item{
            padding-bottom: .26rem;
            .comment-userPhoto{
              display: block;
              width: .66rem;
              height: .66rem;
              margin-right: .25rem;
              border-radius: 50%;
            }
            .comment-wrap{
              width: calc(100% - .91rem);
              .comment-header{
                height: .66rem;
                line-height: .66rem;
                font-size: .24rem;
                .username{
                  font-size: .3rem;
                  color: #406599;
                }
                .comment-zan{
                  span{
                    font-size: .32rem;
                  }

                }
              }
              .comment-body{
                padding-top: .1rem;
                .comment-content{
                  line-height: .45rem;
                  font-size: .32rem;
                  overflow:hidden;
                  text-overflow:ellipsis;
                  display:-webkit-box;
                  -webkit-box-orient:vertical;
                  -webkit-line-clamp:4;
                }
                .comment-open{
                  text-align: right;
                  line-height: .6rem;
                  color: #1674e9;
                }
              }
              .comment-footer{
                line-height: .4rem;
                font-size: .28rem;
                padding: .2rem 0;
                color: #222;
                .comment-reply{
                  padding: .1rem .2rem;
                  border-radius: .3rem;
                  color: #666;
                  background-color: #f1f1f1;
                  var{
                    margin-right: .04rem;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  /*伪评论框*/
  .answer-tabBar{
    width: 100%;
    height: .88rem;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 566;
    padding: 0 .3rem;
    background-color: #fafafa;
    border-top: .02rem solid #d8d8d8;
    .answer-input{
      width: 2.32rem;
      height: .57rem;
      line-height: .57rem;
      margin-top: .155rem;
      padding-left: .26rem;
      padding-right: .13rem;
      border: .02rem solid @borderColor;
      border-radius: .3rem;
      background-color: #f3f4f5;
      .icon-comment{
        padding-right: .14rem;
        color: #222;
      }
    }
    .answer-icon{
      display: flex;
      line-height: .88rem;
      .item-icon{
        margin-right: .48rem;
        .iconfont{
          font-size: .42rem;
        }
        .icon-yizan{
          color: #f85959;
        }
        .icon-collected{
          color: #f9c345;
        }
        &:last-child{
          margin-right: 0;
        }
      }
      .msg-icon{
        position: relative;
        .icnfont{
          position: absolute;
          left: -.56rem;
        }
        .answer-badge{
          display: block;
          position: absolute;
          top: .12rem;
          left: .1rem;
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
  /*创建遮罩*/
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
  /*评论框*/
  .popup-wrap{
    width: 100%;
    padding: .2rem;
    background-color: #f4f4f4;
    .popup-area {
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
      .active{
        background-color: #f85959;
      }
    }
  }
  /*回复框*/
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
  /*举报框*/
  .reply-wrap{
    height: calc(100vh - 50px);
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
      height: calc(100vh - 1.4rem);
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
            // 	color: #979fac;
            // 	span{
            // 		font-size: .24rem;
            // 		margin-right: -.1rem;
            // 	}
            // 	.iconfont{
            // 		font-size: .36rem;
            // 	}
            // 	.icon-weizan{
            // 		color: #979fac;
            // 	}
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
  .answer-detail /deep/ .my-gallery{
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
