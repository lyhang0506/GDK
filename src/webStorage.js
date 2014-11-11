/**
 * Created by will.jiang on 14-11-11.
 * H5本地存储相关内容
 * javascript高级程序设计
 * 适用环境: IE 8+、Firefox 3.5+、Chrome 4+、Opera 10.5+
 * 自执行方法前面加；号可以避免压缩时同上一个自执行函数凑单成(fn)(fn)的方式
 */

;(function(){

    var storage = getStorage();
    function getStorage(){
        if(typeof localStorage == "object"){
            return localStorage;
        }else if(typeof globalStorage == 'object'){
            return globalStorage;
        }else{
            return new Error("创建storage对象失败，浏览器版本太低！");
        }
    }
    window.Storage = {
        set:function(k,v){
            storage.setItem(k,v);
        },
        get:function(k){
            return storage.getItem(k);
        },
        remove:function(k){
            storage.removeItem(k);
        }
    }
}());

/*
* 用法实例
* Storage.set('name',"will);
* Storage.get('name');//return will
* //删除 name
* Storage.remove('name');
* */