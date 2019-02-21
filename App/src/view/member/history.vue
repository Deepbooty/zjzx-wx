<template>
	<downRefresh @refresh="doRefresh()" @scrolling="loadMore" ref="scroll">
		<div>
			<div class="editor bfc-p" v-if="arcList.length">
				<i class="iconfont icon-delete fr" v-if="!ifDeleteAll" @click="ifDeleteAll = true;"></i>
				<div v-else>
					<span @click="deleteAll()" class="deleteAll">删除全部</span>
					<span class="fr" @click="ifDeleteAll = false;">完成</span>		
				</div>
			</div>
			<div class="list-wrap">
				<articleSub v-for="(item,index) in arcList" v-if="!deleteIndex[index]" :article="item" :whi="index" :ifPublisher="true" :ifHistory="true" @delete="deleteArticle" :key="index">
				</articleSub>			
			</div>
			<prompt-blank v-if="proIf" :mes="proMes"></prompt-blank>
			<load-more :show-loading="ifLoad"></load-more>
		</div>
	</downRefresh>	
</template>

<script>
import articleSub from '@/components/common/articleSub'
import readHistoryService from '@/service/readHistoryService'
import articleService from '@/service/articleService'
export default {
	components:{
		articleSub,
	},
	data(){
		return {
			arcList:[],
			proMes:'',
			proIf:false,
			ifDeleteAll:false,
			page:1,
			lock:false,
			ifLoad:true,
			deleteIndex:[],
			timer:null
		}
	},
	mounted(){
		setTimeout(()=>{
			this.deleteIndex = [];
			this.ifDeleteAll = false;
			this.page = 1;
			this.arcList = [];
			this.init();
		},delay)
	},
	activated(){
		$(this.$refs["scroll"].$el).scrollTop(this.scrollTop);
	},
	methods:{
		init(){
			this.lock = true;
			this.ifLoad = true;
			let res = readHistoryService.getReadHistory(this.page,10);
			if (res && res.status == "success") {
				if (res.recordPage.list.length) {
					this.proIf = false;
					this.page++;						
					this.arcList = this.arcList.concat(res.recordPage.list);
				}else if (this.arcList.length == 0) {
					this.proIf = true;
					this.proMes = "您想要的真相消失啦~~~";
				}
			} else {
				this.proIf = true;
				this.proMes = "请求失败，请稍后再试！"
			}
			this.lock = false;
			this.ifLoad = false;
		},
		deleteArticle([id,whi,event]){
			// debugger;
			let _this = this;
			this.$vux.confirm.show({
				content:"确定要删除么",
				onConfirm () {
					deleteArt.call(_this,whi);
				}
			})
			event.stopPropagation();
			function deleteArt (whi) {
				let resDelete = readHistoryService.clearHistory([id]);
				if (resDelete && resDelete.status == "success") {
					// this.arcList.splice(whi,1);
					this.$set(this.deleteIndex,whi,true);
					// this.deleteIndex[whi] = true;
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
		deleteAll(){
			let _this = this;
			this.$vux.confirm.show({
				content:"确定要删除么",
				onConfirm () {
					deleteA.call(_this);
				}
			});
			this.ifDeleteAll = false;
			function deleteA(){
				let temp = [];
				for (var i = 0,len = this.arcList.length; i < len; i++) {
					temp.push(this.arcList[i].id)
				}
				// console.log(temp)
				let resDelete = readHistoryService.clearHistory(temp);
				if (resDelete && resDelete.status == "success") {
					this.arcList = [];
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
                this.$store.dispatch('setIsScolling',false);
                if (!this.lock && ($(e.target).scrollTop() + $(e.target).height() + 10) >= e.target.scrollHeight) {
                    this.init();
                }
            },200)
		},
		doRefresh(){
			this.deleteIndex = [];
			this.ifDeleteAll = false;
            this.page = 1;
            this.arcList = [];
            this.init();
        }
	},
	computed:{
		isScolling(){
            return this.$store.state.isScrolling;
        },
	}
	/*watch:{
		$route(){
            $(this.$refs["scroll"].$el).scrollTop(this.scrollTop);
        console.log(this.$refs["scroll"])
        },
	}*/
	// beforeRouteEnter (to, from, next) {
	// 	next(vm=>{
	// 		vm.init();
	// 	})
	// }
}
</script>

<style rel="stylesheet" scoped>
	.editor{
		width: 100%;
		color: #aaa;
		line-height: 40px;
	    padding:0 0.3rem;
		border-bottom: 0.02rem solid #e8e8e8;
		z-index: 9;
		background: #eee;
	}
	.deleteAll{
		border: 0.02rem solid #e8e8e8;
		border-radius: 8px;
		padding: 2px 6px;
	}
	.icon-delete{
		font-size: 18px;
	}
	.list-wrap{
		padding-top: 40px;
	}
</style>