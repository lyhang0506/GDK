(function(win){
    var G = {
       version:0.1,
       date:'2014/4/20',
       check:{},//检查的方法类
       tools:{},//工具类
       locale:{},//国际化
       audio:{}//声音管理类
    };
        //类工厂
        (function() {
            // 当前是否处于创建类的阶段
            var initializing = false;
            JClass = function() { };
            JClass.extend = function(prop) {
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
                            F.prototype[name] = (function(name, fn) {
                                return function() {
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
  /*   var Person = JClass.extend({
     init: function(name,addr) {
     this.name = name;
     this.addr = addr;
     },
     getName: function(prefix) {
     return prefix + this.name;
     }
     });


     var Employee = Person.extend({
     init: function(name, employeeID,addr) {
     //  调用父类的方法
     this._super(name,addr);
     this.employeeID = employeeID;
     },
     getEmployeeIDName: function() {
     // 注意：我们还可以通过这种方式调用父类中的其他函数
     var name = this._superprototype.getName.call(this, "Employee name: ");
     return name + ", Employee ID: " + this.employeeID;
     },
     getName: function() {
     //  调用父类的getName方法
     return this._super("Employee name: ");
     },
     getAddr:function(){
     return this.addr;
     }
     });

     var zhang = new Employee("ZhangSan", "1234","天府新谷");
     console.log(zhang.getName());            // "Employee name: ZhangSan"
     console.log(zhang.getEmployeeIDName());  // "Employee name: ZhangSan, Employee ID: 1234"
     console.log(zhang.getAddr());            // "天府新谷"
*/



    //扩展一个hashmap对象
    G.Map = function(){this.data={}};
    G.Map = JClass.extend({
        init:function(){
            this.data={};
        },
        set:function (key, value) {
            this.data[key] = value;
        },
        get:function (key) {
            return this.data[key];
        },
        containsKey:function (key) {
            return (typeof this.data[key] != 'undefined')
        },
        remove:function (key) {
            delete this.data[key];
        },
        clear:function () {
            this.data = {};
        }
    })



    //浏览器检测的cash对象，优化性能，不需要每次都进行检测
    var browsersList = {
        os:"Mac|Windows|iOS|Android",
        browser:"Chrome|Safari|Firefox|Explorer"
    }
    //暴露在外部的方法
    var ua ;
    /*
    * @author will.jiang
    * 日期 14-4-25 上午10:05
    * 功能描述  ua校验的整体逻辑，这里使用了匿名函数包裹，以免污染外部的变量
    * @param {num} 参数1说明
    * @return {num} 返回值说明
    * */
   (function(w){
       //浏览器的校验信息源
       var UA = w.navigator.userAgent;
       //得到校验规则的对象
       var parseRule = getRules();
       var ieAX = w.ActiveXObject;
       var ieMode = w.document.documentMode;
       var isIe = ieAX || ieMode;
       var ieVer = getIeVersion();
        // 大写第一个字母
       function upperCase1st(string) {
           return string.replace(/^(\w)/, function (word) {
               //该方法是把找到的内容当做wrod传入，然后进行大写转换。
               return word.toUpperCase()
           });
       }
       // 获得ie浏览器版本
       function getIeVersion() {
           if(isIe){
               var v = 4,
                   p = w.document.createElement('p');
               do{
                   //IE条件表达式
                   p.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
               }while(p.getElementsByTagName('i')[0]);
               //在IE10以上的浏览器取消了条件注释，需要用documentMode来判断
               v = v > 5 ? v : ieMode;
               return v;
           } else{
               return 0;
           }
       }
       //保存结果的缓存
       var _cash = null;
       var _ua = function(strUA){
           if(!_cash){
               //可以通过传参的防止来设置接卸的UA值
               var ua = (typeof strUA =="string"?strUA:UA).toLowerCase();
               var objPlatform =  parse(parseRule.platforms,ua,false);
               var objBrowser = parse(parseRule.browsers,ua,true);
               var objEngine = parse(parseRule.engines,ua,true);
               var language = getLanguage();

               _cash={
                   //ua 字符串
                   ua:ua,
                   //操作平台
                   platform:objPlatform,
                   //浏览器
                   browser:objBrowser,
                   //浏览器内核
                   engine:objEngine,
                   language:language,
                   // 内核
                   isWebkit: !! objEngine.isWebkit,
                   isGecko: !! objEngine.isGecko,
                   isTrident: !! objEngine.isTrident,
                   // 类型
                   isMobile: objPlatform.isMobile,
                   isTablet: objPlatform.isTablet,
                   isDesktop: objPlatform.isDesktop,
                   // ie浏览器
                   isIe: !! ieVer,
                 /*  isIe6: ieVer==6,
                   isIe7: ieVer==7,
                   isIe8: ieVer==8,
                   isIe9: ieVer==9,
                   isIe10: ieVer==10,
                   isIe11: ieVer==11,*/
                   ie: ieVer
               };
               //对于罗列的ie6-ie11可以如下实现
               if(ieVer){
                   _cash['isIe'+ieVer]=true;
               }
           }
           return _cash;
       }
       /*
       * @author will.jiang
       * 日期 14-4-28 下午2:40
       * 功能描述 得到当前系统的语言版本，转换为全小写的模式，方便复用。
       * @param {num} 参数1说明
       * @return {num} 返回值说明
       * */
        function getLanguage(){
            var lan = win.navigator.language?win.navigator.language:win.navigator.browserLanguage;
            lan = lan.toLowerCase();
            return lan;
        }
       /*
        * @author will.jiang
        * 日期 14-4-24 下午3:02
        * 功能描述 解析逻辑
        * @param  {Array} 需要解析的数据
        * @param  {String} 需要解析的ua字符串
        * @param  {Boolean} 是否为解析浏览器数据
        * @return {Object} 解析后的对象
        * */
       function parse(rules,ua,isBrowser){
           //保存结果的对象
           var rs = {};
           //先判断是否是解析浏览器数据,并且是IE的话直接返回结果
           if(isBrowser &&ieVer){
               return{
                   name:'ie',
                   ie:true,
                   version:ieVer,
                   isIe:true
               }
           }
           //开始检验
           for(var i= 0,max=rules.length;i<max;i++){
               var rule = rules[i];
               var sName = rule.name;
               var j,maxJ;//用于循环的元素，多次使用就集中初声明了。
               //能找到表明匹配了结果,下面再详细匹配
               if(ua.indexOf(sName) != -1){
                   //把规则里的名字设置到结果对象的属性上
                   rs.name = rule.slugName||sName;
                   //把isXXX属性设置为true
                   rs['is'+upperCase1st(rs.name)]=true;
                   // (\d+((\.|_)\d+)*) 取1是为了取得第一个子表达式里的内容
                   rs.version = ('' + (new RegExp(rule.versionSearch + '(\\d+((\\.|_)\\d+)*)').exec(ua) || [0, 0])[1]).replace(/_/g, '.');
                   //有标记的话需要把标记的内容也置为true，比如ipad查找时可以把ios也置为true
                   if(rule.flags){
                       for( j= 0,maxJ=rule.flags.length;j<maxJ;j++){
                           rs['is'+upperCase1st(rule.flags[j])]=true;
                       }
                   }

                   //校验详细的版本和名字
                   if(rule.versionNames){
                       for( j= 0,maxJ=rule.versionNames.length;j<maxJ;j++){
                           var temp = rule.versionNames[j];
                           //刚好匹配
                           if(rs.version.indexOf(temp.number)==0){
                               rs.fullname = temp.name;
                               rs['is'+upperCase1st(rs.fullname)]=true;
                               //直接跳出循环
                               break;
                           }
                       }
                   }
                   //平台校验逻辑
                   if(rules == parseRule.platforms){
                       rs.isMobile =  /mobile|phone/.test(ua) ||rs.isBlackberry||false;
                       rs.isTablet = /tablet/.test(ua) || rs.isIpad || (rs.isAndroid && !/mobile/.test(ua))||false;
                       if(rs.isTablet) rs.isMobile = false;
                       rs.isDesktop = !rs.isMobile&&!rs.isTablet;
                   }
                   //对于ios系统，添加了是否是iosX的判断
                   if(rs.ios){
                       rs.fullname = 'ios'+parseInt(rs.version);
                       rs['is'+upperCase1st(rs.fullname)] =true;
                   }
                   //找到了1个就结束外部的循环
                   break;
               }

           }
           //对于空的情况需要处理下
           if(!rs.name){
               rs['isUnknow'] = true;
               rs.name="";
               rs.version = "";
           }
           return rs;
       }
       // 解析规则
       function getRules() {
           return {
               platforms: [
                   //检测的名字相互包含是，先检测多的再检测少的。
                   // windows phone
                   {
                       name: 'windows phone',
                       versionSearch: 'windows phone os ',
                       versionNames: [ // windows phone must be tested before win
                           {
                               number: '7.5',
                               name: 'mango'
                           }
                       ]
                   },
                   // windows
                   {
                       name: 'win',
                       slugName: 'windows',
                       versionSearch: 'windows(?: nt)? ',
                       versionNames: [{
                           number: '6.2',
                           name: 'windows 8'
                       }, {
                           number: '6.1',
                           name: 'windows 7'
                       }, {
                           number: '6.0',
                           name: 'windows vista'
                       }, {
                           number: '5.2',
                           name: 'windows xp'
                       }, {
                           number: '5.1',
                           name: 'windows xp'
                       }, {
                           number: '5.0',
                           name: 'windows 2000'
                       }]
                   },
                   // ipad
                   {
                       name: 'ipad',
                       versionSearch: 'cpu os ',
                       flags: ['ios']
                   },
                   // ipad and ipod must be tested before iphone
                   {
                       name: 'ipod',
                       versionSearch: 'iphone os ',
                       flags: ['ios']
                   },
                   // iphone
                   {
                       name: 'iphone',
                       versionSearch: 'iphone os ',
                       flags: ['ios']
                   },
                   // iphone must be tested before mac
                   {
                       name: 'mac',
                       versionSearch: 'os x ',
                       versionNames: [{
                           number: '10.8',
                           name: 'mountainlion'
                       }, {
                           number: '10.7',
                           name: 'lion'
                       }, {
                           number: '10.6',
                           name: 'snowleopard'
                       }, {
                           number: '10.5',
                           name: 'leopard'
                       }, {
                           number: '10.4',
                           name: 'tiger'
                       }, {
                           number: '10.3',
                           name: 'panther'
                       }, {
                           number: '10.2',
                           name: 'jaguar'
                       }, {
                           number: '10.1',
                           name: 'puma'
                       }, {
                           number: '10.0',
                           name: 'cheetah'
                       }]
                   },
                   // android
                   {
                       name: 'android',
                       versionSearch: 'android ',
                       versionNames: [
                           // android must be tested before linux
                           {
                               number: '4.1',
                               name: 'jellybean'
                           }, {
                               number: '4.0',
                               name: 'icecream sandwich'
                           }, {
                               number: '3.',
                               name: 'honey comb'
                           }, {
                               number: '2.3',
                               name: 'ginger bread'
                           }, {
                               number: '2.2',
                               name: 'froyo'
                           }, {
                               number: '2.',
                               name: 'eclair'
                           }, {
                               number: '1.6',
                               name: 'donut'
                           }, {
                               number: '1.5',
                               name: 'cupcake'
                           }
                       ]
                   },
                   // blackberry
                   {
                       name: 'blackberry',
                       versionSearch: '(?:blackberry\\d{4}[a-z]?|version)/'
                   },
                   // blackberry
                   {
                       name: 'bb',
                       slugName: 'blackberry',
                       versionSearch: '(?:version)/'
                   },
                   // blackberry
                   {
                       name: 'playbook',
                       slugName: 'blackberry',
                       versionSearch: '(?:version)/'
                   },
                   // linux
                   {
                       name: 'linux',
                       versionSearch: 'linux'
                   },
                   // nokia
                   {
                       name: 'nokia',
                       versionSearch: 'nokia'
                   }
               ],
               browsers: [{
                   name: 'iemobile',
                   versionSearch: 'iemobile/'
               }, // iemobile must be tested before msie
                   {
                       name: 'msie',
                       slugName: 'ie',
                       versionSearch: 'msie '
                   }, {
                       name: 'firefox',
                       versionSearch: 'firefox/'
                   }, {
                       name: 'chrome',
                       versionSearch: 'chrome/'
                   }, // chrome must be tested before safari
                   {
                       name: 'safari',
                       versionSearch: '(?:browser|version)/'
                   }, {
                       name: 'opera',
                       versionSearch: 'version/'
                   }
               ],
               engines: [{
                   name: 'trident',
                   versionSearch: 'trident/'
               }, {
                   name: 'webkit',
                   versionSearch: 'webkit/'
               }, // webkit must be tested before gecko
                   {
                       name: 'gecko',
                       versionSearch: 'rv:'
                   }, {
                       name: 'presto',
                       versionSearch: 'presto/'
                   }
               ]
           };
       }
       ua = _ua;
   }(win));

    /*
    * author will.jiang
    * 日期 14-4-23 上午10:52
    * 功能描述  查看传人的系统是否在支持系统的列表里  Mac\Windows\iOS\Android
    * @param {String} 参数1说明
    * @return {boolean} 返回是否匹配
    * */
    G.check.isOS=function(osName){
        var reg = new RegExp("^("+browsersList.os+")$","ig");
        return reg.test(osName);
    }

    /*
    * author will.jiang
    * 日期 14-4-23 下午1:40
    * 功能描述  判断传入的浏览器名字是否匹配当前支持的浏览器
    * @param {num} 参数1说明
    * @return {num} 返回值说明
    * */
    G.check.isBrowser=function(browserName){
        var reg = new RegExp("^("+browsersList.browser+")$","ig");
        return reg.test(browserName);
    }


    G.check.getBrowser = function(){
       return ua().browser.name;
    };
        /*
        * author will.jiang
        * 日期 14-4-23 上午10:40
        * 功能描述 返回浏览器版本号
        * @param {num} 参数1说明
        * @return {num} 返回值说明
        * */
    G.check.getBrowserVersion=function(){
        return ua().browser.version;
    }
    /*
    * @author will.jiang
    * 日期 14-4-28 下午2:34
    * 功能描述 得到系统的语言版本
    * @param {num} 参数1说明
    * @return {num} 返回值说明
    * */
    G.check.getSystemLanguage=function(){
        return ua().language;
    }
    /*
    * author will.jiang
    * 日期 14-4-23 上午10:20
    * 功能描述 得到当前系统的名称
    * @return {String} 系统的名字:如Mac、Unix、Linux、
    * */
    G.check.getOS = function(){
       return ua().platform.fullname;
    }

    /*
    * author will.jiang
    * 日期 14-4-23 下午2:11
    * 功能描述 是否是支持触屏的设备
    * @param {num} 参数1说明
    * @return {num} 返回值说明
    * */
    G.check.isTouchDevice = function(){
        return ("createTouch" in win.document);
    }
    /*
    * author will.jiang
    * 日期 14-4-23 下午2:58
    * 功能描述 检验是否是桌面平台，也就是os是否为mac、windows、Unix、Linux
    * @param {num} 参数1说明
    * @return {num} 返回值说明
    * */
    G.check.isDesktop = function(){
       return ua().isDesktop;
    }

    /*
     * author will.jiang
     * 日期 14-4-23 下午5:23
     * 功能描述 Return a boolean value, true if mobile device.
     * @param {num} 参数1说明
     * @return {num} 返回值说明
     * */
    G.check.isMobile = function(){
        return ua().isMobile;
    }
    /*
    * author will.jiang
    * 日期 14-4-23 下午5:23
    * 功能描述 Return a boolean value, true if desktop device
    * @param {num} 参数1说明
    * @return {num} 返回值说明
    * */
    G.check.isTablet = function(){
        return ua().isTablet;
    }

    /*
    * author will.jiang
    * 日期 14-4-23 下午5:24
    * 功能描述 Return the current available width of the game viewport in pixels.
    * @param {num} 参数1说明
    * @return {num} 返回值说明
    * */
    G.check.availWidth = function(){
        return  document.documentElement.clientWidth;
    }
    /*
    * author will.jiang
    * 日期 14-4-23 下午5:24
    * 功能描述 Return the current available height of the game viewport in pixels.
    * @param {num} 参数1说明
    * @return {num} 返回值说明
    * */
    G.check.availHeight = function(){
        return  document.documentElement.clientHeight;
    }
    /*
    * @author will.jiang
    * 日期 14-6-5 下午2:24
    * 功能描述 得到当前环境语言标识
    * @param {num} 参数1说明
    * @return {num} 返回值说明
    * */
    G.check.code = function(){
        return  G.check.getSystemLanguage();
    }
    /*
    * @author will.jiang
    * 日期 14-4-28 下午2:21
    * 功能描述 获取本地化的内容
    * @param {num} 参数1说明
    * @return {num} 返回值说明
    * */
    G.locale.get=function(str){
        var language =G.check.code();
        //这里需要返回配置模块中的文本json对象的特定语言版本内容、
        /*
        * cfg[language][str];
        * */

    }
    /*
    * @author will.jiang
    * 日期 14-4-28 下午4:27
    * 功能描述
    * @param num{num} 需要处理的数字
    * @param decimals{num} 保留几位小数 可选，默认为0位
    * @return {String} 返回值说明
    * */
    G.locale.formatNumber =function(num,decimals){
        var num = isNaN(num)?"0":parseFloat(num).toString();
        var eRs = /(\d+)\.?(\d*)/g.exec(num);
        //整数
        var z = eRs[1];
        //小数
        var x=eRs[2];
        //处理小数的内容。位数不够需要用0补齐，如果不需要小数，应该把其置为false
        if(decimals){
            var temp = parseFloat(num);
            //自动截取并4舍5入
            x = temp.toFixed(decimals).toString();
            x = x.substring(x.indexOf("."));
        }else{
            x = 0;
        }

        //整数部分，需要每3位进行分割如21.311.313
        //先将数字反向
        z = z.split("").reverse().join("");
        //用正则来添加，号
        var rz = z.replace(/(\d{3})/g,"$1,");
        //如果最后刚好多了个，号，需要删除它
        rz = rz.replace(/,$/,"");
        rz = rz.split("").reverse().join("");
        //如果需要处理小数位，则把处理好的小数位结果拼接到最终的输出结果中
        if(x){
            rz+=x;
        }
       return rz;
    }


    /*
    * @author will.jiang
    * 日期 14-4-29 上午10:24
    * 功能描述 得到当前区域符合的货币符号
    * @param {num} 参数1说明
    * @return {num} 返回值说明
    * */
    G.locale.getCurrency=function(){
        var currencyList = {
            'zh-cn':"￥",//中国内陆
            'zh-tw':"NT",//台湾
            "zh-hk":"HK$",//香港
            "ja-jp":"?",//日本
            "en_gb":"?",//英国
            "fr_fr":"?",//法语
            'en-us':"$"//USA
        }
        var language = G.check.getSystemLanguage();
        return  currencyList[language]? currencyList[language]:"?";
    }

    /*
     * @author will.jiang
     * 日期 14-4-28 下午5:45
     * 功能描述
     * @param num{int|sting} 需要处理的数据，会被处理掉整数部分，按3位分割
     * @param numberOnly{boolean} 是否需要显示当前的货币符号
     * @return {num} 返回值说明
     * */
    G.locale.formatCurrency=function(num,numberOnly){
        var rs = G.locale.formatNumber(num);
        if(numberOnly){
            rs = G.locale.getCurrency()+rs;
        }
        return rs;
    }
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
        var flag = typeof win.addEventListener != "undefined";
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
            var flag = typeof win.removeEventListener !="undefined";
            return function(container,eventType,handle){
                if(flag){
                    container.removeEventListener(eventType,handle,false);
                }else{
                    container.detachEvent("on"+eventType,handle);
                }
            }
    }());
    //移除所有事件的！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
    /*
    * 添加自适应的内容
    * */
     /*
     * @author will.jiang
     * 日期 14-4-29 下午4:08
     * 功能描述
     * @param el{DOM} 传入canvas外部的一层元素，该元素控制canvas的整体缩放和自动居中
     * @param protectW{int}  受保护的显示面积的宽
     * @param protectH{int}  受保护的显示面的高
     * @return null
     * */
    var autoResize = JClass.extend({
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

    })

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
    }());



    var $empty = function(){};

    /*
    * @author will.jiang
    * 日期 14-4-29 下午5:22
    * 功能描述  动态加载脚本的事件
    * @param {sting} 脚本的ur地址
    * @param {function} 加载完毕后的事件
    * */
     function loadScript(url,success){
        var callback = success||$empty;
        var script = document.createElement('script');
        script.type="text/javascript";
         //先进行事件绑定，IE浏览器
         if(script.readyState){
             script.onreadystatechange=function(){
                 if (script.readyState == "loaded" || script.readyState == "complete"){
                     script.onreadystatechange = null;
                     callback();
                 }
             }
         }
         else {
             //非IE
             script.onload=function(){callback()};
         }
        script.src=url;
        win.document.getElementsByTagName('head')[0].appendChild(script);
     }
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
             this.events = {};
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
                 var list = this.events[type];
                 if(!list) list=[];
                 if(typeof fn =="function")list.push(fn);
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
                 var list = this.events[type];
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
                 var list = this.events;
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
          * @return {num} 返回值说明
          * */
         fireEvent:function(type){
             if(typeof type =="string"){
                 var list = this.events[type];
                 if(list){
                     for(var i= 0,max=list.length;i<max;i++){
                         list[i](type);
                     }
                 }
             }
         }
     })

/*
* 继承的实现
* */
    function extend(child,parent){
        var F =function(){ };
        F.prototype = parent.prototype;
        child.prototype = new F();
        //构造函数的指向修正
        child.prototype.constructor = child;
    }
    /*
    * @author will.jiang
    * 日期 14-6-5 下午5:49
    * 功能描述 深度拷贝
    * @param p{obj} 要拷贝的父类
    * @param c{obj} 要拷贝的子类
    * @return {num} 拷贝后的子类
    * */
    function deepCopy(p, c) {
        var c = c||{};
        for(var i in p){
            if(typeof p[i] === "object"){
                c[i] = (p[i].constructor == Array)?[]:{};
                deepCopy(p[i],c[i]);
            }else{
                c[i] = p[i];
            }
        }
        return c
    }






      //暴露到外部的接口
    win.GDK=G;
}(window))

