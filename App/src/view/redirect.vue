<template>
    <div>我是链接</div>
</template>

<script>
    export default {
        name: "redirect",
      mounted(){
          this.$nextTick(()=>{
            let url = location.href.split('?');
            let pars = url[1].split('&');
            console.log(pars);
          })
      }
    }
</script>

<style scoped>

</style>
