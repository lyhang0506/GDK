this.Util = this.Util || {};

(function () {
    var ButtonCreater = function () {
    };

    var b = ButtonCreater.prototype;

    b.buttonArr = [];

    b.createButton = function (content, buttonDetail, addText, state, sound) {
        var self = this;
        var button;

        button = new createjs.Container();
        var sprite = new createjs.Sprite(new createjs.SpriteSheet({
            frames: buttonDetail.frames,
            images: [buttonDetail.image]
        }));

        var normal = sprite.clone();
        normal.gotoAndStop(0);
        var press = sprite.clone();
        press.gotoAndStop(1);
        var disable = sprite.clone();
        disable.gotoAndStop(2);
        var buttonAnimationArr = [];
        buttonAnimationArr.push(normal);
        buttonAnimationArr.push(press);
        buttonAnimationArr.push(disable);
        for (var i in buttonAnimationArr) {
            button.addChild(buttonAnimationArr[i]);
            if (i != 0) {
                buttonAnimationArr[i].visible = false;
            }

        }

        if (addText) {
            button.addChild(
                new createjs.Text("", buttonDetail.font, buttonDetail.color)
            );
            button.getChildAt(3).text = buttonDetail.text;
            //button.getChildAt(3).skewX = 15;
            button.getChildAt(3).x = buttonDetail.textX;
            button.getChildAt(3).y = textCreater.adjustTextPosition(buttonDetail.textY,buttonDetail.fontSize);
            button.getChildAt(3).lineWidth = buttonDetail.lineWidth;
            button.getChildAt(3).textBaseline = buttonDetail.baseLine;
            button.getChildAt(3).textAlign = buttonDetail.align;
            button.getChildAt(3).scaleY = buttonDetail.scaleY;
            button.getChildAt(3).mouseEnabled = false;
            button.hasText = true;
        }

        button.id = buttonDetail.id;

        button.sound = sound;
        button.state = state;

        if(button.state == "disable") {
            self.disableButton(button);
        }else if(button.state == "normal") {
            self.enableButton(button);
        }

        button.baseY = textCreater.adjustTextPosition(buttonDetail.textY,buttonDetail.fontSize);
        button.downY = textCreater.adjustTextPosition((buttonDetail.textY + buttonDetail.textDown),buttonDetail.fontSize);

        button.x = buttonDetail.btnX;
        button.y = buttonDetail.btnY;

        button.addEventListener("pressup", self.buttonPressed.bind(self), true);
        button.addEventListener("mouseover", self.mouseOver.bind(self), true);
        button.addEventListener("mousedown", self.mouseDown.bind(self), true);

        self.buttonArr.push(button);

        content.addChild(button);
        return button;
    }

    b.mouseDown = function (event) {
        var self = this;
        if (event.nativeEvent.button == 0) {
            if (event.target.parent.state != "disable") {
                self.pressButton(event.target.parent);
                if (event.target.parent.hasText) {
                    event.target.parent.getChildAt(3).y = event.target.parent.downY;
                }
            }
        }

    }


    b.mouseOver = function (event) {
        event.target.parent.cursor = "pointer";
    }

    b.buttonPressed = function (event) {
        var self = this;
        if (event.nativeEvent.button == 0) {
            if (event.target.parent.state != "disable") {
                self.buttonAction(event);
            }
        }
    }

    b.buttonAction = function (event) {
        var self = this;
        self.enableButton(event.target.parent);
        /*if (GDK.settings.menu.get(GDK.SETTINGS_PANELS.SOUND, 'sfxOn')) {
            GDK.audio.play(event.target.parent.sound);
        }*/
        if (event.target.parent.hasText) {
            event.target.parent.getChildAt(3).y = event.target.parent.baseY;
        }
    }

    b.disableAllButtons = function (buttonArr) {
        var self = this;
        for (var i in buttonArr) {
            buttonArr[i].state = "disable";
            self.disableButton(buttonArr[i]);
        }
    }

    b.enableAllButtons = function (buttonArr) {
        var self = this;
        for (var i in buttonArr) {
            buttonArr[i].state = "normal";
            self.enableButton(buttonArr[i]);
        }
    }

    b.disableButton = function (button) {
        button.state = "disable";
        button.getChildAt(0).visible = false;
        button.getChildAt(1).visible = false;
        button.getChildAt(2).visible = true;
    }

    b.enableButton = function (button) {
        button.state = "normal";
        button.getChildAt(0).visible = true;
        button.getChildAt(1).visible = false;
        button.getChildAt(2).visible = false;
    }

    b.pressButton = function (button) {
        button.getChildAt(0).visible = false;
        button.getChildAt(1).visible = true;
        button.getChildAt(2).visible = false;
    }


    Util.ButtonCreater = ButtonCreater;

}());