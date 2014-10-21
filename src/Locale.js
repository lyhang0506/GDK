/**
 * Created by will.jiang on 14-10-21.
 * 国际化工具
 * require Check.js
 */
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
};


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
    };
    var language = G.check.getSystemLanguage();
    return  currencyList[language]? currencyList[language]:"?";
};

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
};