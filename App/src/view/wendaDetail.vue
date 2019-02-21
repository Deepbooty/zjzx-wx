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
        <!-- 问题标题-&#45;&#45;回答数-->
        <div class="answer-header">
          <h1 class="question-title">{{wenda.title}}</h1>
          <div class="answer-count">
            <span>{{answerCount}}条回答 <i class="iconfont icon-arrow-right"></i></span>
          </div>
        </div>
        <!--回答人的信息-->
        <div class="answer-info clearfix">
          <router-link class="answer-user fl" :to="{name:'published',query:{userId:answer.author}}" tag="div">
            <img :src="$Tool.headerImgFilter(answerUser.imageurl)">
            <span>{{ answerUser.username}}</span>
          </router-link>
          <div class="answer-focus fr" v-if="userId != answer.author" @click="handleAnswerFocus(answer.author, 1)">
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
            <div class="jubao fr" @click="handleReport(1)">
              <i class="iconfont icon-warning-circle"></i>
              举报
            </div>
          </div>

        </div>
        <!--问答未获取到内容-->
        <prompt-blank v-if="proFail1" :mes="failMes1"></prompt-blank>
        <ul class="article-menu" v-if="detailType">
          <li :class="{current:current == 1}" @click="handleSwitch(1)">评论</li>
          <li :class="{current:current == 2}" @click="handleSwitch(2)">转发</li>
          <li :class="{current:current == 3}" @click="handleSwitch(3)">点赞</li>
        </ul>
        <!--问答评论-->
        <div class="answer-comment" v-if="ifSwitchB">
          <div class="header clearfix">
            <span class="fl" v-if="ifComment">评论 {{answerCommentNum}}</span>
            <span class="fl" v-else style="color: #406599; font-weight: 700;">抢鲜评论</span>
            <span class="fr" v-show="answerZanBool.hasZan">赞 {{answerZanNum}}</span>
            <span class="fr" v-show="answerZanBool.notZan">抢鲜点赞</span>
          </div>
          <div class="body" v-for="(item, index) in commentList" v-if="!isBlacklist(item.douserid)">
            <div class="comment-item clearfix">
              <img :src="$Tool.headerImgFilter(item.imageurl)" class="comment-userPhoto fl">
              <div class="comment-wrap fl">
                <div class="comment-header clearfix">
                  <span class="username fl">{{item.username}}</span>
                  <div class="comment-zan fr" :class="{'likeActive': item.ifLike}" @click="handleFabulous(2, item.id, index)">
                    <like :likeStatus="index == curLike ? ifLike: 0"></like>
                    <span class="zan-count">{{item.likeNum}}</span>
                  </div>
                </div>
                <div class="comment-body">
                  <p class="comment-content">{{item.content}}</p>
                  <!--<div class="comment-open">展开全文</div>-->
                </div>
                <div class="comment-footer clearfix">
                  <div class="footer-left fl">
                    <span class="comment-time">{{$Tool.publishTimeFormat(item.commenttime)}}</span>
                    <span class="comment-point">•</span>
                    <span class="comment-reply" @click="handleFirstReply(item,index)">
                      <!--v-if="!isBlacklist(item.douserid)"-->
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
        <memberList v-else :list="listMember" :mes="proMes"></memberList>
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
        <div class="item-icon" @click="handleAnswerCollect(id)">
          <i class="iconfont" :class="collectIcon ? 'icon-collected' : 'icon-not-collection'"></i>
        </div>
        <div class="item-icon" @click="handleFabulous(1)">
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
            <button type="button" class="popup-send fr" :class="{active:answerPopObj.active}" @click="handleSendComment">发布</button>
          </div>
        </div>
      </popup>
    </div>
    <!--分享弹出框-->
    <share :content="shareDesc" v-model="shareShow"></share>
    <!--回复框-->
    <div v-transfer-dom>
      <popup v-model="replyShow" position="bottom" height="100%">
        <div class="reply-wrap" @scroll="loadScroll">
          <div class="reply-header">
            <i class="iconfont icon-remove" @click="handleCloseRelpy"></i>
            <span v-show="noReply">暂无回复</span>
            <span v-show="hasReply">{{replyobj.replyCount}}条回复</span>
          </div>
          <div class="reply-body">
            <div class="reply-container reply-first clearfix">
              <div class="reply-img fl">
                <img :src="$Tool.headerImgFilter(replyobj.imageurl)">
              </div>
              <div class="reply-content fr">
                <div class="header clearfix">
                  <div class="header-desc fl">
                    <h4>{{replyobj.username}}</h4>
                    <!-- <span>旅游媒体人</span> -->
                  </div>
                  <span class="header-focus fr" v-if="userId != replyUserId"   @click="handleAnswerFocus(replyUserId,2,)">{{replyUserFocusState?'已关注':'关注'}}</span>
                </div>
                <div class="reply-desc">
                  <p>{{replyobj.content}}</p>
                </div>
                <div class="reply-time-report clearfix">
									<span class="reply-time fl">
										{{$Tool.publishTimeFormat(replyobj.commenttime)}}
									</span>
                  <span class="reply-report fr" @click="handleReport(2)">举报</span>
                </div>
                <div class="reply-footer clearfix">
                  <div class="reply-footer-wrap fl clearfix" v-show="noZan">
                    <ul class="reply-list clearfix fl">
                      <li class="reply-item">
                        <img :src="$Tool.headerImgFilter(replyobj.imageurl)" alt="">
                      </li>
                    </ul>
                    <div class="reply-footer-desc fl">
                      <span class="num">{{replyobj.likeNum}}</span>人赞过
                      <i class="iconfont icon-arrow-right"></i>
                    </div>
                  </div>
                  <div class="reply-list fl" v-show="hasZan">
                    暂无人赞过
                  </div>
                  <div class="reply-fabulous fr"  @click="handleFabulous(2,replyobj.id,commentIndex)" :class="{'likeActive':commentIndex >=0 && commentList[commentIndex].ifLike}">
                    {{replyobj.likeNum}}
                    <like :likeStatus="commentIndex >= 0 && commentList[commentIndex].ifLike"></like>
                  </div>
                </div>

              </div>
            </div>
            <div class="isDiscuss" v-show="noComment">抢鲜评论</div>
            <!-- 评论的内容 -->
            <div class="reply-container" v-show="hasComment">
              <div class="reply-discuss">全部评论</div>
              <div class="reply-box clearfix" v-for="(item,index) in replyList">
                <div class="reply-img fl">
                  <img :src="$Tool.headerImgFilter(item.imageurl)">
                </div>
                <div class="reply-content fr">
                  <div class="header clearfix">
                    <div class="header-desc fl">
                      <h4>{{item.username}}</h4>
                    </div>
                  </div>
                  <div class="reply-desc">
                    <p>{{item.content}}</p>
                  </div>
                  <div class="reply-time-delete clearfix">
                    <div class="reply-times fl clearfix">
                      <span class="reply-time fl">{{$Tool.publishTimeFormat(item.commenttime)}}</span>
                      <span class="fl reply-point">•</span>
                      <div class="reply-huifu fl"  @click="handleAllReply(item.username)">
                        <!--<var>{{item.replyCount}}</var>-->
                        <span class="reply-replys">回复</span>
                      </div>
                    </div>
                    <span class="reply-delete fr" v-if="item.douserid == userId" @click="handleDeleteComment(item.id,index,2)">删除</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </popup>
    </div>
    <!--举报框-->
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
  import like from '@/components/common/like'
  import articleService from '@/service/articleService'
  import interService from '@/service/interlocutionService'
  import userService from '@/service/userService'
  import followService from '@/service/followService'
  import messageService from '@/service/messageService'
  import articleFileService from '@/service/article_fileService'
  import articleCommentService from '@/service/article_commentService'
  import praiseService from '@/service/praiseService'
  import articleCollectService from '@/service/articleCollectService'
  import reportService from '@/service/reportService'
  import listUtil from '@/service/util/listUtil'
  import transmitService from '@/service/transmitService'
  export default {
    name: "wendaDetail",
    components:{
      like,
      memberList:() => import ('@/components/common/memberList'),
    },
    data(){
      return{
        id:0, //回答id
        detailType: 0,//视图类型
        userId:localStorage.id,    //当前登录用户
        loadLock: false,  //加载锁
        fileRoot:config.fileRoot + '/',   //服务路径
        wenda:{}, //问题的对象
        answer:{},  //回答对象
        /* 回答人的姓名-头像*/
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
        replyShow: false, //回复框是否显示
        /*类型：评论(1) | 回复(1)*/
        commentType: 1,
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
        shareDesc:{
          href:'',
          title:'',
          content:''
        },
        shareShow:false,  //分享框是否显示
        reportShow:false, //举报框是否弹出
        replyobj:{},    //回复框内容的对象
        replyList: [],  //回复列表
        noReply:false,    //回复框没有回复
        hasReply:false,   //回复框有回复
        replyUserFocusState:false,  //回复评论人的关注状态
        reportType:0,//举报类型 1:文章，2:评论
        reportreasion:'', //"举报原因"
        /*举报原因数组*/
        reportList:Object.freeze([
          '淫秽色情',
          '违法信息',
          '营销广告',
          '恶意攻击谩骂',
          '拉黑该用户并屏蔽其内容'
        ]),
        noZan:false,  //评论有赞状态
        hasZan: false,  //评论无赞状态
        noComment:  false,  //抢鲜评论
        hasComment: false,  //有评论
        ifSwitchB:true, //转发、点赞，评论切换
        current:1,  //当前
        listMember: [], //转发点赞列表
        proMes:"",    	//转发，点赞提示
      }
    },
    activated(){
      this.wenda = JSON.parse(this.$route.query.wenda);
      this.answer = JSON.parse(this.$route.query.item);
      this.detailType = this.$route.query.detailType || 0;
      this.id = this.answer.id;
      if(!localStorage.id || !localStorage.token){
        this.answerFocusState=false;
        this.collectIcon = false;
        this.zanIcon = false;
        this.deleteShow = false;
      }else{
        this.deleteShow = true;
      }

    },
    mounted() {
      window.history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.onBrowserBack, false);
    },
    destroyed(){
      window.removeEventListener("popstate", this.onBrowserBack, false);
    },
    watch:{
      id(){
        this.ifLoad = true;
        setTimeout(()=>{
          this.init();
          this.ifLoad = false;
        },delay)
      },
      'answerPopObj.show':{
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
      replyShow:{
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
      reportShow:{
        handler(newVal, oldVal) {
          if(newVal.Terms == true) {
            window.history.pushState(null, null, document.URL);
          }
        },
        deep: true
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
    methods:{
      // 页面初始渲染
      init(){
        if (!this.id) {
          this.$vux.alert.show({
            content: '获取出错，请返回！',
          });
          this.$Tool.goBack();
          return;
        }
        this.ifLoad = true;
        // 获取问题回答数量
        interService.getAnswerCount(this.wenda.id, (data) =>{
          if(data && data.status == "success") {
            this.answerCount = this.$Tool.numConvertText(data.count);
          }
        });

        // 获取回答人的信息
        let answerInfo = userService.getUserById(this.answer.author);
        if(answerInfo && answerInfo.status == "success") {
          this.answerUser = answerInfo.result.user;
        }

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
        let answerSrcData = articleFileService.getFileByArticle(this.answer.id);
        if(answerSrcData && answerSrcData.status == "success") {
          // this.answerFile = answerSrcData.result.filelist;
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

        // 获取发布回答时间
        this.publishtime = this.$Tool.publishTimeFormat(this.answer.publishtime);

        // 获取评论回答总数
        articleCommentService.getArticleCommentCount(this.answer.id, (data)=>{
          if(data && data.status == "success") {
            this.answerCommentNum = this.$Tool.numConvertText(data.result.count);
            if(this.answerCommentNum == 0){
              this.ifComment = false;
              this.badgeShow = false;
            }else{
              this.ifComment = true;
              this.badgeShow = true;
            }
          }
        });

        // 获取回答的收藏状态
        articleCollectService.testCollect(this.answer.id, (data)=>{
          if(data && data.status == "success") {
            if(data.result == 1) {
              this.collectIcon = true;
            }else{
              this.collectIcon = false;
            }
          }
        });
        // 获取回答点赞状态
        praiseService.testPraise(this.answer.id, 1, (data)=>{
          if(data && data.status == "success") {
            if (data.result == 1){
              this.zanIcon = true;
            }else{
              this.zanIcon = false;
            }
          }
        });
        // 获取回答点赞总数
        praiseService.getPraiseCount(this.answer.id,1,(data)=>{
          if(data && data.status == "success") {
            this.answerZanNum = this.$Tool.numConvertText(data.result.count);
            if(data.count <= 0) {
              this.answerZanBool.notZan = true;
              this.answerZanBool.hasZan = false;
            }else{
              this.answerZanBool.notZan = false;
              this.answerZanBool.hasZan = true;
            }
          }
        });
        //评论滚动近底部，自动加载 一屏1080
        this.loadComment();
        this.ifLoad = false;
      },
      onBrowserBack(){
        if(this.answerPopObj.show || this.shareShow || this.replyShow || this.popMask || this.reportShow){
          this.answerPopObj.show = false;
          this.shareShow = false;
          this.replyShow = false;
          this.popMask = false;
          this.reportShow = false;
        }
      },
      /*关注  | 取消关注   type: 1-回答发布人 || 2-回答评论人*/
      handleAnswerFocus(userid, type){
        if(!localStorage.id) {
          this.$Tool.loginGoBack({
            returnpage:"/wendaDetail",
            query:{item:JSON.stringify(this.answer),wenda:JSON.stringify(this.wenda)},
            name:"wendaDetail",
            call:()=>{
              let data =  followService.doFollow(userid);
              if(data && data.status == "success"){
                if(type == 1) {
                  if(data.result == 1) {
                    this.$vux.toast.show({
                      text:'关注成功'
                    });
                    this.answerFocusState = true;
                    // 向回答人发送消息
                    messageService.sendMessage(userid, "focus", this.answer.id, 1);
                  }
                }else{
                  if(data.result == 1) {
                    this.$vux.toast.show({
                      text:'关注成功'
                    });
                    this.replyUserFocusState = true;
                    // 给评论人发送消息
                    messageService.sendMessage(userid, "focus", this.replyCommentId, 2);
                  }
                }
              }
            }
          });
          return;
        }
        followService.doFollow(userid, (data)=>{
          if(data && data.status == "success") {
            if(type == 1) {
              if(data.result == 1) {
                this.$vux.toast.show({
                  text:'关注成功'
                });
                this.answerFocusState = true;
                // 向回答人发送消息
                messageService.sendMessage(userid, "focus", this.answer.id, 1);
              }else{
                this.$vux.toast.show({
                  text:'取消关注'
                });
                this.answerFocusState = false;
              }
            }else{
              if(data.result == 1) {
                this.$vux.toast.show({
                  text:'关注成功'
                });
                this.replyUserFocusState = true;
                // 给评论人发送消息
                messageService.sendMessage(userid, "focus", this.replyCommentId, 2);
              }else{
                this.$vux.toast.show({
                  text:'取消关注'
                });
                this.replyUserFocusState = false;
              }
            }
          }else{
            this.$vux.alert.show({
              content:'关注失败，请重新关注'
            });
          }

        })
      },

      /*type: 1-回答点赞 || 2-评论点赞*/
      handleFabulous(type, itemid, index) {
        if(!localStorage.id) {
          this.$Tool.loginGoBack({
            returnpage:"/wendaDetail",
            query:{item:JSON.stringify(this.answer),wenda:JSON.stringify(this.wenda)},
            name:"wendaDetail",
            call:()=>{
              this.conFabulous(type,itemid,index);
            }
          });
          return;
        }
        this.conFabulous(type,itemid,index);

      },

      conFabulous(type,itemid,index){
        if(type == 1) {
          let zanData = praiseService.doPraise(this.answer.id,1);
          if(zanData && zanData.status == "success") {
            if(zanData.result.code == 1) {
              this.zanIcon = true;
              this.answerZanNum ++;
              if(this.answerZanNum > 0) {
                this.answerZanBool.hasZan = true;
                this.answerZanBool.notZan = false;
              }

              // 给发布人发送消息
              messageService.sendMessage(this.answer.author, "like", this.answer.id, 1);
            }else{
              this.zanIcon = false;
              this.answerZanNum --;
              if(this.answerZanNum <= 0) {
                this.answerZanBool.hasZan = false;
                this.answerZanBool.notZan = true;
              }


            }
          }
        }else{
          let zanData = praiseService.doPraise(itemid,2);
          if(zanData && zanData.status == "success") {
            if(zanData.result.code == 1) {
              this.curLike = index;
              this.ifLike = true;
              this.commentList[index].likeNum ++;
              this.commentList[index].ifLike = true;
              // 给评论人发送消息
              messageService.sendMessage(this.replyUserId, "like", this.replyCommentId, 2);
            }else{
              this.curLike = index;
              this.ifLike = false;
              this.commentList[index].likeNum --;
              this.commentList[index].ifLike = false;
            }
            if(zanData.result.count <= 0) {
              this.noZan = false;
              this.hasZan = true;
            }else{
              this.hasZan = false;
              this.noZan = true;
            }
          }
        }
      },
      // 收藏回答---取消收藏回答
      handleAnswerCollect(answerid){
        if (!localStorage.id ) {
          this.$Tool.loginPrompt();
          return;
        }
        let answerCollectData = articleCollectService.articleCollect(answerid);
        if(answerCollectData && answerCollectData.status == "success") {
          if(answerCollectData.result == 1) {
            this.collectIcon = true;
            this.$vux.toast.show({
              text:'收藏成功',
              type:'success'
            });
            //给发布人发送消息
            messageService.sendMessage(this.answer.author,"collect",this.answer.id,1);
            setTimeout(()=>{
              this.$vux.alert.hide();
            },1000);
          }else{
            this.collectIcon = false;
            this.$vux.toast.text('取消收藏', 'middle');
            setTimeout(()=>{
              this.$vux.alert.hide();
            },1000);
          }
        }
      },

      // 个人中心显示的switch
      handleSwitch(v){
        if(v == 1) {
          this.ifSwitchB = true;
          this.current = 1;
          return;
        }
        else if(v == 2) {
          this.ifSwitchB = false;
          this.current = 2;
          let res = transmitService.getTransmitList(this.answer.id,1,10);
          if (res && res.status == "success") {
            this.listMember = res.recordPage.list;
          }
          if(this.listMember.length == 0){
            this.proMes = "还没有人转发哦"
          }
          return;
        }
        else if(v == 3) {
          this.ifSwitchB = false;
          this.current = 3;
          let res = praiseService.getPraiseList(this.answer.id,1,1,10);
          if (res && res.status == "success") {
            this.listMember = res.recordPage.list;
          }
          if(this.listMember.length == 0){
            this.proMes = "还没有人点赞哦"
          }
          return;
        }
      },

      // 打开评论框
      handleOpenInput(){
        if(!localStorage.id) {
          this.$Tool.loginGoBack({
            returnpage:"/wendaDetail",
            query:{item:JSON.stringify(this.answer),wenda:JSON.stringify(this.wenda)},
            name:"wendaDetail",
            call:()=>{
            }
          });
          return;
        }
        this.inputShow();
        if(this.replyShow){
          this.popMask = true;
        }
        this.answerPopObj.placeholder = "请文明发言，遵守评论规则...";
      },

      // 取消评论框
      handleCancelInput(){
        this.answerPopObj.show = false;
        this.popMask = false;
        this.shareShow = false;
        this.reportShow = false;
      },

      // 评论框输入事件
      handleDescInput(){
        if(this.answerPopObj.desc) {
          this.answerPopObj.active = true;
        }else{
          this.answerPopObj.active = false;
        }
      },

      // 发布评论
      handleSendComment(){
        this.badgeShow = true;
        if(!this.answerPopObj.desc) {
          this.answerPopObj.show = false;
          this.popMask = false;
          return;
        }
        let currentUserid = localStorage.id;  //当前用户id
        if(this.answerPopObj.desc && this.$Tool.checkInput(this.answerPopObj.desc)) {
          if(this.commentType == 1) {
            //发送评论
            let commentData = articleCommentService.articleComment(this.answer.id,this.answerPopObj.desc,currentUserid,this.answer.author,1);

            if(commentData && commentData.status == "success") {
              this.loadLock = false;
              this.commentPage = 1;
              this.loadComment();
              this.answerPopObj.show = false;
              this.answerPopObj.desc = "";
              this.answerPopObj.active = false;
              this.answerCommentNum ++;
              if(this.answerCommentNum >= 0){
                this.ifComment = true;
              }
              setTimeout(()=>{
                this.$vux.toast.show({
                  type:'success',
                  text: '发布成功'
                });
              },500);
              // 给发布人发送消息
              messageService.sendMessage(this.answer.author,"reply", this.answer.id, 1);
              let dis = $('.answer-detail').scrollTop() + $('.content-time').offset().top - 100;
              $('.answer-detail').animate({scrollTop:dis},100);

            }else{
              this.$vux.alert.show({
                content:'评论失败，请重试！'
              });
              setTimeout(()=>{
                this.$vux.alert.hide();
              },1000);
            }
          }else{
            let comment = this.commentConAdd?(this.answerPopObj.desc + this.commentConAdd):this.answerPopObj.desc;
            // 执行发送评论回复
            let resACommentReply = articleCommentService.articleComment(this.answer.id,comment,currentUserid,this.replyUserId,2,this.replyCommentId);
            if(resACommentReply && resACommentReply.status == "success") {
              setTimeout(()=>{
                this.$vux.toast.show({
                  type:'success',
                  text: '发布成功'
                });
              },500);
              this.answerPopObj.desc = "";
              this.commentConAdd = "";
              this.answerPopObj.show = false;
              this.popMask = false;
              this.answerPopObj.active = false;
              this.commentList[this.commentIndex].replyCount ++;
              // 给评论人发送消息
              messageService.sendMessage(this.replyUserId,'reply',this.replyCommentId,2);
              this.loadReply();
              $(".reply-wrap").animate({scrollTop:0},100);
            }else{
              this.$vux.alert.show({
                content:'评论失败，请重试'
              });
              setTimeout(()=>{
                this.$vux.alert.hide();
              },1000);
            }
          }
        }else{
          this.$vux.alert.show({
            content:'内容不合法，请修改后提交'
          });
          setTimeout(()=>{
            this.$vux.alert.hide();
          },1000);
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

      // 首次回复
      handleFirstReply(item, commentIndex){
        this.replyShow = true;
        this.commentType = 2;
        this.replyUserId = item.douserid;	//回复评论人id
        this.replyCommentId = item.id; //回复评论的id
        this.commentIndex = commentIndex;//指定评论数组中某条评论的索引值
        //展开评论回复是顶部当前索引使用
        // 是否关注发布人
        this.replyobj = item;
        if(localStorage.getItem('token')){
          let resTestFolow = followService.testFollow(item.douserid);
          if(resTestFolow && resTestFolow.status == "success"){
            if(resTestFolow.result == 1){
              this.replyUserFocusState = true;
            }else{
              this.replyUserFocusState = false;
            }
          }
        }
        // 获取文章评论回复列表
        this.loadReply();
      },
      // 二级三级回复
      handleAllReply(userName){
        this.inputShow();
        this.popMask = true;
        this.answerPopObj.placeholder = "回复 "  + userName + ":"
        this.commentConAdd = " //@" + userName;
      },

      // 关闭回复框
      handleCloseRelpy(){
        this.replyShow = false;
        this.commentType = 1;
      },

      // 打开举报框
      handleReport(type){
        if(!localStorage.id){
          this.$Tool.loginGoBack({
            returnpage:"/wendaDetail?",
            query:{id:this.id},
            name:"wendaDetail",
            call:()=>{}
          });
          this.popMask = false;
        }
        this.reportShow = true;
        this.popMask = true;
        this.reportType = type;
      },
      // 提交举报内容
      handleSendReport(){
        if(!this.reportreasion){return;}
        let reportInfo;
        if(this.reportType == 1) {
          if(this.reportreasion != "拉黑该用户并屏蔽其内容") {
            reportInfo = {
              type:4,
              itemid: this.id,
              reportuserid:this.answer.author,
              reportreasion:this.reportreasion
            };
          }else{
            // 拉黑回答作者
            userService.blacklist(this.answer.author,data=>{
              if(data && data.status == "success") {
                let temp = [];
                if (localStorage.blacklist) {
                  temp = JSON.parse(localStorage.blacklist);
                  temp.push(this.article.author);
                }else{
                  temp = [this.article.author];
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
        }else if (this.reportType === 2){
          if(this.reportreasion != '拉黑该用户并屏蔽其内容'){
            reportInfo = {
              type:2,
              itemid:this.replyobj.id,
              reportuserid:this.replyobj.douserid,
              reportreasion:this.reportreasion
            };
          }else{
            // 拉黑评论者
            userService.blacklist(this.replyobj.douserid,data=>{
              if (data && data.status === "success") {
                let temp = [];
                if (localStorage.blacklist) {
                  temp = JSON.parse(localStorage.blacklist);
                  temp.push(this.replyobj.douserid);
                }else{
                  temp = [this.replyobj.douserid];
                }
                this.$store.commit("setBlacklist",temp);
                this.$vux.alert.show({
                  content:'已将该用户拉黑并为您屏蔽其相关内容',
                })
                // this.$router.back();
              }else{
                this.$vux.alert.show({
                  content:'操作失败，请稍后再试！',
                })
              }
            })
          }
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
        this.popMask = false;
        this.reportreasion = "";
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
          href:config.share + '/#/detail' + location.href.substring(location.href.indexOf('?')),
          title: this.answer.title,
          content: tempContent.substring(0,80)
        };
        let temp = this.$Tool.extractImg(this.answer.content,1);
        this.shareDesc['thumbs'] = temp[0];
        if(this.items.length) {
          this.shareDesc['thumbs'] = [this.fileRoot + this.items[0]['url']];
        }

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
        let answerCommentList = articleCommentService.getArticleCommentPage(this.answer.id,this.commentPage,10);
        if(answerCommentList && answerCommentList.status == "success") {
          if(this.commentPage == 1) {
            this.commentList = [];
          }
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

      // 加载回复
      loadReply() {
        // 获取回答评论回复列表
        let resReplyList = articleCommentService.getReplyList(this.replyCommentId,1,10);
        if (resReplyList && resReplyList.status == "success") {
          this.replyList = resReplyList.recordPage.list;
          // 获取回复人信息
          for (let i = 0,len = this.replyList.length; i < len; i++) {
            let resUserInfo = userService.getUserById(this.replyList[i].douserid);
            if (resUserInfo && resUserInfo.status == "success") {
              this.replyList[i].imageurl = resUserInfo.result.user.imageurl;
              this.replyList[i].username = resUserInfo.result.user.username;
            }
          }
        }
        if(resReplyList.recordPage.list.length <= 0){
          this.noReply = true;
          this.hasReply = false;
          this.noComment = true;
          this.hasComment = false;
        }else{
          this.hasReply = true;
          this.noReply = false;
          this.hasComment = true;
          this.noComment = false;
        }
      },
      // 页面加载渲染函数
      loadScroll(){
        let detailParent = $(".answer-detail").scrollTop() + $(".answer-detail").height();
        let detailChild = $(".answer-detail")[0].scrollHeight-350;
        if(!this.loadLock && detailParent > detailChild) {
          this.loadComment();
        }
      },
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
      height: calc(100vh - 1.3rem);
      // overflow-y: auto;
      // overflow: auto;
      // padding: .32rem .3rem;
      padding: .32rem .3rem 1rem .3rem;
      .reply-container{
        width: 100%;
        &:first-child{
          border-bottom: .02rem solid @borderColor;
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
