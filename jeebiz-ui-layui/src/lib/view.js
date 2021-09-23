
/*!
 * 界面视图模块
 */

layui.define(['laytpl', 'layer'], function (exports) {
  var $ = layui.jquery,
    laytpl = layui.laytpl,
    layer = layui.layer,
    setter = layui.setter,
    device = layui.device(),
    hint = layui.hint(),

    //对外接口
    view = function (id) {
      return new Class(id);
    },

    SHOW = 'layui-show',
    LAY_BODY = 'LAY_app_body',

    //构造器

    Class = function (id) {
      this.id = id;
      this.container = $('#' + (id || LAY_BODY));
    };

  //加载中
  view.loading = function (elem) {
    elem.append(
      this.elemLoad = $('<i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon layui-icon-loading layadmin-loading"></i>')
    );
  };

  //移除加载
  view.removeLoad = function () {
    this.elemLoad && this.elemLoad.remove();
  };

  //清除 token，并跳转到登入页
  view.exit = function () {
    //清空本地记录的 token
    layui.data(setter.tableName, {
      key: setter.storage.tokenName,
      remove: true
    });
    //跳转到登入页
    location.hash = '/user/login';
  };

  //Ajax请求
  view.req = function (options) {
    var that = this,
      success = options.success,
      error = options.error,
      storage = setter.storage,
      request = setter.request,
      response = setter.response,
      debug = function () {
        return setter.debug ?
          '<br><cite>URL：</cite>' + options.url :
          '';
      };

    options.data = options.data || {};
    options.headers = options.headers || {};
    if (request.tokenName) {
      var sendData = typeof options.data === 'string' ?
        JSON.parse(options.data) :
        options.data;

      //自动给参数传入默认 token
      options.data[storage.tokenName] = storage.tokenName in sendData ?
        options.data[storage.tokenName] :
        (layui.data(setter.tableName)[storage.tokenName] || '');

     }
    if(request.headerName){
    	// 自动给 Request Headers 传入 token
    	options.headers[storage.headerName] = storage.headerName in options.headers ?  options.headers[storage.headerName] : (layui.data(setter.tableName)[storage.tokenName] || '');
    }
    if(request.language){
    	// 自动给 Request Headers 传入 token
    	options.headers[storage.language] = storage.language in options.headers ?  options.headers[storage.language] : (layui.data(setter.tableName)[storage.language] || 'zh_CN');
    }

    delete options.success;
    delete options.error;

    return $.ajax($.extend({
      type			: 'get',
      dataType	: 'json',
      success		: function (res) {
        var statusCode = response.statusCode;
        // 只有 response 的 code 一切正常才执行 done
        if (options.done && (res[response.statusName] == 0 || res[response.statusName] == statusCode.ok)) {
          typeof options.done === 'function' && options.done(res);
        }
        // 登录状态失效，清除本地 access_token，并强制跳转到登入页
        else if (res[response.statusName] == statusCode.logout) {
          view.exit();
        }
        // 其它异常
        else {
          // 数据异常处理 : 全局提示
          var code = res[response.statusName];
          if (statusCode.status[code]) {
            var message = res[response.msgName] || statusCode.status[code];
            console.log(message, code)
            layer.msg(message, {
              icon: 2,
              time: 3000 //2秒关闭（如果不配置，默认是3秒）
            });
            return;
          }
          // 自动退出处理 : Token过期等处理
          else if (statusCode.authz[code]) {
            var message = res[response.msgName] || statusCode.authz[code];
            console.log(message, code)
            layer.msg(message, {
              icon: 2,
              time: 3000 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
              view.exit();
            });
            return;
          } else if (setter.debug && res[response.statusName] != statusCode.ok ) {
            var error = [
              '<cite>Error：</cite> ' + (res[response.msgName] || '返回状态码异常'), debug()
            ].join('');
            view.error(error);
          }
        }
        // 只要 http 状态码正常，无论 response 的 code 是否正常都执行 success
        typeof success === 'function' && success(res);
      },
      error		: function (jqXHR, textStatus, errorThrown) {
 		if (setter.debug) {
          console.log(jqXHR.responseText);
        }
        var res = jqXHR.responseJSON || {};
        var code = res.code;
        if (setter.debug) {
          console.log(res);
        }

        var statusCode = response.statusCode;
        // 数据异常处理 : 全局提示
        if (statusCode.status[code]) {
          var message = res[response.msgName] || statusCode.status[code];
          console.log(message, code)
          layer.msg(message, {
            icon: 2,
            time: 3000 //2秒关闭（如果不配置，默认是3秒）
          });
          return;
        }
        // 自动退出处理 : Token过期等处理
        else if (statusCode.authz[code]) {
          var message = res[response.msgName] || statusCode.authz[code];
          console.log(message, code)
          layer.msg(message, {
            icon: 2,
            time: 3000 //2秒关闭（如果不配置，默认是3秒）
          }, function () {
            view.exit();
          });
          return;
        } else if (setter.debug) {
          var error = [
            '请求异常，请重试<br><cite>错误信息：</cite>', jqXHR.status, statusCode.http[jqXHR.status], debug()
          ].join('');
          view.error(error);
        }

        typeof error === 'function' && error.apply(this, arguments);
      }
    }, options));
  };

  //弹窗
  view.popup = function (options) {
    var success = options.success,
      skin = options.skin;

    delete options.success;
    delete options.skin;

    return layer.open($.extend({
      type: 1,
      title: '提示',
      content: '',
      id: 'LAY-system-view-popup',
      skin: 'layui-layer-admin' + (skin ? ' ' + skin : ''),
      shadeClose: true,
      closeBtn: false,
      success: function (layero, index) {
        var elemClose = $('<i class="layui-icon" close>&#x1006;</i>');
        layero.append(elemClose);
        elemClose.on('click', function () {
          layer.close(index);
        });
        typeof success === 'function' && success.apply(this, arguments);
      }
    }, options))
  };

  //异常提示
  view.error = function (content, options) {
    return view.popup($.extend({
      content: content,
      maxWidth: 300
        //,shade: 0.01
        ,
      offset: 't',
      anim: 6,
      id: 'LAY_adminError'
    }, options))
  };

  //请求模板文件渲染
  Class.prototype.render = function (views, params) {
    var that = this,
      router = layui.router();
    views = setter.views + views + setter.engine;

    $('#' + LAY_BODY).children('.layadmin-loading').remove();
    view.loading(that.container); //loading

    //请求模板
    $.ajax({
      url: views,
      type: 'get',
      dataType: 'html',
      data: {
        v: layui.cache.version
      },
      success: function (html) {
        html = '<div>' + html + '</div>';

        var elemTitle = $(html).find('title'),
          title = elemTitle.text() || (html.match(/\<title\>([\s\S]*)\<\/title>/) || [])[1];

        var res = {
          title: title,
          body: html
        };

        elemTitle.remove();
        that.params = params || {}; //获取参数

        if (that.then) {
          that.then(res);
          delete that.then;
        }

        that.parse(html);
        view.removeLoad();

        if (that.done) {
          that.done(res);
          delete that.done;
        }

      },
      error: function (e) {
        view.removeLoad();

        if (that.render.isError) {
          return view.error('请求视图文件异常，状态：' + e.status);
        };

        if (e.status === 404) {
          that.render('template/tips/404');
        } else {
          that.render('template/tips/error');
        }

        that.render.isError = true;
      }
    });
    return that;
  };

  //解析模板
  Class.prototype.parse = function (html, refresh, callback) {
    var that = this,
      isScriptTpl = typeof html === 'object' //是否模板元素
      ,
      elem = isScriptTpl ? html : $(html),
      elemTemp = isScriptTpl ? html : elem.find('*[template]'),
      fn = function (options) {
        var tpl = laytpl(options.dataElem.html()),
          res = $.extend({
            params: router.params
          }, options.res);

        options.dataElem.after(tpl.render(res));
        typeof callback === 'function' && callback();

        try {
          options.done && new Function('d', options.done)(res);
        } catch (e) {
          console.error(options.dataElem[0], '\n存在错误回调脚本\n\n', e)
        }
      },
      router = layui.router();

    elem.find('title').remove();
    that.container[refresh ? 'after' : 'html'](elem.children());

    router.params = that.params || {};

    //遍历模板区块
    for (var i = elemTemp.length; i > 0; i--) {
      (function () {
        var dataElem = elemTemp.eq(i - 1),
          layDone = dataElem.attr('lay-done') || dataElem.attr('lay-then') //获取回调
          ,
          setKey = dataElem.attr('lay-setkey')  //获取结果存储key
          ,
          url = laytpl(dataElem.attr('lay-url') || '').render(router) //接口 url
          ,
          data = laytpl(dataElem.attr('lay-data') || '').render(router) //接口参数
          ,
          headers = laytpl(dataElem.attr('lay-headers') || '').render(router); //接口请求的头信息

        try {
          data = new Function('return ' + data + ';')();
        } catch (e) {
          hint.error('lay-data: ' + e.message);
          data = {};
        };

        try {
          headers = new Function('return ' + headers + ';')();
        } catch (e) {
          hint.error('lay-headers: ' + e.message);
          headers = headers || {}
        };

        if (url) {
          view.req({
            type: dataElem.attr('lay-type') || 'get',
            url: url,
            data: data,
            dataType: 'json',
            headers: headers,
            success: function (res) {
              if(setKey){
                layui.data(setter.tableName, {
                  key: setKey,
                  value: res.data || []
                });
              }
              fn({
                dataElem: dataElem,
                res: res,
                done: layDone
              });
            }
          });
        } else {
          fn({
            dataElem: dataElem,
            done: layDone
          });
        }
      }());
    }

    return that;
  };

  //直接渲染字符
  Class.prototype.send = function (views, data) {
    var tpl = laytpl(views || this.container.html()).render(data || {});
    this.container.html(tpl);
    return this;
  };

  //局部刷新模板
  Class.prototype.refresh = function (callback) {
    var that = this,
      next = that.container.next(),
      templateid = next.attr('lay-templateid');

    if (that.id != templateid) return that;

    that.parse(that.container, 'refresh', function () {
      that.container.siblings('[lay-templateid="' + that.id + '"]:last').remove();
      typeof callback === 'function' && callback();
    });

    return that;
  };

  //视图请求成功后的回调
  Class.prototype.then = function (callback) {
    this.then = callback;
    return this;
  };

  //视图渲染完毕后的回调
  Class.prototype.done = function (callback) {
    this.done = callback;
    return this;
  };

  //对外接口
  exports('view', view);
});
