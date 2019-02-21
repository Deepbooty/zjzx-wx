<template>
  <div class="release">
    <!-- 选择类型 -->
    <div class="release-type clearfix" v-model="record.classify" v-show="record.type==1 || record.type == 2">
      <div class="release-select clearfix" @click="handleType">
        <span class="release-keys fl" :value="defaultVal">{{defaultType}}</span>
        <i class="iconfont icon-down fr"></i>
      </div>
      <transition  enter-active-class="animated fadeIn" leave-active-class=" animated fadeOut">
        <div class="release-mask" v-show="optionShow" @click="handleCloseMask" style="animation-duration: 300ms"></div>
      </transition>
      <transition  enter-active-class="animated fadeInLeft" leave-active-class=" animated fadeOutLeft">
        <div class="release-option" v-show="optionShow" style="animation-duration: 300ms">
          <ul class="release-list">
            <li class="release-item" :value="item.classifycode" v-for="item in classifyList" @click="handleItem(item)">
              {{ item.classifyname }}
            </li>
          </ul>
        </div>
      </transition>
    </div>
    <!-- 标题 -->
    <div class="release-title" ref="marginTit">
      <input type="text" v-model.trim="record.title" :placeholder="placeholderTit" maxlength="50">
    </div>
    <!--  -->
    <div class="release-content" v-if="record.type==1 || record.type == 3">
      <div class="content">
        <textarea :placeholder="placeholderDesc" v-model.trim="record.content"></textarea>
      </div>
      <!-- 上传图片 -->
      <div class="release-upload-img clearfix">
        <div class="release-img fl" v-for="(item,index) in record_file" @click="handlePreview">
          <i class="iconfont icon-remove" @click.stop="handleRemoveImg(index)"></i>
          <img :src="fileRoot + item.url">
        </div>
        <div class="release-upload fl" v-show="imgShow">
          <label for="upImg"></label>
          <i class="iconfont icon-add"></i>
          <input type="file" id="upImg" accept="image/*" multiple @change="uploadFile" style="display: none;">
        </div>
      </div>
    </div>
    <!-- 上传视频 -->
    <div class="release-upload-video clearfix" v-if="record.type == 2">
      <div class="release-video fl" v-for="(item,index) in record_file">
        <i class="iconfont icon-remove" @click.stop="handleRemoveVideo(item)"></i>
        <img :src="fileRoot + item.thumbnail" >
      </div>
      <div class="release-upload fl" v-show="addShow">
        <label for="upvideo"></label>
        <i class="iconfont icon-add"></i>
        <input type="file"  id="upvideo" accept="video/*" @change="uploadFile" style="display: none;">
      </div>
    </div>

    <!-- 选择位置 -->
    <div class="release-seat">
      <i class="iconfont icon-weizhi"></i>
      <router-link :to="{ name:'position',query:{title:'选择位置'} }" class="tag">{{ record.selectedpublishname }}</router-link>
    </div>

    <!-- 发布按钮 -->
    <div class="release-btn clearfix">
      <button type="button" class="btn fr" @click="publish">发布</button>
    </div>
    <transition enter-active-class="animated fadeIn" leave-active-class=" animated fadeOut">
      <gallary :obj="record_file" v-show="showGallary" @close="handleGallaryClose"></gallary>
    </transition>
  </div>
</template>

<script>
  import config from '@/lib/config/config'
  import mapUtil from '@/service/util/mapUtil'
  import mapService from '@/service/mapService'
  import fileService from '@/service/fileService'
  import articleService from '@/service/articleService'
  import articleClassifyService from '@/service/article_classifyService'
  import interlocutionService from '@/service/interlocutionService'
  import gallary from "@/components/Gallary"
  export default{
    components:{
      gallary
    },
    data(){
      return {
        showGallary:false,
        placeholderTit:"",
        placeholderDesc:"",
        addShow:true,
        optionShow:false,
        defaultVal:null,
        defaultType:'请选择分类',
        fileRoot:config.fileRoot +'/',
        classifyList:[],
        push:[],
        imgShow:true,
        //实际发布位置
        position:{},
        record:{
          title:'',
          content:'',
          author:0,
          type:0,   //1：图文，2:视频
          publishtime:'',  // 后台设置
          classify:0,
          selectedpublishname:'',
          selectedpublishaddress:'',
        },
        record_file:[],
      }
    },
    activated(){
      this.record_file = [];
      this.record.type = this.$route.query.sort;
      this.record.selectedpublishname = this.selectedPublishName || "选择位置";
      this.record.selectedpublishaddress = this.selectedPublishAddress || "选择位置";
      if(this.selectedPublishName === '我的位置'){
        this.record.selectedpublishname = this.selectedPublishAddress;
      }

      if(!localStorage.classify){
        articleClassifyService.getArticleClassifyList((data)=>{
          if(data && data.status == "success"){
            this.classifyList = data.result.classfyList;
            localStorage.classify = JSON.stringify(this.classifyList);
          }
        });
      }else{
        this.classifyList = JSON.parse(localStorage.classify);
      }

      mapUtil.getPosition((data)=>{
        this.position = data;
      });
      if(this.record.type == 1){
        this.placeholderTit = "请输入文章标题";
        this.placeholderDesc = "请输入文章内容"
        this.$refs.marginTit.style.marginTop = "1.2rem";

      }else if(this.record.type == 2){
        this.placeholderTit = "请输入视频标题";
        this.$refs.marginTit.style.marginTop = "1.2rem";
      }else{
        this.placeholderTit = "请输入问题标题?";
        this.placeholderDesc = "问题描述(可选填)";
        this.$refs.marginTit.style.marginTop = "0";
      }

    },
    mounted(){
      window.history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.onBrowserBack, false);
    },
    destroyed(){
      window.removeEventListener("popstate", this.onBrowserBack, false);
    },
    watch:{
      showGallary:{
        handler(newVal, oldVal) {
          if(newVal.Terms == true) {
            window.history.pushState(null, null, document.URL);
          }
        },
        deep: true
      },
    },
    methods:{
      handlePreview(){
        this.showGallary = true;
      },
      handleGallaryClose(){
        this.showGallary = false;
      },
      onBrowserBack(){
        if(this.record.title || this.record.content || this.record_file || this.defaultType || this.showGallary){
          this.record.title = "";
          this.record.content = "";
          this.record_file = [];
          this.defaultType = '请选择分类';
          this.record.classify = 0;
          this.showGallary = false;
        }
      },
      handleType(){
        this.optionShow = !this.optionShow;
      },
      handleCloseMask(){
        this.optionShow = false;
      },
      handleItem(item){
        this.defaultType = item.classifyname;
        this.record.classify = item.classifycode;
        this.optionShow = false;
      },
      handleRemoveImg(item){
        const thiz = this;
        this.$vux.confirm.show({
          content:'确认删除图片?',
          onConfirm () {
            thiz.$vux.loading.show();
            setTimeout(()=>{
              thiz.record_file.splice(item,1);
              if(thiz.record_file.length <= 6){
                thiz.imgShow = true;
              }
              thiz.$vux.loading.hide();
              thiz.$vux.toast.show({
                text:'删除成功'
              });
            },1000);
          }
        })
      },
      handleRemoveVideo(item){
        const thiz = this;
        this.$vux.confirm.show({
          content:'确认删除视频?',
          onConfirm () {
            thiz.$vux.loading.show();
            setTimeout(()=>{
              thiz.record_file.splice(item,1);
              thiz.$vux.loading.hide();
              thiz.$vux.toast.show({
                text:'删除成功'
              });
              thiz.addShow = true;
            },1000);
          }
        })
      },
      uploadFile(e){
        let file = e.target.files[0];
        if (!file) { return; }
        if (this.record.type == 1 && !this.$Tool.checkPic(file.name)) {
          this.$vux.alert.show({
            content:'格式错误',
          });
          return;
        }
        if(this.record.type == 2 && !this.$Tool.checkVideo(file.name)) {
          this.$vux.alert.show({
            content:'格式错误',
          });
          return;
        }
        this.$vux.loading.show({text: ''});
        let param = new FormData(); //创建form对象
        param.append('file',file,file.name);//通过append向form对象添加数据
        if(this.record.type != 2){
          fileService.uploadPic(param,(data)=>{
            let obj = {};
            obj.url = data.result.url;
            obj.filename = data.result.filename;
            obj.type =1;
            this.record_file.push(obj);
            if(this.record_file.length >=6){
              this.imgShow = false;
            }
            this.$vux.loading.hide();
          })
        }else if(this.record.type == 2){
          fileService.uploadVideo(param,(data)=>{
            let obj = {};
            obj.url = data.result.url;
            obj.filename = data.result.filename;
            obj.type = 2;
            obj.thumbnail = data.thumbnail;
            this.addShow = false;
            this.record_file.push(obj);
            this.$vux.loading.hide();
          })
        }else{
          this.$vux.loading.hide();
          this.$vux.alert.show({
            content:'出现意外错误',
          })
        }
      },
      publish(){
        if(!localStorage.id){
          this.$vux.alert.show({
            content:"您还未登录，请先登录再发布文章"
          });
          return;
        }
        if(this.record.type == 1){
          if(this.record.classify ==0){
            this.$vux.alert.show({
              content:"请选择文章类型"
            })
            return;
          }
          if(!this.record.title){
            this.$vux.alert.show({
              content:"请输入文章标题"
            });
            return;
          }
          if(!this.record.content){
            this.$vux.alert.show({
              content:"请输入文章内容"
            });
            return;
          }
        }else if(this.record.type == 2){
          if(this.record.classify ==0){
            this.$vux.alert.show({
              content:"请选择视频类型"
            })
            return;
          }
          if(!this.record.title){
            this.$vux.alert.show({
              content:"请输入视频标题"
            })
            return;
          }
          if(this.record_file.length == 0){
            this.$vux.alert.show({
              content:"请上传视频"
            })
            return;
          }
        }else if(this.record.type == 3){
          if(!this.record.title){
            this.$vux.alert.show({
              content:"请输入问题标题"
            });
            return;
          }
        }
        if(!this.$Tool.checkInput(this.record.title)){
          this.record.title = this.$Tool.replaceNo(this.record.title);
          this.$vux.alert.show({
            content:'内容含有非法字符，已为您删除，请确认',
          });
          return;
        }
        this.$vux.loading.show({ text: '' })
        this.record.author = Number(localStorage.id || 0);
        Object.assign(this.record,this.position);

        let data;
        if(this.record.type == 1 || this.record.type == 2){
          data = articleService.publishArticle(this.record,this.record_file);
          if(data && data.status == "success"){
            setTimeout(()=>{
              this.$Tool.goPage({name:"home"});
            },1200);
          }
        }else{
          this.record.title = this.$Tool.doTitle(this.record.title);
          let images = [];
          for(let i = this.record_file.length - 1 ; i >= 0; i--){
            images.push(this.record_file[i].url);
          }
          data = interlocutionService.publishQuestion(this.record,images+"");
          if(data && data.status == "success"){
            setTimeout(()=>{
              this.$Tool.goPage({name:"questionAnswer"});
            },1200);
          }
        }
        if(data && data.status == "success"){
          this.$vux.loading.hide()
          this.$vux.alert.show({
            content:'发布成功',
          });
          this.record_file=[];
          this.record.title = "";
          this.record.content = "";
          this.defaultVal = null;
          this.defaultType = '请选择分类';
          setTimeout(()=>{
            this.$vux.alert.hide();
          },1000)
        } else {
             this.$vux.loading.hide()
             this.$vux.alert.show({
                 content:'发布失败,请重新发布',
             })
         }
      },

    },
    computed:{
      selectedPublishName(){
        return this.$store.state.selectedPublishName;
      },
      selectedPublishAddress(){
        return this.$store.state.selectedPublishAddress;
      }
    },
    beforeRouteEnter (to, from, next) {
      if (!localStorage.id) {
        GoTruth.$Tool.loginGoBack({
          returnpage:"/topBase/release",
          query:{title:to.query.title,sort:to.query.sort},
          name:"release",
          call:()=>{
          }
        });
      }else{
        next();

      }
    }
  }
</script>

<style lang="less" scoped>
  .release{
    width: 100%;
    height: calc(100vh - .87rem);
    overflow: hidden;
    overflow-y: auto;
    padding: .3rem;
    background-color: #fff;
    .release-type{
      position: relative;
      margin-bottom: .4rem;
      .release-select{
        position: absolute;
        // z-index: 10;
        width: 55%;
        height: .8rem;
        line-height: .8rem;
        padding: 0 .3rem;
        border-radius: .2rem;
        color: #666;
        background-color: #fff;
        border: .03rem solid @borderColor;
        .release-keys{
          margin-right: .2rem;
        }
      }
      .release-mask{
        width: 100vh;
        height: 100vh;
        position: absolute;
        top: -.3rem;
        left: -.3rem;
        z-index: 9;
        background-color: rgba(0,0,0,0.5);

      }
      .release-option{
        position: absolute;
        top: .88rem;
        left: 0;
        z-index: 10;
        background-color: #fff;
        border: 0 solid rgba(0, 0, 0, 0.3);
        border-radius: .2rem;
        box-shadow: 0 .02rem .06rem 0 rgba(0, 0, 0, 0.2);
        width: 60%;
        padding:  0 .3rem;
        .release-item{
          height: .65rem;
          line-height: .65rem;
          border-bottom: .02rem solid @borderColor;
          &:last-child{
            border-bottom: none;
          }
        }
      }
    }
    .release-title{
      width: 100%;
      height: .8rem;
      margin-top: 1.2rem;
      margin-bottom: .4rem;
      input{
        width: 100%;
        height: .8rem;
        line-height: .8rem\9;
        padding: 0 .3rem;
        border-radius: .2rem;
        border: .03rem solid @borderColor;
      }
    }
    .release-content{
      .content{
        width: 100%;
        height: 3rem;
        border-radius: .2rem;
        border: .03rem solid @borderColor;
        textarea{
          display: block;
          width: 100%;
          height: 100%;
          padding: .2rem;
          resize: none;
        }
      }
      .release-upload-img{
        padding: .2rem 0;
        display: flex;
        flex-wrap: wrap;

        .release-img{
          width: 32.5%;
          height: 1.86rem;
          margin-right: 1.2%;
          margin-bottom: 1.2%;
          &:last-child{
            margin-right: 0;
          }
          &:nth-child(3n){
            margin-right: 0;
          }
          img{
            display: block;
            width: 100%;
            height: 100%;
            filter: brightness(0.7);
            object-fit: cover;
          }
          .iconfont{
            position: absolute;
            z-index: 6;
            right: .06rem;
            top: .06rem;
            color: #fff;
          }
        }
        .release-upload{
          position: relative;
          width: 32.5%;
          height: 1.86rem;
          text-align: center;
          float: left;
          background-color: #f4f5f6;
          /* label{
              position:absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              line-height: 1.86rem;
          }
          .iconfont{
              display: inline-block;
              width: 1.04rem;
              height: 1.04rem;
              font-size: 1rem;
              margin-top: .41rem;
              // font-weight: 700;
              color: #dcdcdc;
          } */
        }
      }
    }
    .release-upload-video{
      padding: .2rem 0;
      .release-video{
        position: relative;
        width: 3.5rem;
        height: 1.86rem;
        margin-right: .1rem;
        img{
          display: block;
          width: 100%;
          height: 100%;
          border-radius: .05rem;
          border: .02rem solid #ccc;
          object-fit: cover;
          filter: brightness(0.50);
          box-sizing: border-box;
        }
        .iconfont{
          position: absolute;
          z-index: 6;
          right: .09rem;
          top: .09rem;
          color: #fff;
        }
      }
    }
    .release-upload{
      position: relative;
      width: 1.86rem;
      height: 1.86rem;
      text-align: center;
      float: left;
      background-color: #f4f5f6;
      label{
        position:absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        line-height: 1.86rem;
      }
      .iconfont{
        display: inline-block;
        width: 1.04rem;
        height: 1.04rem;
        font-size: 1rem;
        margin-top: .41rem;
        // font-weight: 700;
        color: #dcdcdc;
      }
    }
    .release-seat{
      display: inline-block;
      padding: .13rem .15rem;
      border-radius: .26rem;
      border: .02rem solid @borderColor;
      font-size: .24rem;
      color: #979797;
      .iconfont{
        vertical-align: middle;
      }
    }
    .release-btn{
      margin-top: .2rem;
      .btn{
        margin-right: 1rem;
        width: 1.4rem;
        height: .7rem;
        line-height: .75rem;
        letter-spacing: .02rem;
        border-radius: .08rem;
        text-align: center;
        background-color: @mainColor;
        color: #fff;

      }
    }
  }
</style>
