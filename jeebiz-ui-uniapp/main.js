import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
/*检测登录*/
Vue.prototype.checkLogin = function(backpage, para){
	let SESSION  = uni.getStorageSync('session');
	if(SESSION == ''){
		// #ifdef H5  || MP-WEIXIN
		uni.showModal({
			title:'提示',
			content:'需要先登录才能查看该功能，是否跳转到登录界面？',
			confirmColor:'#fdca00',
			 success: function (res) {
				if (res.confirm) {
					uni.navigateTo({
						url:'/pages/login/login'
					})
				} else if (res.cancel) {
				}
			}
		})
		// #endif 
		
		// #ifndef H5  || MP-WEIXIN
			const dcRichAlert = uni.requireNativePlugin('DCloud-RichAlert');
			dcRichAlert.show({
				 position: 'center',
				 title: "提示",
				 titleColor: '#333333',
				 content: "需要先登录才能查看该功能，是否跳转到登录界面",
				 contentAlign: 'center',
				 buttons: [{
					 title: '取消'
				 },{
					 title: '确认',
					 titleColor: '#fdca00'
				 }]
			}, result => {
				 switch (result.type) {
					case 'button':
						if(result.index==1){
							uni.navigateTo({
								url:'/pages/login/login'
							})
							
						}
					break;
				}
			});
		// #endif
		return false;
	}else{
		return true;
	}
	
}

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
