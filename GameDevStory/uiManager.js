var UiManager = Class.extend({
    init:function() {
        this.content = new createjs.Container();
        this.content.visible = false;
        this.content.scaleX = 4;
        this.content.scaleY = 4;

        this.userInterface0 = new createjs.Container();
        this.user_topBanner = new createjs.Container();
        this.user_bottomBanner = new createjs.Container();
        this.userInterface0.addChild(this.user_topBanner);
        this.userInterface0.addChild(this.user_bottomBanner);
        this.content.addChild(this.userInterface0);


        this.interface0Sprite = config.getInterface0Sprite();

        var topBannerBG = this.interface0Sprite.clone();
        topBannerBG.gotoAndStop(0);
        this.user_topBanner.addChild(topBannerBG);


        this.text_money = textCreater.createText(this.user_topBanner, "$500", "10px ARIAL UNICODE MS", "#000000", 230, textCreater.adjustTextPosition(2,10), 200, "right");
        this.text_date = textCreater.createText(this.user_topBanner, "2014-11-11", "10px ARIAL UNICODE MS", "#000000", 10, textCreater.adjustTextPosition(2,10), 200, "left");


        var bottomBannerBG = this.interface0Sprite.clone();
        bottomBannerBG.gotoAndStop(1);
        bottomBannerBG.y = 198;
        this.user_bottomBanner.addChild(bottomBannerBG);

        textCreater.createText(this.user_bottomBanner, "年销量", "10px ARIAL UNICODE MS", "#000000", 10, textCreater.adjustTextPosition(205,10), 200, "left");
        textCreater.createText(this.user_bottomBanner, "年盈利", "10px ARIAL UNICODE MS", "#000000", 10, textCreater.adjustTextPosition(220,10), 200, "left");
        this.text_yrSales = textCreater.createText(this.user_bottomBanner, "0", "10px ARIAL UNICODE MS", "#000000", 150, textCreater.adjustTextPosition(205,10), 200, "right");
        this.text_yrProfit = textCreater.createText(this.user_bottomBanner, "$0.0k", "10px ARIAL UNICODE MS", "#000000", 150, textCreater.adjustTextPosition(220,10), 200, "right");
        this.text_noProject = textCreater.createText(this.user_bottomBanner, "No Project", "12px ARIAL UNICODE MS", "#000000", 170, textCreater.adjustTextPosition(210,12), 200, "left");

        this.partingLine = new createjs.Shape();
        this.partingLine.graphics.beginFill("#FFCC00").drawRect(158, 200, 2, 38);
        this.user_bottomBanner.addChild(this.partingLine);

        game.uiLayer.addChild(this.content);
        console.log(game.stage);
    }
});