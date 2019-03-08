<template>
	<transition name="slide-ud">
		<div class="mask" v-show="value" @click="cancle">	
			<transition name="slide-ud">
				<div class="bf" v-show="value">
					<ul class="share-wrap">
						<li class="share-li" @click="share(1)">
							<div class="share-img">
								<img src="@/assets/images/icon-wechat.png">
							</div>
							微信	
						</li>	
						<li class="share-li" @click="share(2)">
							<div class="share-img">
								<img src="@/assets/images/icon-friend.png">
							</div>
							微信朋友圈
						</li>
						<li class="share-li" @click="share(3)">
							<div class="share-img">
								<img src="@/assets/images/icon-qq.png">
							</div>
							QQ
						</li>
						<li class="share-li" @click="share(4)">
							<div class="share-img">
								<img src="@/assets/images/icon-weibo.png">
							</div>
							微博
						</li>
					</ul>
					<div class="cancle" @click="cancle">
						取消
					</div>				
				</div>			
			</transition>
		</div>
	</transition>
</template>
<script>
import shareService from "@/service/shareService"
export default {
	props:{
		value:{
			type:Boolean,
			default:false,
		},
		content:{
			type:Object,
			default:{},
		}
	},
	mounted(){	
		try{
			shareService.init();
		}catch(e){
		}
	},
	methods:{
		cancle(){
			this.$emit("input",false)
		},
		//分享到第三方
		share(type){
			switch(type){
				case 1:shareService.shareToWxHy(this.content);
				break;
				case 2:shareService.shareToWxPyq(this.content);
				break;
				case 3:shareService.shareToQQ(this.content);
				break;
				case 4:shareService.shareToXl(this.content);
				break;
				default:console.log("分享出错")
			}
		},
	}
}
</script>

<style lang="less" scoped>
.mask{
	background: rgba(0,0,0,0.7) !important;
}
.bf{
	height: auto;
}
.share-wrap,.cancle{
	background: #fdfdfd;
	border-radius: 10px;
	margin: 10px;
	width: calc(100% - 20px);
	line-height: 30px;
	text-align: center;
}
.share-wrap{
	display: flex;
	justify-content: space-around;
	align-items: center;
}
.share-li{
	/*flex: auto;*/
	color: #666;
}
.share-img{
	margin: 0 auto;
	width: 1.2rem;
	height: 1.2rem;
	border-radius: 50%;
	background-color: #fff;
	img{
		display: inline-block;
		width: .75rem;
		height: .75rem;
		margin-top: .225rem;
	}
}
.iconfont{
	font-size: 20px;
}
.slide-ud-enter-active {
  transition: all .3s ease;
}
.slide-ud-leave-active {
  transition: all .3s ease;
}
.slide-ud-enter, .slide-ud-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  bottom: -50px;
  opacity: 0;
}
</style>
