<template>
	<view style="height: 100%;">
		<view class="header-wrap">
			<view class="index-header">
				<view class="input-wrap">
					<input type="text" placeholder="请输入搜索条件" v-model="value" @change="inputChange" />
					<uni-icon type="search" size="20" class="search"></uni-icon>
				</view>
				<view class="map-wrap"><image src="/static/index/scal@2x.png" class="icon" @click="scanBtn"></image></view>
			</view>
		</view>
		<!--轮播图-->
		<view class="contentBox">
			<view class="uni-padding-wrap">
				<view class="page-section swiper">
					<view class="page-section-spacing">
						<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500">
							<swiper-item>
								<view class="swiper-item">
									<image src="/static/banner/banner1.png" style="width:100%;" title="点击进入新生基本信息填写" @click="jumpToBasicInfoPage"></image>
								</view>
							</swiper-item>
							<swiper-item>
								<view class="swiper-item">
									<image src="/static/banner/banner2.png" style="width:100%" title="点击进入查看报到流程" @click="jumpToStartCheck"></image>
								</view>
							</swiper-item>
							<swiper-item>
								<view class="swiper-item">
									<image src="/static/banner/banner3.png" style="width:100%" title="点击进入新生基本信息填写" @click="jumpToBasicInfoPage"></image>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
		</view>

		<!--中间tab项-->
		<view class="gridTab padding_32">
			<view v-for="(item, index) in imageAttr" :key="index" :data-url="item.url" :data-name="item.name" class="navList" @click="jumpToPage">
				<image :src="item.src" class="navImg"></image>
				<view class="tabText">{{ item.name }}</view>
			</view>
		</view>

		<!--通知公告-->
		<view class="message">
			<image src="/static/index/informIcon@2x.png" class="icon"></image>
			<view class="msgContent">
				<view class="title">通知标题</view>
				<view class="msgInfo">通知内容不超过20个字</view>
			</view>
		</view>

		<!--讲座等-->
		<view class="imgBox padding_32">
			<view class="promptTitle">校园风光</view>
			<view class="innerBox"><image src="/static/lecture@2x.png" mode="widthFix" style="width:100%"></image></view>
		</view>

		<!--二维码弹出-->
		<view class="qrcodeBg" v-if="showQrcode" @click="hideQrcode">
			<view class="qrcodeBox"><image src="/static/qrcode.jpg" mode="widthFix" style="width:100%"></image></view>
		</view>
	</view>
</template>

<script>
import uniIcon from '@/components/uni-icon/uni-icon.vue';
import uniGrid from '@/components/uni-grid/uni-grid.vue';
export default {
	data() {
		return {
			title: 'Hello',
			value: '',
			false: false,
			imageAttr: [
				{
					src: '/static/index/card@2x.png',
					name: '一卡通',
					url: '/pages/building/building'
				},
				{
					src: '/static/index/hardWorking@2x.png',
					name: '勤工助学',
					url: '/pages/building/building'
				},
				{
					src: '/static/index/test@2x.png',
					name: '图书借阅',
					url: '/pages/building/building'
				},
				{
					src: '/static/index/scholarship@2x.png',
					name: '奖学金',
					url: '/pages/building/building'
				},
				{
					src: '/static/index/dorm@2x.png',
					name: '公寓管理',
					url: '/pages/building/building'
				},
				{
					src: '/static/index/corporation@2x.png',
					name: '毕业季',
					url: '/pages/building/building'
				},
				{
					src: '/static/index/heartMsg@2x.png',
					name: '爱心工程',
					url: '/pages/thingsChecked/index/index'
				},
				{
					src: '/static/index/guideWork@2x.png',
					name: '在线辅导',
					url: '/pages/building/building'
				},
				{
					src: '/static/index/lineClass@2x.png',
					name: '名师讲堂',
					url: '/pages/building/building'
				},
				{
					src: '/static/index/service@2x.png',
					name: '更多服务',
					url: '/pages/building/building'
				}
			],
			showQrcode: false
		};
	},
	methods: {
		inputChange(e) {},
		scanBtn: function() {
			// 允许从相机和相册扫码
			uni.scanCode({
				success: function(res) {
					console.log('条码类型：' + res.scanType);
					console.log('条码内容：' + res.result);
				}
			});
		},
		jumpToBasicInfoPage: function() {
			var isCheck = this.checkLogin();
			if (isCheck) {
				uni.navigateTo({
					url: '/pages/student_basic_Info/student_basic_Info'
				});
			}
		},
		showQrcodeFun: function() {
			this.showQrcode = true;
		},
		hideQrcode: function() {
			this.showQrcode = false;
		},
		jumpToStartCheck: function() {
			var isCheck = this.checkLogin();
			if (isCheck) {
				uni.navigateTo({
					url: '/pages/startCheck/startCheck'
				});
			}
		},
		jumpToPage: function(e) {
			var isCheck = this.checkLogin();
			if (isCheck) {
				var url = e.currentTarget.dataset.url;
				var name = e.currentTarget.dataset.name;

				if (url) {
					uni.navigateTo({
						url: url + '?name=' + escape(name)
					});
				}
			}
		}
	},
	components: {
		uniIcon,
		uniGrid //宫格
	}
};
</script>

<style>
view {
	box-sizing: border-box;
}
.padding_32 {
	padding: 32upx;
}
.header-wrap {
	width: 100%;
	position: fixed;
	top: 0;
	z-index: 999;
	/* height: 88upx; */
	padding: 0 10rpx 0 32rpx;
	/* padding-top: var(--status-bar-height); */
	box-sizing: border-box;
	background: #fff;
}
.index-header {
	height: 88upx;
	line-height: 88upx;
	font-size: 28upx;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.input-wrap {
	flex: 1;
	height: 64upx;
	line-height: 64upx;
	padding: 2upx 30upx 2upx 80upx;
	box-sizing: border-box;
	background-color: #fff;
	border-radius: 50upx;
	color: #333333;
	position: relative;
	border: 2upx solid #eee;
	border-radius: 60upx;
	background: #f5f5f5;
	margin-right: 32upx;
}
.search {
	position: absolute;
	left: 20upx;
	top: 0upx;
	color: #999999;
	font-size: 30upx;
}
.map-wrap {
	width: 25px;
	flex: 0 0 25px;
	display: inline-flex;
	justify-content: space-between;
}
.map-wrap .icon {
	width: 42upx;
	height: 40upx;
}
.map-wrap .icon:last-child {
	margin-right: 0px;
}
/*内容区域*/
.contentBox {
	width: 100%;
	/* padding: 138upx 32upx 0 32upx; */
	padding: 30rpx 25rpx 0 25rpx;
	/* #ifdef APP-PLUS */
	padding-top: calc(88upx + var(--status-bar-height));
	/* #endif */
	/* #ifndef APP-PLUS */
	margin-top: var(--status-bar-height);
	/* #endif */
}
.contentBox .uni-padding-wrap {
	padding: 32upx 0;
	height: 356upx;
}
.swiper-item {
	height: 100%;
}
.swiper-item image {
	height: 100%;
}
.message {
	position: relative;
	background: rgba(255, 249, 235, 1);
	padding: 24upx 90upx;
}
.message .icon {
	position: absolute;
	left: 34upx;
	top: 24upx;
	width: 42upx;
	height: 40upx;
}
.msgContent {
	/* padding: 0 0px 0 70upx; */
}
.msgContent .title {
	line-height: 40upx;
	color: #4a4a4a;
	font-size: 28upx;
	font-weight: 700;
}
.msgContent .msgInfo {
	line-height: 40upx;
	color: #4a4a4a;
	font-size: 28upx;
}
.imgBox {
	padding-top: 0;
	padding: 30rpx 25rpx 10rpx 25rpx;
}
.imgBox .promptTitle {
	font-size: 28upx;
	color: #4a4a4a;
	line-height: 40px;
	font-weight: 700;
}
.gridTab {
	margin-top: 40upx;
	padding-top: 0upx;
}
.gridTab .navList {
	display: inline-flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 20%;
	margin-bottom: 20upx;
}
.gridTab .navList .navImg {
	width: 110upx;
	height: 110upx;
}
.gridTab .navList .tabText {
	font-size: 24upx;
	color: #666666;
}
.qrcodeBg {
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	background: rgba(0, 0, 0, 0.8);
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999;
	padding: 0 32upx;
}
.qrcodeBg .qrcodeBox {
	width: 100%;
	background: #ffffff;
	padding: 32upx;
	box-sizing: border-box;
}
.qrcodeBg .qrcodeBox image {
	width: 100%;
	height: auto;
}
</style>
