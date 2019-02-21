<template>
  <div class="video-wrap" v-show="playerOptions.sources[0].src && !isBlacklist">
    <div class="video-content">
     <h3 class="video-title" @click="$Tool.goPage({ name:'detail',query:{id:article.id,} })">{{article.title}}</h3>
      <video-player class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions"
                    @play="onPlayerPlay($event)"
                    @pause="onPlayerPause($event)">
      </video-player>
    </div>
    <div class="video-footer clearfix">
      <div class="left fl">
        <div class="img">
          <img :src="$Tool.headerImgFilter(artUser.imageurl)">
        </div>
        <span class="username">{{ artUser.username}}</span>
      </div>
      <div class="right fr">
        <div class="video-msg" @click="$Tool.goPage({ name:'detail',query:{id:article.id,} })">
          <i class="iconfont icon-xiaoxi"></i>
          <span class="msg-num" v-if="countShow">{{commentNum}}</span>
        </div>
        <span class="video-time">{{publishtime}}</span>
        <div class="video-del" @click="$emit('delete',[article.id,whi,$event])" v-if="ifDel">
          <i class="iconfont icon-remove"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import config from '@/lib/config/config'
import netUtil from "@/service/util/netUtil"
import articleFileService from '@/service/article_fileService'
import articleCommentService from '@/service/article_commentService'
import userService from '@/service/userService'
import articleService from '@/service/articleService'
export default {
	data(){
		return {
			ArticleFile:[
				{
					thumbnail:"",
				}
			],
			commentNum:0,
			publishtime:'',
			fileRoot:config.fileRoot+'/',
			// publisher:"",
      countShow:false,
      artUser:{
        username:'',
        imageurl:'',
      },
			playerOptions : {
				preload: 'none',
				language: 'zh-CN',
				sources: [
					{
						type: "video/mp4",
						src: "" //url地址
					}
				],
				poster: "", //你的封面地址 
				notSupportedMessage: '暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
				controlBar: {
					timeDivider: false,
					durationDisplay: false,
					remainingTimeDisplay: false,
					fullscreenToggle: true //全屏按钮
				}
			},
		}
	},
	props:{
		article:{
      type:Object,
      default:{}
    },
		whi:{
			type:Number,
			default:0,
		},
		//判断是否显示发布人
		ifPublisher:{
			type:Boolean,
			default:true,
		},
		ifDel:false,
	},
	mounted(){
			this.init();
  //   this.$nextTick(()=>{
  //   不可异步
		// })
	},	
	/*watch:{
		article(){
			this.init();				
		}
	},*/
	methods:{
		init(){
			articleFileService.getFileByArticle(this.article.id,(data)=>{
				if (data && data.status == "success") {
          let temp = data.result.filelist[0];
  					temp && (this.playerOptions.sources[0].src = this.fileRoot + temp.url,this.playerOptions.poster = this.fileRoot + temp.thumbnail);			
				}
			});

			// 获取发布人用户名&头像
      let resUserInfo = userService.getUserById(this.article.author);
      if (resUserInfo && resUserInfo.status == "success") {
        this.artUser = resUserInfo.result.user;
      }

			// 获取文章评论数量
			articleCommentService.getArticleCommentCount(this.article.id,(data)=>{
				if (data.status == "success") {
				  this.countShow = true;
          this.commentNum = this.$Tool.numConvertText(data.result.count);
					if(this.commentNum == 0) {
            this.countShow = false;
          }
				}
			});
			this.publishtime = this.$Tool.publishTimeFormat(this.article.publishtime);		
		},
		onPlayerPlay(player){
      if (this.$store.state.isScolling) {return;}
			this.$emit("allPause",this.whi);
			if (!this.$store.state.notWifi) {
				let _this = this,
					net = {};
				try{
					net = netUtil.getNetInfo();
				}catch(player){

				}
				if (net.network !="WiFi网络") {
					this.pause();
					this.$vux.confirm.show({
						title:"温馨提示",
						content:"当前处于非WIFI网络下，是否继续播放",
						onConfirm(){
							_this.$store.state.notWifi = true;
							// _this.onPlayerPlay();无效
						}
					})
				}
			}
		},
    onPlayerPause(player){
      this.$refs.videoPlayer.player.pause();
    },

		pause(){
    this.$refs.videoPlayer.player.pause();
		}
	},
  computed:{
    // 判断是否黑名单
    isBlacklist(){
        return this.$store.state.blacklist.includes(this.article.author)
    }
  }
}
</script>
<style lang="less" scoped>
  .video-wrap{
    position: relative;
    // margin-bottom: .2rem;
    border-bottom: .02rem solid @borderColor;
    .video-content{
      .video-title{
        width: 100%;
        padding: .2rem;
        font-size: .32rem;
        line-height: .4rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
    .video-footer{
      width: 100%;
      height: 1.1rem;
      padding: 0 .3rem;
      background-color: #fff;
      .left{
        display: flex;
        line-height: 1.1rem;
        color: #555;
        .img{
          width: .8rem;
          height: .8rem;
          margin-right: .2rem;
          margin-top: .15rem;
          img{
            display: block;
            width: 100%;
            border-radius: 50%;
            border: .02rem solid @borderColor;
          }
        }
        .username{
          max-width: 2.8rem;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
      .right{
        display: flex;
        .video-msg{
          width: auto;
          position: relative;
          right: 1rem;
          background-color: red;
          line-height: 1.1rem;
          color: #999;
          .iconfont{
            position: absolute;
            top: 0;
            left: 0;
            font-size: .4rem;

          }
          .msg-num{
            position: absolute;
            top: -.15rem;
            left: .4rem;
            font-size: .24rem;
          }
        }
        .video-time{
          line-height: 1.1rem;
          margin-right: .3rem;
          color: #999;
        }
        .video-del{
          width: .6rem;
          height: .4rem;
          line-height: .4rem;
          margin-top: .35rem;

          text-align: center;
          border-radius: .1rem;
          background-color: #fff;
          border: .02rem solid @borderColor;
          .iconfont{
            font-size: .3rem;
            color:  @borderColor;
          }
        }
      }
    }
  }
</style>
