/**
 * Created by will.jiang on 14-10-21.
 * 客户端环境校验工具
 */
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
    };
    /*
     * @author will.jiang
     * 日期 14-4-28 下午2:40
     * 功能描述 得到当前系统的语言版本，转换为全小写的模式，方便复用。
     * @param {num} 参数1说明
     * @return {num} 返回值说明
     * */
    function getLanguage(){
        var lan = window.navigator.language?window.navigator.language:window.navigator.browserLanguage;
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
}(window));

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
};

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
};


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
};
/*
 * @author will.jiang
 * 日期 14-4-28 下午2:34
 * 功能描述 得到系统的语言版本
 * @param {num} 参数1说明
 * @return {num} 返回值说明
 * */
G.check.getSystemLanguage=function(){
    return ua().language;
};
/*
 * author will.jiang
 * 日期 14-4-23 上午10:20
 * 功能描述 得到当前系统的名称
 * @return {String} 系统的名字:如Mac、Unix、Linux、
 * */
G.check.getOS = function(){
    return ua().platform.fullname;
};

/*
 * author will.jiang
 * 日期 14-4-23 下午2:11
 * 功能描述 是否是支持触屏的设备
 * @param {num} 参数1说明
 * @return {num} 返回值说明
 * */
G.check.isTouchDevice = function(){
    return ("createTouch" in window.document);
};
/*
 * author will.jiang
 * 日期 14-4-23 下午2:58
 * 功能描述 检验是否是桌面平台，也就是os是否为mac、windows、Unix、Linux
 * @param {num} 参数1说明
 * @return {num} 返回值说明
 * */
G.check.isDesktop = function(){
    return ua().isDesktop;
};

/*
 * author will.jiang
 * 日期 14-4-23 下午5:23
 * 功能描述 Return a boolean value, true if mobile device.
 * @param {num} 参数1说明
 * @return {num} 返回值说明
 * */
G.check.isMobile = function(){
    return ua().isMobile;
};
/*
 * author will.jiang
 * 日期 14-4-23 下午5:23
 * 功能描述 Return a boolean value, true if desktop device
 * @param {num} 参数1说明
 * @return {num} 返回值说明
 * */
G.check.isTablet = function(){
    return ua().isTablet;
};

/*
 * author will.jiang
 * 日期 14-4-23 下午5:24
 * 功能描述 Return the current available width of the game viewport in pixels.
 * @param {num} 参数1说明
 * @return {num} 返回值说明
 * */
G.check.availWidth = function(){
    return  document.documentElement.clientWidth;
};
/*
 * author will.jiang
 * 日期 14-4-23 下午5:24
 * 功能描述 Return the current available height of the game viewport in pixels.
 * @param {num} 参数1说明
 * @return {num} 返回值说明
 * */
G.check.availHeight = function(){
    return  document.documentElement.clientHeight;
};
/*
 * @author will.jiang
 * 日期 14-6-5 下午2:24
 * 功能描述 得到当前环境语言标识
 * @param {num} 参数1说明
 * @return {num} 返回值说明
 * */
G.check.code = function(){
    return  G.check.getSystemLanguage();
};
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

};