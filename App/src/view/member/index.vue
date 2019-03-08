<template>
  <div class="member-wrap">
    <div class="member-header">
      <!-- 已登录 -->
      <div class="member-login-in" @click="$Tool.goPage({ name:'publishedArticle',query:{userId,current:0} })">
        <div class="member-user">
          <div class="member-user-image">
            <img :src="userPhoto">
          </div>
          <div class="member-user-desc">
            <h4 class="member-username">{{userName}}</h4>
            <p class="member-user-item member-user-focus">关注<span>{{focusNum}}</span></p>
            <p class="member-user-item member-user-fans">粉丝<span>{{fansNum}}</span></p>
          </div>
          <div class="member-user-arrow">
            <i class="iconfont icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="member-desc">
      <ul class="member-desc-list">
        <router-link class="member-desc-item" v-for="item in tabArr" :key="item.id" tag="li" :to="{path:item.path,query:{current:item.query}}">
          <i class="iconfont" :class="item.class"></i>
          <span class="member-desc-txt">{{item.desc}}</span>
        </router-link>
      </ul>
    </div>
    <div class="member-body">
      <ul class="member-body-list">
        <li class="member-body-item" @click="toPage">
          <i class="iconfont icon-item icon-my-msg"></i>
          <div class="member-body-desc">
            <span>消息通知</span>
            <i class="iconfont icon-arrow-right arrow-item"></i>
            <div class="fr">
              <badge :text="$store.state.newMes" v-if="$store.state.newMes" v-show="badgeShow"></badge>
            </div>
          </div>
        </li>
        <router-link class="member-body-item" v-for="item in menuArr" :key="item.id" tag="li" :to="{path:item.path,query:{title:item.desc,current:item.current}}">
          <i class="iconfont icon-item" :class="item.class"></i>
          <div class="member-body-desc">
            <span>{{item.desc}}</span>
            <i class="iconfont icon-arrow-right arrow-item"></i>
            <div class="fr">
            </div>
          </div>
        </router-link>
      </ul>
    </div>
  </div>
</template>
<script>
  import config from '@/lib/config/config'
  import followService from '@/service/followService'
  import userService from '@/service/userService'
  import authUtil from '@/service/util/authUtil'
  export default {
    data() {
      return {
        loginArr: Object.freeze([
          { id: 1, class: 'icon-icon-copy' },
          { id: 2, class: 'icon-qq' },
          { id: 3, class: 'icon-weixin1' },
          { id: 4, class: 'icon-weibo' },
        ]),
        tabArr: Object.freeze([
          { id: 1, desc: '收藏', class: 'icon-not-collection', path: '/personBase/collect', query: 5 },
          { id: 2, desc: '历史', class: 'icon-history', path: '/personBase/history', query: 6 },
        ]),
        menuArr: Object.freeze([
          { id: 1, desc: '我的关注', class: 'icon-zuji', path: '/personBase/focus' ,current:4},
          { id: 2, desc: '爱心榜单', class: 'icon-paihangbang', path: '/topBase/level' },
        ]),
        loginLink: '/topBase/login',
        userId:localStorage.id,
        userName: '用户名',
        userPhoto:"",
        focusNum: 0,
        fansNum: 0,
        badgeShow:false
      }
    },
    activated() {
      this.$nextTick(()=>{
        this.loadUser();
        if(!localStorage.id && !localStorage.token){
          this.badgeShow = false;
        }else{
          this.badgeShow = true;
        }
      })
    },
    methods: {
      loadUser(){
        let res = userService.getUserById(this.userId);
        if(res && res.status == "success") {
          this.userPhoto = this.$Tool.headerImgFilter(res.result.user.imageurl);
          this.userName = res.result.user.username;
        }

        //获取粉丝数量
        followService.getUserVermicelliCount(this.userId,data=>{
          if (data && data.status == "success" ) {
            this.fansNum = data.result.count;
          }
        });
        //获取关注数量
        followService.getUserFollowCount(this.userId,data=>{
          if (data && data.status == "success" ) {
            this.focusNum = data.result.count;
          }
        });
      },
      toPage(){
        this.$vux.alert.show({
          content:'暂无通知！',
        });
        setTimeout(()=>{this.$vux.alert.hide()},1000);
      },
    }
  }

</script>
<style lang="less" scoped>
  .member-wrap{
    overflow-y: auto;
    height: calc(100vh - 1rem);
  }
  .member-header {
    padding:@statusBarHeight .4rem .3rem ;
    background-position: 0 0;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('../../assets/images/logo-bg.png');
    color: #fff;
    .member-user {
      display: flex;
      overflow: hidden;
      padding: .15rem 0;
      .member-user-image {
        width: 1.4rem;
        height: 1.4rem;
        margin-right: .34rem;
        overflow: hidden;
        img {
          overflow: hidden;
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: .04rem solid @borderColor;
        }
      }
      .member-user-desc {
        padding-top: .3rem;
        .member-username {
          width: 3rem;
          max-width: 3rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: .3rem;
          font-size: .29rem;
        }
        .member-user-item {
          display: inline-block;
          color: #f1f1f1;
          font-size: .24rem;
          margin-right: .34rem;
          span {
            margin-left: .1rem;
          }
        }
      }
      .member-user-arrow {
        margin-left: auto;

        .iconfont {
          font-size: .45rem;
          display: block;
          line-height: 1.4rem;
        }
      }
    }
  }
  .member-desc {
    background-color: #fff;
    .member-desc-list {
      display: flex;
      border-bottom: .02rem solid @borderColor;
      border-top: .02rem solid @borderColor;
      padding: .18rem 0;
      .member-desc-item {
        flex: 1;
        text-align: center;
        .iconfont {
          display: block;
          margin-bottom: .13rem;
          font-size: .48rem;
        }
        .icon-not-collection {
          color: #f68f17;
        }
        .icon-history {
          color: #f65d88;
        }
        .member-desc-txt {
          font-size: .28rem;
          font-weight: 500;
        }
      }
    }
  }
  .member-body {
    margin-top: .4rem;
    padding-bottom: .4rem;
    .member-body-item {
      display: flex;
      height: .8rem;
      line-height: .8rem;
      background-color: #fff;
      .icon-item {
        font-size: .32rem;
        width: 1rem;
        text-align: center;
      }
      .member-body-desc {
        width: calc(100% - 1rem);
        height: 100%;
        color: #333;
        font-size: .28rem;
        border-bottom: .02rem solid @borderColor;
        .arrow-item {
          float: right;
          padding-right: .3rem;
        }
      }
    }
    .member-body-item:nth-child(2n) {
      border-top: none;
    }
  }
  .vux-badge-dot{
    padding: 4px;
  }
</style>
