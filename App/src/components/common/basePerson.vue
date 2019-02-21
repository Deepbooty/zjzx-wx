<template>
  <div>
    <top>
      <template slot="title">{{title}}</template>
    </top>
    <div class="member-msg">
      <div class="member-msg-header">
        <vue-picture-swipe :items="items"></vue-picture-swipe>
        <div class="member-msg-modal">
          <ul class="member-msg-list">
            <!-- @click="(loginUserId == userId) && $Tool.goPage({ name:'release',query:{'title':'发布图文',sort:1}})" -->
            <li class="member-msg-item">
              <span>{{articleCount + questionCount}}</span>
              发布
            </li>
            <li class="member-msg-item">
              <span>{{focusNum}}</span>
              关注
            </li>
            <li class="member-msg-item">
              <span>{{fansNum}}</span>
              粉丝
            </li>
          </ul>
          <div class="member-msg-btn" v-if="loginUserId == userId">
            <button class="btn btn-edit"  @click="$Tool.goPage({ name:'editInfo',query:{'title':'账号设置'}})">账号设置</button>
            <button class="btn btn-apply" @click="$Tool.goPage({ name:'identityIndex',query:{'title':'申请认证'}})">申请认证</button>
          </div>
          <div v-else>
            <!-- 访客所见 -->
            <div class="visitor-black" v-if="blackState" @click="handleCloseBlack">解除拉黑</div>
            <div
              v-else
              class="visitor-focus"
              :class="btnState ? 'default-focus' : 'active-focus'"
              @click="handleFocus(userId)">
              {{focusState ? "已关注" : "关注"}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="member-tab">
      <ul class="member-switch">
        <!-- <router-link class="member-switch-item active" v-for="(item, index) in switchListPublic" tag="li" :to="{path:item.path,}" :key="index + 'a'" >{{item.desc}}
                </router-link>
                <router-link class="member-switch-item active" v-for="(item, index) in switchListPrivate" tag="li" :to="{path:item.path,}" :key="index" >{{item.desc}}
                </router-link> -->
      </ul>
      <tab :line-width="2" v-model="current" v-show="loginUserId == userId" key='1'>
        <tab-item v-for="(item, index) in switchListPublic" :key="item.id">
          <router-link class="block" :to="{path:item.path,query:{userId}}" replace>
            {{item.desc}}
          </router-link>
        </tab-item>
        <tab-item v-for="(item, index) in switchListPrivate" :key="item.id">
          <router-link class="block" :to="{path:item.path,query:{userId}}" replace>
            {{item.desc}}
          </router-link>
        </tab-item>
      </tab>
      <tab v-show="loginUserId != userId" :line-width="2" v-model="currentSub" key='2'>
        <tab-item v-for="(item, index) in switchListPublic" :key="item.id+10">
          <router-link class="block" :to="{path:item.path,query:{userId}}" replace>
            {{item.desc}}
          </router-link>
        </tab-item>
        <!-- <tab-item v-if="loginUserId == userId" v-for="(item, index) in switchListPrivate" :key="item.id">
                <router-link :to="{path:item.path,query:{userId:item.userId}}" replace>
                    {{item.desc}}
              </router-link>
            </tab-item> -->
      </tab>

    </div>
    <keep-alive>
      <router-view class="router-view" :key="$route.name"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import config from '@/lib/config/config'
  import articleService from '@/service/articleService'
  import followService from '@/service/followService'
  import interService from '@/service/interlocutionService'
  import userService from '@/service/userService'
  export default {
    data(){
      return {
        loginUserId:localStorage.id || 0,
        userId:0,
        current:0,
        currentSub:0,
        currentName:"全部",
        showGallary:false,
        focusState:false,
        btnState:false,
        blackState:false,
        items: [{
          src: '',
          thumbnail: '',
          w: 600,
          h: 520,
        }],
        title:'',
        userPhoto:'',
        focusNum:0,
        fansNum:0,
        articleCount:0,
        questionCount:0,
        switchListPublic:Object.freeze([
          // {id:1, desc:'全部', path:'/personBase/published',},
          {id:2, desc:'文章', path:'/personBase/publishedArticle',},
          {id:3, desc:'视频', path:'/personBase/publishedVideo',},
          {id:4, desc:'问答', path:'/personBase/publishedQA',},
        ]),
        switchListPrivate:Object.freeze([
          {id:6, desc:'粉丝', path:'/personBase/fans',},
          {id:7, desc:'关注', path:'/personBase/focus',},
          {id:8, desc:'收藏', path:'/personBase/collect',},
          {id:9, desc:'历史', path:'/personBase/history',},
        ])
      }
    },
    activated(){
      this.$nextTick(()=>{
        this.init();
      })
    },
    methods:{
      init(){
        // 头像预览
        if(localStorage.id && localStorage.id == this.userId){
          this.title = localStorage.userName;
          this.items[0].src = localStorage.userImg;
          this.items[0].thumbnail = localStorage.userImg;
        }
        let userInfoData = userService.getUserById(this.userId);
        if(userInfoData && userInfoData.status == "success"){
          this.items[0].src = this.$Tool.headerImgFilter(userInfoData.result.user.imageurl);
          this.items[0].thumbnail = this.$Tool.headerImgFilter(userInfoData.result.user.imageurl);
          this.title = userInfoData.result.user.username;
        }
        //获取文章数量
        articleService.getUserArticleCount(this.userId,(data)=>{
          if (data && data.status == "success" ) {
            this.articleCount = data.result.count;
          }
        });

        // 获取用户发布问题数量
        interService.getUserQuestionCount(this.userId,(data)=>{
          if(data && data.status == "success") {
            this.questionCount = data.count;
          }
        });
        //获取粉丝数量
        followService.getUserVermicelliCount(this.userId,(data)=>{
          if (data && data.status == "success" ) {
            this.fansNum = data.result.count;
          }
        });
        //获取关注数量
        followService.getUserFollowCount(this.userId,(data)=>{
          if (data && data.status == "success" ) {
            this.focusNum = data.result.count;
          }
        });
        // 获取关注状态
        if(localStorage.getItem('token')){
          followService.testFollow(this.userId, (data)=>{
            if(data && data.status == "success") {
              if(data.result == 1) {
                this.focusState = true;
                this.btnState = true;
              }else{
                this.focusState = false;
                this.btnState = false;
              }
            }
          });
        }
        // 判断是否拉黑
        let blackData = userService.testLh(this.userId);
        if(blackData && blackData.status == "success") {
          // console.log(blackData)
          if(blackData.result == 1){
            this.blackState = true;
          }else{
            this.blackState = false;
          }
        }
      },
      // 关注用户
      handleFocus(userid){
        let data = followService.doFollow(userid);
        if(data && data.status == "success"){
          if(data.result == 1){
            this.$vux.loading.show();
            setTimeout(()=>{
              this.focusState = true;
              this.btnState =true;
              this.$vux.loading.hide();
            },500);
          }else{
            this.$vux.loading.show();
            setTimeout(()=>{
              this.focusState = false;
              this.btnState = false;
              this.$vux.loading.hide();
            },500);
          }
        }
      },

      // 解除拉黑
      handleCloseBlack() {
        let data = userService.Unblacklist(this.userId);
        this.$vux.loading.show();
        if(data && data.status == "success") {
          setTimeout(()=>{
            this.blackState = false;
            this.$vux.loading.hide();
          },500);
        }
      }
    },
    watch:{
      showGallary:{
        handler(newVal, oldVal) {
          if(newVal.Terms == true) {
            window.history.pushState(null, null, document.URL);
          }
        },
        deep: true
      },
      userId(){
        this.init();
      },
      $route(to,from){
        // to.query.userId ? (this.userId = to.query.userId):this.userId = localStorage.id;
        to.query.userId && (this.userId = to.query.userId)
        if(this.$route.name === 'publishedArticle'){
          this.ifSelf?this.current = 0:this.currentSub = 0;
        }
        // console.log(this.current)
      },
    },
    computed:{
      ifSelf(){
        return (localStorage.id == this.userId);
      }
    },
    // activated() {
    //   	this.$nextTick(()=>{
    //       this.init();
    //   	})
    // },
  /*  beforeRouteEnter (to, from, next) {
      // console.log(from);
      if (!to.query.userId && !localStorage.id) {
        GoTruth.$vux.alert.show({
          content:'您还未登录',
        })
        return false;
      }
      next((vm)=>{
        vm.userId = to.query.userId;
        if (!vm.userId){
          vm.userId = localStorage.id;
        }
        vm.current = Number(to.query.current || vm.current);
        // vm.init();
      });
    },*/
  }
</script>

<style lang="less" scoped>
  .member-msg{
    // margin-top: calc(@topHeigth + .18rem);
    position: relative;
    padding: .3rem .4rem;
    background-position: 0 0;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('../../assets/images/logo-bg.png');
    color: #fff;
    .member-msg-header{
      display: flex;
      overflow: hidden;
/*      .member-msg-image{
        width: 1.4rem;
        height: 1.4rem;
        border-radius: 50%;
        overflow: hidden;
        // margin-right: .6rem;
        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: .04rem solid @borderColor;
        }
      }*/
      .member-msg-modal {
        position: absolute;
        right: .4rem;
        .member-msg-list{
          display: flex;
          overflow: hidden;
          padding-top: .1rem;
          .member-msg-item{
            text-align: center;
            margin-right: .7rem;
            font-size: .24rem;
            span{
              display: block;
              margin-bottom: .1rem;

            }
          }
        }
      }
      .member-msg-btn{
        margin-top: .2rem;
        button {
          padding: .08rem .2rem;
          color:#66b3ff;
          font-size: .24rem;
          border: .02rem solid #66b3ff;
          border-radius: .24rem;
          margin-right: .2rem;
        }
        .btn-deit{
          color:#66b3ff;
          border-color: #66b3ff;
        }
        .btn-apply{
          color: #fff;
          border-color: @mainColor;
          background-color: @mainColor;
        }

      }
      .visitor-focus,.visitor-black{
        width: 2.8rem;
        height: .52rem;
        line-height: .5rem;
        text-align: center;
        box-sizing: border-box;
        letter-spacing: .04rem;
        border-radius: .1rem;
        position: absolute;
        left: 0;
        bottom: -.8rem;
        font-size: .3rem;
      }
      .default-focus,.visitor-black{
        background: transparent;
        border: .02rem solid #ccc;
        color: #fff;
      }
      .active-focus{
        background: #f85959;
        border: .02rem solid #f85959;
      }
    }
  }
  .member-tab{
    background-color: #fff;
    .member-switch {
      display: flex;
      text-align: center;
      white-space: nowrap;
      overflow-x: auto;
      .member-switch-item{
        flex: none;
        height: .7rem;
        line-height: .7rem;
        font-size: .28rem;
        width: 20%;
        border-bottom: .02rem solid @borderColor;
      }
      .router-link-active.active {
        color: @mainColor;
        border-bottom: .04rem solid @mainColor;
      }

    }
  }
  .router-view{
    height: calc(100% - 190px);
    overflow-y: auto;
    background: #fff;
    // padding: 0 15px;
  }
  .block{
    display: block;
  }
  .member-msg-header /deep/ .my-gallery{
    img{
      width: 1.6rem !important;
      height: 1.6rem !important;
      border-radius: 50% !important;
      border: .04rem solid @borderColor !important;
    }
  }
</style>
<style lang="less">

  .pswp__button--share{
    display: none !important;
  }
</style>
