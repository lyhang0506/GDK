var Stage1Scene = Class.extend({
    init:function() {
        this.content = new createjs.Container();
        this.content.y = 88;
        this.content.visible = false;
        this.content.scaleX = 4;
        this.content.scaleY = 4;

        this.content.addChild(new createjs.Bitmap("source/images/desktop/floor0.png"));

        this.object0Layer = new createjs.Container();
        this.people0Layer = new createjs.Container();
        this.object1Layer = new createjs.Container();
        this.object2Layer = new createjs.Container();
        this.people1Layer = new createjs.Container();
        this.object3Layer = new createjs.Container();
        this.object4Layer = new createjs.Container();
        this.people2Layer = new createjs.Container();

        this.content.addChild(this.object0Layer);
        this.content.addChild(this.people0Layer);
        this.content.addChild(this.object1Layer);
        this.content.addChild(this.object2Layer);
        this.content.addChild(this.people1Layer);
        this.content.addChild(this.object3Layer);
        this.content.addChild(this.object4Layer);
        this.content.addChild(this.people2Layer);

        var deskSprite = config.getDeskSprite();
        this.bossDesk = deskSprite.clone();
        this.bossDesk.gotoAndStop(2);
        this.bossDesk.x = 40;
        this.bossDesk.y = 47;
        this.object1Layer.addChild(this.bossDesk);
        this.clerkDesk0 = deskSprite.clone();
        this.clerkDesk0.gotoAndStop(0);
        this.clerkDesk0.x = 115;
        this.clerkDesk0.y = 62;
        this.object1Layer.addChild(this.clerkDesk0);
        this.clerkDesk1 = deskSprite.clone();
        this.clerkDesk1.gotoAndStop(0);
        this.clerkDesk1.x = 78;
        this.clerkDesk1.y = 79;
        this.object1Layer.addChild(this.clerkDesk1);
        this.clerkDesk2 = deskSprite.clone();
        this.clerkDesk2.gotoAndStop(1);
        this.clerkDesk2.x = 130;
        this.clerkDesk2.y = 69;
        this.object2Layer.addChild(this.clerkDesk2);
        this.clerkDesk3 = deskSprite.clone();
        this.clerkDesk3.gotoAndStop(1);
        this.clerkDesk3.x = 93;
        this.clerkDesk3.y = 87;
        this.object2Layer.addChild(this.clerkDesk3);

        var chairSprite = config.getChairSprite();
        this.bossChair = chairSprite.clone();
        this.bossChair.gotoAndStop(1);
        this.bossChair.x = 45;
        this.bossChair.y = 48;
        this.object0Layer.addChild(this.bossChair);
        this.clerkChair0 = chairSprite.clone();
        this.clerkChair0.gotoAndStop(1);
        this.clerkChair0.x = 120;
        this.clerkChair0.y = 62;
        this.object0Layer.addChild(this.clerkChair0);
        this.clerkChair1 = chairSprite.clone();
        this.clerkChair1.gotoAndStop(1);
        this.clerkChair1.x = 82;
        this.clerkChair1.y = 81;
        this.object0Layer.addChild(this.clerkChair1);
        this.clerkChair2 = chairSprite.clone();
        this.clerkChair2.gotoAndStop(0);
        this.clerkChair2.x = 160;
        this.clerkChair2.y = 92;
        this.object3Layer.addChild(this.clerkChair2);
        this.clerkChair3 = chairSprite.clone();
        this.clerkChair3.gotoAndStop(0);
        this.clerkChair3.x = 124;
        this.clerkChair3.y = 109;
        this.object3Layer.addChild(this.clerkChair3);

        game.sceneLayer.addChild(this.content);
    }
});