<template>
	<div class="article clearfix" @click="goDetail" v-if="article.title && !isBlacklist">
		<!-- 非单图模式 -->
		<!-- 浮动单图片 -->
		<template v-if="!ifSingle">
			<img class="float-img a" v-if="3 === article.type && imgList.length == 1" :src="imgList[0]" >
			<img class="float-img" v-else-if="1 === article.type && ArticleFile.length === 1" :src="fileRoot+ArticleFile[0].url">
		</template>
		<!-- 单图模式 -->
		<img class="float-img a" v-else-if="singleImg" :src="singleImg" >
		<!-- 公共标题 -->
		<h2 class="article-title">{{article.title}}</h2>
		<!-- 非单图模式 -->
		<!-- 二或三图 -->
		<template v-if="!ifSingle">
			<div class="multiple-img-wrap" v-if="3 === article.type && imgList.length > 1">
				<!-- <div class="multiple-img" v-for="(item, index) in imgList">
					<img :src="item" >
				</div> -->
				<img class="multiple-img" :src="item" v-for="(item,index) in imgList">
			</div>
			<div class="multiple-img-wrap" v-else-if="1 === article.type && ArticleFile.length > 1">
				<img class="multiple-img" :src="item.url && (fileRoot + item.url)" v-for="(item,index) in ArticleFile" v-if="index < 3">
				<!-- <div class="multiple-img" v-for="(item, index) in ArticleFile" v-if="index < 3">
					<img :src="fileRoot + item.url" >
				</div> -->
			</div>
			<!-- 视频大图 -->
			<div class="article-video" v-else-if="2 === article.type && ArticleFile.length">
				<div class="article-play cc">
					<i class="iconfont icon-bofang1"></i>
				</div>
				<img :src="fileRoot + ArticleFile[0].thumbnail">
			</div>
		</template>
		<!-- 文章评论 -->
		<div class="article-footer clearfix">
				<!-- <span class="publisher oe" v-if="ifPublisher">{{publisher}}</span> -->
				<span class="stick" v-if="ifTop == 10">置顶</span>
				<!--<span class="stick" v-if="hotShow === 8 || hotShow ===9">热</span>-->
				<span class="publisher oe">{{publisher}}</span>
				<span>{{commentNum}}评论</span>
				<span class="publish-time">{{publishtime}}</span>
			<!-- <div class="fl">
			</div> -->
			<!-- <div class="fr article-remove" @click="$emit('delete',[article.id,whi,$event])" v-if="ifDel">
				<i class="iconfont icon-remove"></i>
			</div> -->
			<i class="iconfont icon-remove fr article-remove" @click="$emit('delete',[article.id,whi,$event])" v-if="ifDel"></i>
			<i class="iconfont icon-remove fr article-remove" @click.stop="showRemove()" v-if="ifRemove"></i>
			<!-- <div class="fr article-remove" v-if="ifRemove">
				<i class="iconfont icon-remove"></i>
			</div> -->
		</div>
	</div>
</template>
<script>
import config from '@/lib/config/config'
import articleFileService from '@/service/article_fileService'
import articleCommentService from '@/service/article_commentService'
import userService from '@/service/userService'
import articleService from '@/service/articleService'

export default {
	data(){
		return {
		    ArticleFile:[],
			commentNum:0,
			publishtime:"",
			fileRoot:config.fileRoot+'/',
			publisher:"",
			imgList:[],
			singleImg:"",
		}
	},
	props:{
		article:{
			type:Object,
			default:{}
		},
		whi:{
			type:Number,
		},
		//判断是否为作者详情视图(真:为作者视图；假（空）:为浏览视图)
		detailType:{
			type:Boolean,
			default:false,
		},
		//判断是否显示发布人
		ifPublisher:{
			type:Boolean,
			default:true,
		},
		ifDel:{
			type:Boolean,
			default:false,
		},
		// 是否为单张小图片视图
		ifSingle:{
			type:Boolean,
			default:false,
		},
		ifRemove:{
			type:Boolean,
			default:false,
		},
		ifTop:{
			type:Number
		}
	},
	mounted(){
		this.init();
	},
	watch:{
		//使用了缓存，父组件传值发生改变，子组件需要监测对应改变的对象值，不然子组件重新渲染还是使用缓存中的值
		article(){
			this.init();
		},
	},
	computed:{
		/*stickShow(){
			return this.article.weight == 10;
		},
		hotShow(){
			return this.article.weight <= 9 && this.article.weight >= 8;
		},*/
		// 判断是否黑名单
        isBlacklist(){
            return  this.$store.state.blacklist.includes(this.article.author)
        }
	},
	methods:{
		init(){
			articleFileService.getFileByArticle(this.article.id,data=>{
				if (data && data.status == "success") {
					this.ArticleFile = data.result.filelist;
					// console.log(this.ArticleFile);
				}
			});
			if (this.ifPublisher && this.article.author) {
				userService.getUserById(this.article.author,data=>{
					if (data && data.status == "success") {
						this.publisher = data.result.user.username;
					}
				});
			}
			// 获取文章评论数量
			articleCommentService.getArticleCommentCount(this.article.id,data=>{
				if (data.status == "success") {
					this.commentNum = this.$Tool.numConvertText(data.result.count);
				}
			});
			this.publishtime = this.$Tool.publishTimeFormat(this.article.publishtime);
			if (this.article.type == 3) {
				this.imgList = this.$Tool.extractImg(this.article.content,3);
			}
			this.ifSingle && (this.singleImg = this.imgList[0] || this.ArticleFile.length && this.fileRoot + (2 == this.article.type?this.ArticleFile[0].thumbnail:this.ArticleFile[0].thumbnail))
		},
		goDetail(){
			if (!this.$store.state.isScolling) {
				!this.ifSingle ? this.$Tool.goPage({ name:'detail',query:{id:this.article.id,detailType:this.detailType}}) : this.$Tool.goPage({ name:'detail',query:{id:this.article.id,detailType:this.detailType},replace:'true'})
			}
		},
		showRemove(){
			this.$store.state.reportArticle = this.article;
		}
	}
}
</script>
<style lang="less" scoped>
	.article {
	    border-bottom: 1px solid @borderColor;
	    padding: .15rem 0 .1rem;	
		.article-title{
			// height: 1.3rem;
			max-height: 1.4rem;
			overflow: hidden;
			text-overflow:ellipsis;
			display:-webkit-box; 
			-webkit-box-orient:vertical;
			-webkit-line-clamp:3; 
			font-size: .32rem;
			line-height: .46rem;
			font-weight: 500;
			margin-bottom: 0.06rem;
		}
		.float-img{
			display: block;
			width: 2rem;
			height: 1.3rem;
			margin-left: .3rem;
			object-fit: cover;
			padding: .02rem;
			float: right;
		}
		.multiple-img-wrap{
			display: flex;
			width: 100%;
			height: 1.6rem;
			overflow: hidden;
			img{
				/* display: block;
				width: 100%;
				height: 100%; */
				width: 0px;
				padding: .02rem;
				object-fit: cover;
			}
		}
		.article-video{
			position: relative;
			width: 100%;
			height: 4rem;
			.article-play{
				width: .88rem;
				height: .88rem;
				line-height: .88rem;
				border-radius: 50%;
				text-align: center;
				background-color: rgba(0,0,0,.4);
				.iconfont{
					padding-top: .08rem;
					padding-left: .08rem;
					font-size: .35rem;
					color: #f1f1f1;
				}
			}
			img{
				display: block;
				width: 100%;
				height: 100%;
				padding: .02rem;
				object-fit: cover;
			}
		}
		.article-footer{
			position: relative;
			// height: .6rem;
			line-height: .55rem;
			font-size: .24rem;
			color: #a3a3a3;
			.publisher{
				max-width: 80px;
			}
			span{
				margin-right: .1rem;
			}
			.stick{
				display: inline-block;
				line-height: .4rem;
				text-align: center;
				border: .02rem solid #ed4040;
				transform: scale(.9);
				color: #ed4040;
				padding: 0 .06rem;
				letter-spacing: .02rem;
				border-radius: .1rem;
			}
			.article-remove{
				width: .45rem;
				height: .35rem;
				line-height: .35rem;
				margin-top: .125rem;
				text-align: center;
				border: .02rem solid @borderColor;
				border-radius: .08rem;
				font-size: .24rem;
				/* .iconfont{
					font-size: .24rem;
				} */
			}
		}
		.publish-time{
			white-space: nowrap;
		}
	}
	img{
		background: @bgColor url('../../assets/images/imgErrorBg.png') center no-repeat;
		background-size: 50%;
	}
	.multiple-img{
		flex: 1;
	}
</style>
