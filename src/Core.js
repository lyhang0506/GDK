/**
 * Created by will.jiang on 14-10-20.
 * GDK类工厂、命名空间、常用方法等
 * 文件不设置匿名自执行函数
 */
var G = {
    version: 0.1,
    date: '2014/4/20',
    check: {},//检查的方法类
    tools: {},//工具类 
    locale: {},//国际化
    audio: null//声音管理类
};
//空方法
var $empty = function () {
};
//类工厂
(function () {
    // 当前是否处于创建类的阶段
    var initializing = false;
    JClass = function () {
    };
    JClass.extend = function (prop) {
        // 如果调用当前函数的对象（这里是函数）不是Class，则是父类
        var baseClass = null;
        if (this !== JClass) {
            baseClass = this;
        }
        // 本次调用所创建的类（构造函数）
        function F() {
            // 如果当前处于实例化类的阶段，则调用init原型函数
            if (!initializing) {
                // 如果父类存在，则实例对象的baseprototype指向父类的原型
                // 这就提供了在实例对象中调用父类方法的途径
                if (baseClass) {
                    this._superprototype = baseClass.prototype;
                }
                this.init.apply(this, arguments);
            }
        }

        // 如果此类需要从其它类扩展
        if (baseClass) {
            initializing = true;
            F.prototype = new baseClass();
            F.prototype.constructor = F;
            initializing = false;
        }
        // 新创建的类自动附加extend函数
        F.extend = arguments.callee;

        // 覆盖父类的同名函数
        for (var name in prop) {
            if (prop.hasOwnProperty(name)) {
                // 如果此类继承自父类baseClass并且父类原型中存在同名函数name
                if (baseClass &&
                    typeof (prop[name]) === "function" &&
                    typeof (F.prototype[name]) === "function" &&
                    /\b_super\b/.test(prop[name])) {
                    // 重定义函数name -
                    // 首先在函数上下文设置this._super指向父类原型中的同名函数
                    // 然后调用函数prop[name]，返回函数结果
                    // 注意：这里的自执行函数创建了一个上下文，这个上下文返回另一个函数，
                    // 此函数中可以应用此上下文中的变量，这就是闭包（Closure）。
                    // 这是JavaScript框架开发中常用的技巧。
                    F.prototype[name] = (function (name, fn) {
                        return function () {
                            this._super = baseClass.prototype[name];
                            return fn.apply(this, arguments);
                        };
                    })(name, prop[name]);
                } else {
                    F.prototype[name] = prop[name];
                }
            }
        }
        return F;
    };
})();

// 经过改造的Class
/*var Person = JClass.extend({
 init: function (name, addr) {
 this.name = name;
 this.addr = addr;
 },
 getName: function (prefix) {
 return prefix + this.name;
 }
 });


 var Employee = Person.extend({
 init: function (name, employeeID, addr) {
 //  调用父类的方法
 this._super(name, addr);
 this.employeeID = employeeID;
 },
 getEmployeeIDName: function () {
 // 注意：我们还可以通过这种方式调用父类中的其他函数
 var name = this._superprototype.getName.call(this, "Employee name: ");
 return name + ", Employee ID: " + this.employeeID;
 },
 getName: function () {
 //  调用父类的getName方法
 return this._super("Employee name: ");
 },
 getAddr: function () {
 return this.addr;
 }
 });*/

/*
 * 继承的实现
 * */
function extend(child, parent) {
    var F = function () {
    };
    F.prototype = parent.prototype;
    child.prototype = new F();
    //构造函数的指向修正
    child.prototype.constructor = child;
}
/*
 * @author will.jiang
 * 日期 14-6-5 下午5:49
 * 功能描述 深度拷贝
 * @param p{obj} 被拷贝的父类
 * @param c{obj} 扩充的子类
 * @return {num} 拷贝后的子类
 * */
function deepCopy(p, c) {
    var c = c || {};
    for (var i in p) {
        if (typeof p[i] === "object") {
            c[i] = (p[i].constructor == Array) ? [] : {};
            deepCopy(p[i], c[i]);
        } else {
            c[i] = p[i];
        }
    }
    return c
}
G.deepCopy = deepCopy;
//扩展foreach&filter
if (typeof Array.prototype.forEach == "undefined") {
    Array.prototype.forEach = function (fn) {
        for (var i = 0; i < this.length; i++) {
            fn(this[i], i);
        }
    }
}
/*
* @author will.jiang
* 日期 2014 11 13 上午10:41
* 功能描述 把子类内容扩展到父类上
* @param p{obj} 父类
* @param c{obj} 子类
* @return {num} 返回值说明
* */
G.combin=function(p,c){
    var o = c||{};
    for(var i in o){
         p[i] = o[i];
    }
};
/*
 [14.34].filter(function(el,i){
 return el>3;
 })
 */
if (typeof Array.prototype.filter == "undefined") {
    Array.prototype.filter = function (fn) {
        var rs = [];
        for (var i = 0; i < this.length; i++) {
            var item = this[i];
            if (fn(item, i)) {
                rs.push(item);
            }
        }
        return rs;
    }
}
//扩展一个hashmap对象
G.Map = function () {
    this.data = {}
};
G.Map = JClass.extend({
    init: function () {
        this.data = {};
    },
    set: function (key, value) {
        this.data[key] = value;
    },
    get: function (key) {
        return this.data[key];
    },
    containsKey: function (key) {
        return (typeof this.data[key] != 'undefined')
    },
    remove: function (key) {
        delete this.data[key];
    },
    clear: function () {
        this.data = {};
    }
});

(function(){
//typeof 增强 。除去typeof可以判断的boolean、number、object、function、string外还可以判断null、Array、Date、regexp
    var $classType = {};
    var $types = "Boolean Number String Function Array Date RegExpObject".split(" ");
    $types.forEach(function (item,i) {
        $classType["[object "+item+"]"]= item.toLowerCase();
    });
    /*
     * @author will.jiang
     * 日期 2014 11 06 下午4:18
     * 功能描述 校验数据类型。可以判断多种数据类型
     * @param {num} 参数1说明
     * @return {num} 返回值说明
     * */
    G.type=function(obj){
        if(obj==null){
            return "null"
        }else{
            return $classType[toString.call(obj)]||'object';
        }
    };
}());


window.GDK = G;
