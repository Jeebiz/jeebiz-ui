
layui.define(['admin', 'form', 'base64'], function (exports) {

    var $ = layui.$, setter = layui.setter, admin = layui.admin, base64 = layui.base64,
        form = layui.form, router = layui.router(), search = router.search;

    console.log(base64.encode("123456"));

    // 自定义验证
    form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!$.founded(value)) {
                return '用户名不能为空';
            }
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        },
        //我们既支持上述函数式的方式，也支持下述数组的形式
        address: [
            /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/,
            '请输入正确的地址链接，如：https://www.jd.com/'
        ],
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        passwd: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!$.founded(value)) {
                return '密码不能为空';
            }
        }
    });

    form.render();

    //提交
    form.on('submit(LAY-user-login-submit)', function (obj) {
        //请求登入接口
        admin.req({
            url     : layui.setter.prefix + '/authz/login/stateless', //实际使用请改成服务端真实接口
            data    : obj.field,
            type    : 'POST',
            success : function (res) {
                if(res.status == 'success'){
                    // 请求成功后，写入 access_token
                    layui.data(setter.tableName, {
                        key: setter.storage.tokenName,
                        value: res.token
                    });
                    layui.data(setter.tableName, {
                        key: setter.storage.profileName,
                        value: res.profile || {}
                    });
                    layui.data(setter.tableName, {
                        key: setter.storage.roleName,
                        value: res.role || 'guest'
                    });
                    layui.data(setter.tableName, {
                        key: setter.storage.rolesName,
                        value: res.roles || []
                    });
                    layui.data(setter.tableName, {
                        key: setter.storage.permsName,
                        value: res.perms || []
                    });
                    layui.data(setter.perrmsName, {
                        key: setter.storage.profileName,
                        value: res.perrms || []
                    });
                    // 登入成功的提示与跳转
                    layer.msg('登入成功', {
                        offset: '15px',
                        icon: 1,
                        time: 1000
                    }, function () {
                        location.hash = search.redirect ? decodeURIComponent(search.redirect) : '/';
                    });
                } else {
                    layer.msg(res["message"] || "", {
                        icon: 2
                    });
                }
            },
            error: function (e, code) {

            }
        });

    });

    //回车键触发提交
    $("input").keydown(function (event) {
        if (event.keyCode == 13) {
            document.getElementById("LAY-user-login-submit").click();
        }
    })

    //实际使用时记得删除该代码
    /* layer.msg('为了方便演示，用户名密码可随意输入', {
      offset: '15px',
      icon: 1
    }); */

    exports('user/login', {})

});