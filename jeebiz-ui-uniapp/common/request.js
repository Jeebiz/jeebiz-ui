// 全局请求参数
var setter = {
	debug 		: true, // 是否开启调试模式。如开启，接口异常时会抛出异常 URL 等信息
	// 自定义请求字段
	request 	: {
		// 自动携带 token 的字段名（如：access_token）。可设置 false 不携带。
		tokenName : 'X-Authorization'
	},
	// 自定义响应字段
	response 	: {
		statusName 	: 'code', // 数据状态的字段名称
		statusCode 	: {
			ok 		: "0", // 数据状态一切正常的状态码
			logout 	: "logout", 	 // 登录状态失效的状态码
			http	: {
				"400"  :"错误请求",
				"401"  :"请求要求身份验证",
				"403"  :"请求被拒绝",
				"404"  :"请求的资源或接口不存在",
				"405"  :"客户端请求中的方法被禁止",
				"406"  :"服务器无法根据客户端请求的内容特性完成请求",
				"407"  :"要求进行代理身份验证",
				"408"  :"服务器等候请求时发生超时",
				"409"  :"服务器找不到请求的地址",
				"410"  :"服务器找不到请求的地址" ,
				"411"  :"服务器拒绝接受不带Content-Length请求头的客户端请求",
				"412"  :"客户端请求信息的先决条件错误",
				"413"  :"服务器无法处理请求，因为请求实体过大，超出服务器的处理能力" ,
				"415"  :"服务器无法处理请求附带的媒体格式",
				"416"  :"客户端请求的范围无效",
				"417"  :"服务器无法满足Expect的请求头信息",
				"422"  :"无法处理的请求实体",
				"423"  :"当前资源被锁定 ",
				"424"  :"依赖导致的失败",
				"424"  :"客户端应当切换到TLS/1.0",
				"428"  :"要求先决条件",
				"429"  :"太多请求",
				"431"  :"请求头字段太大" ,
				"451"  :"该请求因法律原因不可用",
				"500"  :"服务器内部错误，无法完成请求",
				"501"  :"服务器不支持请求的功能，无法完成请求",
				"502"  :"错误网关",
				"503"  :"服务器目前无法使用（由于超载或停机维护）",
				"504"  :"网关访问超时",
				"505"  :"HTTP 版本不受支持",
				"506"  :"服务器内部配置错误" ,
				"507"  :"服务器无法存储完成请求所必须的内容",
				"508"  :"服务器存储空间不足",
				"509"  :"服务器达到带宽限制",
				"510"  :"获取资源所需要的策略并没有没满足",
				"511"  :"要求网络认证",
				"500"  :"服务器内部错误，无法完成请求",
			},
			status	: {
				"10002":"认证请求方法不支持",
				"10003":"登录失败次数超过最大限制，请输入验证码",
				"10004":"验证码发送失败",
				"10005":"请输入验证码",
				"10006":"验证码已过期",
				"10007":"验证码不可用",
				"10008":"验证码错误",
				"10010":"用户名或密码错误",
				"10110":"不允许访问（功能未授权）",
				"10111":"请求失败",
				"10112":"数据为空",
				"10113":"参数类型不匹配",
				"10114":"缺少矩阵变量",
				"10115":"缺少URI模板变量",
				"10116":"缺少Cookie变量",
				"10117":"缺少请求头",
				"10118":"缺少参数",
				"10119":"缺少请求对象",
				"10120":"参数规则不满足",
				"10121":"参数绑定错误",
				"10122":"参数解析错误",
				"10123":"参数验证失败",
				"10201":"服务器：运行时异常",
				"10202":"服务器：空值异常",
				"10203":"服务器：数据类型转换异常",
				"10204":"服务器：IO异常",
				"10205":"服务器：未知方法异常",
				"10206":"服务器：非法参数异常",
				"10207":"服务器：数组越界异常",
				"10208":"服务器：网络异常"
			},
			// 需要进行登录的状态码
			authz	: {
				"10009":"用户凭证已过期",
				"10013":"用户帐号不存在",
				"10014":"用户帐号未启用",
				"10015":"用户帐号已过期",
				"10016":"用户帐号已被锁定",
				"10017":"用户帐号无可用角色",
				"10018":"登录状态被强制注销，请稍后重新登录",
				"10019":"允许同时在线用户人数已达到上限，请稍后重新登录",
				"10020":"此用户多终端登录数量已达到上限，请清理终端登录状态并稍后登录",
				"10021":"登录失败",
				"10022":"临时授权码缺失",
				"10023":"临时授权码过期",
				"10024":"临时授权码已失效",
				"10025":"临时授权码错误",
				"10026":"临时授权码过期",
				"10027":"钉钉临时授权码过期",
				"10028":"钉钉临时授权码已失效",
				"10029":"钉钉临时授权码错误",  
				"10031":"Token缺失",
				"10032":"Token已过期",
				"10033":"Token已失效"
			},
		},
		// 需要进行登录的状态码
		tokenMiss	: ["10009","10022","10023","10024","10025","10026"],
		msgName 	: 'msg', // 状态信息的字段名称
		dataName 	: 'data' // 数据详情的字段名称
	},
	sessionName	: "session",
	header 		: {}
};
 
function doRequest(options){
	//console.log(options)
	var that = this
    ,success = options.success
    ,fail = options.fail
	,complete = options.complete
    ,request = setter.request
    ,response = setter.response
    ,debug = function(){
		return setter.debug  ? '<br><cite>URL：</cite>' + options.url : '';
    };
	//console.log(options.data)
    options.data = options.data || {};
	// 设置请求的 header，header 中不能设置 Referer。
    options.header = options.header || {};
	
	if(request.tokenName){
		var session = uni.getStorageSync('userlogin');
		
		//自动给 Request Header 传入 token
		options.header[request.tokenName] = request.tokenName in options.header ?  options.header[request.tokenName] : (session['token'] || '');
    }
	
    delete options.success;
    delete options.fail;
	delete options.complete;

	return uni.request(Object.assign({
		method	: 'post',
		// 如果设为 json，会尝试对返回的数据做一次 JSON.parse
		dataType: 'json',
		// 收到开发者服务成功返回的回调函数
		success	: function(res){
			
			var statusCode = response.statusCode;
			var data = res[response.dataName] || {};
			var code = data[response.statusName];
			
			// 只有 response 的 code 一切正常才执行 done
			if(code == statusCode.ok) {
				typeof options.done === 'function' && options.done(res); 
			} 
			// 登录状态失效，清除本地 access_token，并强制跳转到登入页
			else if(code == statusCode.logout){
				uni.setStorage({
					key		: setter.sessionName,
					data	: '',
					success	: function() {}
				});
			}
			// 其它异常
			else {
				if(statusCode.status[code]){
					var message = data[response.msgName] || statusCode.status[code];
					console.log(message, code)
					uni.showToast({
						title	: message,
						icon	:'none',
						mask	: false,
						duration: 3000
					});				
				}
				// 自动退出处理 : Token过期等处理
				else if(statusCode.authz[code]){
					var message = data[response.msgName] || statusCode.authz[code];
					console.log(message, code)
					uni.showToast({
						title	: message,
						icon	:'none',
						mask	: false,
						duration: 2000,
						// 接口调用成功的回调函数
						success : function(){
							uni.setStorage({
								key	:'session',
								data:'',
								success: function() {
									setTimeout(function (){
										uni.redirectTo({
											url:'/pages/login/login',
										});
									}, 1000);
								}
							});
						}
					});
					return;
				}
				else if(setter.debug){
					var error = [
			           '<cite>Error：</cite> ' + (res[response.msgName] || '返回状态码异常')
			            ,debug()
			        ].join('');
			        view.error(error);
				}
			}
			//只要 http 状态码正常，无论 response 的 code 是否正常都执行 success
			typeof success === 'function' && success(data);
		},
		// 接口调用失败的回调函数
		fail: function(e, code){
			if(setter.debug){
				var error = [
		    		 '请求异常，请重试<br><cite>错误信息：</cite>', code , response.statusCode.http[code]
		        ].join('');
				
				uni.showToast({
					title	: error,
					icon	:'none',
					mask	: false,
					duration: 3000
				});
			}
			typeof fail === 'function' && fail(e,code);
		},
		// 接口调用结束的回调函数（调用成功、失败都会执行）
		complete : function(){
			typeof complete === 'function' && complete();
		}
    }, options));
}

export default {
	post: function(options) {
		return doRequest(Object.assign({
			method	: 'POST',
			dataType: 'json',
			header	: {
				'Content-Type'	: 'application/json', //自定义请求头信息
			}
		}, options, {
			data: JSON.stringify(options.data),
		}));
	},
	get: function(options) {
		return doRequest(options);
	},
	setter : function(){
		return setter;
	}
}