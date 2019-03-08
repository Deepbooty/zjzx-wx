<template>
  <div>
    <downRefresh class="main-content"  @refresh="doRefresh()" @scrolling="loadMore" ref="scroll">
      <prompt-blank
        style="margin-top: 100px;"
        v-if="ifNet && !wendaList.length"
        mes="断网啦...">
      </prompt-blank>
      <loading-main v-if="!ifNet && wendaList.length"></loading-main>
      <wenda-user></wenda-user>
      <div class="qa-list-wrap">
        <question
          v-for="(item,index) in wendaList"
          :wenda="item"
          :key="item.id">
        </question>
      </div>
      <div class="nomsg" v-show="wendaShow">
        <i class="iconfont icon-nomsg"></i>
        <span class="text">暂无数据...</span>
      </div>
      <load-more
        v-show="wendaList.length"
        :show-loading="ifLoading"
        :tip="tip">
      </load-more>
    </downRefresh>
  </div>

</template>

<script>
  import netUtil from "@/service/util/netUtil"
  import interService from '@/service/interlocutionService'

  export default {
    data() {
      return {
        wendaList: [],
        page: 1,
        lock: false,
        scrollTop: 0,
        total: 0,
        ifNew: false,
        ifNet: false,
        ifLoading: true,
        tip: "正在加载",
        timer: null,
        wendaShow: false
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    activated() {
      this.$nextTick(() => {
        this.init();
      });
    },
    methods: {
      init() {
        this.page = 1;
        try{
          let data = interService.getQuestionPage(this.page, 15);
          if(data && data.status == "success") {
            this.wendaList = data.recordPage.list;
            if(this.total == data.recordPage.totalRow){
              this.ifNew = true;
            }else{
              this.total = data.recordPage.totalRow;
              this.ifNew = false;
            }
            this.page++;
          }
        }finally {

        }
        if(this.wendaList.length == 0) {
          this.wendaShow = true;
        } else {
          this.wendaShow = false;
        }
      },
      doRefresh() {
        let net = {};
        try {
          net = netUtil.getNetInfo();
        } catch (e) {

        }
        if (net.network == "未连接网络") {
          this.$vux.toast.show({
            type: 'text',
            time: 800,
            text: '网络竟然崩溃了',
            width: '50%'
          });
          this.ifNet = true;
          return;
        } else {
          this.ifNet = false;
        }
        this.init();
        if (this.ifNew) {
          this.$vux.toast.show({
            type: 'text',
            time: 800,
            text: '已经是最新内容了',
            width: '50%'
          });
        }
      },
      loadMore(e) {
        this.throttle(this.loadMores, this, e);
      },
      // 函数节流控制
      throttle(method, context, arg) {
        let cur = +new Date();
        if (cur - (method.last || 0) > 20) {
          method.call(context, arg);
          method.last = cur;
        }
      },

      // 加载更多函数
      loadMores(e) {
        let targetH1 = $(e.target).scrollTop() + $(e.target).height() + 10;
        let targetH2 = e.target.scrollHeight;
        if (!this.isScolling) {
          this.$store.dispatch('setIsScolling', true);
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
          this.scrollTop = $(e.target).scrollTop();
          this.$store.dispatch('setIsScolling', false);
          if(!this.lock && (targetH1 >= targetH2)){
            this.getMoreWenda();
          }
        },200);
      },
      // 获取问答接口
      getMoreWenda() {
        this.lock = true;
        try{
          let data = interService.getQuestionPage(this.page,15);
          if(data && data.status == "success") {
            this.wendaList = this.wendaList.concat(data.recordPage.list);
            if(data.recordPage.list.length){
              this.page++;
            }else{
              this.ifLoading = false;
              this.tip = "已加载全部"
            }
          }
        } catch(err) {
            let net = {};
            try {
                net = netUtil.getNetInfo();
            } catch(err) {
                        
            } finally {
                if (net.network === "未连接网络") {
                    this.$vux.toast.show({
                        type:"text",
                        time:800,
                        text:"网络竟然崩潰了",
                        width:"50%",
                    });
                } 
            }
        } finally {
          this.lock = false;
        }
      }
    },
    watch: {
      $route() {
        $(this.$refs["scroll"].$el).scrollTop(this.scrollTop);
      },
      show() {
        setTimeout(() => {
          this.init();
        }, 400)
        // 延迟时间必须大于切换动画时间
      },
      "$store.state.isNetwork"(val) {
        this.ifNet = val;
      }
    },
    computed: {
      isScolling() {
        return this.$store.state.isScolling;
      }
    }
  }
</script>

<style lang="less" scoped>
  .main-content {
    position: relative;
    height: calc(100vh - 2.7rem);
    overflow: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .nomsg {
      position: relative;
      background-color: #fff;
      height: calc(100vh - 4.5rem);
      text-align: center;
      color: #999;

      .iconfont {
        display: block;
        font-size: 1.8rem;
        padding-top: 3rem;
      }

      span {
        display: block;
        padding-top: .3rem;
      }
    }
  }
  .refresh {
    overflow: hidden;
    background-color: #fafafa;
  }
  .animate {
    transition: all .5s;
  }
  .qa-list-wrap{
    padding: 0 .3rem; 
    position: relative;
    background: #fff;
  }
</style>
