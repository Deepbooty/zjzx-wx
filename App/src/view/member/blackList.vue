<template>
  <downRefresh @refresh="doRefresh()" @scrolling="loadMore" ref="scroll">
    <div class="black-wrap">
      <ul class="black-list">
        <li class="black-item clearfix" v-for="(item,index) in blackList" :key="item.id" @click="goPerson(item.id)">
          <img class="black-img fl" :src="$Tool.headerImgFilter(item.imageurl)">
          <div class="black-desc fl">
            <h3 class="black-name">{{item.username}}</h3>
            <span class="black-autograph">{{item.introduce}}</span>
          </div>
          <div v-if="item.ifBlack" class="black-btn btn-active fr" @click.stop="handleCloseBlack(item)">解除</div>
          <div v-else class="black-btn btn-default fr" @click.stop="handleOpenBlack(item)">已解除</div>
        </li>

        <li class="not-blackList" v-show="noBlackList">
          <i class="iconfont icon-nomsg"></i>
          <div class="tip">黑名单为空</div>
        </li>
      </ul>
    </div>
  </downRefresh>
</template>

<script>
  import listUtil from '@/service/util/listUtil'
  import config from '@/lib/config/config'
  import userService from '@/service/userService'
  export default {
    name: "blackList",
    data(){
      return{
        userid:localStorage.id,
        fileRoot:config.fileRoot + '/',
        blackList:[],
        blackState:false,
        blackColor:false,
        ifBlack:true,
        noBlackList:false,
        timer:null,
        lock:false
      }
    },
    activated() {
      this.$nextTick(()=>{
        this.init();
      });
    },
    computed:{
      isScolling(){
        return this.$store.state.isScrolling;
      }
    },
    methods:{
      init(){
        let data = userService.getBlacklist(this.userid);
        this.blackList = [];

        if(data && data.status == "success"){
          let list = data.recordList;
          for(let i =0; i<list.length; i++){
            let userData = userService.getUserById(list[i]);
            if(userData && userData.status == "success"){
              this.blackList.push(userData.result.user);
              for(let j =0;j<this.blackList.length;j++){
                this.$set(this.blackList[j],'ifBlack',true);

              }
            }
          }
          if(this.blackList.length == 0){
            this.noBlackList = true;
          }else{
            this.noBlackList = false;
          }
        }
      },

      // 解除拉黑
      handleCloseBlack(item){
        let data = userService.Unblacklist(item.id);
        this.$vux.loading.show();
        if(data && data.status =="success"){
          setTimeout(()=>{
            item.ifBlack = false;
            this.$vux.loading.hide();
          },500);

        }
      },
      // 拉黑
      handleOpenBlack(item){
        let data = userService.blacklist(item.id);
        this.$vux.loading.show();
        if(data && data.status == "success"){
          setTimeout(()=>{
            item.ifBlack = true;
            this.$vux.loading.hide();
          },500)
        }
      },

      // 进入用户中心
      goPerson(userId){
        this.$Tool.goPage({name:'published',query:{userId,}})
        // location.reload();
      },
      // 下拉加载
      loadMore(e){
        if(!this.isScolling){
          this.$store.dispatch('setIsScoling', true);
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
          this.scrollTop = $(e.target).scrollTop();
          let h1 = $(e.target).scrollTop();
          let h2 = $(e.target).height() + 10;
          this.$store.dispatch('setIsScoling', false);
          if(!this.lock && (h1 + h2) >= e.target.scrollHeight) {
            this.init();
          }
        },200);
      },
      doRefresh(){
        this.init();
      }
    }

  }
</script>

<style lang="less" scoped>
  .black-wrap {
    height: calc( 100% - .87rem );
    overflow: hidden;
    overflow-y: auto;
    padding: 0 .3rem;
    background-color: #fafafa;
    .black-list{
      .black-item{
        padding: .3rem 0;
        border-bottom: .02rem solid @borderColor;
        .black-img{
          display: block;
          width: .72rem;
          height: .72rem;
          margin-right: .3rem;
          border-radius: 50%;
        }
        .black-desc{
          display: inline-block;
          width: 64%;
          .black-name{
            font-weight: 500;
            font-size: .32rem;
            letter-spacing: .02rem;
            margin-top: .06rem;
            color: #505050;
          }
          .black-autograph{
            display: inline-block;
            width: 100%;
            letter-spacing: .02rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: .28rem;
            margin-top: .06rem;
            color: #999999;
          }
        }

        .black-btn{
          margin-top: .1rem;
          padding: .12rem .18rem;
          border: .02rem solid transparent;
          border-radius: .15rem;
          letter-spacing: .02rem;
          font-size: .32rem;
        }
        .btn-active{
          border-color: #f9aaaa;
          color: #f85959;
        }
        .btn-default{
          border-color: #999;
          color: #999;
        }
      }
      .not-blackList{
        text-align: center;
        min-height: 2rem;
        padding: 1rem 0;
        color: #999;
        .iconfont{
          font-size: .8rem;
        }
        .tip{
          font-size: .3rem;
          margin-top: .3rem;
          letter-spacing: .04rem;
        }
      }
    }
  }
</style>
