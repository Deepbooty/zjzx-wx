<template>
    <div>

      <!--
      <div class="download-wrap">
        <div class="logo">
          <img src="@/assets/images/down-logo.png" alt="">
        </div>
        <div class="download-button">
          立即下载
        </div>
      </div>-->
    </div>
</template>
<script>
    export default {
        name: "download",
       /* activated(){
          this.$nextTick(()=>{
            let ua = navigator.userAgent.toLowerCase();
            let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
            let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if(isWeixinBrowser){
              if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                window.location.href = "https://itunes.apple.com/cn/app/%E7%9B%B4%E5%87%BB%E7%9C%9F%E7%9B%B8/id1450056517?mt=8";
              }else if (/(Android)/i.test(navigator.userAgent)){
                window.location.href = "https://wap.pp.cn/app_z5q5zyZIcxe/";
              }
            }
            function isWeixinBrowser() {
              return (/micromessenger/.test(ua)) ? true : false;
            }
          });
        }*/
    }
</script>

<!--
<style lang="less" scoped>
  .download-wrap{
    position: relative;
    width: 100%;
    padding: 0 .35rem;
    height: calc(100vh - .87rem);
    background: url("../assets/images/download-bg.png") no-repeat,linear-gradient(#fce95c, #feae65);
    background-size: contain;
    background-position: center center;

    .logo{
      position: absolute;
      left: 0;
      top: .5rem;
      width: 100%;
      text-align: center;

      img{
        display: block;
        width: 100%;
        height: 100%;
        transform: scale(.6);
      }
    }
    .download-button{
      position: absolute;
      left: 15%;
      bottom: .5rem;
      width: 70%;
      height: .8rem;
      line-height: .8rem;
      border-radius: .6rem;
      text-align: center;
      font-size: .3rem;
      letter-spacing: .02rem;
      background: linear-gradient(to bottom right,#ffcf7b, #ffb037,#ff9237,#ff6c37);
      color: #fff;
    }
  }
</style>
-->
