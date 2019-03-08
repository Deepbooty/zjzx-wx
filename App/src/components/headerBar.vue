<template>
  <div class="header-wrapper">
    <div class="header-find">
      <img src="@/assets/images/logo-icon@100.png" alt="">
    </div>
    <div class="header-title">
      <img src="@/assets/images/wx-logo.png" class="header-logo">
      <!--<i class="iconfont icon-refresh"></i>-->
    </div>
    <div class="header-search" @click="$Tool.goPage({ name:'search'})">
      <i class="iconfont icon-search" ></i>
    </div>
  <!--  <div class="mask">
    <div class="mask-wrap">

    </div>
  </div>-->
  </div>
</template>
<script>
  import searchService from '@/service/searchService'
  export default {
    data(){
      return {
        keywords:[],
        rotates: false
      }
    },
    mounted(){
      this.getHotKeywords();
    },
    methods:{
      // 初始化渲染
      init(){

      },
      getHotKeywords(){
        searchService.getHotKeyword(data=>{
          if (data && data.status == "success") {
            this.keywords = data.recordList;
          }
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  .header-wrapper{
    display: flex;
    flex: 1;
    width: 100%;
    height: .9rem;
    line-height: .9rem;
    padding: 0 .2rem;
    background: linear-gradient(#f7ba15,#f89a1e);
    .header-find,.header-search{
      flex-basis: .8rem;
      text-align: center;
      .iconfont{
        font-size: .42rem;
        color: #fff;
      }
      & img{
        width: 85%;
      }
    }
    .header-title{
      flex-basis: calc(100% - 1.6rem);
      text-align: center;
      font-size: .36rem;
      color: #fff;
      .header-logo{
        display: inline-block;
        width: 38%;
        margin-right: .05rem;
      }
      .icon-refresh{
        position: relative;
        top: .06rem;
        font-size: .38rem;
      }
    }
/*    .mask{
      position: fixed;
      left: 0;
      top: 0;
      z-index: 99;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0,0,0,0.5);
      .mask-wrap{
        width: 75%;
        height: 4.8rem ;
        border-radius: .16rem;
        background-color: #fff;
      }
    }*/
  }
</style>
