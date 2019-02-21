<template>
  <div class="header-wrapper">
    <div class="header-find">
      <i class="iconfont icon-dfabu"></i>
    </div>
    <div class="header-title">
      <img src="@/assets/images/logo.png" class="header-logo" alt="直击真相">
      <i class="iconfont icon-refresh"></i>
    </div>
    <div class="header-search" @click="$Tool.goPage({ name:'search' })">
      <i class="iconfont icon-search" ></i>
    </div>

  </div>
</template>
<script>
import { Marquee, MarqueeItem } from 'vux'
import searchService from '@/service/searchService'
import weChatService from '@/service/weChatService'
export default {
	data(){
		return {
			keywords:[],
      rotates: false
		}
	},
	mounted(){
		this.getHotKeywords();
	},
	methods:{
	  // 初始化渲染
	  init(){

    },
		getHotKeywords(){
			searchService.getHotKeyword(data=>{
				if (data && data.status == "success") {
					this.keywords = data.recordList;
				}
			});
		},
	}
}
</script>

<style lang="less" scoped>
  .header-wrapper{
    display: flex;
    flex: 1;
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    padding: 0 .3rem;
    background: linear-gradient(#f7ba15,#f89a1e);
    .header-find,.header-search{
      flex-basis: .8rem;
      text-align: center;
      .iconfont{
        font-size: .45rem;
        color: #fff;
      }
    }
    .header-title{
      flex-basis: calc(100% - 1.6rem);
      text-align: center;
      font-size: .36rem;
      color: #fff;
      .header-logo{
        width: 35%;
      }
      .iconfont{
        font-size: .35rem;
        vertical-align: middle;
      }
    }
  }
</style>
