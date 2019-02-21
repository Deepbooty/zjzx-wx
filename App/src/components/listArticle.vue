<template>
  <downRefresh class="main-content" @refresh="doRefresh()" @scrolling="loadMore" ref="scroll">
    <div class="article-list">
      <div class="xunqing ac" v-if="classify == 4">
        公益寻亲：免费发布寻人寻亲信息，利用网络信息技术帮助失散人群，早日回家团圆。邮箱：2787064791@qq.com
      </div>
      <prompt-blank style="margin-top:100px;" v-if="ifNet && !arcList.length" mes="断网啦..."></prompt-blank>
      <loading-main v-if="!ifNet && !arcList.length"></loading-main>
      <multIT v-for="(item,index) in arcList" :article="item" :key="index" :ifRemove="true" :ifTop='item.weight'></multIT>
      <load-more v-show="!ifNet && arcList.length" :show-loading="ifLoading" :tip="tip"></load-more>
    </div>
  </downRefresh>
</template>

<script>
  import netUtil from "@/service/util/netUtil"
  // import downRefresh from '@/components/common/downRefresh'
  import articleService from '@/service/articleService'
  export default {
    /*components:{
        downRefresh,
    },*/
    data(){
      return {
        arcList:[],
        page:1,
        lock:false,
        // ifLoad:false,
        scrollTop:0,
        total:0,
        ifNew:false,
        ifNet:false,
        ifLoading:true,
        tip:"正在加载",
        timer:null,
        topList:[]
      }
    },
    props:{
      classify:{
        type:Number,
        default:0,
      },
      show:{
        type:Boolean,
        default:false,
      }
    },
    mounted () {
      this.$nextTick(()=>{
        if(!this.classify){
          this.init();
        }
      });
    },
    methods:{
      init(){
        try{
          if(!this.classify || this.classify == 0) {
            this.topList = articleService.getTodayArticle().list;
            let recommendData = articleService.recommendArticle();
            let temp = recommendData.recordList;
            let same = [];
            // 置顶与推荐查看
            for (let i = 0,len = temp.length; i < len; i++) {
              for (let j = 0,len1 = this.topList.length; j < len1; j++) {
                if (temp[i].id == this.topList[j].id) {
                  same.push(i);
                  break;
                }
              }
              if(same.length == this.topList.length) {break;}
            }
            for (let i = 0; i < same.length; i++) {
              temp.splice(same[i] - i,1)
            }
            recommendData.recordList = this.topList.concat(temp);
            if(recommendData && recommendData.status == "success") {
              this.arcList = recommendData.recordList;
            }
          }else{
            this.page = 1;
            let classifyData = articleService.articlePage(this.page, 15, this.classify);
            if(classifyData && classifyData.status == "success"){
              this.arcList = classifyData.recordPage.list;
              if(this.total == classifyData.recordPage.totalRow){
                this.ifNew = true;
              }else{
                this.total = classifyData.recordPage.totalRow;
                this.ifNew = false;
              }
              this.page++;
            }
          }
        }finally {

        }

      },
      doRefresh(){
        let net = {};
        try{
          net = netUtil.getNetInfo();
        }catch(e){
          // console.log(e)
        }
        if (net.network === "未连接网络") {
          this.$vux.toast.show({
            type:"text",
            time:800,
            text:"网络竟然崩潰了",
            width:"50%",
          });
          this.ifNet = true;
          return;
        }else{
          this.ifNet = false;
        }
        this.init();
        if (this.ifNew) {
          this.$vux.toast.show({
            type:"text",
            time:800,
            text:"已经是最新内容了",
            width:"50%",
          });
        }
      },
      loadMore(e){
        this.throttle(this._loadMore,this,e);
      },
      //函数节流控制
      throttle(method,context,arg) {
        let cur = +new Date();
        if (cur - (method.last || 0) > 20) {
          method.call(context,arg);
          method.last = cur;
        }
      },
      _loadMore(e){
        //防止用户滚动中点击跳转
        if (!this.isScolling) {
          this.$store.dispatch('setIsScolling',true);
        }
        // console.log(this.scrollTop)
        // 滚动结束200ms后解禁滚动状态
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
          this.scrollTop = $(e.target).scrollTop();
          this.$store.dispatch('setIsScolling',false);
          if (!this.lock && ($(e.target).scrollTop() + $(e.target).height() + 10) >= e.target.scrollHeight) {
            this.getMoreActicle();
          }
        },200)
      },
      getMoreActicle(){
        this.lock = true;
        let classifyData;
        try{
          if(this.classify == 0){
            classifyData = articleService.articlePage(this.page,15);
            let temp = classifyData.recordPage.list;
            let same = [];
            for (let i = 0,len = temp.length; i < len; i++) {
              for (let j = 0,len1 = this.topList.length; j < len1; j++) {
                if (temp[i].id == this.topList[j].id) {
                  same.push(i);
                  break;
                }
              }
              if(same.length == this.topList.length) {break;}
            }
            // 删除重复
            for (let i = 0; i < same.length; i++) {
              temp.splice(same[i] - i,1)
            }
          }else{
            classifyData = articleService.articlePage(this.page,15,this.classify);
          }
          if (classifyData && classifyData.status == "success") {
            this.arcList = this.arcList.concat(classifyData.recordPage.list);
            if (classifyData.recordPage.list.length) {
              this.page++;
            }else{
              this.ifLoading = false;
              this.tip = "你看到我的底线啦";
            }
          }
        }finally{
          this.lock = false;
        }
      },

    },
    watch:{
      $route(){
        $(this.$refs["scroll"].$el).scrollTop(this.scrollTop);
        // console.log(this.$refs["scroll"])
      },
      show(){
        setTimeout(()=>{
          this.init();
        },400)
        // 延迟时间必须大于切换动画时间
      },
      "$store.state.isNetwork"(val){
        this.ifNet = val;
      }
    },
    computed:{
      isScolling(){
        return this.$store.state.isScrolling;
      },
    }
  }
</script>

<style lang="less" scoped>
  .main-content{
    position: relative;
    height: calc(100vh - 2.7rem);
    // overflow: hidden;
    // overflow-y: auto;
    -webkit-overflow-scrolling:touch;
  }
  .refresh{
    background: #fafafa;
    overflow: hidden;
  }
  .animate{
    transition: all .5s;
  }
  .article-list{
    margin: 0px 0.3rem;
  }
  .xunqing{
    color: @deepMainColor;
    margin-top: 5px;
    line-height: 20px;
  }
</style>
