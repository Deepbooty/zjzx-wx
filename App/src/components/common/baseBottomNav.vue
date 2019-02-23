<template>
  <div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <div class="footer-wrap">
      <div class="footer-nav clearfix">
        <div class="footer-item">
          <router-link to="/home" exact>
            <i class="iconfont icon-gruth footer-icon"></i>
            <span class="footer-text">首页</span>
          </router-link>
        </div>
        <div class="footer-item">
          <router-link :to="{path:'/questionAnswer'}" exact>
            <i class="iconfont icon-xiaoxi footer-icon"></i>
            <span class="footer-text">问答</span>
          </router-link>
        </div>
        <div class="footer-item">
          <router-link :to="{path:'/video'}" exact>
            <i class="iconfont icon-faxian footer-icon"></i>
            <span class="footer-text">今日真相</span>
          </router-link>
        </div>
      </div>
      <div class="footer-down clearfix" v-if="downShow">
        <div class="down-img fl">
          <img src="@/assets/images/bar-logo.png" alt="">
        </div>
        <div class="down-btn fr" @click="handleDownLoad">
          立即下载
        </div>
        <div class="down-close" @click.stop="handleCloseDown">
          <i class="iconfont icon-close"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        badgeShow:false,
        downShow:true
      }
    },
    computed:{
      newMes(){
        return this.$store.state.newMes || this.$store.state.newVersion;
      }
    },
    methods:{
      handleCloseDown(){
        this.downShow = false;
      },
      handleDownLoad(){
        window.location.href = "https://mobile.baidu.com/item?docid=25512436&f0=search_searchContent%400_appBaseNormal%400"
      }
    },
    activated(){
      if(!localStorage.id){
        this.badgeShow = false;
      }else{
        this.badgeShow = true;
      }
    }

  }
</script>
<style lang="less" scoped>
  .footer-wrap{
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    .footer-nav{
      width: 100%;
      padding: .12rem 0;
      text-align: center;
      overflow: hidden;
      background-color: #fff;
      border-top: .02rem solid @borderColor;
      .footer-item {
        float: left;
        width: 33.33%;
        height: .88rem;
        color: #666;
        .footer-icon {
          padding-top: .08rem;
          display: block;
          font-size: .4rem;
        }
        .footer-text{
          display: block;
          margin-top: .05rem;
          font-size: .24rem;

        }
      }
      .footer-item a.router-link-active,.current{
        color: @deepMainColor;
      }
    }
    .footer-down{
      padding: .1rem .7rem .1rem .4rem;
      width: 100%;
      height: .88rem;
      background: #434343;
      .down-img{
        width: 52%;
      }
      .down-btn{
        width: 1.8rem;
        height: .6rem;
        line-height: .6rem;
        margin-top: .07rem;
        font-size: .24rem;
        color: #fff;
        text-align: center;
        border-radius: .35rem;
        background: linear-gradient(#f7ba15, #f89a1e);
      }
      .down-close{
        position: absolute;
        bottom: .36rem;
        right: .06rem;
        width: .36rem;
        height: .36rem;
        line-height: .36rem;
        text-align: center;
        border-radius: 50%;
        background-color: #7d7d7d;
        .iconfont{
          font-size: .2rem;
          color: #fff;
        }
      }
    }
  }

</style>
