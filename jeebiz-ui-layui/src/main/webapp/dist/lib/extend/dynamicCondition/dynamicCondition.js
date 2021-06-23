
/**
 @Name： dynamicCondition 动态添加查询条件
 @Author：肖朋林
 @version: 1.0.5
 	码云地址：https://pelin0963.gitee.io/layuiextend
 	在线demo：https://pelin0963.gitee.io/layuiextend/layui_exts/dynamicCondition/demo/index.html
 */
layui.define(['jquery','table', 'form','laydate'], function (exports) {
    "use strict";

    var MOD_NAME = 'dynamicCondition',
        $ = layui.jquery,
        laydate = layui.laydate,
        table = layui.table,
        form = layui.form;
    //创建实例
    var createInstance = function(_config){
    	var instance = {
    		data:[]
    		,config:_config
    		,requestData:{}
    		,cacheCondition:[] //缓存查询条件
    		,conditionContainerId:(Math.random()+"").substr(2)//随机日期id
    		,conditionFieldWidth:_config.conditionFieldWidth || 120 //第一列默认宽度
    		,conditionOptionWidth:_config.conditionOptionWidth || 100//第二列默认宽度
    		,conditionValueWidth:_config.conditionValueWidth || 150 //第三列默认宽度
    		,height:380 //弹出窗口默认高度
    		,width:610 //弹出窗口默认宽度
    	};
    	if(instance.config.type != "complex"){
    		instance.width = instance.width - instance.conditionOptionWidth;
    	}
    	/**根据字段名称获取对应的配置项*/
    	instance.getObjByField=function(conditionFieldVal){
    		for(var i=0;i<instance.data.length;i++){
    			if(instance.data[i].field == conditionFieldVal){
    				return instance.data[i];
    			}
    		}
    		return null;
    	}
    	/**设置初始条件
    	 * conditionArr,例：
    	 * */
    	instance.setCondition = function(conditionArr){
    		//缓存查询条件
    		var cacheCondition = [];
    		for(var i=0;i<conditionArr.length;i++){
    			var curCondition = conditionArr[i];
    			var conditionObj = {};
    			conditionObj.conditionFieldVal = curCondition[0];
    			if(!curCondition[1]){
    				curCondition[1] = "equal";
    			}
    			conditionObj.conditionOptionVal = curCondition[1];
    			conditionObj.conditionValueVal = curCondition[2];
    			conditionObj.conditionValueLeftVal = curCondition[2];
    			conditionObj.conditionValueRightVal = curCondition[3];
    			var item = instance.getObjByField(conditionObj.conditionFieldVal);
    			if(item.edit == "select"){
    				var selectHtml;
	  				  if($(item.templet).is("select")){
	  					  selectHtml = $(item.templet).prop("outerHTML");
	  				  }else{
	  					  selectHtml = $(item.templet).html();
	  				  }
    				conditionObj.conditionValueHtml = selectHtml;
    			}
    			cacheCondition.push(conditionObj);
    		}
    		instance.cacheCondition = cacheCondition;
    		instance.buildConditionHtml();
    	}
    	/**新增条件*/
    	instance.addRow = function(){
    		  var conditionContainerJq = $("#"+instance.conditionContainerId);
			  var conditionRowJq = $('<div class="conditionRow"></div>');
			  //字段
			  var conditionField=$('<div class="layui-inline conditionField"></div>');
			  conditionField.width(instance.conditionFieldWidth);
			  conditionField.append($(instance.conditionFieldHtml));
			  //操作
			  var conditionOption=$('<div class="layui-inline conditionOption"></div>');
			  conditionOption.width(instance.conditionOptionWidth);
			  conditionOption.append($(instance.conditionOptionHtml));
			  //值
			  var conditionValue=$('<div class="layui-inline conditionValue"></div>');
			  conditionValue.width(instance.conditionValueWidth*2+20);
			  var conditionDel=$('<div class="layui-inline conditionDel"></div>');
//			  conditionDel.width(30);
			  //删除按钮
			  var delJq=$('<a href="javascript:void(0);" class="delRowBtn"><i class="layui-icon layui-icon-close" style="font-size: 30px; color: red;"></i></a>');
			  conditionDel.append(delJq);
			  conditionRowJq.append(conditionField);
			  conditionRowJq.append(conditionOption);
			  conditionRowJq.append(conditionValue);
			  conditionRowJq.append(conditionDel);
			  conditionContainerJq.find(".conditionDiv").append(conditionRowJq);
			  instance.updateConditionValue(conditionRowJq);
			  //删除事件
			  delJq.on("click",function(){
				  conditionRowJq.remove();
			  });
			  if(instance.config.type == "simple"){
				  conditionOption.hide();
			  }
			  form.render('select', 'conditionDiv');
			  return conditionRowJq;
//			  form.render();
		  }
    	  /**更新conditionValue*/
    	  instance.updateConditionValue = function(conditionRowJq){
			  var conditionValueJq = conditionRowJq.find(".conditionValue");
			  var conditionFieldVal = conditionRowJq.find("select[name='conditionField']").val();
			  var conditionOptionVal = conditionRowJq.find("select[name='conditionOption']").val();
			  var obj = instance.getObjByField(conditionFieldVal);
			  //没有对应的obj，则不用更新conditionValue
			  if(!obj){
				  return ;
			  }
			  //conditionValueJq div中缓存对应的edit和conditionOptionVal，以后优化只有单edit和conditionOptionVal改变时才考虑更新conditionValueJq
			  var old_field = conditionValueJq.attr("field");
			  var old_edit = conditionValueJq.attr("edit");
			  var old_conditionOptionVal = conditionValueJq.attr("conditionOptionVal");
			  conditionValueJq.attr("field", obj.field);
			  conditionValueJq.attr("edit", obj.edit);
			  conditionValueJq.attr("conditionOptionVal", conditionOptionVal);
			  var layVerify = obj.layVerify;
			  if(conditionOptionVal == "empty"){
				  conditionValueJq.html("");
				  return ;
			  }
			  if(obj.edit == "text" ){
				  if(conditionOptionVal == "between"){
					  var conditionValueLeftJq = $('<input type="text" name="conditionValueLeft" class="layui-input" style="display:inline" placeholder="" />');
					  conditionValueLeftJq.width(instance.conditionValueWidth);
					  var conditionValueRightJq = $('<input type="text" name="conditionValueRight" class="layui-input" style="display:inline" placeholder="" />');
					  conditionValueRightJq.width(instance.conditionValueWidth);
					  if(layVerify){
						  conditionValueLeftJq.attr("lay-verify",layVerify);
						  conditionValueRightJq.attr("lay-verify",layVerify);
					  }
					  //更新conditionValueJq
					  conditionValueJq.html("");
					  conditionValueJq.append(conditionValueLeftJq);
					  conditionValueJq.append("<span style='margin:auto 3px;'>至</span>");
					  conditionValueJq.append(conditionValueRightJq);
				  }else{
					  var inputJq = $('<input type="text" name="conditionValue" class="layui-input" placeholder="" />');
					  if(layVerify){
						  inputJq.attr("lay-verify",layVerify);
					  }
					  conditionValueJq.html(inputJq);
				  }
			  }
			  else if(obj.edit == "select"){
				  var selectHtml;
				  if($(obj.templet).is("select")){
					  selectHtml = $(obj.templet).prop("outerHTML");
				  }else{
					  selectHtml = $(obj.templet).html();
				  }
				  if(conditionOptionVal == "between"){
					  //范围左
					  var conditionValueLeftJq = $(selectHtml);
					  conditionValueLeftJq.attr("name","conditionValueLeft");
					  var divLeft = $("<div style='display:inline-block'></div>");
					  divLeft.width(instance.conditionValueWidth);
					  divLeft.append(conditionValueLeftJq);
					  //范围右
					  var conditionValueRightJq = $(selectHtml);
					  conditionValueRightJq.attr("name","conditionValueRight");
					  var divRight = $("<div style='display:inline-block'></div>");
					  divRight.width(instance.conditionValueWidth);
					  divRight.append(conditionValueRightJq);
					  //添加校验
					  if(layVerify){
						  conditionValueLeftJq.attr("lay-verify",layVerify);
						  conditionValueRightJq.attr("lay-verify",layVerify);
					  }
					  //更新conditionValueJq
					  conditionValueJq.html("");
					  conditionValueJq.append(divLeft);
					  conditionValueJq.append("<span style='margin:auto 3px;'>至</span>");
					  conditionValueJq.append(divRight);
					  
				  }else{
					  var selectJq = null;
					  selectJq = $(selectHtml);
					  selectJq.attr("name","conditionValue");
					  conditionValueJq.html("");
					  conditionValueJq.append(selectJq);
				  }
				  form.render('select', 'conditionDiv');
			  }
			  else if(obj.edit == "date"){
				  var dateType = obj.dateType || "date";
				  if(conditionOptionVal == "between"){
					  //范围左
					  var conditionValueLeftJq = $('<input type="text" name="conditionValueLeft" class="layui-input" style="display:inline" placeholder="" />');
					  conditionValueLeftJq.attr("date-type",dateType);
					  conditionValueLeftJq.width(instance.conditionValueWidth);
					  
					  //范围右
					  var conditionValueRightJq = $('<input type="text" name="conditionValueRight" class="layui-input" style="display:inline" placeholder="" />');
					  conditionValueRightJq.attr("date-type",dateType);
					  conditionValueRightJq.width(instance.conditionValueWidth);
					  //添加校验
					  if(layVerify){
						  conditionValueLeftJq.attr("lay-verify",layVerify);
						  conditionValueRightJq.attr("lay-verify",layVerify);
					  }
					  //更新conditionValueJq
					  conditionValueJq.html("");
					  conditionValueJq.append(conditionValueLeftJq);
					  conditionValueJq.append("<span style='margin:auto 3px;'>至</span>");
					  conditionValueJq.append(conditionValueRightJq);
					  //渲染日期控件
					  laydate.render({
						    elem: conditionValueLeftJq[0]
						    ,type: dateType
						  });
					  laydate.render({
						    elem: conditionValueRightJq[0]
						    ,type: dateType
						  });
				  }
				  else{
					  var dateJq = $('<input type="text" name="conditionValue" class="layui-input" placeholder="" />');
					  dateJq.attr("date-type",dateType);
					  if(layVerify){
						  dateJq.attr("lay-verify",layVerify);
					  }
					  conditionValueJq.html("");
					  conditionValueJq.append(dateJq);
					  laydate.render({
						    elem: dateJq[0]
						    ,type: dateType
					  });
				  }
				  
			  }
		  }
    	/**校验表单*/
    	instance.verifyForm = function(){
			var verifySuccess = true;
			var conditionContainerJq = $("#" + instance.conditionContainerId);
		    var verify = form.config.verify
		    ,DANGER = 'layui-form-danger'
		    ,verifyElem = conditionContainerJq.find('*[lay-verify]') //获取需要校验的元素
		    
		    //开始校验
		    for(var i=0;i<verifyElem.length;i++){
		    	var item = verifyElem[i];
		    	var othis = $(item)
			      ,vers = othis.attr('lay-verify').split('|')
			      ,verType = othis.attr('lay-verType') //提示方式
			      ,value = othis.val();
		    	othis.removeClass(DANGER);
		    	var errorText;
		    	//是否允许空值
		    	var allowBlank = true;
		    	layui.each(vers, function(_, thisVer){
			    	if(thisVer.indexOf("required") >= 0){
			    		//不允许为空值
			    		allowBlank = false;
			    	}
		    	})
			    //允许为空值
			    if(allowBlank){
			    	if(value == ""){
			    		//校验通过，如果还有其他的pass，number等也不用校验了。
			    		continue;
			    	}
			    }
		    	//不允许为空值，继续校验
		    	for(var j=0;j<vers.length;j++){
		    		var isTrue=null //是否命中校验
			    	  	,thisVer = vers[j]  //校验name，如：required，pass 等
				        ,errorText = '' //错误提示文本
				        ,isFn = typeof verify[thisVer] === 'function';
		    	  	//匹配验证规则
			        if(verify[thisVer]){
			        	isTrue = isFn ? errorText = verify[thisVer](value, item) : !verify[thisVer][0].test(value);
			        	errorText = errorText || verify[thisVer][1];
			        	//isTrue为true，则验证不通过
			        	if(isTrue){
			        		verifySuccess = false;
			        		//提示
			        		layer.tips(errorText, function(){
				                if(typeof othis.attr('lay-ignore') !== 'string'){
				                  if(item.tagName.toLowerCase() === 'select' || /^checkbox|radio$/.test(item.type)){
				                    return othis.next();
				                  }
				                }
				                return othis;
				              }(), {tips: [1, '#FF0000']});
			        		othis.addClass(DANGER);
			        	 	return verifySuccess;
			        	}
			        }
		    	}
		    }
		    return verifySuccess;
		  }
    	/**根据动态查询条件构造缓存对应的请求条件*/
    	instance.buildCacheCondition = function(){
    		var conditionContainerJq = $("#" + instance.conditionContainerId);
    		var conditionRowJqs = conditionContainerJq.find(".conditionRow");
    		var rowLength = conditionRowJqs.size();
    		//缓存查询条件
    		var cacheCondition = [];
    		for(var i=0;i<rowLength;i++){
    			var conditionRowJq = conditionRowJqs.eq(i);
    			var conditionObj = {};
    			conditionObj.conditionFieldVal = conditionRowJq.find("select[name='conditionField']").val();
    			conditionObj.conditionOptionVal = conditionRowJq.find("select[name='conditionOption']").val();
    			conditionObj.conditionValueVal = conditionRowJq.find("[name='conditionValue']").val();
    			conditionObj.conditionValueLeftVal = conditionRowJq.find("[name='conditionValueLeft']").val();
    			conditionObj.conditionValueRightVal = conditionRowJq.find("[name='conditionValueRight']").val();
    			var item = instance.getObjByField(conditionObj.conditionFieldVal);
    			if(item.edit == "select"){
    				conditionObj.conditionValueHtml = conditionRowJq.find(".conditionValue").html();
    			}
    			cacheCondition.push(conditionObj);
    		}
    		instance.cacheCondition = cacheCondition;
    		instance.buildConditionHtml();
    		return cacheCondition;
    	}
    	/**根据动态查询条件构造对应的请求参数.*/
    	instance.buildRequestData = function(cacheCondition){
    		var cacheCondition = cacheCondition || instance.cacheCondition;
    		var requestData = {};
    		var rowLength = cacheCondition.length;
    		//简单模式
    		if(instance.config.type == "simple"){
    			for(var i=0;i<rowLength;i++){
    				var conditionObj = cacheCondition[i];
    				requestData[conditionObj.conditionFieldVal] = conditionObj.conditionValueVal;
    			}
    			instance.requestData = requestData;
    			return requestData;
    		}
    		//复杂模式
    		requestData.rowLength = rowLength;
    		for(var i=0;i<rowLength;i++){
    			var conditionObj = cacheCondition[i];
    			requestData["QueryCondition["+i+"].conditionField"] = conditionObj.conditionFieldVal;
    			requestData["QueryCondition["+i+"].conditionOption"] = conditionObj.conditionOptionVal;
    			requestData["QueryCondition["+i+"].conditionValue"] = conditionObj.conditionValueVal;
    			requestData["QueryCondition["+i+"].conditionValueLeft"] = conditionObj.conditionValueLeftVal;
    			requestData["QueryCondition["+i+"].conditionValueRight"] = conditionObj.conditionValueRightVal;
    		}
    		//设置请求参数
    		instance.requestData = requestData;
    		return requestData;
    	}
    	/**根据动态查询条件构造对应的显示文本*/
    	instance.buildConditionHtml = function(){
    		var cacheCondition = instance.cacheCondition;
    		var conditionHtml = "";
    		var fieldSelectJq = $(instance.conditionFieldHtml);
    		var optionSelectJq = $(instance.conditionOptionHtml);
    		var blankStr = "&nbsp;&nbsp;";
    		for(var i=0;i<cacheCondition.length;i++){
    			var conditionObj = cacheCondition[i];
    			var fieldText = fieldSelectJq.find("option[value='"+conditionObj.conditionFieldVal+"']").text();
    			var OptionText = optionSelectJq.find("option[value='"+conditionObj.conditionOptionVal+"']").text();
    			var ValueText = conditionObj.conditionValueVal;
    			var ValueLeftText = conditionObj.conditionValueLeftVal;
    			var ValueRightText = conditionObj.conditionValueRightVal;
    			var item = instance.getObjByField(conditionObj.conditionFieldVal);
    			if(item.edit == "select"){
    				var selectHtml;
	  				  if($(item.templet).is("select")){
	  					  selectHtml = $(item.templet).prop("outerHTML");
	  				  }else{
	  					  selectHtml = $(item.templet).html();
	  				  }
	  				var selJq = $(selectHtml);
	  				ValueText = selJq.find("option[value='"+ValueText+"']").text();
	  				ValueLeftText = selJq.find("option[value='"+ValueLeftText+"']").text();
	    			ValueRightText = selJq.find("option[value='"+ValueRightText+"']").text();
    			}
    			var rsValueText="";
    			if(conditionObj.conditionOptionVal == "between"){
    				rsValueText = ValueLeftText + blankStr+"至"+ blankStr + ValueRightText;
				}else{
					rsValueText = ValueText;
				}
    			rsValueText = rsValueText || "";
    			//简单模式
    			var spanJq = $("<span class='layui-xpl-dc-circle' index="+i+"></span>");
    			if(instance.config.type == "simple"){
    				spanJq.html(fieldText + blankStr + ":" + blankStr + rsValueText);
    				//conditionHtml += fieldText + blankStr + ":" + blankStr + rsValueText;
        		}
    			//复杂模式
    			else{
    				spanJq.html(fieldText + blankStr + OptionText + blankStr + rsValueText);
//    				conditionHtml += fieldText + blankStr + OptionText + blankStr + rsValueText;
        		}
    			spanJq.append('<i class="layui-icon layui-icon-close layui-xpl-dc-delete"></i>');
    			conditionHtml += spanJq.prop("outerHTML");
    		}
    		var styleHtml = "<style type='text/css'>";
    		styleHtml += "\n.layui-xpl-dc-circle {border-radius: 90px;display:inline-block;text-align:center;height: 25px;line-height: 25px;background-color:#1E9FFF;color:#fff;margin:0px 5px;padding-top:0px;padding-bottom:0px;padding-left:8px;padding-right:18px;position:relative;}";
    		styleHtml += "\n.layui-xpl-dc-delete{ width:20px;height:20px;line-height: 20px;cursor:pointer;border-radius:60%;position:absolute;top:2px;right:-1px;color:#c2c2c2;}";
    		styleHtml += "\n.layui-xpl-dc-delete:hover{border-radius: 12px;color: #fff;}";
    		styleHtml += "\n</style>";
    		instance.conditionHtml = styleHtml + "<div>查询条件："+ conditionHtml +"</div>";
    		if(instance.config.conditionTextId){
				  $(instance.config.conditionTextId).html(instance.conditionHtml);
				  $(".layui-xpl-dc-delete").on("click",function(){
					  instance.delete(this);
				  })
			  }
    	}
    	/**删除条件*/
    	instance.delete = function(ele){
    		var index = $(ele).parent().attr("index");
    		instance.cacheCondition.splice(index, 1);
    		instance.query();
    	}
    	/**查询*/
    	instance.query = function(){
    		instance.buildConditionHtml();
    		instance.buildRequestData();
			//ajax请求，重载数据
			 if(instance.config.queryCallBack){
				  instance.config.queryCallBack(instance.requestData);
			  }
			  if(instance.config.tableId){
				  //查看是否有排序
				  if(instance.config.sortObj){
					  instance.requestData["sortField"] = sortObj.field; //排序字段
					  instance.requestData["sortOrder"] = sortObj.type; //排序方式
				  }
//				  var curPage = $(".layui-laypage-next").attr("data-page") - 1;
				  table.reload(instance.config.tableId, {
						page: {
						  curr: 1 //重新加载当前页
						}
						,where: instance.requestData
				  });
			  }
    	}
    	/**打开窗口，动态添加查询条件*/
    	instance.open = function(){
    		var conditionContainerHtml = '<div id="'+instance.conditionContainerId+'" class="conditionContainer" lay-filter="conditionContainer"><div ><a href="javascript:void(0);" style="margin-left:10px;" class="addRowBtn"><i class="layui-icon layui-icon-add-circle-fine" style="font-size: 30px; color: &#xe608;"></i> </a> <a href="javascript:void(0);" style="margin-left:10px;" class="queryBtn" ><i class="layui-icon layui-icon-search" style="font-size: 30px; color: &#xe615;"></i> </a> </div><div class="conditionDiv layui-form" lay-filter="conditionDiv"></div></div>';
    		
    		//页面层-自定义
    		instance.openPageIndex = layer.open({ 
    		  type: 1,
    		  id: 'dynamicCondition' + instance.conditionContainerId,//防止重复弹出
    		  offset: '50px',
    		  title: "查询条件",
    		  //closeBtn: 0,
    		  shade: 0, //不显示遮罩
    		  area: [instance.width + 'px', instance.height +'px'], //宽高
    		  content: conditionContainerHtml
    		});
    		instance.render();
    		var conditionContainerJq = $("#"+instance.conditionContainerId);
    		conditionContainerJq.css("margin","10px");
    		  //监听事件
    		  form.on('select(conditionField)', function(data){
    			  var conditionRowJq = $(data.elem).parents(".conditionRow");
    			  instance.updateConditionValue(conditionRowJq);
    			});    
    		  form.on('select(conditionOption)', function(data){
    			  var conditionRowJq = $(data.elem).parents(".conditionRow");
    			  instance.updateConditionValue(conditionRowJq);
    			});
    		  //新增
    		  conditionContainerJq.find(".addRowBtn").on("click",function(){
    			  instance.addRow();
    		  });
    		  var verify = form.config.verify
    		  //查询
    		  conditionContainerJq.find(".queryBtn").on("click",function(){
    			  if(instance.verifyForm(conditionContainerJq)){
//    				  layer.msg('校验通过');
    				  instance.buildCacheCondition();
    				  instance.query();
    				  layer.close(instance.openPageIndex); 
    			  }else{
//    				  layer.msg('校验失败');
    			  }
    		  });
    	}
    	/**渲染弹出界面*/
    	instance.render = function(){
    		var cacheCondition = instance.cacheCondition;
    		for(var i=0;i<cacheCondition.length;i++){
    			var conditionObj = cacheCondition[i]; 
    			var conditionRowJq = instance.addRow();
    			conditionRowJq.find("select[name='conditionField']").val(conditionObj.conditionFieldVal);
    			conditionRowJq.find("select[name='conditionOption']").val(conditionObj.conditionOptionVal);
    			instance.updateConditionValue(conditionRowJq);
    			if(conditionRowJq.find("[name='conditionValue']").size()>0){
    				conditionRowJq.find("[name='conditionValue']").val(conditionObj.conditionValueVal);
    			}
    			if(conditionRowJq.find("[name='conditionValueLeft']").size()>0){
    				conditionRowJq.find("[name='conditionValueLeft']").val(conditionObj.conditionValueLeftVal);
    			}
    			if(conditionRowJq.find("[name='conditionValueRight']").size()>0){
    				conditionRowJq.find("[name='conditionValueRight']").val(conditionObj.conditionValueRightVal);
    			}
    		}
    		form.render(null, 'conditionDiv');
    	}
        return instance;
    }
    var dynamicCondition = {
    	version:'1.0.5'
    	//缓存创建的实例
    	,cacheInstance:{}
    	/***
    	 * 获取实例
    	 * instanceName:实例名称。非必须。默认为'instanceName'.当一个页面只创建一个实例时，可以不用该参数
    	 */
    	,getInstance:function(instanceName){
    		instanceName = instanceName || 'instanceName';
    		return this.cacheInstance[instanceName];
    	}
		/***
		 * elem/fields/fieldsJsonStr：三选一.
		 * tableId/queryCallBack: 二选一。tableId对应table.render(config)的config.id参数.自动重载表格。queryCallBack(requestData)则自定义回调
		 * type: 取值：'simple'/'complex'.默认为复杂模式。区别1.显示界面不一样，2.构造的requestData格式不一样。
		 * conditionTextId: 显示查询条件的面板选择器或DOM。非必须。例子："#frm"
		 * sortObj:排序。非必须。例子：{field:'name',type:'desc'}
		 * instanceName: 创建的实例名称。非必须。默认为'instanceName'。当一个页面只创建一个实例时，可以不用该参数
		 */
    	,create:function(config){
    		config.type = config.type || 'complex';
    		config.instanceName = config.instanceName || 'instanceName';
    		var instance = createInstance(config);
    		//初始化instance.data
    		if(config.fields){
    			instance.data = config.fields;
    		}
    		else if(config.fieldsJsonStr){ 
    			instance.data = $.parseJSON(config.fieldsJsonStr);
    		}
    		else if(config.elem){ //指定容器的选择器或 DOM，方法渲染方式必填.示例"#dcDemo"，或者DOM
    			var liObjs = $(config.elem).find("li");
				liObjs.each(function(){
					var item = {
							field: $(this).attr("field") 
							,title:$(this).attr("title")
							,edit: $(this).attr("edit") 
							,templet: $(this).attr("templet")
							,layVerify: $(this).attr("layVerify")
							,show: $(this).attr("show")
						};
					instance.data.push(item);
				})
    		}
    		//设定默认值
    		for(var i = 0;i<instance.data.length;i++){
    			var item = instance.data[i];
    			item.edit = item.edit || "text";
    		}
    		//字段 下拉框html
    		var selectConditionField = $('<select name="conditionField" lay-filter="conditionField"></select>');
			  var items = instance.data;
			  for(var i=0;i< items.length;i++){
				  if(items[i].show != "false"){
					  selectConditionField.append("<option value='"+items[i].field+"'>"+items[i].title+"</option>");
				  }
			  }
    		instance.conditionFieldHtml = selectConditionField.prop("outerHTML");
    		//操作 下拉框html
    		var selectconditionOption = $('<select name="conditionOption" lay-filter="conditionOption"></select>');
    		selectconditionOption.append("<option value='equal'>等于</option>");
    		selectconditionOption.append("<option value='like'>包含</option>");
    		selectconditionOption.append("<option value='between'>范围</option>");
    		selectconditionOption.append("<option value='start'>开头字符</option>");
    		selectconditionOption.append("<option value='end'>结尾字符</option>");
    		selectconditionOption.append("<option value='unequal'>不等于</option>");
    		selectconditionOption.append("<option value='empty'>为空</option>");
    		instance.conditionOptionHtml = selectconditionOption.prop("outerHTML");
    		//缓存实例
    		this.cacheInstance[config.instanceName] = instance;
    		return instance;
    	}
    };

    exports(MOD_NAME, dynamicCondition);
})