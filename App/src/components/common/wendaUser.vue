<template>
  <div class="wenda-user">
    <div class="wenda-login">
      <div class="header-login clearfix">
        <div class="left fl">
          <img :src="userPhoto">
          <span class="username">{{userName}}</span>
        </div>
        <div class="right fr">
          <router-link :to="{path:'/personBase/publishedQA',query:{current:2}}">
            我的问答
            <i class="iconfont icon-arrow-right"></i>
          </router-link>
        </div>
      </div>
      <ul class="body">
        <li class="item" @click="handleDownLoad">
          <i class="iconfont icon-tiwen"></i>
          <span>提问</span>
        </li>
        <li class="item" @click="$Tool.goPage({ name:'publishedArticle',query:{userId,current:0} })">
          <i class="iconfont icon-morentouxiang"></i>
          <span>个人中心</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  const downloadUrl = "https://mobile.baidu.com/item?docid=25512436&f0=search_searchContent%400_appBaseNormal%400";
  export default {
    data(){
      return {
        //当前用户名
        userName:localStorage.username,
        //当前用户头像
        userPhoto:localStorage.imageurl,
      }
    },
    methods:{
      // 跳转下载页面
      handleDownLoad(){
        window.location.href = downloadUrl;
      },
    }

  }
</script>

<style lang="less" scoped>
  .wenda-login{
    background-color: #fff;
    margin-bottom: .1rem;
    border-bottom: .02rem solid @borderColor;
    .header-nologin{
      padding: .47rem 0;
      text-align: center;
      border-bottom: .02rem solid @borderColor;
      span{
        color: #406599;
      }
    }
    .header-login{
      padding: .24rem .3rem;
      background-color: #fff;
      border-bottom: .02rem solid @borderColor;
      .left{
        display: flex;
        line-height: .72rem;
        img{
          display: block;
          width: .72rem;
          height: .72rem;
          margin-right: .2rem;
          border-radius: 50%;
          border: .02rem solid #e8e8e8;

        }
        .username{
          max-width: 2.8rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .right{
        line-height: .72rem;
        color: #999;
        .iconfont{
          position: relative;
          top: .02rem;
          left: -.08rem;
        }
      }
    }
    .body{
      display: flex;
      padding: .2rem 0;
      .item{
        flex: 1;
        text-align: center;
        padding: .1rem 0;
        border-right: .02rem solid @borderColor;
        &:last-child{
          border-right: none;
        }
        .iconfont{
          font-size: .36rem;
          margin-right: .1rem;
        }
        .icon-dati{
          color: #568fec;
        }
        .icon-tiwen{
          color: #ffc803;
          font-size: .4rem;
        }
        .icon-morentouxiang{
          color: #ff6b6a;
        }
        span{
          font-size: .3rem;
          font-weight: 700;
        }
      }
    }
  }

</style>
