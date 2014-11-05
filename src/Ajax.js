/**
 * Created by will.jiang on 14-10-27.
 * 纯js实现Ajax
 * javascript搞基程序设计
 */
/*
 * @author will.jiang
 * 日期 2014 10 27 下午3:11
 * 功能描述
 * @param cfg{
 * url:"xxxx"//请求的地址
 * method:['post','get']//请求的方式。默认不填写就为get方式
 * date:[string，object]//可选参数。设置请求的参赛。可以为string类型或对象。语法为 name=value&name2=value2.也可以为
 * js对象如{key:value}
 * onRequest:fn //发送请求时的触发方法
 * onSuccess:fn //请求成功后。服务器返回信息的调用方法。需要设置参赛来接受服务器消息。参赛类型为string
 * onFailure：fn//请求失败的回调方法
 * onTimeout:fn //超时的回调方法
 * timer: int //超时的时间。毫秒值！默认我i
 * }
 * @return {num} 返回值说明
 * */
(function (win) {
    //空方法
    $temp = function () {
    };
    win.$Ajax = function (config) {
        this.xhr = this.createXHR();
        var cfg = config || {};
        this.method = (cfg.method || 'GET').toUpperCase();
        this.onRequest = typeof cfg.onRequest === 'function' ? cfg.onRequest : $temp;
        this.callback = typeof cfg.onSuccess === 'function' ? cfg.onSuccess : $temp;
        this.onFailure = typeof  cfg.onFailure === 'function' ? cfg.onFailure : $temp;
        this.onTimeout = typeof  cfg.onTimeout === 'function' ? cfg.onTimeout : $temp;
        if (typeof cfg.url == "string" && cfg.url.length > 0) {
            this.url = cfg.url;
        } else {
            this.showError("Ajax请求地址有误");
        }
        //请求的参数
        this.date = cfg.date;
        //为post提交设置的数据对象
        this.postDate = null;
        //超时计时器
        this.timer = null;
        //20S超时
        this.timeout = 20000;
        //是否是异步请求
        this.async = cfg.async || true;
    };
//扩充原型链
    $Ajax.prototype = {
        showError: function (msg) {
            throw new Error(msg);
        },
        createXHR: function () {
            //原生支持XHR对象
            if (typeof XMLHttpRequest != 'undefined') {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject != "undefined") {
                if (typeof  arguments.callee.activeXString != "string") {
                    var versions = ['MSXML2.XMLHTTP.3.0', 'Msxml2.XMLHTTP.6.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'],
                        i, max;
                    for (i = 0, max = versions.length; i < len; i++) {
                        try {
                            new ActiveXObject(versions[i]);
                            arguments.callee.activeXString = versions[i];
                            break;
                        } catch (e) {

                        }
                    }
                    return new ActiveXObject(arguments.callee.activeXString);

                } else {
                    this.showError("不支持 XHR");
                }
            }
        },
        /*
         * @author will.jiang
         * 日期 2014 10 27 下午6:23
         * 功能描述 对url添加对象值。
         * @param {num} 参数1说明
         * @return {String} 返回拼合好的url。
         * encodeURIComponent： 把;/?:@&=+$,# 这些用于分隔 URI 组件的标点符号。转义
         * */
        addURLParam: function (url, key, value) {
            url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(value);
            return url;
        },
        /*
         * @author will.jiang
         * 日期 2014 10 28 上午9:15
         * 功能描述 对请求参数重新格式化
         * @param 需要格式的数据
         * @return {num} 返回值说明
         * */
        setDate: function (d) {
            /*
             * 数据只支持 String类型如 ‘name=will&age=23’
             * 或 object类型   {'name':'will','age':'23'}
             * */
            var url = "";
            switch (typeof d) {
                case 'string':
                    if (d.length > 0 && d.indexOf('&') != 0) {
                        //表明开头是省略连接符号的。需要手动补全一下
                        d = "&" + d;
                    }
                    url += d;
                    break;
                case 'object':
                    for (var k in d) {
                        url = this.addURLParam(url, k, d[k]);
                    }
                    break;
                default :
                    //其他情况不进行处理
                    break;
            }
            return url;
        },
        /*
         * @author will.jiang
         * 日期 2014 10 29 下午5:02
         * 功能描述 取消请求
         * @param {num} 参数1说明
         * @return {num} 返回值说明
         * */
        cancel: function () {
            //清除timeout
            clearTimeout(this.timer);
            if (this.xhr) {
                this.xhr.abort();
            }
        },
        /*
         * @author will.jiang
         * 日期 2014 10 27 下午6:24
         * 功能描述 发送ajax请求
         * @param date  可以传入新的请求参数
         * @return {num} 返回值说明
         * */
        send: function (date) {
            var self = this;
            var XHR = this.xhr;
            //20s超时
            this.timer = setTimeout(function () {
                XHR.abort();
                self.onTimeout();
            }, this.timeout);


            //注册事件】
            XHR.onreadystatechange = function () {
                if (XHR.readyState == 4) {
                    if ((XHR.status >= 200 && XHR.status < 300) || XHR.status == 304) {
                        //success
                        //XHR.responseText
                        clearTimeout(t);
                        self.cb(XHR.responseText);
                    } else {
                        //exception
                        //请求出错
                        self.onFailure();
                        clearTimeout(self.timer);
                    }
                }
            };
            /*
            * onprogress 加载百分比
            * */

            var url = this.url;
            var p = "";
            switch (this.method) {
                case 'GET':
                    //GET请求时参数是通过url中设置的
                    var $d = this.setDate(this.date);
                    if (date) {
                        //如果还有额外的数据。需要添加到请求的参数列表中
                        $d += this.setDate(date);
                    }
                    //拼接完成所有的内容后。默认数据格式会 &name=ss&age=123....,需要处理下开头的数据
                    if (url.indexOf('?') == -1 && $d.length > 0) {
                        url += "?" + $d.substr(1);
                    } else {
                        //已经有？号了就直接加上数据
                        url += $d;
                    }
                    break;
                case 'POST':
                    //POST请求时需要把参赛设置到XHR.send方法参数中。
                    p = this.setDate(this.date);
                    if (date) {
                        //如果还有额外的数据。需要添加到请求的参数列表中
                        p += this.setDate(date);
                    }
                    //清除掉开头的&字连接符
                    if (p.indexOf('&') == 0) {
                        p = p.substr(1);
                    }

                    break;
            }

            XHR.open(this.method, url, this.async);
            if (this.method == 'POST') {
                XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            }
            //发送请求前。进行onRequest事件
            this.onRequest();
            XHR.send(p);
        }
    };
}(window));



