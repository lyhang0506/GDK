/**
 * Created by will.jiang on 14-10-21.
 * 国际化工具
 * require Check.js
 */
/*
* @author yuhang.liu
* @CreateTime 14-10-20
* 功能描述 游戏的初始化
* @param {num} 参数1说明
* @return {num} 返回值说明
* */

    var Game = function() {

    };

    var g = Game.prototype;

    g.gameEle = document.getElementById("game");
    g.canvas = document.getElementById("canvas");
    g.stage = new createjs.Stage(g.canvas);

    g.sceneLayer = new createjs.Container();
    g.uiLayer = new createjs.Container();
    g.eventLayer = new createjs.Container();

    g.stage.addChild(g.sceneLayer);
    g.stage.addChild(g.uiLayer);
    g.stage.addChild(g.eventLayer);

    g.supportMobile = false;
    g.settings = {};

    g.init = function(){
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", g.stage);
        if(arguments.length==2) {
            g.supportMobile = true;
        }else {
            g.supportMobile = false;
        }
        if(GDK.check.isDesktop()) {
            g.stage.mouseEventsEnabled = true;
            g.settings = arguments[0];
        }else{
            createjs.Touch.enable(stage);
            g.settings = arguments[1];
        }
        g._setStyle();
        window.addEventListener("resize", g._resizeCallback);

        g._resizeCallback();
    };

    //通过传过来的参数构建style值
    g._makeStyle = function(style) {
        var st = g.gameEle.style;
        for (var p in style)
            st[p] = style[p];
    }

    //为浏览器兼容性给style值设置前缀
    g._setPrefixed = function(prop, val) {
        var cap_prop = prop[0].toUpperCase() + prop.substr(1);
        var st = { };
        st[prop] = val;
        st['O' + cap_prop] = val;
        st['ms' + cap_prop] = val;
        st['Moz' + cap_prop] = val;
        st['Webkit' + cap_prop] = val;
        g._makeStyle(st);
    }

    //设置装canvas的div的宽和高
    //设置canvas的宽和高
    g._setStyle = function() {
        g.gameEle.style.height = g.settings.bgHeight+'px';
        g.gameEle.style.width = g.settings.bgWidth+'px';
        if(g.settings.gameBGUrl) {
            g.gameEle.style.background = "url(" + g.settings.gameBGUrl + ") no-repeat";
        }else{
            g.gameEle.style.background = g.settings.gameBGCss;
        }

        g.gameEle.style.margin = "-"+(g.settings.bgHeight/2)+"px"+" 0px 0px "+"-"+(g.settings.bgWidth/2)+"px";
        g.canvas.height = g.settings.canvasHeight;
        g.canvas.width = g.settings.canvasWidth;
    };

    //横屏缩放的方法
    g._landscapeResizeCallback = function () {
        var width;
        var height;
        width = g.settings.gameMinWidth;
        height = g.settings.gameMinHeight;
        var scaleW = GDK.check.availWidth() / width
        var scaleH = GDK.check.availHeight() / height
        console.log(GDK.check.availWidth());
        console.log(GDK.check.availHeight());
        var toScale = Math.min(scaleW, scaleH);
        g._setPrefixed('transform','scale(' + toScale + ')');
    }


    //改变游戏窗口大小的回调函数，目前只支持横屏
    g._resizeCallback = function () {
        g._landscapeResizeCallback();
    };

    g.gotoScene = function(scene) {

        if(!window[scene]) {
            var obj = scene.replace(/^[a-zA-Z]/,function(m){return m.toUpperCase()});
            var evalString = "new "+obj+"()";
            console.log(evalString);
            window[scene] = eval(evalString);
        }
        if(this.nowScene) {
            this.nowScene.content.visible = false;
        }
        console.log(this.nowScene);
        this.nowScene = window[scene];
        console.log(scene);
        console.log(this.nowScene);
        this.nowScene.content.visible = true;
    };


/*
 * @author will.jiang
 * 日期 14-4-29 下午4:08
 * 功能描述
 * @param el{DOM} 传入canvas外部的一层元素，该元素控制canvas的整体缩放和自动居中
 * @param protectW{int}  受保护的显示面积的宽
 * @param protectH{int}  受保护的显示面的高
 * @return null
 * */
/*var autoResize = JClass.extend({
    init:function(el,protectW,protectH){
        this.el = el||document.getElementById("gameWrap");
        this.prtW =protectW||1920;
        this.prtH = protectH||1080;
    },
    run:function(){
        var browScreen = document.documentElement;
        var scaleW = browScreen.clientWidth/this.prtW;
        var scaleH = browScreen.clientHeight/this.prtH;
//            var rs = scaleW>scaleH?scaleH:scaleW;
        var rs = Math.min(scaleH,scaleW);
        var s =  this.setPrefixed("transform",rs);
        this.setStyle(s);
    },
    setPrefixed:function(key,value){
        var fix = {};
        var list = ["-moz-","-webkit-","-o-","-ms-",""];
        for(var i=0;i<list.length;i++){
            fix[list[i]+key]="scale("+value+")";
        }
        return fix;
    },
    setStyle:function(S){
        var elStyle = this.el.style;
//            防止属性被覆盖，采用对特定样式赋值的方式
        for(var k in S){
            elStyle[k]=S[k];
        }
    }

})*/

/*
 * @author will.jiang
 * 日期 14-4-29 下午4:18
 * 功能描述 自适应模块的暴露接口
 * @param el{DOM} 传入canvas外部的一层元素，该元素控制canvas的整体缩放和自动居中
 * @param protectW{int}  受保护的显示面积的宽
 * @param protectH{int}  受保护的显示面的高
 * @return {boolean} 重复调用会返回flase，并且不会执行绑定事件
 * tips：该方法推荐在dom加载完成后处理，这是才能取得正确的屏幕高宽和自适应容器的高宽
 * */
/*
G.tools.autoResize =(function(){
    var tools = null ;
    var timer = null;
    return function(el,protectW,protectH){
        //阻止重复绑定事件
        if(tools)return false;
        tools = new autoResize(el,protectW,protectH);
        //绑定窗口resize事件
        addEvent(win,'resize',function(){
            clearTimeout(timer);
            timer = setTimeout(function(){
                tools.run();
            },200)
        });
        //初始化调用事件
        tools.run();
    }
}());*/
