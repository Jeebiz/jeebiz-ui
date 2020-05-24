<template>
	<view class="content">
		<view class="logo">Jeebiz Admin</view>
		<form>
			<view class="uni-form-item uni-column">
				<image src="/static/iconImg/count_icon@2x.png" class="iconImg"></image>
				<input class="uni-input" name="input" v-model="useraccount" placeholder="身份证号/学生号/手机号" />
			</view>
			<view class="uni-form-item uni-column">
				<image src="/static/iconImg/password_icon@2x.png" class="iconImg"></image>
				<input class="uni-input" :password="showPassWord" v-model="password" type="text" placeholder="请输入密码" />
				<image src="/static/iconImg/eye@2x.png" class="eyeIcon" @click="showPassWordFun"></image>
			</view>
			<view class="uni-form-item uni-column">
				<image src="/static/iconImg/vidilate_icon@2x.png" class="iconImg"></image>
				<input class="uni-input" name="input" placeholder="点击图片刷新验证码" v-model="captcha" />
				<view class="codeBox" @click="createCode">{{code}}</view>
				<!--验证码-->
			</view>
			
			<view class="cu-load load-modal" v-if="loadModal">
				<!-- <view class="cuIcon-emojifill text-orange"></view> -->
				<image src="/static/logo.png" mode="aspectFit"></image>
				<view class="gray-text">加载中...</view>
			</view>
		</form>
		<button @click="login" class="loginBtn">登录</button>
		<view class="forgetPassword" @click="jumpToPage">忘记密码?</view>
	</view>
</template>

<script>
	//import urlRequest from "@/common/urlRequest.js";、
	import request from "../../common/request.js"	
	export default {
		data() {
			return {
				useraccount: '',
				password: '',
				showPassWord: true,
				code: '', //验证码
				captcha: '', //输入的验证码
				loadModal:false,
			}
		},
		onLoad() {
			this.createCode();
			
		},
		onshow() {

		},
		methods: {
			/*用户登录*/
			login: function() {
				var that = this;
				if(!this.useraccount || !this.password){//验证用户名、密码
					uni.showToast({
						title: '用户名或密码不能为空',
						icon:'none',
						mask: false,
						duration: 3000
					});
					return false
				}

				if(!this.validate()){//验证验证码
					return false;
				}
				// useraccount:"1902000001",
				// password:"111111",
				var paras = {
						params: {
						  useraccount: this.useraccount,
						  password: this.password
					}
				};
				that.loadModal = true;
				
				let statusMap = {
					"10001":"认证失败",
					"10002":"认证请求方法不支持.",
					"10003":"登录失败次数操作最大限制，请输入验证码",
					"10004":"验证码发送失败",
					"10005":"请输入验证码",
					"10006":"验证码已过期",
					"10007":"验证码不可用",
					"10008":"验证码错误",
					"10010":"用户名或密码错误",
					"10011":"用户未注册",
					"10012":"用户已注册",
					"10013":"用户帐号不存在",
					"10014":"用户帐号未启用",
					"10015":"用户帐号已过期",
					"10016":"用户帐号已被锁定",
					"10017":"没有为用户指定角色",
					"10021":"认证失败"
				}
				
				request.post({
					async		: false,
					type		: "POST",
					url			: this.config.apiList.getToken,
					contentType	: "application/json",
					dataType	: "json",
					data		: {
						"username"	: this.useraccount,
						"password"	: this.password,
						"captcha"	: this.captcha
					},
					//成功时回调
					success: function (data) {
						that.loadModal = false;
						if(statusMap[data.code]){
							uni.showToast({
								title	: statusMap[data.code],
								icon	:'none',
								mask	: false,
								duration: 1000
							})
							return;
						}
						
						uni.showToast({
							title	: '登录成功',
							icon	: 'success',
							mask	: false,
							duration: 1000
						});
						uni.setStorage({
							key: 'userlogin',//将用户登录状态储存到本地缓存中，重要的studentId及token
							data: data,
							success: function() {
								uni.navigateBack({
									delta:1
								})
								//that.getUserInfo(data.userkey);//将个人基本信息保存到本地存储里
							}
						});
						/*
						 格式如： 
						{"msg":"认证成功",
						 "code":"0", // 逻辑标记
						 "initial":false, // 是否首次登陆
						 "alias":"超级管理员", // 账户名，教师角色即教师名称，学生类型即学生名称
						 "perms":[{"authority":"*"},{"authority":"ROLE_1"}], // 权限标记，与前端组件进行对应实现功能控制
						 "usercode":"201909171", // 用户编码：教师角色即教工号，学生类型即学号
						 "userid":"1",	// 用户表ID
						 "userkey":"973628b4537962ac6f2cacbf9403397b", // 账户ID：教师角色即教工表ID，学生类型即学生表ID
						 "token":"", // jwt授权
						 "username":"admin" // 用户名
						* }
						*/
					   
					    		
					},
					// 接口调用结束的回调函数（调用成功、失败都会执行）
					complete : function(res){
						that.loadModal = false;
					}					
				});
			},

			/*存储登录之后获取的用户信息*/
			getUserInfo: function(id) {
				console.log(id,'id')
				request.post({
					method		: "POST",
					url			:  this.config.apiList.getStudentInfo,
					contentType	: "application/json",
					dataType	: "json",
					data		: {
						params:{
							studentId:id
						}
					},
					//成功时回调
					success: function (data) {
						uni.setStorage({
							key: 'userloginInfo', //将用户基本信息储存到本地缓存
							data: data,
							success: function() {
								uni.navigateBack({
									delta:1
								})
							}
						});
					},
					//失败时回调
					fail : function(res){
						console.log(res)
					}
				});
			},
			/*控制密码显示隐藏*/
			showPassWordFun: function() {
				if (this.password) {
					this.showPassWord = !this.showPassWord
				}
			},

			/*创建验证码*/
			createCode: function() {
				code = "";
				var codeLength = 4; //验证码的长度  
				let code = ''
				var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
					'M', 'N', 'O', 'P', 'Q', 'R',
					'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //随机数  
				for (var i = 0; i < codeLength; i++) { //循环操作  
					var index = Math.floor(Math.random() * 36); //取得随机数的索引（0~35）  
					code += random[index]; //根据索引取得随机数加到code上  
				}
				this.code = code; //把code值赋给验证码  
			},
			//校验验证码  
			validate: function() {
				var captcha = this.captcha.toUpperCase(); //取得输入的验证码并转化为大写   
				
				if (captcha.length <= 0) { //若输入的验证码长度为0
					uni.showToast({
						title: '请输入验证码！',
						icon: "none",
						duration: 2000
					})
					return false;
				} else if (captcha != this.code) { //若输入的验证码与产生的验证码不一致时
					uni.showToast({
						title: '验证码输入错误！！',
						icon: "none",
						duration: 2000
					});
					this.createCode(); //刷新验证码  
					return false;
				} else { //输入正确时  
					return true;
				}
			},
			jumpToPage: function() {
				uni.navigateTo({
					url: '/pages/forgetPassWord/forgetPassWord'
				})
			}
		},

	}
</script>

<style>
	page {
		background: #fff;
	}

	view {
		box-sizing: border-box;
	}

	.content {
		padding: 0 84upx;
	}

	.logo {
		height: 200upx;
		display: flex;
		padding: 0 32upx;
		justify-content: center;
		align-items: center;
		font-size: 30px;
	}

	.uni-form-item {
		height: 108upx;
		line-height: 108upx;
		border-bottom: 2upx solid #eee;
		padding: 0 72upx;
		position: relative;
	}

	.uni-form-item .uni-input {
		height: 108upx;
		line-height: 108upx;
		font-size: 32upx;
	}

	.uni-form-item .iconImg {
		position: absolute;
		left: 16upx;
		top: 34upx;
		width: 40upx;
		height: 40upx;
	}

	.uni-form-item .eyeIcon {
		position: absolute;
		right: 10upx;
		top: 42upx;
		width: 38upx;
		height: 24upx;
	}

	.loginBtn {
		height: 80upx;
		line-height: 80upx;
		background: #FFDD2B;
		color: #101010;
		font-size: 28upx;
		margin-top: 70upx
	}

	.forgetPassword {
		margin-top: 32upx;
		color: #101010;
		font-size: 24upx;
		text-align: right;
	}

	.codeBox {
		font-family: Arial, 宋体;
		font-style: italic;
		color: green;
		border: 0;
		padding: 4upx 6upx;
		letter-spacing: 6upx;
		font-weight: bolder;
		width: 60px;
		height: 60px;
		display: block;
		right: 0;
		top: 0;
		display: inline-block;
		position: absolute;
	}
</style>
