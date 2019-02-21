<!-- 首页问答页面 -->
<template>
    <div class="index">
        <home-header></home-header>
        <div class="main-wrap">
            <listQuestion></listQuestion>
        </div>
    </div>
</template>

<script>
    import listQuestion from '@/components/listQuestion'
    export default {
        components:{listQuestion}
    }
</script>
<style lang="less" scoped>
    .index{
        height: 100vh;
        width: 100%;
        overflow: hidden;
    }
    .main-wrap{
        height: 100vh;
        width: 100%;
        background: #fff;
        overflow: hidden;
        .main-box{
            border-bottom: .02rem solid @borderColor;
        }
    }
    .main-content{
        height: 100%;
        overflow-y: auto;
    }
</style>
