this.Util = this.Util || {};

(function () {
    var TextCreater = function () {
    }

    var t = TextCreater.prototype;

    t.createText = function (textContainer, text, font, color, x, y, lineWidth, align) {
        var createText = new createjs.Text("", font, color);
        createText.text = text;
        createText.x = x;
        createText.y = y;

        createText.lineWidth = lineWidth;
        createText.textBaseline = "top";
        createText.textAlign = align;

        textContainer.addChild(createText);
        return createText;
    }

    t.adjustTextPosition = function(oy,fontSize) {
        if(GDK.check.isDesktop()) {
            switch (GDK.check.getBrowser()) {
                case "Firefox":
                    oy = oy+fontSize/5;
                    break;
                case "Chrome":
                    break;
            }
        }else if(GDK.check.isMobile()) {
            switch (GDK.check.getBrowser()) {
                case "Firefox":
                    break;
                case "Chrome":
                    oy = oy+fontSize/8;
                    break;
                case "Safari":
                    break;
            }
        }else if(GDK.check.isTablet()) {
            switch (GDK.check.getBrowser()) {
                case "Firefox":
                    break;
                case "Chrome":
                    oy = oy+fontSize/8;
                    break;
                case "Safari":
                    break;
            }
        }
        return oy;
    }

    t.adjustSymbolPosition = function(oy,fontSize) {
        oy = this.adjustTextPosition(oy,fontSize);
        if(GDK.check.isDesktop()) {
            switch (GDK.check.getBrowser()) {
                case "Firefox":
                    break;
                case "Chrome":
                    oy = oy+fontSize/8;
                    break;
                case "Explorer":
                    oy = oy+fontSize/8;
                    break;
            }

        } else if (GDK.check.isMobile()) {
            switch (GDK.check.getBrowser()) {
                case "Safari":
                    oy = oy + fontSize/8;
                    break;
            }
        }else if(GDK.check.isTablet()) {
            switch (GDK.check.getBrowser()) {
                case "Safari":
                    oy = oy + Math.ceil(fontSize/8);
                    break;
            }
        }
        return oy;
    }

    Util.TextCreater = TextCreater;
}());