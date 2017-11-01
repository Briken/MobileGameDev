var canvas;
var canvasContext;
var canvasX;
var canvasY;
var mouseIsDown = 0;

var sPumpkin;
var bkgdImage;
var sJackSkellington;
var sOggieBoogie;

var sprites;
var pumpkins = [];

var lastPt = null;
var gameOverScreen = false;

var score = 0;
var lives = 3;

var startTimeMS;

//window.onload =
function load() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    init();

    canvasX = canvas.width / 2;
    canvasY = canvas.height - 30;

    if (!gameOverScreen) {
        gameLoop();
    }
}

function aSprite(x, y, imageSRC, velx, vely) {
    this.zindex = 0;
    this.x = x;
    this.y = y;
    this.vx = velx;
    this.vy = vely;
    this.sImage = new Image();
    this.sImage.src = imageSRC;

    this.leftEdge = x;
    this.rightEdge = x + imageSRC.width;
    this.topEdge = y;
    this.bottomEdge = y + imageSRC.height;
}
aSprite.prototype.renderF = function (width, height) {
    canvasContext.drawImage(this.sImage, this.x, this.y, width, height);
}
aSprite.prototype.render = function () {
    canvasContext.drawImage(this.sImage, this.x, this.y);
}
aSprite.prototype.update = function (deltaTime) {
    this.x += deltaTime * this.vx;
    this.y += deltaTime * this.vy;
}

function init() {

    if (canvas.getContext) {
        //Set Event Listeners for window, mouse and touch

        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('orientationchange', resizeCanvas, false);

        canvas.addEventListener("touchstart", touchDown, false);
        canvas.addEventListener("touchmove", touchXY, true);
        canvas.addEventListener("touchend", touchUp, false);

        document.body.addEventListener("touchcancel", touchUp, false);

        resizeCanvas();

        bkgdImage = new aSprite(0, 0, "BkgdGY.png", 0, 0);
        sJackSkellington = new aSprite(25, canvas.height - 140, "JackSkellington.png", 0, 0);
        sOggieBoogie = new aSprite(canvas.width, sJackSkellington.y, "Oogie_Boogie76x64.png", -50, 0);
        sPumpkin = new aSprite(sJackSkellington.x + sJackSkellington.sImage.width / 2, sJackSkellington.y + (sJackSkellington.sImage.height / 2), "HalloweenPumpkinScary.png", 25, 0);
        startTimeMS = Date.now();
        sprites = [sJackSkellington, sOggieBoogie, sPumpkin];
        pumpkins.push(sPumpkin);
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function gameLoop() {
    console.log("gameLoop");
    var elapsed = (Date.now() - startTimeMS) / 1000;
    update(elapsed);
    render(elapsed);
    startTimeMS = Date.now();
    requestAnimationFrame(gameLoop);
}

function render(delta) {
    bkgdImage.renderF(canvas.width, canvas.height);
    sPumpkin.render();
    sJackSkellington.render();
    sOggieBoogie.render();
}

function update(delta) {
    sPumpkin.update(delta);
    sOggieBoogie.update(delta);
    collisionDetection();
}

function collisionDetection() {
    var arrayLength = sprites.length;
    console.log ("collision detection");
    for (var j = 0; j < arrayLength; j++)
    {
        var rect1 = {x: sprites[j].x, y: sprites[j].y, width: sprites[j].sImage.width, height: sprites[j].sImage.height}
        for (var i = 0; i < arrayLength; i++)
        {
         var rect2 = {x: sprites[i].x, y: sprites[i].y, width: sprites[i].sImage.width, height: sprites[i].sImage.height}
            if (rect1.x > rect2.x + rect2.width &&
                  rect1.x + rect1.width < rect2.x &&
                  rect1.y > rect2.y + rect2.height &&
                  rect1.height + rect1.y < rect2.y)
            {
                console.log (sprites[i] + " & " + sprites[j] + " collided" )
                canvasContext.clearRect(sprites[i].x, sprites[i].y, sprites[i].sImage.width, sprites[i].sImage.height);
                canvasContext.clearRect(sprites[j].x, sprites[j].y, sprites[j].sImage.width, sprites[j].sImage.height);
            }
        }
    }
}

function styleText(txtColour, txtFont, txtAlign, txtBaseline) {
    canvasContext.fillStyle = txtColour;
    canvasContext.font = txtFont;
    canvasContext.textAlign = txtAlign;
    canvasContext.textBaseline = txtBaseline;
}

function touchUp(evt) {
    evt.preventDefault();
    // Terminate touch path
    lastPt = null;
}



function touchDown(evt) {
    evt.preventDefault();
    var nPumpkin = new aSprite(sJackSkellington.x + sJackSkellington.sImage.width / 2, sJackSkellington.y + (sJackSkellington.sImage.height / 2), "HalloweenPumpkinScary.png", 25, 0);
    pumpkins.push(nPumpkin);
   // if (gameOverScreenScreen) {
        //player1Score = 0;
        //player2Score = 0;
        //showingWinScreen = false;
   //     return;
  //  }
    touchXY(evt);
}

function touchXY(evt) {
    evt.preventDefault();
    if (lastPt != null) {
        var touchX = evt.touches[0].pageX - canvas.offsetLeft;
        var touchY = evt.touches[0].pageY - canvas.offsetTop;
    }
    lastPt = { x: evt.touches[0].pageX, y: evt.touches[0].pageY };
}