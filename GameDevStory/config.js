var Config = Class.extend({

    bitmaps: null,

    init: function () {
        /*this.bitmaps = this.getBitMaps();*/
    },

    getTitleSprite:function() {
        var spriteSheet = new createjs.SpriteSheet(
            {
                "images": ["source/images/desktop/title1.png"],
                "frames": [
                    [2, 228, 16, 8],
                    [228, 205, 14, 25],
                    [210, 205, 16, 26],
                    [176, 205, 32, 23],
                    [142, 205, 32, 23],
                    [108, 205, 32, 23],
                    [210, 180, 32, 23],
                    [176, 180, 32, 23],
                    [142, 180, 32, 23],
                    [108, 180, 32, 23],
                    [2, 204, 104, 22],
                    [2, 180, 104, 22],
                    [2, 22, 240, 156]
                ],
                "animations": {

                    "console":[0],
                    "girl":[1],
                    "kairo":[2],
                    "monkeyMove":[3,9,true],
                    "title":[12]
                }
            }
        )

        var sprite = new createjs.Sprite(spriteSheet);
        sprite.framerate = 5;
        return sprite;
    },

    getDeskSprite:function() {
        var spriteSheet = new createjs.SpriteSheet(
            {
                "images": ["source/images/desktop/desk0.png"],
                "frames": {
                    width:50,
                    height:46
                }
            }
        )

        var sprite = new createjs.Sprite(spriteSheet);
        return sprite;
    },

    getChairSprite:function() {
        var spriteSheet = new createjs.SpriteSheet(
            {
                "images": ["source/images/desktop/chair.png"],
                "frames": [
                    [0,4,14,23],
                    [14,0,15,27],
                    [29,0,15,27],
                    [44,0,9,15],
                    [0,29,19,23],
                    [19,27,17,25],
                    [36,27,17,25],
                    [53,27,12,16],
                    [0,54,21,25],
                    [21,52,20,27],
                    [41,52,20,27],
                    [61,52,16,20]
                ]
            }
        )

        var sprite = new createjs.Sprite(spriteSheet);
        return sprite;
    },

    getInterface0Sprite:function() {
        var spriteSheet = new createjs.SpriteSheet(
            {
                "images": ["source/images/desktop/interface0.png"],
                "frames": [
                    [0, 0, 240, 22],
                    [0, 22, 240, 42],
                    [0, 64, 240, 42]
                    ]
            }
        )

        var sprite = new createjs.Sprite(spriteSheet);
        sprite.framerate = 5;
        return sprite;
    },

    getNewGameButton: function () {
        return {
            id: "newGameButton",
            image: "source/images/desktop/title1.png",
            btnX: 70,
            btnY: 100,
            text: "新游戏",
            font: "bold 15px ARIAL UNICODE MS",
            fontSize:"15",
            color: "#ffffff",
            baseLine: "top",
            align: "center",
            scaleY: 1,
            lineWidth: 185,
            textX: 50,
            textY: 3,
            textDown: 0,
            frames: [
                [2, 204, 104, 22],
                [2, 180, 104, 22],
                [2, 180, 104, 22]
            ]
        };
    },

    getContinueButton: function () {
        return {
            id: "newGameButton",
            image: "source/images/desktop/title1.png",
            btnX: 70,
            btnY: 125,
            text: "继续游戏",
            font: "bold 15px ARIAL UNICODE MS",
            fontSize:"15",
            color: "#ffffff",
            baseLine: "top",
            align: "center",
            scaleY: 1,
            lineWidth: 185,
            textX: 50,
            textY: 3,
            textDown: 0,
            frames: [
                [2, 204, 104, 22],
                [2, 180, 104, 22],
                [2, 180, 104, 22]
            ]
        };
    },

    getHighScoresButton: function () {
        return {
            id: "newGameButton",
            image: "source/images/desktop/title1.png",
            btnX: 70,
            btnY: 150,
            text: "最高分",
            font: "bold 15px ARIAL UNICODE MS",
            fontSize:"15",
            color: "#ffffff",
            baseLine: "top",
            align: "center",
            scaleY: 1,
            lineWidth: 185,
            textX: 50,
            textY: 3,
            textDown: 0,
            frames: [
                [2, 204, 104, 22],
                [2, 180, 104, 22],
                [2, 180, 104, 22]
            ]
        };
    }
});