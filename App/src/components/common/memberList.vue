<template>
  <div class="member-wrap">
      <ul class="member-list">
        <li class="member-item clearfix" v-for="(item,index) in userList" @click="goPerson(item.id)">
          <div class="left fl">
            <img class="member-img" :src="$Tool.headerImgFilter(item.imageurl)">
            <span class="member-name">{{item.username}}</span>
          </div>
          <div class="right fr"  v-if="ifFocus" @click.stop="doFocus(item.id,index)">
            <span v-if="index == currentFocus?focus:1" class="focused">已关注</span>
            <span v-else class="focus">关注</span>
          </div>
        </li>
      </ul>
    <prompt-blank v-if="!list.length" :mes="mes"></prompt-blank>
  </div>
</template>

<script>
  import userService from '@/service/userService'
  import followService from '@/service/followService'
  export default{
    data(){
      return{
        userList:[],
        focus:1,
        currentFocus:-1,
      }
    },
    props:{
      list:{
        type:Array,
        default:[],
      },
      mes:{
        type:String,
        default:"",
      },
      ifFocus:{
        type:Boolean,
        default:false,
      },
    },
    methods:{
      init(){
        //获取列表人信息
        let temp = [];
        this.userList = [];
        for (var i = 0,len = this.list.length; i < len; i++) {
          let data = userService.getUserById(this.list[i].userid);
          if (data && data.status == "success") {
            temp.push(data.result.user);
          }
        }
        this.userList = temp;
      },
      doFocus(targetid,index){
        if (!targetid) {return false;}
        this.currentFocus = index;
        followService.doFollow(targetid,data=>{
          if (data && data.status == "success") {
            this.focus = Number(data.result);
            // console(this.focus)
            return;
          }
          if (data && data.status == "error") {
            if (data.result == 1) {
              this.$vux.alert.show({
                content:'登录失效,请重新登录！',
              })
            }else{
              this.$vux.alert.show({
                content:'非法访问！',
              })
            }
          }
        })
      },
      goPerson(userId){
        this.$Tool.goPage({name:'publishedArticle',query:{userId,}})
        // location.reload();
      }
    },
    watch:{
      list(){
        this.currentFocus = -1;
        this.init();
      }
    },

  }
</script>

<style lang="less" scoped>
  .member-wrap{
    .member-list{
      padding: .3rem;
      background-color: #fff;
      .member-item{
        padding: .1rem 0;
        line-height: .85rem;
        border-bottom: .02rem solid @borderColor;
        &:last-child{
          border-bottom: none;
        }
        .left{
          .member-img{
            width: .75rem;
            height: .75rem;
            border-radius: 50%;
            margin-right: .1rem;
            object-fit: cover;
          }
        }
        .right{
          span{
            display: inline-block;
            width: 1.2rem;
            height: .6rem;
            line-height: .6rem;
            border-radius: .16rem;
            text-align: center;
            font-size: .3rem;
          }
          .focused{
            color: #959595;
            border: .02rem solid #e6e6e6;
            background-color: #fff;
          }
          .focus{
            color: #fff;
            background-color: #faaf0c;
          }
        }
      }
    }
  }
</style>
