<template>
	<view class="content">
		<image src="/static/building@2x.png" class="iconImg"></image>
		<view class="bottomText">正在开发建设中</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad(options) {
			if(options && options.name){
				uni.setNavigationBarTitle({
					title:unescape(options.name)
				})
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.content{
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.bottomText{
		height:44upx;
		font-size:32upx;
		font-family:PingFangSC-Semibold;
		font-weight:600;
		color:rgba(102,102,102,1);
		line-height:44upx;
	}
	.iconImg{
		width:284upx;
		height: 252upx;
		margin-bottom: 56upx;
	}
</style>
