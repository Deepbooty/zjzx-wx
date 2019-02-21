<template>
	<div class="faq-wrap">
		<ul class="faq-list">
			<li class="faq-item" v-for="(item,index) in list">
				<div class="faq-question clearfix" @click="handleShow(index)">
					<p class="question fl">{{item.question}}</p>
					<div class="faq-icon fr" ref='icon'>
						<i class="iconfont icon-down"></i>
					</div>
				</div>
				<transition  enter-active-class="animated fadeIn" leave-active-class=" animated fadeOut">
					<div class="faq-answer" v-show="item.faqShow" style="animation-duration: 300ms">
						{{item.answer}}
					</div>
				</transition>
			</li>
		</ul>
		<div class="faq-tip">
			本规范自公布之日起施行<br/>
			直击真相对本规范拥有解释权
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return {
			list:[
				{
					question:'Q1.什么是真相个人认证？',
					answer:'A1.真相个人认证是今日真相对用户个人身份的确认，认证通过后，用户将拥有更多权益。真相个人认证是免费行为，任何个人或团体从中不当获利，今日真相有权追究其法律责任。',
					faqShow:false,
				},
				{
					question:'Q2.如何申请真相个人认证？',
					answer:'A1.真相个人认证是今日真相对用户个人身份的确认，认证通过后，用户将拥有更多权益。真相个人认证是免费行为，任何个人或团体从中不当获利，今日真相有权追究其法律责任。',
					faqShow:false,
				},
				{
					question:'Q3.认证用户可获得哪些权益？',
					answer:'A1.真相个人认证是今日真相对用户个人身份的确认，认证通过后，用户将拥有更多权益。真相个人认证是免费行为，任何个人或团体从中不当获利，今日真相有权追究其法律责任。',
					faqShow:false,
				},
				{
					question:'Q4.如何更准确、更快速通过认证审核？',
					answer:'A1.真相个人认证是今日真相对用户个人身份的确认，认证通过后，用户将拥有更多权益。真相个人认证是免费行为，任何个人或团体从中不当获利，今日真相有权追究其法律责任。',
					faqShow:false,
				},
				{
					question:'Q5.哪些职业证明材料可以作为认证凭据？',
					answer:'A1.真相个人认证是今日真相对用户个人身份的确认，认证通过后，用户将拥有更多权益。真相个人认证是免费行为，任何个人或团体从中不当获利，今日真相有权追究其法律责任。',
					faqShow:false,
				},
				{
					question:'Q6.如何正确上传个人认证资料？',
					answer:'A1.真相个人认证是今日真相对用户个人身份的确认，认证通过后，用户将拥有更多权益。真相个人认证是免费行为，任何个人或团体从中不当获利，今日真相有权追究其法律责任。',
					faqShow:false,
				},
				{
					question:'Q7.真相认证分为哪些类型？',
					answer:'A1.真相个人认证是今日真相对用户个人身份的确认，认证通过后，用户将拥有更多权益。真相个人认证是免费行为，任何个人或团体从中不当获利，今日真相有权追究其法律责任。',
					faqShow:false,
				},
				{
					question:'Q8.用户如何申请普通认证？',
					answer:'A1.真相个人认证是今日真相对用户个人身份的确认，认证通过后，用户将拥有更多权益。真相个人认证是免费行为，任何个人或团体从中不当获利，今日真相有权追究其法律责任。',
					faqShow:false,
				},
				{
					question:'Q9.用户如何申请兴趣认证？',
					answer:'A1.真相个人认证是今日真相对用户个人身份的确认，认证通过后，用户将拥有更多权益。真相个人认证是免费行为，任何个人或团体从中不当获利，今日真相有权追究其法律责任。',
					faqShow:false,
				},
				{
					question:'Q10.普通认证用户如何获得黄V标识？',
					answer:'A1.真相个人认证是今日真相对用户个人身份的确认，认证通过后，用户将拥有更多权益。真相个人认证是免费行为，任何个人或团体从中不当获利，今日真相有权追究其法律责任。',
					faqShow:false,
				},
				{
					question:'Q11.认证未通过怎么办？',
					answer:'A1.真相个人认证是今日真相对用户个人身份的确认，认证通过后，用户将拥有更多权益。真相个人认证是免费行为，任何个人或团体从中不当获利，今日真相有权追究其法律责任。',
					faqShow:false,
				},
				{
					question:'Q12.个人申请认证后如何修改或取消？',
					answer:'A1.真相个人认证是今日真相对用户个人身份的确认，认证通过后，用户将拥有更多权益。真相个人认证是免费行为，任何个人或团体从中不当获利，今日真相有权追究其法律责任。',
					faqShow:false,
				},
				{
					question:'Q13.认证为什么会被撤销？',
					answer:'A1.真相个人认证是今日真相对用户个人身份的确认，认证通过后，用户将拥有更多权益。真相个人认证是免费行为，任何个人或团体从中不当获利，今日真相有权追究其法律责任。',
					faqShow:false,
				},
				{
					question:'Q14.对认证审核结果有疑问如何反馈？',
					answer:'A1.真相个人认证是今日真相对用户个人身份的确认，认证通过后，用户将拥有更多权益。真相个人认证是免费行为，任何个人或团体从中不当获利，今日真相有权追究其法律责任。',
					faqShow:false,
				},
				{
					question:'Q15.目前支持哪些行业类型进行黄V认证？',
					answer:'A1.真相个人认证是今日真相对用户个人身份的确认，认证通过后，用户将拥有更多权益。真相个人认证是免费行为，任何个人或团体从中不当获利，今日真相有权追究其法律责任。',
					faqShow:false,
				},
			]
		}
	},
	methods:{
		handleShow(index) {
			console.log(this.$refs.icon[index]);
			this.list[index].faqShow = !this.list[index].faqShow;
			this.$refs.icon[index].style.transition = 'all .5s';
			if(this.list[index].faqShow){
				this.$refs.icon[index].style.transform = 'rotate(180deg)';
			}else{
				this.$refs.icon[index].style.transform = 'rotate(0)';
			}
		},
	}
}
</script>

<style lang="less" scoped>
	.faq-wrap{
		height: calc(100vh - .87rem);
		overflow: hidden;
		overflow-y: auto;
		background-color: #f4f5f6;
		.faq-list{
			padding-left: .3rem;
			background-color: #fff;
			.faq-item{
				.faq-question{
					line-height: .9rem;
					letter-spacing: .02rem;
					border-bottom: .02rem solid @borderColor;
					.question{
						font-size: .3rem;
						color: #222;
					}
					.faq-icon{
						padding: 0 .3rem;
						.iconfont{
							transition: all 1s;
						}
					}
				}
				.faq-answer{
					padding: .3rem .3rem .3rem 0;
					line-height: .4rem;
					border-bottom: .02rem solid @borderColor;
					color:#505050;
				}
			}
		}
		.faq-tip{
			padding: .5rem 0;
			text-align: center;
			line-height: .4rem;
			color: #999;
		}
	}
</style>
