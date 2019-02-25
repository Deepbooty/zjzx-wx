<!-- 首页新闻页面 -->
<template>
  <div class="index">
    <home-header></home-header>
    <div class="main-wrap">
      <div class="bfc-o main-box">
        <tab :line-width=2 v-model="classifyIndex">
          <tab-item :selected="currentClassiftyName == '推荐'" @click="currentClassiftyName = '推荐'">推荐
          </tab-item>
          <tab-item :selected="currentClassiftyName == item.classifyname" v-for="(item,index) in classifyList" @click="currentClassiftyName = item.classifyname" :key="index">{{item.classifyname}}
          </tab-item>
        </tab>
      </div>
      <div class="main">
        <swiper v-model="classifyIndex" height="100vh" :show-dots="false" :threshold="150" >
          <swiper-item>
            <listArticle></listArticle>
          </swiper-item>
          <swiper-item v-for="(item,index) in classifyList" :key="index">
            <listArticle :classify="item.classifycode" :show="index + 1 == classifyIndex?showArr[classifyIndex] = true:showArr[index + 1]"></listArticle>
          </swiper-item>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
  import { Swiper,SwiperItem } from 'vux'
  // import homeMore from'@/components/more'
  import listArticle from '@/components/listArticle'
  import articleClassifyService from '@/service/article_classifyService'
  import weChatService from '@/service/weChatService'
  export default {
    components:{
      // homeMore,
      Swiper,
      SwiperItem,
      listArticle,
    },
    data(){
      return {
        // showMore:false,
        classifyList:Object.freeze([
          {"classifyname":"揭秘","classifycode":1},
          {"classifyname":"防骗","classifycode":2},
          {"classifyname":"打假","classifycode":3},
          {"classifyname":"娱乐","classifycode":7},
          {"classifyname":"普法","classifycode":5},
          {"classifyname":"打工","classifycode":6},
          {"classifyname":"寻亲","classifycode":4}
        ]),
        classifyIndex:0,
        currentClassiftyName:"推荐",
        showArr:[],
      }
    },
    mounted () {
      this.$nextTick(()=>{
        // 获取栏目分类
        if(!localStorage.classify) {
          articleClassifyService.getArticleClassifyList((data)=>{
            if(data && data.status == "success") {
              this.classifyList = Object.freeze(data.result.classfyList);

              localStorage.classify = JSON.stringify(this.classifyList);
            }
          });
        }else{
          this.classifyList = Object.freeze(JSON.parse(localStorage.classify));
        }

        // 存储微信用户信息
        let data = weChatService.getSysUser();
        if(data && data.status == "success"){
          let wx_user = data.wx_user;
          let wxObj = {
            openid: wx_user.openid,
            nickname: wx_user.nickname,
            headimgurl:wx_user.headimgurl,
            country: wx_user.country,
            province:wx_user.province,
            city:wx_user.city,
            sex:wx_user.sex
          };
          let app_user = data.app_user;
          let appObj = {
            id: app_user.id,
            imageurl: app_user.imageurl,
            integration: app_user.integration,
            invitecode: app_user.invitecode,
            username: app_user.username,

          };
          Object.assign(localStorage,wxObj);
          Object.assign(localStorage,appObj);
          console.log(localStorage)
        }
      });
    },
  }
</script>
<style lang="less" scoped>
  .index{
    height: 100vh;
    width: 100%;
    overflow: hidden;
  }
  .main-wrap{
    height: 100vh;
    width: 100%;
    background: #fff;
    overflow: hidden;
    .main-box{
      border-bottom: .02rem solid @borderColor;
    }
  }
  .vux-tab .vux-tab-item{
    font-size: 17px !important;
    font-weight: 500;
    flex: 0 0 18% !important;
  }

</style>
<style lang="less">
  /*vux样式修改*/
  .vux-tab-wrap{
    padding-top: .76rem !important;
  }
  .vux-tab .vux-tab-item{
    color: #000 !important;
    line-height: .76rem !important;
    font-size: .28rem !important;
  }
  .vux-tab-container{
    height: .76rem !important;
  }
  .vux-tab .vux-tab-item.vux-tab-selected{
    color: @mainColor !important;
  }
  .vux-tab{
    height: .76rem !important;
  }
  .vux-tab-ink-bar{
    background-color: @mainColor !important;
  }
</style>
