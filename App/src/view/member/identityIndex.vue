<template>
	<div class="authentication-wrap">
		<div class="authentication-first">
			<div class="authentication-item" @click="$Tool.goPage({name:'identityPerson',query:{title:'个人认证'}})">
				<p class="title">身份认证</p>
				<span class="desc">适用于个人用户真实身份的认证</span>
				<i class="iconfont icon-arrow-right"></i>
			</div>
			<div class="authentication-item" @click="$Tool.goPage({name:'identityEenterprise',query:{title:'企业认证'}})">
				<p class="title">企业认证</p>
				<span class="desc">为企业品牌诚信加冕</span>
				<i class="iconfont icon-arrow-right"></i>
			</div>
		</div>
		<div class="authentication-second">
			<div class="authentication-title">认证特权</div>
			<div class="authentication-content">
				<div class="item" v-for="item in list">
					<div class="item-icon">
						<i class="iconfont" :class="item.class"></i>
					</div>
					<div class="item-desc">
						<p class="title">{{item.title}}</p>
						<span class="desc">{{item.desc}}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				list:[
					{
						title:'独家标识',
						desc:'享有专属标识，彰显独特身份',
						class:'icon-youxianji'
					},
					{
						title:'优先推荐',
						desc:'内容优先推荐，增加曝光度快速涨粉',
						class:'icon-tequan'
					},
					{
						title:'更多特权',
						desc:'更多认证用户专享功能',
						class:'icon-dujia'
					},
				]
			}
		}
	}
</script>

<style lang="less" scoped>
	.authentication-wrap{
		width: 100%;
		height: calc(100vh - .87rem);
		overflow: hidden;
		overflow-y: auto;
		background-color: #f4f5f6;
		.authentication-first{
			padding-left: .4rem;
			background-color: #fff;
			.authentication-item{
				position: relative;
				padding: .2rem 0;
				border-bottom: .02rem solid @borderColor;
				&:last-child{
					border-bottom: none;
				}
				.title{
					font-size: .32rem;
				}
				.desc{
					font-size: .24rem;
					color: #999;
				}
				.iconfont{
					position: absolute;
					top: .35rem;
					right: .4rem;
					color: #999;
				}
			}
		}
		.authentication-second{
			margin-top: .3rem;
			background-color: #fff;
			.authentication-title{
				line-height: .8rem;
				font-weight: 700;
				font-size: .36rem;
				text-align: center;
				color: #222;
			}
			.authentication-content{
				padding: 0 .4rem;
				.item{
					display: flex;
					height: 1rem;
					margin-bottom: .2rem;
					.item-icon{
						height: 100%;
						line-height: 1rem;
						margin-right: .4rem;
						.iconfont{
							font-size: .6rem;
						}
					}
					.title{
						font-size: .32rem;
						padding-top: .14rem;
					}
					.desc{
						font-size: .24rem;
						color: #999;
					}
					&:first-child .item-icon i{
						color: #f6ba4b;
					}
					&:nth-child(2) .item-icon i{
						color: #ff7c56;
					}
					&:last-child .item-icon i{
						color: #89a2ff;
					}
				}
			}
		}
	}
</style>