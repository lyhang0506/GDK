
function startGame() {
    var loadSuccess = function() {
        game.gotoScene("loadScene");
    };
    var loadError = function() {

    };
    var assetLoader = new GDK.AssetLoader();
    assetLoader.addImage("source/images/desktop/title0.png");
    assetLoader.addImage("source/images/desktop/kairo.png");
    assetLoader.start(loadSuccess,loadError);
}