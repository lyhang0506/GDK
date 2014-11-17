var Config = Class.extend({

    bitmaps: null,

    init: function () {
        /*this.bitmaps = this.getBitMaps();*/
        this.developers = this.getDevelopers();
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
    },

    getDevelopers:function() {
        return[
            [{
                key:"p_1_0",
                name:"金肛狼",
                body:7,
                face:8,
                power:40,
                salary:100,
                job:'Coder',
                jobs:{
                    Writer:1,
                    Coder:1,
                    Director:1
                },
                skills:[40,20,50,20]
            },
                {
                    key:"p_1_1",
                    name:"钢铁瞎",
                    body:0,
                    face:9,
                    power:70,
                    salary:500,
                    job:'Director',
                    jobs:{
                        Writer:1,
                        Coder:1,
                        Director:1
                    },
                    skills:[35,60,50,25]
                },
                {
                    key:"p_1_2",
                    name:"插教授",
                    body:10,
                    face:4,
                    power:60,
                    salary:300,
                    job:'Director',
                    jobs:{
                        Writer:4,
                        Coder:4,
                        Director:4
                    },
                    skills:[60,80,80,88]
                },
                {
                    key:"p_1_3",
                    name:"绿举人",
                    body:6,
                    face:20,
                    power:70,
                    salary:200,
                    job:'Director',
                    jobs:{
                        Writer:1,
                        Coder:3,
                        Director:2
                    },
                    skills:[80,60,10,10]
                },
                {
                    key:"p_1_4",
                    name:"章鱼boss",
                    body:14,
                    face:24,
                    power:60,
                    salary:400,
                    job:'Director',
                    jobs:{
                        Writer:1,
                        Coder:1,
                        Director:2
                    },
                    skills:[80,80,10,78]
                },
                {
                    key:"p_1_5",
                    name:"曼哈顿boss",
                    body:5,
                    face:9,
                    power:40,
                    salary:400,
                    job:'Coder',
                    jobs:{
                        Writer:2,
                        Coder:3,
                        Director:2
                    },
                    skills:[90,98,100,102]
                }
            ],
            [
                {
                    key:"p_2_0",
                    name:"黑寡妇",
                    body:2,
                    face:5,
                    power:60,
                    salary:500,
                    job:'Hacker',
                    jobs:{
                        'Writer':5,//作家
                        'Coder':5,//程序
                        'Comic':5,//原画
                        'Musician':5,//音乐，
                        'Director':5,//前面内容5级后出现总监
                        'Producer':5,//5级后出现 制作人
                        'HardEng':5,//5级后出现 硬件工程师
                        'Hacker':1//
                    },
                    skills:[250,250,250,250]
                },
                {
                    key:"p_2_1",
                    name:"霉国队长",
                    body:3,
                    face:18,
                    power:80,
                    salary:500,
                    job:'Director',
                    jobs:{
                        Write:5,
                        Coder:3,
                        Director:2
                    },
                    skills:[142,143,98,88]
                }
            ],
            []
        ]
    },

   getBody:function(index) {
       var spriteSheet = new createjs.SpriteSheet(
           {
               "images": ["source/images/desktop/body"+index+".png"],
               "frames": [
                   [0, 0, 16, 16],
                   [16, 1, 16, 16],
                   [32, 1, 16, 16],
                   [0, 16, 16, 17],
                   [16, 17, 16, 17],
                   [32, 17, 16, 17],
                   [0, 33, 16, 17],
                   [16, 34, 16, 16],
                   [32, 34, 16, 16],
                   [0, 50, 16, 16],
                   [16, 51, 16, 16],
                   [32, 51, 16, 16],
                   [49,0,15,20],
                   [65,0,15,20],
                   [81,0,19,21],
                   [48,21,17,17],
                   [48,38,17,13],
                   [48,51,17,14],
                   [65,20,16,12],
                   [65,33,16,12],
                   [65,46,17,13],
                   [82,21,19,20],
                   [82,42,20,22]
                   ],
               "animations": {
                   goRight: [0, 2],
                   goDwon: [3, 5],
                   goLeft: [6, 8],
                   goUp: [9, 11],
                   drink:[11,13,false],
                   turn1:[14],
                   turn2:[15],
                   writeCode1:{
                       frames:[16,19]
                   },
                   writeCode2:{
                       frames:[17,18]
                   },
                   lazy1:[20],
                   lazy2:[21]
               }
           }
       )
       var sprite = new createjs.Sprite(spriteSheet);
       sprite.framerate = 3;
       return sprite;
   },

    getFace:function(index) {
        var spriteSheet = new createjs.SpriteSheet(
            {
                "images": ["source/images/desktop/face_"+index+".png"],
                "frames": [
                    [3,0,13,14],
                    [16,0,13,14],
                    [35,0,13,14],
                    [48,0,13,14],
                    [1,15,13,14],
                    [19,15,13,14],
                    [34,15,13,14],
                    [50,15,13,14],
                    [66,15,13,14]
                ],
                "animations": {
                    left:[0],
                    down:[1],
                    up:[2],
                    right:[3],
                    laugh:[4],
                    jump:[5],
                    faceToFace:[6],
                    cry:[7],
                    unHappy:[8]
                }
            }
        )
        var sprite = new createjs.Sprite(spriteSheet);
        return sprite;
    }
});