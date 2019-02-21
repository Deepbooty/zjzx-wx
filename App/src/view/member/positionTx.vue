<template>
	<div>
		<iframe id="iframe" width="100%" frameborder=0 scrolling="no"
        src="http://apis.map.qq.com/tools/locpicker?search=1&type=1&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp">
	    </iframe>
	</div>
</template>

<script>
import '@/service/util/txapi'
import mapUtilTx from '@/service/util/mapUtilTx'
export default {
	mounted(){
		let _this = this;
		mapUtilTx.load(function(data){
			_this.$store.commit('setSelectedPublishName',data.publishaddresses);
			_this.$store.commit('setSelectedPublishAddress',data.publishstreet)
			_this.$Tool.goBack();
			//{publishaddresses: "君悦玺园", latitude: 30.66268, longitude: 117.48011, publishstreet: "安徽省池州市贵池区君悦广场(百牙西路南)"}
		})
	}
}
</script>