layui.extend({setter:"config",admin:"lib/admin",view:"lib/view",utils:"lib/utils"}).define(["setter","admin","utils"],function(e){function a(e){var n,a=layui.router(),i=u(l.container),t=r.correctRouter(a.path.join("/"));if(layui.each(l.indPage,function(e,a){if(t===a)return n=!0}),layui.config({base:l.base+"controller/"}),n||"/user/login"===t)i.render(a.path.join("/")).done(function(){r.pageType="alone"});else{if(l.interceptor){a=layui.data(l.tableName);if(console.log(a),!a[l.storage.tokenName])return location.hash="/user/login/redirect="+encodeURIComponent(t)}"console"===r.pageType?d():i.render("layout").done(function(){d(),layui.element.render(),r.screen()<2&&r.sideFlexible(),r.pageType="console"})}}var l=layui.setter,o=layui.element,r=layui.admin,s=r.tabsPage,u=layui.view,d=function(){var i=layui.router(),e=i.path,t=r.correctRouter(i.path.join("/"));""===(e=!e.length?[""]:e)[e.length-1]&&(e[e.length-1]=l.entry);function a(e){d.haveInit&&h(".layui-layer").each(function(){var e=h(this),a=e.attr("times");e.hasClass("layui-layim")||layer.close(a)}),d.haveInit=!0,h(c).scrollTop(0),delete s.type}if("tab"===s.type&&("/"!==t||"/"===t&&r.tabsBody().html()))return r.tabsBodyChange(s.index),a(s.type);u().render(e.join("/")).then(function(e){var a,n=h("#LAY_app_tabsheader>li");n.each(function(e){h(this).attr("lay-id")===t&&(a=!0,s.index=e)}),l.pageTabs&&"/"!==t&&(a||(h(c).append('<div class="layadmin-tabsbody-item layui-show"></div>'),s.index=n.length,o.tabAdd(y,{title:"<span>"+(e.title||"\u65b0\u6807\u7b7e\u9875")+"</span>",id:t,attr:i.href}))),this.container=r.tabsBody(s.index),l.pageTabs||this.container.scrollTop(0),o.tabChange(y,t),r.tabsBodyChange(s.index)}).done(function(){layui.use("common","controller/common"),n.on("resize",layui.data.resize),o.render("breadcrumb","breadcrumb"),r.tabsBody(s.index).on("scroll",function(){var e=h(this),a=h(".layui-laydate"),n=h(".layui-layer")[0];a[0]&&(a.each(function(){var e=h(this);e.hasClass("layui-laydate-static")||e.remove()}),e.find("input").blur()),n&&layer.closeAll("tips")})}),a()},c="#LAY_app_body",y="layadmin-layout-tabs",h=layui.$,n=h(window);layui.link(l.base+"style/admin.css?v="+r.v+"-1",function(){a()},"layuiAdmin"),window.onhashchange=function(){a(),layui.event.call(this,l.MOD_NAME,"hash({*})",layui.router())},layui.each(l.extend,function(e,a){var n={},i=a.split("/");n[i[0<i.legnth?i.lenght-1:0]]="{/}"+l.base+"lib/extend/"+a,layui.extend(n)}),e("index",{render:d})});