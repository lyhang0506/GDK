/**
 * Created by will.jiang on 14-10-21.
 * 资源加载
 * require Event.js
 */
/*
* @author will.jiang
* 日期 14-5-6 下午2:49
* 功能描述 加载对象，需要实例化后使用，这样才能控制整个加载的过程。每个实例都有自己
* 独立的加载内容和加载事件。
* 方法都可以链式调用
* @param disableDefaultUI{String} 是否需要默认的加载ui。当时考虑加载由DOM模拟
* @param mainPath{String} 基础的地址 如:"xxx.com/js/tools/" 在加载列表
* 传入 "1.js" 这个文件啊真实地址会被拼接为 "xxx.com/js/tools/1.js"
* @param onSuccess{fn} 全部加载成功后调用的方法
* @param onFail{fn}    加载失败调用的方法
* @return {num} 返回值说明
    * */
    G.AssetLoader = JClass.extend({
    init:function(disableDefaultUI,mainPath){
        this.disableDefaultUI = disableDefaultUI||false;
        this.mainPath = mainPath ||"";
        //保存各项的详细加载项
        this.images = [];
        this.css = [];
        this.fonts =[];
        this.soundMap=[];
        //已经成功加载的资源数
        this.loadedNum = 0;
        //加载失败也需要计数
        this.failureNum =0;
        //成功计数
        this.count=0;
    },
    /*
     * @author will.jiang
     * 日期 14-5-6 下午4:12
     * 功能描述 一个可复用的添加加载列表的方法
     * @param list{array} 加载列表
     * @return {num} 返回值说明
     * */
    _setLoaderList:function(list,basePath,dataReference){
        if(list instanceof Array){
            var path = basePath||"";
            var data = dataReference;
            list.forEach(function(item,index){
                data.push(path+item);
            })
        }
    },
    /*
     * @author will.jiang
     * 日期 14-5-6 下午3:02
     * 功能描述 加载单个图片
     * @param url{String} 参数1说明
     * */
    loadImage:function(url){
        if(url) this.images.push(this.mainPath+url);
        return this;
    },
    /*
     * @author will.jiang
     * 日期 14-5-6 下午3:05
     * 功能描述  加载脚本列表
     * @param list{arrays} 需要加载的脚本列表
     * @return {num} 返回值说明
     * */
    loadImages:function(list,basePath){
        //调用加载列表方法。
        this._setLoaderList(list,basePath,this.images);
        return this;
    },
    /*
         * @author will.jiang
         * 日期 14-5-6 下午3:07
         * 功能描述 加载单个的样式表
         * @param {num} 参数1说明
         * @return {num} 返回值说明
         * */
    addStyleSheet:function(url){
        if(url) this.css.push(this.mainPath+url);
        return this;
    },
    /*
     * @author will.jiang
     * 日期 14-5-6 下午3:08
     * 功能描述 加载样式表列表
     * @param {num} 参数1说明
     * @return {num} 返回值说明
     * */
        addStyleSheets: function (list, basePath) {
            this._setLoaderList(list, basePath, this.css);
            return this;
        },
        /*
        * @author will.jiang
        * 日期 2014 10 24 上午11:25
        * 功能描述 加载单个字体文件的数据设置方法。只是把内容放到总的等待加载的列表里
        * @param {num} 参数1说明
        * @return {num} 返回值说明
        * */
        addFont: function (fontName) {
            this.fonts.push(fontName);
            return this;
        },

        //根据配置加载多个字体文件 addfonts([yh,aro])
        addFonts: function (list) {
            this._setLoaderList(list, "", this.fonts);
            return this;
        },

        addSounds: function (spriteFile, spriteSetup) {
            this.soundMap=[{
                spriteFile:spriteFile,
                spriteSetup:spriteSetup
            }];
            return this;
        },

    /*
     * @author will.jiang
     * 日期 14-5-6 下午3:09
     * 功能描述 触发方法，该方法会进行所有资源的加载操作。
     * @param {fn} 全部加载完成后的回调方法
     * @param {fn} 加载过程中失败时调用的方法
     * @return {num} 返回值说明
     * */
    start:function(onSuccess,onFail){
        //这里是主要的加载逻辑点,IE9+的浏览器都支持DOM2事件，so可以直接使用addEventListenner
        //先统计总的加载数量
        var self = this;
        //字体文件并没加载成功或失败的规范事件，所以对字体不进行加载判定.
        this.count = this.images.length+this.css.length+this.fonts.length+this.soundMap.length;
        var _onSuccess = onSuccess||function(){
//            evt.count; evt.loadedNum;
            console.log("全部文件加载成功!总共");
        };
        var _onFail = onFail||function(item){
            console.log(item+"加载失败!");
        };
        //加载成功事件
        function checkCount(){
            var now = ++self.loadedNum;
            //fire 加载进度事件
            G.Event.fireEvent(G.EVENT.LOADING_PROGRESS,[self.loadedNum,self.count]);
            //如果全部加载完了
            if(self.count ==now){
                _onSuccess();
            }
        }

        //加载图片的方法
        function $loadImage(images){
            images.forEach(function(item,index){
                var img = new Image();
                img.onload =function(){
                    //加载成功!
                    checkCount();
                };
                img.onerror = function(){
                    _onFail(this);
                };
                img.src = item;
            });
        }
        //加载样式表
        function $loadStyleSheet(css){
            css.forEach(function(item,index){
                var link = document.createElement('link');
                link.type="text/css";
                //IE浏览器兼容性处理，防止绑定onload事件加载失败时也调用
                if(link.readyState){
                    link.onreadystatechange=function(){
                        if (link.readyState == "loaded" || link.readyState == "complete"){
                            link.onreadystatechange = null;
                            //加载成功!
                            checkCount();
                        }
                    }
                }else{
                    // 其它W3C规范的浏览器
                    link.onload =function(){
                        //加载成功!
                        checkCount();
                    };
                    link.onerror = function(){
                        _onFail(this.href);
                    };
                }
                link.href = item;
            });
        }


        //加载字体
        function $loadFont(fonts){
            if(fonts.length==0){
                //为空时阻止后续代码允许
               return false;
            }

            var styleNode = document.createElement("style");
            styleNode.type = "text/css";
            var styletext = "";
            for (var i =0;i<fonts.length;i++) {
                styletext += "@font-face {\n";
                styletext += "  font-family: " + fonts[i] + ";\n";
                styletext += "  src: url('" + self.mainPath+"/font/"+fonts[i] + ".ttf');\n";
                styletext += "}\n";
            }
            styleNode.innerHTML = styletext;
            document.body.appendChild(styleNode);
            var WebFontConfig = {};
            if(fonts.length == 1) {
                WebFontConfig = {
                    custom: {
                        families: fonts[0]
                    },

                    //所有字体渲染成功触发此事件，用这个事件判断字体加载完成
                    active: function () {
                        console.log("所有字体渲染成功");
                        checkCount();
                    },
                    //如果浏览器不支持连接式加载字体触发此事件或者没有任何字体被加载触发此事件
                    inactive: function () {
                        console.log("不支持");
                    }
                };
            }else{
                WebFontConfig = {
                    custom: {
                        families: fonts
                    },

                    //所有字体渲染成功触发此事件，用这个事件判断字体加载完成
                    active: function () {
                        console.log("所有字体渲染成功");
                    },
                    //如果浏览器不支持连接式加载字体触发此事件或者没有任何字体被加载触发此事件
                    inactive: function () {
                        console.log("不支持");
                    },

                    //渲染成功一个字体触发一次此事件，用这个事件判断字体加载完成
                    fontactive: function (fontName, fvd) {
                        console.log(fontName);
                        console.log(fvd);
                        checkCount();
                    },
                    //当某一个字体不能被读取时触发此事件
                    fontinactive: function (fontName, fvd) {
                        console.log(fontName);
                        console.log(fvd);
                    }
                };

            }
            WebFont.load(WebFontConfig);
        }

        function $loadSounds(soundMap) {
            if(soundMap){
                GDK.audio = GDK.audio || new GDK.Audio();
                GDK.audio._addSounds(soundMap.spriteFile, soundMap.spriteSetup);
                GDK.audio._loadSounds(checkCount,_onFail);
            }
        }


        /*
        * 开始触发各种资源加载事件
        * */
        $loadImage(this.images);
        $loadStyleSheet(this.css);
        $loadFont(this.fonts);
        $loadSounds(this.soundMap[0]);
    }
});
/*

*/
/*
 * @author will.jiang
 * 日期 14-4-30 下午5:36
 * 功能描述  加载图片的方法
 * @param url{String} 加载图片的url地址
 * @param success{funtion} 图片加载成功后的回调函数，调用该函数会传入当前图片做为参数
 * @return {num} 返回值说明
 * *//*

var loadImg = function(url,success,faile){
    var img  =  new Image();
    img.onload=function(){
        //加载成功
        if(success) success(img);
    }
    img.onerror=function(){
        //加载失败
        if(faile)faile(img);
        //处理后，把错误事件
        img.onerro=null;
    }
    img.src = url;
}
*/
/*
 * @author will.jiang
 * 日期 14-4-30 下午5:39
 * 功能描述 加载样式表
 * @param {num} 参数1说明
 * @return {num} 返回值说明
 * *//*

var loadStylesheet = function(url){
    var link  =  document.createElement("link");
    link.rel = "stylesheet";
    link.css="text/css";
    link.href="url";
    document.getElementsByName('head').append(link);
}
//加载图片
G.AssetLoader.addImage=function(url){
    loadImg(url);
}
*/
/*
 * @author will.jiang
 * 日期 14-5-6 下午2:11
 * 功能描述 添加图片列表
 * @param imgs[{string}(,{string})*] 参数1说明
 * @return {num} 返回值说明
 * *//*

G.AssetLoader.addImages =function(imgs){
    //确定是array
    if(!(imgs instanceof Array)) return;
    for(var i= 0,max = imags.length;i<max;i++){
        loadImg(imags[i]);
    }
};*/
