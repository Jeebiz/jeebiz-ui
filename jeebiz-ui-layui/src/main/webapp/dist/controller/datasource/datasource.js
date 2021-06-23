layui.define(["table","form"],function(e){var r=layui.$,n=layui.setter,o=layui.admin,c=layui.table,t=layui.form;c.render({elem:"#LAY-datasource-list",url:n.prefix+"extras/datasource/list",contentType:"application/json",page:!0,method:"POST",request:{pageName:"pageNo",limitName:"limit"},response:{countName:"total",dataName:"rows",statusName:"code",statusCode:0,msgName:"message"},cols:[[{type:"checkbox",fixed:"left"},{field:"name",title:"\u6570\u636e\u6e90\u6807\u9898"},{field:"dbtype",title:"\u6570\u636e\u6e90\u7c7b\u578b",templet:function(a){var s=a.dbtype;return r("#LAY-dbtype option").each(function(e,t){if(r(this).val()==a.dbtype)return s=r(this).text(),!1}),s}},{field:"time24",title:"\u6ce8\u518c\u65f6\u95f4",width:170,edit:"text"},{field:"status",title:"\u6570\u636e\u6e90\u72b6\u6001",templet:"#switchTpl",unresize:!0,width:100,align:"center"},{title:"\u64cd\u4f5c",minWidth:80,align:"center",fixed:"right",toolbar:"#table-opt-list"}]],skin:"line"}),t.on("submit(LAY-datasource-search)",function(e){e=e.field;c.reload("LAY-datasource-list",{where:e,page:{curr:1}})}),t.on("switch(statusDs)",function(e){this.value;var t=r(e.elem).data("id");o.req({url:n.prefix+"extras/datasource/status",type:"post",data:{id:t,status:e.elem.checked?"1":"0"},success:function(e){"success"==e.status?layer.msg(e.msg||"",{icon:1}):layer.msg(e.msg||"",{icon:2})}})}),c.on("tool(LAY-datasource-list)",function(e){var a=e.data.id;"detail"===e.event?r.get(n.prefix+"extras/datasource/ui/detail/"+a,{},function(e){layer.open({area:["700px","600px"],content:e,title:"\u6570\u636e\u6e90\u8be6\u60c5",type:1})}):"edit"===e.event?layer.open({type:2,title:"\u7f16\u8f91\u6570\u636e\u6e90",content:n.prefix+"extras/datasource/ui/edit/"+a,area:["700px","600px"],btn:["\u786e\u5b9a","\u53d6\u6d88"],yes:function(t,e){var a=window["layui-layer-iframe"+t],s="LAY-datasource-forum-submit",e=e.find("iframe").contents().find("#"+s);a.layui.form.on("submit("+s+")",function(e){e=e.field;o.req({url:n.prefix+"extras/datasource/edit",type:"post",contentType:"application/json",dataType:"json",data:JSON.stringify(e),success:function(e){"success"==e.status?(layer.msg(e.msg||"",{icon:1}),c.reload("LAY-datasource-list"),layer.close(t)):layer.msg(e.msg||"",{icon:2})}})}),e.trigger("click")}}):"del"===e.event&&layer.confirm("\u786e\u5b9a\u5220\u9664\u5f53\u524d\u7684\u6570\u636e\u5417\uff1f",function(t){o.req({url:n.prefix+"extras/datasource/delete",type:"post",data:{ids:a},success:function(e){"success"==e.status?(layer.msg(e.msg||"",{icon:2}),c.reload("LAY-datasource-list")):layer.msg(e.msg||"",{icon:2}),layer.close(t)}})})});var a={batchdel:function(){var t=c.checkStatus("LAY-datasource-list").data;if(0===t.length)return layer.msg("\u8bf7\u9009\u62e9\u6570\u636e");layer.confirm("\u786e\u5b9a\u5220\u9664\u9009\u4e2d\u7684\u6570\u636e\u5417\uff1f",function(){var e=[];for(i in t)e.push(t[i].id);o.req({url:n.prefix+"extras/datasource/delete",type:"post",data:{ids:e.join(",")},success:function(e){"success"==e.status?(layer.msg(e.msg||"",{icon:2}),c.reload("LAY-datasource-list")):layer.msg(e.msg||"",{icon:2})}})})},add:function(){layer.open({type:2,title:"\u6dfb\u52a0\u6570\u636e\u6e90",content:n.prefix+"extras/datasource/ui/new",area:["700px","600px"],btn:["\u786e\u5b9a","\u53d6\u6d88"],yes:function(t,e){var a=window["layui-layer-iframe"+t],s="LAY-datasource-forum-submit",e=e.find("iframe").contents().find("#"+s);a.layui.form.on("submit("+s+")",function(e){e=e.field;o.req({url:n.prefix+"extras/datasource/new",type:"post",contentType:"application/json",dataType:"json",data:JSON.stringify(e),success:function(e){"success"==e.status?(layer.msg(e.msg||"",{icon:1}),c.reload("LAY-datasource-list"),layer.close(t)):layer.msg(e.msg||"",{icon:2})}})}),e.trigger("click")}})}};r(".layui-btn.layuiadmin-btn-admin").on("click",function(){var e=r(this).data("type");a[e]&&a[e].call(this)}),e("datasource",{})});