<template>
	<div class="search-wrap">
		<div class="search-header clearfix">
			<i class="iconfont icon-left fl" @click="this.$Tool.goBack"></i>
			<div class="search-input fl clearfix">
				<i class="iconfont icon-search fl"></i>
				<input type="text" class="fl" v-model.trim="keywords"  ref="searchInput" maxlength="25"  @keyup="getMatchkeywords" placeholder="请输入关键词">
				<i class="iconfont icon-close-circle fr" @click="reset()" v-show="removeShow"></i>
			</div>
			<div class="search-btn fr" @click="search">搜索</div>
		</div>
		<ul class="search-mate" v-show="ifMatch">
			<li class="search-mate-item" v-for="item in matchKeywords" @click="quickSearch(item.keyword)">
				<i class="iconfont icon-search"></i>
				{{item.keyword}}
			</li>
		</ul>
		<div class="search-body">
			<ul class="search-keywords clearfix" v-show="!searchResult.length">
				<li class="item fl" v-for="(item,index) in hotKeywords" @click="quickSearch(item.keyword)">{{item.keyword}}</li>
			</ul>
			<div v-if="!searchResult.length && !resultTip">
				<div class="search-public" v-show="historyKeywords.length">
					<div class="search-public-title clearfix">
						<span class="title fl">历史记录</span>
						<i class="iconfont icon-delete fr" v-if="!ifDeleteAll" @click="ifDeleteAll = true;"></i>
						<div class="fr" v-else>
							<span @click="deleteAll()">删除全部</span>
							<span @click="ifDeleteAll = false">完成</span>
						</div>
					</div>
					<div class="search-public-content">
						<div class="search-public-item  clearfix" v-for="(item,index) in historyKeywords" @click="quickSearch(item)">
							<div class="item-desc fl">{{item}}</div>
							<span class="search-delete fr"  v-if="ifDeleteAll" @click="e=>{historyKeywords.splice(index,1);e.stopPropagation();}">
								<i class="iconfont icon-close-circle"></i>
							</span>
						</div>
					</div>
				</div>
				<!--<div class="search-public">
					<div class="search-public-title clearfix">
						<span class="title fl">猜你想搜的</span>
						<i class="iconfont icon-nosee fr" style="font-size: .2rem;"></i>
					</div>
					<div class="search-public-content clearfix">
						<div class="search-public-item clearfix" v-for="item in guessList">
							<div class="item-desc fl">{{item.guesstext}}</div>
						</div>
					</div>
				</div>-->
			</div>
			<div class="search-result" v-else>
				<div class="main-content" @scroll="loadMore" v-if="searchResult.length">
					<multIT v-for="(item,index) in searchResult" :article="item" :ifPublisher="true" :key="index"></multIT>
				</div>
				<load-more v-if="ifLoad" tip="正在加载"></load-more>
				<load-more v-else :show-loading="false" :tip="resultTip"></load-more>
			</div>
		</div>
	</div>

</template>

<script>
import searchService from '@/service/searchService'
import articleService from '@/service/articleService'

export default {
	data() {
		return {
			guessList:[],
			hotKeywords:[],
			searchResult:[],
			matchKeywords:[],
			historyKeywords:[],
			keywords:"",
			pageSize:1,
			lock:false,
			ifLoad:true,
			ifMatch:false,
			resultTip:"",
			// historyNum:4,
			ifDeleteAll:false,
      removeShow:false
		}
	},
	mounted(){
		this.getHotKeywords();
		let temp = localStorage.getItem("keywords");
		this.historyKeywords = JSON.parse(temp) || [];
		// console.log(this.historyKeywords)
	},
	activated(){
		this.ifDeleteAll = false;
		// this.historyNum = 4;
	},
	methods:{
		search(){
			if (!this.keywords) {return;}
			if (!this.$Tool.checkInput(this.keywords)) {
				this.keywords = this.$Tool.replaceNo(this.keywords);
				this.$vux.alert.show({
				  content:'搜索内容不合法，已为您删除，请确认！',
				})
				return;
			}
			this.ifMatch = false;
			this.searchResult = [];
			this.pageSize = 1;
			searchService.addSearchRecord(this.keywords);
			if (!this.historyKeywords.includes(this.keywords)) {
				this.historyKeywords.unshift(this.keywords);
			}
			let temp = JSON.stringify(this.historyKeywords);
			localStorage.setItem("keywords",temp);
			this.searchMore();
		},
		searchMore(){
			this.ifLoad = true;
			this.lock = true;
			let resSearchArticlePage = articleService.searchArticlePage(this.pageSize,15,this.keywords);
			if (resSearchArticlePage && resSearchArticlePage.status == "success") {
				this.searchResult = this.searchResult.concat(resSearchArticlePage.recordPage.list);
				this.ifLoad = false;
				if (this.searchResult.length == 0) {
					this.resultTip = '暂无相关数据';
					return;
				}
				this.pageSize++;
				this.lock = false;
				this.resultTip = '已加载全部';
			// console.log(this.keywords)
			// console.log(this.searchResult)
			}
		},
		loadMore(e){
			if (!this.lock && ($(e.target).scrollTop() + $(e.target).height()) > e.target.scrollHeight-350) {
				this.$options.methods.searchMore.call(this);
			}
		},
		// 根据输入关键字获取匹配关键字列表
		getMatchkeywords(){
			if (this.keywords == "") {
				this.matchKeywords = [];
				this.ifMatch = false;
				this.searchResult = [];
				this.resultTip = '';
				return;
			}
			searchService.getKeywordList(this.keywords,data=>{
				if (data && data.status == "success") {
					this.matchKeywords = data.recordList;
					this.matchKeywords.reverse();
					if (this.matchKeywords.length) {
						this.ifMatch = true;
					}else{
						this.ifMatch = false;
					}
				}
			})
		},
		getHotKeywords(){
			searchService.getHotKeyword(data=>{
				if (data && data.status == "success") {
					this.hotKeywords = data.recordList;
				}
			})
		},
		quickSearch(key){
			this.keywords = key;
			this.search();
		},
		reset(){
			this.keywords = "";
		},
		deleteAll(){
			let _this = this;
			this.$vux.confirm.show({
				content:"确定要删除么",
				onConfirm () {
					_this.historyKeywords = [];
					_this.ifDeleteAll = false;
				}
			})
		},
	},
	watch:{
		keywords(){
			if (this.keywords == "") {
				this.matchKeywords = [];
				this.ifMatch = false;
				this.searchResult = [];
				this.resultTip = '';
				this.removeShow = false;
				return;
			}
			this.removeShow = true;
		},
		historyKeywords(val){
			let temp = JSON.stringify(val);
			localStorage.setItem("keywords",temp);
		}
	},
}
</script>
<style lang="less" scoped>
	.search-wrap{
		background-color: #f3f4f5;
		.search-header{
			position: relative;
			left: 0;
			top: 0;
			width: 100%;
			height: .86rem;
			line-height: .86rem;
			background-color: #fff;
			.icon-left{
				display: block;
				width: .86rem;
				height: .86rem;
				line-height: .86rem;
				text-align: center;
				font-size: .4rem;
				color: #999;
			}
			.search-input{
				position: relative;
				width: calc(100% - 2.06rem);
				height: .56rem;
				line-height: .56rem;
				margin-top: .15rem;
				background-color: #f3f4f5;
				border-radius: .15rem;
				border: .02rem solid @borderColor;
				input{
					width: 100%;
					height: 100%;
					padding-left: .5rem;
					padding-right: .5rem;
					line-height: .56rem\9;
				}
				.icon-search{
					position: absolute;
					left: .1rem;
					top: 0;
				}
				.icon-close-circle{
					position: absolute;
					right: .1rem;
					top: 0;
				}
			}
			.search-btn{
				width: 1.2rem;
				height: .86rem;
				text-align: center;
				color: #2a90d7;
			}
		}
		.search-mate{
			width: 100%;
			height: calc(100% - .86rem);
			overflow: hidden;
			overflow-y: auto;
			background-color: #fff;
			border-top: .02rem solid @borderColor;
			padding-bottom: .2rem;
			.search-mate-item{
				padding: 0 .3rem;
				height: .8rem;
				line-height: .8rem;
				border-bottom: .02rem solid @borderColor;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
				&:last-child{
					border-bottom: none;
				}
				.icon-search{
					color: #999;
					margin-right: .4rem;
				}
			}
		}
		.search-body{
			width: 100%;
			height: calc(100% - .86rem);
			background-color: #fff;
			overflow: hidden;
			overflow-y: auto;
			.search-keywords{
				width: 100%;
				border-top: .02rem solid @borderColor;
				border-bottom: .02rem solid @borderColor;
				text-align: center;
				background-color: #fff;
				.item{
					width: 33.33%;
					height: .77rem;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
					padding: 0 .3rem;
					line-height: .77rem;
					border-right: .02rem solid @borderColor;
					color: #222;
					&:last-child{
						border-right: none;
					}
				}
			}
			.search-public{
				margin-top: .2rem;
				background-color: #fff;
				.search-public-title{
					height: .77rem;
					line-height: .77rem;
					padding:  0 .3rem;
					border-top: .02rem solid @borderColor;
					border-bottom: .02rem solid @borderColor;
					color: #999;
				}
				.search-public-content{
					width: 100%;
					height: auto;
					display: flex;
    				flex-wrap: wrap;
					.search-public-item{
						width: calc(100%/2);
						height: .75rem;
						line-height: .75rem;
						padding: 0 .3rem;
						border-right: .02rem solid @borderColor;
						border-bottom: .02rem solid @borderColor;
						&:nth-child(2n){
							border-right: none;
						}
						.item-desc{
							width: 85%;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
			}
		}
	}
	.search-result {
	    padding: 0 .3rem;
	}
</style>
