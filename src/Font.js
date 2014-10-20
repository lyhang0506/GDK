/*
 * @author yuhang.liu
 * @CreateTime 14-10-16
 * 功能描述 字体加载类，提供单个字体加载和多个字体加载两种方式
 * @param {num} 参数1说明
 * @return {num} 返回值说明
 * */

this.GDK = this.GDK || {};
(function() {
var Font = function() {

}

var f = Font.prototype;

//加载字体文件
f.addFont = function(fontPath,fontName) {
    var styleNode = document.createElement("style");
    styleNode.type = "text/css";
    var styletext = "@font-face {\n";
    styletext += "  font-family: " + fontName + ";\n";
    styletext += "  src: url('" + fontPath + "');\n";
    styletext += "}";
    styleNode.innerHTML = styletext;
    document.body.appendChild(styleNode);

    WebFontConfig = {
        custom: {
            families: [fontName]
        },
        loading: function() {
            console.log("加载成功");
        },
        //
        active: function() {
            console.log("渲染成功");
        },
        inactive: function() {
            console.log("不支持");
        }
    };

    WebFont.load(WebFontConfig);

}

//根据配置加载多个字体文件
f.addFonts = function(fontSetup) {
    var styleNode = document.createElement("style");
    styleNode.type = "text/css";
    var styletext = "";
    var fontNameArr = [];
    for(var key in fontSetup) {
        fontNameArr.push(key);
        styletext += "@font-face {\n";
        styletext += "  font-family: " + key + ";\n";
        styletext += "  src: url('" + fontSetup[key] + "');\n";
        styletext += "}\n";
    }
    styleNode.innerHTML = styletext;
    document.body.appendChild(styleNode);

    WebFontConfig = {
        custom: {
            families: fontNameArr
        },
        //所有字体加载成功触发此事件
        loading: function() {
            console.log("所有字体加载成功");
        },
        //所有字体渲染成功触发此事件
        active: function() {
            console.log("所有字体渲染成功");
        },
        //如果浏览器不支持连接式加载字体触发此事件或者没有任何字体被加载触发此事件
        inactive: function() {
            console.log("不支持");
        },
        //加载成功一次触发一次此事件
        fontloading:function(fontName,fvd) {
            console.log(fontName);
            console.log(fvd);
        },
        //渲染成功一个字体触发一次此事件
        fontactive:function(fontName,fvd) {
            console.log(fontName);
            console.log(fvd);
        },
        //当某一个字体不能被读取时触发此事件
        fontinactive:function(fontName,fvd) {
            console.log(fontName);
            console.log(fvd);
        }
    };

    WebFont.load(WebFontConfig);

}


GDK.Font = Font;

}());