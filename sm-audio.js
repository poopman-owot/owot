var mSrc = "https://cdn.jsdelivr.net/gh/poopman-owot/owot/sm/"
var mute = false;
var gameover = false;
var coinSound = document.createElement("audio");
coinSound.setAttribute("class", "audio");
coinSound.src = mSrc + "coin.mp3";
coinSound.loop = false;
coinSound.onended = function () {
    if (!gameover) { music.play() } else { playsound("gameover") }
}

var dieSound = document.createElement("audio");
dieSound.setAttribute("class", "audio");
dieSound.src = mSrc + "game-over.mp3";
dieSound.loop = false;
dieSound.onended = function () {
    if (!gameover) { music.play() } else { playsound("gameover") }
}
dieSound.addEventListener("canplay", function () { }, true);
document.body.appendChild(dieSound);

var music = document.createElement("audio");
music.setAttribute("class", "audio");
music.src = mSrc + "theme.mp3";
music.loop = true;
music.addEventListener("canplay", function () { }, true);
document.body.appendChild(music);

var jumpSound = document.createElement("audio");
jumpSound.setAttribute("class", "audio");
jumpSound.src = mSrc + "jump.mp3";
jumpSound.loop = false;
jumpSound.addEventListener("canplay", function () { }, true);
document.body.appendChild(jumpSound);

var messageSound = document.createElement("audio");
messageSound.setAttribute("class", "audio");
messageSound.src = mSrc + "message-block.mp3"
messageSound.loop = false;
messageSound.addEventListener("canplay", function () { }, true);
document.body.appendChild(messageSound);

var kickSound = document.createElement("audio");
kickSound.setAttribute("class", "audio");
kickSound.src = mSrc + "kick-shell.mp3"
kickSound.loop = false;
kickSound.addEventListener("canplay", function () { }, true);
document.body.appendChild(kickSound);

var breakSound = document.createElement("audio");
breakSound.setAttribute("class", "audio");
breakSound.src = mSrc + "break.mp3"
breakSound.loop = false;
breakSound.addEventListener("canplay", function () { }, true);
document.body.appendChild(kickSound);

var lifeSound = document.createElement("audio");
lifeSound.setAttribute("class", "audio");
lifeSound.src = mSrc + "1up.mp3"
lifeSound.loop = false;
lifeSound.addEventListener("canplay", function () { }, true);
document.body.appendChild(lifeSound);

var gameOverSound = document.createElement("audio");
gameOverSound.setAttribute("class", "audio");
gameOverSound.src = mSrc + "game-over.mp3"
gameOverSound.loop = false;
gameOverSound.addEventListener("canplay", function () { }, true);
document.body.appendChild(gameOverSound);

var powerUpSound = document.createElement("audio");
powerUpSound.setAttribute("class", "audio");
powerUpSound.src = mSrc + "flypowerup.mp3"
powerUpSound.loop = false;
powerUpSound.addEventListener("canplay", function () { }, true);
document.body.appendChild(powerUpSound);

var becomeBig = document.createElement("audio");
becomeBig.setAttribute("class", "audio");
becomeBig.src = mSrc + "becomeBig.mp3"
becomeBig.loop = false;
becomeBig.addEventListener("canplay", function () { }, true);
document.body.appendChild(powerUpSound);

var pauseSound = document.createElement("audio");
pauseSound.setAttribute("class", "audio");
pauseSound.src =  mSrc + "pause.mp3"
pauseSound.loop = false;
pauseSound.addEventListener("canplay", function () { }, true);
document.body.appendChild(pauseSound);

var dudSound = document.createElement("audio");
dudSound.setAttribute("class", "audio");
dudSound.src =  mSrc + "dud.mp3"
dudSound.loop = false;
dudSound.addEventListener("canplay", function () { }, true);

var stomp = document.createElement("audio");
stomp.setAttribute("class", "audio");
stomp.src =  mSrc + "stomp.mp3"
stomp.loop = false;

var enterPipe = document.createElement("audio");
enterPipe.setAttribute("class", "audio");
enterPipe.src =  mSrc + "enter-pipe.mp3"
enterPipe.loop = false;

var exitPipe = document.createElement("audio");
exitPipe.setAttribute("class", "audio");
exitPipe.src =  mSrc + "tunnel.mp3"
exitPipe.loop = false;

dudSound.addEventListener("canplay", function () { }, true);
document.body.appendChild(pauseSound);
var tubeSound = document.createElement("audio");
tubeSound.setAttribute("class", "audio");
tubeSound.src = mSrc + "tunnel.mp3"
tubeSound.loop = false;
tubeSound.addEventListener("canplay", function () { }, true);
document.body.appendChild(tubeSound);

var appearSound = document.createElement("audio");
appearSound.setAttribute("class", "audio");
appearSound.src =  mSrc + "item-appear.mp3" 
appearSound.loop = false;
appearSound.addEventListener("canplay", function () { }, true);
document.body.appendChild(appearSound);

var bigSound = document.createElement("audio");
appearSound.setAttribute("class", "audio");
appearSound.src =  mSrc + "becomeBig.mp3" 
appearSound.loop = false;
appearSound.addEventListener("canplay", function () { }, true);
document.body.appendChild(appearSound);

var powerDownSound = document.createElement("audio");
powerDownSound.setAttribute("class", "audio");
powerDownSound.src =  mSrc + "power-down.mp3" 
powerDownSound.loop = false;
powerDownSound.addEventListener("canplay", function () { }, true);
document.body.appendChild(powerDownSound);


function playsound(type) {
    if (mute) { return }
    if (type == "coin") {
        coinSound.pause();
        coinSound.currentTime = 0;

        coinSound.play()
    }
    if (type == "die") {
        music.pause();
        dieSound.pause();
        dieSound.currentTime = 0;
        dieSound.play()
    }

    if (type == "music") {
        music.pause();
        music.currentTime = 0;
        music.play()
    }
    if (type == "jump") {
        jumpSound.pause();
        jumpSound.currentTime = 0;
        jumpSound.play()
    }
    if (type == "message") {
        messageSound.pause();
        messageSound.currentTime = 0;
        messageSound.play()
    }
    if (type == "kick") {
        kickSound.pause();
        kickSound.currentTime = 0;
        kickSound.play()
    }
    if (type == "1up") {
        lifeSound.pause();
        lifeSound.currentTime = 0;
        lifeSound.play()
    }
    if (type == "gameover") {
        gameOverSound.pause();
        gameOverSound.currentTime = 0;
        gameOverSound.play()
    }
    if (type == "pause") {
        pauseSound.pause();
        pauseSound.currentTime = 0;
        pauseSound.play()
    }
    if (type == "tube") {
        tubeSound.pause();
        tubeSound.currentTime = 0;
        tubeSound.play()
    }
    if (type == "powerup") {
        powerUpSound.pause();
        powerUpSound.currentTime = 0;
        powerUpSound.play()
    }
    if (type == "appear") {
        appearSound.pause();
        appearSound.currentTime = 0;
        appearSound.play()
    }
    if (type == "powerdown") {
        powerDownSound .pause();
        powerDownSound .currentTime = 0;
        powerDownSound .play()
    }
    
}
function setMute(value = true) {
    mute = value
    if (mute) {
        
        music.pause();
    }
    else {
        if (!paused) {
            console.log("playing")
            music.play();
        }
    }
}
