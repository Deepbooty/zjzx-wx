<template>
  <div class="wenda-item clearfix" @click="handlewendaList(wenda)" v-if="wenda.title && !isBlacklist">
    <!--标题-->
    <h2 class="wenda-title" >{{wenda.title}}</h2>
    <!--多图-->
    <ul class="wenda-img-list">
      <li class="wenda-img" :class="{bigImg:bigImg}" v-for="(item,index) in imgList" v-if="index < 3" >
        <img :src=" fileRoot + item">
      </li>
    </ul>
    <!--问答底部-->
    <div class="wenda-footer clearfix">
      <div class="left fl clearfix">
        <span class="wenda-username" v-if="ifPublisher">{{publisher}}</span>
        <span class="wenda-num">{{wendaCount}}回答</span>
        <span class="wenda-time">{{createtime}}</span>
      </div>
      <div class="right fr" @click.stop="$emit('delete',[wenda.id,whi,$event])" v-if="ifDel">
        <i class="iconfont icon-remove"></i>
      </div>
    </div>
  </div>
</template>
<script>

  import config from '@/lib/config/config'
  import interService from '@/service/interlocutionService'
  import userService from '@/service/userService'
  export default {
    data(){
      return {
        userId: localStorage.id,
        fileRoot:config.fileRoot + '/',   // 服务器路径
        wendaCount:0,     //回答数
        createtime:'',   //回答时间
        imgList:[],       //问题图片
        publisher:'',     //问题发布人
        bigImg:false      //判断是否一张图
      }
    },
    props:{
      wenda:{
        type: Object,
        default: {}
      },
      whi:{
        type: Number
      },
      ifPublisher:{
        type:Boolean,
        default:true
      },
      ifDel:{
        type: Boolean,
        default: false
      }
    },
    mounted(){
      this.init();
    },
    updated(){
      this.$nextTick(()=>{
        if(this.wenda.userid == this.userId){
          this.publisher = localStorage.userName;
        }
      })
    },
    computed:{
      // 判断是否黑名单
      isBlacklist(){
        return this.$store.state.blacklist.includes(this.wenda.userid)
      }
    },
    methods:{
      init() {
        // 获取发布人用戶名
        if (this.ifPublisher && this.wenda.userid) {
          userService.getUserById(this.wenda.userid,(data)=>{
            if (data && data.status == "success") {
              this.publisher = data.result.user.username;
            }
          });
        }
        if(this.wenda.userid == this.userId){
          this.publisher = localStorage.userName;
        }
        //获取问题回答数量
        interService.getAnswerCount(this.wenda.id, (data)=>{
          if(data && data.status == "success") {
            this.wendaCount = this.$Tool.numConvertText(data.count);
            if(data.count == 0) {
              this.wendaCount ="暂无";
            }
          }
        });
        //获取问题发布的时间
        this.createtime = this.$Tool.publishTimeFormat(this.wenda.createtime);

        // 获取问题发布的图片
        if(this.wenda.images == "")return;

        this.imgList = this.wenda.images.split(',');
        if(this.imgList.length == 1) {
          this.bigImg = true;
        }else{
          this.bigImg = false;
        }
      },
      //进入问题列表页
      handlewendaList(item){
        if(!this.$store.state.isScolling) {
          // this.$Tool.goPage({name:'wendaList', query:{id:this.wenda.id, item:JSON.stringify(item)}})
          this.$Tool.goPage({name:'wendaList',query:{id:item.id}});
        }
      }
    },
  }
</script>
<style lang="less" scoped>
  .wenda-item {
    border-bottom: .02rem solid @borderColor;
    padding: 0.15rem 0 0.1rem;
    .wenda-title {
      max-height: 1.4rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      font-size: 0.32rem;
      line-height: 0.46rem;
      font-weight: 500;
      margin-bottom: 0.1rem;
    }
    .float-img{
      width: 2rem;
      height: 1.3rem;
      margin-left: .3rem;
      float: right;
      img{
        display: block;
        width: 100%;
        height: 100%;
        line-height: 100%;
        color: #999;
        text-align: center;
        object-fit: cover;
        padding: .02rem;
        border: .02rem solid @borderColor;
      }
    }
    .wenda-img-list{
      display: flex;
      width: 100%;
      .wenda-img{
        height: 1.6rem;
        flex: 1;
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
    .wenda-footer{
      height: .72rem;
      line-height: .72rem;
      font-size: .26rem;
      color: #999;
      .left{
        span{
          float: left;
          margin-right: .12rem;
        }
        .wenda-username{
          max-width: 2.8rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .right{
        width: .42rem;
        height: .32rem;
        line-height: .28rem;
        margin-top: .2rem;
        border: .02rem solid #c3c3c3;
        border-radius: .08rem;
        text-align: center;
        .iconfont{
          font-size: .2rem;
          color: #c3c3c3;
        }
      }
    }
  }
</style>
