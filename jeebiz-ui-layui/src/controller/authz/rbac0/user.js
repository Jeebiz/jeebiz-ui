/**
 * 用户管理功能
 */
layui.define([ 'table', 'form' ], function(exports) {
					
	var $ = layui.$, setter = layui.setter, admin = layui.admin, table = layui.table, form = layui.form;
	
	form.render();
	
	var headers = {};
   	// 自动给 Request Headers 传入 token
   	headers[setter.storage.headerName] = (layui.data(setter.tableName)[setter.storage.tokenName] || '');
   	// 自动给 Request Headers 传入 token
   	headers[setter.storage.language] = (layui.data(setter.tableName)[setter.storage.language] || 'zh_CN');
    
	// 用户管理
	table.render({
		elem 		: '#LAY-user-list',
		url 		: setter.prefix + '/authz/user/list', // 用户查询接口
		contentType	: "application/json",
		page		: true,
		height		: 'full-220',
		limit		: 20,
		method		: 'POST', //如果无需自定义HTTP类型，可不加该参数
		headers		: headers,
		defaultToolbar: ['filter', 'exports', 'print', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
	      title: '提示'
	      ,layEvent: 'LAYTABLE_TIPS'
	      ,icon: 'layui-icon-tips'
	    }],
		page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
	      layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
	      //curr: 5, //设定初始在第 5 页
	      groups: 1, //只显示 1 个连续页码
	      first: false, //不显示首页
	      last: false //不显示尾页
	    },
		request		: {
			pageName	: 'pageNo', //页码的参数名称，默认：page
			limitName	: 'limit' //每页数据量的参数名，默认：limit
		},
		response	: {
			countName	: 'total', //规定数据总数的字段名称，默认：count
			dataName	: 'rows', //规定数据列表的字段名称，默认：data
			statusName	: 'code', //规定数据状态的字段名称，默认：code
			statusCode	: 200, //规定成功的状态码，默认：0
			msgName		: 'message' //规定状态信息的字段名称，默认：msg
		},
		cols 		: [ [ 
			{ type	: 'checkbox', fixed : 'left' }, 
			/*{ type: 'numbers'},*/
			{ field	: 'comName', width: 200, title: '所属单位', align: 'left'},
			{ field	: 'stuCode', width: 100, title: '用户编号', align: 'center'},
			{ field	: 'stuName', width: 180, title: '用户姓名', align: 'right'},
			{ field	: 'gender', width: 60, title: '性别', templet: '#genderTpl'},
			{ field	: 'age', width: 60, title: '年龄', align: 'center'},
			{ field	: 'minzu', width: 60, title: '民族', align: 'center'},
			{ field	: 'idcard', width: 180, title: '身份证号', align: 'center'},
			//{ field: 'avatar', title : '头像', width: 100, templet: '#imgTpl' }, 
			/*{ field: 'phone', title: '手机'},
			{ field: 'email', title: '邮箱'},*/
			{ field	: 'roleName', title: '角色', width : 100},
			{ field	: 'status', title : '用户状态', unresize: true, width : 90, align : 'center', templet: '#switchTpl'}, 
			{ field :'lock', title:'是否锁定', width:110, templet: '#"lockTpl"', unresize: true},
			{ title	: '操作', width : 200, align : 'center', fixed : 'right', toolbar : '#table-opt-list'}
		]],
		skin: 'line'
	});
	
	//监听搜索
	form.on('submit(LAY-user-search)', function(data) {
		var field = data.field;
		//执行重载
		table.reload('LAY-user-list', {
			where : field, 
			page: {
				curr: 1
			}
		});
	});
	
	// 监听状态操作
	form.on('switch(statusKv)', function(obj){
		//layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
		var value = this.value, //得到修改后的值
			id = $(obj.elem).data("id");
		// 提交更新
		admin.req({
			url			: setter.prefix + '/authz/user/status',
			type 		: "post",
			contentType	: "application/json",
			dataType	: "json",
			data		: JSON.stringify({
				"id" 	: id,
				"status": obj.elem.checked ? "1" : "0"
			}),
			success		: function(res){
				if(res.status == 'success'){
					layer.msg(res["message"]||"", {
							icon: 1
					});
				} else {
					layer.msg(res["message"]||"", {
							icon: 2
					});
				}
			}
		});
	});
	
  	// 监听锁定操作
 	form.on('checkbox(lockKv)', function(obj){
    	layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
  	});
  
  	
	//监听单元格编辑
	table.on('renew(LAY-user-list)', function(obj){
		var value = obj.value, //得到修改后的值
			data = obj.data,   //得到所在行所有键值
			field = obj.field; //得到字段
		var rqData = {
			"id" 	: data.id,
				"label" : field == "label" ? value : data.label,
				"key" 	: data.key,
				"value"	: field == "value" ? value : data.value,
			"status": data.status
		};
		//console.log(data);
		//console.log(rqData);
		// 提交更新
			admin.req({
			url			: setter.prefix + 'authz/user/update',
			type 		: "POST",
			contentType	: "application/json",
			data		: JSON.stringify(rqData),
			success		: function(res){
				if(res.status == 'success'){
					layer.msg(res["msg"]||"", {
							icon: 1
					});
				} else {
					layer.msg(res["msg"]||"", {
							icon: 2
					});
				}
			}
		});
		
	});
	
	//监听行工具事件
	table.on('tool(LAY-user-list)', function(obj){
		var data = obj.data;
		var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
		switch (layEvent) {
			case 'detail': {
				layer.open({
					type	: 2,
					title	: '用户详情',
					area	: ['90%', '90%'],
					content	: setter.prefix + 'authz/user/ext/ui/detail/' + data.id,
					btnAlign: 'r',
					btn		: ['确定'],
					moveType: 1, //拖拽模式，0或者1
					yes		: function (index, layero) {
						layer.close(index);
						return false;
					}
				});
			}; break;
			case 'renew': {
				layer.open({ 
					type	: 2,
					title	: '编辑用户',
					content	: setter.prefix + 'authz/user/ext/ui/renew/' + data.id,
					area	: ['90%', '90%'],
					btn		: ['确定', '取消'],
					moveType: 1, //拖拽模式，0或者1
					yes		: function(index, layero){
						var iframeWindow = window['layui-layer-iframe'+ index],
							submitID = 'LAY-user-submit',
							submit = layero.find('iframe').contents().find('#'+ submitID);
						//监听提交
						iframeWindow.layui.form.on('submit('+ submitID +')', function(data){
							var field = data.field; //获取提交的字段
							// 提交更新
								admin.req({
								url			: setter.prefix + 'authz/user/ext/renew',
								type 		: "POST",
								contentType	: "application/json",
								dataType	: "json",
								data		: JSON.stringify(field),
								success		: function(res){
									if(res.status == 'success'){
										layer.msg(res["msg"]||"", {
												icon: 1
										});
										table.reload('LAY-user-list'); //刷新表格
											layer.close(index); //关闭弹层
									} else {
										layer.msg(res["msg"]||"", {
												icon: 2
										});
									}
								}
							});
						});  
						
						submit.trigger('click');
					}
				}); 
			};break;
			case 'delete': {  //表格行删除事件
				layer.confirm('用户数据是系统重要数据（删除后将无法登录系统），确定继续操作吗？', function(index){
						admin.req({
							url			: setter.prefix + 'authz/user/delete',
							type 		: "POST",
							data		: {"ids" : data.id},
							success		: function(res){
								if(res.status == 'success'){
									layer.msg(res["msg"]||"", {
											icon: 2
									});
									table.reload('LAY-user-list'); //刷新表格
								} else {
									layer.msg(res["msg"]||"", {
											icon: 2
									});
								}
								layer.close(index);
							}
						});
				});
			};break;
		}
	});
	
	//事件
	var active = {
		// 批量删除
		batchdel	: function(){
			var checkStatus = table.checkStatus('LAY-user-list'),
				checkData = checkStatus.data; //得到选中的数据
			if(checkData.length === 0){
				return layer.msg('至少选择一条记录！');
			}
			layer.confirm('用户数据是系统重要数据（删除后将无法登录系统），确定继续操作吗？', function(){
					var ids = [];
					for( i in checkData){
						ids.push(checkData[i].id);
					}
					admin.req({
						url			: setter.prefix + 'authz/user/delete',
						type 		: "post",
						data		: {"ids" : ids.join(",")},
						success		: function(res){
							if(res.status == 'success'){
								layer.msg(res["msg"]||"", {
										icon: 2
								});
								table.reload('LAY-user-list'); //刷新表格
							} else {
								layer.msg(res["msg"]||"", {
										icon: 2
								});
							}
						}
					});
			});
		},
		// 重置密码
		initpwd		: function(){
			var checkStatus = table.checkStatus('LAY-user-list'),
				checkData = checkStatus.data; //得到选中的数据
			if(checkData.length === 0){
				return layer.msg('至少选择一条记录！');
			}
			layer.confirm('用户密码重置后需要重新登录，确定继续操作吗？', function(index){
				var ids = [];
					for( i in checkData){
						ids.push(checkData[i].id);
					}
					admin.req({
						url			: setter.prefix + 'authz/user/ext/initpwd',
						type 		: "post",
						data		: {"ids" : ids.join(","), "password":"123456"},
						success		: function(res){
							if(res.status == 'success'){
								layer.msg(res["msg"]||"", {
										icon: 1
								});
								table.reload('LAY-user-list'); //刷新表格
							} else {
								layer.msg(res["msg"]||"", {
										icon: 2
								});
							}
							layer.close(index);
						}
					});
			});
		},
		// 新增
		add: function(){
			layer.open({ 
				type	: 2,
				title	: '添加用户',
				content	: setter.prefix + 'authz/user/ext/ui/new',
				area	: ['90%', '90%'],
				btn		: ['确定', '取消'],
				yes		: function(index, layero){
					var iframeWindow = window['layui-layer-iframe'+ index],
						submitID = 'LAY-user-submit',
						submit = layero.find('iframe').contents().find('#'+ submitID);
					//监听提交
					iframeWindow.layui.form.on('submit('+ submitID +')', function(data){
						var field = data.field; //获取提交的字段
						// 提交更新
							admin.req({
							url			: setter.prefix + 'authz/user/ext/new',
							type 		: "post",
							contentType	: "application/json",
							dataType	: "json",
							data		: JSON.stringify(field),
							success		: function(res){
								if(res.status == 'success'){
									layer.msg(res["msg"]||"", {
											icon: 1
									});
									table.reload('LAY-user-list'); //刷新表格
										layer.close(index); //关闭弹层
								} else {
									layer.msg(res["msg"]||"", {
											icon: 2
									});
								}
							}
						});
					});
					submit.trigger('click');
				}
			}); 
		}
	}
	
	$('.layui-btn.layuiadmin-btn-admin').on('click', function(){
		var type = $(this).data('type');
		active[type] ? active[type].call(this) : '';
	});

	exports('authz/rbac0/user', {})
});