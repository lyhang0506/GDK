/*
* @author yuhang.liu
* @CreateTime 14-10-20
* 功能描述 游戏的初始化
* @param {num} 参数1说明
* @return {num} 返回值说明
* */
this.GDK = this.GDK || {};

(function () {
    var Game = function() {

    };

    var g = Game.prototype;

    g.gameEle = document.getElementById("game");
    g.canvas = document.getElementById("canvas");
    g.supportMobile = false;
    g.settings = {};

    g.init = function(){
        if(arguments.length==2) {
            g.supportMobile = true;
        }else {
            g.supportMobile = false;
        }
        if(GDK.check.isDesktop()) {
            g.settings = arguments[0];
        }else{
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
        g.gameEle.style.height = g.settings.bgHeight;
        g.gameEle.style.width = g.settings.bgWidth;
        g.gameEle.style.background = "url(" + g.settings.gameBGUrl + ") no-repeat";
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
        var toScale = Math.min(1, 1);
        g._setPrefixed('transform','scale(' + toScale + ')');
    }


    //改变游戏窗口大小的回调函数，目前只支持横屏
    g._resizeCallback = function () {
        g._landscapeResizeCallback();
    }


    GDK.Game = Game;
}());