<template>
	<div class="personal-wrap">
		<div class="personal-title">
			企业认证流程：
		</div>
		<div class="personal-content">
			<div class="personal-item clearfix" v-for="(item,index) in list">
				<div class="personal-icon fl">
					<i class="iconfont" :class="item.class"></i>
				</div>
				<div class="personal-desc fl">
					<p>{{item.title}}</p>
					<span>{{item.desc}}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	data(){
		return {
			list:[
				{
					title:'1.电访问www.zjzx.xyz/renzheng',
					desc:'用电脑浏览器打开网址',
					class:'icon-diannao',
				},
				{
					title:'2.登录真相账户',
					desc:'登录直击真相账号',
					class:'icon-morentouxiang',
				},
				{
					title:'根据提示提交企业相关资料',
					desc:'认证审核，提交认证所需材料',
					class:'icon-yonghuming',
				},
				{
					title:'审核成功',
					desc:'预计2个工作日内完成审核',
					class:'icon-yanzhengmatianchong',
				}
			],
		}
	},
}
</script>

<style lang="less" scoped>
	.personal-wrap{
		height: calc(100vh - .87rem);
		overflow: hidden;
		overflow-y: auto;
		.personal-title{
			padding: .34rem;
			font-size: .36rem;
		}
		.personal-content{
			padding-left: .34rem;
			background-color: #fff;
			.personal-item{
				height: 1.37rem;
				border-bottom: .02rem solid @borderColor;
				.personal-icon{
					width: .85rem;
					height: 100%;
					line-height: 1.37rem;
					.iconfont{
						font-size: .5rem;
						color: @mainColor;
					}
				}
				.personal-desc{
					height: 100%;
					p{
						font-size: .34rem;
						padding-top: .18rem;
					}
					span{
						display: block;
						padding-top: .1rem;
						color: #999;
					}
				}
			}
		}
	}
</style>