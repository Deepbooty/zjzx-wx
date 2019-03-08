<template>
	<div class="about-wrap">
		<div class="about-header">
			<div class="about-logo">
				<img src="@/assets/images/logo-icon.png" alt="">
			</div>
			<div class="about-img">
				<img src="@/assets/images/aboutDesc.png" alt="">
			</div>
		</div>
		<div class="about-body">
			<div class="about-desc">
				直击真相是一款高品质的思想教育类共享平台，主要设有揭秘、防骗、打假、寻亲等栏目，打造一支专业媒体团队，用事实说话，关注社会民生，揭秘诈骗套路、假冒伪劣商品等不法信息，并义务帮助那些被拐卖的妇女儿童，希望他们能早日回家团圆！
			</div>
			<dl class="about-list">
				<dt>关注我们</dt>
				<dl>新浪微博： @池州康有保网络科技有限公司</dl>
				<dl>官方网站： www.zjzx.xyz</dl>
				<dl>媒体平台： www.zjzx.xyz</dl>
				<dl>广告合作： www.kangyoubao.net</dl>
				<dl>微信公众号：康有保</dl>
			</dl>
			<dl class="about-list">
				<dt>联系我们</dt>
				<dl>商务合作： www.kangyoubao.net</dl>
				<dl>使用反馈： www.zjzx.xyz</dl>
				<dl>举报投诉： www.kangyoubao.net</dl>
				<dl>举报电话： 400-110-6768</dl>
			</dl>
		</div>
		<div class="about-footer">
			<div class="about-btn">
				<router-link :to="{path:'agreement',query:{title:'直击真相用户协议'}}" tag="button">
					用户协议
				</router-link>
				<router-link :to="{path:'privacy',query:{title:'直击真相隐私条款'}}" tag="button">
					隐私条款
				</router-link>
			</div>
			<p class="about-copyright">Copyright @2019 zjzx.xyz All Rights Reserved</p>
		</div>
	</div>
</template>

<script>

</script>

<style lang="less" scoped>
	.about-wrap{
		height: calc( 100% - .87rem );
		overflow: hidden;
		overflow-y: auto;
		padding: .2rem .2rem;
		background-color: #fff;
		.about-header {
			text-align: center;
			margin-top: .5rem;
			.about-logo {
				width: 1.3rem;
				height: 1.3rem;
				margin: 0 auto .3rem auto;
			}
			.about-img{
				width: 60%;
				height: .6rem;
				margin: 0 auto;
				img{
					display: block;
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
		}
		.about-body {
			margin-top: .2rem;
			.about-desc{
				margin-bottom: .2rem;
				padding-bottom: .1rem;
				text-indent: 2em;
				border-bottom: .02rem solid @borderColor;
				font-size: .3rem;
				line-height: .5rem;
				color: #4a4a4a;
			}
			.about-list{
				margin-bottom: .3rem;
				dt{
					font-size: .28rem;
					color: #222;
					padding-bottom: .24rem;
				}
				dl{
					font-size: .24rem;
					line-height: .4rem;
					color: #999;
				}
			}
		}
		.about-footer{
			margin-top: .2rem;
			.about-btn{
				text-align: center;
				button{
					display: inline-block;
					padding: .15rem .38rem;
					margin-right: .4rem;
					border-radius: .2rem;
					color: #1674e9;
					border: .02rem solid #1674e9;
					&:last-child{
						margin-right: 0;
					}
				}
			}
			.about-copyright{
				position: relative;
				text-align: center;
				color: #999;
				font-size: .24rem;
				left: 0;
				bottom: 0;
				padding-top: .4rem;
			}
		}
	}
</style>
