<template>
	<div class="text-wrap bfc-o"  @click="goDetail()">
			<!-- 单图文 -->
			<img class="float-img a" v-if="3 === articleSub.type && imgList.length === 1" :src="imgList[0]" >
		<img class="float-img" v-else-if="1 === articleSub.type && ArticleFile.length === 1" :src="fileRoot+ArticleFile[0].url">
		<!-- 公共标题 -->
		<h1 class="article-title">{{articleSub.title}}</h1>
		<!-- 二或三图 -->
		<div class="multiple-img-wrap" v-if="imgList.length > 1">
			<img class="multiple-img" v-for="(item,index) in imgList" :src="item">
		</div>
		<div class="multiple-img-wrap" v-else-if="1 === articleSub.type && ArticleFile.length > 1">
			<img class="multiple-img" :src="item.url && (fileRoot + item.url)" v-for="(item,index) in ArticleFile">
		</div>
		<!-- video -->
		<div class="article-video" v-else-if="2 === articleSub.type && ArticleFile.length">
			<div class="article-play cc">
				<i class="iconfont icon-bofang1"></i>
			</div>
			<img :src="fileRoot + ArticleFile[0].thumbnail">
		</div>
			<!-- <div class="img-wrap fr" v-if="imgList.length < 3">
				<img v-for="(item,index) in imgList" v-if="index == 0" :src="item?item:imgurl">	
			</div>
			<h1 class="articel-title">{{articleSub.title}}</h1>
			三图文
			<div class="img-wrap bfc-o" v-if="imgList.length >=3">
				<img v-for="(item,index) in imgList" v-if="index < 3" :src="item?item:imgurl">	
			</div>
			picture
			<div class="img-wrap img-three bfc-o" v-if="1 == articleSub.type && ArticleFile.length">
				<ul class="img-list clearfix">
					<li class="img-item" v-for="(item, index) in ArticleFile" v-if="index < 3">
						<img :src="item.url?(fileRoot+item.url):imgurl" alt="">
					</li>
				</ul>
			</div>
			video
			<div class="big bfc-o" v-else-if="2 == articleSub.type && ArticleFile.length">
				<i class="iconfont icon-play-circle cc"></i>
				<img class="big" :src="ArticleFile[0].thumbnail?(fileRoot + ArticleFile[0].thumbnail):imgurl" alt="">
			</div> -->
		<p class="pub">
			<span v-if="ifPublisher">{{publisher}}</span>
			<span>{{CommentNum}}评</span>
			<span>{{publishtime}}</span>
			<small class="delete fr" @click="$emit('delete',[article.articleid,whi,$event]);" v-if="ifDel">X</small>
		</p>
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
			imgurl:require('@/assets/images/user_head.jpg'),
			ArticleFile:[
				{
					thumbnail:"",
				}
			],
			CommentNum:0,
			publishtime:this.article.publishtime,
			fileRoot:config.fileRoot+'/',
			publisher:"",
			imgList:[],
			articleSub:{},
		}
	},
	props:{
		article:{
			type:Object,
			default:{},
		},
		whi:{
			type:Number,
		},
		//判断是否为作者详情视图(真:为作者视图；假（空）:为浏览视图)
		detailType:{
			type:String,
			default:"",
		},
		//判断是否显示发布人
		ifPublisher:{
			type:Boolean,
			default:true,
		},
		ifDel:{
			type:Boolean,
			default:true,
		},
	},
	mounted(){
		this.$nextTick(()=>{
			this.init();
		})
	},	
	watch:{
		//使用了缓存，父组件传值发生改变，子组件需要监测对应改变的对象值，不然子组件重新渲染还是使用缓存中的值
		article(){
			this.init();
		},
	},
	methods:{
		init(){
			let resArticleDetail = articleService.getArticleById(this.article.articleid);
			if (resArticleDetail && resArticleDetail.status == "success") {
				// console.log(resArticleDetail)
				if (!resArticleDetail.record) {

					this.$set(this.articleSub,'id',false);
					this.$set(this.articleSub,'title',"作者已删除");	
					return;			
				}
				this.articleSub = resArticleDetail.record;				
			}else{
				this.$set(this.articleSub,'id',false);
				this.$set(this.articleSub,'title',"请求超时");
			}
			articleFileService.getFileByArticle(this.articleSub.id,data=>{
				if (data&&data.status == "success") {
					this.ArticleFile = data.result.filelist;				
				}				
			});
			if (this.ifPublisher) {
				if (this.articleSub.author) {
					userService.getUserById(this.articleSub.author,data=>{
						if (data && data.status == "success") {
							this.publisher = data.result.user.username;
						}
					});				
				}				
			}
			// 获取文章评论数量
			articleCommentService.getArticleCommentCount(this.articleSub.id,data=>{
				if (data.status == "success") {
					this.CommentNum = data.result.count;		
				}else{
					this.CommentNum = 0;
				}					
			});

			this.publishtime = this.$Tool.publishTimeFormat(this.articleSub.publishtime);	
			this.imgList = this.$Tool.extractImg(this.articleSub.content,3);
		},
		goDetail(){
			if(!this.articleSub.id) { return; } 
			this.$Tool.goPage({ name:'detail',query:{id:this.articleSub.id,detailType:this.detailType,}})
		}
	}
}
</script>
<style lang="less" scoped>
	.text-wrap {
		padding: .3rem;
		border-bottom: .02rem solid @borderColor;
		background-color: #fff;
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
		.multiple-img{
			flex: 1;
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

		.pub {
			line-height: .4rem;
			font-size: .24rem;
			color: #999;
			.delete{
				width: .5rem;
				height: .4rem;
				line-height: .4rem;
				border: .02rem solid @borderColor;
				border-radius: .12rem;
				text-align: center;
				font-size: .2rem;
			}
		}
	}
</style>
