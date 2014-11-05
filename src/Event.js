/**
 * Created by will.jiang on 14-10-21.
 * 事件管理
 * require Properties.js
 */

/*
 * @author will.jiang
 * 日期 14-4-29 下午2:21
 * 功能描述 定义私有的添加事件的方法,因为在支持H5的浏览器中执行，也就不考虑过老版本浏览器中。
 * dom0级的事件绑定不用考虑(container.onclick = function)
 * @param {num} 参数1说明
 * @param {num} 是否阻止
 * @return {num} 返回值说明
 * */
var addEvent =(function(){
    var flag = typeof window.addEventListener != "undefined";
    return function(container,eventType,handle){
        if(flag){
            //支持W3C的标准
            container.addEventListener(eventType,handle,false);
        }else{
            container.attachEvent("on"+eventType,handle);
        }
    }
}());
/*
 * @author will.jiang
 * 日期 14-4-29 下午2:48
 * 功能描述  私有的移除事件的方法
 * @param {num} 参数1说明
 * @return {num} 返回值说明
 * */
var removeEvent = (function(){
    var flag = typeof window.removeEventListener !="undefined";
    return function(container,eventType,handle){
        if(flag){
            container.removeEventListener(eventType,handle,false);
        }else{
            container.detachEvent("on"+eventType,handle);
        }
    }
}());
//目前此类的方法还没有扩充到GDK对象上，暂时作为私有方法。

/*
 * @author will.jiang
 * 日期 14-5-7 下午4:17
 * 功能描述 自定义事件
 * @param {num} 参数1说明
 * @return {num} 返回值说明
 * */

var event = JClass.extend({
    init:function(){
        //保存事件的对象,所有的事件对象都保存在里面。
        this.$events = {};
    },
    /*
     * @author will.jiang
     * 日期 14-5-7 下午4:20
     * 功能描述 给指定的type类型注册事件
     * @param type{string} 事件类型
     * @param fn{fn} 注册的方法
     * @return {num} 返回值说明
     * */
    addEvent:function(type,fn){
        if(typeof type == "string"){
            //第一次注册需要给这个type类型分配空间
            var list = this.$events[type];
            if(!list){
                list = this.$events[type]=[];
            }
            if(typeof fn =="function"){
                list.push(fn);
            }
        }
    },
    /*
     * @author will.jiang
     * 日期 14-5-7 下午5:14
     * 功能描述 同事注册多个事件
     *  {type:fn(type:fn)}  ｛'click':fnHandel,'others':fnHandel｝
     * @return {num} 返回值说明
     * */
    addEvents:function(obj){
        if(obj){
            var that = this;
            for(var i in obj){
                that.addEvent(i,obj[i]);
            }
        }
    },
    /*
     * @author will.jiang
     * 日期 14-5-7 下午4:22
     * 功能描述 移除指定type类型注册的事件，当传入了事件的引用时，会去
     * 注册列表中查找
     * @param {num} 参数1说明
     * @return {num} 返回值说明
     * */
    removeEvent:function(type,fn){
        if(typeof type == "string"){
            var list = this.$events[type];
            if(list){
                //如果该事件被注册过
                if(typeof fn =="function"){
                    //循环遍历事件，查看是否传的事件在其中，查找到就删除它
                    for(var i= 0,max = list.length;i<max;i++){
                        if(list[i]==fn){
                            list.splice(i,1);
                            max--;//循环总数应该-1
                        }
                    }
                }else{
                    list =[];
                }
            }
        }
    },
    /*
     * @author will.jiang
     * 日期 14-5-7 下午5:29
     * 功能描述 删除事件 可以传入对象来一次性移除多个数组
     * @param {num} 参数1说明
     * @return {num} 返回值说明
     * */
    removeEvents:function(obj){
        if(obj){
            var that = this;
            var list = this.$events;
            for(var i in obj){
                this.removeEvent(i,obj[i]);
            }
        }
    },
    /*
     * @author will.jiang
     * 日期 14-5-7 下午4:20
     * 功能描述 触发自定义事件
     * @param {num} 参数1说明
     * @param {array} 参数列表
     * @return {num} 返回值说明
     * */
    fireEvent:function(type,pram){
        if(typeof type =="string"){
            var list = this.$events[type];
            if(list){
                for(var i= 0,max=list.length;i<max;i++){
//                    list[i](type);
                    list[i].apply(window,pram);
                }
            }
        }
    }
});
//事件管理机制应该是单例的。所以就直接实例化对象了
G.Event = new event();
//暴露一些GDK根方法
G.on =function(){
    G.Event.addEvent.apply(G.Event,arguments);
};
G.off = function(){
    G.Event.removeEvent.apply(G.Event,arguments);
};