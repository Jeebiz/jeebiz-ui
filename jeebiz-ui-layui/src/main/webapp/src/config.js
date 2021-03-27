/**
 @Name：全局配置
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL（layui付费产品协议）
 */
layui.define(['laytpl', 'layer', 'element', 'util'], function (exports) {
	exports('setter', {
		container: 'LAY_app', // 容器ID
		base: layui.cache.base, // 记录layuiAdmin文件夹所在路径
		prefix: layui.cache.prefix || 'http://127.0.0.1:8090', //  应用上下文地址，如：admin/
		views: layui.cache.base + 'views/', // 视图所在目录
		entry: 'index', //  默认视图文件名
		engine: '.html', //  视图文件后缀名
		pageTabs: false, //  是否开启页面选项卡功能。单页版不推荐开启

		name: 'Jeebiz Admin Pro',
		tableName: 'jeebizAdmin', //  本地存储表名
		MOD_NAME: 'admin', //  模块事件名

		debug: false, // 是否开启调试模式。如开启，接口异常时会抛出异常 URL 等信息

		interceptor: true, // 是否开启未登入拦截

		//  自定义请求字段名称 
		storage: {
			headerName	: "X-Authorization",
			tokenName	: "token",
			language	: "zh_CN"
		},

		//  是否自动携带请求字段
		request: {
			headerName	: true, //  自动携带 header。可设置 false 不携带。
			tokenName	: false, //  自动携带 token。可设置 false 不携带。
			language	: true
		},

		// 自定义响应字段
		response: {
			statusName: 'code', // 数据状态的字段名称
			statusCode: {
				ok: 200, // 数据状态一切正常的状态码
				logout: 1001, // 登录状态失效的状态码
				http: {
					"400": "错误请求",
					"401": "请求要求身份验证",
					"403": "请求被拒绝",
					"404": "请求的资源或接口不存在",
					"405": "客户端请求中的方法被禁止",
					"406": "服务器无法根据客户端请求的内容特性完成请求",
					"407": "要求进行代理身份验证",
					"408": "服务器等候请求时发生超时",
					"409": "服务器找不到请求的地址",
					"410": "服务器找不到请求的地址",
					"411": "服务器拒绝接受不带Content-Length请求头的客户端请求",
					"412": "客户端请求信息的先决条件错误",
					"413": "服务器无法处理请求，因为请求实体过大，超出服务器的处理能力",
					"415": "服务器无法处理请求附带的媒体格式",
					"416": "客户端请求的范围无效",
					"417": "服务器无法满足Expect的请求头信息",
					"422": "无法处理的请求实体",
					"423": "当前资源被锁定 ",
					"424": "依赖导致的失败",
					"424": "客户端应当切换到TLS/1.0",
					"428": "要求先决条件",
					"429": "太多请求",
					"431": "请求头字段太大",
					"451": "该请求因法律原因不可用",
					"500": "服务器内部错误，无法完成请求",
					"501": "服务器不支持请求的功能，无法完成请求",
					"502": "错误网关",
					"503": "服务器目前无法使用（由于超载或停机维护）",
					"504": "网关访问超时",
					"505": "HTTP 版本不受支持",
					"506": "服务器内部配置错误",
					"507": "服务器无法存储完成请求所必须的内容",
					"508": "服务器存储空间不足",
					"509": "服务器达到带宽限制",
					"510": "获取资源所需要的策略并没有没满足",
					"511": "要求网络认证",
					"500": "服务器内部错误，无法完成请求",
				},
				status: {
					"10002": "认证请求方法不支持",
					"10003": "登录失败次数超过最大限制，请输入验证码",
					"10004": "验证码发送失败",
					"10005": "请输入验证码",
					"10006": "验证码已过期",
					"10007": "验证码不可用",
					"10008": "验证码错误",
					"10010": "用户名或密码错误",
					"10110": "不允许访问（功能未授权）",
					"10111": "请求失败",
					"10112": "数据为空",
					"10113": "参数类型不匹配",
					"10114": "缺少矩阵变量",
					"10115": "缺少URI模板变量",
					"10116": "缺少Cookie变量",
					"10117": "缺少请求头",
					"10118": "缺少参数",
					"10119": "缺少请求对象",
					"10120": "参数规则不满足",
					"10121": "参数绑定错误",
					"10122": "参数解析错误",
					"10123": "参数验证失败",
					"10201": "服务器：运行时异常",
					"10202": "服务器：空值异常",
					"10203": "服务器：数据类型转换异常",
					"10204": "服务器：IO异常",
					"10205": "服务器：未知方法异常",
					"10206": "服务器：非法参数异常",
					"10207": "服务器：数组越界异常",
					"10208": "服务器：网络异常"
				},
				//  需要进行登录的状态码
				authz: {
					"10009": "用户凭证已过期",
					"10013": "用户帐号不存在",
					"10014": "用户帐号未启用",
					"10015": "用户帐号已过期",
					"10016": "用户帐号已被锁定",
					"10017": "用户帐号无可用角色",
					"10018": "登录状态被强制注销，请稍后重新登录",
					"10019": "允许同时在线用户人数已达到上限，请稍后重新登录",
					"10020": "此用户多终端登录数量已达到上限，请清理终端登录状态并稍后登录",
					"10021": "登录失败",
					"10022": "临时授权码缺失",
					"10023": "临时授权码过期",
					"10024": "临时授权码已失效",
					"10025": "临时授权码错误",
					"10026": "临时授权码过期",
					"10027": "钉钉临时授权码过期",
					"10028": "钉钉临时授权码已失效",
					"10029": "钉钉临时授权码错误",
					"10031": "Token缺失",
					"10032": "Token已过期",
					"10033": "Token已失效"
				},
			},
			msgName: 'msg', // 状态信息的字段名称
			dataName: 'data' // 数据详情的字段名称
		},

		// 独立页面路由，可随意添加（无需写参数）
		indPage: [
			'/user/login', // 登入页
			'/user/reg', // 注册页
			'/user/forget', // 找回密码
			'/template/tips/test' // 独立页的一个测试 demo
		],

		// 扩展的第三方模块
		extend: [
			'atree',
			'authtree',
			'base64',
			'checkbox/checkbox',
			'citypicker/citypicker',
			'ckplayer/ckplayer',
			'cropper/cropper',
			'dynamicCondition/dynamicCondition',
			'echarts', //  echarts 核心包
			'echartsTheme', //  echarts 主题
			'loading/loading',
			'md5',
			'selectplus/selectPlus',
			'tableSelect',
			'timePicker/js/timePicker',
			'treeGrid/treeGrid',
			'treetable'
		],

		// 主题配置
		theme: {
			// 内置主题配色方案
			color: [{
				main: '#20222A' // 主题色
					,
				selected: '#009688' // 选中色
					,
				alias: 'default' // 默认别名
			}, {
				main: '#03152A',
				selected: '#3B91FF',
				alias: 'dark-blue' // 藏蓝
			}, {
				main: '#2E241B',
				selected: '#A48566',
				alias: 'coffee' // 咖啡
			}, {
				main: '#50314F',
				selected: '#7A4D7B',
				alias: 'purple-red' // 紫红
			}, {
				main: '#344058',
				logo: '#1E9FFF',
				selected: '#1E9FFF',
				alias: 'ocean' // 海洋
			}, {
				main: '#3A3D49',
				logo: '#2F9688',
				selected: '#5FB878',
				alias: 'green' // 墨绿
			}, {
				main: '#20222A',
				logo: '#F78400',
				selected: '#F78400',
				alias: 'red' // 橙色
			}, {
				main: '#28333E',
				logo: '#AA3130',
				selected: '#AA3130',
				alias: 'fashion-red' // 时尚红
			}, {
				main: '#24262F',
				logo: '#3A3D49',
				selected: '#009688',
				alias: 'classic-black' // 经典黑
			}, {
				logo: '#226A62',
				header: '#2F9688',
				alias: 'green-header' // 墨绿头
			}, {
				main: '#344058',
				logo: '#0085E8',
				selected: '#1E9FFF',
				header: '#1E9FFF',
				alias: 'ocean-header' // 海洋头
			}, {
				header: '#393D49',
				alias: 'classic-black-header' // 经典黑
			}, {
				main: '#50314F',
				logo: '#50314F',
				selected: '#7A4D7B',
				header: '#50314F',
				alias: 'purple-red-header' // 紫红头
			}, {
				main: '#28333E',
				logo: '#28333E',
				selected: '#AA3130',
				header: '#AA3130',
				alias: 'fashion-red-header' // 时尚红头
			}, {
				main: '#28333E',
				logo: '#009688',
				selected: '#009688',
				header: '#009688',
				alias: 'green-header' // 墨绿头
			}],

			// 初始的颜色索引，对应上面的配色方案数组索引
			// 如果本地已经有主题色记录，则以本地记录为优先，除非请求本地数据（localStorage）
			initColorIndex: 0
		}
	});
});