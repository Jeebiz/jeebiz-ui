layui.define(function(e){layui.use(["admin","carousel"],function(){var t=layui.$,a=(layui.admin,layui.carousel),e=layui.element,i=layui.device();t(".layadmin-carousel").each(function(){var e=t(this);a.render({elem:this,width:"100%",arrow:"none",interval:e.data("interval"),autoplay:!0===e.data("autoplay"),trigger:i.ios||i.android?"click":"hover",anim:e.data("anim")})}),e.render("progress")}),layui.use(["admin","carousel","echarts"],function(){function t(e){r[e]=n.init(d[e],layui.echartsTheme),r[e].setOption(o[e]),i.resize(function(){r[e].resize()})}var a,e=layui.$,i=layui.admin,l=layui.carousel,n=layui.echarts,r=[],o=[{title:{text:"\u4eca\u65e5\u6d41\u91cf\u8d8b\u52bf",x:"center",textStyle:{fontSize:14}},tooltip:{trigger:"axis"},legend:{data:["",""]},xAxis:[{type:"category",boundaryGap:!1,data:["06:00","06:30","07:00","07:30","08:00","08:30","09:00","09:30","10:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30"]}],yAxis:[{type:"value"}],series:[{name:"PV",type:"line",smooth:!0,itemStyle:{normal:{areaStyle:{type:"default"}}},data:[111,222,333,444,555,666,3333,33333,55555,66666,33333,3333,6666,11888,26666,38888,56666,42222,39999,28888,17777,9666,6555,5555,3333,2222,3111,6999,5888,2777,1666,999,888,777]},{name:"UV",type:"line",smooth:!0,itemStyle:{normal:{areaStyle:{type:"default"}}},data:[11,22,33,44,55,66,333,3333,5555,12666,3333,333,666,1188,2666,3888,6666,4222,3999,2888,1777,966,655,555,333,222,311,699,588,277,166,99,88,77]}]},{title:{text:"\u8bbf\u5ba2\u6d4f\u89c8\u5668\u5206\u5e03",x:"center",textStyle:{fontSize:14}},tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{orient:"vertical",x:"left",data:["Chrome","Firefox","IE 8.0","Safari","\u5176\u5b83\u6d4f\u89c8\u5668"]},series:[{name:"\u8bbf\u95ee\u6765\u6e90",type:"pie",radius:"55%",center:["50%","50%"],data:[{value:9052,name:"Chrome"},{value:1610,name:"Firefox"},{value:3200,name:"IE 8.0"},{value:535,name:"Safari"},{value:1700,name:"\u5176\u5b83\u6d4f\u89c8\u5668"}]}]},{title:{text:"\u6700\u8fd1\u4e00\u5468\u65b0\u589e\u7684\u7528\u6237\u91cf",x:"center",textStyle:{fontSize:14}},tooltip:{trigger:"axis",formatter:"{b}<br>\u65b0\u589e\u7528\u6237\uff1a{c}"},xAxis:[{type:"category",data:["11-07","11-08","11-09","11-10","11-11","11-12","11-13"]}],yAxis:[{type:"value"}],series:[{type:"line",data:[200,300,400,610,150,270,380]}]},{title:{subtext:"\u5b8c\u5168\u5b9e\u51b5\u7403\u5458\u6570\u636e",textStyle:{fontSize:14}},tooltip:{trigger:"axis"},legend:{x:"left",data:["\u7f57\u7eb3\u5c14\u591a","\u820d\u666e\u7434\u79d1"]},polar:[{indicator:[{text:"\u542c\u529b\u7406\u89e3",max:100},{text:"\u9605\u8bfb\u7406\u89e3",max:100},{text:"\u4e66\u9762\u8868\u8fbe",max:100},{text:"\u53e3\u8bed\u6d4b\u8bd5",max:100}],radius:130}],series:[{type:"radar",center:["50%","50%"],itemStyle:{normal:{areaStyle:{type:"default"}}},data:[{value:[97,42,88,94,90,86],name:"\u820d\u666e\u7434\u79d1"},{value:[97,32,74,95,88,92],name:"\u7f57\u7eb3\u5c14\u591a"}]}]}],d=e("#LAY-index-dataview").children("div");d[0]&&(t(0),a=0,l.on("change(LAY-index-dataview)",function(e){t(a=e.index)}),layui.admin.on("side",function(){setTimeout(function(){t(a)},300)}),layui.admin.on("hash(tab)",function(){layui.router().path.join("")||t(a)}))}),layui.use("table",function(){layui.$;var e=layui.table;e.render({elem:"#LAY-index-topSearch",url:layui.setter.base+"json/console/top-search.js",page:!0,cols:[[{type:"numbers",fixed:"left"},{field:"keywords",title:"\u7ea7\u522b",minWidth:300,templet:'<div><a href="https://www.baidu.com/s?wd={{ d.keywords }}" target="_blank" class="layui-table-link">{{ d.keywords }}</div>'},{field:"frequency",title:"\u8bd5\u5377",minWidth:120,sort:!0},{field:"userNums",title:"\u7528\u6237\u6570",sort:!0}]],skin:"line"}),e.render({elem:"#LAY-index-topCard",url:layui.setter.base+"json/console/top-card.js",page:!0,cellMinWidth:120,cols:[[{type:"numbers",fixed:"left"},{field:"channel",title:"\u7c7b\u522b"},{field:"title",title:"\u9898\u5e72",minWidth:300,templet:'<div><a href="{{ d.href }}" target="_blank" class="layui-table-link">{{ d.title }}</div>'},{field:"username",title:"\u95ee\u9898"},{field:"crt",title:"\u9519\u8bef\u7387",sort:!0}]],skin:"line"})}),e("console",{})});