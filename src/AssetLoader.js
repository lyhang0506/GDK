/**
 * Created by will.jiang on 14-10-21.
 * 资源加载
 */
/*
* @author will.jiang
* 日期 14-5-6 下午2:49
* 功能描述 加载对象，需要实例化后使用，这样才能控制整个加载的过程。每个实例都有自己
* 独立的加载内容和加载事件。
* 方法都可以链式调用
* @param disableDefaultUI{String} 是否需要默认的加载ui
* @param mainPath{String} 基础的地址 如:"xxx.com/js/tools/" 在加载列表
* 传入 "1.js" 这个文件啊真实地址会被拼接为 "xxx.com/js/tools/1.js"
* @param onSuccess{fn} 全部加载成功后调用的方法
* @param onFail{fn}    加载失败调用的方法
* @return {num} 返回值说明
    * */
    G.AssetLoader = JClass.extend({
    init:function(disableDefaultUI,mainPath,onSuccess,onFail){
        this.disableDefaultUI = disableDefaultUI||false;
        this.mainPath = mainPath ||"";
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        //保存各项的详细加载项
        this.images = [];
        this.css = [];
        this.fonts =[];
        this.soundMap={};
        //已经成功加载的资源数
        this.loadedNum = 0;
        this.count=0;
    },
    /*
     * @author will.jiang
     * 日期 14-5-6 下午4:12
     * 功能描述 一个可复用的添加加载泪飙的方法
     * @param {num} 参数1说明
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
        _setLoaderList(list,basePath,this.images);
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
    addStyleSheets:function(list,basePath){
        this._setLoaderList(list,basePath,this.css);
        return this;
    },
    /*
     * @author will.jiang
     * 日期 14-5-6 下午3:08
     * 功能描述 加载单个字体文件
     * assetLoader.addFont("arial", "fonts/Arial.ttf");
     * @param {num} 参数1说明
     * @return {num} 返回值说明
     * */
    addFont:function(item){
        if(item.name&&item.url) this.fonts.push(item);
        return this;
    },
    /*
     * @author will.jiang
     * 日期 14-5-6 下午3:08
     * 功能描述 加载字体列表
     * var fontAssets = [
     { name: "arial", url: "fonts/Arial.ttf" },
     { name: "ptsans", url: "fonts/PTSans.ttf" }
     ];
     assetLoader.addFonts(fontAssets);
     * @param {name:string,url:string} name:字体的名字; url:字体的加载路径
     * @param {string} 基本的路径地址
     * @return {num} 返回值说明
     * */
    addFonts:function(list,basePath){
        var that = this;
        if(list instanceof  Array){
            list.forEach(function(item){
                if(basePath)item.url = basePath+item.url;
                that.fonts.push(item);
            })
        }
        return this;
    },
    /*
     * @author will.jiang
     * 日期 14-5-6 下午3:08
     * 功能描述 加载声音列表
     * @param {num} 参数1说明
     * @return {num} 返回值说明
     * */
    addSounds:function(list,basePath){
        this._setLoaderList(list,basePath,this.sounds);
        return this;
    },


    /*
     * @author will.jiang
     * 日期 14-5-6 下午3:09
     * 功能描述 触发方法，该方法会进行所有资源的加载操作。
     * @param {num} 参数1说明
     * @return {num} 返回值说明
     * */
    start:function(){
        //这里是主要的加载逻辑点,IE9+的浏览器都支持DOM2事件，so可以直接使用addEventListenner
        //先统计总的加载数量
        var that = this;
        //字体文件并没加载成功或失败的规范事件，所以对字体不进行加载判定
        this.count = this.images.length+this.css.length+this.sounds.length;
        var onSuccess = this.onSuccess||function(){
            console.log("全部文件加载成功!");
        };
        var onFail = this.onFail||function(item){
            console.log(item+"加载失败!");
        };
        function checkCount(){
            //如果全部加载完了
            if(that.count ==++that.loadedNum){
                onSuccess();
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
                    onFail(this);
                };
                img.src = item;
            });
        };
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
                        onFail(this.href);
                    };
                };
                link.href = item;
            });
        };


        //加载字体
        function $loadFont(fonts){
            //这里只动态加载需要的字体文件，不绑定事件
            fonts.forEach(function(item,i){

            });
        };
        //加载声音
        /*function $loadSound(sounds){
         var type = new Audio();
         type = type.canPlayType('video/ogg')?"ogg":"mp3";
         sounds.forEach(function(item){
         var sound = new Audio();
         //拼凑音频文件路径
         sound.src = item+"."+type;
         sound.addEventListener("canplaythrough", function () {
         //加载成功!
         checkCount();
         }, false);
         sound.addEventListener("error", function () {
         onFail(this.src);
         }, false);
         });
         };*/


        //
        /*
         * 需要方法分别加载3种类型，然后加载成功执行回调方法，记录加载总数的变量++，并且同加载总数
         * 相比较，如果相等表明全部加载成功，这时执行设定的方法
         * */

    }
})

/*
 * @author will.jiang
 * 日期 14-4-30 下午5:36
 * 功能描述  加载图片的方法
 * @param url{String} 加载图片的url地址
 * @param success{funtion} 图片加载成功后的回调函数，调用该函数会传入当前图片做为参数
 * @return {num} 返回值说明
 * */
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
/*
 * @author will.jiang
 * 日期 14-4-30 下午5:39
 * 功能描述 加载样式表
 * @param {num} 参数1说明
 * @return {num} 返回值说明
 * */
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
/*
 * @author will.jiang
 * 日期 14-5-6 下午2:11
 * 功能描述 添加图片列表
 * @param imgs[{string}(,{string})*] 参数1说明
 * @return {num} 返回值说明
 * */
G.AssetLoader.addImages =function(imgs){
    //确定是array
    if(!(imgs instanceof Array)) return;
    for(var i= 0,max = imags.length;i<max;i++){
        loadImg(imags[i]);
    }
};