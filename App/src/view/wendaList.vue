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
          @click="handleDownLoad">
            {{focusState ? '已关注' : '关注'}}
          </div>
        </div>
        <h2 class="title">{{wenda.title}}</h2>
        <div class="desc" >
          <p class="desc-text">{{wenda.description}}</p>
        </div>
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
      <div class="item" @click="handleDownLoad">
        <i class="iconfont" :class="collectIcon ? 'icon-collected' : 'icon-not-collection'"></i>
        <span>{{collectState?'已收藏':'收藏'}}</span>
      </div>
      <div class="item" @click="handleDownLoad">
        <i class="iconfont icon-comment"></i>
        <span>回答</span>
      </div>
    </div>
    <!--举报-->
    <div v-transfer-dom style="z-index: 988;">
      <popup v-model="reportShow" style="z-index: 999;">
        <div class="report-wrap">
          <div class="report-header">
            <h2>举报(举报热线：400-1106768)</h2>
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
  </div>
</template>
<script>
  import config from '@/lib/config/config'
  import listUtil from '@/service/util/listUtil'
  import userService from '@/service/userService'
  import wdcollectService from '@/service/wdcollectService'
  import interService from '@/service/interlocutionService'
  import followService from '@/service/followService'
  import articleService from '@/service/articleService'
  import articleFileService from '@/service/article_fileService'
  import articleCommentService from '@/service/article_commentService'
  export default {
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
        timer:null,
        userId:localStorage.id,
        focusState:false,
        focusColor:false,
        id:null,   //问题Id
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
        fabuColor:false,    //发布按钮颜色
        record:{
          content:'',
          author:1,
          type:1,
          publishtime:'',
          parentid:''
        },
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
        tip:"正在加载"
      }
    },
    activated() {
      this.$nextTick(()=>{
        this.id = this.$route.query.id;
        this.ifLoad = true;
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
        // 获取问题详情信息
        let questionDetail = interService.getQuestionById(this.id);
        if(questionDetail && questionDetail.status == "success"){
          this.wenda = questionDetail.record;
        }
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
            console.log(item)
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
      handleDownLoad(){
        this.reportShow = false;
        this.reportList = [];
        this.reportreasion = "";
        this.$router.push({ path:'/download'})
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

      handleReport(){
        this.reportShow = true;
      },


      goAnswerDetail(wenda,item){
        if (!this.$store.state.isScolling) {
          this.$Tool.goPage({
            name:'wendaDetail',
            query:{
              qid:wenda.id,
              aid:item.id,
              detailType:this.detailType
            },
          })
        }
      },

    },
    computed:{
      isBlacklist(){
        return function (item) {
          return this.$store.state.blacklist.includes(item);
        }
      },
    },
    beforeRouteLeave(to, from , next){
      if( this.reportShow == true){
        this.reportShow = false;
        next(false);
      } else{
        next()
      }
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
        margin-bottom: .15rem;
        .desc-text{
          width: 100%;
          line-height: .48rem;
          font-size: .34rem;
          letter-spacing: .02rem;
          color: #707070;
        }
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
  .status-bar{
    background: @statusBarBg;
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
