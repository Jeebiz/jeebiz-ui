layui.define(["table","form"],function(e){var s=layui.$,a=layui.setter,n=layui.admin,r=layui.table,t=layui.form;r.render({elem:"#LAY-user-list",url:a.prefix+"authz/user/ext/list",contentType:"application/json",page:!0,height:"full-220",limit:30,method:"POST",request:{pageName:"pageNo",limitName:"limit"},response:{countName:"total",dataName:"rows",statusName:"code",statusCode:0,msgName:"message"},cols:[[{type:"checkbox",fixed:"left"},{field:"comName",width:200,title:"\u6240\u5c5e\u5355\u4f4d",align:"left"},{field:"stuCode",width:100,title:"\u7528\u6237\u7f16\u53f7",align:"center"},{field:"stuName",width:180,title:"\u7528\u6237\u59d3\u540d",align:"right"},{field:"gender",width:60,title:"\u6027\u522b",templet:"#genderTpl"},{field:"age",width:60,title:"\u5e74\u9f84",align:"center"},{field:"minzu",width:60,title:"\u6c11\u65cf",align:"center"},{field:"idcard",width:180,title:"\u8eab\u4efd\u8bc1\u53f7",align:"center"},{field:"roleName",title:"\u89d2\u8272",width:100},{field:"status",title:"\u7528\u6237\u72b6\u6001",unresize:!0,width:90,align:"center",templet:"#switchTpl"},{title:"\u64cd\u4f5c",width:200,align:"center",fixed:"right",toolbar:"#table-opt-list"}]],skin:"line"}),t.on("submit(LAY-user-search)",function(e){e=e.field;r.reload("LAY-user-list",{where:e,page:{curr:1}})}),t.on("switch(statusKv)",function(e){this.value;var t=s(e.elem).data("id");n.req({url:a.prefix+"authz/user/status",type:"post",data:{id:t,status:e.elem.checked?"1":"0"},success:function(e){"success"==e.status?layer.msg(e.msg||"",{icon:1}):layer.msg(e.msg||"",{icon:2})}})}),r.on("renew(LAY-user-list)",function(e){var t=e.value,i=e.data,e=e.field,i={id:i.id,label:"label"==e?t:i.label,key:i.key,value:"value"==e?t:i.value,status:i.status};n.req({url:a.prefix+"authz/user/update",type:"POST",contentType:"application/json",data:JSON.stringify(i),success:function(e){"success"==e.status?layer.msg(e.msg||"",{icon:1}):layer.msg(e.msg||"",{icon:2})}})}),r.on("tool(LAY-user-list)",function(e){var i=e.data;switch(e.event){case"detail":layer.open({type:2,title:"\u7528\u6237\u8be6\u60c5",area:["90%","90%"],content:a.prefix+"authz/user/ext/ui/detail/"+i.id,btnAlign:"r",btn:["\u786e\u5b9a"],moveType:1,yes:function(e,t){return layer.close(e),!1}});break;case"renew":layer.open({type:2,title:"\u7f16\u8f91\u7528\u6237",content:a.prefix+"authz/user/ext/ui/renew/"+i.id,area:["90%","90%"],btn:["\u786e\u5b9a","\u53d6\u6d88"],moveType:1,yes:function(t,e){var i=window["layui-layer-iframe"+t],s="LAY-user-submit",e=e.find("iframe").contents().find("#"+s);i.layui.form.on("submit("+s+")",function(e){e=e.field;n.req({url:a.prefix+"authz/user/ext/renew",type:"POST",contentType:"application/json",dataType:"json",data:JSON.stringify(e),success:function(e){"success"==e.status?(layer.msg(e.msg||"",{icon:1}),r.reload("LAY-user-list"),layer.close(t)):layer.msg(e.msg||"",{icon:2})}})}),e.trigger("click")}});break;case"delete":layer.confirm("\u7528\u6237\u6570\u636e\u662f\u7cfb\u7edf\u91cd\u8981\u6570\u636e\uff08\u5220\u9664\u540e\u5c06\u65e0\u6cd5\u767b\u5f55\u7cfb\u7edf\uff09\uff0c\u786e\u5b9a\u7ee7\u7eed\u64cd\u4f5c\u5417\uff1f",function(t){n.req({url:a.prefix+"authz/user/delete",type:"POST",data:{ids:i.id},success:function(e){"success"==e.status?(layer.msg(e.msg||"",{icon:2}),r.reload("LAY-user-list")):layer.msg(e.msg||"",{icon:2}),layer.close(t)}})})}});var l={batchdel:function(){var t=r.checkStatus("LAY-user-list").data;if(0===t.length)return layer.msg("\u81f3\u5c11\u9009\u62e9\u4e00\u6761\u8bb0\u5f55\uff01");layer.confirm("\u7528\u6237\u6570\u636e\u662f\u7cfb\u7edf\u91cd\u8981\u6570\u636e\uff08\u5220\u9664\u540e\u5c06\u65e0\u6cd5\u767b\u5f55\u7cfb\u7edf\uff09\uff0c\u786e\u5b9a\u7ee7\u7eed\u64cd\u4f5c\u5417\uff1f",function(){var e=[];for(i in t)e.push(t[i].id);n.req({url:a.prefix+"authz/user/delete",type:"post",data:{ids:e.join(",")},success:function(e){"success"==e.status?(layer.msg(e.msg||"",{icon:2}),r.reload("LAY-user-list")):layer.msg(e.msg||"",{icon:2})}})})},initpwd:function(){var s=r.checkStatus("LAY-user-list").data;if(0===s.length)return layer.msg("\u81f3\u5c11\u9009\u62e9\u4e00\u6761\u8bb0\u5f55\uff01");layer.confirm("\u7528\u6237\u5bc6\u7801\u91cd\u7f6e\u540e\u9700\u8981\u91cd\u65b0\u767b\u5f55\uff0c\u786e\u5b9a\u7ee7\u7eed\u64cd\u4f5c\u5417\uff1f",function(t){var e=[];for(i in s)e.push(s[i].id);n.req({url:a.prefix+"authz/user/ext/initpwd",type:"post",data:{ids:e.join(","),password:"123456"},success:function(e){"success"==e.status?(layer.msg(e.msg||"",{icon:1}),r.reload("LAY-user-list")):layer.msg(e.msg||"",{icon:2}),layer.close(t)}})})},add:function(){layer.open({type:2,title:"\u6dfb\u52a0\u7528\u6237",content:a.prefix+"authz/user/ext/ui/new",area:["90%","90%"],btn:["\u786e\u5b9a","\u53d6\u6d88"],yes:function(t,e){var i=window["layui-layer-iframe"+t],s="LAY-user-submit",e=e.find("iframe").contents().find("#"+s);i.layui.form.on("submit("+s+")",function(e){e=e.field;n.req({url:a.prefix+"authz/user/ext/new",type:"post",contentType:"application/json",dataType:"json",data:JSON.stringify(e),success:function(e){"success"==e.status?(layer.msg(e.msg||"",{icon:1}),r.reload("LAY-user-list"),layer.close(t)):layer.msg(e.msg||"",{icon:2})}})}),e.trigger("click")}})}};s(".layui-btn.layuiadmin-btn-admin").on("click",function(){var e=s(this).data("type");l[e]&&l[e].call(this)}),e("user",{})});