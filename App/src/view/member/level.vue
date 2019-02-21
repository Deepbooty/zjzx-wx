<template>
    <div class="level">
        <div class="level-header">
            <div class="level-top">
                <div class="level-bg" v-for="(item, index) in record" v-if="index===0">
                    <div class="level-king">
                        <img :src="$Tool.headerImgFilter(item.imageurl)">
                    </div>

                    <h4 class="level-name">{{item.username}}</h4>
                </div>
            </div>
        </div>
        <div class="level-mine level-list" style="margin-top: 0; padding-bottom: 0;">
            <table class="level-tab">
                <tbody>
                <tr>
                    <td>
                        <div class="level-num-img">
                            <span class="level-num" v-if="mySelf.userPh > 3">{{mySelf.userPh}}</span>
                            <img :src="mySelf.userTp" v-else>
                        </div>
                    </td>
                    <td>
                        <div class="level-user">
                            <div class="level-img" :class="{'level-img1':mySelf.userPh == 1,'level-img2':mySelf.userPh == 2,'level-img3':mySelf.userPh == 3}">
                                <img :src="$Tool.headerImgFilter(userList.imageurl)" class="level-userPhoto level-user-item">
                            </div>
                            <div class="level-desc">
                                <h5>{{userList.username}}</h5>
                                <span>爱心值：{{userList.integration}}</span>
                            </div>
                        </div>
                    </td>
                    <td>{{mySelf.userCh}}</td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="level-list">
            <table class="level-tab">
                <thead>
                <tr>
                    <th>排名</th>
                    <th>用户</th>
                    <th>称号</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in record" :key="item.id">
                    <td>
                        <div class="level-num-img">
                            <span class="level-num" v-if="index > 2">{{index + 1}}</span>
                            <img :src="item.levelImg" v-else>
                        </div>
                    </td>
                    <td>
                        <div class="level-user">
                            <div class="level-img" :class="{'level-img1':index == 0,'level-img2':index == 1,'level-img3':index == 2}">
                                <img :src="$Tool.headerImgFilter(item.imageurl)" class="level-userPhoto level-user-item">
                            </div>
                            <div class="level-desc">
                                <h5>{{item.username}}</h5>
                                <span>爱心值：{{item.integration}}</span>
                            </div>
                        </div>
                    </td>
                    <td>{{item.levelDesc}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
    import config from '@/lib/config/config'
    import userService from '@/service/userService'
    export default{
        data(){
            return {
                record:[],
                mySelf:{
                    userPh:0,
                    userCh:'',
                    userTp:''
                },
                userPh:0,
                userCh:'',
                levelDesc:'',
                userList:{},
                userId:localStorage.id,
                // fileRoot:config.fileRoot+'/',     //可删除
            }
        },
        activated(){
            setTimeout(()=>{
                this.init();
            },delay)
        },
        watch:{
        },
        methods:{
            init(){
                //获取排行信息
                userService.getUserPh((data)=>{
                    if(data && data.status == "success") {
                        this.record = data.recordList;
                        this.$set(this.record[0],'levelImg',require('@/assets/images/no-1.png'));
                        this.$set(this.record[1],'levelImg',require('@/assets/images/no-2.png'));
                        this.$set(this.record[2],'levelImg',require('@/assets/images/no-3.png'));
                        this.$set(this.record[0],'levelDesc','爱心天使');
                        this.$set(this.record[1],'levelDesc','爱心楷模');
                        this.$set(this.record[2],'levelDesc','爱心达人');
                        for(let i = 3,len = this.record.length; i < len; i++){
                            this.$set(this.record[i],'levelDesc','爱心人士');
                        }
                    }
                });
                //获取当前用户信息
                let userData = userService.getUserById(this.userId);
                let record = userData.result.user;
                this.userList = record;
                userService.getUserPhByUserid(this.userId,(data)=>{
                    if(data && data.status == 'success'){
                        this.mySelf.userPh = data.ph;
                        if(this.mySelf.userPh == 1){
                            this.mySelf.userCh = '爱心天使';
                            this.mySelf.userTp = require('@/assets/images/no-1.png');
                        }else if(this.mySelf.userPh == 2){
                            this.mySelf.userCh = '爱心楷模';
                            this.mySelf.userTp = require('@/assets/images/no-2.png');
                        }else if(this.mySelf.userPh == 3) {
                            this.mySelf.userCh = '爱心达人';
                            this.mySelf.userTp = require('@/assets/images/no-3.png');
                        }else{
                            this.mySelf.userCh = '爱心人士';
                        }
                    }
                })
            },
        },
        beforeRouteEnter (to, from, next) {
            if (!localStorage.id ) {
                GoTruth.$Tool.loginGoBack({
                    returnpage:"/topBase/level",
                    query:{title:to.query.title},
                    name:"level"
                });
            }else{
                next();
            }
        }
    }
</script>

<style lang="less" scoped>
    .level{
        height: calc(100vh - .87rem);
        overflow: hidden;
        overflow-y: auto;
        // background-color: #fff;
        .level-header{
            width: 100%;
            height: 3.2126rem;
            background-image: url('../../assets/images/level-bg.png');
            background-position: 0 0;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            .level-top{
                display: flex;
                justify-content: center;
                padding-top: 5%;
                .level-bg{
                    position: relative;
                    width: 100%;
                    .level-king{
                        width: 2.175rem;
                        height: 1.9rem;
                        margin: 0 auto;
                        background-image: url('../../assets/images/topBg.png');
                        background-position: 0 0;
                        background-size: 100% 100%;
                        img{
                            display: block;
                            width: 1.305rem;
                            height: 1.305rem;
                            position: relative;
                            left: .43rem;
                            top: .35rem;
                            border-radius: 50%;
                            object-fit: cover;
                            border: .04rem solid #ffcb42;
                        }
                    }
                    .level-name{
                        width: 100%;
                        margin-top: .2rem;
                        text-align: center;
                        font-size: .3rem;
                        letter-spacing: .02rem;
                        color: #fff;
                    }
                }
            }
        }
        .level-list{
            background: #fff;
            margin-top: .5rem;
            padding-bottom: .3rem;
            .level-tab{
                width: 100%;
                padding: 0 .2rem;
                border-top: .02rem solid @borderColor;
                border-bottom: .02rem solid @borderColor;
                font-size: .24rem;
                thead{
                    tr{
                        height: 1rem;
                        background-color: #fff;
                        th{
                            font-weight: 700;
                            letter-spacing: .02rem;
                            text-align: center;
                            color: #10aeff;
                        }
                    }
                }
                tbody{
                    tr{
                        border-bottom: .02rem solid @borderColor;
                        text-align: center;
                        td{
                            padding: .2rem 0;
                            text-align: center;
                            .level-num-img{
                                display: inline-block;
                                width: .56rem;
                                height: .79rem;
                                img{
                                    display: inline-block;
                                    width: 80%;
                                    text-align: center;
                                }
                                span{
                                    line-height: .79rem;
                                    font-size: .28rem;
                                    color: #777;
                                }
                            }
                            .level-user{
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                .level-img{
                                    position: relative;
                                    width: 1.22rem;
                                    height: .97rem;
                                    margin-right: .2rem;
                                    border-radius: 50%;
                                    background-position: 0 0;
                                    background-size: 100% 100%;
                                    .level-userPhoto{
                                        position: absolute;
                                        display: block;
                                        top: -.05rem;
                                        left: .19rem;
                                        width: .85rem;
                                        height: .85rem;
                                        border-radius: 50%;
                                        border: .02rem solid #ccc;
                                    }
                                    .level-user-item{
                                        top: 0;
                                        left: .06rem;
                                        width: 1rem;
                                        height: 1rem;
                                    }
                                }
                                .level-img1{
                                    background-image: url('../../assets/images/1.png');
                                    .level-user-item{
                                        left: .12rem;
                                        top: -.12rem;
                                    }
                                }
                                .level-img2{
                                    background-image: url('../../assets/images/2.png');
                                    .level-user-item{
                                        left: .12rem;
                                        top: -.12rem;
                                    }
                                }
                                .level-img3{
                                    background-image: url('../../assets/images/3.png');
                                    .level-user-item{
                                        left: .12rem;
                                        top: -.12rem;
                                    }
                                }
                                .level-desc{
                                    h5{
                                        width:2rem;
                                        max-width: 2rem;
                                        font-size: .3rem;
                                        overflow:hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        text-align: left;
                                        padding-bottom: .2rem;
                                    }
                                    span{
                                        display: block;
                                        text-align: left;
                                        color: #999;
                                    }
                                }
                            }
                            .icon-shangsheng{
                                color:#12bd12;
                            }
                            .icon-xiajiang{
                                color: #f23f40;
                            }
                            .icon-icon--{
                                color: #999;
                            }
                        }
                    }
                }
            }
        }
    }

</style>
