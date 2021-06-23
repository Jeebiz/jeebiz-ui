/**
 * 角色管理功能
 */
layui.define([ 'table', 'form' , 'authtree' ], function(exports) {
					
	var $ = layui.$, setter = layui.setter, admin = layui.admin, table = layui.table, form = layui.form;
	
	var $ = layui.$, setter = layui.setter, view = layui.view, admin = layui.admin, table = layui.table, form = layui.form;
	form.render();
	//角色管理
	table.render(admin.wrap({
		elem 		: '#LAY-role-list',
		url 		: setter.prefix + '/authz/role/list', // 数据查询接口
		page		: true,
		height		: 'full-220',
		limit		: 30,
		defaultToolbar: ['filter', 'exports', 'print', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
	      title: '提示'
	      ,layEvent: 'LAYTABLE_TIPS'
	      ,icon: 'layui-icon-tips'
	    }],
		cols 		: [ [ 
			{ type : 'checkbox', fixed : 'left' },  
			{ field: 'name', title : '角色名称', minWidth : 100 }, 
			{ field: 'type', title : '角色类型', unresize: true, minWidth: 100, align : 'left', templet: '#typeTpl' }, 
			{ field: 'time24', minWidth: 170, align : 'center', title: '创建时间'},
			{ field: 'users', minWidth: 80, title: '用户数', align : 'center'},
			{ field: 'status', title : '角色状态', unresize: true, width: 100, align : 'center', templet: '#switchTpl'}, 
			{ title: '操作', minWidth : 180, align : 'center', fixed : 'right', toolbar : '#table-opt-list'}
		]],
		skin	: 'line'
	}));
	
	// 监听搜索
	form.on('submit(LAY-role-search)', function(data) {
		var field = data.field;
		//执行重载
		table.reload('LAY-role-list', {
			where : field
			, page: {
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
			url			: setter.prefix + '/authz/role/status',
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
	 
	// 监听行工具事件
	table.on('tool(LAY-role-list)', function(obj){
		var data = obj.data;
		var id = data.id;
		if(obj.event === 'detail'){
			layer.open({
				area: ['700px', '600px'],
				content: str, //注意，如果str是object，那么需要字符拼接。
				title: '角色详情',
				type: 2, 
			 	content: '/src/views/authz/rbac0/role/new.html'
			});
 		} else if(obj.event === 'renew'){
			layer.open({ 
				type	: 2,
				title	: '编辑角色',
				content	: '/src/views/authz/rbac0/role/renew.html',
				area	: ['700px', '600px'],
				btn		: ['确定', '取消'],
				yes		: function(index, layero){
					var iframeWindow = window['layui-layer-iframe'+ index],
						submitID = 'LAY-role-submit',
						submit = layero.find('iframe').contents().find('#'+ submitID);
					//监听提交
					iframeWindow.layui.form.on('submit('+ submitID +')', function(data){
						var field = data.field; //获取提交的字段
						field["perms"] = field["perms"].split(",");
						for(var key in field ){
							if(key.split("permsTemp[").length > 1){
								delete field[key];
							}
						}
						// 提交更新
						admin.req({
							url			: setter.prefix + 'authz/role/renew',
							type 		: "post",
							contentType	: "application/json",
							dataType	: "json",
							data		: JSON.stringify(field),
							success		: function(res){
								if(res.status == 'success'){
									layer.msg(res["msg"]||"", {
											icon: 1
									});
									table.reload('LAY-role-list'); //刷新表格
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
		} else if(obj.event === 'delete'){
			layer.confirm('确定删除选中的角色吗？', function(index){
				admin.req({
					url			: setter.prefix + 'authz/role/delete/' + id,
					type 		: "get",
					success		: function(res){
						if(res.status == 'success'){
							layer.msg(res["msg"]||"", {
									icon: 1
							});
							table.reload('LAY-role-list'); //刷新表格
						} else {
							layer.msg(res["msg"]||"", {
									icon: 2
							});
						}
						layer.close(index);
					}
				});
			});
		}  
	});
	
	//事件
	var active = {
		add: function(){
			admin.popup({
		        id		: 'LAY-role-add',
		        title	: '添加角色',
		        area	: ['600px', '500px'],
				btn		: ['确定', '取消'],
		        success : function(layero, index){
					layui.view(this.id).render('authz/rbac0/role/new').done(function(){
		            
		        	  form.render(null, 'layuiadmin-form-role');
		            
		           	  //提交
		              form.on('submit(LAY-role-submit)', function(data){
		              	var field = data.field; //获取提交的字段
						  field["perms"] = field["perms"].split(",");
						for(var key in field ){
							if(key.split("permsTemp[").length > 1){
								delete field[key];
							}
						}
						// 提交更新
						admin.req({
							url			: setter.prefix + 'authz/role/new',
							type 		: "post",
							contentType	: "application/json",
							dataType	: "json",
							data		: JSON.stringify(field),
							success		: function(res){
								if(res.status == 'success'){
									layer.msg(res["message"]||"", {
										icon: 1
									});
									//提交 Ajax 成功后，关闭当前弹层并重载表格
					              	layui.table.reload('LAY-role-list'); //重载表格
					              	layer.close(index); //执行关闭 
								} else {
									layer.msg(res["message"]||"", {
										icon: 2
									});
								}
							}
						});
		            });
		          });
		        }
		   });
		}
	};
	
	$('.layui-btn.layuiadmin-btn-admin').on('click', function(){
		var type = $(this).data('type');
		active[type] ? active[type].call(this) : '';
	});

	exports('role', {})
});