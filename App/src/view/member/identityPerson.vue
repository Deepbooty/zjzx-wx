<template>
	<div class="personal-wrap">
		<div class="personal-title">
			满足以下条件才可认证：
		</div>
		<div class="personal-content">
			<div class="personal-item clearfix" v-for="(item,index) in list" @click="$Tool.goPage(item.path)">
				<div class="personal-icon fl">
					<i class="iconfont" :class="item.class"></i>
				</div>
				<div class="personal-desc fl">
					<p>{{item.title}}</p>
					<span>{{item.desc}}</span>
				</div>
				<div class="personal-btn fr" v-show="item.btnShow">去完成</div>
				<div class="personal-img fr" v-show="item.imgShow">
					<img src="@/assets/images/Completed.png">
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import articleService from "@/service/articleService"
export default{
	data(){
		return {
			list:[
				{
					title:'有清晰的头像',
					desc:'请更换头像',
					class:'icon-morentouxiang',
					path:{},
					tip:localStorage.userImg,
					btnShow:true,
					imgShow:false
				},
				{
					title:'合法的用户名',
					desc:'请修改用户名',
					class:'icon-yonghuming',
					path:{},
					tip:localStorage.userName,
					btnShow:true,
					imgShow:false
				},
				{
					title:'绑定手机',
					desc:'先绑定有效手机号',
					class:'icon-icon-copy',
					path:{},
					tip:localStorage.userMobile,
					btnShow:true,
					imgShow:false
				},
				/*{
					title:'发布过真相内容',
					desc:'最少发布1条真相内容',
					class:'icon-xinxi',
					path:{},
					tip:false,
					btnShow:true,
					imgShow:false
				}*/
			],
			achieved:{
				ifRelease:false,
				ifBind:localStorage.userMobile,
			},
			path:{
				info:{},
				release:{},
			}
		}
	},
	mounted(){
		this.init();
	},
	methods:{
		init(){
			if(this.list[0].tip == 'undefined') {
				this.list[0].path = {name:'editInfo',query:{title:'资料编辑'}};
				this.list[0].btnShow = true;
				this.list[0].imgShow = false;
			}else {
				this.list[0].path = {name:'identityPerson',query:{title:'个人认证'}};
				this.list[0].btnShow = false;
				this.list[0].imgShow = true;
			}

			if(this.list[1].tip){
				this.list[1].path = {name:'identityPerson',query:{title:'个人认证'}};
				this.list[1].btnShow = false;
				this.list[1].imgShow = true;
			}else{
				this.list[1].path = {name:'editInfo',query:{title:'资料编辑'}};
				this.list[1].btnShow = true;
				this.list[1].imgShow = false;
			}

			if(this.list[2].tip){
				this.list[2].path = {name:'identityPerson',query:{title:'个人认证'}};
				this.list[2].btnShow = false;
				this.list[2].imgShow = true;
			}else{
				this.list[2].path = {name:'editInfo',query:{title:'资料编辑'}};
				this.list[2].btnShow = true;
				this.list[2].imgShow = false;
			}

/*			articleService.getUserArticleCount(localStorage.id, (data)=>{
				if(data.result.count > 0) {
					this.list[3].btnShow = false;
					this.list[3].imgShow = true;
				}else{
					this.list[3].btnShow = true;
					this.list[3].imgShow = false;
				}
			});

			if(this.list[3].tip){
				this.list[3].path = {name:'identityPerson',query:{title:'个人认证'}};
			}else{
				this.list[3].path = {name:'release',query:{title:'发布图文',sort:1}};
			}*/
		}
	}
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
				.personal-btn{
					width: 1rem;
					height: .6rem;
					line-height: .6rem;
					margin-right: .24rem;
					margin-top: .425rem;
					font-size: .24rem;
					text-align: center;
					border-radius: .1rem;
					background-color: #f85959;
					color: #fff;
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
				.personal-img{
					width: 1rem;
					height: 100%;
					margin-right: .24rem;
					line-height: 1.37rem;
				}
			}
		}
	}
</style>
