/**
 * Created by yuhang.liu on 14-11-10.
 */
var MenuScene = Class.extend({
   init:function() {
       this.content = new createjs.Container();
       this.content.visible = false;
       this.content.scaleX = 4;
       this.content.scaleY = 4;

       this.buttonLayer = new createjs.Container();
       this.titleLayer = new createjs.Container();

       this.content.addChild(new createjs.Bitmap("source/images/desktop/title0.png"));

       this.content.addChild(this.buttonLayer);
       this.content.addChild(this.titleLayer);

       game.sceneLayer.addChild(this.content);



       this.titleSprite = config.getTitleSprite();
       this.titleBitmap = this.titleSprite.clone();
       this.titleBitmap.gotoAndStop(12);
       this.titleBitmap.y = -20;
       this.titleLayer.addChild(this.titleBitmap);
       this.girl = this.titleSprite.clone();
       this.girl.gotoAndStop(1);
       this.girl.x = 200;
       this.girl.y = 25;
       this.titleLayer.addChild(this.girl);
       this.kairo = this.titleSprite.clone();
       this.kairo.gotoAndStop(2);
       this.kairo.x = 220;
       this.kairo.y = 25;
       this.titleLayer.addChild(this.kairo);
       this.monkey = this.titleSprite.clone();
       this.monkey.gotoAndPlay("monkeyMove");
       this.monkey.x = 10;
       this.monkey.y = 82;
       this.titleLayer.addChild(this.monkey);


       this.titleUpAndDown();

       this.newGameButton = buttonCreater.createButton(this.buttonLayer, config.getNewGameButton(), true, "normal", "BGS00");
       this.continueButton = buttonCreater.createButton(this.buttonLayer, config.getContinueButton(), true, "normal", "BGS00");
       this.highScoresButton = buttonCreater.createButton(this.buttonLayer, config.getHighScoresButton(), true, "normal", "BGS00");

       this.newGameButton.addEventListener("pressup",this.newGame);

   },

    titleUpAndDown:function() {
        createjs.Tween.get(this.titleLayer,{loop:true})
            .to({y:10},2000)
            .to({y:0},2000)
    },

    newGame:function() {
        game.gotoScene("stage1Scene");
        uiManager.content.visible = true;
    }
});