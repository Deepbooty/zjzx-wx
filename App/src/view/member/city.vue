<template>
  <div class="city-wrap">
    <ul class="city-list">
      <li class="city-item" v-for="(item,index) in cityList" :key="index" @click="cityBack(item.city)">
        {{ item.city }}
      </li>
    </ul>
  </div>
</template>

<script>
import cityService from '@/service/cityService'
export default{
	data(){
		return {
			cityList:[],
			address:{},
		}
	},
	activated(){
		this.$nextTick(()=>{
			let provinceid = this.$route.query.provinceid;
			this.address.province = this.$route.query.title;
			let resMap = cityService.getCityByProvince(provinceid);
			this.cityList = resMap.result.cityList;
		})
	},
	methods:{
		cityBack(c){
			this.address.city = c;
			localStorage.choiceAddress = JSON.stringify(this.address);
			window.history.go(-2);			
		}
	}
}
</script>

<style lang="less" scoped>
  .city-wrap{
    height: calc(100vh - .87rem);
    overflow: hidden;
    overflow-y: auto;
    background-color: #fff;
    .city-list{
      padding-left: .3rem;
      .city-item{
        height: .8rem;
        line-height: .8rem;
        border-bottom: .02rem solid @borderColor;
        font-size: .28rem;
      }
    }
  }
</style>
