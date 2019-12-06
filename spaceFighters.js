

var bulletList = [];
var jewelList = [];
var shipList = [];
var points = 0;
var lives = 3;
var player;
var hurtful = "•,💥";
var healing = "+,❤,⛨";
var empty = " ";
var blocking = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890█▓░!@#$%^&*()_`~:;?/\\{}[]".split("").toString();
var isdead = false;
var jewelTypes = ["https://i.imgur.com/2GDomr6.gif", "https://i.imgur.com/JZBIunh.gif", "https://i.imgur.com/qGUaEiD.gif"];
var shipImages = {
    "⮜": "https://i.imgur.com/r5njDVc.png?1",
    "⮟": "https://i.imgur.com/QkzGTas.png?1",
    "⮞": "https://i.imgur.com/JHKqEt1.png?1",
    "⮝": "https://i.imgur.com/sQeXwvx.png"
}
//elm.textInput.value = '$u"\'user\':\''+state.userModel.username+'\',\'points\':\'1234567\'"⛨'

var html = [
    '<div id="sf-centeredPopup"><div id="sf-version">Version a.01</div><div id="sf-instructions">Double-click to start.</div></div>',

];


var style = [
    '<style>',
    '#sf-centeredPopup {    display: block; position: absolute; width: 400px; height: 300px; background-color: red; top: 50%; left: 50%; z-index: 999; margin-left: -200px; margin-top: -150px;background-image: url(https://i.imgur.com/ZMsZ2YK.png); background-size: contain;}',
    '#sf-version { color: #0089ff; padding: 10px; text-align: center; font-family: monospace; float: left; width: 100%; }',
    '#sf-instructions { color: #fbff00; padding: 10px; text-align: center; font-family: monospace; margin-top: 256px; font-weight: bold; }',
    '</style>'
];


html = html.join("");
style = style.join("");
document.body.insertAdjacentHTML('afterbegin', (html + style));

function updatePoints() {
    document.getElementById("coins").innerText = points;
}

function updateLives() {
    if (lives < 1) {

        die();
    }
    document.getElementById("lives").innerText = lives;
}




function die() {
    document.getElementById("lives").innerText = "0";
    dieSound.replay();

    setTimeout(function () {
        renderCursor(player.position)
        elm.textInput.value = '$u"\'user\':\'' + state.userModel.username + '\',\'points\':\'' + points + '\'"⛨'
        setTimeout(function () {


            //writeCharTo("⛨", 0, player.position[0], player.position[1], player.position[2], player.position[3]);
            location.reload()
        }, 2500)

    }, 2500)

    player.die()
    lives = 0;
    isdead = true;
    unload();
    w.day();
    w.input.disabled = true
    themeSong.sound.pause();




}

function getCharLink(tileX, tileY, charX, charY) {
    if (tileX == void 0 && tileY == void 0 && charX == void 0 && charY == void 0) {
        if (!cursorCoords) return -1;
        tileX = cursorCoords[0];
        tileY = cursorCoords[1];
        charX = cursorCoords[2];
        charY = cursorCoords[3];
    }
    var tile = tiles[[tileY, tileX]];
    if (!tile) return 0
    if (tile && tile.properties && tile.properties.cell_props) {
        if (tile.properties.cell_props[charY] && tile.properties.cell_props[charY][charX]) {
            var link = tile.properties.cell_props[charY][charX];
            if (link.link) {
                link = link.link
                if (link.type == "url") {
                    return tile.properties.cell_props[charY][charX].link.url
                }
            }
        }
    }
}


function localWriteChar(tileX, tileY, charX, charY, char, color) {
    if (!tiles[tileY + "," + tileX]) return;
    var tile = tiles[tileY + "," + tileX];
    var content = advancedSplit(tile.content);
    content[charY * tileC + charX] = char;
    tile.content = content.join("");
    if (!color) color = 0;
    if (!tile.properties.color) tile.properties.color = Object.assign([], blankColor);
    tile.properties.color[charY * tileC + charX] = color;
    renderTile(tileX, tileY, true);
}


function isOfType(list, char) {
    return ((list.split(",").indexOf(char) > -1) || char.length < 1)
}

function negMod(x, y) {
    return x - Math.floor(x / y) * y;
}

function SoundEffect(src, shouldLoop = false, startAt = 0) {

    this.replay = function () {
        this.sound = document.createElement("audio");
        this.sound.setAttribute("class", "audio");
        this.sound.src = src;
        this.sound.loop = shouldLoop;
        this.sound.pause();
        this.sound.currentTime = startAt;
        this.sound.play();
    }


}
themeSong = new SoundEffect("https://ia801002.us.archive.org/12/items/quadratox-space_cell/%E2%98%92%20-%20%EF%BC%B3%EF%BC%B0%EF%BC%A1%EF%BC%A3%EF%BC%A5%20%EF%BC%A3%EF%BC%A5%EF%BC%AC%EF%BC%AC%20-%20%E7%9B%AE%E3%83%8F%E3%83%AD%E3%83%BC%E3%82%B0%E3%83%AA%E3%83%BC%E3%83%B3.mp3", true, 0);
bulletFire = new SoundEffect("https://archive.org/download/Spacefighters/bulletFire.mp3");
bulletExplode = new SoundEffect("https://archive.org/download/Spacefighters/bulletExplode.mp3");
shipMove = new SoundEffect("https://archive.org/download/Spacefighters/shipMove.mp3", false, 4.9);
hurtSound = new SoundEffect("https://archive.org/download/Spacefighters/hurtSound.mp3")
healSound = new SoundEffect("https://archive.org/download/Spacefighters/healSound.mp3")
coinSound = new SoundEffect("https://archive.org/download/Spacefighters/coinSound.mp3")
dieSound = new SoundEffect("https://archive.org/download/Spacefighters/dieSound.mp3")

themeSong.replay();

function space() {

    styles.owner = "#111"
    styles.member = "#222"
    styles.public = "#000"
    styles.menu = "#000"
    styles.text = "#333"
    styles.guestCursor = "#222"
    styles.cursor = "#222"
    w.redraw(); //

    var canvas = document.getElementById("owot"),
        context = canvas.getContext("2d"),
        img = new Image();
    img.src = 'https://i.imgur.com/Q7eHz2U.png';
    imgW = 160;
    imgH = 144;
    imgSlow = 2;
    w.on("tilesRendered", function () {
        if (!isdead) {
            var ptrn = context.createPattern(img, 'repeat');
            context.fillStyle = ptrn;
            var offsetX = negMod(positionX, imgW * imgSlow) - imgW * imgSlow; //
            var offsetY = negMod(positionY, imgH * imgSlow) - imgH * imgSlow; //
            context.save();
            context.translate(offsetX / imgSlow, offsetY / imgSlow)
            context.fillRect(0, 0, canvas.width + imgW * imgSlow, canvas.height + imgW * imgSlow); //
            context.restore();
        }
    })
    renderTiles();
}

class EventHandlerClass {
    constructor() {
        this.functionMap = {};
    }
    addEventListener(event, func) {
        this.functionMap[event] = func;
        document.addEventListener(event.split('.')[0], this.functionMap[event]);
    }
    removeEventListener(event) {
        document.removeEventListener(event.split('.')[0], this.functionMap[event]);
        delete this.functionMap[event];
    }
}
const EventHandler = new EventHandlerClass();

function unload() {
    w.input.disabled = false;
    EventHandler.removeEventListener('keydown.spacefighters');
    console.log("SpaceFighters Unloaded.")
}

EventHandler.addEventListener("dblclick.spacefighters", function () {
    Load();
    EventHandler.removeEventListener('dblclick.spacefighters');
});

function Load() {

    var html = [
        '<div id="centeredPopup"></div>',
        '<link href="https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap" rel="stylesheet">',
        '<div class="cell m-mario"></div>',
        '<div id="m-topbar"> <div id="lives-section" class="outline"><h1>LIVES</h1>',
        '<div style="position: relative;float: left;color: white;">x</div><h2 id="lives"style=" color: white; ">3</h2></div>',
        '<div id="points-section" class="outline">',
        '<div id="coin-icon">&nbsp;</div><div style=" float: left; position: relative; margin-left: 4px; ">x <div id="coins">0</div></div>'
    ];


    var style = [
        '<style>',

        '#m-topbar { position: fixed;z-index: 2; width: 0px; height: 0px; background: transparent; top: 0; left: 0; font-family: "Press Start 2P", cursive; font-size: 10px; padding: 10px; line-height: 1.3; }',
        '#lives-section { color: red; }',
        '.outline{ text-shadow: 2px -2px 0 #000000, -2px 2px 0 #000000, -2px -2px 0 #000000, 2px 0px 0 #000000, 0px 2px 0 #000000, -2px 0px 0 #000000, 0px -2px 0 #000000, 0px 0px 4px rgb(0, 0, 0); }',
        '#coin-icon {background: url(https://i.imgur.com/Wrq208j.gif);display: block;width: 11px;height: 13px;background-size: contain;float: left;position: relative;}',
        'points-section { position: static; }',
        '#points-section { position: fixed; right: 69px; color: white; padding: 10px; float: right; top: 0px; line-height: 1.6em; letter-spacing: 0.3em; }',
        '#coins { position: relative; float: right; }',
        '</style>'
    ];
    html = html.join("");
    style = style.join("");
    document.body.insertAdjacentHTML('afterbegin', (html + style));
    w.input.disabled = true;
    space();
    document.getElementById("sf-centeredPopup").remove();

    EventHandler.addEventListener("keydown.spacefighters", function (e) {

        if (e.code == "Escape") {
            unload();
            return
        }

        keyDownEvents(e);


    });

    function Bullet() {
        this.points = 0;
        _this = this;
        this.position = player.getMoveDirection(player.direction);
        this.getMoveDirection = function (direction) {
            var cSCopy = this.position.slice();
            // [tileX, tileY, charX, charY]

            if (direction == "up") {
                cSCopy[3]--;
                if (cSCopy[3] < 0) {
                    cSCopy[3] = tileR - 1;
                    cSCopy[1]--
                }
            } else if (direction == "down") {
                cSCopy[3]++;
                if (cSCopy[3] > tileR - 1) {
                    cSCopy[3] = 0;
                    cSCopy[1]++;
                }
            } else if (direction == "left") {
                cSCopy[2]--;
                if (cSCopy[2] < 0) {
                    cSCopy[2] = tileC - 1;
                    cSCopy[0]--;
                }
            } else if (direction == "right") {
                cSCopy[2]++;
                if (cSCopy[2] > tileC - 1) {
                    cSCopy[2] = 0;
                    cSCopy[0]++;
                }
            }

            return (cSCopy);
        }

        this.clear = function () {
            if (isdead) {
                return
            }
            var flamepos = this.position;
            var flamChar = "•"
            if (this.direction == "left") {
                flamChar = "•"
            }
            if (this.direction == "right") {
                flamChar = "•"
            }
            if (this.direction == "up") {
                flamChar = "•"
            }
            if (this.direction == "down") {
                flamChar = "•"
            }



            writeCharTo(" ", 0, this.position[0], this.position[1], this.position[2], this.position[3]);
        }
        this.move = function (dir) {
            if (isdead) {
                return
            }
            this.clear();
            this.direction = dir;
            var d = this.getMoveDirection(dir);
            this.cellData = (getChar(d[0], d[1], d[2], d[3]));
            if (this.cellData !== " " && this.cellData !== " " && this.cellData !== "=" && this.cellData !== "-" && this.cellData !== "‖" && this.cellData !== "|" && this.cellData !== "⛨") {
                if (this.cellData !== "💥") {
                    points += ~~(Math.random() * 1000);

                    updatePoints();
                }
                this.lifetime = 0;

            }
            var flamChar = " "
            if (dir == "left") {
                flamChar = "•"
            }
            if (dir == "right") {
                flamChar = "•"
            }
            if (dir == "up") {
                flamChar = "•"
            }
            if (dir == "down") {
                flamChar = "•"
            }
            writeCharTo(flamChar, 0, d[0], d[1], d[2], d[3]);
            this.position = d;;
        }

        this.fire = function (dir) {

            var _this = this;
            this.lifetime = 100;
            if (dir == "left " || dir == "right") {
                this.lifetime *= 2;
            }
            var fireinterval = function () {
                setTimeout(function () {
                    if (_this.lifetime > 0) {
                        _this.lifetime--;
                        _this.move(dir)
                        fireinterval();
                    } else {
                        var d = _this.position;
                        writeCharTo("💥", 0, d[0], d[1], d[2], d[3]);
                        bulletExplode.replay();

                        setTimeout(function () {
                            _this.clear();
                        }, 1000)

                    }
                }, 200)
            }
            fireinterval();
        }

    }

    function Player() {

        _this = this;
        this.die = function () {
            setTimeout(function () {
                renderCursor(player.position);
                elm.textInput.value = '$u"\'user\':\'' + state.userModel.username + '\',\'points\':\'' + points + '\'"⛨';
                renderCursor(player.position);


            }, 500)
        }
        this.takeDamage = true;
        this.position = [];
        this.hurt = function () {
            if (this.takeDamage) {
                points -= 100;
                updatePoints();
                lives -= 1;
                updateLives();
                hurtSound.replay();
                this.takeDamage = false;
                setTimeout(function () {
                    player.takeDamage = true;
                }, 1000)
            }
        }
        this.start = function () {
            this.position = currentPosition;
            this.direction = "right";
            this.isBlocked = false;
            this.getMoveDirection = function (direction) {
                this.direction = direction

                var cSCopy = this.position.slice();
                // [tileX, tileY, charX, charY]

                if (direction == "up") {

                    cSCopy[3]--;
                    if (cSCopy[3] < 0) {
                        cSCopy[3] = tileR - 1;
                        cSCopy[1]--
                    }
                } else if (direction == "down") {
                    cSCopy[3]++;
                    if (cSCopy[3] > tileR - 1) {
                        cSCopy[3] = 0;
                        cSCopy[1]++;
                    }
                } else if (direction == "left") {
                    cSCopy[2]--;
                    if (cSCopy[2] < 0) {
                        cSCopy[2] = tileC - 1;
                        cSCopy[0]--;
                    }
                } else if (direction == "right") {
                    cSCopy[2]++;
                    if (cSCopy[2] > tileC - 1) {
                        cSCopy[2] = 0;
                        cSCopy[0]++;
                    }
                }

                return (cSCopy);
            }
            if (player.isBlocked) { return }
            writeCharTo(">", 0, this.position[0], this.position[1], this.position[2], this.position[3]);
            localWriteChar(">", 16777215, this.position[0], this.position[1], this.position[2], this.position[3]);
        }
        this.clear = function () {
            if (player.isBlocked) { return }
            if (isdead) {
                return
            }
            var flamepos = this.position;
            var flamChar = "="
            if (this.direction == "left") {
                flamChar = "=";
                positionX += cellW
            }
            if (this.direction == "right") {
                flamChar = "=";
                positionX -= cellW
            }
            if (this.direction == "up") {
                flamChar = "║";
                positionY += cellH
            }
            if (this.direction == "down") {
                flamChar = "║";
                positionY -= cellH
            }
            writeCharTo(flamChar, 16711680, flamepos[0], flamepos[1], flamepos[2], flamepos[3]);
            localWriteChar(flamChar, 16777215, flamepos[0], flamepos[1], flamepos[2], flamepos[3]);
            setTimeout(function () {
                if (flamChar == "=") {
                    flamChar = "-"
                }
                if (flamChar == "║") {
                    flamChar = "|"
                }
                writeCharTo(flamChar, 16755627, flamepos[0], flamepos[1], flamepos[2], flamepos[3]);
                localWriteChar(flamChar, 16777215, flamepos[0], flamepos[1], flamepos[2], flamepos[3]);
            }, 250)
            setTimeout(function () {
                writeCharTo(" ", 0, flamepos[0], flamepos[1], flamepos[2], flamepos[3]);

            }, 500)
        }
        this.move = function (dir) {
            if (isdead) {
                return
            }
            shipMove.replay();
            this.direction = dir;


            var d = this.getMoveDirection(dir);
            this.cellData = (getChar(d[0], d[1], d[2], d[3]));
            player.isBlocked = isOfType(blocking, this.cellData)
            if (player.isBlocked) {
                writeCharTo(ship[dir], 0, this.position[0], this.position[1], this.position[2], this.position[3]);
                return
            }










            if (isOfType(healing, this.cellData)) {
                if (!(getCharLink(d[0], d[1], d[2], d[3]) == void 0)) {
                    var linkURL = getCharLink(d[0], d[1], d[2], d[3]).replace(/'/gm, "\"")
                    var data = JSON.parse("{" + linkURL + "}");
                    points += parseInt(data.points);
                }
                points += 250;
                updatePoints();
                healSound.replay();
                lives += 1;
                updateLives();
            }
            else if (isOfType(hurtful, this.cellData)) {
                player.hurt();
            }
            else if (!isOfType(blocking, this.cellData) && !isOfType(empty, this.cellData)) {
                points += 100;
                updatePoints();
                coinSound.replay();
            }
            this.clear();
            writeCharTo(ship[dir], 0, d[0], d[1], d[2], d[3]);
            this.position = d;
        }



    }
    var currentKey;

    player = new Player();
    player.start();
    var keys = {};
    keys.w = "up";
    keys.s = "down";
    keys.a = "left";
    keys.d = "right";
    keys.fire = "Space"

    var ship = {};
    ship.up = "⮝";
    ship.down = "⮟";
    ship.left = "⮜";
    ship.right = "⮞";

    function keyDownEvents(key) {
        if (keys[key.key]) {
            currentKey = keys[key.key];

        }
        if (key.code == keys.fire) {
            bullet = new Bullet();
            bullet.fire(player.direction);
            bulletFire.replay()
        }

    }

    function checkPlayerCell() {

        var cell = getChar(player.position[0], player.position[1], player.position[2], player.position[3]);
        if (isOfType(hurtful, cell)) {
            player.hurt();
        }
    }

    function Jewel(tileX, tileY, charX, charY) {
        this.tileX = tileX;
        this.tileY = tileY;
        this.charX = charX;
        this.charY = charY;
        this.position = [tileX, tileY, charX, charY];

        var elmOffset = tileAndCharsToWindowCoords(tileX, tileY, charX, charY);
        var element = document.createElement("div");
        document.body.appendChild(element);
        element.style.position = "absolute";
        element.style.left = positionX + elmOffset[0] + "px";
        element.style.top = positionY + elmOffset[1] + "px";
        element.style.width = cellW - 4 + "px";
        element.style.height = cellH - 4 + "px";
        element.style.backgroundImage = "url(" + jewelTypes[~~(Math.random() * jewelTypes.length)] + ")";
        element.style.backgroundPosition = "center";
        element.style.backgroundSize = "contain";
        element.style.backgroundRepeat = "no-repeat"
        w.on("tilesRendered", function () {
            elmOffset = tileAndCharsToWindowCoords(tileX, tileY, charX, charY);
            element.style.left = elmOffset[0] + "px";
            element.style.top = elmOffset[1] + "px";
        });
        var sparkle = function () { element.style.backgroundImage = "url(https://i.imgur.com/uSJuVr1.gif)"; };
        var destroy = function () { element.remove(); };

        this.cellected = function () {
            sparkle();
            setTimeout(destroy, 1000)
        }

    }
    function BulletHtml(tileX, tileY, charX, charY) {
        this.tileX = tileX;
        this.tileY = tileY;
        this.charX = charX;
        this.charY = charY;
        this.position = [tileX, tileY, charX, charY];

        var elmOffset = tileAndCharsToWindowCoords(tileX, tileY, charX, charY);
        var element = document.createElement("div");
        document.body.appendChild(element);
        element.style.position = "absolute";
        element.style.left = positionX + elmOffset[0] + "px";
        element.style.top = positionY + elmOffset[1] + "px";
        element.style.width = cellW - 4 + "px";
        element.style.height = cellW - 4 + "px";
        element.style.backgroundImage = "url(https://i.imgur.com/GNEgpRB.gif)";
        element.style.backgroundPosition = "center";
        element.style.backgroundSize = "contain";
        element.style.backgroundRepeat = "no-repeat"
        w.on("tilesRendered", function () {
            elmOffset = tileAndCharsToWindowCoords(tileX, tileY, charX, charY);
            element.style.left = elmOffset[0] + "px";
            element.style.top = elmOffset[1] + "px";
        });
        this.destroy = function () { element.remove(); };

    }

    function ShipHtml(image, tileX, tileY, charX, charY) {
        this.tileX = tileX;
        this.tileY = tileY;
        this.charX = charX;
        this.charY = charY;
        this.position = [tileX, tileY, charX, charY];

        var elmOffset = tileAndCharsToWindowCoords(tileX, tileY, charX, charY);
        var element = document.createElement("div");
        document.body.appendChild(element);
        element.style.position = "absolute";
        element.style.left = positionX + elmOffset[0] + "px";
        element.style.top = positionY + elmOffset[1] + "px";
        element.style.width = cellW + "px";
        element.style.height = cellW + "px";
        element.style.backgroundImage = "url(" + image + ")";
        element.style.backgroundPosition = "center";
        element.style.backgroundSize = "cover";
        element.style.backgroundRepeat = "no-repeat"
        w.on("tilesRendered", function () {
            elmOffset = tileAndCharsToWindowCoords(tileX, tileY, charX, charY);
            element.style.left = elmOffset[0] + "px";
            element.style.top = elmOffset[1] + "px";
        });
        this.destroy = function () { element.remove(); };

    }

    function findCharsInViewport(pattern, caseInsensitive, ignoreCombining) {
        var re = new RegExp(pattern);
        var visible = getVisibleTiles();
        var chars = [];
        for (var i = 0; i < visible.length; i++) {
            var coord = visible[i];
            var tile = tiles[coord[1] + "," + coord[0]];
            if (!tile) continue;
            var con = advancedSplit(tile.content, false, ignoreCombining);
            for (var p = 0; p < con.length; p++) {

                if ((caseInsensitive && re.test(con[p])) || (!caseInsensitive && re.test(con[p]))) continue;
                var cx = p % tileC;
                var cy = Math.floor(p / tileC);
                chars.push([coord[0], coord[1], cx, cy]);

            }
        }
        return chars;
    }
    function renderJewels() {
        var chr = findCharsInViewport("^[\x00-\x7F]*[█▓░⮜⮟⮞⮝•║ 💥]*$", true, true);
        for (var i = 0; i < chr.length; i++) {
            if (getCharColor(chr[i][0], chr[i][1], chr[i][2], chr[i][3]) !== 1) {
                var jewel = new Jewel(chr[i][0], chr[i][1], chr[i][2], chr[i][3]);
                localWriteChar(chr[i][0], chr[i][1], chr[i][2], chr[i][3], "♦", 1)
                jewelList.push(jewel);

            }

        }
        w.redraw();
    }

    function renderBullets() {
        var chr = findCharsInViewport("[^•]", true, true);
        for (var i = 0; i < chr.length; i++) {
            var bulletHtml = new BulletHtml(chr[i][0], chr[i][1], chr[i][2], chr[i][3]);
            bulletList.push(bulletHtml);
        }




        w.redraw();
        var i = bulletList.length
        while (i--) {
            if (/[^•]/.test(getChar(bulletList[i].tileX, bulletList[i].tileY, bulletList[i].charX, bulletList[i].charY))) {
                bulletList[i].destroy();
                bulletList.splice(i, 1);
            }
        }
    }

    function renderShip() {
        var chr = findCharsInViewport("[^⮞⮜⮟⮝]", true, true);
        for (var i = 0; i < chr.length; i++) {
            var shipImg = shipImages[getChar(chr[i][0], chr[i][1], chr[i][2], chr[i][3])];
            var shipHtml = new ShipHtml(shipImg, chr[i][0], chr[i][1], chr[i][2], chr[i][3]);
            shipList.push(shipHtml);
        }




        w.redraw();
        var i = shipList.length
        while (i--) {
            if (/[^⮞⮜⮟⮝]/.test(getChar(shipList[i].tileX, shipList[i].tileY, shipList[i].charX, shipList[i].charY))) {
                shipList[i].destroy();
                shipList.splice(i, 1);
            }
        }
    }

    function destroyBullets() {
        for (i = 0; i < bulletList.length; i++) {
            bulletList[i].destroy();
        }
    };
    function destroyShips() {
        for (i = 0; i < shipList.length; i++) {
            shipList[i].destroy();
        }
    };

    function checkJewels() {
        var i = jewelList.length
        while (i--) {
            if (/^[\x00-\x7F]*[█▓░⮜⮟⮞⮝•║ ]*$/.test(getChar(jewelList[i].tileX, jewelList[i].tileY, jewelList[i].charX, jewelList[i].charY))) {
                jewelList[i].cellected();
                jewelList.splice(i, 1);
            }
        }
    }
    setInterval(checkJewels, 1000);
    w.on("fetch", function () {
        renderJewels();
        destroyBullets();

    });

    var tick = function () {
        if (isdead) {
            return
        }
        setTimeout(function () {
            if (currentKey) {

                player.move(currentKey);


                currentKey = null;
            }

            renderTiles()
            checkPlayerCell();
            clearTiles()
            renderBullets();
            renderShip();
            tick();


        }, 50)
    }
    tick();


};
