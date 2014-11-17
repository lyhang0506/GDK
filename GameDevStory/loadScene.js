
var LoadScene = Class.extend({
    init: function () {
        this.content = new createjs.Container();
        this.content.visible = false;
        this.content.scaleX = 4;
        this.content.scaleY = 4;
        game.sceneLayer.addChild(this.content);
        this.content.addChild(new createjs.Bitmap("source/images/desktop/title0.png"));
        var kairo = new createjs.Bitmap("source/images/desktop/kairo.png");
        kairo.x = 220;
        kairo.y = 60;
        this.content.addChild(kairo);
        this.loadBar = new createjs.Shape();
        this.loadBar.graphics.beginFill("#FFCC00").drawRect(10, 70, 200, 10);
        this.loadBar.scaleX = 0;
        this.content.addChild(this.loadBar);

    },
    createTip:function() {
    var tipLayer = new createjs.Container();

    var tip = new createjs.Text();
    tip.font = "bold 32px ARIAL UNICODE MS";
    tip.color = "#FF0033";
    tip.align = "right";
    tip.x = game.stage.canvas.width-100;
    tip.y = game.stage.canvas.height-100;

    tipLayer.addChild(tip);
        game.stage.addChild(tipLayer);
        game.stage.addEventListener("stagemousemove",function(e) {
        tip.text = "x: "+ parseInt(e.stageX)/4+" "+"y: "+ parseInt(e.stageY)/4;
        tip.x = e.stageX;
        tip.y = e.stageY;
    })
        game.stage.addEventListener("pressmove", function (e) {
        e.target.parent.x = parseInt(e.stageX)/4;
        e.target.parent.y = parseInt(e.stageY)/4;
        //e.target.x = parseInt(e.stageX);
        //e.target.y = parseInt(e.stageY);
        tip.text = "x: " + parseInt(e.stageX)/4 + " " + "y: " + parseInt(e.stageY)/4;
        tip.x = e.stageX;
        tip.y = e.stageY;
    })
    /*createjs.Ticker.addEventListener("tick",function() {
     fps++;
     });*/
    /*setInterval(function() {
     fps++;
     },1);*/
    /*setInterval(function() {
     tip.text = fps;
     fps = 0;
     },1000);*/
},

    loadSuccess:function(){
        game.gotoScene("menuScene");
        uiManager = new UiManager();
        loadScene.createTip();
        console.log("全部加载！");
    },
    loadError:function(){
        console.log("加载失败！");
    },
    preload:function() {
        this.assetLoader = new GDK.AssetLoader();
        var imgArr = [];
        for(var i =0;i<26;i++) {
            imgArr.push("body"+i+".png");
        }
        for(var i =0;i<36;i++) {
            imgArr.push("face_"+i+".png");
        }
        imgArr.push("floor0.png");
        imgArr.push("floor1.png");
        imgArr.push("floor2.png");
        imgArr.push("title1.png");
        imgArr.push("interface0.png");
        imgArr.push("desk0.png");
        this.assetLoader.addImages(imgArr,
            'source/images/desktop/');
        this.assetLoader.addFont("Aclonica regular",'source/font');
        this.assetLoader.addFont("Aldrich regular",'source/font');

        GDK.on(GDK.EVENT.LOADING_PROGRESS,function(now,count){
            loadScene.loadBar.scaleX = now/count;
            console.log("当前加载到第"+now+"个，总共"+count+"个");
        });
        this.assetLoader.start(this.loadSuccess,this.loadError);
    }
});
