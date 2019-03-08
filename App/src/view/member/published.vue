<template>
  <downRefresh @refresh="doRefresh()" @scrolling="loadMore" ref="scroll">
    <div class="article-list">
      <template v-if="!ifQA">
        <multIT
          v-for="(item,index) in arcList"
          :article="item"
          :whi="index"
          :detailType='ifSelf'
          :ifPublisher="false"
          :ifDel="ifSelf"
          @delete="deleteArticle"
          :key="index"
          v-if="!deleteIndex[index]">
        </multIT>
      </template>
      <template v-else>
        <question
          v-for="(item,index) in arcList"
          :wenda="item"
          :whi="index"
          :ifPublisher="false"
          :ifDel="ifSelf"
          @delete="deleteArticle"
          :key="index"
          v-if="!deleteIndex[index]">
        </question>
      </template>
      <prompt-blank v-if="proIf" :mes="proMes"></prompt-blank>
      <load-more v-if="arcList.length" :show-loading="ifLoad" :tip="tip"></load-more>
    </div>
  </downRefresh>
</template>

<script>
  import articleService from '@/service/articleService'
  import interService from '@/service/interlocutionService'
  export default {
    data(){
      return {
        userId:localStorage.id || 0,
        arcList:[],
        proMes:'',
        proIf:false,
        page:1,
        lock:false,
        ifLoad:true,
        scrollTop:0,
        deleteIndex:[],
        timer:null,
        ifQA:false,
        tip:"",
      }
    },
    mounted(){
      // articleService.deleteArticleById(7508);
      setTimeout(()=>{
        // this.deleteIndex = [];
        this.userId = this.$route.query.userId;
        // this.page = 1;
        // this.arcList = [];
        this.init();
      },delay)
    },
    activated(){
      this.userId = this.$route.query.userId;
      $(this.$refs["scroll"].$el).scrollTop(this.scrollTop);
    },
    methods:{
      init(){
        this.proIf = false;
        this.lock = true;
        this.ifLoad = true;
        var res;
        /*if (this.$route.name == 'published') {
            res = articleService.getArticleByUser(this.userId,this.page,10);
            // console.log(res)
        }else*/
        if (this.$route.name == 'publishedArticle') {
          res = articleService.getArticleByUser(this.userId,this.page,10,1);
        }else if (this.$route.name == 'publishedVideo') {
          res = articleService.getArticleByUser(this.userId,this.page,10,2);
        }else if (this.$route.name == 'publishedQA') {
          this.ifQA = true;
          res = interService.getQuestionPage(this.page,10,null,this.userId);
        }
        if (res && res.status == "success") {
          let temp = (!this.ifQA ? res.result.recordPage.list:res.recordPage.list);
          (temp.length < 10) && (this.ifLoad = false,this.tip = "你看到我的底线啦");
          if (temp.length) {
            this.page++;
            this.arcList = this.arcList.concat(temp);
          }else if (this.arcList.length == 0) {
            this.proIf = true;
            this.proMes = "您想要的真相消失啦~~~";
          }
        } else {
          this.proIf = true;
          this.proMes = "请求失败，请稍后再试！"
        }
        this.lock = false;
      },
      deleteArticle([id,whi,event]){
        let _this = this;
        this.$vux.confirm.show({
          content:"确定要删除么",
          onConfirm () {
            deleteArt.call(_this,whi);
          }
        })
        event.stopPropagation();
        function deleteArt (index) {
          let resDelete = (!this.ifQA?articleService.deleteArticleById(id):interService.deleteQuestion(id))
          // console.log(resDelete)
          if (resDelete && resDelete.status == "success") {
            // this.arcList.splice(index,1);
            this.$set(this.deleteIndex,whi,true);
            this.$vux.alert.show({
              content:'删除成功',
            })
            setTimeout(()=>{
              this.$vux.alert.hide();
            },1000)
          } else {
            this.$vux.alert.show({
              content:'删除失败，请重试！',
            })
          }
          // console.log(this.arcList)
        }
      },
      loadMore(e){
        //防止用户滚动中点击跳转
        if (!this.isScolling) {
          this.$store.dispatch('setIsScolling',true);
        }
        // 滚动结束200ms后解禁滚动状态
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
          this.scrollTop = $(e.target).scrollTop();
          // console.log(this.scrollTop)
          this.$store.dispatch('setIsScolling',false);
          if (!this.lock && ($(e.target).scrollTop() + $(e.target).height() + 10) >= e.target.scrollHeight) {
            this.init();
          }
        },200)
      },
      doRefresh(){
        this.page = 1;
        this.arcList = [];
        this.init();
      }
    },
    computed:{
      ifSelf(){
        return (localStorage.id == this.userId);
      },
      isScolling(){
        return this.$store.state.isScrolling;
      },
    },
    watch:{
      /*$route(to,from){
          if (to.query.userId) {
              setTimeout(()=>{
                  this.deleteIndex = [];
                  this.userId = this.$route.query.userId;
                  this.page = 1;
                  this.arcList = [];
                  this.init();
              },delay)
          }
      },*/
      userId(){
        $(this.$refs["scroll"].$el).scrollTop(0)
        setTimeout(()=>{
          this.deleteIndex = [];
          this.page = 1;
          this.arcList = [];
          this.tip = "";
          this.init();
        },delay)
      }
    },
    // beforeRouteEnter (to, from, next) {
    // 	next(vm=>{
    // 		vm.init();
    // 	})
    // }
  }
</script>

<style rel="stylesheet" scoped>
  .editor{
    color: #aaa;
    line-height: 40px;
    padding:0 0.3rem;
    border-bottom: 0.02rem solid #e8e8e8;
  }
  .deleteAll{
    border: 0.02rem solid #e8e8e8;
    border-radius: 8px;
    padding: 2px 6px;
  }
  .icon-delete{
    font-size: 18px;
  }
  .article-list{
    margin: 0 .3rem;
    padding-bottom: .4rem;
  }
</style>
