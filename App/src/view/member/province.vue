<template>
	<div class="province-wrap">
		<ul class="province-list" v-show="true">
			<li class="province-item clearfix" v-for="item in provinceList" :key="item.provinceid"  @click="$Tool.goPage({name:'city',query:{title:item.province,provinceid:item.provinceid}})">
          <span class="province-desc fl">{{ item.province }}</span>
          <i class="iconfont icon-right fr"></i>
			</li>
        </ul>
	</div>
</template>

<script>
import provinceService from '@/service/provinceService'
export default {
	data(){
		return {
			provinceList:[
				{
          provinceid:"",
					province:""
				}
			],
		}
	},
	mounted(){
		this.$nextTick(()=>{
			let resMap = provinceService.getProvinceList();
			console.log(resMap)
			if (resMap && resMap.status == "success") {
				this.provinceList = resMap.result.provinceList;				
			}
		})
	},
	methods:{
		// provinFn(item){
		// 	Bus.$emit('add',item)
		// 	// console.log(item.provinceid);
		// }
	}

}

</script>
<style lang="less" scoped>
  .province-wrap {
    height: calc(100vh - .87rem);
    overflow: hidden;
    overflow-y: auto;
    background-color: #fff;
    .province-list {
      padding-left:.3rem;
      .province-item{
        height: .8rem;
        line-height: .8rem;
        padding-right: .3rem;
        border-bottom: .02rem solid @borderColor;
        color: #222;
        &:last-child{
          border-bottom: none;
        }
        .iconfont{
          color: #999;
        }
        .province-desc{
          font-size: .28rem;
        }
      }
    }
  }
</style>
