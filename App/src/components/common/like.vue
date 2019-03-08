<template>
	<div class="bfc-d">
		<i class="iconfont icon-weizan" v-if='!likeStatus'></i>
		<i class="iconfont icon-yizan" v-else></i>
		<transition name="like-up">		
			<i class="iconfont icon-yizan like-animate" v-show="!likeStatus"></i>	
		</transition>
	</div>
</template>

<script>
export default {
	props:{
		likeStatus:false,
	},
}
</script>

<style lang="less" scoped>
.icon-heart{
	font-size:.35rem;
	 vertical-align: top;
}
.like-animate{
	position: absolute;
	left: 0;
	bottom: 0;
	opacity: 1;
	color: transparent;
    transition:opacity 1s,transform 1s;
}
.like-up-leave-to {
 	opacity: 0;
    transform: scale(2);
    color: #f40;
}
</style>