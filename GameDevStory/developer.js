function Developer(){
    if(this instanceof Developer){
        return this.init.apply(this,Array.prototype.slice.call(arguments));
    }else{
        return new Developer();
    }
}
Developer.prototype={
    init:function(devloperCfg){
        console.log(devloperCfg);
        var cfg = devloperCfg||{};
        this.name = cfg.name||"user1";//姓名
        this.body = config.getBody(cfg.body)||config.getBody(0);//服装类型。也就代表了不同的人物模型
        this.face = config.getFace(cfg.face)||config.getFace(0);
        this.power = cfg.power||15;//体力值
        this.salary = cfg.salary||20;//年薪
        this.job = 'Write';//当前的工作。
        var jobs = {
            'Writer':0,//作家
            'Coder':0,//程序
            'Comic':0,//原画
            'Musician':0,//音乐，
            'Director':0,//前面内容5级后出现总监
            'Producer':0,//5级后出现 制作人
            'HardEng':0,//5级后出现 硬件工程师
            'Hacker':0//5级后出现 硬件工程师黑客
        };
        GDK.combin(jobs,cfg.jobs||{});
        //自动拼合每个人员的工作情况。传入的jobs对象可以只有部分类容比如{Coder:3}
        this.jobs = jobs;
        this.skills = cfg.skills||[1,1,1,1];//对应4个技能的指标 program,scenario,graphics,sound


        this.playing = null;//记录动画索引。用于清除

        this.mod = new createjs.Container();
        this.body.y = 12;
        this.mod.addChild(this.body);
        this.face.x = 2;
        this.mod.addChild(this.face);
        console.log(this.mod);
    },
    //清除所有动画
    stop:function(){
        //得到索引进行清除操作
        var playing = this.playing;
        //...
    },
    /*
     * @author will.jiang
     * 日期 2014 11 13 上午9:11
     * 功能描述 走动的帧动画。
     * @param {num} 方向 1、2、3、4 分别对应上、右、下、左
     * @return {num} 返回值说明
     * */
    walk:function(direction){

            //先停止前面的动画
            this.stop();
            switch (direction){
                case "left":
                    //配置动画需要的参数等...
                    this.body.gotoAndPlay("goLeft");
                    this.face.gotoAndStop(0);
                    break;
                case "right":
                    this.body.gotoAndPlay("goRight");
                    this.face.gotoAndStop(3);
                    break;
                case "up":
                    this.body.gotoAndPlay("goUp");
                    this.face.gotoAndStop(2);
                    break;
                case "down":
                    this.body.gotoAndPlay("goDown");
                    this.face.gotoAndStop(1);
                    break;
                default :

            }
            //完成后执行新动画

            //...最后把动画的引用绑定好。每个都有这个操作，就不重复实现了。
            //this.playing=XXX;

    },
    /*
     * @author will.jiang
     * 日期 2014 11 13 上午9:30
     * 功能描述 坐在凳子上的张望动作
     * @param {num} 参数1说明
     * @return {num} 返回值说明
     * */
    look:function(){
        this.stop();
    },
    /*
     * @author will.jiang
     * 日期 2014 11 13 上午9:37
     * 功能描述 燃烧吧小宇宙,各种爆发
     * @param {string} 爆发时增长的类型。如 游戏性、音乐、图像、bug、升级数据等
     * @return {num} 返回值说明
     * */
    fire:function(type){
        this.stop();
    },
    /*
     * @author will.jiang
     * 日期 2014 11 13 上午10:00
     * 功能描述 敲代码的动作。具有方向性
     * @param {num} 1：朝上的代码敲击 3：朝下的代码敲击
     * @return {num} 返回值说明
     * */
    coding:function(direction){

    }


}
