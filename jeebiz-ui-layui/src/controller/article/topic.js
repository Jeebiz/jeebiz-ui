/**
 * 用户管理功能
 */
layui.define([ 'table', 'form' ], function(exports) {
					
	var $ = layui.$, setter = layui.setter, admin = layui.admin, table = layui.table, form = layui.form;
	
	form.render();
	
	// 用户管理
	admin.table({
		elem 		: '#LAY-topic-list',
		url 		: setter.prefix + '/article/topic/list', // 用户查询接口
		defaultToolbar: ['filter', 'exports', 'print', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
	      title: '提示'
	      ,layEvent: 'LAYTABLE_TIPS'
	      ,icon: 'layui-icon-tips'
	    }],
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
	form.on('submit(LAY-topic-search)', function(data) {
		var field = data.field;
		//执行重载
		table.reload('LAY-topic-list', {
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
			url			: setter.prefix + '/article/topic/status',
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
	table.on('renew(LAY-topic-list)', function(obj){
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
			url			: setter.prefix + 'authz/topic/update',
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
	table.on('tool(LAY-topic-list)', function(obj){
		var data = obj.data;
		var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
		switch (layEvent) {
			case 'detail': {
				layer.open({
					type	: 2,
					title	: '用户详情',
					area	: ['90%', '90%'],
					content	: setter.prefix + 'authz/topic/ext/ui/detail/' + data.id,
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
					content	: setter.prefix + 'authz/topic/ext/ui/renew/' + data.id,
					area	: ['90%', '90%'],
					btn		: ['确定', '取消'],
					moveType: 1, //拖拽模式，0或者1
					yes		: function(index, layero){
						var iframeWindow = window['layui-layer-iframe'+ index],
							submitID = 'LAY-topic-submit',
							submit = layero.find('iframe').contents().find('#'+ submitID);
						//监听提交
						iframeWindow.layui.form.on('submit('+ submitID +')', function(data){
							var field = data.field; //获取提交的字段
							// 提交更新
								admin.req({
								url			: setter.prefix + 'authz/topic/ext/renew',
								type 		: "POST",
								contentType	: "application/json",
								dataType	: "json",
								data		: JSON.stringify(field),
								success		: function(res){
									if(res.status == 'success'){
										layer.msg(res["msg"]||"", {
												icon: 1
										});
										table.reload('LAY-topic-list'); //刷新表格
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
							url			: setter.prefix + 'authz/topic/delete',
							type 		: "POST",
							data		: {"ids" : data.id},
							success		: function(res){
								if(res.status == 'success'){
									layer.msg(res["msg"]||"", {
											icon: 2
									});
									table.reload('LAY-topic-list'); //刷新表格
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
			var checkStatus = table.checkStatus('LAY-topic-list'),
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
						url			: setter.prefix + 'authz/topic/delete',
						type 		: "post",
						data		: {"ids" : ids.join(",")},
						success		: function(res){
							if(res.status == 'success'){
								layer.msg(res["msg"]||"", {
										icon: 2
								});
								table.reload('LAY-topic-list'); //刷新表格
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
			var checkStatus = table.checkStatus('LAY-topic-list'),
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
						url			: setter.prefix + 'authz/topic/ext/initpwd',
						type 		: "post",
						data		: {"ids" : ids.join(","), "password":"123456"},
						success		: function(res){
							if(res.status == 'success'){
								layer.msg(res["msg"]||"", {
										icon: 1
								});
								table.reload('LAY-topic-list'); //刷新表格
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
				content	: setter.prefix + 'authz/topic/ext/ui/new',
				area	: ['90%', '90%'],
				btn		: ['确定', '取消'],
				yes		: function(index, layero){
					var iframeWindow = window['layui-layer-iframe'+ index],
						submitID = 'LAY-topic-submit',
						submit = layero.find('iframe').contents().find('#'+ submitID);
					//监听提交
					iframeWindow.layui.form.on('submit('+ submitID +')', function(data){
						var field = data.field; //获取提交的字段
						// 提交更新
							admin.req({
							url			: setter.prefix + 'authz/topic/ext/new',
							type 		: "post",
							contentType	: "application/json",
							dataType	: "json",
							data		: JSON.stringify(field),
							success		: function(res){
								if(res.status == 'success'){
									layer.msg(res["msg"]||"", {
											icon: 1
									});
									table.reload('LAY-topic-list'); //刷新表格
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

	exports('article/topic', {})
});