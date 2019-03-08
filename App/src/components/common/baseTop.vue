<template>
	<div>
		<top>
			<template slot="title">{{title}}</template>
		</top>
		 <transition :name="$store.state.transitionName">
		 	<keep-alive>
		        <router-view  class="router-view"></router-view> 
	     	</keep-alive>
		 	<!-- <keep-alive v-if="!$route.meta.keepAlive">
		        <router-view  class="router-view"></router-view> 
	     	</keep-alive>      
		      	<router-view v-else class="router-view"></router-view> -->
		</transition>
	</div>
</template>

<script>
export default{
	data(){
		return{
			title:'title',
			transitionName:''
		}
	},
	mounted(){
		this.title = this.$route.query.title;
	},
	watch:{
		$route(){
			this.title = this.$route.query.title;
		}
	}
}
</script>

<style scoped>
	.hreficon{
		width: 30px;
	}
	.router-view {
		position: absolute;
		width: 100%;
		left: 0;
	    height: 100vh !important;
	    background: #f4f5f6;
		transition: transform .3s cubic-bezier(.55,0,.1,1);
	}
</style>
