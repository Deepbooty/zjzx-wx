import 'babel-polyfill'
// import Vue from 'vue'
import App from './App'

import $ from 'jquery'
window.$ = $;

import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()

import router from './router'
import store from './store'

//css样式
import animate from 'animate.css'
import './assets/styles/reset.css'
import './assets/styles/iconfont.css'
import 'swiper/dist/css/swiper.css'
//引用功能函数
import Tool from './assets/js/methods'
Vue.use(Tool);

// 预览大图
import vuePicturePreview from 'babel-loader!vue-picture-preview'
Vue.use(vuePicturePreview)

import VuePictureSwipe from 'vue-picture-swipe';
Vue.component('vue-picture-swipe', VuePictureSwipe);
// 主屏header
import homeHeader from '@/components/headerBar'
Vue.component('home-header',homeHeader)
//分享
Vue.component('share', () => import('@/components/common/share'))
//通用top
import Top from '@/components/common/top'
Vue.component('Top',Top);
Vue.component('LoadingMain',() => import('@/components/common/loadingMain'));
//通用空白页提示
Vue.component('PromptBlank',() => import('@/components/common/promptBlank'));
// 下拉刷新组件
import downRefresh from '@/components/common/downRefresh'
Vue.component('downRefresh',downRefresh);
//单文章视图组件
import multIT from '@/components/common/multIT'
Vue.component('multIT',multIT);
//单问答视图组件
import question from '@/components/common/question'
Vue.component('question',question);
import wendaUser from '@/components/common/wendaUser'
Vue.component('wendaUser',wendaUser);

// 视频插件
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)

//vux
import{ Cell,Group,Msg,Datetime,Confirm,Alert,Radio,Tab,TabItem,LoadMore,Badge,Popup,InlineLoading,
  DatetimePlugin,AlertPlugin,ConfirmPlugin,LoadingPlugin,ToastPlugin,TransferDom,CheckIcon
} from 'vux';
Vue.component('group', Group);
Vue.component('cell', Cell);
Vue.component('msg', Msg);
Vue.component('datetime',Datetime);
Vue.component('confirm',Confirm);
Vue.component('alert',Alert);
Vue.component('radio', Radio);
Vue.component('tab', Tab);
Vue.component('tab-item', TabItem);
Vue.component('load-more', LoadMore);
Vue.component('badge', Badge);
Vue.component('popup', Popup);
Vue.component('inline-loading', InlineLoading);
Vue.component('check-icon', CheckIcon);
// import { DatetimePlugin,AlertPlugin,ConfirmPlugin,LoadingPlugin,ToastPlugin,TransferDom } from 'vux'
Vue.use(DatetimePlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.directive('transfer-dom', TransferDom)

import FastClick from 'fastclick'
FastClick.attach(document.body);

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  router,
  store,
  created() {
    window.GoTruth = this;
    window.delay = 400;// 延迟时间必须大于路由切换动画时间
    // this.initSystem();
  },
/*  methods: {
    //判断系统
    initSystem(){
        let System = {
          isWechat:navigator.userAgent.indexOf('MicroMessenger') > -1,
          isIOS:!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
          isAndroid:navigator.userAgent.indexOf('Android') > -1,
          isNative:location.protocol.toLowerCase().indexOf('file') > -1,
          isIP:!!location.href.match('192'),
          iPhoneX:/iphone/gi.test(navigator.userAgent) && (screen.height === 812 && screen.width === 375)
        };
        this.$store.commit('setStateData',{name:'System',value:System})
      },
  },*/
  render: h => h(App),
}).$mount('#app');
