<template>
	<div class="shine-wrap cc">
    <div class="shine-img">
      <img src="@/assets/images/ligth-text.png">
    </div>
		<div class="move">
		</div>
	</div>
</template>

<script>
</script>

<style lang="less" scoped>
  .shine-wrap{
    width: 2.65rem;
    height: .66rem;
    margin: 0 auto;
    .move{
      position: absolute;
      top: 0;
      width: .15rem;
      height: 90%;
      animation: move 1.2s linear infinite;
      transform: skewX(-22deg);
      background-color: rgba(255,255,255,.5);
    }
  }
  @keyframes move {
    0% {left: -.2rem;}
    100% {left: 98%}
  }
</style>
