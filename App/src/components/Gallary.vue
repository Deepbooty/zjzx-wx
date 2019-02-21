<template>
	<div class="container" @click="handelGallaryClick">
		<div class="wrapper">
			 <swiper :options="swiperOptions">
				<swiper-slide v-for="(item, index) in imgs" :key="index">
					<img class="gallary-img" :src="item.url">
				</swiper-slide>
				<swiper-slide v-for="(item, index) in urlArr" :key="index">
					<img class="gallary-img" :src="fileRoot + item">
				</swiper-slide>
         <swiper-slide v-for="(item, index) in obj" :key="index">
           <img class="gallary-img" :src="fileRoot + item.url">
         </swiper-slide>
				<div class="swiper-pagination" slot="pagination"></div>
			</swiper>
		</div>
	</div>
</template>
<script>
	import config from '@/lib/config/config'
	export default {
		props:{
			imgs:{
				type: Array,
				default() {
					return  []
				}
			},
			urlArr:{
				type: Array,
				default() {
					return  []
				}
			},
      obj:{
			  type:Array,
        default(){
			    return []
        }
      }
		},
		 data () {
		    return {
		    	fileRoot:config.fileRoot + '/',   //服务路径
		      swiperOptions: {
		      	pagination: '.swiper-pagination',
		        paginationType: 'fraction',
		        observeParents: true,
		        observer: true
		      },
		    }
		  },
		  methods:{
		  	handelGallaryClick(){
		  		this.$emit('close');
		  	},
		  }
	}
</script>

<style lang="less" scoped>
	.swiper-container{
		overflow: inherit;
	}
  .swiper-slide{
    width: 100%;
    height: 5rem;
    display: flex;
    justify-content: center;
  }
	.container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 999;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #000;
		.wrapper{
      width: 100%;
			.gallary-img{
        width: 100%;
        object-fit: cover;
			}
			.swiper-pagination{
				color: #fff;
				bottom: -.5rem;
				font-size: .24rem;
			}
		}
	}
</style>
<style>

</style>
