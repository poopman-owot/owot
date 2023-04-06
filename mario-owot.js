//--------------------------------------------INIT Variables---------------------------------------------------------------------------------
let characterList = {};
var player = null;
var blockList = {};
var globalTickIterator = 0;
var paused = true;
var mute = false;

function setFire(){}
useHighlight = false;

w.input.disabled = true;
defaultURLLinkColor = "transparent";
cursorEnabled = false;
cursorRenderingEnabled = false;
w.setFlushInterval(1)

const mirroredCanvas = document.createElement('canvas');
const marioSpecChars = "ቶዱዳጰጀደዤፃይያጶጆዸዥጵዹጺጴቆኖፂፏዶጳቇጿየዩጱዼጁድዓጸፆዾጄጷ";
superMarioChars = "⛹█▓▆▅▄□▤▦▩☵▫╞╡≣║│╔╕╚╛◠╭╮▣ቶዱዳጰጀደዤፃይያጶጆዸዥ⡀⠂⠁࿙࿚‚ጵዹጺጴቆኖፂፏዶጳቇጿᘯᙉየዩጱዼጁድዓጸፆዾጄጷ⚃⚅⩨⩩⠛⣿⚌⚊◩◨⸙";
bufferLargeChars = false;
var charImages = [];

for (block in superMarioChars) {
  charImages.push(new Image)
}

const blockers = ""
const sm_flipblock = "⚌";
const smSmall = "▫";
const sm_halfY = "▫";
const sm_random = "▣";
const sm_halfX = "▫";
const sm_coin = "▫";
const sm_backGround = "◠╭╮▫⡀⠂⠁💩࿙࿚‚ᘯ⠛⚊⸙"
const sm_destructable = "";
const sm_feather = "࿙࿚‚";
const sm_flower = "⸙";//we just added flower src. need to push to git and upgrade verion number to see it.
const sm_tube_UD = "╔╕╚╛";
const sm_tube_LR = "╞╡";
const sm_mushroom = "ᘯ";
const sm_kills = "ᙉ";
const sm_breakable_Brick = "⩨"
const sm_breakable_Brick_Stacked = "⩩"
const passthrough_erase = "▫⡀⠂⠁💩࿙࿚‚ᘯ⠛÷ቶዱዳጰጀደዤፃይያጶጆዸዥጵዹጺጴቆኖፂፏዶጳቇጿየዩጱዼጁድዓጸፆዾጄጷ⸙";
const sm_hurts = "⡀⠂⠁☵";
const sm_hurts_fire = "⡀⠂⠁☵";
const sm_lava = "☵"
const sm_wide = "ጵዹጺጴቆኖፂፏዶጳቇጿ"
const sm_enemy = "ቶዱዳጰጀደፃይያጶጆዸጵዹጺጴቆኖፂፏዶጳቇጿ"
const sm_jumpThrough = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$%^&*(){}[]:;<>,.?/\\|'\"~`-_"
//--------------------------------------------START OF HELPER FUNCTIONS----------------------------------------------------------------------

function easeInLerp(start, end, t) {
  // t is the percentage of the duration that has elapsed (between 0 and 1)
  return start + (end - start) * t * t;
}

function greaterOfTwoNumbers(a, b) {
  return Math.max(a, b);
}
const CycleImage = (imageArray, index) => {
  return imageArray[globalTickIterator % imageArray.length];
};
var muteCB = document.getElementById("m-mute");
var flyCB = document.getElementById("m-fly");
var fireCB = document.getElementById("m-fire");
var invCB = document.getElementById("m-inv");

function setMute(value = muteCB.checked){
muteCB.checked = value;
mute = value;
}
function setFly(value = flyCB.checked){
flyCB.checked = value;
player.canFly = value;
}
function setFire(value = fireCB.checked){
fireCB.checked = value;
player.flowerPower = value;
}

function setInvincibility(value = invCB.checked){
invCB.checked = value;
player.invincible = value;
}

function updateCBValues(){
muteCB = document.getElementById("m-mute");
flyCB = document.getElementById("m-fly");
fireCB = document.getElementById("m-fire");
invCB = document.getElementById("m-inv");
setFly(player.canFly);
setFire(player.flowerPower);
}
function getNearbyCells2(coord, str) {
  const [x, y, z, w] = CorrectLocation(coord);
  const cL = CorrectLocation(x, y, z, w);
  const rL = CorrectLocation(x, y, z + 1, w);
  const lL = CorrectLocation(x, y, z - 1, w);
  const bL = CorrectLocation(x, y, z, w + 1);
  const tL = CorrectLocation(x, y, z, w - 1);
  const rtL = CorrectLocation(x, y, z + 1, w - 1);
  const ltL = CorrectLocation(x, y, z - 1, w - 1);
  const rbL = CorrectLocation(x, y, z + 1, w + 1);
  const lbL = CorrectLocation(x, y, z - 1, w + 1);

  return {
    centerChar: [DoesCellContainChars(cL, str), cL],
    rightChar: [DoesCellContainChars(rL, str), rL],
    leftChar: [DoesCellContainChars(lL, str), lL],
    bottomChar: [DoesCellContainChars(bL, str), bL],
    topChar: [DoesCellContainChars(tL, str), tL],
    rightTopChar: [DoesCellContainChars(rtL, str), rtL],
    leftTopChar: [DoesCellContainChars(ltL, str), ltL],
    RightBottomChar: [DoesCellContainChars(rbL, str), rbL],
    LeftBottomChar: [DoesCellContainChars(lbL, str), lbL]
  }
}

function checkNearbyCellsForChar2(coord, str) {
  const nearbyCells = getNearbyCells2(coord, str);
  for (const key in nearbyCells) {
    if (nearbyCells[key][0][0]) {
      return true;
    }
  }
  return false;
}

function detect(characterObject, char, nearbyCell, ingoreList, drawDebug) {
  const [a, b, c, d] = nearbyCell[1]
  let bgColor = 0;
  let charDetected = false;
  if (char == "" || char == " ") {
    char = getChar(a, b, c, d);
  }

  if (nearbyCell[0][0] && !DoesCellContainChars([a, b, c, d], ingoreList)[0]) {
    bgColor = 16711680; //red

    charDetected = true;
  } else {
    bgColor = 32768; //green

    charDetected = false;
  }
  if (characterObject.isMain) {
    if (DoesCellContainChars([a, b, c, d], sm_hurts)[0]) {
      bgColor = 255; //green
      characterObject.collideWith("pain", [a, b, c, d]);
    }
    if (DoesCellContainChars([a, b, c, d], sm_hurts_fire)[0]) {
      if (DoesCellContainChars([a, b, c, d], sm_lava)[0]) {
        //for lava, we only get hurt if its directly below us.
        bgColor = 49407; //teal
      } else {
        bgColor = 255; //blue
        characterObject.collideWith("fire", [a, b, c, d]);
      }
    }
    if (DoesCellContainChars([a, b, c, d], sm_mushroom)[0]) {
      bgColor = 16744833; //pink
      characterObject.collideWith("mushroom", [a, b, c, d]);
    }    
    if (DoesCellContainChars([a, b, c, d], sm_flower)[0]) {
      bgColor = 16744833; //pink
      characterObject.collideWith("flower", [a, b, c, d]);
    }
    if (DoesCellContainChars([a, b, c, d], sm_kills)[0]) {
      bgColor = 0; //pink
      characterObject.collideWith("kill", [a, b, c, d]);
    }
    if (DoesCellContainChars([a, b, c, d], sm_feather)[0]) {
      bgColor = 16744833; //pink
      characterObject.collideWith("feather", [a, b, c, d]);
    }
  }
  if (characterObject.isMain == false) {
    if (DoesCellContainChars([a, b, c, d], marioSpecChars)[0]) {
      bgColor = 16744833; //pink

      characterObject.collideWith("kill", [a, b, c, d]);
    }
  }

  if (characterObject.isProjectile) {

  }


  if (drawDebug) {
    writeCharTo(char, "#000", a, b, c, d, 0, 0, bgColor);
  }
  return charDetected;
}

function loadScript(url, callback) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;

  script.onload = function() {
    callback();
  };

  document.head.appendChild(script);
}
// Load helper functions
loadScript(`https://cdn.jsdelivr.net/gh/poopman-owot/owot@v1.32/mario-image-src.js`, function() {
  // Load images
  loadScript(`https://cdn.jsdelivr.net/gh/poopman-owot/owot@v1.28/helper-functions.js`, function() {
    loadScript(`https://cdn.jsdelivr.net/gh/poopman-owot/owot@v1.34/mario-ui.js`, function() {
      // load sounds
      loadScript(`https://cdn.jsdelivr.net/gh/poopman-owot/owot@v1.35/sm-audio.js`, function() {
      // run init function to start game
      init();
       });
    });
  });
});

function init() {



  const GetPlayer = (id = null) => {
    const player = Object.values(characterList).find((char) => char instanceof Player && (id === null || char.id === id));
    return player || null;
  }

  const canPlayerMove = (frame, velocity) => {
    const v = Math.abs(velocity);
    if (v > 6) {
      return !((frame % Math.round(10 / (10 - v))) < ((10 - v) / 10))
    } else {
      return ((frame % Math.round(10 / v)) < (v / 10));
    }
  }




  async function tickAllObjects(list) {
if(!paused)
{    w.render();
    if (countObjectsByClass(characterList, "Fireball") == 0) {
      player.canFire = true;
    }
    if (!player.canFire) {
      deleteObjectsByClass(characterList, "Fireball")
    }

    for (const key of Object.keys(list)) {
      const o = list[key];
      await o.tick();
    }

}
    requestAnimationFrame(() => tickAllObjects(list));
  }
  async function killAllObjects(list) {
    for (const key of Object.keys(list)) {
      const o = list[key];
      if (o.constructor.name !== "Player")
        await o.die();
    }

    requestAnimationFrame(() => tickAllObjects(list));
  }

  //--------------------------------------------END OF HELPER FUNCTIONS----------------------------------------------------------------------




  //--------------------------------------------START CREATE CLASSES ------------------------------------------------------------------------

  const marioSmallCellReps = createCellReps({
    stand: ["ዓ", "የ"],
    squat: ["ጷ", "ድ"],
    run: {
      left: ["ጸ", "ፆ"],
      right: ["ዩ", "ጱ"]
    },
    jump: ["ዾ", "ዼ"],
    fall: ["ጄ", "ጁ"],
    burned: ["ዥ", "ዤ"],
    dead: " ",
  }, );


  const marioCellReps = createCellReps({
    stand: ["ፃ", "ቶ"],
    squat: ["ዸ", "ደ"],
    run: {
      left: ["ይ", "ያ"],
      right: ["ዱ", "ዳ"]
    },
    jump: ["ጶ", "ጰ"],
    fall: ["ጆ", "ጀ"],
    burned: ["ዥ", "ዤ"],
    dead: " ",
  }, );
  const marioFlyCellReps = createCellReps({
    stand: ["ፂ", "ጵ"],
    squat: ["ጿ", "ኖ"],
    run: {
      left: ["ፏ", "ዶ"],
      right: ["ዹ", "ጺ"]
    },
    jump: ["ጳ", "ጴ"],
    fall: ["ቇ", "ቆ"],
    burned: ["ዥ", "ዤ"],
    dead: " ",
  }, );
  const fireballCellReps = createCellReps({
    stand: {
      left: ["⡀", "⠂", "⠁", "⠂"],
      right: ["⡀", "⠂", "⠁", "⠂"]
    },
    squat: {
      left: ["⡀", "⠂", "⠁", "⠂"],
      right: ["⡀", "⠂", "⠁", "⠂"]
    },
    run: {
      left: ["⡀", "⠂", "⠁", "⠂"],
      right: ["⡀", "⠂", "⠁", "⠂"]
    },
    jump: {
      left: ["⡀", "⠂", "⠁", "⠂"],
      right: ["⡀", "⠂", "⠁", "⠂"]
    },
    fall: ["⠂", "⠂"],
    burned: {
      left: ["⡀", "⠂", "⠁", "⠂"],
      right: ["⡀", "⠂", "⠁", "⠂"]
    },
    dead: " ",
  }, );
  const featherCellReps = createCellReps({
    stand: "‚",
    squat: {
      left: ["࿙", "࿚"],
      right: ["࿙", "࿚"]
    },
    run: {
      left: ["࿙", "࿚"],
      right: ["࿙", "࿚"]
    },
    jump: {
      left: ["࿙", "࿚"],
      right: ["࿙", "࿚"]
    },
    fall: {
      left: ["࿙", "࿚"],
      right: ["࿙", "࿚"]
    },
    burned: {
      left: ["࿙", "࿚"],
      right: ["࿙", "࿚"]
    },
    dead: " ",
  }, );

  const MushroomCellReps = createCellReps({
    stand: "ᘯ",
    squat: "ᘯ",
    run: "ᘯ",
    jump: "ᘯ",
    fall: "ᘯ",
    burned: "ᘯ",
    dead: " ",
  }, );
  const DeathShroomCellReps = createCellReps({
    stand: "ᙉ",
    squat: "ᙉ",
    run: "ᙉ",
    jump: "ᙉ",
    fall: "ᙉ",
    burned: "ᙉ",
    dead: " ",
  }, );

  function getBlockData(character, loc) {
    let [fx, fy, fz, fw] = loc;
    const [x, y, z, w] = character.location;
    let [fx2, fy2, fz2, fw2] = CorrectLocation(fx, fy, fz, fw - 1)
    const RandomBlockData = (getJSONFromCell(fx, fy, fz, fw));
    if (RandomBlockData) {
      if (RandomBlockData.replacement) {
        writeCharTo(RandomBlockData.replacement, "#000", fx, fy, fz, fw);
      }
      if (RandomBlockData.upgrade) {

      if (!RandomBlockData.replacement) {
        writeCharTo("□", "#000", fx, fy, fz, fw);
      }

        if (RandomBlockData.upgrade == 'feather') {

          if (character.isBig) {

            const feather = new Feather(fx2, fy2, fz2, fw2);
            
          } else {
            //if you arent big, you get a mushroom

            const mushroom = new Mushroom(fx2, fy2, fz2, fw2);
          }

        } else if (RandomBlockData.upgrade == 'mushroom') {

          const mushroom = new Mushroom(fx2, fy2, fz2, fw2);
        } else if (RandomBlockData.upgrade == 'flower') {
 if (character.isBig) {

            writeCharTo("⸙", "#000", fx2, fy2, fz2, fw2);
          } else {
            //if you arent big, you get a mushroom

            const mushroom = new Mushroom(fx2, fy2, fz2, fw2);
          }

          
        } else if (RandomBlockData.upgrade == 'deathShroom') {

          const deathShroom = new DeathShroom(fx2, fy2, fz2, fw2);
        }
        playsound("appear");
      }
      if(RandomBlockData.coin){
			writeCharTo("▫", "#000", fx2, fy2, fz2, fw2);
character.coins += RandomBlockData.coin;
playsound("coin");
setTimeout(function(){
writeCharTo("□", "#000", fx, fy, fz, fw);
},5000)
}
      if (RandomBlockData.location) {
      playsound("enter")
        writeCharTo(" ", 0, x, y, z, w);
        if (Math.abs(character.location[0] - RandomBlockData.location[0]) > 10 || Math.abs(character.location[0] - RandomBlockData.location[1]) > 10 || RandomBlockData.warp) {
          character.center = false;
          if (character.isMain) {
            GoToCoord((RandomBlockData.location[0] / 4) * 1, (RandomBlockData.location[1] / 4) * -1);
            character.destination = [9999, 9999, 0, 0];
            character.location = [9999, 9999, 0, 0];

            setTimeout(function() {
              character.destination = RandomBlockData.location;
              character.location = RandomBlockData.location;
              character.center = true;
              playsound("exit")
            }, 2000);
          }
        } else {
          character.destination = RandomBlockData.location;
          character.location = RandomBlockData.location;
        }
      }
      if (RandomBlockData.warp) {
        if (character.isMain) {
          api_chat_send("/warp " + RandomBlockData.warp);

        }

      }

      if (RandomBlockData.reset) {
        character.reset();

      }
    }
    
  }






  class Character {
    constructor(x, y, z, w, id) {
      this.frame = 0;
      this.invincible = 0;
      this.frameSlowdown = 0;
      this.lastFrameTimestamp = performance.now();
      this.name = "character";
      this.location = [x, y, z, w];
      this.destination = [x, y, z, w];
      this.velocity = [0, 0];
      this.lives = 1;
      this.alive = true;
      this.canFly = false;
      this.isFacingLeft = false;
      this.id = id;
      this.moveUp = false;
      this.moveLeft = false;
      this.moveRight = false;
      this.canFire = false;
      this.flowerPower = false;
      this.squat = false;
      this.jumped = false;
      this.jumpFrames = 3;
      this.onPlatform = false;
      this.isMain = false;
      this.isProjectile = false;
      this.isFeather = false;
      this.isMushroom = false;
      this.imagURL = "";
      this.cellReps = {};
      this.cellRep = [" "];
      this.blockers = blockers;
      this.sprites = {};
      this.tickEveryN = 3;
      this.eraseChar = " ";
      this.canTick = true;
      this.center = true;
      this.isCollectable = false;
      this.canTakeDamage = true;
      this.alwaysTakesDamage = false;
      this.points = 0;
      this.coins = 0;
      this.isOnFire = false;
      this.isBig = false;

      characterList[id] = this;

      // request animation frame and bind this to the tick function
      this.tick = this.tick.bind(this);
      //requestAnimationFrame(this.tick);
    }

    onCreated() {
      console.log(`${this.id} created`);
      if (!this.isMain) {

        setTimeout(function() {
          this.canTakeDamage = true;
        }, 1000)
      }
    }
    givePoints(points) {
      this.points += points;


    }
    reset() {
      this.velocity = [0, 0];
      this.lives = 3;
      this.alive = true;
      this.canFly = false;
      this.canFire = false;
      this.squat = false;
      this.jumped = false;
      this.jumpFrames = 3;
      this.points = 0;
      this.coins = 0;
      this.isOnFire = false;
      this.isBig = false;
    }
    collideWith(obj, loc) {
      const [a, b, c, d] = loc;

      if (this.isMain) {
        if (obj == "mushroom") {
          this.isBig = true;
          playsound("big");
          writeCharTo(" ", "#000", a, b, c, d);
        } else if (obj == "feather") {
          this.canFly = true;
          this.isBig = true;
					playsound("powerup");
          writeCharTo(" ", "#000", a, b, c, d);
        }else if (obj == "flower") {
					playsound("powerup");
          this.flowerPower = true;
          this.isBig = true;
          writeCharTo(" ", "#000", a, b, c, d);
        } else if (obj == "coin") {
          this.coins++;
          this.points += 100;
					playsound("coin");
          writeCharTo(" ", "#000", a, b, c, d);
        } else if (obj == "randomBox") {
          getBlockData(this, loc);
        } else if (obj == "breakableBrick") {
          if (this.isBig) {
          playsound("break");
            writeCharTo("⠛", "#000", a, b, c, d);
            setTimeout(function() {
              if (getChar(a, b, c, d) == "⠛") {
                writeCharTo(" ", "#000", a, b, c, d);
              }
            }, 100)
          }
        }
      }
      if (obj == "fire") {
        this.onFire();
        writeCharTo(" ", "#000", a, b, c, d);
      } else if (obj == "hurt") {
        this.onDamaged();
        writeCharTo(" ", "#000", a, b, c, d);
      } else if (obj == "lava") {
        this.onFire();
        //writeCharTo(" ", "#000", a, b, c, d);
      } else if (obj == "kill") {
        this.die();
      } else if (obj == "pipe") {

        getBlockData(this, loc);
      }
    }
    onDie() {
      console.log(`${this.id} died`);
      const [x, y, z, w] = CorrectLocation(this.location);
      writeCharTo(this.eraseChar, "#000", x, y, z, w);
      if (this.isProjectile) {

      } else if (this.isFeather) {

      } else if (this.isMain) {
        playsound("gameover")
        confirm("you died");
        location.reload();
      }
      delete characterList[this.id];
    }

    onDamaged() {
if(!this.invincible)
      {this.lives--;
      if (this.lives <= 0) {
        this.die();
      }
      if (this.isMain) {
      if(this.canFly || this.isBig){
			playsound("powerdown")
}
        this.canFly = false;
        this.isBig = false;
        
      }}
    }


    onFire() {
      if (!this.invincible && this.canTakeDamage && !this.isProjectile) {
        this.onDamaged();
        this.isOnFire = true;

        this.canTick = false;
        this.canTakeDamage = false;
        setTimeout(() => {
          this.canTick = true;
          this.canTakeDamage = false;
          this.isOnFire = false;
          setTimeout(() => {
            this.canTakeDamage = true;

          }, 2000);
        }, 2000);
      }
    }
    die() {
      if (!this.invincible && this.canTakeDamage) {
        this.alive = false;
        this.lives = 0;
        if (this.isMain) {
          killAllObjects();
        }
        this.onDie();
      }
    }

    setVelocity() {
      // extract the current velocity values from the this.velocity array
      const [vX, vY] = this.velocity;
      const [x, y, z, w] = this.location;
      const cvX = Math.round(Math.max(Math.min(vX, 1), -1));
      const cvY = Math.round(Math.max(Math.min(vY, 1), -1));
      const nearbyCells = getNearbyCells2([x, y, z, w], "");
      // set the maximum allowed speed
      const maxSpeed = 10;

      // if the character is moving left and there is no obstacle to the left
      // and the character is not squatting, decrease the horizontal velocity
      if (this.moveLeft && !this.squat) {
        // calculate the new horizontal velocity value, clamped between -maxSpeed and +maxSpeed
        this.velocity = [Math.max(vX - 1, -maxSpeed), vY];

        // if the character is moving right and there is no obstacle to the right
        // and the character is not squatting, increase the horizontal velocity
      } else if (this.moveRight && !this.squat) {
        // calculate the new horizontal velocity value, clamped between -maxSpeed and +maxSpeed
        this.velocity = [Math.min(vX + 1, maxSpeed), vY];

      }

      // if the character is moving up
      if (this.moveUp && (this.jumpFrames > 0)) {
        this.jumped = true;
        this.jumpFrames--;

        // calculate the new vertical velocity value, clamped between -maxSpeed and +maxSpeed
        this.velocity = [vX, Math.max(vY - 1, -maxSpeed)];

      }
      //handle auto moving objects
      if (this.autoMoveLaterially) {
        this.velocity[0] = this.isFacingLeft ? -1 : 1;
      }
    }
    tryCollect(loc, offset) {
      //this will be the players destination
      const [a, b, c, d] = loc;
      const [ox, oy] = offset;
      const [ua, ub, uc, ud] = CorrectLocation(a, b, c + ox, d + oy);
      //check if the destination contains anything of value
      const isCoin = sm_coin.includes(getChar(ua, ub, uc, ud));
      const isBreakbleBrick = sm_breakable_Brick.includes(getChar(ua, ub, uc, ud));
      const isRandomBox = sm_random.includes(getChar(ua, ub, uc, ud));
      const isPipeUD = sm_tube_UD.includes(getChar(ua, ub, uc, ud));
      const isPipeLR = sm_tube_LR.includes(getChar(ua, ub, uc, ud));
      if (this.isMain) {
        if (isCoin) {
          this.collideWith("coin", loc);
        }
        if (isRandomBox && this.moveUp) {
          this.collideWith("randomBox", [ua, ub, uc, ud]);
        }
        if (isBreakbleBrick && this.moveUp) {
          this.collideWith("breakableBrick", [ua, ub, uc, ud]);
        }
        if (isPipeUD && (this.moveUp || this.squat)) {
          this.collideWith("pipe", [ua, ub, uc, ud]);
        }

      }


      if (isPipeLR && (this.moveLeft || this.moveRight || this.autoMoveLaterially)) {
        this.collideWith("pipe", [ua, ub, uc, ud]);
      }
    }
    collisionDetection(drawDebug = false) {
      const [x, y, z, w] = this.location;
      var [vX, vY] = this.velocity;

      const cvX = Math.round(Math.max(Math.min(vX, 1), -1));
      const cvY = Math.round(Math.max(Math.min(vY, 1), -1));

      const nearbyCells = getNearbyCells2([x, y, z, w], "");

      // Check if something hurts around the player.
      const hurtsRight = sm_hurts.includes(nearbyCells.rightChar[0][1]);
      const hurtsLeft = sm_hurts.includes(nearbyCells.leftChar[0][1]);
      const hurtsTop = sm_hurts.includes(nearbyCells.topChar[0][1]);
      const hurtsBottom = sm_hurts.includes(nearbyCells.bottomChar[0][1]);


      const hurtsRightFire = sm_hurts_fire.includes(nearbyCells.rightChar[0][1]);
      const hurtsLeftFire = sm_hurts_fire.includes(nearbyCells.leftChar[0][1]);
      const hurtsTopFire = sm_hurts_fire.includes(nearbyCells.topChar[0][1]);
      const hurtsLava = sm_lava.includes(nearbyCells.bottomChar[0][1]);


      // Determine the direction of movement
      const directions = {
        "right-up": cvX > 0 && cvY < 0,
        "right": cvX > 0 && cvY === 0,
        "right-down": cvX > 0 && cvY > 0,
        "left-up": cvX < 0 && cvY < 0,
        "left": cvX < 0 && cvY === 0,
        "left-down": cvX < 0 && cvY > 0,
        "down": cvX === 0 && cvY > 0,
        "up": cvX === 0 && cvY < 0
      };

      const blockedDirections = {
        "right-up": detect(this, " ", nearbyCells.rightTopChar, sm_backGround + sm_jumpThrough, drawDebug),
        "right": detect(this, " ", nearbyCells.rightChar, sm_backGround, drawDebug),
        "right-down": detect(this, " ", nearbyCells.RightBottomChar, sm_backGround, drawDebug),
        "left-up": detect(this, " ", nearbyCells.leftTopChar, sm_backGround + sm_jumpThrough, drawDebug),
        "left": detect(this, " ", nearbyCells.leftChar, sm_backGround, drawDebug),
        "left-down": detect(this, " ", nearbyCells.LeftBottomChar, sm_backGround, drawDebug),
        "down": detect(this, " ", nearbyCells.bottomChar, sm_backGround, drawDebug),
        "up": detect(this, " ", nearbyCells.topChar, sm_backGround + sm_jumpThrough, drawDebug)
      }

      if (directions.left || directions["left-up"] || directions["left-down"] || this.moveLeft) {
        this.isFacingLeft = true;
      } else if (directions.right || directions["right-up"] || directions["right-down"]) {
        this.isFacingLeft = false;
      }
      if (directions.left || directions.right) {
        this.cellRep = this.cellReps.run[this.isFacingLeft ? 'left' : 'right'];

      }
      if (directions.up || directions["right-up"] || directions["left-up"]) {
        this.cellRep = this.cellReps.jump[this.isFacingLeft ? 'left' : 'right'];
      }

      if (directions.down || directions["right-down"] || directions["left-down"]) {
        this.cellRep = this.cellReps.fall[this.isFacingLeft ? 'left' : 'right'];
      }



      for (const [dir, dirVal] of Object.entries(directions)) {
        if (dirVal && blockedDirections[dir]) {
          // direction is blocked
          if (dir == "right-up") {
            if (blockedDirections.up == false) {
              vX = 0;
            } else if (blockedDirections.right == false) {
              vY = 0;
            } else {
              vX = 0;
              vY = 0;
            }
          } else if (dir == "left-up") {
            if (blockedDirections.up == false) {
              vX = 0;
            } else if (blockedDirections.left == false) {
              vY = 0;
            } else {
              vX = 0;
              vY = 0;
            }
          } else if (dir == "left-down") {
            if (blockedDirections.down == false) {
              vX = 0;
            } else if (blockedDirections.left == false) {
              vY = 0;
            } else {
              vX = 0;
              vY = 0;
            }
          } else if (dir == "right-down") {
            if (blockedDirections.down == false) {
              vX = 0;
            } else if (blockedDirections.right == false) {
              vY = 0;
            } else {
              vX = 0;
              vY = 0;
            }
          } else if (dir == "right" || dir == "left") {
            vX = 0;
          } else if (dir == "up" || dir == "down") {
            vY = 0;
          } else {
            // direction is open

          }

        }
      }

      this.velocity = [vX, vY];
      //handle auto moving objects
      if (this.autoMoveLaterially) {
        if (blockedDirections.right && !this.isFacingLeft) {
          this.isFacingLeft = true;
        } else if (blockedDirections.left && this.isFacingLeft) {
          this.isFacingLeft = false;
        }
      }
      if (vX == 0 && vY == 0 && !this.jumped && !this.squat) {
        this.cellRep = this.cellReps.stand[this.isFacingLeft ? 'left' : 'right'];

        if (blockedDirections.down) {
          this.jumpFrames = this.squat && this.isBig ? 10 : 3;
        }
      } else if (!this.jumped) {
        if (blockedDirections.down) {
          this.jumpFrames = this.squat && this.isBig ? 10 : 3;
        }
      }
      if(this.squat){
  this.cellRep = this.cellReps.squat[this.isFacingLeft ? 'left' : 'right'];
}

      if (hurtsLava) {
        this.collideWith("lava", nearbyCells.bottomChar[1]);
      }

      if (!this.isMain) {
        this.onDamaged();
      }
      return (vX == 0 && vY == 0);
    }
    //do the actual movement based on velocity
    move() {
      const [x, y, z, w] = this.location;
      this.collisionDetection();
      var [vX, vY] = this.velocity;
      var cvX = Math.round(Math.max(Math.min(vX, 1), -1));
      var cvY = Math.round(Math.max(Math.min(vY, 1), -1));




      //run collision detection per loop. this.collisionDetection();
      [vX, vY] = this.velocity;
      cvX = Math.round(Math.max(Math.min(vX, 1), -1));
      cvY = Math.round(Math.max(Math.min(vY, 1), -1));
      this.destination = CorrectLocation([x, y, z + cvX, w + cvY]);

      if (this.moveUp || this.jumped && cvY == 0) {
        //since we dont pass through some of the blocks that we collect such as pipes and random blocks, we must offset the location the we are trying to collect by 1
        this.tryCollect(this.destination, [0, -1]);
      } else if (this.moveLeft && cvX == 0 || this.autoMoveLaterially && this.isFacingLeft) {

        this.tryCollect(this.destination, [-1, 0]);
      } else if (this.moveRight && cvX == 0 || this.autoMoveLaterially && !this.isFacingLeft) {

        this.tryCollect(this.destination, [1, 0]);
      } else {

        this.tryCollect(this.destination, [0, 0]);
      }

      if (!this.isMain) {
        this.canTakeDamage = true;
      }

    }


    setUI() {
      if (this.isMain) {
        document.getElementById("lives").innerHTML = this.lives;
        document.getElementById("points").innerHTML = this.points;
        document.getElementById("coins").innerHTML = this.coins;
      }
    }
    setReps() {
      if (this.isMain) {

        if (this.canFly) {

          this.cellReps = marioFlyCellReps;
        } else if (this.isBig) {

          this.cellReps = marioCellReps;
        } else {

          this.cellReps = marioSmallCellReps;
        }

      }

    }
    slowDown() {
      const [x, y, z, w] = this.location;
      let [vX, vY] = this.velocity;

      vX = easeInLerp(vX, 0, 1);
      if (this.autoMoveLaterally) {
        this.velocity[0] = this.isFacingLeft ? -1 : 1;
      } else {
        this.velocity[0] = vX;
      }

      vY = easeInLerp(vY, 1, 0.6);

      if (DoesCellContainChars([x, y, z, w + 1], this.blockers)[0] && !DoesCellContainChars([x, y, z, w + 1], sm_backGround)[0]) {
        this.velocity[1] = 0;
        this.jumped = false;
      } else {
        this.velocity[1] = vY;
      }
    }
    draw() {
      if (this.alive) {

        const [x, y, z, w] = this.location;
        var [vX, vY] = this.velocity;

        const cvX = Math.round(Math.max(Math.min(vX, 1), -1));
        const cvY = Math.round(Math.max(Math.min(vY, 1), -1));

        const nearbyCells = getNearbyCells2([x, y, z, w], "");

        const [a, b, c, d] = CorrectLocation(this.location);
        const [dx, dy, dz, dw] = CorrectLocation(this.destination);
        const destinationChar = getChar(dx, dy, dz, dw);



        if (this.isOnFire) {
          this.cellRep = this.cellReps.burned[this.isFacingLeft ? 'left' : 'right'];
        }


        // draw the character here
        writeCharTo(this.eraseChar, "#000", a, b, c, d);
        this.eraseChar = (!DoesCellContainChars([dx, dy, dz, dw], passthrough_erase)[0]) ? getChar(dx, dy, dz, dw) : " ";
        this.location = [dx, dy, dz, dw];

        writeCharTo(CycleImage(this.cellRep), "#000", dx, dy, dz, dw);



      }
    }

    async tick() {
      if (this.alive && this.canTick) {
        this.frameSlowdown++;
        if (this.frameSlowdown == this.tickEveryN) {
          this.setReps();
          this.setVelocity();

          this.move();
          this.slowDown();
          this.draw();
          this.setUI();
          this.frameSlowdown = 0

        }
        if (this.isMain && !this.isProjectile) {
          if (this.center) {
            centerPlayer(this.location);
          }
        }
      }


    }





  }

  class Player extends Character {
    constructor(x, y, z, w, name) {
      super(x, y, z, w, name + "_" + Object.keys(characterList).length);
      this.name = name;
      this.lives = 3;
      this.id = name + "_" + (Object.keys(characterList).length - 1);
      this.big = false;
      this.isMain = true;
      this.canFire = false;
      this.cellReps = marioSmallCellReps;
      this.onCreated();
    }
  }

  class Fireball extends Character {
    constructor(x, y, z, w) {
      super(x, y, z, w, name + "_" + Object.keys(characterList).length);
      this.name = "fireball";
      this.lives = 30;
      this.id = this.name + "_" + (Object.keys(characterList).length - 1);
      this.isMain = false;
      this.cellReps = fireballCellReps;
      this.autoMoveLaterially = true;
      this.alwaysTakesDamage = true;
      this.canTakeDamage = false;
      this.isProjectile = true;
      this.tickEveryN = 4;
      this.points = 0;
      this.onCreated();
    }
  }
  class Feather extends Character {
    constructor(x, y, z, w) {
      super(x, y, z, w, name + "_" + Object.keys(characterList).length);
      this.name = "feather";
      this.lives = 20;
      this.id = this.name + "_" + (Object.keys(characterList).length - 1);
      this.isMain = false;
      this.onCreated();
      this.isProjectile = false;
      this.isFeather = true;
      this.isCollectable = true;
      this.cellReps = featherCellReps;
      this.tickEveryN = 20;
      this.velocity = [0, -2];
    }
  }

  class Mushroom extends Character {
    constructor(x, y, z, w) {
      super(x, y, z, w, name + "_" + Object.keys(characterList).length);
      this.name = "mushroom";
      this.lives = 50;
      this.id = this.name + "_" + (Object.keys(characterList).length - 1);
      this.isMain = false;
      this.onCreated();
      this.isProjectile = false;
      this.isFeather = false;
      this.isMushroom = true;
      this.isCollectable = true;
      this.cellReps = MushroomCellReps;
      this.alwaysTakesDamage = true;
      this.autoMoveLaterially = true;
      this.tickEveryN = 20;
      this.velocity = [1, 0];
    }
  }
  class DeathShroom extends Mushroom {
    constructor(x, y, z, w) {
      super(x, y, z, w, name + "_" + Object.keys(characterList).length);
      this.name = "deathShroom";
      this.cellReps = DeathShroomCellReps;
    }
  }
  var hitTimeout = setTimeout(AllowHits, 1000);

  function tempInvincible() {
    GetPlayer().canTakeDamage = false;
    clearTimeout(hitTimeout);
    hitTimeout = setTimeout(AllowHits, 1000);
  }

  function AllowHits() {
    GetPlayer().canTakeDamage = true;
    clearTimeout(hitTimeout);
  }

  //--------------------------------------------END OF CREATE CLASSES ----------------------------------------------------------------------

  //--------------------------------------------START OF CREATE LISTENERS ----------------------------------------------------------------------
  document.addEventListener("keydown", (event) => {
    player = GetPlayer();
    const isJumpKey = event.key === "w";
    const isLeftKey = event.key === "a";
    const isDownKey = event.key === "s";
    const isRightKey = event.key === "d";
    const isPauseKey = event.key === "p";
    const isSpaceKey = event.key === " ";

    if (isJumpKey) {
      if (!player.jumped) {
        player.moveUp = true;
        player.jumped = true;

      }
    } else if (isLeftKey) {
      player.moveLeft = true;
    } else if (isDownKey) {
      player.squat = true;
    } else if (isRightKey) {
      player.moveRight = true;
    }

    if (isSpaceKey) {

      const isFacingLeft = player.isFacingLeft;
      const [a, b, c, d] = player.location;

      if (player.canFire) {
        if (countObjectsByClass(characterList, "Fireball") < 3) {
          deleteObjectsByClass(characterList, "Fireball")

          const [a2, b2, c2, d2] = [a, b, isFacingLeft ? c - 1 : c + 1, d]
          if (DoesCellContainChars([a2, b2, c2, d2], sm_jumpThrough + " " + sm_backGround)[0]) {

            const fireBallEraseChar = getChar(CorrectLocation(a2, b2, c2, d2))

if (player.flowerPower)
{            const fireBall = new Fireball(a2, b2, c2, d2);
playsound("fireball");
            fireBall.eraseChar = fireBallEraseChar;

            fireBall.isFacingLeft = isFacingLeft;
            tempInvincible();}
          }



        } else {
          player.canFire = false;
          deleteObjectsByClass(characterList, "Fireball")
          if (countObjectsByClass(characterList, "Fireball") == 0) {
            player.canFire = true;
          }

        }

      }



    }
if(isPauseKey){
playsound("pause")
paused = !paused;
if(!paused && !muteCB.checked){

playsound("music")
setMute(false);
}
if(paused){
setMute(true);
}
const pauseOverly = document.getElementById("paused-overlay")
if(pauseOverly.classList[0] == "show") {
pauseOverly.classList.remove("show")
pauseOverly.classList.add("hide");
}
else{
pauseOverly.classList.remove("hide")
pauseOverly.classList.add("show");
}

}
  });

  document.addEventListener("keyup", (event) => {
    const player = GetPlayer();
    const isJumpKey = event.key === "w";
    const isLeftKey = event.key === "a";
    const isDownKey = event.key === "s";
    const isRightKey = event.key === "d";
  
    if (isJumpKey) {
      player.moveUp = false;
      if (player.canFly) {
        player.jumped = false;
        player.jumpFrames = 3;
      }
    } else if (isLeftKey) {
      player.moveLeft = false;
    } else if (isDownKey) {
      player.squat = false;
    } else if (isRightKey) {
      player.moveRight = false;
    }
  });


  //--------------------------------------------END OF CREATE LISTENERS ----------------------------------------------------------------------



  function makePlayer() {
    const playerStarts = FindCharsInViewport("[^⛹]", true, true);

    playerStarts.forEach((start) => {
      if (!player) {
        const [a, b, c, d] = start;
        const charInfo = getCharInfo(a, b, c, d);

        if (charInfo.protection === 2) {
          const startLocation = getJSONFromCell(a, b, c, d).start || [0, 0, 1, 1];
          localWriteChar(a, b, c, d, " ", "#fff");
          const [x, y, z, w] = startLocation;
          player = new Player(x, y, z, w, "luigi", marioCellReps);
        }
      }
    });
  }

  player = new Player(0, 0, 0, 0, "luigi", marioCellReps);
  tickAllObjects(characterList);

  setInterval(() => {
if(!paused){
    globalTickIterator++;}

  }, 100);

  setInterval(() => {
if(!paused)
{    renderTiles(true);}
updateCBValues();

  }, 1000);
  //----------------------------------------------------------CellVisual Library

  //just to show grid
  renderTiles(true);
  setTimeout(function(){paused = true;},101)

}
